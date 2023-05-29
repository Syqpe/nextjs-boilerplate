import React, { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@client/app/context/theme';
import { store } from '@client/app/store';

interface Props {
    children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
    return (
        <Provider store={store}>
            <ThemeProvider>{children}</ThemeProvider>
        </Provider>
    );
};

export { DefaultLayout };
