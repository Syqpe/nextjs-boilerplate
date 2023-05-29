import React, { useState, useEffect, useCallback, FC, CSSProperties } from 'react';

import { Button, Icon } from '@ccomponents/index';

import styles from './index.module.scss';

interface Props {
    className?: string;
    style?: CSSProperties;
    value?: object | null;
    replacer?: any;
    space?: number;
}

const DisplayObj: FC<Props> = ({ className, style, value, replacer = null, space = 2 }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsOpen(Boolean(value));
    }, [value]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    return isOpen ? (
        <div className={`${styles.DisplayObj} ${className}`} style={style}>
            <div className={styles.DisplayObj__inner}>
                <div className={styles.DisplayObj__close}>
                    <Button onClick={handleClose}>
                        <Icon glyph={'type-cross-websearch'} />
                    </Button>
                </div>

                <pre className={styles.DisplayObj__pre}>
                    <code>{JSON.stringify(value, replacer, space)}</code>
                </pre>
            </div>
        </div>
    ) : null;
};

export { DisplayObj };
