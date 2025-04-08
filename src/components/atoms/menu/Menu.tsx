import React, { useState } from 'react';
import { InfoIcon, MusicIcon, SoundIcon } from 'assets/png';
import { IMenuItem } from 'utils/types/slot';
import styles from './menu.module.scss';

export const Menu: React.FC = () => {
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([
        { image: SoundIcon, label: 'SOUND', selected: false },
        { image: MusicIcon, label: 'MUSIC', selected: false },
        { image: InfoIcon, label: 'INFO', selected: false },
    ]);

    const changeSelected = (index: number) =>{
        menuItems[index].selected = !menuItems[index].selected
        setMenuItems(menuItems)
    }

    return <div className={styles.menu}>
        {menuItems.map((item:IMenuItem, index:number) => {
            return <div key={index} onClick={() => changeSelected(index)}>
                <img src={item.image} alt={item.label}/>
                <p>{item.label}</p>
            </div>
        })}
    </div>;
};
