import React from 'react';
import { ISlotData } from 'utils/types/slot';
import styles from './autoSpinModal.module.scss';

const AUTOPLAY_VALUES: number[] = [10, 25, 50, 75, 100, 500, 1000];

interface IAutoSpinModal {
    setSlotData: React.Dispatch<React.SetStateAction<ISlotData>>;
}

export const AutoSpinModal: React.FC<IAutoSpinModal> = ({ setSlotData }) => {
    return (
        <div className={styles.autoSpinModal}>
            <h3>AUTOPLAY</h3>
            <p>NUMBER OF ROUNDS</p>
            <div className={styles.autoSpinModal_values}>
                {AUTOPLAY_VALUES.map((value) => (
                    <div
                        key={value}
                        onClick={() => setSlotData((prev) => ({ ...prev, autoSpins: value }))}
                    >
                        <span>{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
