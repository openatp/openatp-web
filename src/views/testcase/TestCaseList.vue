<template>
  <!--  新建测试案例区域  -->
  <div class="text-center my-2.5">
    <el-button type="primary" icon="el-icon-plus" @click="clickToOpenAddDialog">新建测试案例</el-button>
  </div>
  <el-dialog title="新建测试案例" v-model="showAddTestCaseDialog">
    <div>
      <el-input placeholder="请输入测试案例名称" clearable v-model="addNewTestCase.name"></el-input>
      <el-select placeholder="请选择测试案例类型" v-model="addNewTestCase.type">
        <el-option
            v-for="item in testCaseTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select v-show="addNewTestCaseSelectProjectRequest" placeholder="请选择关联的请求"
                 v-model="addNewTestCase.projectRequestId">
        <el-option
            v-for="item in projectRequestList"
            :key="item.id"
            :label="item.request.name"
            :value="item.id">
        </el-option>
      </el-select>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddTestCaseDialog = false">取消</el-button>
        <el-button type="primary" @click="clickToAdd">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <!--  显示数据区域  -->
  <div>
    <div v-if="testCases.length === 0">
      <el-empty description="什么都没有"></el-empty>
    </div>
    <div v-else class="flex flex-row flex-wrap justify-start">
      <el-card v-for="testCase in testCases" :key="testCase.id" class="text-center mx-2.5 my-2.5">
        <h2>{{ testCase.name }}</h2>
        <div class="my-2.5 p-1 bg-yellow-400 rounded-lg">类型：{{ testCaseTypeDisplayName(testCase.type) }}</div>

        <!--  请求配置按钮  -->
        <el-button icon="el-icon-s-operation"
                   @click="openTestCaseRequestList(testCase.id, testCase.type, testCase.projectRequestId ?? undefined)">
          请求配置
        </el-button>

        <!--  执行列表  -->
        <el-button icon="el-icon-aim" @click="openTestCaseExecuteList(testCase.id)">执行列表</el-button>
        <!--  选择要执行的服务器  -->
        <el-popover placement="top" :visible="testCase.id === toExecuteTestCaseId">
          <el-button type="primary" v-for="server in projectServerList" @click="startExecute(testCase.id, server.id)">
            {{ server.serverName }}
          </el-button>
          <template #reference>
            <el-button type="warning" icon="el-icon-video-play" @click="toExecuteTestCaseId = testCase.id">开始执行
            </el-button>
          </template>
        </el-popover>

        <!--  删除按钮  -->
        <el-button type="danger" icon="el-icon-delete" @click="clickToDelete(testCase.id)"></el-button>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, Ref, watch} from "vue"
import {useRoute, useRouter} from "vue-router"
import {useTestCaseTypes} from "../../hooks/use_type"
import {testCaseTypeReplay, testCaseTypeBenchmark, testCaseTypePipeline} from "../../api/model/type"
import {ProjectRequest, ProjectServer} from "../../api/model/project";
import {AddTestCase, TestCase} from "../../api/model/testcase"
import {allProjectServer, listProjectRequest} from "../../api/project"
import {addTestCase, deleteTestCase, listTestCase, startExecuteTestCase} from "../../api/testcase"

export default defineComponent({
  name: "TestCaseList",
  setup: () => {
    const router = useRouter()
    const route = useRoute()
    const projectId = route.params.projectId as unknown as number

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const testCases: Ref<Array<TestCase>> = ref([])

    async function loadTestCases() {
      const data = await listTestCase(projectId)
      testCases.value = data
    }

    function testCaseTypeDisplayName(caseType: string): string {
      switch (caseType) {
        case testCaseTypeReplay:
          return "叠放测试"
        case testCaseTypeBenchmark:
          return "性能测试"
        case testCaseTypePipeline:
          return "顺序测试"
        default:
          return "未知类型"
      }
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const testCaseTypes = useTestCaseTypes()

    let projectRequestList: Ref<Array<ProjectRequest>> = ref([])

    const showAddTestCaseDialog = ref(false)
    const addNewTestCase = reactive<AddTestCase>({
      name: '',
      type: '',
      projectRequestId: undefined
    })
    const addNewTestCaseSelectProjectRequest = ref(false)

    async function clickToOpenAddDialog() {
      if (projectRequestList.value.length === 0) {
        const data = await listProjectRequest(projectId)
        projectRequestList.value = data
      }

      showAddTestCaseDialog.value = true
    }

    watch(() => addNewTestCase.type, (newValue, _) => {
      if (newValue === testCaseTypeReplay || newValue === testCaseTypeBenchmark) {
        addNewTestCaseSelectProjectRequest.value = true
      } else {
        addNewTestCaseSelectProjectRequest.value = false

        // 重置
        addNewTestCase.projectRequestId = undefined
      }
    })

    async function clickToAdd() {
      await addTestCase(projectId, addNewTestCase)

      // 刷新
      await loadTestCases()
      // 重置
      showAddTestCaseDialog.value = false
      addNewTestCase.name = ''
      addNewTestCase.type = ''
      addNewTestCase.projectRequestId = undefined
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToDelete(id: number) {
      await deleteTestCase(id)

      // 刷新
      await loadTestCases()
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToUpdate() {

    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    function openTestCaseRequestList(id: number, type: string, projectRequestId?: number) {
      // router.push(`/testcase/request/${projectId}/${id}`)
      router.push({
        path: `/testcase/request/${projectId}/${id}`,
        query: {
          type: type,
          projectRequestId: projectRequestId
        }
      })
    }

    function openTestCaseExecuteList(id: number) {
      router.push(`/testcase/execute/${projectId}/${id}`)
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const projectServerList: Ref<Array<ProjectServer>> = ref([])

    async function loadProjectServers() {
      const data = await allProjectServer(projectId)
      projectServerList.value = data
    }

    const toExecuteTestCaseId = ref(-1)

    async function startExecute(id: number, projectServerId: number) {
      await startExecuteTestCase(projectId, projectServerId, id)
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    onMounted(() => {
      loadTestCases()

      loadProjectServers()
    })

    return {
      testCases,
      testCaseTypeDisplayName,

      showAddTestCaseDialog,
      addNewTestCase,
      clickToOpenAddDialog,
      clickToAdd,
      projectRequestList,
      addNewTestCaseSelectProjectRequest,

      clickToDelete,
      clickToUpdate,

      testCaseTypes,
      testCaseTypeReplay,

      openTestCaseRequestList,
      openTestCaseExecuteList,

      projectServerList,
      toExecuteTestCaseId,
      startExecute
    }
  }
})
</script>

<style scoped>

</style>
