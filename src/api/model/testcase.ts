interface AddTestCase {
    name: string
    type: string
    projectRequestId?: number
}

interface TestCase extends AddTestCase {
    id: number
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

interface TestCaseRequestMini {
    name: string
    projectRequestId: number
    arguments?: string
}

interface TestCaseRequestExecCheckMini {
    projectRequestResponseId: number
    projectRequestResponseFieldName?: string // TODO 接口返回数据没有该字段，只是为了界面显示才定义在这里
    wantResponseFieldValue: string
}

interface TestCaseRequestSaveEnvVariableMini {
    projectEnvVariableId: number
    projectEnvVariableName?: string // TODO 接口返回数据没有该字段，只是为了界面显示才定义在这里
    projectEnvVariableValuePath: string
}

interface AddTestCaseRequest {
    request: TestCaseRequestMini
    requestExecCheck?: Array<TestCaseRequestExecCheckMini>
    requestSaveEnvVariable?: Array<TestCaseRequestSaveEnvVariableMini>
}

interface TestCaseRequest extends AddTestCaseRequest {
    id: number
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

interface TestCaseExecuteHistory {
    id: number
    executeDatetime: string
    projectServerName: string
    executeStatus: number
    executeStatusDetail?: string
    requestTotalCount: number
    requestSuccessCount: number
    requestSuccessRate: number
    requestCheckCorrectCount: number
    requestCheckCorrectRate: number
}

interface TestCaseExecuteDetail {
    testCaseRequestName: string
    httpRequest: string
    httpResponse: string
    execCheckInfo: string
    execCheckResult: number
    saveEnvVariableInfo: string
}

// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
// ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

export {
    AddTestCase,
    TestCase,

    AddTestCaseRequest,
    TestCaseRequest,

    TestCaseExecuteHistory,
    TestCaseExecuteDetail
}
