<template>
  <div class="row justify-between bg-primary rounded-borders">
    <money-field :label="t('gear.currency.gold')" v-model.number="app.char.money.gold" />
    <money-field :label="t('gear.currency.silver')" v-model.number="app.char.money.silver" />
    <money-field :label="t('gear.currency.copper')" v-model.number="app.char.money.copper" />
  </div>

  <div class="row text-h6 text-bold q-mt-md items-center">
    <div class="col">
      <div class="row items-center">
        <div>{{ t('tabs.inventory') }} ({{ encumberance }} / {{ encumberMax }})</div>
        <q-btn icon="add_circle" flat dense rounded @click="addInvItem">
          <q-tooltip>{{ t('gear.addItem') }}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-checkbox class="col-shrink self-end" v-model="app.char.backpack" :label="t('tabs.backpack')" />
  </div>
  <item-row
    v-for="(it, i) in app.char.inventory"
    :key="`inv-${i}`"
    v-model="app.char.inventory[i]!"
    @delete="removeInvItem(i)"
  />

  <q-input class="row q-mt-sm" :label="t('tabs.tinyItems')" v-model="app.char.tinyItems" dense autogrow />
  <q-input class="row q-mt-sm" :label="t('tabs.memento')" v-model="app.char.memento" dense autogrow />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useCharacterStore } from '../stores/character';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import MoneyField from './MoneyField.vue';
import ItemRow from './ItemRow.vue';

const app = useCharacterStore();
const { t } = useI18n();

const $q = useQuasar();

const addInvItem = () => app.char.inventory.push({ text: '', wt: 1 });
const removeInvItem = (index: number) =>
  $q
    .dialog({
      message: t('dialog.deleteItem'),
      cancel: true,
    })
    .onOk(() => app.char.inventory.splice(index, 1));
const encumberance = computed((): number => {
  let total = 0;
  app.char.inventory.forEach((item) => {
    total += item.wt;
  });

  total += Math.floor((app.char.money.copper + app.char.money.silver + app.char.money.gold) / 100);
  return total;
});
const encumberMax = computed((): number => Math.ceil(app.char.attributes.STR.score / 2) + (app.char.backpack ? 2 : 0));
</script>
