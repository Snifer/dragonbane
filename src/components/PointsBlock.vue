<template>
  <div class="column">
    <q-btn size="xl" :label="`${label} ${points.current}`" @click="showEditDialog = !showEditDialog" flat />
    <q-linear-progress :value="points.current / points.max" color="positive" track-color="negative" />
  </div>

  <q-dialog v-model="showEditDialog">
    <q-card>
      <q-card-section class="row text-h6 items-center justify-between">
        <div class="col">{{ t('dialog.adjustPoints', { label }) }}</div>
        <q-btn class="col-shrink" icon="close" flat dense rounded @click="showEditDialog = false" />
      </q-card-section>

      <q-card-section class="column">
        <q-input :label="t('common.current')" type="number" v-model.number="points.current" :max="points.max" :min="0" />
        <q-input :label="t('common.max')" type="number" v-model.number="points.max" :min="0" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IPoints } from './models';

const points = defineModel<IPoints>({ required: true });
defineProps<{ label: string; showMax?: boolean }>();
const { t } = useI18n();

const showEditDialog = ref(false);
</script>
