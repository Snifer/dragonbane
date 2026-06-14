<template>
  <div class="row">
    <q-input class="col-grow" :label="t('common.text')" v-model="item.text" dense />
    <q-input class="col-xs-2 col-sm-1" :label="t('item.weight')" v-model.number="item.wt" type="number" dense />
    <q-btn class="col-shrink" icon="delete" dense flat rounded @click="$emit('delete')" />
  </div>
</template>

<script lang="ts" setup>
import type { IItem } from './models';
import { useI18n } from 'vue-i18n';

const item = defineModel<IItem>({ required: true });
defineEmits(['delete']);
const { t } = useI18n();
</script>
