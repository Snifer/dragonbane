<template>
  <div
    :class="`column items-center justify-center q-ma-sm q-pa-sm ${
      attr.condition.check ? 'bg-negative' : 'bg-blue-grey-10'
    } rounded-borders`"
  >
    <q-btn icon="mdi-dice-d20" @click="showRoller = true" flat rounded dense size="md" />
    <q-btn :label="`${label} ${attr.score}`" class="col-shrink text-bold" size="lg" @click="editAttr" flat rounded />
    <q-checkbox
      :label="attr.condition.name"
      v-model="attr.condition.check"
      size="sm"
      left-label
      dense
      unchecked-icon="mdi-emoticon-happy"
      checked-icon="mdi-skull"
      color="white"
    />
  </div>

  <q-dialog v-model="showRoller" :maximized="$q.screen.lt.sm" position="right" full-height>
    <dice-roller
      :name="label"
      :banes="attr.condition.check ? 1 : 0"
      :boons="0"
      :target="attr.score"
      :roll-type="RollTypes.Attr"
      @close="showRoller = false"
    />
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { RollTypes, type IAttribute } from './models';

import { useQuasar } from 'quasar';

import DiceRoller from './DiceRoller.vue';

const attr = defineModel<IAttribute>({ required: true });
const props = defineProps<{ label: string }>();
const $q = useQuasar();
const editAttr = () =>
  $q
    .dialog({
      title: `Edit ${props.label}`,
      cancel: true,
      prompt: {
        type: 'number',
        model: `${attr.value.score}`,
        min: 3,
        max: 18,
      },
    })
    .onOk((n) => (attr.value.score = n));

const showRoller = ref(false);
</script>
