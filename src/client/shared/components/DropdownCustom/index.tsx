import React, {
    Children,
    cloneElement,
    createRef,
    CSSProperties,
    PureComponent,
    ReactElement,
    MouseEventHandler,
} from 'react';
import { forkFn } from '@yandex-lego/components/lib/forkFn';
import { Direction, IPopupProps } from '@yandex-lego/components/Popup';
import { Popup } from '@yandex-lego/components/Popup/desktop/bundle';

const noop = () => {};

export interface IPopupPropsCustom extends IPopupProps {
    onMouseEnter?: MouseEventHandler<HTMLElement>;
    onMouseLeave?: MouseEventHandler<HTMLElement>;
}

export type TriggerType = 'click' | 'hover' | 'focus';

export interface DropdownProps {
    /**
     * Делает попап видимым
     */
    visible: boolean;
    /**
     * Элемент триггер, например, Link или Button
     */
    children: ReactElement;
    /**
     * Содержимое попапа
     */
    content: IPopupPropsCustom['children'];
    /**
     * Html атрибут `style`
     */
    styleWrapper?: CSSProperties;
    /**
     * Направление раскрытия попапа
     */
    direction?: Direction | Direction[];
    /**
     * Действие вызывающее показ попапа
     */
    trigger: TriggerType | TriggerType[];
    /**
     * Обработчик на изменение видимости попапа
     */
    onVisibleChange: (visible: boolean) => void;
    /**
     * Временная задержка (секунды) на появление попапа
     * @default 0
     */
    mouseEnterDelay: number;
    /**
     * Временная задержка (секунды) на исчезновение попапа
     * @default 0.1
     */
    mouseLeaveDelay: number;
    /**
     * Временная задержка (секунды) на появление попапа
     * @default 0
     */
    focusDelay: number;
    /**
     * Временная задержка (секунды) на исчезновение попапа
     * @default 0.15
     */
    blurDelay: number;
}

export interface DropdownState {
    visible: boolean;
    prevVisible: boolean;
}

export class DropdownCustom<T extends IPopupPropsCustom> extends PureComponent<T & DropdownProps, DropdownState> {
    static defaultProps = {
        onVisibleChange: noop,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0.1,
        focusDelay: 0,
        blurDelay: 0.15,
        visible: false,
        trigger: ['hover'],
    };

    componentWillUnmount() {
        this.clearDelayTimer();
    }

    innerRef = createRef<HTMLElement>();

    delayTimer: null | ReturnType<typeof setTimeout> = null;

    readonly state = {
        visible: this.props.visible,
        prevVisible: this.props.visible,
    };

    delaySetPopupVisible(visible: boolean, delay: number) {
        this.clearDelayTimer();
        const delayMS = delay * 1000;
        this.delayTimer = setTimeout(() => {
            this.setPopupVisible(visible);
            this.clearDelayTimer();
        }, delayMS);
    }

    setPopupVisible(visible: boolean) {
        const { visible: prevVisible } = this.state;
        const { onVisibleChange } = this.props;

        this.clearDelayTimer();

        if (prevVisible !== visible) {
            this.setState({ visible, prevVisible });
            onVisibleChange(visible);
        }
    }

    onClick = () => {
        this.setPopupVisible(!this.state.visible);
    };

    onMouseEnter = () => {
        const { mouseEnterDelay } = this.props;
        this.delaySetPopupVisible(true, mouseEnterDelay);
    };

    onMouseLeave = () => {
        const { mouseLeaveDelay } = this.props;
        this.delaySetPopupVisible(false, mouseLeaveDelay);
    };

    onFocus = () => {
        const { focusDelay } = this.props;
        this.delaySetPopupVisible(true, focusDelay);
    };

    onBlur = () => {
        const { blurDelay } = this.props;
        this.delaySetPopupVisible(false, blurDelay);
    };

    onPopupMouseEnter = () => {
        this.clearDelayTimer();
    };

    onPopupMouseLeave = () => {
        const { mouseLeaveDelay } = this.props;
        this.delaySetPopupVisible(false, mouseLeaveDelay);
    };

    clearDelayTimer() {
        if (this.delayTimer) {
            clearTimeout(this.delayTimer);
            this.delayTimer = null;
        }
    }

    render() {
        const {
            children,
            content,
            styleWrapper,
            scope,
            onVisibleChange,
            mouseLeaveDelay,
            mouseEnterDelay,
            focusDelay,
            blurDelay,
            trigger,
            ...passThroughProps
        } = this.props;

        const child = Children.only(children);

        const popupProps: IPopupPropsCustom = {
            ...passThroughProps,
            children: content,
            target: 'anchor',
            anchor: this.innerRef,
            scope: scope,
            visible: this.state.visible,
            onClose: () => this.setPopupVisible(false),
        };
        const newChildProps = {} as any;

        if (trigger.indexOf('hover') !== -1) {
            newChildProps.onMouseEnter = forkFn(child?.props?.onMouseEnter, this.onMouseEnter);
            newChildProps.onMouseLeave = forkFn(child?.props?.onMouseLeave, this.onMouseLeave);

            popupProps.onMouseEnter = this.onPopupMouseEnter;
            popupProps.onMouseLeave = this.onPopupMouseLeave;
        }

        if (trigger.indexOf('focus') !== -1) {
            newChildProps.onFocus = forkFn(child?.props?.onFocus, this.onFocus);
            newChildProps.onBlur = forkFn(child?.props?.onBlur, this.onBlur);
        }

        if (trigger.indexOf('click') !== -1) {
            newChildProps.onClick = forkFn(child?.props?.onClick, this.onClick);
        }

        const dropdownTrigger = cloneElement(child, newChildProps);

        return (
            <span style={styleWrapper} ref={this.innerRef}>
                {dropdownTrigger}
                <Popup {...(popupProps as any)} />
            </span>
        );
    }
}
