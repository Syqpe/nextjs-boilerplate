import { Request } from 'express';
import NextApp, { AppProps } from 'next/app';
import React from 'react';

import { setI18nLang } from '@yandex-int/i18n';
import { State } from '@cshared/types/blackbox';

import { DefaultLayout, MainLayout } from '@client/app/layouts';

import '@client/app/styles/index.scss';
import '@client/app/scripts/index';

interface OwnProps {
    dataInternal: State;
}

type Props = AppProps & OwnProps;

class App extends NextApp<Props> {
    public constructor(props: Props) {
        super(props);

        setI18nLang(props.dataInternal.lang);
    }

    public render() {
        const { Component, pageProps } = this.props;

        return (
            <DefaultLayout>
                    <MainLayout>
                        <Component {...pageProps} />
                    </MainLayout>
            </DefaultLayout>
        );
    }
}

App.getInitialProps = async ({ Component, ctx }) => {
    let dataInternal = {};

    if (ctx.req) {
        const {  cookies, langdetect, lang, tld } = ctx.req as Request;
        dataInternal = {
            cookies,
            langdetect,
            lang,
            tld,
        };
    }
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { dataInternal, pageProps };
};

export default App;
