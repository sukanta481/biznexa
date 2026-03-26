const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'admin_raw_html');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const files = {
    'main-dashboard.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2RhZmY4M2YzNTE1OTQ0ZTM5NTZlYWJlZWZmZDJmMjRkEgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'login.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2NlODcxZjJkMDY4ZDRlYTQ4OTYzMzdhNjk3MWVmNGJmEgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'leads.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2RlNzUwODg2NzlmODRhZGZhNjJiNjEyMGUxM2YzN2JiEgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'clients.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzBkY2NiZDE2ZDYxZTRlMzZiOGU4NjAwZGI4YjBiYzE4EgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'inspection-dashboard.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzE4OWU0NmVjZWEyOTRmYjZhYjBhODRjODUwMjc3MDBmEgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'inspection-files.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzZkZTQyYTBkYjI0MjRmMzNhNjQ2ZTRkNTAyZDZmOTFmEgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'bills.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2I5ZGJhYmI1MTA3YTQ1YmE5MzMxNTMzMTQ3YjFiNDNlEgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'expenses.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2M5ODk5ZmRiM2MzNDQ1NzliODVkMmFmNmIyMGQ4MTFkEgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'blog.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzRkYjM1NDlkZmI1NzRiNjg4OTU4ZjcxYjM3MWU0ZmJmEgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'audit.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzY4MjAzMmZkZDljMzQwZDY4ZDhkNjMyYzJmNGU5OGNmEgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'profile.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzU4MWUxYmVkNmNlMDRlZWQ4MzRlN2I1MjA3Yzk5N2NlEgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086',
    'settings.html': 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzc3NzEwY2ViOWU3YTQ5NzQ5ZGQ2YTM5NmRmMTkxMjM3EgsSBxCkxcbjgBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjAxMzE3NDMwOTczMzcwODU0NQ&filename=&opi=89354086'
};

const downloadFile = (filename, url) => {
    return new Promise((resolve, reject) => {
        const fileObj = fs.createWriteStream(path.join(dir, filename));
        https.get(url, (response) => {
            response.pipe(fileObj);
            fileObj.on('finish', () => {
                fileObj.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(path.join(dir, filename));
            console.error(`Error downloading ${filename}: ${err.message}`);
            reject(err);
        });
    });
};

const downloadAll = async () => {
    const promises = [];
    for (const [filename, url] of Object.entries(files)) {
        promises.push(downloadFile(filename, url));
    }
    await Promise.all(promises);
    console.log("All files downloaded");
};

downloadAll();
