import React, { useState, useRef, useEffect } from 'react';
import { EBonuses } from 'utils/types/slotActions';
import { BonusInfo } from 'components/molecules/bonusInfo/BonusInfo';
import { BonusSlot } from 'components/molecules/bonusSlot/BonusSlot';
import ROULETTE from '../../../assets/mp4/roulette.mp4';
import RAID from '../../../assets/mp4/raid_animation.mp4';
import CHAIT from '../../../assets/mp4/chair_animation.mp4';
import styles from './bonusRound.module.scss';
import { ISlotData } from 'utils/types/slot';

const BONUS_VIDEO = {
    [EBonuses.GOLDEN]: ROULETTE,
    [EBonuses.INTERROGATION]: CHAIT,
    [EBonuses.RAID]: RAID,
};

interface IBonusRound {
    selectedBonus: EBonuses;
    slotData: ISlotData;
    setSlotData: React.Dispatch<React.SetStateAction<ISlotData>>;
    setSelectedBonus: React.Dispatch<React.SetStateAction<EBonuses | null>>;
    setIsDoneInitialSpin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BonusRound: React.FC<IBonusRound> = ({
    selectedBonus,
    slotData,
    setSlotData,
    setSelectedBonus,
    setIsDoneInitialSpin,
}) => {
    const [step, setStep] = useState<number>(0);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleVideoEnd = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                if (isMobile && selectedBonus === EBonuses.RAID) {
                    video.currentTime = 0;
                    video.pause();
                }
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
        }
        setStep(2);
    };

    useEffect(() => {
        if (step === 1 && videoRef.current) {
            videoRef.current.style.filter = 'blur(0px)';
            videoRef.current.play();
        }
    }, [step]);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, [window.innerWidth]);

    return (
        <div className={styles.bonusRound} onClick={() => step === 0 && setStep(1)}>
            {
                {
                    0: <BonusInfo selectedBonus={selectedBonus} />,
                    2: (
                        <BonusSlot
                            selectedBonus={selectedBonus}
                            slotData={slotData}
                            setSlotData={setSlotData}
                            setSelectedBonus={setSelectedBonus}
                            setIsDoneInitialSpin={setIsDoneInitialSpin}
                        />
                    ),
                }[step]
            }
            <canvas
                ref={canvasRef}
                style={{
                    display:
                        step === 2 && isMobile && selectedBonus === EBonuses.RAID
                            ? 'block'
                            : 'none',
                }}
            />
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
