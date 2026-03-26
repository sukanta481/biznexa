const fs = require("fs");
const path = require("path");

const matter = require("gray-matter");
const mysql = require("mysql2/promise");

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const values = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    values[key] = value;
  }

  return values;
}

function getDatabaseConfig() {
  const envPath = path.join(process.cwd(), ".env.local");
  const env = { ...readEnvFile(envPath), ...process.env };
  const target = env.DB_TARGET === "live" ? "LIVE" : "LOCAL";

  return {
    host: env[`DB_${target}_HOST`],
    port: Number(env[`DB_${target}_PORT`] || "3306"),
    user: env[`DB_${target}_USER`],
    password: env[`DB_${target}_PASSWORD`] || "",
    database: env[`DB_${target}_NAME`],
  };
}

function getSeedPosts() {
  const blogDir = path.join(process.cwd(), "content", "blog");
  const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".mdx"));

  return files.map((fileName) => {
    const slug = fileName.replace(".mdx", "");
    const filePath = path.join(blogDir, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      title: data.title || slug,
      slug,
      excerpt: data.description || "",
      content,
      featured_image: null,
      category: data.category || "Technology",
      tags: null,
      author_id: null,
      views: 0,
      status: data.published === false ? "draft" : "published",
      published_at: data.date || null,
    };
  });
}

async function seed() {
  const db = await mysql.createConnection(getDatabaseConfig());
  const posts = getSeedPosts();

  for (const post of posts) {
    await db.query(
      `
        INSERT INTO blog_posts (
          title, slug, excerpt, content, featured_image, category, tags, author_id, views, status, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          excerpt = VALUES(excerpt),
          content = VALUES(content),
          featured_image = VALUES(featured_image),
          category = VALUES(category),
          tags = VALUES(tags),
          author_id = VALUES(author_id),
          status = VALUES(status),
          published_at = VALUES(published_at)
      `,
      [
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.featured_image,
        post.category,
        post.tags,
        post.author_id,
        post.views,
        post.status,
        post.published_at,
      ],
    );
  }

  const [rows] = await db.query("SELECT id, slug, title, status FROM blog_posts ORDER BY COALESCE(published_at, created_at) DESC");
  console.log(JSON.stringify(rows, null, 2));

  await db.end();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
