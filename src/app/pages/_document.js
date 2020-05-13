import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)

        const sheet = new ServerStyleSheet()
        const page = ctx.renderPage(App => props => sheet.collectStyles(<App {...props} />))
        const styleTags = sheet.getStyleElement()

        return { ...initialProps, ...page, styleTags }
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta name="theme-color" content="#000" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                    {this.props.styleTags}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
