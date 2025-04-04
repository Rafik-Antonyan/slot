import React from 'react';
import { ISlotData } from 'utils/types/slot';
import { ESlotActions } from 'utils/types/slotActions';

interface ISlotButtons {
    slotData: ISlotData;
    setAction: React.Dispatch<React.SetStateAction<ESlotActions>>;
    setSlotData: React.Dispatch<React.SetStateAction<ISlotData>>;
}

export const MobileSlotButtons: React.FC<ISlotButtons> = ({ slotData, setAction, setSlotData }) => {
    return <div>
        
    </div>;
};
