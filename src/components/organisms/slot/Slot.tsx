import React, { useEffect, useRef, useState } from 'react';
import { SlotButtons } from 'components/molecules/slotButtons/SlotButtons';
import { SlotView } from 'components/molecules/slotView/SlotView';
import { ESlotActions } from 'utils/types/slotActions';
import { ISlotData } from 'utils/types/slot';
import myVideo from '../../../assets/mp4/main_interface_1.mp4';
import { BonusModal } from 'components/molecules/bonusModal/BonusModal';
import { Modal } from 'components/molecules/modal/Modal';
import styles from './slot.module.scss';

export const Slot: React.FC = () => {
    const [action, setAction] = useState<ESlotActions>(ESlotActions.PAUSE);
    const [isOpenBonuses, setIsOpenBonuses] = useState<boolean>(false);
    const [slotData, setSlotData] = useState<ISlotData>({
        betValue: 1,
        balance: 4000,
    });
    const hasPausedOnce = useRef(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (action === ESlotActions.PAUSE) {
            if (hasPausedOnce.current && videoRef.current) {
                videoRef.current.play();
            }
            hasPausedOnce.current = true;
        } else if (action === ESlotActions.BUY_BONUS) {
            setIsOpenBonuses(true);
        }
    }, [action]);

    return (
        <div className={styles.slot}>
            <video ref={videoRef} className={styles.slot_video}>
                <source src={myVideo} type='video/mp4' />
                Your browser does not support the video tag.
            </video>
            <SlotView action={action} />
            <SlotButtons setAction={setAction} slotData={slotData} setSlotData={setSlotData} />
            <Modal
                children={<BonusModal setIsOpenBonuses={setIsOpenBonuses}/>}
                isOpen={isOpenBonuses}
                onClose={() => setIsOpenBonuses(false)}
            />
        </div>
    );
};
