import React, { useState, useCallback, FC, Dispatch, SetStateAction } from 'react';

import { Input, Textarea, Text } from '@ccomponents/index';

import { ChangeInfoInterface } from '@cshared/types/yasms';

import styles from './index.module.scss';

interface Props {
    info: ChangeInfoInterface;
    setInfo: Dispatch<SetStateAction<ChangeInfoInterface>>;

    setError: Dispatch<SetStateAction<string | undefined>>;
}

const ChangeInfo: FC<Props> = ({ info, setInfo, setError }) => {
    const maxLength: number = 128;

    const [localError, setLocalError] = useState<{
        issue: string | undefined;
        comment: string | undefined;
    }>({
        issue: undefined,
        comment: undefined,
    });

    const handleChange = useCallback(
        (key: keyof ChangeInfoInterface, value: string) => {
            const localValue = key === 'issue' ? value.toUpperCase() : value;

            isValid(key, localValue);

            setInfo({ ...info, [key]: key === 'issue' ? [localValue] : localValue });
        },
        [info],
    );

    const isValid = useCallback((key: keyof ChangeInfoInterface, value: string) => {
        const hintObj = {
            issue: {
                length: 'Task is required',
                main: 'Task is not valid',
            },
            comment: {
                length: 'Comment is required',
                main: '',
            },
        };

        const reg = /[A-Za-z]{1,10}-[0-9]{1,10}/gm;

        if (reg.test(value) || (key === 'comment' && value.length)) {
            setError(undefined);

            setLocalError(prevLocalError => ({
                ...prevLocalError,
                [key]: undefined,
            }));
        } else if (!value.length) {
            setError(hintObj[key].length);

            setLocalError(prevLocalError => ({
                ...prevLocalError,
                [key]: hintObj[key].length,
            }));
        } else {
            setError(hintObj[key].main);

            setLocalError(prevLocalError => ({
                ...prevLocalError,
                [key]: hintObj[key].main,
            }));
        }
    }, []);

    return (
        <div className={styles.changeinfo}>
            <div className={styles.changeinfo__inner}>
                <div className={styles.changeinfo__issue}>
                    <div className={styles.changeinfo__issue_title}>
                        <Text typography="control-l" weight="regular">
                            Task
                        </Text>
                    </div>
                    <div className={styles.changeinfo__issue_action}>
                        <Input
                            state={localError.issue?.length ? 'error' : undefined}
                            hint={localError.issue?.length ? localError.issue : undefined}
                            size="m"
                            view="default"
                            placeholder="Example: YASMS-123"
                            value={info?.issue?.[0]}
                            onChange={event => handleChange('issue', event.target.value)}
                            maxLength={maxLength}
                        />
                    </div>
                </div>

                <div className={styles.changeinfo__comment}>
                    <div className={styles.changeinfo__comment_title}>
                        <Text typography="control-l" weight="regular">
                            Comment
                        </Text>
                    </div>
                    <div className={styles.changeinfo__comment_action}>
                        <Textarea
                            state={localError.comment?.length ? 'error' : undefined}
                            hint={localError.comment?.length ? localError.comment : undefined}
                            size="m"
                            view="default"
                            maxLength={maxLength}
                            placeholder="Information about changes"
                            value={info?.comment}
                            onChange={event => handleChange('comment', event.target.value)}
                            onClearClick={() => handleChange('comment', '')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ChangeInfo };
