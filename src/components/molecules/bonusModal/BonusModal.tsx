import React from 'react';
import { Button } from 'components/atoms/button/Button';
import { CleanBonusChair, CleanGoldenChip, CleanRaid } from 'assets/png';
import { useOutsideClick } from 'hooks/useOutSideClick';
import { EBonuses } from 'utils/types/slotActions';
import styles from './bonusModal.module.scss';

interface IBonusModal{
    setIsOpenBonuses: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedBonus: React.Dispatch<React.SetStateAction<EBonuses | null>>
}

export const BonusModal: React.FC<IBonusModal> = ({setIsOpenBonuses, setSelectedBonus}) => {
    const modalRef = React.useRef<HTMLDivElement>(null);

    useOutsideClick(modalRef, () => setIsOpenBonuses(false))
    
    return (
        <div className={styles.bonusModal}>
            <div className={styles.bonusModal_container} ref={modalRef}>
                <div className={styles.bonusModal_container_bet}>
                    <div></div>
                    <div>
                        <p>BET</p>
                        <div>
                            <Button children='-' onClick={() => {}} />
                            <span>$0.20</span>
                            <Button children='+' onClick={() => {}} />
                        </div>
                    </div>
                    <div></div>
                </div>
                <div className={styles.bonusModal_container_bonuses}>
                    <div>
                        <img src={CleanGoldenChip} alt='golden' />
                        <p>GOLDEN CHIP</p>
                        <span>$20.00</span>
                        <Button children='BUY' onClick={() => setSelectedBonus(EBonuses.GOLDEN)} />
                    </div>
                    <div>
                        <img src={CleanBonusChair} alt='chair' />
                        <p>INTERROGATION</p>
                        <span>$20.00</span>
                        <Button children='BUY' onClick={() => setSelectedBonus(EBonuses.INTERROGATION)} />
                    </div>
                    <div>
                        <img src={CleanRaid} alt='raid' />
                        <p>RAID</p>
                        <span>$20.00</span>
                        <Button children='BUY' onClick={() => setSelectedBonus(EBonuses.RAID)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

