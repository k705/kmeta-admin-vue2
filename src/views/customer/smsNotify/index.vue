<template>
  <div>
    <div style="margin-top: 30px;">
      <el-form label-width="180px" :model="formData" ref="formData">
        <el-form-item label="用户类型：" style="margin-top: 50px;">
          <el-select v-model="formData.receiverType" placeholder="请选择">
            <el-option
              v-for="item in receiverTypeEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信模板：" style="margin-top: 50px;">
          <el-input v-model="formData.templateCode" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="发送规则：" style="margin-top: 50px;" v-if="formData.receiverType === 1 || formData.receiverType === 2">
          <div v-if="formData.receiverType === 1">
            <el-date-picker
              v-model="formData.auDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            前未活跃用户(不包含当天)
          </div>
          <div v-if="formData.receiverType === 2">
            <el-date-picker
              v-model="formData.auDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>后活跃用户(包含当天)
          </div>
        </el-form-item>
        <el-form-item label="手机号：" v-if="formData.receiverType === 3">
          <el-input
            v-model="formData.phones"
            type="textarea"
            style="width: 500px"
            :rows="7"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix" style="margin-top: 50px; margin-left: 130px;">
        <div class="addbtn" @click="submitForm">发送</div>
      </div>
    </div>
  </div>
</template>

<script>

import {reqSendSms} from "@/api/sms";

export default {
  data() {
    return {
      loading: true,
      formData: {
        receiverType: 0,
        auDate: null,
        phones: "",
        templateCode: "",
      },
      receiverTypeEnum: [
        {code: 0, desc: "所有"},
        {code: 1, desc: "非活跃用户"},
        {code: 2, desc: "活跃用户"},
        {code: 3, desc: "自定义"},
      ],
    };
  },
  mounted() {
    this.getInviteConfig();
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            target: 'body',
            width: '100%',
            height: '100%',
          });
          reqSendSms(this.formData).then(() => {
            this.$message({
              type: "success",
              message: "提交成功",
            });
            loading.close();
            this.getInviteConfig();
          }).catch(() => {
            loading.close();
          });
        }
      });
    },
  },
};
</script>

<style>
.el-loading-mask {
  /* 检查是否有限制大小的样式，如 width、height、max-width、max-height，如果有，可以将其删除或设置为合适的值 */
  /* 例如： */
  width: auto !important;
  height: auto !important;
  max-width: none !important;
  max-height: none !important;
}
</style>
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

