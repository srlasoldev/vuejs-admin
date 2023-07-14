<script setup lang="ts">
export type TagOption = {
  type: "tags";
  label: string;
  rules?: any;
  value?: string[];
  options: string[];
};

const props = defineProps<{
  options: string[];
  searchValues: Record<string, any>;
  mapKey: string;
}>();
</script>

<template>
  <VChip
    v-for="tag of props.options"
    :value="tag"
    :key="tag"
    size="small"
    label
    @click="
      {
        if (
          !props.searchValues[mapKey] ||
          !(searchValues[mapKey] as string[]).length
        ) {
          searchValues[mapKey] = [];
        }

        if (!(searchValues[mapKey] as string[]).includes(tag))
          (searchValues[mapKey] as string[]).push(tag);
        else
          (searchValues[mapKey] as string[]).splice(
            (searchValues[mapKey] as string[]).findIndex(
              (v: string) => tag == v,
              1
            )
          );
      }
    "
  >
    {{ tag }}
  </VChip>
</template>
