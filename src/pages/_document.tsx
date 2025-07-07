import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>FishPond</title>
      <meta name="description" content="Find and post freelance or contract jobs easily with FishPond." />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
