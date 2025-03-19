import React, { useEffect, useState } from 'react';
import { SlotView } from '../slotView/SlotView';
import { BonusRoundButtons } from '../bonusRoundButtons/BonusRoundButtons';
import { EBonuses } from 'utils/types/slotActions';
import { TotalWin } from 'components/atoms/totalWin/TotalWin';
import styles from './bonusSlot.module.scss';

interface IBonusSlot {
    selectedBonus: EBonuses;
    setSelectedBonus: React.Dispatch<React.SetStateAction<EBonuses | null>>;
}

export const BonusSlot: React.FC<IBonusSlot> = ({ selectedBonus, setSelectedBonus }) => {
    const [freeSpins, setFreeSpins] = useState<number>(10);
    const [totalWin, setTotalWin] = useState<number>(0);
    const [isResult, setIsResult] = useState<boolean>(false);

    useEffect(() => {
        if(!freeSpins){
            setTimeout(() => {
                setIsResult(true)
            }, 3300)
        }
    },[freeSpins])

    return (
        <div className={styles.bonusSlot}>
            <div>
                <SlotView
                    selectedBonus={selectedBonus}
                    freeSpins={freeSpins}
                    setFreeSpins={setFreeSpins}
                    setTotalWin={setTotalWin}
                />
                <BonusRoundButtons freeSpins={freeSpins} totalWin={totalWin} />
                {isResult && <TotalWin totalWin={totalWin} setSelectedBonus={setSelectedBonus} />}
            </div>
        </div>
    );
};
