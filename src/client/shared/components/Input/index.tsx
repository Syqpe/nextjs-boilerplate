import React, { forwardRef, RefObject } from 'react';

export type ContainerElement = HTMLInputElement;

export type TextinputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    step?: number | string;
    list?: string;
};

export const Textinput = forwardRef<ContainerElement, TextinputProps>((props, ref) => (
    <input ref={(ref as RefObject<ContainerElement>) || undefined} {...props} />
));
