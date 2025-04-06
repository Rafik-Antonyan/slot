import React from "react";
import { EActions } from "utils/types/bet";
import { ISlotData } from "utils/types/slot";

export const changeBet = (action: EActions, setState:React.Dispatch<React.SetStateAction<ISlotData>>) => {
    setState(prev => {
        let newValue = prev.betValue;

        if (action === EActions.INCREMENT) {
            if (newValue >= 1 && newValue < 10) newValue += 1;
            else if (newValue >= 10 && newValue < 50) newValue += 5;
            else if (newValue >= 50 && newValue < 100) newValue += 10;
        } else if (action === EActions.DECREMENT) {
            if (newValue > 1 && newValue <= 10) newValue -= 1;
            else if (newValue > 10 && newValue <= 50) newValue -= 5;
            else if (newValue > 50 && newValue <= 100) newValue -= 10;
        }

        newValue = Math.max(1, newValue);

        return { ...prev, betValue: newValue };
    });
};