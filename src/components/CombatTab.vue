<template>
  <div class="row text-bold q-mt-xs">
    <span v-if="armourRating > 0">&nbsp;{{ t('combat.armourRating') }}: {{ armourRating }};&nbsp;</span>
    {{ t('combat.damageBonus') }}: STR: {{ DmgBonus(app.char.attributes.STR.score) }}, AGL:
    {{ DmgBonus(app.char.attributes.AGL.score) }}
  </div>

  <div class="row q-mt-md q-mb-sm text-h5 text-bold items-center">
    {{ t('tabs.weapons') }}
    <q-btn icon="add_circle" flat dense rounded @click="addWeapon" />
  </div>

  <weapon-block
    v-for="(w, i) in app.char.weapons"
    :key="`wpn-${i}`"
    v-model="app.char.weapons[i]!"
    @delete="removeWeapon(i)"
  />

  <div class="row items-baseline q-mt-md">
    <div class="col-shrink text-h5 text-bold">{{ t('tabs.combatSkills') }}</div>
    <q-input class="col-grow q-ml-sm" :label="t('common.search')" v-model="filter" clearable dense>
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
  <div class="row q-mt-sm">
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <char-skill
        v-if="show('Evade')"
        v-model="app.char.priSkills['Evade']!"
        :label="t('combat.evade')"
        skill-name="Evade"
        :skill-type="RollTypes.Primary"
      />
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in app.char.wepSkills" :key="`skill-${k}`">
      <char-skill
        v-if="show(k as string)"
        v-model="app.char.wepSkills[k]!"
        :label="skillLabel(k as string)"
        :skill-name="k as string"
        :skill-type="RollTypes.Weapon"
      />
    </div>
  </div>
  <div class="row justify-between items-center text-center q-mt-md">
    <div class="col-xs-12 col-sm-5">
      <armour-block :label="t('tabs.armour')" v-model="app.char.armour" />
    </div>

    <div class="col-xs-12 col-sm-5">
      <armour-block :label="t('tabs.helmet')" v-model="app.char.helmet" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useCharacterStore } from '../stores/character';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { skillLabelKey } from '../lib/domain';
import { NewWeapon, DmgBonus } from '../lib/defaults';

import CharSkill from '../components/CharSkill.vue';
import WeaponBlock from '../components/WeaponBlock.vue';
import ArmourBlock from '../components/ArmourBlock.vue';
import { RollTypes } from './models';

const app = useCharacterStore();
const { t } = useI18n();

const $q = useQuasar();
const addWeapon = () => app.char.weapons.push(NewWeapon());
const removeWeapon = (index: number) =>
  $q
    .dialog({
      message: t('dialog.removeWeapon'),
      cancel: true,
    })
    .onOk(() => app.char.weapons.splice(index, 1));
const skillLabel = (name: string): string => {
  const key = skillLabelKey(name);
  return key ? t(key) : name;
};

const armourRating = computed((): number => app.char.armour.rating + app.char.helmet.rating);

const filter = ref('');
const show = (name: string): boolean => {
  if (filter.value == '' || filter.value == null) return true;
  if (RegExp(filter.value, 'i').test(name)) return true;
  return false;
};
</script>
