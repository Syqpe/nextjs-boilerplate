import React, { useContext, FC } from 'react';
import { ThemeContext, ThemeInterface, themeEnums } from '@client/app/context/theme';

import { Logo } from '../logo';

import styles from './index.module.scss';

const Footer: FC = ({}) => {
    const { themeType } = useContext<ThemeInterface>(ThemeContext);
    const isDarkTheme = themeType !== themeEnums.light;

    return (
        <footer className={`${styles.footer} ${isDarkTheme ? styles['footer__theme-dark'] : ''}`}>
            <div className={styles.footer__inner}>
                <Logo href={'/'} mode={isDarkTheme ? 'dark' : 'light'} />
            </div>
        </footer>
    );
};

export { Footer };
