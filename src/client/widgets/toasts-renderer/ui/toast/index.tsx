import React, { useCallback, FC } from 'react';
import { useAppDispatch } from '@client/shared/hooks/store-hooks';
import { useTimeout } from '@cshared/hooks/use-timeout';
import { Icon, Text } from '@ccomponents/index';
import { close, MessageType, ToastProp } from '../../store';

import { DefaultParamsProp } from '..';

import styles from './index.module.scss';

interface Props {
    defaultParams: DefaultParamsProp;
    item: ToastProp;
}

const Toast: FC<Props> = ({ defaultParams, item }) => {
    const dispatch = useAppDispatch();

    const message = item.message || defaultParams?.message;
    const type = item?.options?.type || defaultParams?.options?.type;
    const duration = item?.options?.duration || defaultParams?.options?.duration;

    const closeToast = useCallback(() => {
        dispatch(close(item?.options?.id));
    }, [item]);

    useTimeout(closeToast, duration);

    const getToast = () => {
        switch (type) {
            case MessageType.SUCCESS:
                return (
                    <div className={styles.toast__content}>
                        <div className={styles.toast__icon}>
                            <Icon glyph={'type-tick'} size="l" />
                        </div>
                        <div className={styles.toast__message}>
                            <Text typography="control-m" weight="regular" color={'success'}>
                                {message}
                            </Text>
                        </div>
                    </div>
                );
            case MessageType.ERROR:
                return (
                    <div className={styles.toast__content}>
                        <div className={styles.toast__icon}>
                            <Icon glyph={'x-sign'} size="l" />
                        </div>
                        <div className={styles.toast__message}>
                            <Text typography="control-m" weight="regular" color={'alert'}>
                                {message}
                            </Text>
                        </div>
                    </div>
                );
            default:
                return message;
        }
    };

    return (
        <div className={styles.toast} onClick={closeToast}>
            <div className={styles.toast__inner}>
                <div className={styles[`toast__${type}`]}>{getToast()}</div>
            </div>
        </div>
    );
};

export { Toast };
