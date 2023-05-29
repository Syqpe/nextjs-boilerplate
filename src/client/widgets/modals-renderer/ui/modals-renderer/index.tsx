import React, { FC } from 'react';
import { useAppSelector } from '@client/shared/hooks/store-hooks';
import { ModalStore } from '@cwidgets/index';

import styles from './index.module.scss';

const ModalsRenderer: FC = ({}) => {
    const modals: Array<JSX.Element> = useAppSelector(ModalStore.selectItems);

    return (
        <div className={styles.modals_renderer}>
            <div className={styles.modals_renderer__inner}>
                {modals.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </div>
        </div>
    );
};

export { ModalsRenderer };
