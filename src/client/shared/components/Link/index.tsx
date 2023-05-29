import React, { forwardRef, RefObject } from 'react';

export type ContainerElement = HTMLLinkElement | HTMLSpanElement;

export type LinkProps = React.ForwardRefExoticComponent<React.RefAttributes<ContainerElement>>;

export const Link = forwardRef<ContainerElement, LinkProps>((props, ref) => (
    <Link ref={(ref as RefObject<ContainerElement>) || undefined} {...props} />
));
