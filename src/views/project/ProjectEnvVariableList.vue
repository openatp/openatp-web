<template>
  <!--  新建环境变量区域  -->
  <div class="text-center my-2.5">
    <el-button type="primary" icon="el-icon-plus" @click="showAddProjectEnvVariableDialog = true">新建环境变量</el-button>
  </div>
  <el-dialog width="36%" title="新建环境变量" v-model="showAddProjectEnvVariableDialog">
    <el-form label-width="88px" label-position="left">
      <el-form-item label="变量名称">
        <el-input placeholder="请输入变量名称" clearable v-model="addNewProjectEnvVariable.variableName"></el-input>
      </el-form-item>
      <el-form-item label="变量默认值">
        <el-input placeholder="请输入变量默认值" clearable v-model="addNewProjectEnvVariable.defaultValue"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAddProjectEnvVariableDialog = false">取消</el-button>
      <el-button type="primary" @click="clickToAdd">保存</el-button>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <!--  显示数据区域  -->
  <div>
    <div v-if="projectEnvVariables.length === 0">
      <el-empty description="什么都没有"></el-empty>
    </div>
    <div v-else>
      <el-table :data="projectEnvVariables" border>
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="variableName" label="变量名称"></el-table-column>
        <el-table-column prop="defaultValue" label="变量默认值"></el-table-column>
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
import {defineComponent, onMounted, ref, reactive, Ref} from "vue"
import {useRoute} from "vue-router"

import {
  addProjectEnvVariable,
  deleteProjectEnvVariable,
  updateProjectEnvVariable,
  allProjectEnvVariable
} from "../../api/project";
import {AddProjectEnvVariable, ProjectEnvVariable} from "../../api/model/project";

export default defineComponent({
  name: "ProjectEnvVariableList",
  setup: () => {
    const route = useRoute()
    const projectId = route.params.projectId as unknown as number

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const projectEnvVariables: Ref<Array<ProjectEnvVariable>> = ref([])

    async function loadProjectEnvVariable() {
      const data = await allProjectEnvVariable(projectId)
      projectEnvVariables.value = data
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    let showAddProjectEnvVariableDialog = ref(false)
    const addNewProjectEnvVariable = reactive<AddProjectEnvVariable>({
      variableName: '',
      defaultValue: ''
    })

    async function clickToAdd() {
      await addProjectEnvVariable(projectId, addNewProjectEnvVariable)

      // 刷新
      await loadProjectEnvVariable()

      // 重置
      showAddProjectEnvVariableDialog.value = false
      addNewProjectEnvVariable.variableName = ''
      addNewProjectEnvVariable.defaultValue = ''
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToDelete(id: number) {
      await deleteProjectEnvVariable(id)

      // 刷新
      await loadProjectEnvVariable()
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToUpdate() {

    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    onMounted(() => {
      loadProjectEnvVariable()
    })

    return {
      projectEnvVariables,

      showAddProjectEnvVariableDialog,
      addNewProjectEnvVariable,
      clickToAdd,

      clickToDelete,

      clickToUpdate
    }
  }
})
</script>

<style scoped>

</style>
