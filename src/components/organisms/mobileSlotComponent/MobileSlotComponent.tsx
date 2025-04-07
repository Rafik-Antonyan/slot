import React, { useEffect, useState } from 'react';
import { ClipGaming, MobileCharacter } from 'assets/png';
import { EBonuses, ESlotActions } from 'utils/types/slotActions';
import { ISlotData } from 'utils/types/slot';
import { Modal } from 'components/molecules/modal/Modal';
import { BonusModal } from 'components/molecules/bonusModal/BonusModal';
import { MobileSlotButtons } from 'components/molecules/mobileSlotButtons/MobileSlotButtons';
import { SlotView } from 'components/molecules/slotView/SlotView';
import { BonusRound } from '../bonusRound/BonusRound';
import styles from './mobileSlotComponent.module.scss';

const PERSONAGE_TEXTS: string[] = [
    'Nope, the win’s going to someone else',
    'You Suck',
    'Ever think that maybe this slow doesnt like you',
    'If Bad Luck was a profession, you’d be an expert',
];

export const MobileSlotComponent: React.FC = () => {
    const [action, setAction] = useState<ESlotActions>(ESlotActions.PAUSE);
    const [isOpenBonuses, setIsOpenBonuses] = useState<boolean>(false);
    const [selectedBonus, setSelectedBonus] = useState<EBonuses | null>(EBonuses.GOLDEN);
    const [isDoneInitialSpin, setIsDoneInitialSpin] = useState<boolean>(false);
    const [showText, setShowText] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [slotData, setSlotData] = useState<ISlotData>({
        betValue: 1,
        balance: 4000,
    });

    useEffect(() => {
        if (action === ESlotActions.PAUSE) {
            setText(PERSONAGE_TEXTS[Math.floor(Math.random() * 4)]);
            setTimeout(() => {
                setShowText(true);
            }, 2000);
            setTimeout(() => {
                setShowText(false);
            }, 4000);
        } else if (action === ESlotActions.BUY_BONUS) {
            setIsOpenBonuses(true);
        } else if (action === ESlotActions.PLAY) {
            setAction(ESlotActions.PAUSE);
        }
    }, [action]);

    useEffect(() => {
        if (selectedBonus && !isDoneInitialSpin) {
            setAction(ESlotActions.PLAY);
            const bonus: EBonuses = selectedBonus;
            setTimeout(() => {
                setIsDoneInitialSpin(true);
            }, 3000);
            setTimeout(() => {
                setSelectedBonus(bonus);
            }, 4000);
        }
    }, [selectedBonus]);

    return (
        <div className={styles.mobileSlotComponent}>
            {selectedBonus && isDoneInitialSpin ? (
                <BonusRound
                    selectedBonus={selectedBonus}
                    setSelectedBonus={setSelectedBonus}
                    setIsDoneInitialSpin={setIsDoneInitialSpin}
                />
            ) : (
                <>
                    <img src={ClipGaming} alt='logo' />
                    <SlotView
                        action={action}
                        selectedBonus={selectedBonus}
                        isDoneInitialSpin={isDoneInitialSpin}
                        setSelectedBonus={setSelectedBonus}
                    />
                    <MobileSlotButtons
                        setAction={setAction}
                        slotData={slotData}
                        setSlotData={setSlotData}
                    />
                    <Modal
                        children={
                            <BonusModal
                                setIsOpenBonuses={setIsOpenBonuses}
                                setSelectedBonus={setSelectedBonus}
                            />
                        }
                        isOpen={isOpenBonuses}
                        onClose={() => setIsOpenBonuses(false)}
                    />
                    <img
                        src={MobileCharacter}
                        alt='character'
                        className={styles.mobileSlotComponent_character}
                    />
                    <div
                        className={styles.slot_text}
                        style={showText ? { opacity: 1 } : { opacity: 0 }}
                    >
                        <div>
                            <p>{text}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
