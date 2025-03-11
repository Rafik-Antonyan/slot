import React from 'react';
import { Arrow } from 'assets/png';
import styles from './bet.module.scss';

export const Bet: React.FC = () => {
    return (
        <div className={styles.bet}>
            <div className={styles.bet_values}>
                <p>BET</p>
                <span>€2.00</span>
            </div>
            <div className={styles.bet_arrows}>
                <img src={Arrow} alt='arrow' />
                <img src={Arrow} alt='arrow' />
            </div>
        </div>
    );
};
