<template>
  <q-btn :label="`${dollaBills} ${label}`" class="col-4" size="md" @click="showEdit = true" flat dense />

  <q-dialog v-model="showEdit" :maximized="$q.screen.lt.sm" position="right" full-height>
    <q-card class="no-shadow dialog-outline">
      <q-card-section class="row text-center text-h6">
        <div class="col-grow">{{ label }}</div>
        <q-btn class="col-shrink" flat rounded dense icon="close" @click="showEdit = false" />
      </q-card-section>
      <q-card-section class="row justify-center text-bold">
        {{ t('dialog.youHaveCurrency', { amount: dollaBills, currency: label.toLowerCase() }) }}
      </q-card-section>
      <q-card-section class="row justify-evenly items-center">
        <q-btn
          class="col-shrink"
          flat
          rounded
          icon="mdi-minus-circle"
          @click="
            dollaBills -= editVal;
            editVal = 0;
          "
        >
          <q-tooltip>{{ t('gear.spendSome') }}</q-tooltip>
        </q-btn>
        <q-input class="col-grow" input-class="text-center text-bold" type="number" v-model.number="editVal" dense />
        <q-btn
          class="col-shrink"
          flat
          rounded
          icon="mdi-plus-circle"
          @click="
            dollaBills += editVal;
            editVal = 0;
          "
        >
          <q-tooltip>{{ t('gear.gainSome') }}</q-tooltip>
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const dollaBills = defineModel<number>({ required: true });
defineProps<{ label: string }>();

const showEdit = ref(false);
const editVal = ref(0);
const { t } = useI18n();
</script>
