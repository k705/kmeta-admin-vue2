<template>
  <div style="background-color: #171515">
    <el-card class="box-card">
      <div>
        <el-tag class="custom-tag">可分配K分：{{ totalScore }}</el-tag>
      </div>

      <!-- 修改星球信息（管理星球） -->
      <div style="padding-top: 15px">
        <el-form
          :model="starForm"
          label-width="130px"
          :inline="false"
          size="normal"
        >
          <el-row :gutter="15">
            <el-col :span="7">
              <el-form-item label="企业头像：">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="enterpriseStarForm.avatar"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="企业品牌：" prop="nickname">
                <el-select
                  v-model="enterpriseStarForm.enterpriseId"
                  @change="handleChangeStarEnterprise"
                  filterable
                >
                  <el-option
                    v-for="item in starEnterpriseList"
                    :key="item.enterpriseId"
                    :label="item.brandName"
                    :value="item.enterpriseId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="企业K分：">
                {{ enterpriseStarForm.usableScore }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="15">
            <el-col :span="7">
              <el-form-item label="星球头像：">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="starForm.avatar"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="星球昵称：" prop="nickname">
                <el-select
                  v-model="starForm.starId"
                  @change="handleChangeStar"
                  filterable
                >
                  <el-option
                    v-for="item in starList"
                    :key="item.starId"
                    :label="item.nickname"
                    :value="item.starId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="星球K分：">
                {{ starForm.usableScore }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="分配K分：">
            <el-input-number
              v-model="starForm.allocationScore"
              controls-position="right"
              :min="1"
              :precision="0"
            />
          </el-form-item>

          <el-form-item>
            <div style="display: flex">
              <el-button
                class="subBtn"
                @click="
                  allocation(
                    enterpriseStarForm.enterpriseId,
                    starForm.starId,
                    2,
                    starForm.allocationScore
                  )
                "
                >分配
              </el-button>
            </div>
          </el-form-item>
        </el-form>

        <div style="width: 1001px; position: relative">
          <div style="height: 550px; overflow-y: auto">
            <el-table :data="starAllocationRecord" stripe>
              <el-table-column
                fixed
                prop="brandName"
                label="品牌"
                width="200"
                align="center"
              />
              <el-table-column
                fixed
                prop="starName"
                label="星球"
                width="200"
                align="center"
              />
              <el-table-column
                prop="score"
                label="分配K分"
                width="200"
                align="center"
              />
              <el-table-column
                prop="allocationTime"
                label="分配时间"
                width="200"
                align="center"
              />
              <el-table-column
                prop="operateBy"
                label="操作人"
                width="200"
                align="center"
              />
            </el-table>
          </div>
          <div class="block">
            <el-pagination
              layout="total, prev, pager, next"
              @current-change="handleChangeStarPage"
              :page-size="starPageQuery.pageSize"
              :total="starRecordTotal"
            >
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
  reqAllocationStarRecord,
  reqGetAllSelectEnterprise,
  reqGetScore,
  reqGetSelectStar,
} from "@/api/scoreAllocation";

export default {
  data() {
    return {
      loading: false,
      activeName: "first",
      totalScore: 0,
      starEnterpriseList: [],
      starList: [],
      starAllocationRecord: [],
      starRecordTotal: 0,
      starPageQuery: {
        pageIndex: 1,
        pageSize: 10,
        enterpriseId: null,
        starId: null,
      },
      enterpriseStarForm: {
        enterpriseId: null,
        avatar: null,
        usableScore: 0,
        allocationScore: 1,
      },
      starForm: {
        enterpriseId: null,
        starId: null,
        nickname: null,
        avatar: null,
        usableScore: 0,
        allocationScore: 1,
      },
    };
  },
  mounted() {
    this.getScore();
    this.getAllSelectStarEnterprise();
    this.getAllocationStarRecord();
  },
  methods: {
    // 获取分配K分
    async getScore() {
      try {
        const result = await reqGetScore();
        this.totalScore = result.data.data;
      } catch (e) {}
    },
    // 获取星球可选择的企业
    async getAllSelectStarEnterprise() {
      try {
        const result = await reqGetAllSelectEnterprise(true);
        this.starEnterpriseList = result.data.data;
        this.handleChangeStarEnterprise(
          this.enterpriseStarForm.enterpriseId
            ? this.enterpriseStarForm.enterpriseId
            : this.starEnterpriseList[0].enterpriseId
        );
      } catch (e) {}
    },
    // 获取可选择的星球
    async getSelectStar(enterpriseId) {
      const result = await reqGetSelectStar(enterpriseId);
      this.starList = result.data.data;
      if (this.starList.length >= 1) {
        this.starForm.starId = this.starList[0].starId;
        this.starForm.avatar = this.starList[0].avatar;
        this.starForm.usableScore = this.starList[0].score;
      } else {
        this.starForm.starId = null;
        this.starForm.avatar = "";
        this.starForm.usableScore = 0;
      }
    },
    // 获取星球分配记录
    async getAllocationStarRecord() {
      try {
        let param = `pageIndex=${this.starPageQuery.pageIndex}&pageSize=${this.starPageQuery.pageSize}`;
        if (this.starPageQuery.enterpriseId) {
          param = param + `&enterpriseId=${this.starPageQuery.enterpriseId}`;
        }
        if (this.starPageQuery.starId) {
          param = param + `&starId=${this.starPageQuery.starId}`;
        }
        const result = await reqAllocationStarRecord(param);
        this.starAllocationRecord = result.data.data.records;
        this.starRecordTotal = result.data.data.total;
      } catch (e) {}
    },
    handleChangeStarEnterprise(enterpriseId) {
      let list = this.starEnterpriseList.filter(
        (enterprise) => enterprise.enterpriseId === enterpriseId
      );
      this.enterpriseStarForm.enterpriseId = list[0].enterpriseId;
      this.enterpriseStarForm.avatar = list[0].avatar;
      this.enterpriseStarForm.usableScore = list[0].score;
      this.getSelectStar(enterpriseId);

      this.starPageQuery.enterpriseId = enterpriseId;
      this.getAllocationStarRecord();
    },
    handleChangeStar(starId) {
      let list = this.starList.filter((star) => star.starId === starId);
      this.starForm.starId = list[0].starId;
      this.starForm.avatar = list[0].avatar;
      this.starForm.usableScore = list[0].score;

      this.starPageQuery.starId = starId;
      this.getAllocationStarRecord();
    },
    handleChangeStarPage(pageIndex) {
      this.starPageQuery.pageIndex = pageIndex;
      this.getAllocationStarRecord();
    },
    // 分配K分
    async allocation(enterpriseId, starId, allocationType, score) {
      try {
        let data = {
          enterpriseId: enterpriseId,
          starId: starId,
          allocationType: allocationType,
          score: score,
        };
        await reqAllocation(data);
        this.$message({
          type: "success",
          message: "分配成功",
        });
        await this.getAllSelectStarEnterprise();
        await reqGetSelectStar(enterpriseId);
        this.handleChangeStar(starId);

        this.starPageQuery.pageIndex = 1;
        await this.getAllocationStarRecord();
        await this.getScore();
      } catch (e) {}
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
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}
</style>
