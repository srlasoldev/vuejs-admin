<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import SearchAidDrawer, {
  DrawerOption,
  SearchValues,
} from "@/views/pages/user/list/SearchAidDrawer.vue";
import type { Options } from "@core/types";
import { ApiClient } from "@/openapi/ApiClient";
import { Customer } from "@/openapi";
import { TagOption } from "@/components/ChipGroup.vue";

const router = useRouter();

type additionalOptions = {
  parts?: string[];
  searchItems?: string[];
};

const apiClient = new ApiClient({
  BASE: "http://localhost:8080",
});

const totalPage = ref(1);
const totalUsers = ref(0);
const users = ref<Customer[] | undefined>([]);
const isSearchAidDrawerVisible = ref(false);
const isSaveDrawerVisible = ref(false);

const paginationOptions = ref<Options & additionalOptions>({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: "",
});

// Headers
const headers = [
  { title: "NAME", key: "name" },
  { title: "EMAIL", key: "email" },
  { title: "STATUS", key: "status" },
  { title: "ACTION", key: "actions", sortable: false },
];

// 👉 Fetching users
const fetchUsers = () => {
  const s = paginationOptions.value.searchItems?.join(" ");
  router.push({
    query: {
      page: paginationOptions.value.page.toString(),
      search: s,
    },
  });

  apiClient.default
    .listCustomers(s, paginationOptions.value.page, ["contacts"])
    .then((response) => {
      users.value = response.Items;
      totalPage.value = response.Pages;
      paginationOptions.value.page = response.Page;
    })
    .catch((error) => {
      console.error(error);
    });
};

onMounted(() => {
  const sp = new URLSearchParams(window.location.search);
  const page = sp.get("page");
  const search = sp.get("search");

  if (page) paginationOptions.value.page = parseInt(page);
  if (search) paginationOptions.value.searchItems = search.split(" ");
});

const listToSelect = (list: string[]) =>
  list.map((item) => ({ title: item, value: item }));

const searchUser = (userData: SearchValues) =>
  (paginationOptions.value.searchItems = encodeSearchArgs(userData));

const deleteUser = (id: Customer["ID"]) => fetchUsers();

const encodeSearchArgs = (userData: SearchValues): string[] => {
  // format is similar to logfmt
  const out = [];
  out.push(
    ...Object.entries(userData).map(([key, value]) => {
      if (value === "" || !value) {
        return "";
      }
      if (Array.isArray(value)) {
        out.push(...value.map((v) => `${key}:${v}`));
        return;
      }

      return `${key}:${value}`;
    })
  );

  return out.filter(Boolean) as string[];
};

const groupValues = (
  v: TagOption
): {
  label: string;
  options: string[];
}[] => {
  // make a map of first letter to list of options
  const map = v.options.reduce((acc, item) => {
    const firstLetter = item[0].toUpperCase();
    acc.set(firstLetter, [...(acc.get(firstLetter) || []), item]);
    return acc;
  }, new Map<string, string[]>());

  // convert map to array of objects
  return Array.from(map.entries()).map(([label, options]) => ({
    label,
    options,
  }));
};

const searchOptions: { [k: string]: DrawerOption } = {
  userName: {
    type: "text",
    label: "User Name",
  },
  email: {
    type: "text",
    label: "Email",
  },
  plan: {
    type: "select",
    label: "Plan",
    options: listToSelect([
      "Admin",
      "Author",
      "Editor",
      "Maintainer",
      "Subscriber",
    ]),
  },
  role: {
    type: "select",
    label: "Role",
    options: listToSelect(["Basic", "Company", "Enterprise", "Team"]),
  },
  status: {
    type: "select",
    label: "Status",
    options: listToSelect(["Active", "Inactive"]),
  },
  tag: {
    type: "tags",
    label: "Tags",
    groupBy: groupValues,
    options: ["Dummy", "Testmail"],
  },
};

watchEffect(() => {
  fetchUsers();
});
</script>

<template>
  <v-breadcrumbs
    :items="[{ title: 'Home', href: '/' }, { title: 'Clients' }]"
  ></v-breadcrumbs>
  <section>
    <VCard>
      <VCardText>
        <VRow>
          <VCol>
            <VCombobox
              multiple
              v-model="paginationOptions.searchItems"
              label="Search"
              chips
              autofocus
              closable-chips
              deletable-chips
              append-inner-icon="mdi-magnify"
              @click:append-inner="
                (e) => {
                  isSearchAidDrawerVisible = true;
                  e.stopPropagation();
                }
              "
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex flex-wrap gap-4">
        <!-- 👉 Export button -->
        <VBtn variant="outlined" color="secondary" prepend-icon="mdi-cog">
          Work on
        </VBtn>

        <VSpacer />
        <VBtn @click="isSaveDrawerVisible = true"> Save View </VBtn>
      </VCardText>

      <!-- SECTION data table -->
      <VDataTableServer
        v-model:items-per-page="paginationOptions.itemsPerPage"
        v-model:page="paginationOptions.page"
        v-if="users"
        :items="users"
        :items-length="totalUsers"
        :headers="headers"
        show-select
        class="rounded-0"
        @update:options="paginationOptions = $event"
        @click:row="
          (_, item) => {
            router.push({ path: '/user/view/' + item.item.raw.ID });
          }
        "
      >
        <!-- User -->
        <template #item.name="{ item }">
          <div class="d-flex">
            <div class="d-flex flex-column">
              <h6 class="text-sm">
                <!--
                <RouterLink
                  :to="{ name: 'apps-user-view-id', params: { id: item.raw.id } }"
                  class="font-weight-medium user-list-name"
                >
                  {{ item.raw.fullName }}
                </RouterLink>
                -->
              </h6>

              <span class="text-xs text-medium-emphasis">
                {{
                  item.raw.Threads?.["51c5dd66-e837-48a3-8296-1084526bb891"]
                    ?.Fields["f08899aa-acaf-42f9-825b-4bc6500dea55"]?.Values[0]
                }}
                {{
                  item.raw.Threads?.["51c5dd66-e837-48a3-8296-1084526bb891"]
                    ?.Fields["34092d1a-2b9f-4a16-a91c-3cdc7a439ab5"]?.Values[0]
                }}
              </span>
            </div>
          </div>
        </template>

        <!-- Email -->
        <template #item.email="{ item }">
          <span class="text-sm">
            {{
              item.raw.Threads?.["51c5dd66-e837-48a3-8296-1084526bb891"]
                ?.Fields["825b51fc-cb6b-48b2-bd46-db9fee04671c"]?.Values[0]
            }}
          </span>
        </template>

        <!-- Project -->
        <template #item.role="{ item }">
          <div class="d-flex gap-2">
            <span class="text-capitalize">{{ item.raw.role }}</span>
          </div>
        </template>

        <!-- Plan -->
        <template #item.plan="{ item }">
          <span class="text-capitalize text-high-emphasis">{{
            item.raw.currentPlan
          }}</span>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          {{ item.raw.status }}
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <VBtn icon variant="text" size="small" color="medium-emphasis">
            <VIcon size="24" icon="mdi-cog" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  :to="{
                    name: 'apps-user-view-id',
                    params: { id: item.raw.id },
                  }"
                >
                  <template #prepend>
                    <VIcon icon="mdi-eye-outline" />
                  </template>
                  <VListItemTitle>View</VListItemTitle>
                </VListItem>

                <VListItem link>
                  <template #prepend>
                    <VIcon icon="mdi-pencil-outline" />
                  </template>
                  <VListItemTitle>Edit</VListItemTitle>
                </VListItem>

                <VListItem @click="deleteUser(item.raw.id)">
                  <template #prepend>
                    <VIcon icon="mdi-delete-outline" />
                  </template>
                  <VListItemTitle>Delete</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>

        <!-- Pagination -->
        <template #bottom>
          <VDivider />

          <div class="d-flex justify-end gap-x-6 pa-2 flex-wrap">
            <div class="d-flex align-center gap-x-2 text-sm">
              Rows Per Page:
              <VSelect
                v-model="paginationOptions.itemsPerPage"
                class="per-page-select text-high-emphasis"
                variant="plain"
                density="compact"
                :items="[10, 20, 25, 50, 100]"
              />
            </div>

            <span class="d-flex align-center text-sm me-2 text-high-emphasis"
              >x/y</span
            >

            <div class="d-flex gap-x-2 align-center me-2">
              <VBtn
                icon="mdi-chevron-left"
                class="flip-in-rtl"
                variant="text"
                density="comfortable"
                color="default"
                :disabled="paginationOptions.page <= 1"
                @click="
                  paginationOptions.page <= 1
                    ? (paginationOptions.page = 1)
                    : paginationOptions.page--
                "
              />

              <VBtn
                icon="mdi-chevron-right"
                class="flip-in-rtl"
                density="comfortable"
                variant="text"
                color="default"
                :disabled="
                  paginationOptions.page >=
                  Math.ceil(totalUsers / paginationOptions.itemsPerPage)
                "
                @click="
                  paginationOptions.page >=
                  Math.ceil(totalUsers / paginationOptions.itemsPerPage)
                    ? (paginationOptions.page = Math.ceil(
                        totalUsers / paginationOptions.itemsPerPage
                      ))
                    : paginationOptions.page++
                "
              />
            </div>
          </div>
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>

    <!-- 👉 Add New User -->
    <SearchAidDrawer
      v-model:isDrawerOpen="isSearchAidDrawerVisible"
      @user-data="searchUser"
      :options="searchOptions"
    />
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 24.0625rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
