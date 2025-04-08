import React from 'react';
import { Arrow } from 'assets/png';
import { ISlotData } from 'utils/types/slot';
import { changeBet } from 'utils/bets/calculator';
import { EActions } from 'utils/types/bet';
import styles from './bet.module.scss';

interface IBet {
    slotData: ISlotData;
    disabled: boolean;
    setSlotData: React.Dispatch<React.SetStateAction<ISlotData>>;
}

export const Bet: React.FC<IBet> = ({ slotData, disabled, setSlotData }) => {
    return (
        <div className={styles.bet}>
            <div className={styles.bet_values}>
                <p>BET</p>
                <span>€{slotData.betValue}</span>
            </div>
            <div className={styles.bet_arrows}>
                <button
                    onClick={() => changeBet(EActions.INCREMENT, setSlotData)}
                    disabled={disabled}
                >
                    <img src={Arrow} alt='arrow' />
                </button>
                <button
                    onClick={() => changeBet(EActions.DECREMENT, setSlotData)}
                    disabled={disabled}
                >
                    <img src={Arrow} alt='arrow' />
                </button>
            </div>
        </div>
    );
};
