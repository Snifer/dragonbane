import { Ages, Conditions, Durations, SpellReqs, type Age, type Condition, type Duration, type Locale, type SpellReq } from '../components/models';

export const localeOptions: { labelKey: string; value: Locale }[] = [
  { labelKey: 'locale.enUS', value: 'en-US' },
  { labelKey: 'locale.esAR', value: 'es-AR' },
];

export const ageOptions = Object.values(Ages);
export const durationOptions = Object.values(Durations);
export const spellReqOptions = Object.values(SpellReqs);

export const skillTranslationKeys: Record<string, string> = {
  Acrobatics: 'acrobatics',
  Awareness: 'awareness',
  Bartering: 'bartering',
  'Beast Lore': 'beastLore',
  Bluffing: 'bluffing',
  Bushcraft: 'bushcraft',
  Crafting: 'crafting',
  Evade: 'evade',
  Healing: 'healing',
  'Hunting & Fishing': 'huntingFishing',
  Languages: 'languages',
  'Myths & Legends': 'mythsLegends',
  Performance: 'performance',
  Persuasion: 'persuasion',
  Riding: 'riding',
  Seamanship: 'seamanship',
  'Sleight of Hand': 'sleightOfHand',
  Sneaking: 'sneaking',
  'Spot Hidden': 'spotHidden',
  Swimming: 'swimming',
  Axes: 'axes',
  Bows: 'bows',
  Brawling: 'brawling',
  Crossbows: 'crossbows',
  Hammers: 'hammers',
  Knives: 'knives',
  Slings: 'slings',
  Spears: 'spears',
  Staves: 'staves',
  Swords: 'swords',
};

export const skillLabelKey = (skill: string): string | null => {
  const key = skillTranslationKeys[skill];
  return key ? `skill.${key}` : null;
};

const legacyAgeMap: Record<string, Age> = {
  Young: Ages.Young,
  young: Ages.Young,
  Adult: Ages.Adult,
  adult: Ages.Adult,
  Old: Ages.Old,
  old: Ages.Old,
};

const legacyConditionMap: Record<string, Condition> = {
  Exhausted: Conditions.Exhausted,
  exhausted: Conditions.Exhausted,
  Sickly: Conditions.Sickly,
  sickly: Conditions.Sickly,
  Dazed: Conditions.Dazed,
  dazed: Conditions.Dazed,
  Angry: Conditions.Angry,
  angry: Conditions.Angry,
  Scared: Conditions.Scared,
  scared: Conditions.Scared,
  Disheartened: Conditions.Disheartened,
  disheartened: Conditions.Disheartened,
};

const legacyDurationMap: Record<string, Duration> = {
  Instant: Durations.Instant,
  instant: Durations.Instant,
  Round: Durations.Round,
  round: Durations.Round,
  Stretch: Durations.Stretch,
  stretch: Durations.Stretch,
  Shift: Durations.Shift,
  shift: Durations.Shift,
  Concentration: Durations.Concentration,
  concentration: Durations.Concentration,
};

const legacySpellReqMap: Record<string, SpellReq> = {
  Word: SpellReqs.Word,
  word: SpellReqs.Word,
  Gesture: SpellReqs.Gesture,
  gesture: SpellReqs.Gesture,
  Focus: SpellReqs.Focus,
  focus: SpellReqs.Focus,
  Ingredient: SpellReqs.Ingredient,
  ingredient: SpellReqs.Ingredient,
};

export const migrateAge = (value: string | undefined): Age => legacyAgeMap[value ?? ''] ?? Ages.Adult;
export const migrateCondition = (value: string | undefined): Condition =>
  legacyConditionMap[value ?? ''] ?? Conditions.Exhausted;
export const migrateDuration = (value: string | undefined): Duration =>
  legacyDurationMap[value ?? ''] ?? Durations.Instant;
export const migrateSpellReq = (value: string | undefined): SpellReq =>
  legacySpellReqMap[value ?? ''] ?? SpellReqs.Word;
