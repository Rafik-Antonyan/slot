import React, { useEffect } from 'react';
import { AutoBonus, BuyBonus, MenuButton, Spin, SpinAgain } from 'assets/png';
import { Bet } from 'components/atoms/bet/Bet';
import { ESlotActions } from 'utils/types/slotActions';
import { ISlotData } from 'utils/types/slot';
import { AutoSpinModal } from 'components/atoms/autoSpinModal/AutoSpinModal';
import { useOutsideClick } from 'hooks/useOutSideClick';
import styles from './slotButtons.module.scss';

interface ISlotButtons {
    slotData: ISlotData;
    setAction: React.Dispatch<React.SetStateAction<ESlotActions>>;
    setSlotData: React.Dispatch<React.SetStateAction<ISlotData>>;
}

export const SlotButtons: React.FC<ISlotButtons> = ({ setAction, slotData, setSlotData }) => {
    const [isOpenReply, setIsOpenReply] = React.useState<boolean>(false);
    const replyRef = React.useRef<HTMLDivElement>(null);

    const onClickButton = (value: ESlotActions) => {
        if (value === ESlotActions.PLAY) {
            setAction(value);
            setSlotData((prev) => ({
                ...prev,
                balance: prev.balance - slotData.betValue,
            }));
            setTimeout(() => {
                setAction(ESlotActions.PAUSE);
            }, 1000);
        }
    };

    useOutsideClick(replyRef, () => setIsOpenReply(false));

    useEffect(() => {
        if (slotData.autoSpins) {
            setIsOpenReply(false);
        }
    }, [slotData.autoSpins]);

    return (
        <div className={styles.slotButtons}>
            <div className={styles.slotButtons_bonus}>
                <img src={AutoBonus} alt='auto_bonus' />
                <img
                    src={BuyBonus}
                    alt='buy_bonus'
                    onClick={() => setAction(ESlotActions.BUY_BONUS)}
                />
                <img src={MenuButton} alt='menu' />
            </div>
            <div className={styles.slotButtons_play}>
                <div className={styles.slotButtons_play_balance}>
                    <div>
                        <p>BALANCE</p>
                        <span>€{slotData.balance}</span>
                    </div>
                    <div>
                        <p>WIN</p>
                        <span>€0.00</span>
                    </div>
                </div>
                <div className={styles.slotButtons_play_spin} ref={replyRef}>
                    <Bet
                        slotData={slotData}
                        setSlotData={setSlotData}
                        disabled={!!slotData.autoSpins}
                    />
                    {slotData.autoSpins ? (
                        <div className={styles.slotButtons_play_spin_count} onClick={() => setSlotData((prev) => ({ ...prev, autoSpins: 0 }))}>
                            <p>{slotData.autoSpins}</p>
                        </div>
                    ) : (
                        <img
                            src={Spin}
                            alt='spin'
                            className={styles.spin}
                            onClick={() => onClickButton(ESlotActions.PLAY)}
                        />
                    )}
                    <button onClick={() => setIsOpenReply((prev) => !prev)} disabled={!!slotData.autoSpins}>
                        <img src={SpinAgain} alt='spin_again' />
                    </button>
                    {isOpenReply && <AutoSpinModal setSlotData={setSlotData} />}
                </div>
            </div>
        </div>
    );
};
