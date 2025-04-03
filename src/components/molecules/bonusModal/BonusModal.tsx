import React from 'react';
import { Button } from 'components/atoms/button/Button';
import { CleanBonusChair, CleanGoldenChip, CleanRaid } from 'assets/png';
import { useOutsideClick } from 'hooks/useOutSideClick';
import { EBonuses } from 'utils/types/slotActions';
import styles from './bonusModal.module.scss';

interface IBonusModal {
    setIsOpenBonuses: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedBonus: React.Dispatch<React.SetStateAction<EBonuses | null>>;
}

const BONUS_DETAILS = {
    [EBonuses.GOLDEN]: {
        img: CleanGoldenChip,
        title: 'GOLDEN CHIP',
        multiple: 10,
    },
    [EBonuses.INTERROGATION]: {
        img: CleanBonusChair,
        title: 'INTERROGATION',
        multiple: 20,
    },
    [EBonuses.RAID]: {
        img: CleanRaid,
        title: 'RAID',
        multiple: 30,
    },
};

export const BonusModal: React.FC<IBonusModal> = ({ setIsOpenBonuses, setSelectedBonus }) => {
    const [bet, setBet] = React.useState<number>(0.2);
    const [unconfirmedBonus, setUnconfirmedBonus] = React.useState<EBonuses | null>(null);
    const modalRef = React.useRef<HTMLDivElement>(null);

    useOutsideClick(modalRef, () => setIsOpenBonuses(false));

    return (
        <div className={styles.bonusModal}>
            {!unconfirmedBonus ? (
                <div className={styles.bonusModal_container} ref={modalRef}>
                    <div className={styles.bonusModal_container_bet}>
                        <div></div>
                        <div>
                            <p>BET</p>
                            <div>
                                <Button
                                    disabled={bet === 0.2}
                                    children='-'
                                    onClick={() => setBet((prev) => prev - 0.2)}
                                />
                                <span>${bet.toFixed(2)}</span>
                                <Button children='+' onClick={() => setBet((prev) => prev + 0.2)} />
                            </div>
                        </div>
                        <div></div>
                    </div>
                    <div className={styles.bonusModal_container_bonuses}>
                        {Object.entries(BONUS_DETAILS).map(([key, bonus], index) => (
                            <div key={index}>
                                <img src={bonus.img} alt={bonus.title} />
                                <p>{bonus.title}</p>
                                <span>${(bet * bonus.multiple).toFixed(2)}</span>
                                <Button
                                    children='BUY'
                                    onClick={() => setUnconfirmedBonus(key as EBonuses)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={styles.bonusModal_confirm}>
                    <div className={styles.bonusModal_confirm_container} ref={modalRef}>
                        <div>
                            <img
                                src={BONUS_DETAILS[unconfirmedBonus].img}
                                alt={BONUS_DETAILS[unconfirmedBonus].title}
                            />
                            <div className={styles.bonusModal_confirm_text}>
                                <p>{BONUS_DETAILS[unconfirmedBonus].title}</p>
                                <span>${(bet * BONUS_DETAILS[unconfirmedBonus].multiple).toFixed(2)}</span>
                                <p className={styles.info_text}>
                                    Will be substructed from your balance
                                </p>
                            </div>
                            <div className={styles.bonusModal_confirm_container_buttons}>
                                <Button children='BACK' onClick={() => setUnconfirmedBonus(null)} />
                                <Button
                                    children='OK'
                                    onClick={() => {
                                        setSelectedBonus(unconfirmedBonus)
                                        setIsOpenBonuses(false)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
