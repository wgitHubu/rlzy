<template>
  <!-- 新增部门的弹层 -->
  <!-- <el-dialog title="新增部门"> -->
  <el-dialog title="新增部门" :visible="dialogVisible" @close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop=" manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择">
          <el-option label="username11" value="username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
export default {

  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 检查编码重复
    const codeCheck = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      //   console.log(depts)
      const isRepeat = depts.some(item => item.code === value)
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const nameCheck = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      const deptstj = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      deptstj ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
      // console.log(deptstj)
      // callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称1-50个字符', trigger: 'blur' },
          {	trigger: 'blur', validator: nameCheck }
        ],
        code: [
          { required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码1-50个字符', trigger: 'blur' },
          {	trigger: 'blur', validator: codeCheck }
        ],
        manager: [
          { required: true, message: '部门负责人必填' }
        ],
        introduce: [
          { required: true, message: '部门介绍必填', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    console.log(this.treeNode)
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.addDeptForm.resetFields()
    }
  }
}

</script>

<style>

</style>
