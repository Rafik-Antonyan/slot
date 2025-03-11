import React from 'react';
import { ClipGaming } from 'assets/png';
import styles from './slotView.module.scss';

export const SlotView: React.FC = () => {
    return (
        <div className={styles.slotView}>
            <div className={styles.slotView_container}>
                <div className={styles.slotView_container_slot}>
                    <img src={ClipGaming} alt='clipGaming' />
                    <div className={styles.slotView_container_slot_game}>
                        <div className={styles.game}>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
