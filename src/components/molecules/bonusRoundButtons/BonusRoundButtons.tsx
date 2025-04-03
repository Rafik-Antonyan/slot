import React from 'react';
import { MenuButton } from 'assets/png';
import styles from './bonusRoundButtons.module.scss';

interface IBonusRoundButtons {
    freeSpins: number;
    totalWin: number;
    extraSpins?: number;
}

export const BonusRoundButtons: React.FC<IBonusRoundButtons> = ({ freeSpins, totalWin, extraSpins }) => {
    return (
        <div className={styles.bonusRoundButtons}>
            <div className={styles.bonusRoundButtons_left}>
                <img src={MenuButton} alt='menu' />
                <div className={styles.infoBlock}>
                    <p>BALANCE</p>
                    <span>$4980.00</span>
                </div>
                <div className={styles.infoBlock}>
                    <p>BET</p>
                    <span>$2</span>
                </div>
            </div>
            <div className={styles.bonusRoundButtons_right}>
                <div className={styles.infoBlock}>
                    <p>TOTAL WIN</p>
                    <span>${totalWin}</span>
                </div>
                <div className={styles.infoBlock}>
                    <p>{freeSpins === 0 && typeof extraSpins === 'number' ? "EXTRA" : "FREE"} SPINS</p>
                    <span>{freeSpins || extraSpins || 0}</span>
                </div>
            </div>
        </div>
    );
};
