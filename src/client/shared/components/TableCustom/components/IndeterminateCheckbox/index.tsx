import React, { useRef, forwardRef, MutableRefObject } from 'react';
import { TableToggleAllRowsSelectedProps } from 'react-table';

import { Checkbox } from '@ccomponents/index';

const IndeterminateCheckbox = forwardRef<HTMLInputElement, TableToggleAllRowsSelectedProps>(
    ({ indeterminate, ...rest }: any, ref) => {
        const defaultRef = useRef<HTMLInputElement>();
        const resolvedRef = (ref || defaultRef) as MutableRefObject<HTMLInputElement>;

        return (
            <Checkbox
                size="m"
                view="default"
                theme="normal"
                indeterminate={indeterminate}
                innerRef={resolvedRef}
                {...rest}
            />
        );
    },
);

export { IndeterminateCheckbox };
