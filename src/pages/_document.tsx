import Document, { Head, Html, Main, NextScript, DocumentContext } from 'next/document';
import React from 'react';

interface Props {
    lang?: string;
    secretkey?: string;
}

class DocumentPresenter extends Document<Props> {
    public static async getInitialProps(ctx: DocumentContext) {
        const { lang, secretkey } = ctx.req || {};
        const documentProps = await Document.getInitialProps(ctx);

        return { ...documentProps, lang, secretkey };
    }

    public render() {
        const { lang, secretkey = '' } = this.props;

        return (
            <Html lang={lang}>
                <Head>
                    <meta name="secretkey" content={secretkey} />
                    <link rel="shortcut icon" href={'./assets/favicon.ico'} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default DocumentPresenter;
