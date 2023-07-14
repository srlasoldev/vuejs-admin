<script setup lang="ts">
import { avatarText, kFormatter } from '@core/utils/formatters'

interface Props {
  userData: {
  }
}

const props = defineProps<Props>()

</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.userData">
        <VCardText class="text-center pt-15">

          <!-- 👉 User fullName -->
          <h6 class="text-h6 mt-4">
            {{ props.userData.Threads?.["51c5dd66-e837-48a3-8296-1084526bb891"]?.Fields["f08899aa-acaf-42f9-825b-4bc6500dea55"]?.Values[0]}}
            {{ props.userData.Threads?.["51c5dd66-e837-48a3-8296-1084526bb891"]?.Fields["34092d1a-2b9f-4a16-a91c-3cdc7a439ab5"]?.Values[0]}}
          </h6>

          <!-- 👉 Role chip -->
          <VChip
            label
            :color="red"
            density="comfortable"
            class="text-capitalize mt-4"
          >
            Dummy
          </VChip>
        </VCardText>

        <VCardText class="d-flex justify-space-between flex-wrap mt-1">
          <!-- 👉 Done task -->
          <div class="d-flex align-center">
            <VAvatar
              :size="44"
              rounded
              color="primary"
              variant="tonal"
              class="me-4"
            >
              <VIcon
                size="24"
                icon="mdi-check"
              />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                {{ kFormatter(props.userData.taskDone) }}
              </h6>
              <span>Task Done</span>
            </div>
          </div>

          <!-- 👉 Done Project -->
          <div class="d-flex align-center">
            <VAvatar
              :size="44"
              rounded
              color="primary"
              variant="tonal"
              class="me-4"
            >
              <VIcon
                size="24"
                icon="mdi-star-outline"
              />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                {{ kFormatter(props.userData.projectDone) }}
              </h6>
              <span>Project Done</span>
            </div>
          </div>
        </VCardText>

        <!-- 👉 Details -->
        <VCardText>
          <h6 class="text-h6">
            Contact
          </h6>

          <VDivider class="my-4" />

          <!-- 👉 User Details list -->
          <VList class="card-list">


          <VListItem v-for='field in Object.values(props.userData.Threads["51c5dd66-e837-48a3-8296-1084526bb891"].Fields).sort((a,b)=>a.Position-b.Position)'>
              <VListItemTitle>
                <h6 class="text-sm font-weight-medium">
                    {{ field.Name }}
                  <span class="text-body-2">
                    {{ field.Values?.[0] }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center gap-4">
          <VBtn
            variant="elevated"
            @click="isUserInfoEditDialogVisible = true"
          >
            Save Changes
          </VBtn>

          <VBtn
            variant="tonal"
          >
          Reset
          </VBtn>

          <VBtn
            variant="outlined"
            color="error"
          >
            Delete
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit user info dialog -->
  <UserInfoEditDialog
    v-model:isDialogVisible="isUserInfoEditDialogVisible"
    :user-data="props.userData"
  />

  <!-- 👉 Upgrade plan dialog -->
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.current-plan {
  border: 2px solid rgb(var(--v-theme-primary));
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
