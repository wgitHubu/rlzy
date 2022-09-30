<template>
  <el-row type="flex" justify="space-around" align="middle" style="height:40px;width:100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <el-col>
          <span>{{ treeNode.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item>添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot">删除部门</el-dropdown-item> -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit">编辑子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: { // isRoot 来控制 编辑部门 和 删除部门 的 显示 隐藏
      type: Boolean,
      default: true // 默认显示
    }
  },
  methods: {
    handleCommand(type) {
      console.log(type)
      if (type === 'add') {
        // 新增
        this.$emit('addDept', this.treeNode)
        console.log('1')
      } else if (type === 'edit') {
        // 编辑
        console.log('2')
      } else {
        // 删除
        console.log('3')
      }
    }
  }
}
</script>

<style>

</style>
