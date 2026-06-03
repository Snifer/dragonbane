<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { useCharacterStore } from './stores/character';

// Default to dark
const c = useCharacterStore();
if (c.conf.darkMode == undefined) c.conf.darkMode = true;
if (c.conf.showSpells == undefined) c.conf.showSpells = true;
if (c.conf.showTrainedSkills == undefined) c.conf.showTrainedSkills = true;

const $q = useQuasar();
$q.dark.set(true);
</script>
