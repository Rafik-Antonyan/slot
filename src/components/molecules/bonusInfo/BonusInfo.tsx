import React from 'react';
import { CleanBonusChair, CleanRaid, NewGoldChip } from 'assets/png';
import { EBonuses } from 'utils/types/slotActions';
import styles from './bonusInfo.module.scss';

interface IBonusInfo {
    selectedBonus: EBonuses;
}

const BONUS_INFO = {
    [EBonuses.GOLDEN]: {
        title: 'GOLDEN CHIP',
        description:
            '10 Free spins with sticky wilds. The wilds will remain sticky for the duration of the bonus round.',
        image: NewGoldChip,
    },
    [EBonuses.INTERROGATION]: {
        title: 'INTERROGATION',
        description: 'Expanding Wild symbol that turns the reel into a multiplier of up to 100x',
        image: CleanBonusChair,
    },
    [EBonuses.RAID]: {
        title: 'RAID',
        description:
            '10 Free spins with sticky wilds. The wilds will remain sticky for the duration of the bonus round.',
        image: CleanRaid,
    },
};

export const BonusInfo: React.FC<IBonusInfo> = ({ selectedBonus }) => {
    return (
        <div className={styles.bonusInfo}>
            <span>CONGRATULATIONS</span>
            <h3>{BONUS_INFO[selectedBonus].title}</h3>
            <img src={BONUS_INFO[selectedBonus].image} alt='bonus' />
            <p className={styles.bonusInfo_desc}>{BONUS_INFO[selectedBonus].description}</p>
            <p>Click to continue!</p>
        </div>
    );
};
