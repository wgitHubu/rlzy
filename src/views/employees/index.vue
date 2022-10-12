<template>
  <div class="app-container">
    <PageTools>
      <template #before>
        <span>共166条记录</span>
      </template>

      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
        <el-button size="small" type="primary" @click="handleEmploy">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" sortable :formatter="formatterFn" />
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="{ row }">
            {{ row.timeOfEntry|formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{ row }">
            <!-- 根据当前状态来确定 是否打开开关 -->
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next, sizes, total"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[5,10,15,20]"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <addEmployee :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getEmployeeList, delEmployee } from '@/api/employees'
import PageTools from '@/components/PageTools/index.vue'
import addEmployee from './components/add-employee'

import AddEmployee from './components/add-employee.vue'
export default {
  name: 'HrsaasIndex',

  components: {
    PageTools,
    addEmployee
  },

  data() {
    AddEmployee
    return {
      page: {
        page: 1, // 当前页码
        size: 10
      },
      list: [], // 接数据的
      total: 0, // 总数
      loading: false, //
      hireType: EmployeeEnum.hireType,
      dialogVisible: false
    }
  },

  mounted() {
    this.getEmployeeList()
  },

  methods: {
    async getEmployeeList() {
      try {
        this.loading = true
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
      } finally {
        this.loading = false //
      }
    },
    formatterFn(row, column, cellValue) {
      // 要去找 1所对应的值
      const res = this.hireType.find(item => item.id === cellValue)
      // return res.value
      return res ? res.value : '未知'
    },
    handleEmploy() {
      // console.log('111')
      this.dialogVisible = true
    },
    async del(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    async exportExcel() {
      const { export_json_to_excel } = await import('@/vendor/Export2Excel.js')
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.total
      })

      const exportExcelMapPath = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      const header = Object.keys(exportExcelMapPath)
      const data = rows.map(item => {
        return header.map(h => {
          if (h === '聘用形式') {
            const find = this.hireType.find(hire => {
              return hire.id === item[exportExcelMapPath[h]]
            })
            return find ? find.value : '未知'
          }
          return item[exportExcelMapPath[h]]
        })
      })

      // console.log(rows)
      export_json_to_excel({
        header, // 表头 必填
        data, // 具体数据 必填
        filename: '黑马员工列表', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
