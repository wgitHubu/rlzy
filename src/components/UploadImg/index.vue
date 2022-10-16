<template>
  <div>
    <el-upload
      v-loading="loading"
      class="uploadImg"
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :http-request="onHttpRequest"
      :limit="1"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 图片弹框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialog"
      width="50%"
    >
      <img style="width:100%" :src="previewImgUrl">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDteBe8f4d7b7gHuXQOPOGTSGwNZYR9lP5',
  SecretKey: 'wvx2594sekplU2MUQAiDpPp576sQluyp'
})
console.log(COS)
export default {
  name: 'UploadImg',
  props: {
    defaultUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      loading: false,
      previewDialog: false,
      previewImgUrl: '',
      fileList: []
    }
  },
  watch: {
    defaultUrl() {
      this.fileList.push({
        name: 'dafault', url: this.defaultUrl
      })
    }
    // employeesPic
  },
  methods: {

    onPreview(file) {
      console.log('点击预览')
      this.previewDialog = true
      this.previewImgUrl = file.url
      // this.dialogImageUrl = file.url
      // this.dialogVisible = true
    },
    onRemove(file, fileList) {
      console.log('点击删除')
      this.fileList = fileList
    },
    onChange(file, fileList) {
      console.log('点击添加')
      this.fileList = fileList
    },
    onHttpRequest({ file }) {
      this.loading = true
      console.log('先等一等')
      cos.putObject({
        Bucket: 'hz-33-1314348599', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: 'file.name', /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        // console.log(err || data)
        if (err) return this.$message.error('上传失败')
        this.loading = false
        this.$emit('on-success', { imgUrl: 'http://' + data.Location })
      })
    },
    beforeUpload(file) {
      const allowTypes = ['image/jpeg', 'image/gif', 'image/png']
      const ishas = allowTypes.includes(file.type)
      if (!ishas) {
        this.$message.error('上传图片只能是' + allowTypes.join('、') + '格式!')
        return false
      }
      const maxSize = 1 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过1M')
        return false
      }
      // return true
    }
  }
}
</script>

<style lang="scss">
.uploadImg{
  width: 148px;
  height: 148px;
  overflow: hidden;
}

</style>
