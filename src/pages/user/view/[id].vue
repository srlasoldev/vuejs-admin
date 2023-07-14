<script setup lang="ts">
import UserBioPanel from '@/views/pages/user/view/UserBioPanel.vue'
import UserTabBillingsPlans from '@/views/pages/user/view/UserTabBillingsPlans.vue'
import UserTabConnections from '@/views/pages/user/view/UserTabConnections.vue'
import UserTabNotifications from '@/views/pages/user/view/UserTabNotifications.vue'
import UserTabOverview from '@/views/pages/user/view/UserTabOverview.vue'
import UserTabSecurity from '@/views/pages/user/view/UserTabSecurity.vue'

import { ApiClient } from "@/openapi/ApiClient";
import { Customer } from "@/openapi";

const route = useRoute()
const router = useRouter()
const userData = ref()
const userTab = ref(null)

const tabs = [
  { icon: 'mdi-account-outline', title: 'Threads' },
  { icon: 'mdi-lock-outline', title: 'Security' },
  { icon: 'mdi-bookmark-outline', title: 'Billing & Plan' },
  { icon: 'mdi-bell-outline', title: 'Notifications' },
  { icon: 'mdi-link-variant', title: 'Connections' },
]

const apiClient = new ApiClient({
  BASE: "http://localhost:8080",
});


apiClient.default
  .getCustomer(
      route.params.id
  )
  .then((response) => {
      userData.value = response
      breadcrumbs.value[2] = {'title': 
          response.Threads?.["51c5dd66-e837-48a3-8296-1084526bb891"]?.Fields["f08899aa-acaf-42f9-825b-4bc6500dea55"]?.Values[0] +
          " " +
          response.Threads?.["51c5dd66-e837-48a3-8296-1084526bb891"]?.Fields["34092d1a-2b9f-4a16-a91c-3cdc7a439ab5"]?.Values[0]
      }
  })
  .catch((error) => {
      console.error(error);
  });



var breadcrumbs = ref([
    {'title': 'Home', 'href':'/'},
    {'title': 'Clients', 'to': {'path': '/user/list'}},
    {'title': ""}
])

</script>

<template>
  <h2 class="mb-5">
      <router-link to="/user/list">Customers </router-link>

      ->

        {{userData?.Threads?.["51c5dd66-e837-48a3-8296-1084526bb891"]?.Fields["f08899aa-acaf-42f9-825b-4bc6500dea55"]?.Values[0]}}
        {{userData?.Threads?.["51c5dd66-e837-48a3-8296-1084526bb891"]?.Fields["34092d1a-2b9f-4a16-a91c-3cdc7a439ab5"]?.Values[0]}}

  </h2>
    

  <VRow v-if="userData">
    <VCol
      cols="12"
      md="4"
      lg="3"
    >
      <UserBioPanel :user-data="userData" />
    </VCol>

    <VCol
      cols="12"
      md="8"
      lg="9"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            start
            :icon="tab.icon"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <UserTabOverview :user-data="userData" />
        </VWindowItem>

        <VWindowItem>
          <UserTabSecurity />
        </VWindowItem>

        <VWindowItem>
          <UserTabBillingsPlans />
        </VWindowItem>

        <VWindowItem>
          <UserTabNotifications />
        </VWindowItem>

        <VWindowItem>
          <UserTabConnections />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>
