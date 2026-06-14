<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { watch } from 'vue';
import { useCharacterStore } from './stores/character';
import { setLocale } from './i18n';

// Default to dark
const c = useCharacterStore();
if (c.conf.darkMode == undefined) c.conf.darkMode = true;
if (c.conf.showSpells == undefined) c.conf.showSpells = true;
if (c.conf.showTrainedSkills == undefined) c.conf.showTrainedSkills = true;
c.migrateLegacyData();

const $q = useQuasar();
$q.dark.set(true);

watch(
  () => c.conf.locale,
  (locale) => {
    if (locale) setLocale(locale);
  },
  { immediate: true },
);
</script>
