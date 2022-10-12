<template>
  <el-dialog
    title="新增员工"
    :visible="dialogVisible"
    @close="handleClose"
  >
    <!-- 表单 -->
    <el-form ref="addEmploy" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree v-show="isShow" v-loading="loading" :data="treeData" :default-expand-all="true" :props="{ label: 'name' }" style="width:80%" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
//  实现弹窗组件的显示和隐藏
//  其实 el-dialog 组件显示 隐藏 visible
//  父到子 props
//  点击关闭按钮 close $emit 去改父组件里的值 (upate:dialogVisible)
//  handleClose 完善 // 1. 表单重置 2.表单绑定的值从新赋值
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'HrsaasAddEmployee',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      hireType: EmployeeEnum.hireType,
      //   treeData: [{}],
      treeData: [{ name: '行政部', manager: '刘备' }],
      isShow: false,
      loading: false,
      // 表单校验 步骤
      // el-form配置model和rules属性
      // el-form-item配置prop属性
      // 表单进行v-model双向绑定

      // 表单校验
      // 需求：
      // 用户名必填，username，长度为1-4位
      // 手机号必填，mobile，需满足 正则表达式 /^1[3-9]\d{9}$/
      // 聘用形式必填， formOfEmployment change
      // 工号必填，workNumber
      // 部门必填，departmentName change
      // 入职时间必填， timeOfEntry
      // 转正时间可选，correctionTime
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '长度为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: 'mobile 不满足格式', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式必填' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间必填' }
        ],
        workNumber: [
          { required: true, message: '工号必填', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门必填' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      // 表单重置
      this.$refs.addEmploy.resetFields()
      // 重新赋值
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.isShow = false
      this.$emit('update:dialogVisible', false)
    },
    async getDepartments() {
      this.isShow = true
      this.loading = true
      const { depts } = await getDepartments()
      // depts是数组 但不是树形
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.isShow = false
    },
    async btnOK() {
      try {
        await this.$refs.addEmploy.validate()
        // 调用新增接口
        await addEmployee(this.formData) // 新增员工
        // 告诉父组件更新数据
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
        // this.$emit
        this.$parent.getEmployeeList()
        this.handleClose()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
