<template>
  <div v-loading="loading" class="departments-container">
    <!-- 头部 -->
    <el-card>
      <tree-toole :is-root="false" :tree-node="company" @addDept="handleAddDept" />
    </el-card>
    <!-- 展示 -->
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <tree-toole slot-scope="{data}" :tree-node="data" @addDept="handleAddDept" @editDept="editDept" @refreshDepts="getDepartments" />
    <!-- <tree-tools slot-scope="{data} " :tree-node="data" @addDept="handleAddDept" @editDept="editDept" /> -->
    </el-tree>
    <add-Dept ref="addDept" :dialog-visible.sync="dialogVisible" :tree-node="currentNode" />
  </div>
</template>

<script>
import treeToole from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import addDept from './components/add-dept.vue'
export default {
  name: 'HrsaasIndex',
  components: {
    treeToole,
    addDept
  },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      dialogVisible: false,
      currentNode: {},
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },

  mounted() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      try {
        this.loading = true
        const { depts, companyName, companyManage } = await getDepartments()
        this.departs = depts
        this.departs = tranListToTreeData(depts, '')
        this.company = { name: companyName, manager: companyManage, id: '' }
      } finally {
        this.loading = false
      }
      // console.log(this.departs)
      // this.company = { name: result.companyName, manager: result.companyManage }
      // this.departs = result.depts // 需要将其转化成树形结构
      // console.log(result)
    },
    handleAddDept(node) {
      this.dialogVisible = true
      this.currentNode = node
    },
    editDept(node) {
      this.dialogVisible = true
      this.currentNode = node
      this.$refs.addDept.formData = { ...node }
    }
  }
}
</script>

<style lang="scss" scoped>

.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree {
    .el-tree-node__content {
      padding-right: 20px;
    }
  }
}
</style>
