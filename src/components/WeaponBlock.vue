<template>
  <action-item-row>
    <template v-slot:prepend>
      <q-btn v-if="weapon.skill" icon="mdi-dice-d20" @click="showRoller" flat dense />
    </template>

    <template v-slot:content>
      <q-expansion-item
        :label="weapon.name"
        :caption="weaponCaption"
        header-class="text-bold rounded-borders"
        :default-opened="!weapon.name"
      >
        <div class="row items-center rounded-borders q-pa-xs q-mt-xs">
          <q-input class="col-xs-8 col-sm-6 q-pr-xs" :label="t('weapon.weaponShield')" v-model="weapon.name" dense />
          <q-select class="col-xs-4 col-sm-2 q-pr-xs" :label="t('weapon.skill')" v-model="weapon.skill" :options="skillOptions" emit-value map-options dense />
          <q-select
            class="col-xs-3 col-sm-1 q-pr-xs"
            :label="t('weapon.grip')"
            v-model="weapon.grip"
            :options="Object.values(Grips)"
            dense
          />
          <q-input class="col-xs-3 col-sm-1 q-pr-xs" :label="t('weapon.range')" v-model="weapon.range" dense />
          <q-input class="col-xs-3 col-sm-1 q-pr-xs" :label="t('weapon.damage')" v-model="weapon.damage" dense />
          <q-input
            class="col-xs-3 col-sm-1 q-pr-xs"
            type="number"
            :label="t('weapon.durability')"
            v-model.number="weapon.durability"
            dense
          />
        </div>
        <div class="row q-pa-xs items-center">
          <q-input class="col-grow" :label="t('weapon.features')" v-model="weapon.features" dense />
        </div>
      </q-expansion-item>
    </template>

    <template v-slot:append>
      <q-btn icon="delete" @click="$emit('delete')" flat dense />
    </template>
  </action-item-row>

  <q-dialog v-model="display.roller" :maximized="$q.screen.lt.sm" position="right" full-height>
    <dice-roller
      :name="weapon.name"
      :roll-type="RollTypes.Attack"
      :target="app.skill('wepSkills', weapon.skill!)"
      :boons="0"
      :banes="app.banes('wepSkills', weapon.skill!)"
      :skill="weapon.skill!"
      @close="display.roller = false"
      @result="(r) => setResultDisplay(r)"
    >
      <template v-slot:append>
        <q-card-section v-if="display.dragon" class="column q-gutter-sm">
          <q-expansion-item :label="t('weapon.meleeSpecialEffects')" class="rounded-borders bg-blue-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <p class="text-bold">{{ t('common.chooseOne') }}</p>
              <ul class="q-pl-md">
                <li class="q-pb-sm">{{ t('weapon.meleeEffects.doubleDamage') }}</li>
                <li class="q-pb-sm">{{ t('weapon.meleeEffects.secondAttack') }}</li>
                <li>{{ t('weapon.meleeEffects.ignoreArmor') }}</li>
              </ul>
            </div>
          </q-expansion-item>

          <q-expansion-item
            :label="t('weapon.rangedSpecialEffects')"
            class="rounded-borders bg-blue-grey-9"
            header-class="text-h6"
          >
            <div class="q-pa-sm">
              <p class="text-bold">{{ t('common.chooseOne') }}</p>
              <ul class="q-pl-md">
                <li class="q-pb-sm">{{ t('weapon.rangedEffects.doubleDamage') }}</li>
                <li>{{ t('weapon.rangedEffects.ignoreArmor') }}</li>
              </ul>
            </div>
          </q-expansion-item>
        </q-card-section>

        <q-card-section v-if="display.demon" class="column q-gutter-sm">
          <q-expansion-item :label="t('weapon.meleeMishap')" class="rounded-borders bg-blue-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <div class="row q-gutter-md items-center q-mb-md">
                <q-btn
                  class="col-shrink"
                  :label="t('weapon.rollMishap')"
                  @click="mishap.melee = rollTable(MeleeDemon) as string"
                  outline
                />
                <div class="col">{{ mishap.melee ? t(mishap.melee) : '' }}</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>D6</th>
                    <th>{{ t('common.effect') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in MeleeDemon.rows" :key="`md-${i}`">
                    <td class="q-pa-xs">{{ row.floor }}</td>
                    <td class="q-pa-xs">{{ t(row.text) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-expansion-item>

          <q-expansion-item :label="t('weapon.rangedMishap')" class="rounded-borders bg-blue-grey-9" header-class="text-h6">
            <div class="q-pa-sm">
              <div class="row q-gutter-md items-center q-mb-md">
                <q-btn
                  class="col-shrink"
                  :label="t('weapon.rollMishap')"
                  @click="mishap.ranged = rollTable(RangedDemon) as string"
                  outline
                />
                <div class="col">{{ mishap.ranged ? t(mishap.ranged) : '' }}</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>D6</th>
                    <th>{{ t('common.effect') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in RangedDemon.rows" :key="`rd-${i}`">
                    <td class="q-pa-xs">{{ row.floor }}</td>
                    <td class="q-pa-xs">{{ t(row.text) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-expansion-item>
        </q-card-section>

        <dice-select v-if="display.dragon || display.success" v-model="dmgDice" />

        <q-card-section v-if="display.dragon || display.success" class="column justify-start items-center">
          <div class="row full-width items-center justify-center q-mb-md">
            <q-btn :label="t('weapon.rollDamage')" @click="dmgRes = rollDice(dmgDice)" color="white" text-color="black" />
          </div>
          <div class="row full-width items-center justify-center q-mb-md">
            <div v-if="dmgRes.total != 0" class="col-2 text-center text-h5 bg-blue-grey-10 rounded-borders q-pa-sm">
              {{ dmgRes.total }}
            </div>
          </div>
          <div class="text-caption">{{ parseResult().join(', ') }}</div>
        </q-card-section>
      </template>
    </dice-roller>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { type IWeapon, type IDiceRoll, D20Results, RollTypes, Grips } from './models';

import { useI18n } from 'vue-i18n';
import { useCharacterStore } from '../stores/character';

import { skillLabelKey } from '../lib/domain';
import { parseDiceString, rollDice } from '../lib/util';
import { MeleeDemon, RangedDemon, rollTable } from '../lib/tables';

import DiceRoller from './DiceRoller.vue';
import DiceSelect from './DiceSelect.vue';
import ActionItemRow from './ActionItemRow.vue';

const weapon = defineModel<IWeapon>({ required: true });
defineEmits(['delete']);

const app = useCharacterStore();
const { t } = useI18n();
const skillOptions = computed(() =>
  Object.keys(app.char.wepSkills).map((skill) => {
    const key = skillLabelKey(skill);
    return { value: skill, label: key ? t(key) : skill };
  }),
);
const weaponCaption = computed(
  () => `${t('weapon.damageShort')}: ${weapon.value.damage}, ${t('weapon.durabilityShort')}: ${weapon.value.durability}, ${t('weapon.features')}: ${weapon.value.features}`,
);
const display = ref({
  roller: false,
  select: false,
  success: false,
  dragon: false,
  demon: false,
});

const dmgDice = ref(parseDiceString(weapon.value.damage));

const dmgBonus = computed(() =>
  weapon.value.skill ? app.dmgBonus(app.char.wepSkills[weapon.value.skill]!.attr) : '-',
);
if (dmgBonus.value != '-') dmgDice.value.push(...parseDiceString(dmgBonus.value));
watch(
  () => weapon.value.damage,
  () => {
    dmgDice.value = parseDiceString(weapon.value.damage);
    if (dmgBonus.value != '-') dmgDice.value.push(...parseDiceString(dmgBonus.value));
  },
);

const dmgRes = ref(<IDiceRoll>{ total: 0, results: [] });
const parseResult = () => dmgRes.value.results.map((d) => `${d.d.n}d${d.d.size}: ${d.v.join(', ')}`);

const setResultDisplay = (r: string) => {
  display.value = {
    roller: true,
    select: false,
    success: false,
    dragon: false,
    demon: false,
  };

  switch (r) {
    case D20Results.Dragon:
      display.value.dragon = true;
      break;
    case D20Results.Demon:
      display.value.demon = true;
      break;
    case D20Results.Success:
      display.value.success = true;
      break;
    default:
      break;
  }
};

const mishap = ref({
  melee: '',
  ranged: '',
});

const showRoller = () => {
  setResultDisplay('-');
  dmgRes.value = { total: 0, results: [] };
};
</script>

<style lang="sass">
.border-top
  border-top: 1px solid grey
</style>
