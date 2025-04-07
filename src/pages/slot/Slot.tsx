import React, { useEffect, useState } from 'react';
import { Slot as SlotComponent } from 'components/organisms/slot/Slot';
import { Intro } from 'components/organisms/intro/Intro';
import { GameDescription } from 'assets/png';
import { MobileIntro } from 'components/organisms/mobileIntro/MobileIntro';
import { MobileInfoSlider } from 'components/molecules/mobileInfoSlider/MobileInfoSlider';
import { MobileSlotComponent } from 'components/organisms/mobileSlotComponent/MobileSlotComponent';
import styles from './slot.module.scss';

const Slot: React.FC = () => {
    const [step, setStep] = useState<number>(2);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, [window.innerWidth]);

    return (
        <>
            {!isMobile ? (
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
            ) : (
                <div className={styles.mobile}>
                    {
                        {
                            0: <MobileIntro setStep={setStep} />,
                            1: <MobileInfoSlider setStep={setStep}/>,
                            2: <MobileSlotComponent />,
                        }[step]
                    }
                </div>
            )}
        </>
    );
};

export default Slot;
