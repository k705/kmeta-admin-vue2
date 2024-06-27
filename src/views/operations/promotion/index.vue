<template>
  <div>
      <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 20px;">
        <div class="addbtn" @click="clickAdd">添加人员</div>
      </div>

      <el-form :model="pageQuery" :inline="true" style="margin-top: 35px; margin-left: 20px;">
        <el-form-item label="地推时间：">
          <el-date-picker
            v-model="pageQuery.dates"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="handleDateChange"
            :disabled = "formData.state === 2"
          >
          </el-date-picker>
        </el-form-item>
        <el-button type="primary"  icon="el-icon-search"  @click="getPersonnelList" round style="margin-left: 40px;"/>
        <el-button type="primary"  icon="el-icon-download"  @click="exportInviteRecord" round style="margin-left: 40px;">导出邀请明细</el-button>
      </el-form>

      <div class="app-container" style="margin-top: 20px; margin-right: 30px">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="jobNumber" label="工号/手机号" width="200" align="center"/>
          <el-table-column prop="fullName" label="姓名" width="180" align="center"/>
          <el-table-column prop="pv" label="访问量" width="200" align="center"/>
          <el-table-column prop="dailyLimit" label="日限额" width="200" align="center"/>
          <el-table-column prop="inviteNum" label="邀请人数" width="200" align="center"/>
          <el-table-column label="状态" width="150" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.state === 1"> 推广中 </el-tag>
              <el-tag v-if="row.state === 2" type="info"> 停止推广 </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center"/>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.state === 1" @click="clickQrCode(scope.row)" icon="el-icon-edit" type="text" size="small">生成二维码</el-button>
              <el-button v-if="scope.row.state === 1" @click="clickStop(scope.row)" icon="el-icon-stopwatch" type="text" size="small">停止推广</el-button>
              <el-button v-if="scope.row.state === 2" @click="clickEnable(scope.row)" icon="el-icon-s-open" type="text" size="small">继续推广</el-button>
              <el-button v-if="scope.row.state === 2" @click="clickDelete(scope.row)" icon="el-icon-delete" type="text" size="small">删除</el-button>
              <el-button @click="exportInviteRecord(scope.row)" icon="el-icon-download" type="text">导出邀请明细</el-button>
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
    <el-dialog title="人员信息" :visible.sync="dialogVisible" top="10vh" >
      <el-form label-width="120px" :model="formData" ref="formData">
        <el-form-item label="工号/手机号：" prop="jobNumber">
          <el-input v-model="formData.jobNumber" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="fullName">
          <el-input v-model="formData.fullName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="日限额：">
          <el-input-number
            v-model="formData.dailyLimit"
            controls-position="right"
            :min="1"
            :precision="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex;">
        <el-button class="subBtn" @click="submitForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="推广二维码" :visible.sync="qrCodeDialogVisible" top="10vh" width="500px" :close-on-click-modal="false">
      <el-form label-width="120px" :model="qrCodeFormData" :rules="rules" ref="qrCodeFormData">
        <el-form-item label="网站：" prop="website">
          <el-input v-model="qrCodeFormData.website" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="有效时间(小时)：">
          <el-input-number v-model="qrCodeFormData.effectiveHours" controls-position="right" :min="1" :precision="0"/>
        </el-form-item>
        <div v-if="promotionLink" style="margin-left: 80px">
          <vue-qr
            ref="qrCode"
            :text="promotionLink"
            :logoSrc="logoSrc"
            color-dark="black"
            width="200"
            height="200"
          ></vue-qr>
        </div>
      </el-form>
      <div slot="footer" style="display: flex; margin-left: 80px">
        <el-button class="subBtn" @click="generateQrCode">生 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import logo from './logo.png'
import VueQr from 'vue-qr'
import {
  reqAddPersonnel,
  reqDeactivate,
  reqDelete,
  reqEnable,
  reqGenerateQrCode,
  reqGetPersonnelList,
  reqUpdatePersonnel
} from "@/api/promotion";
import {getToken} from "@/utils/auth";

export default {
  components:{
    VueQr,
  },
  data() {
    return {
      logoSrc: "",
      dialogVisible: false,
      qrCodeDialogVisible: false,
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
        jobNumber: null,
        startDate: "",
        endDate: "",
        dates: [],
      },
      tableData: null,
      formData: {
        id: null,
        jobNumber: null,
        fullName: null,
        dailyLimit: 50
      },
      qrCodeFormData: {
        id: null,
        effectiveHours: 1,
        website: null,
        promotionLink: null
      },
      promotionLink: null,
      rules: {
        website: [{required: true, message: "请输入网站网址", trigger: "change"}],
      },
    };
  },
  mounted() {
    this.logoSrc = logo;
    this.getPersonnelList();
  },
  methods: {
    async getPersonnelList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
      if (this.pageQuery.startDate){
        param = param + `&startDate=${this.pageQuery.startDate}`;
      }
      if (this.pageQuery.endDate){
        param = param + `&endDate=${this.pageQuery.endDate}`;
      }
      if (this.pageQuery.client){
        param = param + `&jobNumber=${this.pageQuery.jobNumber}`;
      }
      const result = await reqGetPersonnelList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;
    },
    handleDateChange() {
      // 在选择时间范围时触发的 change 事件
      this.pageQuery.startDate = this.pageQuery.dates[0];
      this.pageQuery.endDate = this.pageQuery.dates[1];
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getPersonnelList();
    },
    clickAdd() {
      this.dialogVisible = true;
    },
    clickUpdate(row) {
      this.formData = {
        id: row.id,
        jobNumber: row.jobNumber,
        fullName: row.fullName
      };
      this.dialogVisible = true;
    },
    clickQrCode(row) {
      this.qrCodeFormData = {
        id: row.id,
        effectiveHours: 1
      };
      this.qrCodeDialogVisible = true;
    },
    clickStop(row) {
      this.$confirm("是否确定停止推广？", { type: "warning" })
        .then((_) => {
          reqDeactivate({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "提交成功",
            });
            this.getPersonnelList();
          });
        })
        .catch((_) => {});
    },
    clickEnable(row) {
      this.$confirm("是否确定继续推广？", { type: "warning" })
        .then((_) => {
          reqEnable({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "提交成功",
            });
            this.getPersonnelList();
          });
        })
        .catch((_) => {});
    },
    clickDelete(row) {
      this.$confirm("是否确定删除？", { type: "warning" })
        .then((_) => {
          reqDelete({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getPersonnelList();
          });
        })
        .catch((_) => {});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.id){
            reqUpdatePersonnel(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getPersonnelList();
            });
          } else {
            reqAddPersonnel(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getPersonnelList();
            });
          }
          this.dialogVisible = false;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
      this.$refs.formData.resetFields();
      this.taskForm = {
        id: null,
        jobNumber: null,
        fullName: null
      };
    },
    generateQrCode() {
      this.$refs.qrCodeFormData.validate((valid) => {
        if (valid) {
          reqGenerateQrCode(this.qrCodeFormData.id, this.qrCodeFormData.effectiveHours).then((result) => {
            this.promotionLink = this.qrCodeFormData.website + "?p=" + result.data.data;
          });
        }
      })
    },
    exportInviteRecord(row) {
      let param = "";
      if (this.pageQuery.startDate){
        param = param + `&startDate=${this.pageQuery.startDate}`;
      }
      if (this.pageQuery.endDate){
        param = param + `&endDate=${this.pageQuery.endDate}`;
      }
      if (row.id){
        param = param + `&jobNumber=${row.jobNumber}`;
      }
      // 目标路径
      const url = `${process.env.VUE_APP_BASE_API}` + '/dataCollect/exportInviteRecord?' + param;

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
        let filename = "地推邀请明细";
        if (row.id){
          filename = row.fullName + "-" + filename;
        }
        if (this.pageQuery.startDate && this.pageQuery.endDate){
          filename = filename + "(" + this.pageQuery.startDate + "-" + this.pageQuery.endDate + ")";
        }
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
