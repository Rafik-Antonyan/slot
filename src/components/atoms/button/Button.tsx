import React from 'react';
import styles from './button.module.scss';

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'yellow' | 'black' | 'white' | 'transparent';
    size?: 'small' | 'big';
}

export const Button: React.FC<IButton> = ({
    color = 'black',
    size = 'small',
    onClick,
    children,
    ...rest
}) => {
    return (
        <button
            onClick={onClick}
            className={`${styles.button} ${styles[color]} ${styles[size]}`}
            {...rest}
        >
            {children}
        </button>
    );
};
