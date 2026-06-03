<template>
  <div
    :class="`row items-center justify-between rounded-borders q-ma-xs q-pa-xs ${
      baned ? 'bg-negative' : 'bg-blue-grey-10'
    }`"
  >
    <q-checkbox
      class="col-shrink"
      v-model="skill.checked"
      checked-icon="mdi-alpha-a-box"
      unchecked-icon="mdi-alpha-a-box-outline"
      :color="app.conf.darkMode == true ? 'white' : 'black'"
      size="lg"
      dense
    >
      <q-tooltip>Advance</q-tooltip>
    </q-checkbox>

    <q-input
      class="col-xs-2 col-sm-2"
      input-class="text-center text-bold"
      type="number"
      v-model.number="val"
      dense
      borderless
    />

    <q-checkbox
      v-if="app.conf.showTrainedSkills == true || app.conf.showTrainedSkills == undefined"
      class="col-shrink"
      v-model="skill.trained"
      checked-icon="mdi-alpha-t-box"
      unchecked-icon="mdi-alpha-t-box-outline"
      :color="app.conf.darkMode == true ? 'white' : 'black'"
      size="lg"
      dense
    >
      <q-tooltip>Trained</q-tooltip>
    </q-checkbox>

    <div class="col">{{ label }} ({{ skill.attr }})</div>

    <div class="col-shrink q-mr-sm" v-if="baned">
      <q-icon v-for="(b, i) in banes" :key="i" name="mdi-skull" size="sm" />
    </div>

    <div class="col-shrink">
      <q-btn icon="mdi-dice-d20" @click="showRoller = true" flat round dense />
    </div>

    <q-btn class="col-shrink" icon="delete" v-if="showDelete" @click="emit('delete', label)" flat dense rounded />
  </div>
  <q-dialog v-model="showRoller" :maximized="$q.screen.lt.sm" position="right" full-height>
    <dice-roller
      :name="label"
      :target="val"
      :boons="0"
      :banes="banes.length"
      :roll-type="skillType"
      @close="showRoller = false"
    />
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

import { RollTypes, type ISkill, type RollType } from './models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from '../stores/character';

import { BaseChance } from '../lib/defaults';

import DiceRoller from './DiceRoller.vue';

const skill = defineModel<ISkill>({ required: true });
const props = defineProps<{
  label: string;
  showDelete?: boolean;
  skillType: RollType;
}>();
const emit = defineEmits(['delete']);

const $q = useQuasar();
const app = useCharacterStore();
const base = computed((): number => {
  const b = BaseChance(app.char.attributes[skill.value.attr].score);
  return skill.value.trained ? b * 2 : props.skillType == RollTypes.Secondary ? 0 : b;
});

const val = computed({
  get(): number {
    return skill.value.advances + base.value;
  },
  set(v: number) {
    if (v <= 18) return (skill.value.advances = v - base.value);
  },
});

const baned = computed((): boolean => {
  let b = false;
  if (app.char.attributes[skill.value.attr].condition.check) b = true;

  Object.keys(app.char.armour.bane).forEach((k) => {
    if (app.char.armour.bane[k] && k == props.label) b = true;
  });

  Object.keys(app.char.helmet.bane).forEach((k) => {
    const checked = app.char.helmet.bane[k];
    if (
      (checked && k == props.label) ||
      (checked &&
        k == 'Ranged Attacks' &&
        (props.label == 'Bows' || props.label == 'Crossbows' || props.label == 'Slings'))
    )
      b = true;
  });

  return b;
});

const banes = computed((): number[] => {
  const b = [];
  if (app.char.attributes[skill.value.attr].condition.check) b.push(0);

  Object.keys(app.char.armour.bane).forEach((k) => {
    if (app.char.armour.bane[k] && k == props.label) b.push(0);
  });

  Object.keys(app.char.helmet.bane).forEach((k) => {
    const checked = app.char.helmet.bane[k];
    if (
      (checked && k == props.label) ||
      (checked &&
        k == 'Ranged Attacks' &&
        (props.label == 'Bows' || props.label == 'Crossbows' || props.label == 'Slings'))
    )
      b.push(0);
  });

  return b;
});

const showRoller = ref(false);
</script>
