<template>
  <div>
    <div style="margin-top: 30px;">
      <el-form label-width="150px" :model="formData" ref="formData">
        <el-form-item label="MAU/K分：" style="margin-top: 50px;">
          <el-input-number v-model="formData.singleMauScore" controls-position="right" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="用户每日K分上限：" style="margin-top: 50px;">
          <el-input-number v-model="formData.dayScoreLimit" controls-position="right" :min="0" :precision="0" />
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix" style="margin-top: 50px; margin-left: 115px;">
        <div class="addbtn" @click="submitForm">保存</div>
      </div>
    </div>
  </div>
</template>

<script>

import {reqGetScoreConfig, reqSetScoreConfig} from "@/api/score";

export default {
  data() {
    return {
      formData: {
        singleMauScore: 0,
        dayScoreLimit: 0
      },
    };
  },
  mounted() {
    this.getScoreConfig();
  },
  methods: {
    async getScoreConfig() {
      const result = await reqGetScoreConfig();
      this.formData = result.data.data;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          reqSetScoreConfig(this.formData).then(() => {
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

