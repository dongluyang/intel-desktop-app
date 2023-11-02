import { createRouter, createWebHashHistory } from 'vue-router';


// 1. Define route components.
// These can be imported from other files
import Home from '../views/Home.vue'
import TaskList from "../views/TaskList.vue"
import PluginList from "../views/PluginList.vue"
import AppList from "../views/AppList.vue"
import Setting from "../views/Setting.vue"
import Rembg from "../apps/Rembg.vue"
import AssetSync from "../apps/AssetSync.vue"
import Proxy from "../apps/Proxy.vue"
const About = { template: '<div>About</div>' }

const routes = [
    { path: '/home', component: Home},
    { path: '/about', component: About },
    { path: '/', component: Home,
        children: [
            {
                path: '/pending_tasks',
                component: TaskList, // 子路由组件
            },
            {
                path: '/plugins',
                component: PluginList, // 子路由组件
            },
            {
                path: '/scripts',
                component: AppList, // 子路由组件
            },
            {
                path: '/setting',
                component: Setting, // 子路由组件
            },
            {
                path: '/rembg',
                component: Rembg, // 子路由组件
            },
            {
                path: '/asset_sync',
                component: AssetSync, // 子路由组件
            },
            {
                path: '/proxy',
                component: Proxy, // 子路由组件
            }
        ]
    },
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
