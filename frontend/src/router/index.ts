import { createRouter, createWebHistory } from 'vue-router';
import RoomEditor from '../views/RoomEditor.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/room-editor',
      name: 'RoomEditor',
      component: RoomEditor
    },
    {
      path: '/',
      redirect: '/room-editor'
    }
  ]
});

export default router; 