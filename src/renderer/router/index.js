import { createRouter, createWebHashHistory } from 'vue-router';


// 1. Define route components.
// These can be imported from other files
import Home from '../views/Home.vue'
const About = { template: '<div>About</div>' }

const routes = [
    { path: '/home', component: Home },
    { path: '/about', component: About },
    { path: '/', component: Home },
    { path:'/:catchAll(.*)',redirect:'/404'}
  ]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  })
  
  export default router;  