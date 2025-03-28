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
} from 'assets/png';

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

const RAID_ITEM_LIST: string[] = [
    // Wild,
    // Raid,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
    GrayChip,
];

export const viewGenerator = (raws: number, cols: number, withGrayCips?: boolean): string[][] => {
    if (withGrayCips) {
        return Array.from({ length: raws }, () =>
            Array.from(
                { length: cols },
                () => RAID_ITEM_LIST[Math.floor(Math.random() * RAID_ITEM_LIST.length)],
            ),
        );
    }

    return Array.from({ length: raws }, () =>
        Array.from({ length: cols }, () => ITEM_LIST[Math.floor(Math.random() * ITEM_LIST.length)]),
    );
};
