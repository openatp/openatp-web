import {createRouter, createWebHashHistory} from "vue-router"
import ProjectList from "../components/ProjectList.vue"
import ProjectServerList from "../components/ProjectServerList.vue"

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: ProjectList
        },
        {
            path: '/server/:projectId',
            component: ProjectServerList
        },
        {
            path: '/testcase',
            component: ProjectList
        }
    ]
})

export default router
