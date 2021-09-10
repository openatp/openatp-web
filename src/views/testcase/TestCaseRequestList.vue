<template>
  <div v-if="testCaseType === testCaseTypeReplay">
    <a :href="`/api/testcase/replay/request/batch_import/v1/download_template/excel/${testCaseId}`">
      <el-button icon="el-icon-download">下载请求模版</el-button>
    </a>
    <el-upload
        :action="`/api/testcase/replay/request/batch_import/v1/upload_file/excel/${testCaseId}`"
        name="file"
        :show-file-list="false"
        limit="1"
        :on-success="uploadRequestTemplateSuccess"
        :on-error="uploadRequestTemplateFailed">
      <el-button icon="el-icon-upload">上传请求模板</el-button>
    </el-upload>
  </div>
  <div
      v-else-if="testCaseType===testCaseTypePipeline || (testCaseType === testCaseTypeBenchmark && testCaseRequests.length === 0)">
    <el-button type="primary" icon="el-icon-plus" @click="clickToOpenAddDialog">新建测试案例请求</el-button>
    <el-dialog title="新建测试案例请求" v-model="showAddTestCaseRequestDialog">
      <div>
        <el-input placeholder="请输入测试案例请求名称" clearable v-model="addNewTestCaseRequest.request.name"></el-input>
        <el-select placeholder="请选择测试案例参数" v-model="addNewTestCaseRequest.request.projectRequestId"
                   :disabled="testCaseType === testCaseTypeBenchmark">
          <el-option
              v-for="item in projectRequestList"
              :key="item.id"
              :label="item.request.name"
              :value="item.id">
          </el-option>
        </el-select>

        <div>
          <span>参数：</span>
          <div>
            <el-input v-for="arg in addNewTestCaseRequestArguments.entries()"
                      :placeholder="arg[0]"
                      clearable v-model="arg[1]"></el-input>
          </div>
        </div>
        <el-popover placement="right" width="200" trigger="hover" :content="requestParamTips">
          <template #reference>
            <el-button icon="el-icon-info"></el-button>
          </template>
        </el-popover>

        <div>
          <span>响应结果验证：</span>
          <el-input v-for="execCheck in addNewTestCaseRequest.requestExecCheck"
                    :placeholder="execCheck.fieldName" clearable
                    v-model="execCheck.wantResponseFieldValue"></el-input>
        </div>

        <div>
          <span>环境变量赋值：</span>
          <div>
            <el-input v-for="env in addNewTestCaseRequest.requestSaveEnvVariable"
                      :placeholder="env.projectEnvVariableName"
                      clearable v-model="env.projectEnvVariableValuePath"></el-input>
            <el-button icon="el-icon-remove-outline" @click="deleteEnv(env.projectEnvVariableId)"></el-button>
          </div>
        </div>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddTestCaseRequestDialog = false">取消</el-button>
        <el-button type="primary" @click="clickToAdd">保存</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <div v-if="testCaseRequests.length === 0">
    <span> 什么都没有</span>
  </div>
  <div v-else>
    <el-table :data="testCaseRequests" border>
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="request.name" label="测试案例请求名称"></el-table-column>
      <el-table-column prop="request.arguments" label="测试案例请求参数"></el-table-column>
      <el-table-column prop="request.projectRequestId" label="测试案例请求关联的项目请求"></el-table-column>
      <el-table-column label="响应验证字段">
        <template #default="scope">
          <span v-for="v in scope.row.requestExecCheck">
            <el-tag effect="plain" class="responseFieldValidateTag">{{
                v.fieldName
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
import {defineComponent, onMounted, reactive, ref, Ref, watch, computed} from "vue"
import {useRoute} from "vue-router"
import {ElMessage} from 'element-plus'
import {testCaseTypeReplay, testCaseTypeBenchmark, testCaseTypePipeline} from "../../api/model/type"
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
    const testCaseType = route.query.type as unknown as string
    const projectRequestId = route.query.projectRequestId as unknown as number | undefined

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
    const addNewTestCaseRequest = reactive<AddTestCaseRequest>({
      request: {
        name: '',
        projectRequestId: -1,
        arguments: undefined
      },
      requestExecCheck: [],
      requestSaveEnvVariable: []
    })
    const addNewTestCaseRequestArguments: Ref<Map<string, string>> = ref(new Map())

    watch(() => addNewTestCaseRequest.request.projectRequestId, (newId, _) => {
      // part 1 同步修改 requestExecCheck
      // 先清空
      addNewTestCaseRequest.requestExecCheck = []
      // 再重新赋值
      projectRequestList.value.find(req => req.id == newId)?.responseFieldValidate?.forEach(field => {
        addNewTestCaseRequest.requestExecCheck?.push({
          fieldName: field.fieldName,
          fieldPath: field.fieldPath,
          wantResponseFieldValue: ""
        })
      })

      // part 1 同步修改 requestExecCheck
      // 先清空
      addNewTestCaseRequestArguments.value = new Map()
      // 再重新赋值
      projectRequestList.value.find(req => req.id == newId)?.arguments?.forEach(arg =>
          addNewTestCaseRequestArguments.value.set(arg, "")
      )
    })

    const requestParamTips = computed(() => projectRequestList.value.find(req => req.id == addNewTestCaseRequest.request.projectRequestId)?.request.param)

    async function clickToOpenAddDialog() {
      if (projectRequestList.value.length === 0) {
        const data = await listProjectRequest(projectId)
        projectRequestList.value = data
      }
      if (projectEnvVariableList.value.length === 0) {
        const data = await allProjectEnvVariable(projectId)
        projectEnvVariableList.value = data
      }

      // 设置 env 值
      resetProjectEnvVariableList()

      // 如果是 benchmark 类型就不然让选择请求
      if (testCaseType === testCaseTypeBenchmark) {
        addNewTestCaseRequest.request.projectRequestId = projectRequestId!!
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

    function deleteEnv(projectEnvVariableId: number) {
      addNewTestCaseRequest.requestSaveEnvVariable = addNewTestCaseRequest.requestSaveEnvVariable?.filter(env => env.projectEnvVariableId != projectEnvVariableId)
    }

    async function clickToAdd() {
      // 更新 arguments
      addNewTestCaseRequest.request.arguments = JSON.stringify(addNewTestCaseRequestArguments)

      await addTestCaseRequest(testCaseId, addNewTestCaseRequest)

      // 刷新
      await loadTestCaseRequest()
      // 重置
      showAddTestCaseRequestDialog.value = false
      addNewTestCaseRequest.request.name = ''
      addNewTestCaseRequest.request.projectRequestId = -1
      addNewTestCaseRequest.request.arguments = undefined
      addNewTestCaseRequest.requestExecCheck = []
      addNewTestCaseRequest.requestSaveEnvVariable = []

      showAddTestCaseRequestDialog.value = false
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

    async function uploadRequestTemplateSuccess() {
      ElMessage.success({
        message: "上传成功"
      })

      // 刷新
      await loadTestCaseRequest()
    }

    function uploadRequestTemplateFailed() {
      ElMessage.error({
        message: "上传失败，请重试"
      })
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    onMounted(() => {
      loadTestCaseRequest()
    })

    return {
      testCaseTypeReplay,
      testCaseTypeBenchmark,
      testCaseTypePipeline,
      testCaseType,
      testCaseId,

      testCaseRequests,

      projectRequestList,

      showAddTestCaseRequestDialog,
      addNewTestCaseRequest,
      addNewTestCaseRequestArguments,
      clickToOpenAddDialog,
      clickToAdd,
      requestParamTips,
      deleteEnv,

      clickToDelete,
      clickToUpdate,

      uploadRequestTemplateSuccess,
      uploadRequestTemplateFailed,
    }
  }
})
</script>

<style scoped>
.responseFieldValidateTag {
  margin-bottom: 6px;
}
</style>
