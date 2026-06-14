<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-primary">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Dragonbane</q-toolbar-title>
        <q-btn icon="mdi-arrow-up-bold-hexagon-outline" @click="advance" flat>
          <q-tooltip>{{ t('layout.rollAdvancements') }}</q-tooltip>
        </q-btn>
        <q-btn-dropdown icon="mdi-bed" flat>
          <q-list>
            <q-item clickable v-ripple @click="rest.round()">
              <q-item-section>
                <q-item-label>{{ t('layout.rest.round') }}</q-item-label>
                <q-item-label caption>{{ t('layout.rest.roundCaption') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="rest.stretch()">
              <q-item-section>
                <q-item-label>{{ t('layout.rest.stretch') }}</q-item-label>
                <q-item-label caption>{{ t('layout.rest.stretchCaption') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="rest.shift()">
              <q-item-section>
                <q-item-label>{{ t('layout.rest.shift') }}</q-item-label>
                <q-item-label caption>{{ t('layout.rest.shiftCaption') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-btn class="full-width" :label="t('layout.newCharacter')" flat @click="createCharacter" icon-right="add" />
      <q-list>
        <q-item
          class="items-center"
          v-for="(c, i) in app.chars"
          :key="`char-${i}`"
          :active="app.conf.char == i"
          active-class="text-accent"
          clickable
          v-ripple
        >
          <q-item-section @click="app.conf.char = i">{{ c.name }}</q-item-section>
          <q-item-section v-if="app.chars.length > 1" side>
            <q-btn icon="delete" flat dense rounded @click="removeChar(i)" />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple @click="app.exportData">
          <q-item-section avatar>
            <q-icon name="download" />
          </q-item-section>
          <q-item-section>
            {{ t('layout.exportData') }}
            <q-tooltip>{{ t('layout.exportDataTooltip') }}</q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="showDataLoad = true">
          <q-item-section avatar>
            <q-icon name="upload" />
          </q-item-section>
          <q-item-section>
            {{ t('layout.loadData') }}
            <q-tooltip>{{ t('layout.loadDataTooltip') }}</q-tooltip>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item>
          <q-item-section>
            <q-toggle :label="t('layout.showSpells')" v-model="app.conf.showSpells" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-select
              v-model="app.conf.locale"
              :options="languageOptions"
              :label="t('common.language')"
              emit-value
              map-options
              dense
              outlined
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-toggle :label="t('layout.showTrained')" v-model="app.conf.showTrainedSkills" />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple @click="about">
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('common.about') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <q-dialog v-model="showDataLoad" :maximized="$q.platform.is.mobile">
    <q-card>
      <q-card-section class="text-center text-bold bg-secondary">{{ t('layout.loadData') }}</q-card-section>

      <q-card-section class="text-subtitle">
        {{ t('layout.overwriteWarning') }}
      </q-card-section>

      <q-card-section>
        <q-file v-model="fileToLoad" standout :label="t('layout.selectFile')" accept=".json" />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn :label="t('common.load')" color="primary" @click="loadData" flat />
        <q-btn :label="t('common.close')" color="warning" @click="showDataLoad = false" flat />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import type { Attr, IDBStore } from '../components/models';

import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useCharacterStore } from '../stores/character';

import { NewCharacter } from '../lib/defaults';
import { localeOptions } from '../lib/domain';
import { roll } from '../lib/util';

const leftDrawerOpen = ref(false);

const app = useCharacterStore();
const $q = useQuasar();
const { t } = useI18n();
const languageOptions = computed(() =>
  localeOptions.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  })),
);

const showDataLoad = ref(false);
const fileToLoad = ref(null);
const createCharacter = () => app.chars.push(NewCharacter(t('character.newName')));
const loadData = () => {
  const f: File = fileToLoad.value as unknown as File;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const data = JSON.parse(ev.target?.result as string) as IDBStore;
    app.loadData(data);
    showDataLoad.value = false;
  };
  reader.readAsText(f);
};

const removeChar = (index: number) =>
  $q
    .dialog({
      message: t('layout.deleteCharacter', { name: app.chars[index]!.name }),
      cancel: true,
    })
    .onOk(() => {
      app.conf.char = 0;
      app.chars.splice(index, 1);
    });

const rest = {
  round: () => {
    app.char.wp.current += roll(6);
    if (app.char.wp.current > app.char.wp.max) app.char.wp.current = app.char.wp.max;
  },
  stretch: () => {
    rest.round();
    app.char.hp.current += roll(6);
    if (app.char.hp.current > app.char.hp.max) app.char.hp.current = app.char.hp.max;
  },
  shift: () => {
    app.char.wp.current = app.char.wp.max;
    app.char.hp.current = app.char.hp.max;
    Object.entries(app.char.attributes).forEach(([key]) => (app.char.attributes[key as Attr].condition.check = false));
  },
};

const advance = () => {
  const advanced = app.rollAdvancements();
  $q.dialog({
    title: t('layout.skillsAdvancedTitle', { count: advanced.length }),
    message:
      advanced.length > 0
        ? t('layout.skillsAdvancedMessage', { skills: advanced.join(', ') })
        : t('layout.noSkillsAdvanced'),
    ok: true,
  });
};

const about = () =>
  $q.dialog({
    title: `<div class="text-h5">${t('layout.aboutTitle')}</div>`,
    html: true,
    message: `<p>${t('layout.aboutBody1')}</p>
      <p>${t('layout.aboutBody2')}</p>
      <p>${t('layout.aboutBody3')}</p>`,
  });

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
