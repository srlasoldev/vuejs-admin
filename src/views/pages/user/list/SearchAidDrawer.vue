<script setup lang="ts">
import { TagOption } from "@/components/ChipGroup.vue";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import type { VForm } from "vuetify/components/VForm";
import type { VSelect } from "vuetify/components/VSelect";

export type DrawerOption =
  | {
      type: "text";
      label: string;
      placeholder?: string;
      rules?: any; // can't get the type because library doesn't expose it
      value?: string;
    }
  | {
      type: "select";
      label: string;
      options: {
        title: string;
        value: string;
      }[];
      rules?: any;
      value?: string;
    }
  | {
      type: "checkbox";
      label: string;
      rules?: any;
      value?: boolean;
    }
  | (TagOption & {
      groupBy?: (v: TagOption) => { label: string; options: string[] }[];
    });

type Options = Record<string, DrawerOption>;
export type SearchValues = Record<string, DrawerOption["value"]>;

const props = defineProps<{
  isDrawerOpen: boolean;
  options: Options;
}>();

const emit = defineEmits<{
  (e: "update:isDrawerOpen", value: boolean): void;
  (e: "userData", value: SearchValues): void;
}>();
const searchValues = ref<SearchValues>({});
const isFormValid = ref(false);
const refForm = ref<VForm>();

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("update:isDrawerOpen", false);

  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
  });
};

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit("userData", searchValues.value);
      emit("update:isDrawerOpen", false);
      nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
      });
    }
  });
};

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit("update:isDrawerOpen", val);
};

watch(searchValues.value, () => {
  emit("userData", searchValues.value);
});
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="600"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection title="Search" @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <VCol
                cols="12"
                v-for="[key, value] in Object.entries(props.options)"
              >
                <VTextField
                  v-if="value.type === 'text'"
                  :label="value.label"
                  :placeholder="value.placeholder"
                  v-model="searchValues[key]"
                  :validation-value="searchValues[key]"
                  :rules="value.rules"
                />
                <VSelect
                  v-if="value.type === 'select'"
                  :items="value.options"
                  :label="value.label"
                  v-model="searchValues[key]"
                  :validation-value="searchValues[key]"
                  :rules="value.rules"
                />
                <VCheckbox
                  v-if="value.type === 'checkbox'"
                  :label="value.label"
                  v-model="searchValues[key]"
                  :validation-value="searchValues[key]"
                  :rules="value.rules"
                />
                <VChipGroup
                  v-if="value.type === 'tags'"
                  :validation-value="searchValues[key]"
                  :rules="value.rules"
                  class="gap-4"
                  filter
                  multiple
                  selected-class="text-primary"
                >
                  <h3>
                    {{ value.label }}
                  </h3>
                  <!-- if groupBy, have categories -->
                  <div
                    v-if="value.groupBy"
                    v-for="v in value.groupBy(value)"
                    class="d-flex align-items-center gap-4 w-100"
                  >
                    <h4 class="tags-label">
                      {{ v.label }}
                    </h4>
                    <div class="w-100">
                      <ChipGroup
                        :search-values="searchValues"
                        :options="v.options"
                        :mapKey="key"
                        :key="v.label"
                      ></ChipGroup>
                    </div>
                  </div>
                  <ChipGroup
                    v-else
                    :search-values="searchValues"
                    :options="value.options"
                    :mapKey="key"
                  ></ChipGroup>
                </VChipGroup>
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3"> Submit </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>

<style lang="scss">
.tags-label {
  width: 2ch;
  align-self: center;
}
</style>
