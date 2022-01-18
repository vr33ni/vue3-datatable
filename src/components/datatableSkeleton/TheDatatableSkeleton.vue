<template>
  <div class="d-flex flex-column justify-content-center flex-grow-1">
    <div class="flex-grow-1 table-responsive">
      <table class="table table-striped table-sm table-hover">
        <thead>
          <tr>
            <th
              scope="col"
            >
              Action
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
            >
              {{ column.title }}
              <TheDatatableSortIcon
                v-model:sort-column="sortColumn"
                :column="column"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <TheDatatableRowSkeleton
            v-for="row in processedData"
            :key="row.customer"
            :row="row"
            :columns="columns"
            :row-is-in-edit-mode="row.customer === rowInEditMode?.customer"
            :is-admin-mode-enabled="isAdminModeEnabled"
            @startEditRow="startEditRow"
            @saveRow="saveRow"
            @cancelRow="cancelRow"
            @deleteRow="deleteRow"
          />

          <TheDatatableRowSkeleton
            v-for="row in newRows"
            :key="row.customer"
            :row="row"
            :columns="columns"
            :row-is-in-edit-mode="row.customer === rowInEditMode?.customer"
            :is-new-row="isNewRow"
            :is-admin-mode-enabled="isAdminModeEnabled"
            @startEditRow="startEditRow"
            @addRow="addRow"
            @cancelRow="cancelRow"
            @deleteRow="deleteRow"
          />
        </tbody>
      </table>
    </div>
    <TheDatatablePager
      v-model:currentPage="currentPage"
      :page-size="pageSize"
      :count="count"
    />
  </div>
</template>

<script setup>
import {
  toRefs,
  computed,
  ref,
  onMounted,
  watch,
} from 'vue';
 import TheDatatableRowSkeleton from './TheDatatableRowSkeleton.vue';
import TheDatatablePager from './TheDatatablePager.vue';
import TheDatatableSortIcon from './TheDatatableSortIcon.vue';
import options from '../../static/json/options.json';

 const props = defineProps({
  data: Array,
  columns: Array,
  defaultSort: Object, // {key: '', type: 'ASC/DESC'}
  isAdminModeEnabled: Boolean,
  isNewRow: Boolean,
});
const { data, columns } = toRefs(props);

const sortColumn = ref(props.defaultSort);
const currentPage = ref(0);
const pageSize = ref(10);
const rowInEditMode = ref(undefined);
// eslint-disable-next-line max-len
const isNewRow = ref(true); // row below the list of rows signifies the row used to create a new entry
const count = ref(0);
const table = ref(null);
// editing only allowed for admins
const isAdminModeEnabled = true; //computed(() => store.getters['users/getAdminMode']);

// reset page & item count when data changes
watch(
  data,
  (newData) => {
    currentPage.value = 0;
    count.value = newData ? newData.length : 0;
  },
  { immediate: true },
);

const processedData = computed(() => {
  const sortedData = data.value ? [...data.value] : [];
  if (sortColumn.value && sortColumn.value.key) {
    const { key, type } = sortColumn.value;

    const { sortType, valueResolver, filterResolver } = columns.value.find(
      (c) => c.key === key,
    );
    sortedData.sort((a, b) => {
      // row key can be a function
      let aValue;
      let bValue;
      if (filterResolver) {
        aValue = filterResolver(a);
        bValue = filterResolver(b);
      } else if (valueResolver) {
        aValue = valueResolver(a);
        bValue = valueResolver(b);
      } else {
        aValue = a[key];
        bValue = b[key];
      }
      let compareValue = 0;

      if (sortType === 'BOOLEAN') {
        compareValue = Boolean(aValue) - Boolean(bValue);
      } else if (sortType === 'NUMBER') {
        compareValue = parseFloat(aValue) - parseFloat(bValue);
      } else if (sortType === 'DATE') {
        compareValue = new Date(aValue) - new Date(bValue);
      } else {
        compareValue = (aValue || '').localeCompare(bValue);
      }

      // invert if desc
      return compareValue * (type === 'DESC' ? -1 : 1);
    });
  }

  return sortedData.slice(
    currentPage.value * pageSize.value,
    (currentPage.value + 1) * pageSize.value,
  );
});

// the columns and respective empty values needed to create a new row
const newRows = ref([
  {
    id: null,
    customerID: null,
    customer: '',
    emailDomain: '',
    date: null,
    dropdown: null,
    isObsolete: false,
  },
]);

function startEditRow(row) {
  rowInEditMode.value = row ? { ...row } : undefined;
}

async function saveRow(row) {
  const saveableRow = { ...row };
  if (saveableRow.expirationDate !== null) {
    if (saveableRow.status === '-1') {
      delete saveableRow.status;
    }
    // await store.dispatch('your-custom-endpoint/update', saveableRow);
    rowInEditMode.value = undefined;
  } else {
    // store.dispatch(
    //   'toasts/add',
    //   {
    //     title: `Cannot update ${row.id}`,
    //     text: 'Warning details',
    //     cssClass: 'warning',
    //   },
    //   { root: true },
    // );
  }
}

async function addRow(row) {
  const saveableRow = { ...row };
  if (saveableRow.status === '-1') {
    delete saveableRow.status;
  }
  const today = new Date();
  if (saveableRow.customer !== '') {
    // eslint-disable-next-line max-len
    if (saveableRow.expirationDate == null) { // if the date was set incorrectly or left empty, use a maximum value
      const maxDate = computed(() => options.expirationDate.maxDateForStoringInDB);
      saveableRow.expirationDate = maxDate.value;
      // store.dispatch(
      //   'toasts/add',
      //   {
      //     title: `Warning for entry: ${saveableRow.id}`,
      //     text: 'Warning details',
      //     cssClass: 'warning',
      //   },
      //   { root: true },
      // );
    } else if (saveableRow.expirationDate < today) {
      // console.log('expiration date lies in the past ');
      saveableRow.isObsolete = true;
    }
    // await store.dispatch('your-custom-endpoint/add', saveableRow);
    rowInEditMode.value = undefined;
  } else {
    // store.dispatch(
    //   'toasts/add',
    //   {
    //     title: `Cannot add ${saveableRow.id}`,
      //   text: 'Warning details',
    //     cssClass: 'warning',
    //   },
    //   { root: true },
    // );
  }
}

async function deleteRow(row) {
    const rowToDelete = { ...row };
    if (rowToDelete.status === '-1') {
      delete rowToDelete.status;
    }
    // await store.dispatch(
    //   'your-custom-endpoint/delete,
    //   rowToDelete.id,
    // );
}

function cancelRow() {
  rowInEditMode.value = undefined;
}
</script>

<style lang="scss" scoped>

</style>
