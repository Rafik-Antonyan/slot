import React from 'react';
import { CleanGoldenChip } from 'assets/png';
import styles from './bonusInfo.module.scss';

export const BonusInfo: React.FC = () => {
    return (
        <div className={styles.bonusInfo}>
            <img src={CleanGoldenChip} alt='bonus' />
            <div className={styles.bonusInfo_container}>
                <h3>GOLDEN CHIP</h3>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus,
                    tempora reiciendis voluptatibus sunt quasi similique qui animi asperiores
                    excepturi exercitationem tempore voluptatum nobis deleniti nisi, iure deserunt
                    nostrum sapiente dicta!
                </p>
            </div>
            <p>Click to continue!</p>
        </div>
    );
};
