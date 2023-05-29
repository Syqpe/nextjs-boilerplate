import React, { useContext, FC } from 'react';
import { ThemeContext, ThemeInterface, themeEnums } from '@client/app/context/theme';

import { Header as HeaderLego } from '@yandex-lego/components/Header/desktop';
import { User, IconCustom, Tumbler } from '@ccomponents/index';
import { Logo } from '../logo';

import styles from './index.module.scss';

const Header: FC = ({}) => {
    const { themeType, setThemeType } = useContext<ThemeInterface>(ThemeContext);
    const isDarkTheme = themeType !== themeEnums.light;

    return (
        <header className={styles.header}>
            <div className={`${styles.header__inner} ${isDarkTheme ? styles['header__theme-dark'] : ''}`}>
                <HeaderLego
                    logo={<Logo href={'/'} mode={isDarkTheme ? 'dark' : 'light'} />}
                    actions={
                        <>
                            <div className={styles.header__tumbler}>
                                <Tumbler
                                    size="m"
                                    view="default"
                                    checked={isDarkTheme}
                                    onChange={() => setThemeType(isDarkTheme ? themeEnums.light : themeEnums.dark)}
                                    labelBefore={<IconCustom type="day" />}
                                    labelAfter={<IconCustom type="night" />}
                                />
                            </div>
                            <div className={styles.header__user}>
                                <User />
                            </div>
                        </>
                    }
                />
            </div>
        </header>
    );
};

export { Header };
