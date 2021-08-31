import {TestCaseExecuteDetail, TestCaseExecuteHistory} from "../api/model/testcase";

// 测试案例执行结果
function useParseTestCaseExecuteStatus(row: TestCaseExecuteHistory): string {
    switch (row.executeStatus) {
        case 0:
            return "执行中"
        case 1:
            return "执行失败"
        case 2:
            return "执行成功"
        default:
            return "未知状态"
    }
}

// 测试案例验证结果
function useParseTestCaseCheckResult(row: TestCaseExecuteDetail): string {
    switch (row.execCheckResult) {
        case 0:
            return "HTTP请求错误"
        case 1:
            return "验证失败"
        case 2:
            return "验证成功"
        default:
            return "未知结果"
    }
}

export {
    useParseTestCaseExecuteStatus,
    useParseTestCaseCheckResult
}
