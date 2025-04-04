import React, { useEffect, useState } from 'react';
import { SlotView } from '../slotView/SlotView';
import { BonusRoundButtons } from '../bonusRoundButtons/BonusRoundButtons';
import { EBonuses } from 'utils/types/slotActions';
import { TotalWin } from 'components/atoms/totalWin/TotalWin';
import styles from './bonusSlot.module.scss';

interface IBonusSlot {
    selectedBonus: EBonuses;
    setSelectedBonus: React.Dispatch<React.SetStateAction<EBonuses | null>>;
    setIsDoneInitialSpin?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BonusSlot: React.FC<IBonusSlot> = ({ selectedBonus, setSelectedBonus, setIsDoneInitialSpin }) => {
    const [freeSpins, setFreeSpins] = useState<number>(selectedBonus === EBonuses.RAID ? 3 : 10);
    const [totalWin, setTotalWin] = useState<number>(0);
    const [isResult, setIsResult] = useState<boolean>(false);
    const [extraSpins, setExtraSpins] = useState<number>(3);

    useEffect(() => {
        if (!freeSpins) {
            if (selectedBonus === EBonuses.GOLDEN) {
                setTimeout(() => {
                    setIsResult(true);
                }, 3300);
            } else if(selectedBonus === EBonuses.INTERROGATION){
                setTimeout(() => {
                    setIsResult(true);
                }, 5000);
            }
        }
        if (!extraSpins && selectedBonus === EBonuses.RAID) {
            setTimeout(() => {
                setIsResult(true);
            }, 3300);
        }
    }, [freeSpins, extraSpins]);
    
    useEffect(() => {
        if(isResult && selectedBonus === EBonuses.RAID){
            setTimeout(() => {
                setIsDoneInitialSpin && setIsDoneInitialSpin(false);
            }, 3000);
        }
    },[isResult])

    return (
        <div className={styles.bonusSlot}>
            <div>
                <SlotView
                    selectedBonus={selectedBonus}
                    freeSpins={freeSpins}
                    setFreeSpins={setFreeSpins}
                    setTotalWin={setTotalWin}
                    extraSpins={extraSpins}
                    setExtraSpins={setExtraSpins}
                />
                {selectedBonus === EBonuses.RAID ? (
                    <BonusRoundButtons
                        freeSpins={freeSpins}
                        extraSpins={extraSpins}
                        totalWin={totalWin}
                    />
                ) : (
                    <BonusRoundButtons
                        freeSpins={freeSpins}
                        totalWin={totalWin}
                    />
                )}
                {isResult && <TotalWin totalWin={totalWin} setSelectedBonus={setSelectedBonus} />}
            </div>
        </div>
    );
};
