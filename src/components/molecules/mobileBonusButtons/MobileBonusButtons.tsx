import React from 'react';
import { MenuButton } from 'assets/png';
import styles from './mobileBonusButtons.module.scss'

interface IMobileBonusButtons {
    freeSpins: number;
    totalWin: number;
    extraSpins?: number;
}

export const MobileBonusButtons: React.FC<IMobileBonusButtons> = ({
    freeSpins,
    totalWin,
    extraSpins,
}) => {
    return (
        <div className={styles.mobileBonusButtons}>
            <div>
                <img src={MenuButton} alt='menu' />
                <div className={styles.infoBlock}>
                    <p>TOTAL WIN</p>
                    <span>${totalWin.toFixed(2)}</span>
                </div>
            </div>
            <div>
                <div className={styles.infoBlock}>
                    <p>BALANCE</p>
                    <span>$4980.00</span>
                </div>
                <div className={styles.infoBlock}>
                    <p>BET</p>
                    <span>$2.00</span>
                </div>
                <div className={styles.infoBlock}>
                    <p>
                        {freeSpins === 0 && typeof extraSpins === 'number' ? 'EXTRA' : 'FREE'} SPINS
                    </p>
                    <span>{freeSpins || extraSpins || 0}</span>
                </div>
            </div>
        </div>
    );
};
