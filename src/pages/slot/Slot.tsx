import React, { useState } from 'react';
import { Slot as SlotComponent } from 'components/organisms/slot/Slot';
import { Intro } from 'components/organisms/intro/Intro';
import { GameDescription } from 'assets/png';
import styles from './slot.module.scss';

const Slot: React.FC = () => {
    const [step, setStep] = useState<number>(0);

    return (
        <div className={styles.slot}>
            {
                {
                    0: <Intro setStep={setStep} />,
                    1: (
                        <img
                            src={GameDescription}
                            alt='game_desc'
                            onClick={() => setStep((prev) => prev + 1)}
                        />
                    ),
                    2: <SlotComponent />,
                }[step]
            }
        </div>
    );
};

export default Slot;
