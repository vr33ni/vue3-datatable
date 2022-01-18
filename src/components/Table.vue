<template>
  <div class="pt-2 d-flex flex-column">
    <div class="row">
      <h2>Table</h2>
    </div>
    <hr>
    <div>
      <!-- <TableDataFilter /> -->
    </div>

    <TheDatatableSkeleton
      :data="tableData"
      :columns="columns"
      :default-sort="{key: 'customer', type: 'DESC'}"
    />
  </div>
</template>

<script setup>

import { computed, ref } from 'vue';
// initStore
// import { useStore } from 'vuex';
import speedDate from 'speed-date';
// import TableDataFilter from './TableDataFilter.vue';
import TheDatatableSkeleton from './datatableSkeleton/TheDatatableSkeleton.vue';
import options from '../static/json/options.json'

// const store = useStore();
const dropdownOptions= [{"id":1,"name":"3D991","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":2,"name":"3E001","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":3,"classification":"3E991","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":4,"classification":"4D993","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":5,"classification":"4D993.C","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":6,"classification":"5D002.A.1","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":7,"classification":"5D002.C.1","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":8,"classification":"5D002ENC3","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":9,"classification":"7D994","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":10,"classification":"9E515","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":11,"classification":"9E515.E","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":12,"classification":"CATEGORY XI (D)","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":13,"classification":"EAR99","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false},{"id":14,"classification":"N","category":"ECCN","createdAt":"2021-09-23T14:36:40Z","updatedAt":"2021-10-06T15:12:40Z","isObsolete":false}]; // store.getters['categoryECCN/all']);
const tableData = [{
  "customerID":92,
  "customer":"abc",
  "emailDomain":"abc.com",
  "expirationDate":"2030-01-01T00:00:00Z",
  "dropdown":[{"id":773,"customerID":92,"name":"3D225","isObsolete":false}]
   }]

const dateFormat = speedDate('YYYY-MM-DD');
const sampleDropdown = computed(() => dropdownOptions.map((item) => ({
  key: item.id,
  name: item.name,
})));

const prefilledDropdownOptions = computed(() => tableData.map((item) => ({
  key: item.customerID,
  name: item.dropdown,
})));

function getClassificationTypesForRow(row, types) {
  const qtype = types.value.find((type) => type.key === row.customerID);
  const vals = qtype.name.map((item) => ({
    key: item.id,
    name: item.name,
  }));
  return vals;
}

// table columns
const columns = ref([{
  title: 'Text column', key: 'customer', valueResolver: (row) => row.customer, filterResolver: (row) => row.customer, editable: true, sortable: true, sortType: 'STRING', hrefKey: 'customerHref',
}, {
  title: 'Text column', key: 'emailDomain', valueResolver: (row) => row.emailDomain, sortable: true, editable: true, sortType: 'STRING',
},
{
  title: 'Date column', key: 'date', valueResolver: (row) => (row.date === '0001-01-01T00:00:00Z' || row.expirationDate == null ? null : dateFormat(new Date(row.expirationDate))), filterResolver: (row) => row.expirationDate, sortable: true, editable: true, sortType: 'DATE',
}, {
  title: 'Dropdown column',
  editable: true,
  key: 'dropdown',
  valueResolver: (row) => (row.dropdown ? getClassificationTypesForRow(row, prefilledDropdownOptions) : ''),
  sortable: false,
  sortType: 'STRING',
  possibleValues: sampleDropdown,
  multipleSelect: true,
}
]);


</script>
