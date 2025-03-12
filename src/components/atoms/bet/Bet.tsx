import React from 'react';
import { Arrow } from 'assets/png';
import { ESlotActions } from 'utils/types/slotActions';
import styles from './bet.module.scss';

interface IBet{
    setAction: React.Dispatch<React.SetStateAction<ESlotActions>>
}

export const Bet: React.FC<IBet> = ({setAction}) => {
    return (
        <div className={styles.bet}>
            <div className={styles.bet_values}>
                <p>BET</p>
                <span>€2.00</span>
            </div>
            <div className={styles.bet_arrows}>
                <img src={Arrow} alt='arrow' onClick={() => setAction(ESlotActions.INCREMENT)}/>
                <img src={Arrow} alt='arrow' onClick={() => setAction(ESlotActions.DECREMENT)}/>
            </div>
        </div>
    );
};
