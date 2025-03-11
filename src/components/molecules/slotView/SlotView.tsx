import React, { useState } from 'react';
import { ClipGaming } from 'assets/png';
import styles from './slotView.module.scss';
import { viewGenerator } from 'utils/generators/viewGenerator';

export const SlotView: React.FC = ({action}) => {//actions must be enums for each button
    const [slotData, setSlotData] = useState<string[][]>([]);
    const randomData = viewGenerator(4, 5);
    console.log(randomData);
    return (
        <div className={styles.slotView}>
            <div className={styles.slotView_container}>
                <div className={styles.slotView_container_slot}>
                    <img src={ClipGaming} alt='clipGaming' />
                    <div className={styles.slotView_container_slot_game}>
                        <div className={styles.game}>
                            {randomData.map((row, i) => (
                                <div key={i} className={styles.row}>
                                    {row.map((col, j) => (
                                        <img key={j} src={col} alt='game' />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
