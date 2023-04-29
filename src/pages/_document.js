import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Script src="https://kit.fontawesome.com/b4c877daa2.js" crossorigin="anonymous"/>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
