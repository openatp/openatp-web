<template>
  <div v-if="testCaseExecuteHistories.length === 0">
    <span> 什么都没有</span>
  </div>
  <div v-else>
    <el-table :data="testCaseExecuteHistories" border>
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="executeDatetime" label="执行时间"></el-table-column>
      <el-table-column prop="projectServerName" label="服务器名称"></el-table-column>
      <el-table-column :formatter="useParseTestCaseExecuteStatus" label="执行状态"></el-table-column>
      <el-table-column prop="executeStatusDetail" label="执行状态详情"></el-table-column>
      <el-table-column prop="requestTotalCount" label="总的请求数量"></el-table-column>
      <el-table-column prop="requestSuccessCount" label="请求成功的请求数量"></el-table-column>
      <el-table-column prop="requestSuccessRate" label="请求成功率">
        <template #default="scope">
          <span>{{ scope.row.requestSuccessRate.toFixed(4) * 100 }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="requestCheckCorrectCount" label="验证正确的请求数量"></el-table-column>
      <el-table-column prop="requestCheckCorrectRate" label="验证正确率">
        <template #default="scope">
          <span>{{ scope.row.requestCheckCorrectRate.toFixed(4) * 100 }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="clickToShowDetail(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <el-dialog title="测试案例执行明细" v-model="showDetail">
    <el-table :data="testCaseExecuteDetails">
      <el-table-column prop="testCaseRequestName" label="测试案例请求名称"></el-table-column>
      <el-table-column prop="httpRequest" label="HTTP 请求"></el-table-column>
      <el-table-column prop="httpResponse" label="HTTP 响应"></el-table-column>
      <el-table-column :formatter="useParseTestCaseCheckResult" label="请求验证结果"></el-table-column>
      <el-table-column prop="execCheckInfo" label="请求验证信息"></el-table-column>
      <el-table-column prop="saveEnvVariableInfo" label="环境变量信息"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, Ref, watch} from "vue"
import {useRoute} from "vue-router"
import {useParseTestCaseExecuteStatus, useParseTestCaseCheckResult} from "../../hooks/use_formmatter"
import {TestCaseExecuteHistory, TestCaseExecuteDetail} from "../../api/model/testcase"
import {listTestCaseExecuteHistory, listTestCaseExecuteDetail} from "../../api/testcase"

export default defineComponent({
  name: "TestCaseExecuteList",
  setup: () => {
    const route = useRoute()
    const projectId = route.params.projectId as unknown as number
    const testCaseId = route.params.testCaseId as unknown as number

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const testCaseExecuteHistories: Ref<Array<TestCaseExecuteHistory>> = ref([])

    async function loadTestExecuteHistories() {
      const data = await listTestCaseExecuteHistory(testCaseId)
      testCaseExecuteHistories.value = data
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const testCaseExecuteDetails: Ref<Array<TestCaseExecuteDetail>> = ref([])

    const showDetail = ref(false)

    async function clickToShowDetail(id) {
      const data = await listTestCaseExecuteDetail(id)
      testCaseExecuteDetails.value = data

      showDetail.value = true
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    onMounted(() => {
      loadTestExecuteHistories()
    })

    return {
      testCaseExecuteHistories,

      useParseTestCaseExecuteStatus,
      useParseTestCaseCheckResult,

      testCaseExecuteDetails,
      showDetail,
      clickToShowDetail
    }
  }
})
</script>

<style scoped>

</style>
