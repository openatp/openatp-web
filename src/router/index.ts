import {createRouter, createWebHashHistory} from "vue-router"
import ProjectList from "../components/ProjectList.vue"
import ProjectServerList from "../components/ProjectServerList.vue"
import ProjectEnvVariableList from "../components/ProjectEnvVariableList.vue"
import ProjectRequestList from "../components/ProjectRequestList.vue"

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
            path: '/env_variable/:projectId',
            component: ProjectEnvVariableList
        },
        {
            path: '/request/:projectId',
            component: ProjectRequestList
        },
        {
            path: '/testcase',
            component: ProjectList
        }
    ]
})

export default router
