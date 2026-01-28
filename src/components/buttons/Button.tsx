import './button.scss';

import { type FC } from 'react';
import Spinner from '../spinner/Spinner';
import type { IButton } from './Button.t';

const Button: FC<IButton> = ({ children, isLoading, className = '', disabled, color = 'primary', style, ...props }) => {
    return (
        <button
            disabled={disabled || isLoading}
            className={`custom-btn custom-btn--${color} ${className}`}
            style={style}
            {...props}
        >
            {isLoading ? <Spinner size="sm" /> : children}
        </button>
    );
};

export default Button;
