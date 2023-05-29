import React, { FC } from 'react';
import { useAppDispatch } from '@client/shared/hooks/store-hooks';
import { addRoutes } from '@client/app/store/reducers/routesSlice';
import { addGates } from '@client/app/store/reducers/gatesSlice';
import { addFallbacks } from '@client/app/store/reducers/fallbacksSlice';
import { addBlockedphones } from '@client/app/store/reducers/blockedphonesSlice';
import { addTemplates } from '@client/app/store/reducers/templatesSlice';

import { Button, Icon } from '@ccomponents/index';

import { isSuccess } from '@cshared/types/yasms';

import styles from './index.module.scss';

interface Props {
    className?: string;
    type: 'routes' | 'gates' | 'fallbacks' | 'blockedphones' | 'templates';
    queryRequestNext: (all?: boolean) => Promise<any>;
}

const MoreRowBlock: FC<Props> = ({ className = '', type, queryRequestNext }) => {
    const dispatch = useAppDispatch();

    const addArr = () => {
        switch (type) {
            case 'routes':
                return addRoutes;
            case 'gates':
                return addGates;
            case 'fallbacks':
                return addFallbacks;
            case 'blockedphones':
                return addBlockedphones;
            case 'templates':
                return addTemplates;
        }
    };

    const handleGetRow = async (all?: boolean) => {
        const response = await queryRequestNext(all);
        if (response && isSuccess(response)) {
            dispatch(addArr()(response.data[type] || []));
        }
    };

    return (
        <div className={`${className} ${styles.more_row_block}`}>
            <Button view="default" onClick={() => handleGetRow()}>
                <Icon style={{ marginLeft: '10px' }} glyph="type-arrow" />
            </Button>
            <Button view="default" onClick={() => handleGetRow(true)}>
                <Icon style={{ marginLeft: '10px' }} glyph="type-arrow" />
                <Icon style={{ marginLeft: '10px' }} glyph="type-arrow" />
                <Icon style={{ marginLeft: '10px' }} glyph="type-arrow" />
            </Button>
        </div>
    );
};

export { MoreRowBlock };
