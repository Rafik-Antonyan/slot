import React from 'react';
import { Slot as SlotComponent } from 'components/organisms/slot/Slot';
import styles from './slot.module.scss';

const Slot: React.FC = () => {
    return (
        <div className={styles.slot}>
            <SlotComponent />
        </div>
    );
};

export default Slot;
