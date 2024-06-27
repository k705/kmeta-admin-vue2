
<template>
  <div class="cl">
    <el-upload
      v-loading="loadingFlag"
      :disabled="isDisabled"
      action
      accept="image/*"
      class="avatar-uploader"
      :auto-upload="false"
      :on-change="uploadFile"
      :show-file-list="false"
      >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
// import { uploadImg } from "@/api"; //上传图片接口
import { reqUpload } from "@/api/brand";


export default {
  name: 'UploadImg',
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    module: {
      type: String,
      default: null
    },
    getWidthHeight: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      imgUrl: '',
      loadingFlag: false,
    };
  },
  methods: {
    uploadFile(e) {
      console.log(e);
      const file = e.raw;
      const size = file.size / 1024 / 1024 / 2;
      if (
        !(
          file.type === "image/png" ||
          file.type === "image/gif" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg"
        )
      ) {
      this.$notify.warning({
        title: "警告",
        message:
          "请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片",
      });
      }
      else if (size > 10) {
        this.$notify.warning({
          title: "警告",
          message: "图片大小必须小于10M",
        });
      }
      else {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('getWidthHeight', this.getWidthHeight);
        if(this.module) {
          formData.append('module', this.module);
        }
        this.loadingFlag = true
        reqUpload(formData).then((res) => {
          this.$emit("get-url", res.data.data);
          this.loadingFlag = false
        }).catch(err => {
          this.loadingFlag = false
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.remove {
  font-size: 20px;
  position: absolute;
  top: -9px;
  right: -9px;
  color: #000 !important;
}
</style>
<style>
.el-upload {
  border: 1px dashed #d9d9d9;
}
.cl .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px !important;
  height: 120px !important;
  line-height: 120px;
  text-align: center;
}
.cl .avatar {
  width: 120px !important;
  height: 120px !important;
  display: block;
}
.cl > .avatar-uploader > .el-upload {
  width: 120px !important;
  height: 120px !important;
}
.el-loading-mask {

width: 120px !important;
height: 120px !important;
}
</style>
