import React, { useEffect, useState } from 'react';
import { LoadingBar } from 'components/atoms/loadingBar/LoadingBar';
import { MobileLoading } from 'assets/png';
import styles from './mobileIntro.module.scss';

interface IMobileIntro {
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const LOADING_SPEED: number = 100;

export const MobileIntro: React.FC<IMobileIntro> = ({ setStep }) => {
    const [currentProgress, setCurrentProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentProgress((prev) => {
                if (prev >= 100) {
                    setStep((prev) => prev + 1);
                }

                return prev + 1;
            });
        }, LOADING_SPEED);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.mobileIntro}>
            <img src={MobileLoading} alt='loadingCaracter' />
            <div>
                <LoadingBar progress={currentProgress} />
            </div>
        </div>
    );
};
