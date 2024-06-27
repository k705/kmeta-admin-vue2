<template>
  <div>
      <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 20px;">
        {{dataSummary.total}} 个兑换码，已发放{{dataSummary.used}}，未发放{{dataSummary.unissued}}
      </div>

      <el-form :model="pageQuery" :rules="rules2" ref="pageQuery" :inline="true" style="margin-top: 25px; margin-left: 20px;">
        <el-form-item label="发放时间：">
          <el-date-picker
            v-model="pageQuery.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @blur="handleDateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号：" style="margin-left: 16px">
          <el-input v-model="pageQuery.receivePhone" style="width: 250px"/>
        </el-form-item>
        <el-button type="primary"  icon="el-icon-search"  @click="getPersonnelCodeList" round style="margin-left: 20px;"/>
        <el-button type="primary"  icon="el-icon-download" @click="exportSendRecord" round style="margin-left: 40px;">导出发放明细</el-button>
        <el-button type="primary"  icon="el-icon-upload"  @click="clickImport" round style="margin-left: 40px;">导入兑换码</el-button>
      </el-form>

      <div class="app-container" style="margin-right: 30px">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="usedCode" label="兑换码" width="200" align="center"/>
          <el-table-column prop="startTime" label="开始发放时间" width="180" align="center"/>
          <el-table-column prop="receivePhone" label="发放手机号" width="200" align="center"/>
          <el-table-column label="状态" width="150" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.state === 1"> 未发放 </el-tag>
              <el-tag v-if="row.state === 2" type="info"> 已发放 </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center"/>
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

    <el-dialog title="导入兑换码" :visible.sync="dialogVisible" top="2vh" :before-close="cancel" :close-on-click-modal="false" width="600px">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="开始发放时间：" prop="startTime" required>
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="upload"
            drag accept=".txt"
            action=""
            :auto-upload="false"
            :on-change="handleUploadCodeChange"
            :file-list="fileList">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <div v-if="formData.usedCodes && formData.usedCodes.length >= 1">
            <h3>兑换码预览：{{formData.usedCodes.length}}个</h3>
            <el-tag v-for="(item, index) in formData.usedCodes" :key="index" style="margin-right: 30px;" >{{item}}</el-tag>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-left: 150px; display: flex">
        <el-button class="subBtn" @click="submitForm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {reqGetDataSummary, reqGetPersonnelCodeList, reqImportUsedCode} from "@/api/coffeeVoucher";
import {getToken} from "@/utils/auth";

export default {

  data() {
    return {
      dialogVisible: false,
      fileList: [],
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
        receivePhone: null,
        date: [],
        startDate: null,
        endDate: null,
      },
      tableData: null,
      formData: {
        startTime: null,
        usedCodes: [],
      },
      dataSummary: {
        total: 0,
        unissued: 0,
        used: 0
      },
      rules: {
        startTime: [{required: true, message: "请选择开始发放时间", trigger: "change"}],
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        },
      },
    };
  },
  mounted() {
    this.getPersonnelCodeList();
  },
  methods: {
    async getPersonnelCodeList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
      if (this.pageQuery.startDate) {
        param += `&startDate=${this.pageQuery.startDate}`;
      }
      if (this.pageQuery.endDate) {
        param += `&endDate=${this.pageQuery.endDate}`;
      }
      if (this.pageQuery.receivePhone) {
        param += `&receivePhone=${this.pageQuery.receivePhone}`;
      }
      const result = await reqGetPersonnelCodeList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;

      const result2 = await reqGetDataSummary(param);
      this.dataSummary = result2.data.data;
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getPersonnelCodeList();
    },
    clickImport() {
      this.dialogVisible = true;
    },
    handleDateChange() {
      if (this.pageQuery.date && this.pageQuery.date.length === 0) {
        this.pageQuery.startDate = null;
        this.pageQuery.endDate = null;
      }else {
        // 在选择时间范围时触发的 change 事件
        this.pageQuery.startDate = this.pageQuery.date[0];
        this.pageQuery.endDate = this.pageQuery.date[1];
      }
      // 强制更新组件
      this.$forceUpdate();
    },
    exportSendRecord() {
      this.$refs.pageQuery.validate((valid) => {
        if (valid) {
          let param = `startDate=${this.pageQuery.startDate}&endDate=${this.pageQuery.endDate}`;

          // 目标路径
          const url = `${process.env.VUE_APP_BASE_API}` + '/promotionCode/exportSendRecord?' + param;

          // 请求头设置
          const headers = new Headers({
            'accessToken': getToken(),
          });

          // 发起请求
          fetch(url, {
            method: 'GET', // 请求方法
            headers: headers // 指定的请求头
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.blob(); // 将响应内容作为 Blob 对象返回
          }).then(blob => {
            let filename = "兑换码发放明细(" + this.pageQuery.startDate + "-" + this.pageQuery.endDate + ")";
            const url = window.URL.createObjectURL(new Blob([blob])); // 创建 Blob 对象的 URL
            const a = document.createElement('a');
            a.href = url;
            a.download = filename + '.xlsx'; // 指定下载文件的名称
            document.body.appendChild(a);
            a.click(); // 模拟点击下载链接
            window.URL.revokeObjectURL(url); // 释放 URL 对象
          })
            .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
            });
        }
      })
    },
    /** 提交按钮 */
    submitForm() {
      reqImportUsedCode(this.formData).then(() => {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.cancel();
        this.getPersonnelCodeList();
      });
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
      this.$refs.formData.resetFields();
      this.fileList = [];
      this.formData = {
        startTime: null,
        usedCodes: []
      };
    },
    handleUploadCodeChange(file, fileList) {
      this.fileList = fileList.slice(-1);

      if (fileList.length > 0) {
        // 获取选中的第一个文件
        const selectedFile = fileList[0];

        // 使用 FileReader 读取文件内容
        const reader = new FileReader();

        reader.onload = (e) => {
          // 读取文件内容
          const fileContent = e.target.result;

          // 将文件内容拆分为行
          const lines = fileContent.split('\n');

          // 将每行存储到数组中
          const fileContentArray = lines.map(line => line.trim());

          // 在此处你可以使用 fileContentArray 进行后续处理，例如将其存储到组件状态中
          console.log("File content array:", fileContentArray);
          this.formData.usedCodes = fileContentArray;
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
        this.formData.usedCodes = [];
      }
    },
  },
};
</script>

<style scoped>
</style>
