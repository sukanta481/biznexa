// Every admin route renders per request. These pages sit behind auth and read
// live data, so prerendering them is wrong on two counts: the build would bake
// in a stale snapshot, and it would need database access at build time — which
// fails the deploy whenever the database is unreachable or a migration has not
// been applied yet.
export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
