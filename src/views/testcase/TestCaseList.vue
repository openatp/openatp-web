<template>
  <el-button type="primary" icon="el-icon-plus" @click="showAddTestCaseDialog = true">新建测试案例</el-button>
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
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddTestCaseDialog = false">取消</el-button>
        <el-button type="primary" @click="clickToAdd">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <div v-if="testCases.length === 0">
    <span> 什么都没有</span>
  </div>
  <div v-else>
    <div class="list-box" v-for="testCase in testCases" :key="testCase.id">
      <el-card class="list-item">
        <h4>{{ testCase.name }}</h4>
        {{ testCase.type }} <br/>
        <el-button icon="el-icon-s-operation" @click="openTestCaseRequestList(testCase.id)">测试案例请求配置</el-button>
        <el-button icon="el-icon-aim" @click="openTestCaseExecuteList(testCase.id)">测试案例执行列表</el-button>

        <a :href="`/api/testcase/replay/request/batch_import/v1/download_template/excel/${testCase.id}`"
           v-if="testCase.type === testCaseTypeReplay">
          <el-button icon="el-icon-download">下载请求模版</el-button>
        </a>
        <el-upload
            :action="`/api/testcase/replay/request/batch_import/v1/upload_file/excel/${testCase.id}`"
            name="file"
            :show-file-list="false"
            limit="1"
            :on-success="uploadRequestTemplateSuccess"
            :on-error="uploadRequestTemplateFailed">
          <a v-if="testCase.type === testCaseTypeReplay">
            <el-button icon="el-icon-upload">上传请求模板</el-button>
          </a>
        </el-upload>

        <el-popover placement="top" v-model:visible="showStartExecuteDialog">
          <el-button type="primary" v-for="server in projectServerList" @click="startExecute(testCase.id, server.id)">
            {{ server.envName }}
          </el-button>
          <template #reference>
            <el-button type="warning" icon="el-icon-video-play" @click="showStartExecuteDialog = true">开始执行</el-button>
          </template>
        </el-popover>

        <el-button type="danger" icon="el-icon-delete" @click="clickToDelete(testCase.id)"></el-button>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, Ref} from "vue"
import {useRoute, useRouter} from "vue-router"
import {ElMessage} from 'element-plus'
import {useTestCaseTypes} from "../../hooks/use_type"
import {testCaseTypeReplay} from "../../api/model/type"
import {AddTestCase, TestCase} from "../../api/model/testcase"
import {addTestCase, deleteTestCase, listTestCase, startExecuteTestCase} from "../../api/testcase"
import {allProjectServer} from "../../api/project"
import {ProjectServer} from "../../api/model/project";

export default defineComponent({
  name: "TestCaseList",
  setup: () => {
    const router = useRouter()
    const route = useRoute()
    const projectId = route.params.projectId as unknown as number

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const testCaseTypes = useTestCaseTypes()

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const testCases: Ref<Array<TestCase>> = ref([])

    async function loadTestCases() {
      const data = await listTestCase(projectId)
      testCases.value = data
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const showAddTestCaseDialog = ref(false)
    const addNewTestCase = reactive<AddTestCase>({
      name: '',
      type: ''
    })

    async function clickToAdd() {
      await addTestCase(projectId, addNewTestCase)

      // 刷新
      await loadTestCases()
      // 重置
      showAddTestCaseDialog.value = false
      addNewProjectServer.name = ''
      addNewProjectServer.type = ''
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

    function openTestCaseRequestList(id: number) {
      router.push(`/testcase/request/${projectId}/${id}`)
    }

    function openTestCaseExecuteList(id: number) {
      router.push(`/testcase/execute/${projectId}/${id}`)
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    function uploadRequestTemplateSuccess() {
      ElMessage.success({
        message: "上传成功"
      })
    }

    function uploadRequestTemplateFailed() {
      ElMessage.error({
        message: "上传失败，请重试"
      })
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const projectServerList: Ref<Array<ProjectServer>> = ref([])

    async function loadProjectServers() {
      const data = await allProjectServer(projectId)
      projectServerList.value = data
    }

    const showStartExecuteDialog = ref(false)

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

      showAddTestCaseDialog,
      addNewTestCase,
      clickToAdd,

      clickToDelete,
      clickToUpdate,

      testCaseTypes,
      testCaseTypeReplay,

      openTestCaseRequestList,
      openTestCaseExecuteList,

      uploadRequestTemplateSuccess,
      uploadRequestTemplateFailed,

      projectServerList,
      showStartExecuteDialog,
      startExecute
    }
  }
})
</script>

<style scoped>

</style>
