interface HttpMethod {
    label: string
    value: string
}

interface HttpContentType {
    label: string
    value: string
}

const httpMethods: Array<HttpMethod> = [
    {
        label: 'GET',
        value: 'GET'
    },
    {
        label: 'POST',
        value: 'POST'
    },
    {
        label: 'DELETE',
        value: 'DELETE'
    },
    {
        label: 'PUT',
        value: 'PUT'
    }
]

const httpContentTypes: Array<HttpContentType> = [
    {
        label: 'JSON',
        value: 'JSON'
    },
    {
        label: 'FORM',
        value: 'FORM'
    },
]

interface TestCaseType {
    label: string
    value: string
}

const testCaseTypeBenchmark = "benchmark"
const testCaseTypeReplay = "replay"
const testCaseTypePipeline = "pipeline"

const testCaseTypes: Array<TestCaseType> = [
    {
        label: '性能测试',
        value: testCaseTypeBenchmark
    },
    {
        label: '叠放测试',
        value: testCaseTypeReplay
    },
    {
        label: '顺序测试',
        value: testCaseTypePipeline
    }
]

export {
    HttpMethod, HttpContentType,
    httpMethods, httpContentTypes,
    TestCaseType,
    testCaseTypeBenchmark, testCaseTypeReplay, testCaseTypePipeline,
    testCaseTypes
}
