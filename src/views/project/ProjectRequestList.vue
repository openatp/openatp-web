<template>
  <!--  新建请求区域  -->
  <div class="text-center my-2.5">
    <el-button type="primary" icon="el-icon-plus" @click="showAddProjectRequestDialog = true">新建请求</el-button>
  </div>
  <el-dialog title="新建请求" v-model="showAddProjectRequestDialog">
    <el-form label-width="108px" label-position="left">
      <el-form-item label="接口名称">
        <el-input placeholder="请输入接口名称" clearable v-model="addNewProjectRequest.request.name"></el-input>
      </el-form-item>
      <el-form-item label="接口路径">
        <el-input placeholder="请输入接口路径,以/开头" clearable v-model="addNewProjectRequest.request.path"></el-input>
      </el-form-item>
      <el-form-item label="Method">
        <el-select placeholder="请选择 Method"
                   v-model="addNewProjectRequest.request.method">
          <el-option
              v-for="item in httpMethods"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Content Type">
        <el-select placeholder="请选择 Content Type"
                   v-model="addNewProjectRequest.request.contentType"
                   :disabled="addNewProjectRequest.request.method === 'GET'">
          <el-option
              v-for="item in httpContentTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 参数区域 -->
      <div class="my-2.5">
        <div v-if="addNewProjectRequest.request.contentType === 'JSON'">
          <el-form-item label="请求参数">
            <el-input placeholder="请输入请求参数" type="textarea"
                      rows="4" clearable
                      v-model="addNewProjectRequest.request.param"></el-input>
          </el-form-item>
        </div>
        <div v-else-if="addNewProjectRequest.request.contentType === 'FORM'" class="my-2.5">
          <el-form-item v-for="(arg, index) in addNewProjectRequestFormParam" :label="'请求参数' + index">
            <el-col>
              <el-input placeholder="参数名称" clearable v-model="arg.key"></el-input>
            </el-col>
            <el-col>=</el-col>
            <el-col>
              <el-input placeholder="参数值" clearable v-model="arg.value"></el-input>
            </el-col>
            <el-col>
              <el-button type="danger" icon="el-icon-delete" @click="deleteFormParamItem(index)"></el-button>
            </el-col>
          </el-form-item>
          <el-button type="primary" @click="addFormParamItem">添加请求参数</el-button>
        </div>
      </div>

      <hr/>

      <!--  占位参数  -->
      <div class="my-2.5">
        <el-form-item v-for="(arg, index) in addNewProjectRequestArguments" :label="'占位参数'+ index">
          <el-col>
            <el-input placeholder="占位参数名称" clearable v-model="arg.value"></el-input>
          </el-col>
          <el-col>
            <el-button type="danger" icon="el-icon-delete" @click="deleteArguments(index)"></el-button>
          </el-col>
        </el-form-item>
        <el-button type="primary" @click="addArguments">添加占位参数</el-button>
      </div>

      <hr/>

      <!--  响应验证字段  -->
      <div class="my-2.5">
        <el-form-item v-for="(resp, index) in addNewProjectRequest.responseFieldValidate" :label="'响应验证字段' + index">
          <el-col>
            <el-input placeholder="验证字段名称" clearable v-model="resp.fieldName"/>
          </el-col>
          <el-col>:</el-col>
          <el-col>
            <el-input placeholder="验证字段jsonpath" clearable v-model="resp.fieldPath"/>
          </el-col>
          <el-col>
            <el-button type="danger" icon="el-icon-delete" @click="deleteResponseFieldValidate(index)"></el-button>
          </el-col>
        </el-form-item>
        <el-button type="primary" @click="addResponseFieldValidate">添加响应验证</el-button>
      </div>
    </el-form>
    <template #footer>
      <el-button type="warning" @click="openPreExecDialog()">测试</el-button>
      <el-button @click="showAddProjectRequestDialog = false">取消</el-button>
      <el-button type="primary" @click="clickToAdd">保存</el-button>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <!--  测试请求区域  -->
  <el-dialog title="测试请求" v-model="showPreExecDialog">
    <div>
      <!--  占位参数和请求目标服务器区域  -->
      <div>
        <!--  占位参数区域  -->
        <el-form label-width="88px" label-position="right">
          <el-form-item v-for="arg in preExecArguments" :label="arg.key">
            <el-input clearable v-model="arg.value"></el-input>
          </el-form-item>
        </el-form>
        <hr/>
        <!--  请求目标服务器  -->
        <div class="mt-2.5">
          <span v-if="projectServerList.length === 0" class="bg-yellow-400">无可用服务器</span>
          <div v-else class="flex flex-row flex-wrap justify-center">
            <el-button v-for="env in projectServerList" @click="clickToPreExec(env.id)">
              请求 {{ env.serverName }} 服务器
            </el-button>
          </div>
        </div>
      </div>

      <!--  请求体和响应体显示区域  -->
      <div v-if="preExecResponse.request !== '' || preExecResponse.response !== ''">
        请求体：<br/>
        {{ preExecResponse.request }}
        响应体：<br/>
        {{ preExecResponse.response }}
      </div>
    </div>
    <template #footer>
      <el-button @click="showPreExecDialog = false">取消</el-button>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <!--  显示数据区域  -->
  <div>
    <div v-if="projectRequests.length === 0">
      <el-empty description="什么都没有"></el-empty>
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
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, Ref, watch} from "vue"
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

    // form 请求体参数
    const addNewProjectRequestFormParam: Ref<Array<KeyValue>> = ref([])

    function addFormParamItem() {
      addNewProjectRequestFormParam.value.push(new KeyValue("", ""))
    }

    function deleteFormParamItem(index: number) {
      addNewProjectRequestFormParam.value = addNewProjectRequestFormParam.value.filter((item, i, arr) => i != index)
    }

    // ---  ---

    // 请求体参数在 json 和 form 之间切换时要清空请求体
    watch(() => addNewProjectRequest.request.method, (newVal, oldVal) => {
      addNewProjectRequest.request.param = undefined
      if (newVal === 'GET') {
        addNewProjectRequest.request.contentType = 'FORM'
      } else {
        addNewProjectRequest.request.contentType = ''
      }

      addNewProjectRequestFormParam.value = []
    })

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
    function convertParamIfNeed(): string | undefined {
      if (addNewProjectRequest.request.param === undefined && addNewProjectRequestFormParam.value.length != 0) {
        // 转换 param
        let temp = new Map<string, string>()
        addNewProjectRequestFormParam.value.forEach(it => temp.set(it.key, it.value))
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

    const showPreExecDialog = ref(false)

    const preExecArguments: Ref<Array<KeyValue>> = ref([])

    const preExecResponse = reactive<ProjectRequestPreExecResponse>({
      request: "",
      response: ""
    })

    function openPreExecDialog() {
      // 先更新 arg
      preExecArguments.value = []
      addNewProjectRequestArguments.value.forEach(it => preExecArguments.value.push(new KeyValue(it.value, "")))

      // 再清空请求和响应
      preExecResponse.request = ''
      preExecResponse.response = ''

      showPreExecDialog.value = true
    }

    async function clickToPreExec(projectServerId: number) {
      // ->1<- 记录 addNewProjectRequest.request.param 是否是 undefined
      let isParamIsUndefined = addNewProjectRequest.request.param === undefined
      // 然后才可以更新 param
      addNewProjectRequest.request.param = convertParamIfNeed()

      let arg = Object.create(null)
      preExecArguments.value.forEach(it => arg[it.key] = it.value)

      const data = await preExecProjectRequest(projectId, projectServerId, new class implements ProjectRequestPreExecRequest {
        arguments = JSON.stringify(arg);
        env = undefined;
        request = addNewProjectRequest.request;
      })

      preExecResponse.request = data.request
      preExecResponse.response = data.response

      // ->2<- 如果 addNewProjectRequest.request.param 是 undefined 则需要还原为 undefined
      if (isParamIsUndefined) {
        addNewProjectRequest.request.param = undefined
      }
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

      showPreExecDialog,
      openPreExecDialog,
      projectServerList,
      clickToPreExec,
      preExecArguments,
      preExecResponse,

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
