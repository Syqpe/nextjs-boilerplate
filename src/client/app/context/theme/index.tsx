import React, { useState, useEffect, createContext, FC, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

enum themeEnums {
    'light' = 'light',
    'dark' = 'dark',
}

interface ThemeInterface {
    themeType: themeEnums;
    setThemeType: (theme: themeEnums) => void;
    loaded: boolean;
}

const ThemeContext = createContext<ThemeInterface>({
    themeType: themeEnums.light,
    setThemeType: () => {},
    loaded: false,
});

const ThemeProvider: FC<Props> = ({ children }) => {
    useEffect(() => {
        setThemeType(getThemeType());
        setIsLoaded(true);
    }, []);

    const setThemeType = (theme: themeEnums) => {
        localStorage.setItem('themeType', theme);
        setThemeTypeToState(theme);
    };

    const getThemeType = (): themeEnums => {
        if (localStorage.getItem('themeType')) {
            return themeEnums[localStorage.getItem('themeType') as themeEnums];
        }
        return themeEnums.light;
    };

    const [themeType, setThemeTypeToState] = useState<themeEnums>(themeEnums.light);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    return (
        <ThemeContext.Provider value={{ themeType, setThemeType, loaded: isLoaded }}>{children}</ThemeContext.Provider>
    );
};

export type { ThemeInterface };
export { ThemeProvider, ThemeContext, themeEnums };
