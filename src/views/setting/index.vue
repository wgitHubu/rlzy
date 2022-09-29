<template>
  <div class="app-container">
    <el-card shadow="always">
      <el-tabs v-model="activeName">
        <!-- 新增角色 -->
        <el-tab-pane label="新增角色" name="first">
          <el-row>
            <el-button type="primary" style="margin-left:10px" size="small" @click="addRole">新增角色</el-button>
          </el-row>
          <!-- 表格 -->
          <el-table
            v-loading="loading"
            style="width: 100%"
            :data="roleList"
          >
            <el-table-column
              label="序号"
              width="120"
              type="index"
            />
            <el-table-column
              label="角色名称"
              width="180"
              prop="name"
            />
            <el-table-column
              label="描述"
              prop="description"
            />
            <el-table-column align="center" label="操作" width="240px">
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="edit(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRow(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-row type="flex" justify="end" align="middle" style="height:60px">
            <el-pagination
              background
              layout="prev, pager, next, sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[5,10,15]"
              @current-change="getRoleList"
              @size-change="getRoleList"
            />
          </el-row>
        </el-tab-pane>
        <!-- 公司信息 -->
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <!-- <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form> -->
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <add-role ref="addRole" :dialog-visible.sync="dialogVisible" @refreshList="addRole" />
  </div>
</template>

<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import addRole from './components/addRole.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'HrsaasIndex',
  components: { addRole },
  data() {
    return {
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      roleList: [],
      loading: false,
      dialogVisible: false,
      companyInfo: ''
    }
  },

  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  // mounted() {
  //   this.getRoleList()
  // },

  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        this.total = total
        this.roleList = rows
        if (total > 0 && rows.length === 0) {
          this.page.page = this.page.page - 1
          this.getRoleList()
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    addRole() {
      this.dialogVisible = true
    },
    edit(row) {
      this.$refs.addRole.formData = { ...row }
      this.dialogVisible = true
    },
    async delRow(id) {
      try {
        await this.$confirm('确认删除改角色吗', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
        await deleteRole(id)
        this.getRoleList()
        console.log('success')
      } catch (e) {
        console.log('e')
      }
    },
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
