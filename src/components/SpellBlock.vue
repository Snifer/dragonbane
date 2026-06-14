<template>
  <!-- file deepcode ignore PureFunctionReturnValueIgnored: The return value is passed to a component -->
  <action-item-row>
    <template v-slot:prepend>
      <q-btn
        v-if="spell.skill && spell.rank > 0 && spell.prepared"
        icon="mdi-dice-d20"
        @click="showRoller()"
        flat
        dense
      />
      <q-btn v-else-if="spell.rank == 0" icon="mdi-account-arrow-right" @click="useMagicTrick(spell.name)" flat dense />
      <q-btn v-else icon="mdi-book-open-variant" @click="showRoller()" flat dense />
    </template>

    <template v-slot:content>
      <q-expansion-item
        :label="spellSummary"
        :caption="spell.text"
        header-class="text-bold q-pl-xs rounded-borders"
        :default-opened="!spell.name"
      >
        <div class="column q-mt-sm rounded-borders">
          <div class="row items-center">
            <q-checkbox
              v-if="spell.rank > 0"
              class="col-shrink q-pr-xs"
              checked-icon="mdi-alpha-p-box"
              unchecked-icon="mdi-alpha-p-box-outline"
              color="white"
              v-model="spell.prepared"
              size="lg"
              dense
            >
              <q-tooltip>{{ t('tabs.prepared') }}</q-tooltip>
            </q-checkbox>
            <q-input class="col-grow" :label="t('common.name')" v-model="spell.name" dense />
            <q-select class="col" :label="t('weapon.skill')" :options="skills" v-model="spell.skill" dense />
            <q-input class="col-xs-2 col-sm-1" :label="t('spell.rank')" v-model.number="spell.rank" type="number" dense />
          </div>

          <div v-if="spell.rank > 0" class="row">
            <q-input class="col" :label="t('spell.castingTime')" v-model="spell.time" dense />
            <q-select
              class="col"
              :label="t('spell.duration')"
              v-model="spell.duration"
              :options="durationSelectOptions"
              emit-value
              map-options
              dense
            />
          </div>

          <div v-if="spell.rank > 0" class="row items-end">
            <q-select
              class="col"
              :label="t('spell.requirements')"
              v-model="spell.req"
              multiple
              :options="spellReqSelectOptions"
              emit-value
              map-options
              dense
            />
            <q-input class="col" :label="t('weapon.range')" v-model="spell.range" dense />
          </div>

          <q-input
            class="row"
            v-if="spell.req.includes(SpellReqs.Ingredient)"
            :label="t('spell.ingredient')"
            v-model="spell.ingredient"
            dense
          />

          <q-input class="row" :label="t('common.text')" v-model="spell.text" dense autogrow />
        </div>
      </q-expansion-item>
    </template>

    <template v-slot:append>
      <q-btn icon="delete" flat dense @click="$emit('delete')" />
    </template>
  </action-item-row>

  <q-dialog v-model="display.roller" :maximized="$q.screen.lt.md" position="right" full-height>
    <dice-roller
      :name="spell.name"
      :roll-type="RollTypes.Spell"
      :skill="spell.skill!"
      :target="app.skill('secSkills', spell.skill!)"
      :boons="0"
      :banes="app.banes('secSkills', spell.skill!)"
      @close="display.roller = false"
      @result="(r) => setResultDisplay(r)"
    >
      <template v-slot:prepend>
        <q-card-section class="column justify-center items-center">
          <div class="row full-width items-center q-px-md">
            <q-select
              class="col-grow q-mr-sm"
              :label="t('spell.powerLevel')"
              :options="powerLevels"
              v-model="pl"
              dense
              :hint="t('ability.currentWp', { wp: app.char.wp.current })"
            />
            <q-btn
              class="col-shrink"
              :label="t('spell.spendWp', { wp: pl * 2 })"
              color="white"
              text-color="black"
              @click="app.char.wp.current -= pl * 2"
            />
          </div>

          <p class="q-mt-sm q-pa-md rounded-borders bg-blue-grey-10 text-bold">{{ spell.text }}</p>
        </q-card-section>
      </template>

      <template v-slot:append>
        <q-card-section v-if="display.dragon" class="column">
          <div class="q-pa-md rounded-borders bg-blue-grey-10 text-bold">
            <p class="text-bold">{{ t('common.chooseOne') }}</p>
            <ul class="q-pl-md">
              <li class="q-pb-sm">{{ t('spell.dragon.doubleDamageOrRange') }}</li>
              <li class="q-pb-sm">{{ t('spell.dragon.freeCast') }}</li>
              <li>{{ t('spell.dragon.extraCast') }}</li>
            </ul>
          </div>
        </q-card-section>

        <q-card-section v-if="display.demon" class="column rounded-borders bg-negative q-ma-md">
          <div class="row items-center q-mb-md justify-between">
            <q-btn
              class="col-shrink q-mr-md"
              :label="t('spell.rollMishap')"
              @click="mishap = rollTable(MagicalMishap) as string"
              outline
            />
            <div class="col">{{ mishap ? t(mishap) : '' }}</div>
          </div>
          <q-expansion-item :label="t('spell.magicalMishapTable')" header-class="text-h6">
            <table>
              <thead>
                <tr>
                  <th>D20</th>
                  <th>{{ t('common.effect') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in MagicalMishap.rows" :key="`mm-${i}`">
                  <td class="q-pa-xs">{{ row.floor }}</td>
                  <td class="q-pa-xs">{{ t(row.text) }}</td>
                </tr>
              </tbody>
            </table>
          </q-expansion-item>
        </q-card-section>
        <dice-select v-if="display.dragon || display.success" v-model="dmgDice" />
        <q-card-section v-if="display.dragon || display.success" class="column justify-start items-center">
          <q-btn :label="t('dice.roll')" @click="dmgRes = rollDice(dmgDice)" color="white" text-color="black" />
          <div v-if="dmgRes.total != 0" class="text-h4 bg-blue-grey-10 rounded-borders q-pa-sm">
            {{ dmgRes.total }}
          </div>
          <div class="text-caption">{{ parseResult().join(', ') }}</div>
        </q-card-section>
      </template>
    </dice-roller>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { D20Results, type IDiceRoll, type ISpell, RollTypes, SpellReqs } from './models';

import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useCharacterStore } from '../stores/character';

import { durationOptions, spellReqOptions } from '../lib/domain';
import { rollDice, parseDiceString } from '../lib/util';
import { MagicalMishap, rollTable } from '../lib/tables';

import DiceRoller from './DiceRoller.vue';
import DiceSelect from './DiceSelect.vue';
import ActionItemRow from './ActionItemRow.vue';

const spell = defineModel<ISpell>({ required: true });
defineEmits(['delete']);

const app = useCharacterStore();
const { t } = useI18n();
const skills = computed((): string[] => Object.keys(app.char.secSkills));
const durationSelectOptions = computed(() =>
  durationOptions.map((value) => ({
    value,
    label: t(`duration.${value}`),
  })),
);
const spellReqSelectOptions = computed(() =>
  spellReqOptions.map((value) => ({
    value,
    label: t(`spellReq.${value}`),
  })),
);
const spellSummary = computed(() => {
  const rankLabel = spell.value.rank > 0 ? t('spell.rankN', { rank: spell.value.rank }) : t('spell.magicTricks');
  const preparedLabel = spell.value.prepared ? `, ${t('tabs.prepared')}` : '';
  return `${spell.value.name} [${rankLabel}${preparedLabel}]`;
});
const dmgDice = ref(parseDiceString(spell.value.text));
// For spells we only include the first dice set mentioned
dmgDice.value.splice(1);
const dmgRes = ref(<IDiceRoll>{ total: 0, results: [] });
const parseResult = () => dmgRes.value.results.map((d) => `${d.d.n}d${d.d.size}: ${d.v.join(', ')}`);
const display = ref({
  roller: false,
  select: false,
  success: false,
  dragon: false,
  demon: false,
});

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

const showRoller = () => {
  if (checkWP(2)) {
    setResultDisplay('-');
    dmgRes.value = { total: 0, results: [] };
  }
};

const mishap = ref('');

const $q = useQuasar();
const useMagicTrick = (name: string) =>
  checkWP(1)
    ? $q
        .dialog({
          title: t('spell.useMagicTrick', { name }),
          ok: true,
          cancel: true,
        })
        .onOk(() => app.char.wp.current--)
    : undefined;

const checkWP = (wpReq: number): boolean => {
  let out = false;
  if (app.char.wp.current < wpReq) {
    $q.dialog({
      title: t('spell.outOfJuice'),
      message: t('ability.currentWp', { wp: app.char.wp.current }),
      ok: true,
    }).onOk(() => (out = false));
  } else {
    out = true;
  }
  return out;
};

const pl = ref(1);
const powerLevels = computed((): number[] => {
  const out = <number[]>[];

  const lvls = [1, 2, 3];
  lvls.forEach((n) => (n * 2 <= app.char.wp.current ? out.push(n) : undefined));

  return out;
});
</script>

<style lang="sass">
.border-top
  border-top: 1px solid grey
</style>
