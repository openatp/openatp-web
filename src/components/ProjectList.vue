<template>
  <el-button type="primary" icon="el-icon-plus" @click="showAddProjectDialog = true">新建项目</el-button>
  <el-dialog title="新建项目" v-model="showAddProjectDialog">
    <div>
      <el-input placeholder="请输入项目名称" clearable v-model="addNewProject.name"></el-input>
      <el-input placeholder="请输入项目描述" clearable v-model="addNewProject.desc"></el-input>
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="showAddProjectDialog = false">取消</el-button>
      <el-button type="primary" @click="clickToAdd">保存</el-button>
    </span>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <div v-if="projects.length === 0">
    <span> 什么都没有</span>
  </div>
  <div v-else>
    <div class="list-box" v-for="project in projects" :key="project.id">
      <el-card class="list-item">
        <h4>{{ project.name }}</h4>
        {{ project.desc }} <br/>
        <el-button icon="el-icon-cpu" @click="openProjectServer(project.id)">服务器</el-button>
        <el-button icon="el-icon-office-building" @click="openProjectEnvVariable(project.id)">环境变量</el-button>
        <el-button type="danger" icon="el-icon-s-operation" @click="openProjectRequestList(project.id)"></el-button>
        <el-button type="danger" icon="el-icon-delete" @click="clickToDelete(project.id)"></el-button>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, reactive, Ref} from "vue"
import {useRouter} from "vue-router"
import {AddProject, Project} from "../api/model/project"
import {
  addProject,
  deleteProject,
  listProject
} from "../api/project"

export default defineComponent({
  name: "ProjectList",
  setup: () => {
    const router = useRouter()

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    let projects: Ref<Array<Project>> = ref([])

    async function loadProjects() {
      const data = await listProject()
      projects.value = data
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    let showAddProjectDialog = ref(false)
    let addNewProject = reactive<AddProject>({
      name: '',
      desc: ''
    })

    async function clickToAdd() {
      await addProject(addNewProject)
      await loadProjects()

      showAddProjectDialog.value = false
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToDelete(id: number) {
      await deleteProject(id)
      await loadProjects()
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    function openProjectServer(projectId: number) {
      router.push(`/server/${projectId}`)
    }

    function openProjectEnvVariable(projectId: number) {
      router.push(`/env_variable/${projectId}`)
    }

    function openProjectRequestList(projectId: number) {
      router.push(`/request/${projectId}`)
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    onMounted(() => {
      loadProjects()
    })

    return {
      projects,

      showAddProjectDialog,
      addNewProject,
      clickToAdd,

      clickToDelete,

      openProjectServer,
      openProjectEnvVariable,
      openProjectRequestList
    }
  }
})
</script>

<style scoped>
.list-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.list-box .list-item {
  /*width: 120px;*/
  margin-left: 12px;
  margin-right: 12px;
}
</style>
