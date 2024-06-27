<template>
  <div>
    <div style="margin-top: 30px;">
      <el-form label-width="150px" :model="formData" ref="formData">
        <el-form-item label="矿石刷新时间(分)：" style="margin-top: 50px;">
          <el-input-number v-model="formData.oreRefreshTime" controls-position="right" :min="1" :precision="0" />
        </el-form-item>
        <el-form-item label="随机出现星球个数：" style="margin-top: 50px;">
          <el-input-number v-model="formData.homeStarNumber" controls-position="right" :min="1" :precision="0" />
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix" style="margin-top: 50px; margin-left: 115px;">
        <div class="addbtn" @click="submitForm">保存</div>
      </div>
    </div>
  </div>
</template>

<script>

import {reqGetStarConfig, reqSetStarConfig} from "@/api/config";

export default {
  data() {
    return {
      formData: {
        oreRefreshTime: 0,
        homeStarNumber: 0
      },
    };
  },
  mounted() {
    this.getStarConfig();
  },
  methods: {
    async getStarConfig() {
      const result = await reqGetStarConfig();
      this.formData = result.data.data;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          reqSetStarConfig(this.formData).then(() => {
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

