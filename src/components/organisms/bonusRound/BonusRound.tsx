import React, { useState } from 'react';
import { EBonuses } from 'utils/types/slotActions';
import { BonusInfo } from 'components/molecules/bonusInfo/BonusInfo';
import { Intro } from '../intro/Intro';
import { BonusSlot } from 'components/molecules/bonusSlot/BonusSlot';
import styles from './bonusRound.module.scss'

interface IBonusRound {
    selectedBonus: EBonuses;
    setSelectedBonus: React.Dispatch<React.SetStateAction<EBonuses | null>>
}

export const BonusRound: React.FC<IBonusRound> = ({ selectedBonus, setSelectedBonus }) => {
  const [step, setStep] = useState<number>(0)

    return (
        <div className={styles.bonusRound} onClick={() => step === 0 && setStep(1)}>
            {
                {
                  0:<BonusInfo />,
                  1:<Intro setStep={setStep} />,
                  2:<BonusSlot selectedBonus={selectedBonus} setSelectedBonus={setSelectedBonus}/>,
                }[step]
            }
        </div>
    );
};
