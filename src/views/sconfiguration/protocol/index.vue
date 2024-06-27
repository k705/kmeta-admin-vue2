<template>
  <div>


    <div style="margin-top: 30px; margin-left: 20px;">
      <el-link :href="protocol.starConvention" type="primary" style="margin-right: 20px;">《星球公约》</el-link>
      <el-link :href="protocol.customer" type="primary" style="margin-right: 20px;">《用户协议》</el-link>
      <el-link :href="protocol.privacy" type="primary" style="margin-right: 20px;">《隐私协议》</el-link>
      <el-link :href="protocol.writeOff" type="primary">《注销协议》</el-link>
    </div>


    <div style="margin-top: 30px;">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="协议类型：" prop="code">
          <el-select v-model="formData.code" @change="handleSelectChange">
            <el-option
              v-for="item in protocolEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协议文件：">
          <el-upload
            ref="upload"
            drag accept=".html"
            :auto-upload="false"
            :action= "uploadAction"
            :headers= "uploadHeaders"
            :data="uploadData"
            :on-change="handleUploadChange"
            :on-success = "handleUploadSuccess"
            :file-list="fileList">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <div v-if="filePreview">
            <h3>文件内容预览：</h3>
            <iframe :srcdoc="filePreview" width="80%" height="500vh" border="0"/>
          </div>
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 115px;">
        <div class="addbtn" @click="submitForm">上传协议</div>
      </div>
    </div>
  </div>
</template>

<script>

import {reqAgreementUpdate, reqGetProtocolInfo} from "@/api/protocol";
import {getToken} from "@/utils/auth";

export default {
  data() {
    return {
      uploadAction: `${process.env.VUE_APP_BASE_API}` +  '/file/customizeUpload?customizeUpload',
      uploadHeaders: {
        accessToken: getToken()
      },
      uploadData:{
        dir: "agreement",
        fileName: null,
      },
      fileList: [],
      filePreview: null,
      protocol: {
        starConvention: null,
        customer: null,
        privacy: null,
        writeOff: null
      },
      formData: {
        code: null,
        link: null
      },
      protocolEnum: [
        {code: "starConvention", desc: "星球公约"},
        {code: "customer", desc: "用户协议"},
        {code: "privacy", desc: "隐私协议"},
        {code: "writeOff", desc: "注销协议"},
      ],
      rules: {
        code: [{required: true, message: "请选择协议类型", trigger: "change"}],
        link: [{required: true, message: "请上传协议文件", trigger: "change"}],
      },
    };
  },
  mounted() {
    this.getProtocolInfo();
  },
  methods: {
    async getProtocolInfo() {
      const result = await reqGetProtocolInfo();
      this.protocol = result.data.data;
    },
    /** 提交按钮 */
    submitForm() {
      this.uploadAction = this.uploadActionPrefix + `&fileName=${this.formData.code}.html`;
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.$refs.upload.submit();
        }
      });
    },
    handleUploadChange(file, fileList) {
      this.fileList = fileList.slice(-1);

      if (fileList.length > 0) {
        // 获取选中的第一个文件
        const selectedFile = fileList[0];

        // 使用 FileReader 读取文件内容
        const reader = new FileReader();

        reader.onload = (e) => {
          // 更新状态以显示文件内容预览
          console.log('e.target.result:', e.target.result);
          this.filePreview = e.target.result;
        };

        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        // 根据文件类型选择不同的读取方式
        if (selectedFile.raw.type.startsWith('text')) {
          reader.readAsText(selectedFile.raw, "gb2312");
        } else {
          // 如果是其他类型的文件，可以根据需要选择不同的读取方式
          reader.readAsDataURL(selectedFile.raw);
        }
      } else {
        // 清空文件内容预览
        this.filePreview = null;
      }
      console.log("filePreview", this.filePreview)
    },
    handleUploadSuccess(response) {
      this.formData.link = response.data;
      this.$refs.formData.validate((valid) => {
        if (valid) {
          reqAgreementUpdate(this.formData).then(() => {
            this.$message({
              type: "success",
              message: "上传成功",
            });
            this.$refs.formData.resetFields();
            this.fileList = [];
            this.filePreview = null;
            this.formData = {
              code: null,
              link: null
            };
            this.getProtocolInfo();
          });
        }
      });
    },
    handleSelectChange(){
      this.uploadData.fileName = this.formData.code + ".html";
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
</style>

