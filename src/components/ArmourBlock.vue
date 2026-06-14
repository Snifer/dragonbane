<template>
  <div class="column">
    <div class="row">
      <q-input class="col-grow" :label="label" v-model="amr.name" dense />
      <q-input class="col-xs-2 col-sm-1" :label="t('armour.rating')" v-model.number="amr.rating" type="number" dense />
    </div>

    <div class="row items-center justify-center q-mt-sm">{{ t('armour.baneOn') }}</div>

    <div class="row items-center justify-center">
      <q-checkbox
        class="col-shrink"
        v-for="(_, i) in amr.bane"
        :key="`amr-${i}`"
        :label="baneLabel(i)"
        v-model="amr.bane[i]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IArmour } from './models';
import { useI18n } from 'vue-i18n';
import { skillLabelKey } from '../lib/domain';

const amr = defineModel<IArmour>({ required: true });
defineProps<{ label: string }>();
defineEmits(['delete']);
const { t } = useI18n();
const baneLabel = (name: string): string => {
  if (name === 'Ranged Attacks') return t('armour.rangedAttacks');
  const key = skillLabelKey(name);
  return key ? t(key) : name;
};
</script>
