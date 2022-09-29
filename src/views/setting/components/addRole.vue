<template>
  <el-dialog
    :title="title"
    width="50%"
    :visible="dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="formData"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{required:true,message:'角色必填',trigger:'blur'}]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="submit">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from '@/api/setting'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialog-visible', false)
      this.$refs.roleDialogForm.resetFields()
      this.formData = {
        name: '',
        description: ''
      }
    },
    async submit() {
      try {
        await this.$refs.roleDialogForm.validate()
        this.loading = true
        // await addRole(this.formData)
        this.formData.id ? await updateRole(this.formData) : await addRole(this.formData)
        this.$emit('refreshList')
        this.$message.success(this.formData.id ? '编辑成功' : '新增成功')
        this.handleClose()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }

}
</script>

<style>

</style>
