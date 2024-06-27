<template>
  <div style="background-color: #171515">
    <el-card class="box-card">
      <div>
        <el-tag class="custom-tag">可分配K分：{{ totalScore }}</el-tag>
      </div>

      <!-- 修改星球信息（管理星球） -->
      <div style="padding-top: 15px;">
        <el-form
          :model="enterpriseForm"
          label-width="130px"
          :inline="false"
          size="normal"
        >
          <el-form-item label="企业头像：">
            <el-image style="width: 100px; height: 100px" :src="enterpriseForm.avatar"/>
          </el-form-item>

          <el-form-item label="企业品牌：" prop="nickname">
            <el-select v-model="enterpriseForm.enterpriseId" @change="handleChangeEnterprise" filterable>
              <el-option
                v-for="item in enterpriseList"
                :key="item.enterpriseId"
                :label="item.brandName"
                :value="item.enterpriseId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="剩余K分：">
            {{ enterpriseForm.usableScore }}
          </el-form-item>

          <el-form-item label="分配K分：">
            <el-input-number v-model="enterpriseForm.allocationScore" controls-position="right" :min="1"
                             :precision="0"/>
          </el-form-item>

          <el-form-item>
            <div style="display: flex;">
              <el-button
                class="subBtn"
                @click="allocation(enterpriseForm.enterpriseId, null, 1, enterpriseForm.allocationScore)"
              >分配
              </el-button>
            </div>
          </el-form-item>
        </el-form>

        <div style="width:801px;">
          <div style="height: 535px; overflow-y: auto;">
            <el-table :data="enterpriseAllocationRecord" stripe>
              <el-table-column fixed prop="brandName" label="品牌" width="200" align="center"/>
              <el-table-column prop="score" label="分配K分" width="200" align="center"/>
              <el-table-column prop="allocationTime" label="分配时间" width="200" align="center"/>
              <el-table-column prop="operateBy" label="操作人" width="200" align="center"/>
            </el-table>
          </div>

          <div class="block">
            <el-pagination
              layout="total, prev, pager, next"
              @current-change="handleChangeEnterprisePage"
              :page-size="enterprisePageQuery.pageSize"
              :total="enterpriseRecordTotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  reqAllocation,
  reqAllocationEnterpriseRecord,
  reqGetAllSelectEnterprise,
  reqGetScore
} from "@/api/scoreAllocation";

export default {
  data() {
    return {
      totalScore: 0,
      enterpriseList: [],
      enterpriseAllocationRecord: [],
      enterpriseRecordTotal: 0,
      enterprisePageQuery: {
        pageIndex: 1,
        pageSize: 10,
        enterpriseId: null,
      },
      enterpriseForm: {
        enterpriseId: '',
        avatar: '',
        usableScore: 0,
        allocationScore: 1,
      },
    };
  },
  mounted() {
    this.getScore();
    this.getAllSelectEnterprise();
    this.getAllocationEnterpriseRecord();
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
    // 获取可选择的企业
    async getAllSelectEnterprise() {
      try {
        const result = await reqGetAllSelectEnterprise(false);
        this.enterpriseList = result.data.data;
        this.handleChangeEnterprise(this.enterpriseForm.enterpriseId ? this.enterpriseForm.enterpriseId : this.enterpriseList[0].enterpriseId);
      } catch (e) {
      }
    },
    // 获取分配企业的K分记录
    async getAllocationEnterpriseRecord() {
      let param = `pageIndex=${this.enterprisePageQuery.pageIndex}&pageSize=${this.enterprisePageQuery.pageSize}`;
      if (this.enterprisePageQuery.enterpriseId) {
        param = param + `&enterpriseId=${this.enterprisePageQuery.enterpriseId}`;
      }
      const result = await reqAllocationEnterpriseRecord(param);
      this.enterpriseAllocationRecord = result.data.data.records;
      this.enterpriseRecordTotal = result.data.data.total;
    },
    handleChangeEnterprise(enterpriseId) {
      let list = this.enterpriseList.filter(enterprise => enterprise.enterpriseId === enterpriseId)
      this.enterpriseForm.enterpriseId = list[0].enterpriseId;
      this.enterpriseForm.avatar = list[0].avatar;
      this.enterpriseForm.usableScore = list[0].score;

      this.enterprisePageQuery.enterpriseId = enterpriseId;
      this.getAllocationEnterpriseRecord();
    },
    handleChangeEnterprisePage(pageIndex) {
      this.enterprisePageQuery.pageIndex = pageIndex;
      this.getAllocationEnterpriseRecord();
    },
    // 分配K分
    async allocation(enterpriseId, starId, allocationType, score) {
      try {
        let data = {
          "enterpriseId": enterpriseId,
          "starId": starId,
          "allocationType": allocationType,
          "score": score
        }
        await reqAllocation(data);
        this.$message({
          type: "success",
          message: "分配成功",
        });

        await this.getAllSelectEnterprise();
        this.enterprisePageQuery.pageIndex = 1;
        await this.getAllocationEnterpriseRecord();
        await this.getScore();
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
