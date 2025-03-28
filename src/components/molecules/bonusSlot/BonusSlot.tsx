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
    const [freeSpins, setFreeSpins] = useState<number>(selectedBonus === EBonuses.RAID ? 3 : 10);
    const [totalWin, setTotalWin] = useState<number>(0);
    const [isResult, setIsResult] = useState<boolean>(false);
    const [extraSpins, setExtraSpins] = useState<number>(3);

    console.log('extraSpins', extraSpins);
    useEffect(() => {
        if (!freeSpins) {
            if (selectedBonus !== EBonuses.RAID) {
                setTimeout(() => {
                    setIsResult(true);
                }, 3300);
            }
        }
        if (!extraSpins && selectedBonus === EBonuses.RAID) {
            setTimeout(() => {
                setIsResult(true);
            }, 3300);
        }
    }, [freeSpins, extraSpins]);

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
