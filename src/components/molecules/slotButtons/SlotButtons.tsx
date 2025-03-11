import React from 'react';
import { AutoBonus, BuyBonus, MenuButton, Spin, SpinAgain } from 'assets/png';
import { Bet } from 'components/atoms/bet/Bet';
import styles from './slotButtons.module.scss';

export const SlotButtons: React.FC = () => {
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
                        <span>€4000.00</span>
                    </div>
                    <div>
                        <p>WIN</p>
                        <span>€0.00</span>
                    </div>
                </div>
                <div className={styles.slotButtons_play_spin}>
                    <Bet />
                    <img src={Spin} alt='spin' className={styles.spin}/>
                    <img src={SpinAgain} alt='spin_againt' />
                </div>
            </div>
        </div>
    );
};
