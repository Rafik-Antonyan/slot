import {
    BlueChip,
    BonusChair,
    GoldenChip,
    GreenChip,
    Man,
    Man2,
    Man3,
    PurpleChip,
    Raid,
    RedChip,
    Wild,
    Women,
    GrayChip,
    ExpanedWild,
    Miltiple,
} from 'assets/png';
import { EBonuses } from 'utils/types/slotActions';

const BONUS_SYMBOLS = {
    [EBonuses.GOLDEN]: GoldenChip,
    [EBonuses.INTERROGATION]: ExpanedWild,
    [EBonuses.RAID]: Raid,
};

const ITEMS_WITHOUT_BONUS: string[] = [
    BlueChip,
    GreenChip,
    PurpleChip,
    RedChip,
    Wild,
    Man,
    Man2,
    Man3,
    Women,
];

const ITEM_LIST: string[] = [
    BlueChip,
    BonusChair,
    GoldenChip,
    GreenChip,
    PurpleChip,
    RedChip,
    Wild,
    Man,
    Man2,
    Man3,
    Women,
    Raid,
];

const BONUS_ITEM_LIST: string[] = [
    BlueChip,
    GreenChip,
    PurpleChip,
    RedChip,
    Man,
    Man2,
    Man3,
    Women,
];

const RAID_ITEM_LIST: string[] = [
    Wild,
    Miltiple,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
];

export const viewGenerator = (
    raws: number,
    cols: number,
    selectedRound?: EBonuses | null,
    withGrayCips?: boolean,
): string[][] => {
    if (selectedRound && !BONUS_ITEM_LIST.includes(BONUS_SYMBOLS[selectedRound])) {
        BONUS_ITEM_LIST.push(BONUS_SYMBOLS[selectedRound]);
    }

    if (withGrayCips) {
        return Array.from({ length: raws }, () =>
            Array.from(
                { length: cols },
                () => RAID_ITEM_LIST[Math.floor(Math.random() * RAID_ITEM_LIST.length)],
            ),
        );
    }

    if (selectedRound) {
        return Array.from({ length: raws }, () =>
            Array.from(
                { length: cols },
                () => BONUS_ITEM_LIST[Math.floor(Math.random() * BONUS_ITEM_LIST.length)],
            ),
        );
    }

    return Array.from({ length: raws }, () =>
        Array.from({ length: cols }, () => ITEM_LIST[Math.floor(Math.random() * ITEM_LIST.length)]),
    );
};

const BONUS_INITIAL_VIEW = {
    [EBonuses.GOLDEN]: Array.from({ length: 3 }, () => GoldenChip),
    [EBonuses.INTERROGATION]: Array.from({ length: 3 }, () => BonusChair),
    [EBonuses.RAID]: Array.from({ length: 3 }, () => Raid),
};

export const generateInitialBonusview = (view: string[][], selectedBonus: EBonuses): string[][] => {
    const generatedBonusArray: string[] = Array.from(
        { length: 17 },
        () => ITEMS_WITHOUT_BONUS[Math.floor(Math.random() * ITEMS_WITHOUT_BONUS.length)],
    );
    generatedBonusArray.push(...BONUS_INITIAL_VIEW[selectedBonus]);
    generatedBonusArray.sort(() => Math.random() - 0.5);
    const finalView: string[][] = Array.from({ length: 5 }, (_, i) =>
        generatedBonusArray.slice(i * 4, (i + 1) * 4),
    );
    const initialBonusview = view.map((row, index) => [...finalView[index], ...row.slice(4)]);

    return initialBonusview;
};
