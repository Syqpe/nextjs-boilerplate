import React, { useContext, FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppSelector } from '@client/shared/hooks/store-hooks';
import { selectUser } from '@client/app/store/reducers/userSlice';

import { Text, LinkLego } from '@ccomponents/index';

import { ThemeContext, ThemeInterface, themeEnums } from '@client/app/context/theme';
import { AccessType, hasAccess } from '@cshared/utils/hasAccess';

import { AccessEnums } from '@cshared/types/yasms';
import styles from './index.module.scss';

const Navbar: FC = ({}) => {
    const { themeType } = useContext<ThemeInterface>(ThemeContext);
    const isDarkTheme = themeType !== themeEnums.light;
    const { route } = useRouter();

    const userData = useAppSelector(selectUser);

    const configSubItems = [
        {
            className: `${styles.nav__subitem} ${route === '/' && styles.nav__subitem_active}`,
            href: '/',
            text: (
                <>
                    Routes
                    <sup>
                        {hasAccess(userData, AccessEnums.routes, AccessType.READ) && 'R'}
                        {hasAccess(userData, AccessEnums.routes, AccessType.WRITE) && 'W'}
                    </sup>
                </>
            ),
        },
        {
            className: `${styles.nav__subitem} ${route === '/config/gates' && styles.nav__subitem_active}`,
            href: '/config/gates',
            text: (
                <>
                    Gates
                    <sup>
                        {hasAccess(userData, AccessEnums.gates, AccessType.READ) && 'R'}
                        {hasAccess(userData, AccessEnums.gates, AccessType.WRITE) && 'W'}
                    </sup>
                </>
            ),
        },
        {
            className: `${styles.nav__subitem} ${route === '/config/fallbacks' && styles.nav__subitem_active}`,
            href: '/config/fallbacks',
            text: (
                <>
                    Fallbacks
                    <sup>
                        {hasAccess(userData, AccessEnums.fallbacks, AccessType.READ) && 'R'}
                        {hasAccess(userData, AccessEnums.fallbacks, AccessType.WRITE) && 'W'}
                    </sup>
                </>
            ),
        },
        {
            className: `${styles.nav__subitem} ${route === '/config/blockedphones' && styles.nav__subitem_active}`,
            href: '/config/blockedphones',
            text: (
                <>
                    Blocked phones
                    <sup>
                        {hasAccess(userData, AccessEnums.blockedphones, AccessType.READ) && 'R'}
                        {hasAccess(userData, AccessEnums.blockedphones, AccessType.WRITE) && 'W'}
                    </sup>
                </>
            ),
        },
        {
            className: `${styles.nav__subitem} ${route === '/config/regions' && styles.nav__subitem_active}`,
            href: '/config/regions',
            text: (
                <>
                    Regions
                    <sup>
                        {hasAccess(userData, AccessEnums.regions, AccessType.READ) && 'R'}
                        {hasAccess(userData, AccessEnums.regions, AccessType.WRITE) && 'W'}
                    </sup>
                </>
            ),
        },
        {
            className: `${styles.nav__subitem} ${route === '/config/templates' && styles.nav__subitem_active}`,
            href: '/config/templates',
            text: (
                <>
                    Templates
                    <sup>
                        {hasAccess(userData, AccessEnums.regions, AccessType.READ) && 'R'}
                        {hasAccess(userData, AccessEnums.regions, AccessType.WRITE) && 'W'}
                    </sup>
                </>
            ),
        },
    ];
    const navItems = [
        {
            className: `${styles.nav__navitem} ${
                (route === '/' || configSubItems.find(configSubItem => configSubItem.href === route)) &&
                styles.nav__navitem_active
            }`,
            href: '/',
            text: 'Config',
            subItems: configSubItems,
        },
        {
            className: `${styles.nav__navitem} ${route === '/contracts' && styles.nav__navitem_active}`,
            href: '/contracts',
            text: 'Contracts',
        },
        {
            className: `${styles.nav__navitem} ${route === '/analytics' && styles.nav__navitem_active}`,
            href: '/analytics',
            text: 'Analytics',
        },
        {
            className: `${styles.nav__navitem} ${route === '/contacts' && styles.nav__navitem_active}`,
            href: '/contacts',
            text: 'Contacts',
        },
    ];

    return (
        <nav className={styles.nav}>
            <div className={`${styles.nav__inner} ${isDarkTheme ? styles['header__theme-dark'] : ''}`}>
                <div className={styles.nav__content}>
                    {navItems.map((navItem, index) => (
                        <div className={styles.nav__navitemwrap} key={index}>
                            <div className={navItem.className}>
                                <Link href={navItem.href}>
                                    <LinkLego>
                                        <Text typography="control-l" weight="medium">
                                            {navItem.text}
                                        </Text>
                                    </LinkLego>
                                </Link>
                            </div>
                            {navItem.subItems?.length && (
                                <div className={styles.nav__subitems}>
                                    {navItem.subItems?.map((navItem, index) => (
                                        <div className={navItem.className} key={index}>
                                            <Link href={navItem.href}>
                                                <LinkLego>
                                                    <Text typography="control-l" weight="medium">
                                                        {navItem.text}
                                                    </Text>
                                                </LinkLego>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export { Navbar };
