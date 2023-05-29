import React, { FC } from 'react';

import { Input } from '@ccomponents/index';

import styles from './index.module.scss';

interface Props {
    headerTitle?: string;
    defaultValue?: string | number;
    placeholder?: string;
    autoFocus?: boolean;

    onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputHeader: FC<Props> = ({ headerTitle, defaultValue, placeholder, autoFocus, onBlur, onFocus, onChange }) => {
    return (
        <div className={styles.table__header}>
            <div className={styles.table__header_title}>{headerTitle}</div>
            <div className={styles.table__header_action}>
                <Input
                    size="m"
                    view="default"
                    type="text"
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    autoFocus={autoFocus}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export { InputHeader };
