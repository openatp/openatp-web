<template>
  <div>
    <!--  上传、下载模版区域  -->
    <div v-if="testCaseType === testCaseTypeReplay" class="text-center my-2.5">
      <a :href="`/api/testcase/replay/request/batch_import/v1/download_template/excel/${testCaseId}`">
        <el-button icon="el-icon-download">下载请求模版</el-button>
      </a>

      <el-upload
          :action="`/api/testcase/replay/request/batch_import/v1/upload_file/excel/${testCaseId}`"
          name="file"
          :show-file-list="false"
          limit="1"
          :on-success="uploadRequestTemplateSuccess"
          :on-error="uploadRequestTemplateFailed"
          class="inline-block ml-2.5">
        <el-button icon="el-icon-upload">上传请求模板</el-button>
      </el-upload>
    </div>

    <!--  手动添加请求区域  -->
    <div v-else> <!-- v-else-if="testCaseType===testCaseTypePipeline || testCaseType === testCaseTypeBenchmark"-->
      <div class="text-center my-2.5">
        <el-button type="primary" icon="el-icon-plus"
                   @click="clickToOpenAddDialog"
                   :disabled="testCaseType === testCaseTypeBenchmark && testCaseRequests.length >= 1">
          新建测试案例请求
        </el-button>
        <!--  如果是 Benchmark 并且已经配置了请求就禁用该按钮  -->
      </div>

      <el-dialog title="新建测试案例请求" v-model="showAddTestCaseRequestDialog">
        <el-form label-width="118px" label-position="right">
          <el-form-item label="名称">
            <el-input placeholder="请输入名称" clearable v-model="addNewTestCaseRequest.request.name"></el-input>
          </el-form-item>
          <el-form-item label="关联的项目请求">
            <el-select placeholder="请选择项目的请求" v-model="addNewTestCaseRequest.request.projectRequestId"
                       :disabled="testCaseType === testCaseTypeBenchmark">
              <el-option
                  v-for="item in projectRequestList"
                  :key="item.id"
                  :label="item.request.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <hr/>

          <!--  占位参数  -->
          <div class="mt-2.5">
            <span>占位参数：</span>
            <div>
              <el-form-item v-for="arg in addNewTestCaseRequestArguments" :label="arg.key">
                <el-input clearable v-model="arg.value"></el-input>
              </el-form-item>
            </div>
          </div>
          <!--        <el-popover placement="right" width="200" trigger="hover" :content="requestParamTips">-->
          <!--          <template #reference>-->
          <!--            <el-button icon="el-icon-info"></el-button>-->
          <!--          </template>-->
          <!--        </el-popover>-->

          <hr/>

          <!--  响应结果验证  -->
          <div class="mt-2.5">
            <span>响应验证字段：</span>
            <el-form-item v-for="execCheck in addNewTestCaseRequest.requestExecCheck" :label="execCheck.fieldName">
              <el-input clearable v-model="execCheck.wantResponseFieldValue"></el-input>
            </el-form-item>
          </div>

          <hr/>

          <!--  环境变量赋值  -->
          <div class="mt-2.5">
            <span>环境变量赋值：</span>
            <el-form-item v-for="env in addNewTestCaseRequest.requestSaveEnvVariable"
                          :key="env.projectEnvVariableName"
                          :label="env.projectEnvVariableName">
              <el-col>
                <el-input clearable v-model="env.projectEnvVariableValuePath"></el-input>
              </el-col>
              <el-col>
                <el-button type="danger" icon="el-icon-delete" @click="deleteEnv(env.projectEnvVariableId)"
                           class="ml-2.5"></el-button>
              </el-col>
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <el-button @click="showAddTestCaseRequestDialog = false">取消</el-button>
          <el-button type="primary" @click="clickToAdd">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <!--  显示数据区域  -->
  <div class="m-2.5">
    <div v-if="testCaseRequests.length === 0">
      <el-empty description="什么都没有"></el-empty>
    </div>
    <div v-else>
      <el-table :data="testCaseRequests" border>
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="request.name" label="名称"></el-table-column>
        <el-table-column prop="request.arguments" label="占位参数(显示为json格式)"></el-table-column>
        <el-table-column prop="request.projectRequestId" label="关联的项目请求"
                         :formatter="parseProjectRequestName"></el-table-column>
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
import {KeyValue} from "../../util/vo";

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

    async function loadProjectRequest() {
      const data = await listProjectRequest(projectId)
      projectRequestList.value = data
    }

    async function loadProjectEnvVariable() {
      const data = await allProjectEnvVariable(projectId)
      projectEnvVariableList.value = data
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const testCaseRequests: Ref<Array<TestCaseRequest>> = ref([])

    async function loadTestCaseRequest() {
      const data = await listTestCaseRequest(testCaseId)
      testCaseRequests.value = data
    }

    // 根据项目请求ID获取项目请求名称
    function parseProjectRequestName(row: TestCaseRequest): string {
      return projectRequestList.value.find(req => req.id = row.request.projectRequestId)?.request?.name
          ?? (row.request.projectRequestId as string)
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
    const addNewTestCaseRequestArguments: Ref<Array<KeyValue>> = ref([])

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
      addNewTestCaseRequestArguments.value = []
      // 再重新赋值
      projectRequestList.value.find(req => req.id == newId)?.arguments?.forEach(arg =>
          addNewTestCaseRequestArguments.value.push(new KeyValue(arg, ""))
      )
    })

    // const requestParamTips = computed(() => projectRequestList.value.find(req => req.id == addNewTestCaseRequest.request.projectRequestId)?.request.param)

    async function clickToOpenAddDialog() {
      // 关联请求
      if (projectRequestList.value.length > 0) {
        // 如果是 benchmark 类型就不然让选择请求
        if (testCaseType === testCaseTypeBenchmark) {
          let matchedReq = projectRequestList.value.filter(it => it.id == projectRequestId!!)
          if (matchedReq.length == 1) {
            addNewTestCaseRequest.request.projectRequestId = matchedReq[0].id
          } else {
            console.error("测试案例绑定的项目请求以及删除")
            addNewTestCaseRequest.request.projectRequestId = -1
            // TODO 弹框报错
          }
        } else {
          // 否则就个关联的请求一个初始值
          addNewTestCaseRequest.request.projectRequestId = projectRequestList.value[0].id
        }
      } else {
        // TODO 弹框提示没有配置项目请求
      }

      // 设置 env 值
      resetProjectEnvVariableList()

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
      addNewTestCaseRequest.requestSaveEnvVariable = addNewTestCaseRequest.requestSaveEnvVariable?.filter(it => it.projectEnvVariableId !== projectEnvVariableId)
    }

    async function clickToAdd() {
      // 更新 arguments
      let arg = new Object(null)
      addNewTestCaseRequestArguments.value.forEach(it => {
        arg[it.key] = it.value
      }) // 需要将参数转换为 json 格式
      addNewTestCaseRequest.request.arguments = JSON.stringify(arg)

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
      // ElMessage.success({
      //   message: "上传成功"
      // })

      // 刷新
      await loadTestCaseRequest()
    }

    function uploadRequestTemplateFailed() {
      // ElMessage.error({
      //   message: "上传失败，请重试"
      // })
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    onMounted(() => {
      // 加载项目请求
      loadProjectRequest()

      // 加载项目环境变量
      loadProjectEnvVariable()

      // 加载项目配置的请求
      loadTestCaseRequest()
    })

    return {
      testCaseTypeReplay,
      testCaseTypeBenchmark,
      testCaseTypePipeline,
      testCaseType,
      testCaseId,

      parseProjectRequestName,
      testCaseRequests,

      projectRequestList,

      showAddTestCaseRequestDialog,
      addNewTestCaseRequest,
      addNewTestCaseRequestArguments,
      clickToOpenAddDialog,
      clickToAdd,
      // requestParamTips,
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
