import { BlueChip, BonusChair, GoldenChip, GreenChip, Man, Man2, Man3, PurpleChip, Raid, RedChip, Wild, Women } from "assets/png";

const ITEM_LIST: string[] = [BlueChip, BonusChair, GoldenChip, GreenChip, PurpleChip, RedChip, Wild, Man, Man2, Man3, Women, Raid];

export const viewGenerator = (raws: number, cols:number): string[][] => {
  return Array.from({ length: raws }, () =>
    Array.from({ length: cols }, () => ITEM_LIST[Math.floor(Math.random() * ITEM_LIST.length)])
  );
};