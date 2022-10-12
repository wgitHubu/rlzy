<template>
  <div>
    <UploadExcel :on-success="handleSuccess" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'HrsaasIndex',

  data() {
    return {

    }
  },
  // header  ['手机号', '姓名', '入职日期', '转正日期', '工号']
  // results  [{ '入职日期': 43678, '姓名': '高大山', '工号': 20089, '手机号': 13041131879, '转正日期': 43678 }]

  // 后端接口要的数据：[{ 'timeOfEntry': 43678, 'username': '高大山', 'workNumber': 20089, 'mobile': 13041131879, 'correctionTime': 43678 }]

  // 实现批量新增员工
  methods: {
    async handleSuccess({ header, results }) {
      // console.log(header, results)
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }

      const arr = []
      results.forEach(item => {
        // console.log(item) // { '入职日期': 43678, '姓名': '高大山', '工号': 20089, '手机号': 13041131879, '转正日期': 43678 }
        const userinfo = {}
        //  Object.keys(item) // ['入职日期', '姓名', '工号','手机号',  ]
        Object.keys(item).forEach(key => {
          // key 中文
          // userRelations[key] 英文
          // userinfo.timeOfEntry
          // key 对应的值 item[key]
          userinfo[userRelations[key]] = item[key]
        })
        arr.push(userinfo)
      })
      console.log(arr)
      await importEmployee(arr)
      this.$message.success('导入成功')
      this.$router.back() // 回到上一页
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
