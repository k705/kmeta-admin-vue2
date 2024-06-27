<template>
  <div>
    <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 20px;">
      <div class="addbtn" @click="clickAdd">添加版本</div>
    </div>

    <el-form :model="pageQuery" :inline="true" style="margin-top: 35px; margin-left: 20px;">
      <el-form-item label="客户端：">
        <el-select v-model="pageQuery.client" clearable>
          <el-option
            v-for="item in clientEnum"
            :key="item.code"
            :label="item.desc"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary"  icon="el-icon-search"  @click="getVersionList" round style="margin-left: 40px;"/>
    </el-form>

    <div class="app-container" style="margin-right: 30px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="客户端" width="300" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="clientEnum.some(item => item.code === row.client)" type="info">
              {{ clientEnum.find(item => item.code === row.client).desc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本号" width="150" align="center"/>
        <el-table-column label="是否强制更新" width="210" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.forceUpdate" type="warning">是</el-tag>
            <el-tag v-if="!row.forceUpdate" type="success">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="发布状态" width="150" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.state === 1" type="warning">待发布</el-tag>
            <el-tag v-if="row.state === 2" type="success">已发布</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="releaseTime" label="发布时间" width="200" align="center"/>
        <el-table-column prop="releaseNotes" label="更新内容" show-overflow-tooltip width="400" align="center"/>
        <el-table-column prop="createTime" label="创建时间" width="250" align="center"/>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="clickUpdate(scope.row)" icon="el-icon-edit" type="text" size="small">编辑</el-button>
            <el-button @click="clickPublish(scope.row)" v-if="scope.row.state === 1" icon="el-icon-s-promotion" type="text" size="small">发布</el-button>
            <el-button @click="clickRevoke(scope.row)" v-if="scope.row.state === 2" icon="el-icon-refresh-left" type="text" size="small">撤销</el-button>
            <el-button @click="clickDelete(scope.row)" icon="el-icon-delete" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          layout="total, prev, pager, next"
          @current-change="handleChangeStarPage"
          :page-size="pageQuery.pageSize"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="任务信息" :visible.sync="dialogVisible" top="10vh" >
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="客户端：" prop="client">
          <el-select v-model="formData.client" placeholder="客户端">
            <el-option
              v-for="item in clientEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号：" prop="version">
          <el-input v-model="formData.version" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否强更：" prop="forceUpdate">
          <el-radio-group v-model="formData.forceUpdate">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布时间：" prop="releaseTime">
          <el-date-picker
            v-model="formData.releaseTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="APP安装包：" prop="downloadLink">
          <el-upload
            drag
            :action= "uploadAction"
            :headers= "uploadHeaders"
            :on-change="handleUploadChange"
            :on-success = "handleUploadSuccess"
            :file-list="fileList">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <div v-if="formData.downloadLink">
            <vue-qr
              ref="qrCode"
              :text="formData.downloadLink"
              :logoSrc="logoSrc"
              color-dark="black"
              width="150"
              height="150"
            ></vue-qr>
          </div>
        </el-form-item>
        <el-form-item label="更新内容：" prop="releaseNotes">
          <el-input
            v-model="formData.releaseNotes"
            type="textarea"
            style="width: 400px"
            :rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex;">
        <el-button class="subBtn" @click="submitForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


import logo from './logo.png'
import VueQr from 'vue-qr'
import {
  reqAddVersion,
  reqDeleteVersion,
  reqGetVersionList,
  reqPublishVersion,
  reqRevokeVersion,
  reqUpdateVersion
} from "@/api/version";
import {getToken} from "@/utils/auth";

export default {
  components:{
    VueQr,
  },
  data() {
    return {
      logoSrc: "",
      uploadAction: `${process.env.VUE_APP_BASE_API}` +  '/file/upload?module=app&useFileName=true',
      uploadHeaders: {
        accessToken: getToken()
      },
      fileList: [],
      dialogVisible: false,
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
        client: null,
      },
      tableData: null,
      formData: {
        id: null,
        client: null,
        version: null,
        releaseTime: null,
        releaseNotes: null,
        downloadLink: null,
        forceUpdate: false,
        state: 1
      },
      clientEnum: [
        {code: 0, desc: "iOS"},
        {code: 1, desc: "Android"},
      ],
      rules: {
        client: [{required: true, message: "请选择客户端", trigger: "change"}],
        version: [{required: true, message: "请填写APP版本号", trigger: "change"}],
        releaseTime: [{required: true, message: "请选择版本发布时间", trigger: "change"}],
        releaseNotes: [{required: true, message: "请输入版本更新内容", trigger: "change"}],
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        }
      },
    };
  },
  mounted() {
    this.logoSrc = logo;
    this.getVersionList();
  },
  methods: {
    async getVersionList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
      if (this.pageQuery.client){
        param = param + `&client=${this.pageQuery.client}`;
      }
      const result = await reqGetVersionList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getVersionList();
    },
    clickAdd() {
      this.dialogVisible = true;
    },
    clickUpdate(row) {
      this.formData = {
        id: row.id,
        client: row.client,
        version: row.version,
        releaseTime: row.releaseTime,
        releaseNotes: row.releaseNotes,
        downloadLink: row.downloadLink,
        forceUpdate: row.forceUpdate,
        state: row.state
      };
      this.dialogVisible = true;
    },
    clickDelete(row) {
      const targetValue = this.clientEnum.find(item => item.code === row.client)?.desc;
      this.$confirm('确定删除【'+targetValue+'】版本【'+row.version+'】吗？',{type: 'warning'})
        .then(_ => {
          reqDeleteVersion({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getVersionList();
          });
        }).catch(_ =>{})
    },
    clickPublish(row) {
      const targetValue = this.clientEnum.find(item => item.code === row.client)?.desc;
      this.$confirm('确定发布【'+targetValue+'】版本【'+row.version+'】吗？',{type: 'warning'})
        .then(_ => {
          reqPublishVersion({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "发布成功",
            });
            this.getVersionList();
          });
        }).catch(_ =>{})
    },
    clickRevoke(row) {
      const targetValue = this.clientEnum.find(item => item.code === row.client)?.desc;
      this.$confirm('确定撤销【'+targetValue+'】版本【'+row.version+'】吗？',{type: 'warning'})
        .then(_ => {
          reqRevokeVersion({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "撤销成功",
            });
            this.getVersionList();
          });
        }).catch(_ =>{})
    },
    handleUploadChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    handleUploadSuccess(response) {
      this.formData.downloadLink = response.data;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.id){
            reqUpdateVersion(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getVersionList();
            });
          } else {
            reqAddVersion(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getVersionList();
            });
          }
          this.dialogVisible = false;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
      this.fileList = [];
      this.$refs.formData.resetFields();
      this.formData = {
        id: null,
        client: null,
        version: null,
        releaseTime: null,
        releaseNotes: null,
        downloadLink: null,
        forceUpdate: false,
        state: 1
      };
    },
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

/* btn */
.subBtn {
  border: none;
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 40px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 16px;
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

.cancelBtn:hover {
  background-color: transparent;
}
</style>
