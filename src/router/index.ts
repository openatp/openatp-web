import {createRouter, createWebHashHistory} from "vue-router"
import Login from "../views/Login.vue"
import ProjectList from "../views/project/ProjectList.vue"
import ProjectServerList from "../views/project/ProjectServerList.vue"
import ProjectEnvVariableList from "../views/project/ProjectEnvVariableList.vue"
import ProjectRequestList from "../views/project/ProjectRequestList.vue"
import TestCaseList from "../views/testcase/TestCaseList.vue"
import TestCaseRequestList from "../views/testcase/TestCaseRequestList.vue"
import TestCaseExecuteList from "../views/testcase/TestCaseExecuteList.vue"

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Login
        },
        // ----- ----- ----- ----- -----
        {
            path: '/project',
            component: ProjectList
        },
        {
            path: '/project/server/:projectId',
            component: ProjectServerList
        },
        {
            path: '/project/env_variable/:projectId',
            component: ProjectEnvVariableList
        },
        {
            path: '/project/request/:projectId',
            component: ProjectRequestList
        },
        // ----- ----- ----- ----- -----
        {
            path: '/testcase/:projectId',
            component: TestCaseList
        },
        {
            path: '/testcase/request/:projectId/:testCaseId',
            component: TestCaseRequestList
        },
        {
            path: '/testcase/execute/:projectId/:testCaseId',
            component: TestCaseExecuteList
        }
    ]
})

export default router
