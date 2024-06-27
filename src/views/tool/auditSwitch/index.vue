<template>
  <div>
    <div style="margin-top: 30px;">
      <el-form label-width="150px" :model="formData" ref="formData">
        <el-form-item label="iOS版本：" style="margin-top: 50px;">
          <el-input v-model="formData.ios" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="Android版本：" style="margin-top: 50px;">
          <el-input v-model="formData.android" style="width: 250px"/>
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix" style="margin-top: 50px; margin-left: 115px;">
        <div class="addbtn" @click="submitForm">保存</div>
      </div>
    </div>
  </div>
</template>

<script>

import {reqGetAuditSwitchConfig, reqSetAuditSwitchConfig} from "@/api/config";

export default {
  data() {
    return {
      formData: {
        ios: null,
        android: null
      },
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      const result = await reqGetAuditSwitchConfig();
      this.formData = result.data.data;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          reqSetAuditSwitchConfig(this.formData).then(() => {
            this.$message({
              type: "success",
              message: "保存成功",
            });
            this.getScoreConfig();
          });
        }
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
</style>

