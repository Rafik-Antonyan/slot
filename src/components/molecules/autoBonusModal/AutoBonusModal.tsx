import React from 'react';
import { Button } from 'components/atoms/button/Button';
import { CleanGoldenChip, CleanI, CleanRaid } from 'assets/png';
import { useOutsideClick } from 'hooks/useOutSideClick';
import { EBonuses } from 'utils/types/slotActions';
import { ISlotData } from 'utils/types/slot';
import styles from './autoBonusModal.module.scss';

const BONUS_DETAILS = {
    [EBonuses.GOLDEN]: {
        img: CleanGoldenChip,
        title: 'GOLDEN CHIP',
        multiple: 10,
    },
    [EBonuses.INTERROGATION]: {
        img: CleanI,
        title: 'INTERROGATION',
        multiple: 20,
    },
    [EBonuses.RAID]: {
        img: CleanRaid,
        title: 'RAID',
        multiple: 30,
    },
};

interface IAutoBonusModal {
    slotData: ISlotData;
    setIsOpenAutoBonuses: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedBonus: React.Dispatch<React.SetStateAction<EBonuses | null>>;
    setSlotData: React.Dispatch<React.SetStateAction<ISlotData>>;
}

export const AutoBonusModal: React.FC<IAutoBonusModal> = ({
    slotData,
    setIsOpenAutoBonuses,
    setSelectedBonus,
    setSlotData,
}) => {
    const [bet, setBet] = React.useState<number>(0.2);
    const [unconfirmedBonus, setUnconfirmedBonus] = React.useState<EBonuses | null>(null);
    const modalRef = React.useRef<HTMLDivElement>(null);

    useOutsideClick(modalRef, () => setIsOpenAutoBonuses(false));

    return (
        <div className={styles.autoBonusModal}>
            {!unconfirmedBonus ? (
                <div className={styles.autoBonusModal_container} ref={modalRef}>
                    <div className={styles.autoBonusModal_container_bet}>
                        <div>
                            <p>BET</p>
                            <div>
                                <Button
                                    disabled={bet <= 0.3}
                                    children='-'
                                    onClick={() => setBet((prev) => prev - 0.2)}
                                />
                                <span>${bet.toFixed(2)}</span>
                                <Button children='+' onClick={() => setBet((prev) => prev + 0.2)} />
                            </div>
                        </div>
                        <div>
                            <p>ROUNDS</p>
                            <div>
                                <Button
                                    disabled={slotData.autoBonusRounds <= 1}
                                    children='-'
                                    onClick={() => setSlotData(prev => ({...prev, autoBonusRounds: prev.autoBonusRounds - 1}))}
                                />
                                <span>{slotData.autoBonusRounds}</span>
                                <Button children='+'  onClick={() => setSlotData(prev => ({...prev, autoBonusRounds: prev.autoBonusRounds + 1}))} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.autoBonusModal_container_bonuses}>
                        {Object.entries(BONUS_DETAILS).map(([key, bonus], index) => (
                            <div key={index}>
                                <img src={bonus.img} alt={bonus.title} />
                                <p>{bonus.title}</p>
                                <span>${(bet * bonus.multiple * slotData.autoBonusRounds).toFixed(2)}</span>
                                <Button
                                    children='BUY'
                                    onClick={() => setUnconfirmedBonus(key as EBonuses)}
                                    disabled={key === EBonuses.RAID && slotData.autoBonusRounds > 3}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={styles.autoBonusModal_confirm}>
                    <div className={styles.autoBonusModal_confirm_container} ref={modalRef}>
                        <div>
                            <img
                                src={BONUS_DETAILS[unconfirmedBonus].img}
                                alt={BONUS_DETAILS[unconfirmedBonus].title}
                            />
                            <div className={styles.autoBonusModal_confirm_text}>
                                <p>{BONUS_DETAILS[unconfirmedBonus].title}</p>
                                <span>
                                    $
                                    {(
                                        bet *
                                        BONUS_DETAILS[unconfirmedBonus].multiple *
                                        slotData.autoBonusRounds
                                    ).toFixed(2)}
                                </span>
                                <p className={styles.info_text}>
                                    Will be substructed from your balance
                                </p>
                            </div>
                            <div className={styles.autoBonusModal_confirm_container_buttons}>
                                <Button children='BACK' onClick={() => setUnconfirmedBonus(null)} />
                                <Button
                                    children='OK'
                                    onClick={() => {
                                        setSelectedBonus(unconfirmedBonus);
                                        setIsOpenAutoBonuses(false);
                                        setSlotData(prev => ({
                                            ...prev,
                                            isAutoBonus: true,
                                        }))
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
