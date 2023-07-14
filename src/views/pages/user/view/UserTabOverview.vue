<script setup lang="ts">

interface Props {
  userData: {
  }
}
const props = defineProps<Props>()

</script>

<template>
    <VCard
        class="pa-sm-5 pa-5 mb-6"
        v-for='thread in props.userData.Threads'
    >


      <VCardItem class="">
        <VCardTitle class="text-h5">
            {{ thread.Name }}
        </VCardTitle>
        <VCardSubtitle>
            Description of thread goes here
        </VCardSubtitle>
      </VCardItem>

      <VCardText>

        <VForm
          class="mt-3"
          @submit.prevent="onFormSubmit"
        >
          <VRow>

            <VCol
                v-for='field in Object.values(thread.Fields).sort((a,b)=>a.Position-b.Position)'
                cols="12"
                md="6"
            >
              <VTextField
                v-model=field.Values[0]
                :label=field.Name
              />
            </VCol>



          </VRow>
        </VForm>
      </VCardText>
    </VCard>
</template>

