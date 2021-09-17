interface AddProject {
    name: string
    desc?: string
}

interface Project extends AddProject {
    id: number
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

interface AddProjectServer {
    serverName: string
    serverAddr: string
}

interface ProjectServer extends AddProjectServer {
    id: number
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

interface AddProjectEnvVariable {
    variableName: string
    defaultValue: string
}

interface ProjectEnvVariable extends AddProjectEnvVariable {
    id: number
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

interface ProjectRequestMini {
    name: string
    path: string
    method: string
    contentType: string
    param?: string
    header?: string
    timeout: number
}

interface ProjectRequestResponseMini {
    id: number
    fieldName: string
    fieldPath: string
}

interface AddProjectRequest {
    request: ProjectRequestMini
    responseFieldValidate?: Array<ProjectRequestResponseMini>
    arguments?: Array<string>
}

interface ProjectRequest extends AddProjectRequest {
    id: number
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

interface ProjectRequestPreExecRequest {
    request: ProjectRequestMini
    arguments?: string
    env?: string
}

interface ProjectRequestPreExecResponse {
    request: string
    response: string
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

export {
    AddProject,
    Project,

    AddProjectServer,
    ProjectServer,

    AddProjectEnvVariable,
    ProjectEnvVariable,

    AddProjectRequest,
    ProjectRequest,

    ProjectRequestPreExecRequest,
    ProjectRequestPreExecResponse
}
