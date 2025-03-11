import { BlueChip, BonusChair, GoldenChip, GreenChip, Man, Man2, Man3, PurpleChip, Raid, RedChip, Wild, Women } from "assets/png"

const ITEM_LIST: string[] = [BlueChip, BonusChair, GoldenChip, GreenChip, PurpleChip, RedChip, Wild, Man, Man2, Man3, Women, Raid];

export const viewGenerator = (rows: number, cols: number): string[][] => {
    const data: string[][] = [];
    
    for (let i = 0; i < rows; i++) {
        const row: string[] = [];
        for (let j = 0; j < cols; j++) {
            const randomItem: string = ITEM_LIST[Math.floor(Math.random() * ITEM_LIST.length)];
            row.push(randomItem);
        }
        data.push(row);
    }

    return data;
}