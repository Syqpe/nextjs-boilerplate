import React, { useMemo, useContext, FC, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@client/shared/hooks/store-hooks';
import { selectUser } from '@client/app/store/reducers/userSlice';
import { ThemeContext, ThemeInterface, themeEnums } from '@client/app/context/theme';

import { Header, Footer, ModalsRenderer, ToastsRenderer, Navbar, NotAccess } from '@client/widgets';
import { Spin } from '@ccomponents/index';
import { existRoutes } from 'src/shared/urls/server';

import { AccessType, hasAccess } from '@cshared/utils/hasAccess';
import { AccessEnums } from '@cshared/types/yasms';

import styles from './index.module.scss';

interface Props {
    children: ReactNode;
}

const MainLayout: FC<Props> = ({ children }) => {
    const { route } = useRouter();
    const userData = useAppSelector(selectUser);

    const { themeType, loaded } = useContext<ThemeInterface>(ThemeContext);
    const isDarkTheme = themeType !== themeEnums.light;

    const currentAccessEnums = useMemo(
        (): AccessEnums | undefined =>
            Object.keys(AccessEnums).find(routeKey => existRoutes[routeKey] === route) as AccessEnums,
        [route],
    );

    if (!loaded) {
        return (
            <div className={styles['MainLayout__load-page']}>
                <Spin progress position="center" view="default" size="l" />
            </div>
        );
    }

    const canShow = currentAccessEnums ? hasAccess(userData, currentAccessEnums, AccessType.READ) : true;

    return (
        <div className={`${styles.MainLayout} ${(isDarkTheme ? "themeDark" : "themeLight")}`}>
            <div className={`${styles.MainLayout__inner} ${isDarkTheme ? styles['MainLayout__theme-dark'] : ''}`}>
                <Header />
                <ModalsRenderer />
                <ToastsRenderer />
                <div className={styles.MainLayout__content}>
                    <Navbar />
                    <main>{canShow ? children : <NotAccess />}</main>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export { MainLayout };
