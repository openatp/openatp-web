import {HttpContentType, httpContentType, httpMethod, HttpMethod} from "../api/model/type"

function useHttpMethod(): Array<HttpMethod> {
    return httpMethod
}

function useHttpContentType(): Array<HttpContentType> {
    return httpContentType
}

export {
    useHttpMethod,
    useHttpContentType
}
