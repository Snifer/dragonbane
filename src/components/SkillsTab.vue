<template>
  <!-- file deepcode ignore PureFunctionReturnValueIgnored: The return value is passed to the component -->
  <div class="row">
    <div class="col-12 text-h5 text-bold q-mb-sm">
      <div class="row items-baseline q-gutter-lg">
        <div class="col-shrink">{{ t('tabs.primarySkills') }}</div>
        <q-input class="col-grow" :label="t('common.search')" v-model="filter" clearable dense>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in app.char.priSkills" :key="`priSkill-${k}`">
      <div v-if="show(k as string)">
        <char-skill
          v-model="app.char.priSkills[k]!"
          :label="skillLabel(k as string)"
          :skill-name="k as string"
          :skill-type="RollTypes.Primary"
        />
      </div>
    </div>
  </div>

  <div class="row q-mt-md">
    <div class="col-12 text-h5 text-bold q-mb-sm">
      {{ t('tabs.secondarySkills') }}
      <q-btn icon="add_circle" flat dense rounded @click="showAddSkill = true" />
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in app.char.secSkills" :key="`secSkill-${k}`">
      <char-skill
        v-model="app.char.secSkills[k]!"
        :label="skillLabel(k as string)"
        :skill-name="k as string"
        show-delete
        @delete="removeSecSkill"
        :skill-type="RollTypes.Secondary"
      />
    </div>
  </div>

  <q-dialog v-model="showAddSkill">
    <q-card>
      <q-card-section class="column">
        <q-input :label="t('form.skillName')" v-model="newSkillName" dense />
        <q-select :label="t('form.attribute')" :options="Object.values(Attrs)" v-model="newSkillAttr" dense />
      </q-card-section>
      <q-card-actions class="row justify-evenly">
        <q-btn
          class="col"
          color="red"
          :label="t('common.cancel')"
          @click="
            newSkillName = '';
            showAddSkill = false;
          "
          flat
        />
        <q-btn
          class="col"
          color="green"
          :label="t('common.add')"
          @click="
            app.char.secSkills[newSkillName] = skill(newSkillAttr);
            newSkillName = '';
            showAddSkill = false;
          "
          flat
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { Attrs, RollTypes } from './models';

import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useCharacterStore } from '../stores/character';

import { skillLabelKey } from '../lib/domain';
import { skill } from '../lib/defaults';

import CharSkill from './CharSkill.vue';

const app = useCharacterStore();
const { t } = useI18n();

const $q = useQuasar();
const showAddSkill = ref(false);
const newSkillName = ref('');
const newSkillAttr = ref(Attrs.STR);
const removeSecSkill = (val: string) =>
  $q
    .dialog({
      message: t('dialog.deleteSkill'),
      cancel: true,
    })
    .onOk(() => delete app.char.secSkills[val]);
const skillLabel = (name: string): string => {
  const key = skillLabelKey(name);
  return key ? t(key) : name;
};

const filter = ref('');
const show = (name: string): boolean => {
  if (filter.value == '' || filter.value == null) return true;
  if (RegExp(filter.value, 'i').test(name)) return true;
  return false;
};
</script>
