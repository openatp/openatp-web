<template>
  <el-button type="primary" icon="el-icon-plus" @click="showAddProjectRequestDialog = true">新建请求</el-button>
  <el-dialog title="新建请求" v-model="showAddProjectRequestDialog">
    <div>
      <div>
        <el-input placeholder="请输入接口名称" clearable v-model="addNewProjectRequest.request.name"></el-input>
        <el-input placeholder="请输入接口路径" clearable v-model="addNewProjectRequest.request.path"></el-input>
        <el-select placeholder="请选择 method" v-model="addNewProjectRequest.request.method">
          <el-option
              v-for="item in httpMethods"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-select placeholder="请选择 content-type" v-model="addNewProjectRequest.request.contentType"
                   :disabled="addNewProjectRequest.request.method === 'GET'">
          <el-option
              v-for="item in httpContentTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <!-- 参数区域 -->
        <div v-if="addNewProjectRequest.request.method !== 'GET'">
          <el-input v-if="addNewProjectRequest.request.contentType === 'JSON'" placeholder="请输入接口参数" type="textarea"
                    rows="4" clearable
                    v-model="addNewProjectRequest.request.param"></el-input>
          <div v-else-if="addNewProjectRequest.request.contentType === 'FORM'">
            <div v-for="(arg, index) in addNewProjectRequestFormParam">
              <el-input placeholder="参数名称" clearable v-model="arg.key"></el-input>
              <el-input placeholder="参数值" clearable v-model="arg.value"></el-input>
              <el-button type="danger" icon="el-icon-delete" @click="deleteFormParamItem(index)"></el-button>
            </div>
            <el-button type="primary" @click="addFormParamItem">添加参数</el-button>
          </div>
        </div>
      </div>
      <div>
        <div v-for="(arg, index) in addNewProjectRequestArguments">
          <el-input placeholder="参数名称" clearable v-model="arg.value"></el-input>
          <el-button type="danger" icon="el-icon-delete" @click="deleteArguments(index)"></el-button>
        </div>
        <el-button type="primary" @click="addArguments">添加参数</el-button>
      </div>
      <div>
        <div v-for="(resp, index) in addNewProjectRequest.responseFieldValidate">
          <el-input placeholder="响应验证字段名称" clearable v-model="resp.fieldName"/>
          <el-input placeholder="响应验证字段path" clearable v-model="resp.fieldPath"/>
          <el-button type="danger" icon="el-icon-delete" @click="deleteResponseFieldValidate(index)"></el-button>
        </div>
        <el-button type="primary" @click="addResponseFieldValidate">添加验证</el-button>
      </div>
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="showAddProjectRequestDialog = false">取消</el-button>
      <el-button type="primary" @click="clickToAdd">保存</el-button>
    </span>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <div v-if="projectRequests.length === 0">
    <span> 什么都没有</span>
  </div>
  <div v-else>
    <el-table :data="projectRequests" border>
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="request.name" label="接口名称"></el-table-column>
      <el-table-column prop="request.path" label="接口路径"></el-table-column>
      <el-table-column prop="request.method" label="method"></el-table-column>
      <el-table-column prop="request.contentType" label="content-type"></el-table-column>
      <el-table-column prop="request.param" label="接口参数"></el-table-column>
      <el-table-column label="参数">
        <template #default="scope">
          <span v-for="v in scope.row.arguments">
            <el-tag effect="plain" class="responseFieldValidateTag">{{ v }}</el-tag> <br/>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="响应验证字段">
        <template #default="scope">
          <span v-for="v in scope.row.responseFieldValidate">
            <el-tag effect="plain" class="responseFieldValidateTag">{{ v.fieldName }}: {{ v.fieldPath }}</el-tag> <br/>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="clickToDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, Ref} from "vue"
import {useRoute} from "vue-router"
import {useHttpContentTypes, useHttpMethods} from "../../hooks/use_type"
import {
  AddProjectRequest,
  ProjectRequest,
  ProjectServer,
  ProjectRequestPreExecRequest,
  ProjectRequestPreExecResponse
} from "../../api/model/project"
import {KeyValue, OnlyValue} from "../../util/vo"
import {
  addProjectRequest,
  allProjectServer,
  deleteProjectRequest,
  listProjectRequest,
  preExecProjectRequest
} from "../../api/project"

export default defineComponent({
  name: "ProjectRequestList",
  setup: () => {
    const route = useRoute()
    const projectId = route.params.projectId as unknown as number

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
    const httpMethods = useHttpMethods()
    const httpContentTypes = useHttpContentTypes()
    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const projectRequests: Ref<Array<ProjectRequest>> = ref([])

    async function loadProjectRequests() {
      const data = await listProjectRequest(projectId)
      projectRequests.value = data
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---
    const showAddProjectRequestDialog = ref(false)
    const addNewProjectRequest = reactive<AddProjectRequest>({
      request: {
        name: '',
        path: '',
        method: '',
        contentType: '',
        param: undefined,
        header: undefined,
        timeout: 3000
      },
      responseFieldValidate: [],
      arguments: undefined
    })

    // ---  ---

    const addNewProjectRequestFormParam: Ref<Array<KeyValue>> = ref([])

    function addFormParamItem() {
      addNewProjectRequestFormParam.value.push(new KeyValue("", ""))
    }

    function deleteFormParamItem(index: number) {
      addNewProjectRequestFormParam.value = addNewProjectRequestFormParam.value.filter((item, i, arr) => i != index)
    }

    // ---  ---

    const addNewProjectRequestArguments: Ref<Array<OnlyValue>> = ref([])

    function addArguments() {
      addNewProjectRequestArguments.value.push(new OnlyValue(""))
    }

    function deleteArguments(index: number) {
      addNewProjectRequestArguments.value = addNewProjectRequestArguments.value.filter((item, i, arr) => i != index)
    }

    // ---  ---

    function addResponseFieldValidate() {
      addNewProjectRequest.responseFieldValidate?.push({
        id: -1,
        fieldName: '',
        fieldPath: ''
      })
    }

    function deleteResponseFieldValidate(index: number) {
      addNewProjectRequest.responseFieldValidate = addNewProjectRequest.responseFieldValidate?.filter((item, i, arr) => i != index)
    }

    // ---  ---

    // 是否需要转换一下 param
    // 无论是 http method 是哪种类型 param 都是json格式，所以需要转换
    function convertParamIfNeed(): string {
      // 1 更新 param
      if (addNewProjectRequest.request.param === '' && addNewProjectRequestFormParam.value.length != 0) {
        // 转换 param
        let temp = new Map<string, string>()
        addNewProjectRequestFormParam.value.forEach(it => temp[it.key] = it.value)
        // 更新
        return JSON.stringify(temp)
      } else {
        return addNewProjectRequest.request.param
      }
    }

    async function clickToAdd() {
      // 1 更新 param
      addNewProjectRequest.request.param = convertParamIfNeed()

      // 2 更新 arguments
      addNewProjectRequest.arguments = addNewProjectRequestArguments.value.map(it => it.value)

      // 3 发起请求
      await addProjectRequest(projectId, addNewProjectRequest)

      // 刷新
      await loadProjectRequests()

      // 重置
      showAddProjectRequestDialog.value = false
      addNewProjectRequest.request.name = ''
      addNewProjectRequest.request.path = ''
      addNewProjectRequest.request.method = ''
      addNewProjectRequest.request.contentType = ''
      addNewProjectRequest.request.param = undefined
      addNewProjectRequest.responseFieldValidate = []
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToDelete(id: number) {
      await deleteProjectRequest(id)

      // 刷新
      await loadProjectRequests()
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const projectServerList: Ref<Array<ProjectServer>> = ref([])

    async function loadProjectServers() {
      const data = await allProjectServer(projectId)
      projectServerList.value = data
    }

    // ---  ---


    // ---  ---

    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    onMounted(() => {
      loadProjectRequests()

      loadProjectServers()
    })

    return {
      projectRequests,

      showAddProjectRequestDialog,
      addNewProjectRequest,
      addNewProjectRequestFormParam,
      addFormParamItem,
      deleteFormParamItem,
      addNewProjectRequestArguments,
      addArguments,
      deleteArguments,
      addResponseFieldValidate,
      deleteResponseFieldValidate,
      clickToAdd,

      clickToDelete,

      projectServerList,

      httpMethods,
      httpContentTypes
    }
  }
})
</script>

<style scoped>
.responseFieldValidateTag {
  margin-bottom: 6px;
}
</style>
