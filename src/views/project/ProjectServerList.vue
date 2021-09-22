<template>
  <!--  新建服务器区域  -->
  <div class="text-center my-2.5">
    <el-button type="primary" icon="el-icon-plus" @click="showAddProjectServerDialog = true">新建服务器</el-button>
  </div>
  <el-dialog width="36%" title="新建服务器" v-model="showAddProjectServerDialog">
    <el-form label-width="88px" label-position="left">
      <el-form-item label="服务器名称">
        <el-input placeholder="请输入服务器名称" clearable v-model="addNewProjectServer.serverName"></el-input>
      </el-form-item>
      <el-form-item label="服务器地址">
        <el-input placeholder="请输入服务器地址" clearable v-model="addNewProjectServer.serverAddr"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
        <el-button @click="showAddProjectServerDialog = false">取消</el-button>
        <el-button type="primary" @click="clickToAdd">保存</el-button>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <!--  显示数据区域  -->
  <div>
    <div v-if="projectServers.length === 0">
      <el-empty description="什么都没有"></el-empty>
    </div>
    <div v-else>
      <el-table :data="projectServers" border>
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="serverName" label="环境名称"></el-table-column>
        <el-table-column prop="serverAddr" label="地址"></el-table-column>
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
import {AddProjectServer, ProjectServer} from "../../api/model/project"
import {
  addProjectServer,
  deleteProjectServer,
  updateProjectServer,
  allProjectServer
} from "../../api/project"

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
      serverName: '',
      serverAddr: ''
    })

    async function clickToAdd() {
      await addProjectServer(projectId, addNewProjectServer)
      // 刷新
      await loadProjectServers()

      // 重置
      showAddProjectServerDialog.value = false
      addNewProjectServer.serverName = ''
      addNewProjectServer.serverAddr = ''
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
