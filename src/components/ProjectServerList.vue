<template>
  <el-button type="primary" icon="el-icon-plus" @click="showAddProjectServerDialog = true">新建服务器</el-button>
  <el-dialog title="新建项目" v-model="showAddProjectServerDialog">
    <div>
      <el-input placeholder="请输入服务器名称" clearable v-model="addNewProjectServer.envName"></el-input>
      <el-input placeholder="请输入服务器地址" clearable v-model="addNewProjectServer.baseUrl"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddProjectServerDialog = false">取消</el-button>
        <el-button type="primary" @click="clickToAdd">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <div v-if="projectServers.length === 0">
    <span> 什么都没有</span>
  </div>
  <div v-else>
    <el-table :data="projectServers" border>
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="envName" label="环境名称"></el-table-column>
      <el-table-column prop="baseUrl" label="地址"></el-table-column>
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
import {defineComponent, onMounted, ref, reactive, Ref} from "vue"
import {useRoute} from "vue-router"
import {AddProjectServer, ProjectServer} from "../api/model/project"
import {
  addProjectServer,
  deleteProjectServer,
  updateProjectServer,
  allProjectServer
} from "../api/project"

export default defineComponent({
  name: "ProjectServerList",
  setup: () => {
    const route = useRoute()
    const projectId = route.params.projectId as unknown as number

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const projectServers: Ref<Array<ProjectServer>> = ref([])

    async function loadProjectServers() {
      const data = await allProjectServer(projectId)
      projectServers.value = data
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    const showAddProjectServerDialog = ref(false)
    const addNewProjectServer = reactive<AddProjectServer>({
      envName: '',
      baseUrl: ''
    })

    async function clickToAdd() {
      await addProjectServer(projectId, addNewProjectServer)
      // 刷新
      await loadProjectServers()

      // 重置
      showAddProjectServerDialog.value = false
      addNewProjectServer.envName = ''
      addNewProjectServer.baseUrl = ''
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToDelete(id: number) {
      await deleteProjectServer(id)
      // 刷新
      await loadProjectServers()
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToUpdate() {

    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    onMounted(() => {
      loadProjectServers()
    })

    return {
      projectServers,

      showAddProjectServerDialog,
      addNewProjectServer,
      clickToAdd,

      clickToDelete,
      clickToUpdate
    }
  }
})
</script>

<style scoped>

</style>
