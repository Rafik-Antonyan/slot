import React, { useEffect, useRef, useState } from 'react';
import { SlotButtons } from 'components/molecules/slotButtons/SlotButtons';
import { SlotView } from 'components/molecules/slotView/SlotView';
import { EBonuses, ESlotActions } from 'utils/types/slotActions';
import { ISlotData } from 'utils/types/slot';
import { BonusModal } from 'components/molecules/bonusModal/BonusModal';
import { Modal } from 'components/molecules/modal/Modal';
import { BonusRound } from 'components/organisms/bonusRound/BonusRound';
import myVideo from '../../../assets/mp4/main_interface.mp4';
import { MMM } from 'assets/png';
import styles from './slot.module.scss';

const PERSONAGE_TEXTS:string[] = ["Nope, the win’s going to someone else", "You Suck", "Ever think that maybe this slow doesnt like you", "If Bad Luck was a profession, you’d be an expert"]

export const Slot: React.FC = () => {
    const [action, setAction] = useState<ESlotActions>(ESlotActions.PAUSE);
    const [isOpenBonuses, setIsOpenBonuses] = useState<boolean>(false);
    const [selectedBonus, setSelectedBonus] = useState<EBonuses | null>(null);
    const [isDoneInitialSpin, setIsDoneInitialSpin] = useState<boolean>(false);
    const [showText, setShowText] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [slotData, setSlotData] = useState<ISlotData>({
        betValue: 1,
        balance: 4000,
    });
    const hasPausedOnce = useRef(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (action === ESlotActions.PAUSE) {
            if (hasPausedOnce.current && videoRef.current) {
                setText(PERSONAGE_TEXTS[Math.floor(Math.random() * 4)])
                setTimeout(() => {
                    videoRef.current!.play();
                    setShowText(true);
                }, 2000);
                setTimeout(() => {
                    setShowText(false);
                }, 4000);
            }
            hasPausedOnce.current = true;
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
        <div className={styles.slot}>
            {selectedBonus && isDoneInitialSpin ? (
                <BonusRound
                    selectedBonus={selectedBonus}
                    setSelectedBonus={setSelectedBonus}
                    setIsDoneInitialSpin={setIsDoneInitialSpin}
                />
            ) : (
                <>
                    <video ref={videoRef} className={styles.slot_video}>
                        <source src={myVideo} type='video/mp4' />
                        Your browser does not support the video tag.
                    </video>
                    <SlotView
                        action={action}
                        selectedBonus={selectedBonus}
                        isDoneInitialSpin={isDoneInitialSpin}
                        setSelectedBonus={setSelectedBonus}
                    />
                    <SlotButtons
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
                    <div
                        className={styles.slot_text}
                        style={showText ? { opacity: 1 } : { opacity: 0 }}
                    >
                        <div>
                            <p>{text}</p>
                        </div>
                        <img src={MMM} alt='mmm' />
                    </div>
                </>
            )}
        </div>
    );
};
