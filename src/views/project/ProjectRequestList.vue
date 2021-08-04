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
        <el-select placeholder="请选择 content-type" v-model="addNewProjectRequest.request.contentType">
          <el-option
              v-for="item in httpContentTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="请输入接口参数" type="textarea" rows="4" clearable
                  v-model="addNewProjectRequest.request.param"></el-input>
      </div>
      <div>
        <div v-for="field in addNewProjectRequest.responseFieldValidate">
          <el-input placeholder="响应验证字段名称" clearable v-model="field.fieldName"></el-input>
          <el-input placeholder="响应验证字段path" clearable v-model="field.fieldPath"></el-input>
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
      <el-table-column label="响应验证字段">
        <template #default="scope">
          <span v-for="v in scope.row.responseFieldValidate">
            <el-tag effect="plain" class="responseFieldValidateTag">{{ v.fieldName }}: {{ v.fieldPath }}</el-tag> <br />
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
import {defineComponent, onMounted, reactive, ref, Ref} from "vue"
import {useRoute} from "vue-router"
import {useHttpContentTypes, useHttpMethods} from "../../hooks/use_type"
import {AddProjectRequest, ProjectRequest} from "../../api/model/project"
import {addProjectRequest, deleteProjectRequest, listProjectRequest} from "../../api/project"

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
      responseFieldValidate: []
    })

    function addResponseFieldValidate() {
      addNewProjectRequest.responseFieldValidate?.push({
        fieldName: '',
        fieldPath: ''
      })
    }

    async function clickToAdd() {
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

    async function clickToUpdate() {

    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    onMounted(() => {
      loadProjectRequests()
    })

    return {
      projectRequests,

      showAddProjectRequestDialog,
      addNewProjectRequest,
      addResponseFieldValidate,
      clickToAdd,

      clickToDelete,
      clickToUpdate,

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
