import request from "./axios-port"
import {
    AddTestCase,
    AddTestCaseRequest,
    TestCase,
    TestCaseRequest,
    TestCaseExecuteHistory,
    TestCaseExecuteDetail
} from "./model/testcase"

async function addTestCase(projectId: number, req: AddTestCase) {
    await request.post(`/api/testcase/v1/${projectId}`, req)
}

async function deleteTestCase(id: number) {
    await request.delete(`/api/testcase/v1/${id}`)
}

async function updateTestCase(testCaseId: number, req: AddTestCase) {
    await request.put(`/api/testcase/v1/${testCaseId}`, req)
}

async function listTestCase(projectId: number): Promise<Array<TestCase>> {
    const resp = await request.get(`/api/testcase/v1/list/${projectId}`)
    return resp.data.data as Array<TestCase> ?? []
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

async function startExecuteTestCase(projectId: number, projectServerId: number, testCaseId: number) {
    await request.get(`/api/testcase/execute/v1/start/${projectId}/${projectServerId}/${testCaseId}`)
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

async function addTestCaseRequest(testCaseId: number, req: AddTestCaseRequest) {
    await request.post(`/api/testcase/request/v1/${testCaseId}`, req)
}

async function deleteTestCaseRequest(id: number) {
    await request.delete(`/api/testcase/request/v1/${id}`)
}

async function updateTestCaseRequest(testCaseRequestId: number, req: AddTestCaseRequest) {
    await request.put(`/api/testcase/request/v1/${testCaseRequestId}`, req)
}

async function listTestCaseRequest(testCaseId: number): Promise<Array<TestCaseRequest>> {
    const resp = await request.get(`/api/testcase/request/v1/list/${testCaseId}`)
    return resp.data.data as Array<TestCaseRequest> ?? []
}

async function detailTestCaseRequest(id: number): Promise<TestCaseRequest> {
    const resp = await request.get(`/api/testcase/request/v1/detail/${id}`)
    return resp.data.data as TestCaseRequest
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

async function listTestCaseExecuteHistory(testCaseId: number): Promise<Array<TestCaseExecuteHistory>> {
    const resp = await request.get(`/api/testcase/execute/v1/list/${testCaseId}`)
    return resp.data.data as Array<TestCaseExecuteHistory>
}

async function listTestCaseExecuteDetail(testCaseExecuteHistoryId: string): Promise<Array<TestCaseExecuteDetail>> {
    const resp = await request.get(`/api/testcase/execute/v1/detail/${testCaseExecuteHistoryId}`)
    return resp.data.data as Array<TestCaseExecuteDetail> ?? []
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

export {
    addTestCase,
    deleteTestCase,
    updateTestCase,
    listTestCase,
    startExecuteTestCase,

    addTestCaseRequest,
    deleteTestCaseRequest,
    updateTestCaseRequest,
    listTestCaseRequest,
    detailTestCaseRequest,

    listTestCaseExecuteHistory,
    listTestCaseExecuteDetail
}
