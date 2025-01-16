import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/webgpu',
      name: 'webgpu',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      redirect: 'cube',
      children: [
        {
          path: '/webgpu/cube',
          name: 'cube',
          component: () => import('../views/webgpu/Cube.vue'),
        },
        {
          path: '/webgpu/triangle',
          name: 'triangle',
          component: () => import('../views/webgpu/Triangle.vue'),
        }
      ]
    },
    {
      path: '/threejs',
      name: 'threejs',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      redirect: 'camera',
      children: [
        {
          path: '/threejs/camera',
          name: 'camera',
          component: () => import('../views/threejs/Camera.vue'),
        },
        {
          path: '/threejs/earth',
          name: 'earth',
          component: () => import('../views/threejs/Earth.vue'),
        }
      ]
    },
  ],
})

export default router
