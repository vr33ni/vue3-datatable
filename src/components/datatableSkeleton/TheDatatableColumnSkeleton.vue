<template>
  <!-- <td v-if="rowIsInEditMode"> -->
  <td :data-label="column.key">
    <VueMultiselect
      v-if="rowIsInEditMode && column.editable && column.possibleValues && column.multipleSelect"
      :model-value="editValueIfMultiple"
      class="field"
      :options="column.possibleValues"
      :multiple="true"
      :close-on-select="true"
      :searchable="true"
      placeholder="Please select"
      label="classificationName"
      track-by="classificationName"
      :select-label="''"
      :deselect-label="''"
      :selected-label="''"

      @update:modelValue="changeSelection($event)"
    >
      <template #option="props">
        <div class="option__desc">
          <span
            class="option__title multiselect-custom-option"
          >{{ props.option.classificationName }}</span>
          <span
            v-if="!props.option.classificationName"
            class="option__small"
          > (new)</span>
        </div>
      </template>
    </VueMultiselect>

    <select
      v-else-if="rowIsInEditMode && column.editable && column.possibleValues"
      :value="new Date(editValue)"
      class="form-select form-select-sm"
      :aria-label="'edit ' + column.title"
      @input="$emit('update:editValue', $event.target.value)"
    >
      <option
        v-for="possibleValue in column.possibleValues"
        :key="possibleValue.key"
        :value="possibleValue.key"
        :selected="row[column.key] === possibleValue.key"
      >
        {{ possibleValue.classificationName }}
      </option>
    </select>

    <datepicker
      v-else-if="isNewRow && rowIsInEditMode && column.editable && column.sortType=='DATE'"
      class="datepicker form-control form-control-sm "
      style="min-height: calc(2.5em + 1.05rem + 2px) !important;
  background-color: white !important"
      :model-value="editValue"
      :placeholder="isNewRow ? 'Select date' : editValue"
      starting-view="month"
      :typeable="isTypeable"
      @update:modelValue="addExpirationDateToFilter($event)"
    />
    <datepicker
      v-else-if="!isNewRow && rowIsInEditMode && column.editable && column.sortType=='DATE'"
      class="datepicker form-control form-control-sm "
      style="min-height: calc(2.5em + 1.05rem + 2px) !important;
  background-color: white !important"
      :model-value="editValue"
      :placeholder="isNewRow ? 'Select date' : editValue"
      starting-view="month"
      :typeable="isTypeable"
      @update:modelValue="addExpirationDateToFilter($event)"
    />
    <textarea
      v-else-if="isNewRow && rowIsInEditMode && column.editable"
      class="form-control form-control-sm textarea-sm-width"
      rows="3"
      :placeholder="isNewRow ? 'add ' + column.title : 'edit ' + column.title"
      :value="editValue"
      @input="$emit('update:editValue', $event.target.value)"
    />
    <a
      v-else-if="column.hrefKey && row[column.hrefKey]"
      :href="row[column.hrefKey]"
      target="_blank"
      style="white-space: pre-wrap"
    >
      {{ value }}
    </a>
    <ul
      v-else-if="column.possibleValues"
      style="padding-left:1em"
    >
      <li
        v-for="item in value"
        :key="item.key"
      >
        {{ item.classificationName }}
      </li>
    </ul>
    <span
      v-else
      style="white-space: pre-wrap"
    >
      {{ value }}
    </span>
  </td>
</template>

<script setup>
import {
   toRefs, ref, onMounted, watchEffect, watch, computed,
} from 'vue';
import VueMultiselect from 'vue-multiselect';
import speedDate from 'speed-date';
import Datepicker from 'vue3-datepicker';

const props = defineProps({
  row: Object,
  column: Object,
  rowIsInEditMode: Boolean,
  isNewRow: Boolean,
  editValue: [String, Number, Array, Date],
});

const { row, column, editValue } = toRefs(props);

const emit = defineEmits(['update:editValue']);

const value = computed(() => {
  const { key, valueResolver } = column.value;
  return valueResolver ? valueResolver(row.value) : row.value[key];
});

const isTypeable = computed(() => true);

// eslint-disable-next-line max-len
const editValueIfMultiple = computed(() => { // important to differentiate between if the array is loaded initially from the json file or has been modified via the multiselect
  // eslint-disable-next-line max-len
  const vals = editValue.value !== null || editValue.value === undefined ? editValue.value.map((item) => ({
    id: item.id,
    customerID: item.customerID,
    // eslint-disable-next-line max-len
    classificationName: item.classificationName === null || item.classificationName === undefined ? item.label : item.classificationName,
  })) : '';

  return vals;
});

// eslint-disable-next-line max-len
function addExpirationDateToFilter(selection) { // filter all sanctioned customers based on whether their sanctions expire before or after the set filter
  emit('update:editValue', selection);
}

function changeSelection(selection) {
  emit('update:editValue', selection);
}

</script>

<style lang="scss" scoped>

.field {
  font-weight: 100 !important;
  border-left-width: 1px;
}

.form-control >.datepicker {
  width: auto;
  padding: 0em 0em !important;
  background-color: white !important;
}

.form-control:disabled >.datepicker {
  min-height: calc(2.5em + 1.05rem + 2px) !important;
  background-color: white !important;
  width:90%;
}

.multiselect-custom-option {
  font-size: 12px !important
}

</style>
