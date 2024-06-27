<template>
  <div>
    <div style="margin-top: 30px;">
      <el-form label-width="180px" :model="formData" ref="formData">
        <el-form-item label="邀请每人得K分：" style="margin-top: 50px;">
          <el-input-number v-model="formData.apieceScore" controls-position="right" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="邀请每人得区块配额：" style="margin-top: 50px;">
          <el-input-number v-model="formData.apieceBlock" controls-position="right" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="邀请规则：" style="margin-top: 50px;">
          <el-input type="textarea" v-model="formData.inviteRule" rows="7" style="width: 500px"/>
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix" style="margin-top: 50px; margin-left: 130px;">
        <div class="addbtn" @click="submitForm">保存</div>
      </div>
    </div>
  </div>
</template>

<script>

import {reqGetInviteConfig, reqSetInviteConfig} from "@/api/config";

export default {
  data() {
    return {
      formData: {
        apieceScore: 0,
        apieceBlock: 0,
        inviteRule: null,
      },
    };
  },
  mounted() {
    this.getInviteConfig();
  },
  methods: {
    async getInviteConfig() {
      const result = await reqGetInviteConfig();
      this.formData = result.data.data;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          reqSetInviteConfig(this.formData).then(() => {
            this.$message({
              type: "success",
              message: "保存成功",
            });
            this.getInviteConfig();
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

