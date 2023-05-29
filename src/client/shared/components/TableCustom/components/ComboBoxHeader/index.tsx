import React, { FC } from 'react';

import { ComboBox } from '@ccomponents/index';
import { IItem } from '@client/shared/components/ComboBox/ComboBox';

import styles from './index.module.scss';

interface Props {
    style?: React.CSSProperties;
    headerTitle?: string;
    defaultValue: IItem;
    value?: string;
    options?: Array<IItem>;
    placeholder?: string;

    onBlur?: (event: React.FocusEvent<HTMLSelectElement, Element>) => void;
    onFocus?: (event: React.FocusEvent<HTMLSelectElement, Element>) => void;
    onChange: (item: IItem) => void;
}

const ComboBoxHeader: FC<Props> = ({ headerTitle, options = [], onChange, ...restProps }) => {
    return (
        <div className={styles.table__header}>
            <div className={styles.table__header_title}>{headerTitle}</div>
            <div className={styles.table__header_action}>
                <ComboBox {...restProps} size="m" view="default" options={options} onChange={onChange} />
            </div>
        </div>
    );
};

export { ComboBoxHeader };
