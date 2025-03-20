import React, { useState, useRef, useEffect } from 'react';
import { EBonuses } from 'utils/types/slotActions';
import { BonusInfo } from 'components/molecules/bonusInfo/BonusInfo';
import { BonusSlot } from 'components/molecules/bonusSlot/BonusSlot';
import ROULETTE from '../../../assets/mp4/roulette.mp4';
import styles from './bonusRound.module.scss';

interface IBonusRound {
    selectedBonus: EBonuses;
    setSelectedBonus: React.Dispatch<React.SetStateAction<EBonuses | null>>;
}

export const BonusRound: React.FC<IBonusRound> = ({ selectedBonus, setSelectedBonus }) => {
    const [step, setStep] = useState<number>(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (step === 1 && videoRef.current) {
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
                    0: <BonusInfo />,
                    2: (
                        <BonusSlot
                            selectedBonus={selectedBonus}
                            setSelectedBonus={setSelectedBonus}
                        />
                    ),
                }[step]
            }
             <video
                            ref={videoRef}
                            src={ROULETTE}
                            className={styles.video}
                            onEnded={handleVideoEnd}
                            playsInline
                            muted
                        />
        </div>
    );
};
