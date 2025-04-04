import React from 'react';
import { BonusFeatures, ClipGaming, MobileGolden, MobileI, MobileRaid } from 'assets/png';
import { EBonuses } from 'utils/types/slotActions';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import styles from './mobileInfoSlider.module.scss';
import 'swiper/css';
import 'swiper/css/autoplay';

interface IMobileInfoSlider {
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const BONUS_DETAILS = {
    [EBonuses.GOLDEN]: MobileGolden,
    [EBonuses.INTERROGATION]: MobileI,
    [EBonuses.RAID]: MobileRaid,
};

export const MobileInfoSlider: React.FC<IMobileInfoSlider> = ({ setStep }) => {
    return (
        <div onClick={() => setStep((prev) => prev + 1)} className={styles.mobileInfoSlider}>
            <div className={styles.mobileInfoSlider_blur} />
            <img src={ClipGaming} alt='logo' />
            <img src={BonusFeatures} alt="features" />
            <Swiper
                modules={[Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                }}
                className={styles.swiper}
            >
                {Object.entries(BONUS_DETAILS).map(([key, image]) => (
                    <SwiperSlide key={key}>
                        <img src={image} alt='bonus' className={styles.swiper_image}/>
                    </SwiperSlide>
                ))}
            </Swiper>
            <span>CLICK TO CONTINUE</span>
        </div>
    );
};
