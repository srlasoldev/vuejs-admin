<script setup lang="ts">
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import type { VForm } from "vuetify/components/VForm";
import type { VSelect } from "vuetify/components/VSelect";

interface Emit {
  (e: "update:isDrawerOpen", value: boolean): void;
  (
    e: "userData",
    value: {
      [key: string]: DrawerOption;
    }
  ): void;
}

export type DrawerOption =
  | {
      type: "text";
      label: string;
      placeholder?: string;
      rules?: any; // can't get the type because library doesn't expose it
    }
  | {
      type: "select";
      label: string;
      options: {
        title: string;
        value: string;
      }[];
      rules?: any;
    }
  | {
      type: "checkbox";
      label: string;
      rules?: any;
    };

type Options = {
  [key: string]: DrawerOption;
};

interface Props {
  isDrawerOpen: boolean;
  options: Options;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();
const searchValues = ref<{ [k: string]: any }>({});
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
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection title="Add User" @cancel="closeNavigationDrawer" />

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
