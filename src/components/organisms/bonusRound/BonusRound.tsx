import React, { useState, useRef, useEffect } from 'react';
import { EBonuses } from 'utils/types/slotActions';
import { BonusInfo } from 'components/molecules/bonusInfo/BonusInfo';
import { BonusSlot } from 'components/molecules/bonusSlot/BonusSlot';
import ROULETTE from '../../../assets/mp4/roulette.mp4';
import RAID from '../../../assets/mp4/raid_animation.mp4';
import CHAIT from '../../../assets/mp4/chair_animation.mp4';
import styles from './bonusRound.module.scss';

const BONUS_VIDEO = {
    [EBonuses.GOLDEN]: ROULETTE,
    [EBonuses.INTERROGATION]: CHAIT,
    [EBonuses.RAID]: RAID,
}

interface IBonusRound {
    selectedBonus: EBonuses;
    setSelectedBonus: React.Dispatch<React.SetStateAction<EBonuses | null>>;
    setIsDoneInitialSpin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BonusRound: React.FC<IBonusRound> = ({ selectedBonus, setSelectedBonus, setIsDoneInitialSpin }) => {
    const [step, setStep] = useState<number>(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (step === 1 && videoRef.current) {
            videoRef.current.style.filter = 'blur(0px)';
            videoRef.current.play();
        } 
    }, [step]);

    const handleVideoEnd = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.drawImage(
                    videoRef.current,
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height,
                );
            }
        }
        setStep(2);
    };

    return (
        <div className={styles.bonusRound} onClick={() => step === 0 && setStep(1)}>
            {
                {
                    0: <BonusInfo selectedBonus={selectedBonus} />,
                    2: (
                        <BonusSlot
                            selectedBonus={selectedBonus}
                            setSelectedBonus={setSelectedBonus}
                            setIsDoneInitialSpin={setIsDoneInitialSpin}
                        />
                    ),
                }[step]
            }
            <video
                ref={videoRef}
                src={BONUS_VIDEO[selectedBonus]}
                className={styles.video}
                onEnded={handleVideoEnd}
                playsInline
                muted
            />
        </div>
    );
};
