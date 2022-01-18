import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './plugins/fontawesome';
import App from './App.vue'

import 'bootstrap';
import './scss/web-component.scss';
import 'vue-multiselect/dist/vue-multiselect.css';

const app = createApp(App);

app.component('FontAwesomeIcon', FontAwesomeIcon);

app.mount('#app');