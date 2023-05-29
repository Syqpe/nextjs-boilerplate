import React, { forwardRef, RefObject } from 'react';

type ContainerElement = HTMLButtonElement;

export type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const Button = forwardRef<ContainerElement, ButtonProps>((props, ref) => (
    <button ref={(ref as RefObject<ContainerElement>) || undefined} {...props} />
));
