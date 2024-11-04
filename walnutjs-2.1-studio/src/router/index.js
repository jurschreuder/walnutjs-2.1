import { createMemoryHistory, createRouter } from 'vue-router'

import LayoutView from '../views//LayoutView.vue'
import HomeView from '../views//HomeView.vue'
import AboutView from '../views/AboutView.vue'
import DrawView from '../views/DrawView.vue'

const routes = [
  { path: '/', 
    component: LayoutView, 
    name: "main",
    redirects: "/home",
    children: [
      { path: '/home', name: "home", component: HomeView },
      { path: '/about', name: "about", component: AboutView },
      { path: '/draw', name: "draw", component: DrawView },
  ]},
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;
