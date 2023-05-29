import React, { FC } from 'react';
import { Table } from './ui';

import styles from './Page.module.scss';

const Page: FC = () => {
    return (
        <div className={styles.page}>
            <div className={styles.page__inner}>
                <Table />
            </div>
        </div>
    );
};

export { Page };
