<script lang="ts" setup>

const connectedAccounts = ref([
])

const socialAccounts = ref([
])
</script>

<template>
  <VRow>
    <!-- 👉 connected accounts -->
    <VCol cols="12">
      <VCard
        title="Connected Accounts"
        subtitle="Display content from your connected accounts on your site"
      >
        <VCardText>
          <VList class="card-list">
            <VListItem
              v-for="account in connectedAccounts"
              :key="account.title"
            >
              <VListItemTitle class="font-weight-medium">
                {{ account.title }}
              </VListItemTitle>

              <VListItemSubtitle>{{ account.text }}</VListItemSubtitle>
              <template #prepend>
                <VAvatar
                  start
                  :size="35"
                  :image="account.img"
                />
              </template>

              <template #append>
                <VSwitch
                  v-model="account.connected"
                  density="compact"
                  class="me-1"
                />
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 social accounts -->
    <VCol cols="12">
      <VCard
        title="Social Accounts"
        subtitle="Display content from social accounts on your site"
      >
        <VCardText>
          <VList class="card-list">
            <VListItem
              v-for="(account) in socialAccounts"
              :key="account.title"
            >
              <VListItemTitle class="font-weight-medium">
                {{ account.title }}
              </VListItemTitle>

              <template #prepend>
                <VAvatar
                  start
                  size="36"
                  rounded="0"
                  :image="account.img"
                />
              </template>

              <VListItemSubtitle v-if="account.connected">
                <a
                  :href="account.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-caption"
                >
                  {{ account.username }}
                </a>
              </VListItemSubtitle>

              <VListItemSubtitle
                v-else
                class="text-caption"
              >
                Not connected
              </VListItemSubtitle>

              <template #append>
                <IconBtn
                  :color="account.connected ? 'error' : 'secondary'"
                  variant="outlined"
                  class="rounded"
                >
                  <VIcon
                    size="20"
                    :icon="account.connected ? 'mdi-delete-outline' : 'mdi-link'"
                  />
                </IconBtn>
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1rem;
}
</style>
