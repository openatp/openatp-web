interface AddProject {
    name: string
    desc?: string
}

interface Project extends AddProject {
    id: number
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

interface AddProjectServer {
    envName: string
    baseUrl: string
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
    fieldName: string
    fieldPath: string
}

interface AddProjectRequest {
    request: ProjectRequestMini
    responseFieldValidate?: Array<ProjectRequestResponseMini>
}

interface ProjectRequest extends AddProjectRequest {
    id: number
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
    ProjectRequest
}
