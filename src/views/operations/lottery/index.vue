<template>
  <div>
    <div
      slot="header"
      class="clearfix"
      style="margin-top: 20px; margin-left: 20px"
    >
      <div class="addbtn" @click="clickAdd">添加抽奖</div>
    </div>

    <div class="app-container" style="margin-top: 20px; margin-right: 30px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="activityTitle" label="抽奖主题" width="150" align="center"/>
        <el-table-column prop="usrScore" label="单抽K分" width="120" align="center"/>
        <el-table-column label="中奖概率" width="120" align="center">
          <template slot-scope="{ row }">
            {{ row.probability }}%
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="320" align="center">
          <template slot-scope="{ row }">
            {{ row.startTime }} -- {{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.state === 1"> 待发布 </el-tag>
            <el-tag v-if="row.state === 2" type="info"> 已发布 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="activityRule" label="活动规则" width="300" align="center" show-overflow-tooltip/>
        <el-table-column prop="createTime" label="创建时间" width="250" align="center"/>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state === 1" @click="clickUpdate(scope.row)" icon="el-icon-edit" type="text" size="small">编辑</el-button>
            <el-button v-if="scope.row.state === 1" @click="clickPrize(scope.row)" icon="el-icon-info" type="text" size="small">奖品设置</el-button>
            <el-button v-if="scope.row.state === 1" @click="clickPublish(scope.row)" icon="el-icon-s-promotion" type="text" size="small">发布</el-button>
            <el-button v-if="scope.row.state === 2" @click="clickRevoke(scope.row)" icon="el-icon-refresh-left" type="text" size="small">撤销</el-button>
            <el-button v-if="scope.row.state === 1" @click="clickDelete(scope.row)" icon="el-icon-delete" type="text" size="small">删除</el-button>
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
    <el-dialog title="K奖" :visible.sync="dialogVisible" top="2vh">
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="formData"
      >
        <el-form-item label="活动主题：" prop="activityTitle">
          <el-input
            v-model="formData.activityTitle"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="抽奖时间：" prop="effectiveTime" required>
          <el-date-picker
            v-model="formData.effectiveTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @blur="handleDateChange"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单次抽奖K分：" prop="usrScore">
          <el-input-number v-model="formData.usrScore" controls-position="right" :min="1" :precision="0" />
        </el-form-item>

        <el-form-item label="中奖概率(%)：" prop="probability">
          <el-input-number v-model="formData.probability" controls-position="right" :min="0" :max="100" :precision="0" />
        </el-form-item>
        <el-form-item label="活动规则图片：" prop="ruleImage">
          <div class="img_con" v-for="(i, index) in imgList" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 240px; height: 450px"
            ></el-image>
            <div class="overlay">
              <i
                class="el-icon-delete remove_img"
                @click="handleRemove(index)"
              ></i>
            </div>
          </div>
          <UploadImg
            v-show="imgList.length < 1"
            @get-url="getUrl"
            :module="uploadModule"
          />
        </el-form-item>
        <el-form-item label="活动规则：" prop="activityRule">
          <el-input
            type="textarea"
            v-model="formData.activityRule"
            rows="10"
            style="width: 600px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex">
        <el-button class="subBtn" @click="submitForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="K奖奖品" :visible.sync="prizeDialogVisible" top="2vh">
      <el-form class="stone" style="margin-left: 20px;">
        <el-form-item>
          <el-button @click="addPrize" type="success" icon="el-icon-plus" size="mini" circle />
        </el-form-item>
        <el-form-item v-for="(prize, index) in prizeList" :key="index">
          <el-input-number v-model="prize.rewardScoreMin" :min="1" :max="prize.rewardScoreMax" step-strictly size="mini" controls-position="right" style="width: 95px" />
          <span style="margin: 0 10px;">-</span>
          <el-input-number v-model="prize.rewardScoreMax" :min="prize.rewardScoreMin" step-strictly size="mini" controls-position="right" style="width: 95px" /> K分，
          <span style="margin: 0 10px;">权重:</span>
          <el-input-number v-model="prize.weight" :step="1" :min="1" step-strictly size="mini" controls-position="right" style="width:120px;" />
          <span style="margin: 0 10px;">， 奖品数量:</span>
          <el-input-number v-model="prize.prizeQuantity" @change="changeQuantity(index)" :step="1" :min="1" step-strictly size="mini" controls-position="right" style="width:140px;" />
          <span style="margin: 0 10px;">， 剩余库存:</span>
          <el-input-number v-model="prize.prizeResidue" :step="1" :min="1" :max="prize.prizeQuantity" step-strictly size="mini" controls-position="right" style="width:140px;" :disabled="!prize.id"/>
          <el-button @click="removePrize(index)" type="danger" icon="el-icon-delete" size="mini" style="margin-left: 15px;" circle />
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex">
        <el-button class="subBtn" @click="submitPrizeForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancelPrize">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqActivityCreate,
  reqActivityDel,
  reqActivityList,
  reqActivityPrizeList,
  reqActivityPublish,
  reqActivityRevoke,
  reqActivityUpdate,
  reqSetPrize,
} from "@/api/lottery";

export default {
  data() {
    return {
      uploadModule: "operations/draw",
      dialogVisible: false,
      prizeDialogVisible: false,
      imgList: [],
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: null,
      formData: {
        id: null,
        activityTitle: null,
        startTime: null,
        endTime: null,
        usrScore: 100,
        probability: 1,
        activityRule: null,
        effectiveTime: [],
        ruleImage: null,
      },
      // 奖品列表展示
      prizeList: [],
      activityDrawId: null,
      rules: {
        activityTitle: [
          { required: true, message: "请输入活动主题", trigger: "change" },
        ],
        effectiveTime: [
          { validator: this.validateEffectiveTime, trigger: "change" },
        ],
        activityRule: [
          { required: true, message: "请填写活动规则", trigger: "change" },
        ],
        ruleImage: [
          { required: true, message: "请上传规则图片", trigger: "change" },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        },
      },
    };
  },
  mounted() {
    this.getActivityList();
  },
  methods: {
    async getActivityList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
      const result = await reqActivityList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getActivityList();
    },
    clickAdd() {
      this.dialogVisible = true;
    },
    clickUpdate(row) {
      this.formData = {
        id: row.id,
        activityTitle: row.activityTitle,
        startTime: row.startTime,
        endTime: row.endTime,
        usrScore: row.usrScore,
        probability: row.probability,
        activityRule: row.activityRule,
        effectiveTime: [row.startTime, row.endTime],
        ruleImage: row.ruleImage,
      };
      this.dialogVisible = true;
    },
    clickPublish(row) {
      this.$confirm("是否确定发布？", { type: "warning" })
        .then((_) => {
          reqActivityPublish({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "发布成功",
            });
            this.getActivityList();
          });
        })
        .catch((_) => {});
    },
    clickRevoke(row) {
      this.$confirm("是否确定撤销下线？", { type: "warning" })
        .then((_) => {
          reqActivityRevoke({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.getActivityList();
          });
        })
        .catch((_) => {});
    },
    clickDelete(row) {
      this.$confirm("是否确定删除？", { type: "warning" })
        .then((_) => {
          reqActivityDel({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getActivityList();
          });
        })
        .catch((_) => {});
    },
    handleDateChange() {
      // 在选择时间范围时触发的 change 事件
      this.formData.startTime = this.formData.exchangeTime[0];
      this.formData.endTime = this.formData.exchangeTime[1];
      // 强制更新组件
      this.$forceUpdate();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            reqActivityUpdate(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getActivityList();
            });
          } else {
            reqActivityCreate(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getActivityList();
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
      this.formData = {
        id: null,
        activityTitle: null,
        startTime: null,
        endTime: null,
        usrScore: 100,
        probability: 1,
        activityRule: null,
        effectiveTime: [],
        ruleImage: null,
      };
    },
    validateEffectiveTime(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (value && value.length >= 2) {
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请选择活动时间")); // 长度不符合要求，验证失败
      }
    },
    clickPrize(row) {
      this.activityDrawId = row.id;
      this.getActivityPrizeList();
      this.prizeDialogVisible = true;
    },
    // 展示奖品列表
    async getActivityPrizeList() {
      try {
        const result = await reqActivityPrizeList(this.activityDrawId);
        this.prizeList = result.data.data;
      } catch (e) {}
    },
    changeQuantity(index){
      if (!this.prizeList[index].id){
        this.prizeList[index].prizeResidue = this.prizeList[index].prizeQuantity;
      }
      if (this.prizeList[index].prizeQuantity < this.prizeList[index].prizeResidue){
        this.prizeList[index].prizeResidue = this.prizeList[index].prizeQuantity;
      }
    },
    addPrize() {
      this.prizeList.push({ rewardScoreMin: 1, rewardScoreMax: 1, weight: 1, prizeQuantity: 1, prizeResidue: 1 });
    },
    removePrize(index) {
      this.prizeList.splice(index, 1);
    },
    submitPrizeForm() {
      let body = {'activityDrawId': this.activityDrawId, 'prizeList': this.prizeList}
      reqSetPrize(body).then(() => {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.cancelPrize();
      });
    },
    // 取消按钮
    cancelPrize() {
      this.prizeDialogVisible = false;
      this.prizeList = [];
      this.activityDrawId = null;
    },
    getUrl(e) {
      this.imgList.push(e);
      this.formData.ruleImage = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove(index) {
      this.imgList.splice(index, 1);
      this.formData.ruleImage = null;
    },
  },
};
</script>

<style scoped>
.addbtn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 38px;
  width: 120px;
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
