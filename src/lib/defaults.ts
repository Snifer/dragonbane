import { uid } from 'quasar';
import type {
  ICharacter,
  Attr,
  Condition,
  ISkill,
  IAttribute,
  IWeapon,
  IAbility,
  ISpell,
} from '../components/models';

export const NewCharacter = (): ICharacter => ({
  id: uid(),
  name: 'New character',
  kin: '',
  age: 'Adult',
  profession: '',
  weakness: '',
  appearance: '',
  movement: 10,
  hp: {
    max: 0,
    current: 0,
  },
  wp: {
    max: 0,
    current: 0,
  },
  abilities: [],
  spells: [],
  inventory: [],
  backpack: false,
  memento: '',
  tinyItems: '',
  money: {
    gold: 0,
    silver: 0,
    copper: 0,
  },
  attributes: {
    'STR': stat('Exhausted'),
    'CON': stat('Sickly'),
    'AGL': stat('Dazed'),
    'INT': stat('Angry'),
    'WIL': stat('Scared'),
    'CHA': stat('Disheartened'),
  },
  priSkills: {
    Acrobatics: skill('AGL'),
    Awareness: skill('INT'),
    Bartering: skill('CHA'),
    'Beast Lore': skill('INT'),
    Bluffing: skill('CHA'),
    Bushcraft: skill('INT'),
    Crafting: skill('STR'),
    Evade: skill('AGL'),
    Healing: skill('INT'),
    'Hunting & Fishing': skill('AGL'),
    Languages: skill('INT'),
    'Myths & Legends': skill('INT'),
    Performance: skill('CHA'),
    Persuasion: skill('CHA'),
    Riding: skill('AGL'),
    Seamanship: skill('INT'),
    'Sleight of Hand': skill('AGL'),
    Sneaking: skill('AGL'),
    'Spot Hidden': skill('INT'),
    Swimming: skill('AGL'),
  },
  wepSkills: {
    Axes: skill('STR'),
    Bows: skill('AGL'),
    Brawling: skill('STR'),
    Crossbows: skill('AGL'),
    Hammers: skill('STR'),
    Knives: skill('AGL'),
    Slings: skill('AGL'),
    Spears: skill('STR'),
    Staves: skill('AGL'),
    Swords: skill('STR'),
  },
  secSkills: {},
  armour: {
    name: '',
    rating: 0,
    bane: {
      Sneaking: false,
      Evade: false,
      Acrobatics: false,
    },
  },
  helmet: {
    name: '',
    rating: 0,
    bane: {
      Awareness: false,
      'Ranged Attacks': false,
    },
  },
  weapons: [],
});

export const skill = (attr: Attr): ISkill => ({
  attr,
  trained: false,
  checked: false,
  advances: 0,
});

export const stat = (cond: Condition): IAttribute => ({
  score: 0,
  condition: {
    name: cond,
    check: false,
  },
});

export const NewWeapon = (): IWeapon => ({
  name: '',
  grip: '-',
  range: '',
  damage: '',
  durability: 0,
  features: '',
});

export const NewAbility = (): IAbility => ({
  name: '',
  wp: 0,
  text: '',
});

export const NewSpell = (): ISpell => ({
  name: '',
  rank: 0,
  req: [],
  time: '',
  range: '',
  duration: 'Instant',
  text: '',
  prepared: false,
});

export const BaseChance = (n: number): number => {
  if (n <= 5) return 3;
  if (n <= 8) return 4;
  if (n <= 12) return 5;
  if (n <= 15) return 6;
  if (n <= 18) return 7;
  else return 0;
};

export const DmgBonus = (n: number): string => {
  if (n <= 12) return '-';
  if (n <= 16) return '+D4';
  if (n >= 17) return '+D6';
  else return '-';
};
