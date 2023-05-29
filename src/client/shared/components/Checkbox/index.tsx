import React, { forwardRef, RefObject } from 'react';

export type ContainerElement = HTMLButtonElement;

export type CheckboxProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const Checkbox = forwardRef<ContainerElement, CheckboxProps>((props, ref) => (
    <button ref={(ref as RefObject<ContainerElement>) || undefined} {...props} type="checkbox" />
));
