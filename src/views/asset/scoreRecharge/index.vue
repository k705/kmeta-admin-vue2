<template>
  <div style="background-color: #171515">
    <el-card class="box-card">
      <div>
        <el-tag class="custom-tag">可分配K分：{{ totalScore }}</el-tag>
      </div>

      <div style="padding-top: 15px;">
        <el-form
          :model="rechargeForm"
          label-width="130px"
          :inline="false"
          size="normal"
        >
          <el-form-item label="充入K分池：">
            <el-input-number v-model="rechargeForm.score" controls-position="right" :min="1" :precision="0"/>
          </el-form-item>

          <el-form-item label="备注：" prop="story">
            <el-input
              type="textarea"
              v-model="rechargeForm.remark"
              rows="5"
              style="width: 500px"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <div style="display: flex;">
              <el-button
                class="subBtn"
                @click="submitRecharge">充值
              </el-button>
            </div>
          </el-form-item>
        </el-form>

        <div style="width:1201px;">
          <div style="height: 710px; overflow-y: auto;">
            <el-table :data="scoreRechargeRecord" stripe>
              <el-table-column fixed prop="username" label="用户名" width="200" align="center"/>
              <el-table-column fixed label="头像" width="200" align="center">
                <template slot-scope="{ row }">
                  <img :src="row.avatar" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%;">
                </template>
              </el-table-column>
              <el-table-column prop="score" label="K分" width="200" align="center"/>
              <el-table-column prop="inTypeDesc" label="类型" width="200" align="center"/>
              <el-table-column prop="createTime" label="入池时间" width="200" align="center"/>
              <el-table-column prop="remark" label="备注" width="200" align="center"/>
            </el-table>
          </div>
          <div class="block">
            <el-pagination
              layout="total, prev, pager, next"
              @current-change="handleChangePage"
              :page-size="pageQuery.pageSize"
              :total="recordTotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {reqGetScore, reqRecharge, reqScoreRechargeRecord} from "@/api/scoreAllocation";

export default {
  data() {
    return {
      totalScore: 0,
      recordTotal: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 8,
      },
      scoreRechargeRecord: [],
      rechargeForm: {
        score: 1,
        remark: null
      }
    };
  },
  mounted() {
    this.getScore();
    this.getScoreRechargeRecord();
  },
  methods: {
    // 获取分配K分
    async getScore() {
      try {
        const result = await reqGetScore();
        this.totalScore = result.data.data;
      } catch (e) {
      }
    },
    handleChangePage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getScoreRechargeRecord();
    },
    // 获取分配K分充值记录
    async getScoreRechargeRecord() {
      try {
        let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
        const result = await reqScoreRechargeRecord(param);
        this.scoreRechargeRecord = result.data.data.records;
        this.recordTotal = result.data.data.total;
      } catch (e) {
      }
    },
    // 充值
    async submitRecharge() {
      try {
        await reqRecharge(this.rechargeForm);
        this.$message({
          type: "success",
          message: "充入成功",
        });
        this.rechargeForm = {
          score: 1,
          remark: null
        }
        await this.getScore();
        await this.getScoreRechargeRecord();
      } catch (e) {
      }
    },
  },
};
</script>

<style scoped>
.custom-tag {
  font-weight: bold;
  font-size: 20px;
  padding-top: 10px; /* 上边距，根据需要调整 */
  padding-bottom: 10px; /* 下边距，根据需要调整 */
  padding-left: 15px; /* 左边距，根据需要调整 */
  padding-right: 15px; /* 右边距，根据需要调整 */
  height: auto; /* 设置标签的高度为自动，以适应内容 */
  box-sizing: border-box; /* 使用border-box模型，确保padding不会导致标签大小增加 */
}

.subBtn {
  border: none;
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 40px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}
</style>
