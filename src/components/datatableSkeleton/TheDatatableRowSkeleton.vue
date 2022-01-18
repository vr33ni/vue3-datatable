<template>
  <tr>
    <td
      data-label="Action"
      class="text-nowrap"
      scope="row"
    >
       <btn-group>
      <button
        v-if="!isNewRow && !rowIsInEditMode"
        :disabled="!isAdminModeEnabled"
        class="btn btn-outline-primary btn-sm"
        @click="startEditRow"
      >
        <font-awesome-icon
          :icon="['fas', 'edit']"
        />
      </button>
      <button
        v-if="isNewRow && !rowIsInEditMode"
        class="btn btn-outline-primary btn-sm"
        :disabled="!isAdminModeEnabled"
        @click="startEditRow"
      >
        <font-awesome-icon
          :icon="['fas', 'plus-circle']"
        />
      </button>
   
      <button
        v-if="rowIsInEditMode"
        class="btn btn-outline-primary btn-sm me-1"
        :disabled="!isAdminModeEnabled"
        @click="saveRow"
      >
        <font-awesome-icon
          :icon="['fas', 'save']"
        />
      </button>
      <button
        v-if="rowIsInEditMode"
        class="btn btn-outline-primary btn-sm"
        @click="cancelRow"
      >
        <font-awesome-icon
          :icon="['fas', 'times-circle']"
        />
      </button>
      </btn-group>
    </td>
    <TheDatatableColumnSkeleton
      v-for="(column, index) in columns"
      :key="index"
      v-model:editValue="editRow[column.key]"
      :row="row"
      :column="column"
      :row-is-in-edit-mode="rowIsInEditMode"
      :is-new-row="isNewRow"
    />
    <td
      scope="row"
      data-label=""
      class="text-nowrap"
    >
      <button
        v-if="!isNewRow"
        class="btn btn-outline-primary btn-sm btn-sm-full-width"
        :disabled="!isAdminModeEnabled"
         :title="'Delete ' + row.customer"
        :data-bs-target="'#del_row' + row.customer.replace(/\s+/g, '_')"
      >
        <font-awesome-icon
          :icon="['fas', 'trash']"
        />
      </button>
    </td>
    <!-- <Modal
      :id="'del_row' + row.customer.replace(/\s+/g, '_')"
      :title="'Delete ' + row.customer "
      :message="'Are you sure, you want to remove '+row.customer +
        ' with following email domain '+row.EmailDomain+' from the list of sanctioned customers?'"
      text-ok="OK"
      text-cancel="Cancel"
      @ok="deleteRow()"
    /> -->
  </tr>
</template>

<script setup>
import {
  toRefs, computed, ref, onMounted, watchEffect, watch,
} from 'vue';
import TheDatatablePager from './TheDatatablePager.vue';
import TheDatatableSortIcon from './TheDatatableSortIcon.vue';
import TheDatatableColumnSkeleton from './TheDatatableColumnSkeleton.vue';
// import Modal from '../global/Modal.vue';

const props = defineProps({
  row: Object,
  columns: Array,
  rowIsInEditMode: Boolean,
  isNewRow: Boolean,
  isAdminModeEnabled: Boolean,
});

const {
  row, columns, isAdminModeEnabled, isNewRow,
} = toRefs(props);


const emit = defineEmits(['startEditRow', 'saveRow', 'addRow', 'cancelRow', 'deleteRow', 'isValidDate']);

// neues datenobjekt anlegen
const editRow = ref(row.value);

function startEditRow() {
  // aktuelle row in editier row kopieren
  editRow.value = { ...row.value };
  emit('startEditRow', row.value);
}
function saveRow() {
  if (isNewRow.value) {
    emit('addRow', editRow.value);
  } else {
    emit('saveRow', editRow.value);
  }
}
function cancelRow() {
  emit('cancelRow');
}

function deleteRow() {
  emit('deleteRow', row.value);
}

</script>

<style lang="scss" scoped>

</style>
