import request from "./axios-port"
import Response from './model/basic-response'
import {
    AddProject,
    Project,
    AddProjectEnvVariable,
    ProjectEnvVariable,
    AddProjectRequest,
    ProjectRequest,
    AddProjectServer,
    ProjectServer
} from './model/project'

async function addProject(req: AddProject): Promise<boolean> {
    try {
        const resp = await request.post("/api/project/v1", {
            name: req.name,
            desc: req.desc
        })
        console.log(`addProject: ${resp}`)
        return true
    } catch (e) {
        console.error(`addProject: ${e}`)
        return false
    }
    // 1 在这里捕获异常：  ----> 明确进行异常处理
    // addProject: Error: Request failed with status code 404
    // 2 这里不捕获异常：  ----> 系统报未捕获异常：Uncaught (in promise) Error
    // Uncaught (in promise) Error: Request failed with status code 404
    //     at createError (createError.js:16)
    //     at settle (settle.js:17)
    //     at XMLHttpRequest.handleLoad (xhr.js:62)
}

async function deleteProject(id: number) {
    await request.delete(`/api/project/v1/${id}`)
}

async function updateProject(req: Project) {
    await request.put(`/project/v1/${req.id}`, {name: req.name, desc: req.desc})
}

async function listProject(): Promise<Array<Project>> {
    const resp = await request.get("/api/project/v1/list")
    return (resp.data as Response<Array<Project>>).data ?? []
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

async function addProjectServer(projectId: number, req: AddProjectServer) {
    await request.post(`/api/project/server/v1/${projectId}`, req)
}

async function deleteProjectServer(id: number) {
    await request.delete(`/api/project/server/v1/${id}`)
}

async function updateProjectServer(req: ProjectServer) {
    await request.put(`/api/project/server/v1/${req.id}`, {
        envName: req.envName,
        baseUrl: req.baseUrl
    })
}

async function allProjectServer(projectId: number): Promise<Array<ProjectServer>> {
    const resp = await request.get(`/api/project/server/v1/all/${projectId}`)
    return (resp.data as Response<Array<ProjectServer>>).data ?? []
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

async function addProjectEnvVariable(projectId: number, req: AddProjectEnvVariable) {
    await request.post(`/api/project/env_variable/v1/${projectId}`, req)
}

async function deleteProjectEnvVariable(id: number) {
    await request.delete(`/api/project/env_variable/v1/${id}`)
}

async function updateProjectEnvVariable(req: ProjectEnvVariable) {
    await request.put(`/api/project/env_variable/v1/${req.id}`, {
        variableName: req.variableName,
        defaultValue: req.defaultValue
    })
}

async function allProjectEnvVariable(projectId: number): Promise<Array<ProjectEnvVariable>> {
    const resp = await request.get(`/api/project/env_variable/v1/all/${projectId}`)
    return (resp.data as Response<Array<ProjectEnvVariable>>).data ?? []
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

async function addProjectRequest(projectId: number, req: AddProjectRequest) {
    await request.post(`/api/project/request/v1/${projectId}`, req)
}

async function deleteProjectRequest(id: number) {
    await request.delete(`/api/project/request/v1/${id}`)
}

// async function updateProjectRequest() {
// }

async function listProjectRequest(projectId: number): Promise<Array<ProjectRequest>> {
    const resp = await request.get(`/api/project/request/v1/list/${projectId}`)
    return (resp.data as Response<Array<ProjectRequest>>).data ?? []
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

export {
    addProject,
    deleteProject,
    updateProject,
    listProject,

    addProjectServer,
    deleteProjectServer,
    updateProjectServer,
    allProjectServer,

    addProjectEnvVariable,
    deleteProjectEnvVariable,
    updateProjectEnvVariable,
    allProjectEnvVariable,

    addProjectRequest,
    deleteProjectRequest,
    // updateProjectRequest,
    listProjectRequest,
}
