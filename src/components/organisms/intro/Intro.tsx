import React, { useEffect, useState } from 'react';
import { LoadingBar } from 'components/atoms/loadingBar/LoadingBar';
import { LoadingCharacter } from 'assets/png';
import styles from './intro.module.scss';

interface IIntro {
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const LOADING_SPEED:number = 100

export const Intro: React.FC<IIntro> = ({ setStep }) => {
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
        <div className={styles.intro}>
            <img src={LoadingCharacter} alt='loadingCaracter' />
            <div>
                <LoadingBar progress={currentProgress} />
            </div>
        </div>
    );
};
