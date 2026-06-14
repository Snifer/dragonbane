import type { ITable } from '../components/models';
import { parseDiceString, rollDice } from './util';

export const rollTable = (t: ITable): string | undefined => {
  const n = rollDice(parseDiceString(t.dice));

  return t.rows.find((row) => {
    if (n.total == row.floor) return row;
    if (row.ceil && n.total >= row.floor && n.total <= row.ceil) return row;
  })?.text;
};

export const MeleeDemon: ITable = {
  dice: '1d6',
  rows: [
    { floor: 1, text: 'table.meleeDemon.1' },
    { floor: 2, text: 'table.meleeDemon.2' },
    { floor: 3, text: 'table.meleeDemon.3' },
    { floor: 4, text: 'table.meleeDemon.4' },
    { floor: 5, text: 'table.meleeDemon.5' },
    { floor: 6, text: 'table.meleeDemon.6' },
  ],
};

export const RangedDemon: ITable = {
  dice: '1d6',
  rows: [
    { floor: 1, text: 'table.rangedDemon.1' },
    { floor: 2, text: 'table.rangedDemon.2' },
    { floor: 3, text: 'table.rangedDemon.3' },
    { floor: 4, text: 'table.rangedDemon.4' },
    { floor: 5, text: 'table.rangedDemon.5' },
    { floor: 6, text: 'table.rangedDemon.6' },
  ],
};

export const MagicalMishap: ITable = {
  dice: '1d20',
  rows: [
    { floor: 1, text: 'table.magicalMishap.1' },
    { floor: 2, text: 'table.magicalMishap.2' },
    { floor: 3, text: 'table.magicalMishap.3' },
    { floor: 4, text: 'table.magicalMishap.4' },
    { floor: 5, text: 'table.magicalMishap.5' },
    { floor: 6, text: 'table.magicalMishap.6' },
    { floor: 7, text: 'table.magicalMishap.7' },
    { floor: 8, text: 'table.magicalMishap.8' },
    { floor: 9, text: 'table.magicalMishap.9' },
    { floor: 10, text: 'table.magicalMishap.10' },
    { floor: 11, text: 'table.magicalMishap.11' },
    { floor: 12, text: 'table.magicalMishap.12' },
    { floor: 13, text: 'table.magicalMishap.13' },
    { floor: 14, text: 'table.magicalMishap.14' },
    { floor: 15, text: 'table.magicalMishap.15' },
    { floor: 16, text: 'table.magicalMishap.16' },
    { floor: 17, text: 'table.magicalMishap.17' },
    { floor: 18, text: 'table.magicalMishap.18' },
    { floor: 19, text: 'table.magicalMishap.19' },
    { floor: 20, text: 'table.magicalMishap.20' },
  ],
};
