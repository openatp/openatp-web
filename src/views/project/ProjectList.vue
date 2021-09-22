<template>
  <!--  新建项目区域  -->
  <div class="text-center my-2.5">
    <el-button type="primary" icon="el-icon-plus" @click="showAddProjectDialog = true">新建项目</el-button>
  </div>
  <el-dialog width="36%" title="新建项目" v-model="showAddProjectDialog">
    <el-form label-width="88px" label-position="left">
      <el-form-item label="项目名称">
        <el-input placeholder="请输入项目名称" clearable v-model="addNewProject.name"></el-input>
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input placeholder="请输入项目描述" clearable v-model="addNewProject.desc"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAddProjectDialog = false">取消</el-button>
      <el-button type="primary" @click="clickToAdd">保存</el-button>
    </template>
  </el-dialog>

  <!-- +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ +++++ -->

  <!--  显示数据区域  -->
  <div>
    <!--  没有数据  -->
    <div v-if="projects.length === 0">
      <el-empty description="什么都没有"></el-empty>
    </div>

    <!--  有数据  -->
    <div class="flex flex-row flex-wrap justify-start">
      <el-card v-for="project in projects" :key="project.id" class="text-center  mx-2.5 my-2.5">
        <h4>{{ project.name }}</h4>
        {{ project.desc }} <br/>
        <el-button icon="el-icon-cpu" @click="openProjectServer(project.id)">服务器</el-button>
        <el-button icon="el-icon-office-building" @click="openProjectEnvVariable(project.id)">环境变量</el-button>
        <el-button icon="el-icon-aim" @click="openProjectRequestList(project.id)">请求</el-button>
        <el-button icon="el-icon-s-operation" @click="openTestCaseList(project.id)">测试案例</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="clickToDelete(project.id)"></el-button>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, reactive, Ref} from "vue"
import {useRouter} from "vue-router"
import {AddProject, Project} from "../../api/model/project"
import {
  addProject,
  deleteProject,
  listProject
} from "../../api/project"

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

      // 重置
      addNewProject.name = ''
      addNewProject.desc = ''
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    async function clickToDelete(id: number) {
      await deleteProject(id)
      await loadProjects()
    }

    // ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---  ---

    function openProjectServer(projectId: number) {
      router.push(`/project/server/${projectId}`)
    }

    function openProjectEnvVariable(projectId: number) {
      router.push(`/project/env_variable/${projectId}`)
    }

    function openProjectRequestList(projectId: number) {
      router.push(`/project/request/${projectId}`)
    }

    function openTestCaseList(projectId: number) {
      router.push(`/testcase/${projectId}`)
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
      openProjectRequestList,
      openTestCaseList
    }
  }
})
</script>

<style scoped>

</style>
