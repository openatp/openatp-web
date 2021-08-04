<template>
  <el-button type="primary" icon="el-icon-plus" @click="clickToOpenAddDialog">新建测试案例请求</el-button>
  <el-dialog title="新建测试案例请求" v-model="showAddTestCaseRequestDialog">
    <div>
      <el-input placeholder="请输入测试案例请求名称" clearable v-model="addNewTestCaseRequest.request.name"></el-input>
      <el-select placeholder="请选择测试案例参数" v-model="addNewTestCaseRequestBindProjectRequestId">
        <el-option
            v-for="item in projectRequestList"
            :key="item.id"
            :label="item.request.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-input placeholder="请输入测试案例参数" type="textarea" rows="4" clearable
                v-model="addNewTestCaseRequest.request.param"></el-input>

      <span>响应结果验证：</span>
      <el-input v-for="execCheck in addNewTestCaseRequest.requestExecCheck"
                :placeholder="execCheck.projectRequestResponseFieldName" clearable
                v-model="execCheck.wantResponseFieldValue"></el-input>

      <span>环境变量赋值：</span>
      <el-input v-for="env in addNewTestCaseRequest.requestSaveEnvVariable" :placeholder="env.projectEnvVariableName"
                clearable v-model="env.projectEnvVariableValuePath"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddTestCaseRequestDialog = false">取消</el-button>
        <el-button type="primary" @click="clickToAdd">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <div v-if="testCaseRequests.length === 0">
    <span> 什么都没有</span>
  </div>
  <div v-else>
    <el-table :data="testCaseRequests" border>
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="request.name" label="测试案例请求名称"></el-table-column>
      <el-table-column prop="request.param" label="测试案例请求参数"></el-table-column>
      <el-table-column prop="request.projectRequestId" label="测试案例请求关联的项目请求"></el-table-column>
      <el-table-column label="响应验证字段">
        <template #default="scope">
          <span v-for="v in scope.row.requestExecCheck">
            <el-tag effect="plain" class="responseFieldValidateTag">{{
                v.projectRequestResponseId
              }}: {{ v.wantResponseFieldValue }}</el-tag> <br/>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="环境变量赋值">
        <template #default="scope">
          <span v-for="v in scope.row.requestSaveEnvVariable">
            <el-tag effect="plain" class="responseFieldValidateTag">{{
                v.projectEnvVariableId
              }}: {{ v.projectEnvVariableValuePath }}</el-tag> <br/>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="clickToDelete(scope.row.id)">删除</el-button>
          <el-button @click="clickToUpdate">更新</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, Ref, watch} from "vue"
import {useRoute} from "vue-router"
import {AddTestCaseRequest, TestCaseRequest} from "../../api/model/testcase"
import {addTestCaseRequest, deleteTestCaseRequest, listTestCaseRequest} from "../../api/testcase"
import {ProjectEnvVariable, ProjectRequest} from "../../api/model/project"
import {allProjectEnvVariable, listProjectRequest} from "../../api/project"

export default defineComponent({
  name: "TestCaseRequestList",
  setup: () => {
    const route = useRoute()
    const projectId = route.params.projectId as unknown as number
    const testCaseId = route.params.testCaseId as unknown as number

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    let projectRequestList: Ref<Array<ProjectRequest>> = ref([])
    let projectEnvVariableList: Ref<Array<ProjectEnvVariable>> = ref([])

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const testCaseRequests: Ref<Array<TestCaseRequest>> = ref([])

    async function loadTestCaseRequest() {
      const data = await listTestCaseRequest(testCaseId)
      testCaseRequests.value = data
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const showAddTestCaseRequestDialog = ref(false)
    const addNewTestCaseRequestBindProjectRequestId = ref(0)
    const addNewTestCaseRequest = reactive<AddTestCaseRequest>({
      request: {
        name: '',
        projectRequestId: -1,
        param: undefined
      },
      requestExecCheck: [],
      requestSaveEnvVariable: []
    })

    watch(addNewTestCaseRequestBindProjectRequestId, (newId, _) => {
      // 先清空
      addNewTestCaseRequest.requestExecCheck = []
      // 再重新赋值
      projectRequestList.value.filter(req => req.id === newId)[0].responseFieldValidate.forEach(field => {
        addNewTestCaseRequest.requestExecCheck?.push({
          projectRequestResponseId: field.id,
          projectRequestResponseFieldName: field.fieldName,
          wantResponseFieldValue: ""
        })
      })

      // 更新 // TODO 有更好的方法吗？
      addNewTestCaseRequest.request.projectRequestId = newId
    })

    async function clickToOpenAddDialog() {
      if (projectRequestList.value.length === 0) {
        const data = await listProjectRequest(projectId)
        projectRequestList.value = data
      }
      if (projectEnvVariableList.value.length === 0) {
        const data = await allProjectEnvVariable(projectId)
        projectEnvVariableList.value = data

        // 设置 env 值
        resetProjectEnvVariableList()
      }
      showAddTestCaseRequestDialog.value = true
    }

    function resetProjectEnvVariableList() {
      // 先清空
      addNewTestCaseRequest.requestSaveEnvVariable = []
      // 再重新赋值
      projectEnvVariableList.value.forEach((env => {
        addNewTestCaseRequest.requestSaveEnvVariable?.push({
          projectEnvVariableId: env.id,
          projectEnvVariableName: env.variableName,
          projectEnvVariableValuePath: ""
        })
      }))
    }

    async function clickToAdd() {
      await addTestCaseRequest(testCaseId, addNewTestCaseRequest)

      // 刷新
      await loadTestCaseRequest()
      // 重置
      showAddTestCaseRequestDialog.value = false
      addNewTestCaseRequest.request.name = ''
      addNewTestCaseRequest.request.projectRequestId = -1
      addNewTestCaseRequest.request.param = undefined
      addNewTestCaseRequest.requestExecCheck = []
      addNewTestCaseRequest.requestSaveEnvVariable = []
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToDelete(id: number) {
      await deleteTestCaseRequest(id)

      // 刷新
      await loadTestCaseRequest()
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToUpdate() {

    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    onMounted(() => {
      loadTestCaseRequest()
    })

    return {
      testCaseRequests,

      projectRequestList,

      showAddTestCaseRequestDialog,
      addNewTestCaseRequestBindProjectRequestId,
      addNewTestCaseRequest,
      clickToOpenAddDialog,
      clickToAdd,

      clickToDelete,
      clickToUpdate
    }
  }
})
</script>

<style scoped>
.responseFieldValidateTag {
  margin-bottom: 6px;
}
</style>
