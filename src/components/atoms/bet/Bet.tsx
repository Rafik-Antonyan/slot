import React from 'react';
import { Arrow } from 'assets/png';
import { ISlotData } from 'utils/types/slot';
import styles from './bet.module.scss';

interface IBet {
    slotData: ISlotData;
    setSlotData: React.Dispatch<React.SetStateAction<ISlotData>>;
}

enum EActions {
    INCREMENT = 'increment',
    DECREMENT = 'decrement',
}

export const Bet: React.FC<IBet> = ({ setSlotData, slotData }) => {
    const changeBet = (action: EActions) => {
        setSlotData(prev => {
            let newValue = prev.betValue;
    
            if (action === EActions.INCREMENT) {
                if (newValue >= 1 && newValue < 10) newValue += 1;
                else if (newValue >= 10 && newValue < 50) newValue += 5;
                else if (newValue >= 50 && newValue < 100) newValue += 10;
            } else if (action === EActions.DECREMENT) {
                if (newValue > 1 && newValue <= 10) newValue -= 1;
                else if (newValue > 10 && newValue <= 50) newValue -= 5;
                else if (newValue > 50 && newValue <= 100) newValue -= 10;
            }
    
            newValue = Math.max(1, newValue);

            return { ...prev, betValue: newValue };
        });
    };

    return (
        <div className={styles.bet}>
            <div className={styles.bet_values}>
                <p>BET</p>
                <span>€{slotData.betValue}</span>
            </div>
            <div className={styles.bet_arrows}>
                <img src={Arrow} alt='arrow' onClick={() => changeBet(EActions.INCREMENT)} />
                <img src={Arrow} alt='arrow' onClick={() => changeBet(EActions.DECREMENT)} />
            </div>
        </div>
    );
};
