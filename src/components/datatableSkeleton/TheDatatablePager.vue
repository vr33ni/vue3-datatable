<template>
  <nav
    aria-label="Page navigation example"
    class="d-inline-block"
  >
    <ul class="pagination justify-content-center mb-0">
      <li
        :class="{'invisible': currentPage <= 0}"
        class="page-item"
      >
        <a
          class="page-link"
          href="#"
          @click="changePage(0)"
        ><font-awesome-icon
          :icon="['fas', 'angle-double-left']"
        /></a>
      </li>
      <li
        :class="{'invisible': currentPage <= 0}"
        class="page-item"
      >
        <a
          class="page-link"
          href="#"
          @click="changePage(currentPage+-1)"
        ><font-awesome-icon
          :icon="['fas', 'angle-left']"
        /></a>
      </li>
      <li
        :class="{'invisible': currentPage - 2 <= 0}"
        class="page-item disabled"
      >
        <a
          class="page-link"
          href="#"
        >...</a>
      </li>
      <template
        v-for="index in 5"
        :key="index"
      >
        <li
          class="page-item"
          :class="{active: currentPage+index-3 === currentPage,
                   'invisible': currentPage+index - 2 <= 0 || currentPage+index-4 >= pageCount}"
        >
          <a
            class="page-link"
            href="#"
            @click="changePage(currentPage+index-3)"
          >{{ currentPage+index - 2 }}</a>
        </li>
      </template>
      <li
        :class="{'invisible': currentPage + 2 >= pageCount}"
        class="page-item disabled"
      >
        <a
          class="page-link"
          href="#"
        >...</a>
      </li>
      <li
        :class="{'invisible': currentPage >= pageCount}"
        class="page-item"
      >
        <a
          class="page-link"
          href="#"
          @click="changePage(currentPage+1)"
        ><font-awesome-icon
          :icon="['fas', 'angle-right']"
        /></a>
      </li>
      <li
        :class="{'invisible': currentPage >= pageCount}"
        class="page-item"
      >
        <a
          class="page-link"
          href="#"
          @click="changePage(pageCount)"
        >
          <font-awesome-icon
            :icon="['fas', 'angle-double-right']"
          />
        </a>
      </li>
    </ul>
  </nav>
  <div class="text-center">
    <span class="small text-muted">
      Displaying page {{ currentPage+1 }} of {{ pageCount+1 }}. Total entries: {{ count }}
    </span>
  </div>
</template>

<script setup>
import {
  toRefs, computed
} from 'vue';

const props = defineProps({
  currentPage: Number,
  count: Number,
  pageSize: Number,
});

const {
  pageSize, count, currentPage,
} = toRefs(props);

const pageCount = computed(() => parseInt((count.value - 1) / pageSize.value, 10));

const emit = defineEmits(['update:currentPage']);

function changePage(newPage) {
  emit('update:currentPage', newPage);
}

</script>
