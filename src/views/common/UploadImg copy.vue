<template>
  <div>
    <el-form>
      <!-- :on-change="uploadFile" -->
      <el-upload
        :limit="limit"
        action
        accept="image/*"
        :on-change="uploadFile"
        list-type="picture-card"
        :auto-upload="false"
        :file-list="fileList"
        :on-exceed="handleExceed"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        ref="upload"
        class="avatar-uploader"
        :class="{hide:showUpload}"
        :disabled="disabled"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      //查看图片
      <el-dialog width="30%" :visible.sync="dialogVisible">
        <img width="100%" :src="imgUrl.url" alt />
      </el-dialog>
      //如果不是需要直接上传的,而是需要按钮点击再进行图片上传请打开此方法
      //上面的el-upload标签里on-change换成http-request方法
      <!-- <Button text="上 传" type="add_u" style="margin-top: 10px;" @click.native="submitUpload"></Button> -->
    </el-form>
  </div>
</template>

<script>
//引入上传图片接口
import { reqUpload } from "@/api/brand";
export default {
  props: {
    limit: Number,
    fileList: Array,
    disabled: Boolean,
  },
  data() {
    return {
      showUpload: false, //控制limit最大值之后 关闭上传按钮
      dialogVisible: false, //查看图片弹出框
      imgUrl: [], //上传图片后地址合集
    };
  },
  //监听上传图片的数组(为了处理修改时,自动渲染问题,和上传按钮消失问题);
  watch: {
    fileList(newName, oldName) {
      if (newName.length == this.limit) this.showUpload = true;
      else this.showUpload = false;
    },
  },
  methods: {
    //文件列表移除文件时的函数
    handleRemove(file, fileList) {
      const index = this.fileList.findIndex((item) => item === file.uid);
      this.imgUrl.splice(index, 1);
      this.$emit("delUrl", this.imgUrl);
      if (fileList.length < this.limit) this.showUpload = false;
    },
    //点击文件列表中已上传的文件时的函数
    handlePictureCardPreview(file) {
      this.imgUrl.url = file.url;
      this.dialogVisible = true;
    },
    //这里是不需要直接上传而是通过按钮上传的方法
    submitUpload() {
      this.$refs.upload.submit();
    },
    //文件状态改变时的函数(主要逻辑函数)
    uploadFile(e, fileList) {
      //判断用户上传最大数量限制,来让上传按钮消失
      if (fileList.length >= this.limit) this.showUpload = true;
      // const file = e.file; <- 这里是不需要直接上传而是通过按钮上传的
      const file = e.raw; // <- 这里是直接上传的
      //大小
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
      } else if (size > 2) {
        this.$notify.warning({
          title: "警告",
          message: "图片大小必须小于2M",
        });
      } else {
        if (this.limit == 1) this.imgUrl = []; //此处判断为一张的时候需要清空数组
        const params = new FormData();
        params.append("source", file);
        reqUpload(params).then((res) => {
        //这里返回的数据结构(根据自己返回结构进行修改)
          if (res.data.status === 1) {
            this.$message.success("上传成功");
            this.imgUrl = res.data;
            //调用父组件的方法来传递图片参数
            this.$emit("getUrl", this.imgUrl);
          } else this.$message.error("上传失败");
        });
      }
    },
    //文件超出个数限制时的函数
    handleExceed(files, fileList) {
      this.$message.info(`最多只允许上传${this.limit}张图片`);
    },
  },
};
</script>

//这里修改上传前后的样式(我觉得el-upload不好看 也可以自行修改)
<style  scope>
.hide .el-upload--picture-card {
  display: none !important;
}
.avatar-uploader > .el-upload {
  width: 200px;
  height: 200px;
  line-height: 200px;
  border-radius: 0px;
  background: #fff;
  border: 1px dashed #ccc;
}
.avatar-uploader > .el-upload > i {
  font-size: 28px;
  color: #ccc;
}
.avatar-uploader > .el-upload-list {
  display: block;
}
.avatar-uploader > .el-upload-list > .el-upload-list__item {
  width: 200px;
  height: 200px;
  display: block;
}
.avatar-uploader > .el-upload-list > .el-upload-list__item > img {
  width: 200px;
  height: 200px;
  border-radius: 0px;
}
</style>
