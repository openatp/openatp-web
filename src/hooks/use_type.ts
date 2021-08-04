import {
    HttpContentType,
    httpContentTypes,
    HttpMethod,
    httpMethods,
    TestCaseType,
    testCaseTypes
} from "../api/model/type"

function useHttpMethods(): Array<HttpMethod> {
    return httpMethods
}

function useHttpContentTypes(): Array<HttpContentType> {
    return httpContentTypes
}

function useTestCaseTypes(): Array<TestCaseType> {
    return testCaseTypes
}

export {
    useHttpMethods,
    useHttpContentTypes,
    useTestCaseTypes
}
