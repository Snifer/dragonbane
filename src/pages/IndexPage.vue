<template>
  <!-- file deepcode ignore PureFunctionReturnValueIgnored: The return value is passed to a component -->
  <q-page class="column" :padding="$q.screen.gt.sm">
    <q-expansion-item
      :default-opened="!app.char.kin"
      :label="`${app.char.name} ${app.char.kin ? 'the' : ''} ${app.char.kin} ${app.char.profession}`"
      :caption="`${app.char.age}, Movement: ${app.char.movement}`"
      header-class="text-h5 bg-blue-grey-10 rounded-borders"
    >
      <div class="row justify-between q-gutter-sm q-px-sm">
        <div class="col">
          <q-input class="row" label="Name" v-model="app.char.name" dense />

          <div class="row">
            <q-select class="col" label="Age" v-model="app.char.age" :options="Object.values(Ages)" dense />
            <q-input class="col" label="Movement" type="number" v-model.number="app.char.movement" dense />
          </div>
        </div>

        <div class="col">
          <div class="row">
            <q-input class="col" label="Kin" v-model="app.char.kin" dense />
            <q-input class="col" label="Profession" v-model="app.char.profession" dense />
          </div>
          <q-input class="row" label="Weakness" v-model="app.char.weakness" dense />
        </div>
      </div>

      <q-input class="row q-px-sm" label="Appearance" v-model="app.char.appearance" dense autogrow />
    </q-expansion-item>

    <div class="row justify-between q-mt-sm q-px-sm">
      <div class="col-xs-6 col-sm-6 col-md-4 q-pr-xs">
        <points-block v-model="app.char.hp" label="HP" />
      </div>
      <div class="col-xs-6 col-sm-6 col-md-4 q-pl-xs">
        <points-block v-model="app.char.wp" label="WP" />
      </div>
    </div>

    <div class="row justify-evenly">
      <q-btn v-if="statsRolled" class="col-12 q-mb-sm" icon="mdi-dice-d20" flat @click="rollStats" label="Roll stats">
        <q-tooltip>Roll stats</q-tooltip>
      </q-btn>
      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr :label="Attrs.STR" v-model="app.char.attributes.STR" />
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr :label="Attrs.CON" v-model="app.char.attributes.CON" />
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr :label="Attrs.AGL" v-model="app.char.attributes.AGL" />
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr :label="Attrs.INT" v-model="app.char.attributes.INT" />
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr :label="Attrs.WIL" v-model="app.char.attributes.WIL" />
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr :label="Attrs.CHA" v-model="app.char.attributes.CHA" />
      </div>
    </div>

    <q-tabs v-model="tab" align="justify">
      <q-tab name="skills" label="Skills" />
      <q-tab name="combat" label="Combat" />
      <q-tab name="abilities" label="Abilities & Spells" />
      <q-tab name="gear" label="Gear" />
    </q-tabs>

    <q-tab-panels v-model="tab" class="rounded-borders" swipeable>
      <!--SKILLS-->
      <q-tab-panel name="skills">
        <skills-tab />
      </q-tab-panel>

      <!--COMBAT-->
      <q-tab-panel name="combat">
        <combat-tab />
      </q-tab-panel>

      <!--ABILITIES & SPELLS-->
      <q-tab-panel name="abilities">
        <abilities-tab />
      </q-tab-panel>

      <!--GEAR-->
      <q-tab-panel name="gear">
        <gear-tab />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

import { Attrs, type Attr, Ages } from '../components/models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from '../stores/character';

import CharAttr from '../components/CharAttr.vue';
import PointsBlock from '../components/PointsBlock.vue';
import SkillsTab from '../components/SkillsTab.vue';
import CombatTab from '../components/CombatTab.vue';
import AbilitiesTab from '../components/AbilitiesTab.vue';
import GearTab from '../components/GearTab.vue';

const app = useCharacterStore();
const tab = ref('skills');

const $q = useQuasar();
const rollStats = () =>
  $q
    .dialog({
      message: 'Roll and apply Character Stats?',
      cancel: true,
    })
    .onOk(() => {
      const r = (): number => {
        let sum = 0;

        const rolls: number[] = new Array(4).fill(0);
        rolls.forEach((n, i) => (rolls[i] = Math.floor(Math.random() * 6) + 1));
        rolls.sort();
        rolls.shift();
        rolls.forEach((roll) => (sum += roll));

        return sum;
      };

      Object.keys(Attrs).forEach((attr) => (app.char.attributes[attr as Attr].score = r()));

      const hp = app.char.attributes.CON.score;
      app.char.hp.max = hp;
      app.char.hp.current = hp;

      const wp = app.char.attributes.WIL.score;
      app.char.wp.max = wp;
      app.char.wp.current = wp;
    });
const statsRolled = computed((): boolean => {
  let total = 0;
  Object.keys(Attrs).forEach((attr) => (total += app.char.attributes[attr as Attr].score));
  return total == 0;
});
</script>
