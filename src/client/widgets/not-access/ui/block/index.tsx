import React, { FC } from 'react';

import { Button, Text } from '@ccomponents/index';

import styles from './index.module.scss';

const NotAccess: FC = () => (
    <div className={styles.not_access}>
        <Button view="pseudo">
            <Text typography={'control-xl'}>Do not have access to this page</Text>
        </Button>
    </div>
);

export { NotAccess };
