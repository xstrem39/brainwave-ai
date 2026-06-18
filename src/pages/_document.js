import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="BrainWave AI — AI-powered academic assistant for students, teachers, lecturers, and researchers." />
        <meta name="keywords" content="AI, education, academic assistant, Ghana, students, teachers, research, exam prep" />
        <meta name="author" content="TJ VITAL SOURCE TECH" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="BrainWave AI — Powering Academic Excellence" />
        <meta property="og:description" content="AI-powered educational platform for students, teachers, and researchers." />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body className="bg-dark-900 text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
