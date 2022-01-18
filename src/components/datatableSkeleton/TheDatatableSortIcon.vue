<template>
  <a
    v-if="column.sortable"
    href="#"
    @click="changeSort()"
  >
    <font-awesome-icon
      :icon="['fas', icon]"
    />
  </a>
</template>

<script setup>
import {
  toRefs, computed
} from 'vue';

const props = defineProps({
  sortColumn: Object,
  column: Object,
});
const { sortColumn, column } = toRefs(props);

const emit = defineEmits(['update:sortColumn']);

const icon = computed(() => {
  if (!sortColumn.value) {
    return 'sort';
  }

  if (sortColumn.value.key === column.value.key) {
    return (sortColumn.value.type === 'ASC' ? 'caret-up' : 'caret-down');
  }
  return 'sort';
});

function changeSort() {
  if (sortColumn.value && sortColumn.value.key === column.value.key) {
    if (sortColumn.value.type === 'ASC') {
      emit('update:sortColumn', { key: column.value.key, type: 'DESC' });
    } else {
      emit('update:sortColumn', undefined);
    }
  } else {
    emit('update:sortColumn', { key: column.value.key, type: 'ASC' });
  }
}

</script>
