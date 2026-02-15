import { type ReactNode } from 'react';

export type TButtonVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | 'link'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-dark'
    | 'outline-light';

export interface IButton {
    children: ReactNode;
    type?: 'submit' | 'button' | 'reset';
    variant?: TButtonVariant;
    size?: 'sm' | 'lg';
    active?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
    onClick?: () => void;
    color?: 'black' | 'red' | 'third' | 'white' | undefined;
    style?: React.CSSProperties;
}
