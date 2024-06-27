<template>
  <div>
    <div style="margin-top: 30px;">
      <el-form label-width="180px" :model="formData" ref="formData">
        <el-form-item label="签到K分：" style="margin-top: 50px;">
          <el-input-number v-model="formData.rewardsScore" controls-position="right" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="探索值：" style="margin-top: 50px;">
          <el-input-number v-model="formData.rewardsGrowth" controls-position="right" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="连续签到额外探索值：" style="margin-top: 50px;">
          <el-input-number v-model="formData.dailyRewardsExtraGrowth" controls-position="right" :min="0" :precision="0" />
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix" style="margin-top: 50px; margin-left: 130px;">
        <div class="addbtn" @click="submitForm">保存</div>
      </div>
    </div>
  </div>
</template>

<script>

import {reqGetSignInConfig, reqSetSignInConfig} from "@/api/signIn";

export default {
  data() {
    return {
      formData: {
        rewardsScore: 0,
        rewardsGrowth: 0,
        dailyRewardsExtraGrowth: 0
      },
    };
  },
  mounted() {
    this.getSignInConfig();
  },
  methods: {
    async getSignInConfig() {
      const result = await reqGetSignInConfig();
      this.formData = result.data.data;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          reqSetSignInConfig(this.formData).then(() => {
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

