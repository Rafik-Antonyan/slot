import React, { useEffect } from 'react';
import { AutoBonus, BuyBonus, MenuButton, Spin, SpinAgain } from 'assets/png';
import { ISlotData } from 'utils/types/slot';
import { ESlotActions } from 'utils/types/slotActions';
import styles from './mobileSlotButtons.module.scss';
import { EActions } from 'utils/types/bet';
import { changeBet } from 'utils/bets/calculator';
import { useOutsideClick } from 'hooks/useOutSideClick';
import { AutoSpinModal } from 'components/atoms/autoSpinModal/AutoSpinModal';
import { Menu } from 'components/atoms/menu/Menu';

interface ISlotButtons {
    slotData: ISlotData;
    setAction: React.Dispatch<React.SetStateAction<ESlotActions>>;
    setSlotData: React.Dispatch<React.SetStateAction<ISlotData>>;
}

export const MobileSlotButtons: React.FC<ISlotButtons> = ({ slotData, setAction, setSlotData }) => {
    const [isOpenReply, setIsOpenReply] = React.useState<boolean>(false);
    const [isOpenMenu, setIsOpenMenu] = React.useState<boolean>(false);

    const replyRef = React.useRef<HTMLDivElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

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

    useOutsideClick(menuRef, () => setIsOpenMenu(false));
    useOutsideClick(replyRef, () => setIsOpenReply(false));

    useEffect(() => {
        if (slotData.autoSpins) {
            setIsOpenReply(false);
        }
    }, [slotData.autoSpins]);

    return (
        <div className={styles.mobileSlotButtons} ref={replyRef}>
            <div className={styles.mobileSlotButtons_left} ref={menuRef}>
                <img src={AutoBonus} alt='autoBonus' />
                <img
                    src={BuyBonus}
                    alt='buyBonus'
                    onClick={() => setAction(ESlotActions.BUY_BONUS)}
                />
                <img src={MenuButton} alt='menu' onClick={() => setIsOpenMenu((prev) => !prev)} />
                {isOpenMenu && <Menu />}
            </div>
            <div className={styles.mobileSlotButtons_bottom}>
                <div>
                    <p>BALANCE</p>
                    <span>€{slotData.balance.toFixed(2)}</span>
                </div>
                <div>
                    <p>BET</p>
                    <span>€{slotData.betValue.toFixed(2)}</span>
                </div>
                <div>
                    <p>WIN</p>
                    <span>€0.00</span>
                </div>
            </div>
            <div className={styles.mobileSlotButtons_bets}>
                <div>
                    <button
                        onClick={() => changeBet(EActions.DECREMENT, setSlotData)}
                        disabled={slotData.autoSpins !== 0}
                    >
                        -
                    </button>
                    <button
                        onClick={() => changeBet(EActions.INCREMENT, setSlotData)}
                        disabled={slotData.autoSpins !== 0}
                    >
                        +
                    </button>
                </div>
                {slotData.autoSpins ? (
                    <div
                        className={styles.mobileSlotButtons_bets_count}
                        onClick={() => setSlotData((prev) => ({ ...prev, autoSpins: 0 }))}
                    >
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
            </div>
            <button
                className={styles.mobileSlotButtons_reply}
                onClick={() => setIsOpenReply((prev) => !prev)}
                disabled={slotData.autoSpins !== 0}
            >
                <img src={SpinAgain} alt='reply' />
            </button>
            {isOpenReply && <AutoSpinModal setSlotData={setSlotData} />}
        </div>
    );
};
