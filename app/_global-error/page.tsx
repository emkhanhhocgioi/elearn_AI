export const dynamic = "force-dynamic";

export default function GlobalError() {
  return (
    <html>
      <body style={{ padding: 40 }}>
        <h1>Something went wrong</h1>
        <p>Unexpected error occurred. Please refresh the page.</p>
      </body>
    </html>
  );
}
