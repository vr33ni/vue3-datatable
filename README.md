# About the project

This template should help you working with an editable datatable. Supports mobile.

# Getting started

## Installation

```npm install ...```

## Usage

in any component:

```
<template>
  <Table></Table>
</template>

<script setup>
import Table from './components/Table.vue';
</script>
```

**backend API recommended for getting the table data**

**Store methods needed**

- store.js initializing store modules
- main.js initializing the store and synching the backend data on application start

**Table.vue**

- dropdown options retrieved via store getter method
- table data retrieved via store getter method

**TheDatatableSkeleton.vue**

- isAdminModeEnabled retrieved via store getter method
