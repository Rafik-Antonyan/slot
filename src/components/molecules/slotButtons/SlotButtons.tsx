import React from 'react';
import { AutoBonus, BuyBonus, MenuButton, Spin, SpinAgain } from 'assets/png';
import { Bet } from 'components/atoms/bet/Bet';
import { ESlotActions } from 'utils/types/slotActions';
import { ISlotData } from 'utils/types/slot';
import styles from './slotButtons.module.scss';

interface ISlotButtons {
    slotData: ISlotData;
    setAction: React.Dispatch<React.SetStateAction<ESlotActions>>;
    setSlotData: React.Dispatch<React.SetStateAction<ISlotData>>;
}

export const SlotButtons: React.FC<ISlotButtons> = ({ setAction, slotData, setSlotData }) => {
    const onClickButton = (value: ESlotActions) => {
        if (value === ESlotActions.PLAY) {
            setAction(value);
            setSlotData((prev) => ({
                ...prev,
                balance: prev.balance - slotData.betValue,
            }));
            setTimeout(() => {
                setAction(ESlotActions.PAUSE);
            }, 1000);
        }
    };

    return (
        <div className={styles.slotButtons}>
            <div className={styles.slotButtons_bonus}>
                <img src={AutoBonus} alt='auto_bonus' />
                <img src={BuyBonus} alt='buy_bonus' />
                <img src={MenuButton} alt='menu' />
            </div>
            <div className={styles.slotButtons_play}>
                <div className={styles.slotButtons_play_balance}>
                    <div>
                        <p>BALANCE</p>
                        <span>€{slotData.balance}</span>
                    </div>
                    <div>
                        <p>WIN</p>
                        <span>€0.00</span>
                    </div>
                </div>
                <div className={styles.slotButtons_play_spin}>
                    <Bet slotData={slotData} setSlotData={setSlotData} />
                    <img
                        src={Spin}
                        alt='spin'
                        className={styles.spin}
                        onClick={() => onClickButton(ESlotActions.PLAY)}
                    />
                    <img src={SpinAgain} alt='spin_againt' />
                </div>
            </div>
        </div>
    );
};
