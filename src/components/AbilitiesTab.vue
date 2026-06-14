<template>
  <div class="row justify-between" v-if="app.conf.showSpells">
    <div class="col-xs-12 col-sm-12 col-lg-6 q-px-xs">
      <div class="row q-mt-md q-mb-sm text-h5 text-bold items-center">
        {{ t('tabs.heroicAbilities') }}
        <q-btn icon="add_circle" flat dense rounded @click="addAbl" />
      </div>
      <ability-block
        v-for="(ab, i) in app.char.abilities"
        :key="`abl-${i}`"
        v-model="app.char.abilities[i]!"
        @delete="removeAbl(i)"
      />
    </div>

    <div class="col-xs-12 col-sm-12 col-lg-6 q-px-xs">
      <div class="row q-mt-md q-mb-sm text-h5 text-bold items-center justify-between">
        <div class="col-shrink">
          {{ t('tabs.spells') }}
          <q-btn icon="add_circle" flat dense rounded @click="addSpell" />
        </div>

        <q-input class="col-grow q-px-sm" :label="t('common.search')" v-model="filter" clearable dense>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-checkbox
          class="col-shrink"
          v-model="showPreparedSpells"
          checked-icon="mdi-eye"
          unchecked-icon="mdi-eye-off"
          color="white"
        >
          <q-tooltip>{{ t('tabs.prepared') }}</q-tooltip>
        </q-checkbox>

        <q-btn class="col-shrink" icon="sort" flat dense rounded @click="sortSpells">
          <q-tooltip>{{ t('tabs.knownByRank') }}</q-tooltip>
        </q-btn>
      </div>

      <div class="row items-center">
        <div class="col-shrink text-bold">{{ t('tabs.knownByRank') }}</div>
        <div class="col-shrink" v-for="(r, i) in spellsByRank" :key="`ranked-spells-${i}`">
          <span class="q-ml-sm q-pa-xs rounded-borders" v-if="r > 0">
            {{ i < 1 ? t('spell.magicTricks') : t('spell.rankN', { rank: i }) }}: {{ r }}
          </span>
        </div>
      </div>

      <div class="row items-center q-mt-xs">
        <div class="col-shrink text-bold">{{ t('tabs.prepared') }}</div>
        <div class="col-shrink q-ml-sm q-px-xs">
          {{ spellsPrepared }}/{{ BaseChance(app.char.attributes.INT.score) }}
        </div>
      </div>

      <div v-for="(sp, i) in app.char.spells" :key="`spell-${i}`">
        <spell-block v-if="show(sp)" v-model="app.char.spells[i]!" @delete="removeSpell(i)" />
      </div>
    </div>
  </div>
  <div v-else>
    <div class="row q-mt-md q-mb-sm text-h5 text-bold items-center">
      {{ t('tabs.heroicAbilities') }}
      <q-btn icon="add_circle" flat dense rounded @click="addAbl" />
    </div>
    <ability-block
      v-for="(ab, i) in app.char.abilities"
      :key="`abl-${i}`"
      v-model="app.char.abilities[i]!"
      @delete="removeAbl(i)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useCharacterStore } from '../stores/character';

import { NewAbility, NewSpell, BaseChance } from '../lib/defaults';

import AbilityBlock from './AbilityBlock.vue';
import SpellBlock from './SpellBlock.vue';
import type { ISpell } from './models';

const app = useCharacterStore();
const { t } = useI18n();

const $q = useQuasar();
const addSpell = () => app.char.spells.push(NewSpell());
const removeSpell = (index: number) =>
  $q
    .dialog({
      message: t('dialog.deleteSpell'),
      cancel: true,
    })
    .onOk(() => app.char.spells.splice(index, 1));
const sortSpells = () =>
  app.char.spells.sort((a, b) => {
    if (a.rank < b.rank) return -1;
    if (a.rank > b.rank) return 1;
    else return 0;
  });
const spellsByRank = computed((): number[] => {
  const spells = [0, 0, 0, 0, 0, 0];
  app.char.spells.forEach((sp) => {
    spells[sp.rank]!++;
  });
  return spells;
});
const spellsPrepared = computed((): number => {
  let t = 0;
  app.char.spells.forEach((sp) => {
    if (sp.rank > 0 && sp.prepared) t++;
  });
  return t;
});

const addAbl = () => app.char.abilities.push(NewAbility());
const removeAbl = (index: number) =>
  $q
    .dialog({
      message: t('dialog.deleteAbility'),
      cancel: true,
    })
    .onOk(() => app.char.abilities.splice(index, 1));

const filter = ref('');
const show = (s: ISpell): boolean => {
  if (!s.prepared && showPreparedSpells.value) return false;
  if (filter.value == null || filter.value == '') return true;

  if (RegExp(filter.value, 'i').test(s.name) || RegExp(filter.value).test(s.text)) return true;

  return false;
};

const showPreparedSpells = ref(false);
</script>
