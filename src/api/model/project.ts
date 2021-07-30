interface Project {
    id: number
    name: string
    desc?: string
}

interface ProjectServer {
    id: number
    envName: string
    baseUrl: string
}

interface ProjectEnvVariable {
    id: number
    variableName: string
    defaultValue: string
}

interface ProjectRequest {
    id: number
    path: string
    method: string
    contentType: string
    param?: string
    header?: string
    timeout: number
}

interface ProjectRequestResponse {
    id: number
    fieldName: string
    fieldPath: string
}
