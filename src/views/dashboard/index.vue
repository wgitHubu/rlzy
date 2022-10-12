<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- <svg-icon iconClass="link"></svg-icon> -->
    <!-- <UploadExcel :on-success="handleSuccess" :before-upload="beforeUpload" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  // jia
  // created() {
  //   const res = this.$store.dispatch('user/getUserInfo')
  //   console.log(res)
  // }
  methods: {
    // handleSuccess(data) {
    //   console.log('data', data)
    // },
    // beforeUpload(file) {
    //   console.log(file)
    //   if (file.size > 1024) {
    //     this.$message.error('to Big')
    //     return false
    //   }
    //   return true
    // }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
