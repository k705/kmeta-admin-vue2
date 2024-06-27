<template>
  <div>
    <div style="margin-top: 30px;">
      <el-form label-width="150px" :model="uploadData" :rules="rules" ref="formData">
        <el-form-item label="文件路径：" prop="dir">
          <el-input v-model="uploadData.dir" style="width: 250px"/>
          <el-button type="primary" round style="margin-left: 20px" icon="el-icon-refresh" @click="cdnRefreshObjectCaches">刷新缓存</el-button>
        </el-form-item>
        <el-form-item label="文件名：">
          <el-radio-group v-model="uploadData.useFileName">
            <el-radio :label="true">原文件名</el-radio>
            <el-radio :label="false">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="fileName" v-if="!uploadData.useFileName">
          <el-input v-model="uploadData.fileName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否压缩(仅图片)：" prop="code">
          <el-radio-group v-model="uploadData.isCompress">
            <el-radio :label="false">不压缩</el-radio>
            <el-radio :label="true">压缩</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="协议文件：">
          <el-upload
            ref="upload"
            drag
            :auto-upload="false"
            :action= "uploadAction"
            :headers= "uploadHeaders"
            :data="uploadData"
            :on-success = "handleUploadSuccess"
            :file-list="fileList">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="fileUrl">
          <el-link type="primary" :href="fileUrl">{{fileUrl}}</el-link>
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 150px;">
        <div class="addbtn" @click="submitForm" style="float: left; margin-right: 10px;">上传文件</div>
        <div class="cancelBtn" @click="resetFields" style="float: left;">重置表单</div>
      </div>
    </div>
  </div>
</template>

<script>

import {getToken} from "@/utils/auth";
import {reqCdnRefreshObjectCaches} from "@/api/tool";

export default {
  data() {
    return {
      uploadAction: `${process.env.VUE_APP_BASE_API}` +  '/file/customizeUpload',
      uploadHeaders: {
        accessToken: getToken()
      },
      uploadData:{
        dir: null,
        useFileName: true,
        fileName: null,
        isCompress: false
      },
      fileList: [],
      fileUrl: null,
      rules: {
        dir: [{required: true, message: "请输入文件路径", trigger: "change"}],
        fileName: [{validator: this.validateFileName, trigger: "change"}],
      },
    };
  },
  mounted() {
  },
  methods: {
    validateFileName(rule, value, callback) {
      if (!this.uploadData.useFileName && !this.uploadData.fileName) {
        callback(new Error("请输入文件名")); // 长度不符合要求，验证失败
      } else {
        callback(); // 长度符合要求，验证通过
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.$refs.upload.submit();
        }
      });
    },
    handleUploadSuccess(response) {
      this.fileUrl = response.data;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    resetFields(){
      this.$refs.formData.resetFields();
      this.fileList = [];
      this.uploadData = {
        dir: null,
        useFileName: true,
        fileName: null,
        isCompress: false
      };
    },
    cdnRefreshObjectCaches(){
      if (!this.uploadData.dir){
        this.$message.error('请输入文件路径');
        return;
      }
      reqCdnRefreshObjectCaches(this.uploadData.dir).then(() => {
        this.$message({
          type: "success",
          message: "提交成功",
        });
      });
    }
  },
};
</script>

<style scoped>
.addbtn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 38px;
  width: 93px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 18px;
  color: #ffffff;
  font-weight: bold;
}

.cancelBtn {
  height: 40px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-weight: bold;
  margin-left: 20px;
  border: none;
  background-image: url("../../../assets/btn/btn.png");
  background-size: cover;
  background-position: center;
  position: relative;
}
</style>

