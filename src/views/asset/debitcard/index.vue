<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>结算卡总览</span>
      </div>

      <!-- 结算卡系列列表 -->
      <div v-show="!isStarShow">
        <div>
          <div class="addbtn" @click="open()">新增系列</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-top: 30px">
          <div
            class="debitCardSerieItem"
            v-for="debitCardSerieItem in debitCardSeriesList"
            :key="debitCardSerieItem.id"
          >
            <div class="inner">
              <div
                style="
                  width: 240px;
                  height: 16px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div style="font-size: 16px; font-weight: bold">
                  {{ debitCardSerieItem.seriesName }}
                </div>
                <div style="font-size: 12px">
                  结算卡数量：{{ debitCardSerieItem.goodsNum }}
                </div>
              </div>
              <div class="btn" @click="toDebitCardList(debitCardSerieItem)">
                管理系列
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 修改每个系列信息（管理系列） -->
      <div v-show="isStarShow">
        <el-tabs v-model="activeName" type="card">
          <!-- 星球管理 -->
          <el-tab-pane label="系列管理" name="first">
            <!-- 显示每个系列结算卡列表 -->
            <div style="display: flex; flex-wrap: wrap" v-show="isStarShow">
              <div
                class="debitCardItem"
                v-for="debitCardItem in debitCardList"
                :key="debitCardItem.id"
              >
                <div class="inner">
                  <div class="left">
                    <img
                      :src="debitCardItem.picture"
                      style="width: 120px; height: 120px"
                    />
                  </div>
                  <div class="right">
                    <div class="inner2">
                      <div class="top">
                        <div>门店使用:0张</div>
                        <div>电商使用:0张</div>
                      </div>
                      <div
                        style="
                          margin-top: 5px;
                          font-weight: bold;
                          font-size: 12px;
                        "
                      >
                        {{ debitCardItem.state == 1 ? "已上架" : "已下架" }}
                      </div>
                      <div style="margin-top: 13px; font-size: 10px">
                        创建时间：{{ debitCardItem.createTime }}
                      </div>

                      <div class="btn1" @click="toDebitCard(debitCardItem)">
                        修改结算卡
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="debitCardItem">
                <div class="inner">
                  <div class="left">
                    <div
                      class="img_con"
                      v-for="(i, index) in imgList"
                      :key="index"
                    >
                      <el-image
                        class="deduct_img"
                        :src="i"
                        :preview-src-list="[i]"
                      ></el-image>
                    </div>
                    <UploadImg v-show="imgList.length < 1" @get-url="getUrl" />
                  </div>
                  <div class="right">
                    <div class="inner2">
                      <div class="btn2" style="margin-top: 95px"  @click="toCreditCardSeries">
                        返回
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--
               -->
            <!-- 修改单个系列的结算卡 -->
            <el-dialog
              :visible.sync="dialogFormVisible"
              :before-close="handleClose"
              :title="title"
            >
              <el-form
                :model="addOrUpdateDebitCardForm"
                ref="addOrUpdateDebitCardForm"
                :rules="rules"
                label-width="150px"
                :inline="false"
                size="normal"
              >
                <!-- 第一行 -->
                <!-- <el-row > -->
                <!-- 第一列 -->

                <!-- <el-col > -->
                <el-form-item label="产品名称" prop="goodsName">
                  <el-input
                    v-model="addOrUpdateDebitCardForm.goodsName"
                    style="width: 160px"
                  ></el-input>
                </el-form-item>
                <!-- </el-col> -->
                <!-- 第二列 -->

                <!-- </el-col> -->
                <!-- 第三列 -->

                <!-- <el-col > -->
                <el-form-item label="K分" prop="score" :step="2">
                  <el-input-number
                    v-model="addOrUpdateDebitCardForm.score"
                    @change="scoreChange"
                    @blur="scoreChange"
                    :step="100"
                    step-strictly
                    style="width: 160px"
                  />
                </el-form-item>
                <!-- </el-col> -->
                <!-- 第四列 -->
                <!-- <el-col > -->
                <el-form-item label="有效时间" prop="effectiveTime">
                  <el-date-picker
                    v-model="addOrUpdateDebitCardForm.effectiveTime"
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
                <el-form-item label="抵扣" prop="amount">
                  {{ addOrUpdateDebitCardForm.amount }} 元
                </el-form-item>
                <el-form-item label="使用规范" prop="useRange">
                  <el-input
                    v-model="addOrUpdateDebitCardForm.useRange"
                    type="textarea"
                    style="width: 350px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="使用规则" prop="useRule">
                  <el-input
                    v-model="addOrUpdateDebitCardForm.useRule"
                    type="textarea"
                    style="width: 350px"
                  ></el-input>
                </el-form-item>
                <!-- </el-col> -->
                <!-- 第三列 -->
                <!-- <el-col > -->

                <el-form-item label="搜索关键字" prop="keywords">
                  <el-input
                    v-model="addOrUpdateDebitCardForm.keywords"
                    style="width: 200px"
                  ></el-input>
                </el-form-item>
                <!-- </el-col> -->
                <!-- 第四列 -->
                <!-- <el-col > -->
                <el-form-item label="APP链接" prop="jumpLink">
                  <el-input
                    v-model="addOrUpdateDebitCardForm.jumpLink"
                    style="width: 260px"
                  ></el-input>
                </el-form-item>
                <!-- </el-col>
                </el-row> -->
              </el-form>
              <div style="display: flex;margin-left: 150px;margin-top: 50px;">
                <el-button
                  class="subBtn"
                  @click="handleAddDebitCardSubmit('addOrUpdateDebitCardForm')"
                >提交</el-button
                >
                <el-button @click="getShelf" class="cancelBtn" v-if="isUp === 2"
                >上架结算卡</el-button
                >
                <el-button @click="getDelist" class="cancelBtn" v-if="isUp === 1"
                >下架结算卡</el-button
                >
                <el-button
                  @click="
                    handleDeleteDebitCardSubmit('addOrUpdateDebitCardForm')
                  " class="cancelBtn"
                >删除结算卡</el-button
                >
              </div>
            </el-dialog>
          </el-tab-pane>

          <!-- <div
            class="btn2"
            style="margin-top: 10px; margin-left: 18px"
            @click="toCreditCardSeries"
          >
            返回
          </div> -->
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  reqDebitCardSeriesList,
  reqAddDebitCard,
  reqAddDebitCardSeries,
  reqDebitCardList,
  reqUpdateDebitCard,
  reqDeleteDebitCard,
  reqDelist,
  reqShelf,
} from "@/api/goods";
export default {
  data() {
    return {
      imgList: [],
      loading: false,
      activeName: "first",
      debitCardSeriesList: null,
      id: "",
      seriesId: "",
      //单个系列计算卡列表
      debitCardList: null,
      // 添加结算卡
      addOrUpdateDebitCardForm: {
        score: 100, //兑换需要的K分		true
        amount: 1, //抵扣金额		true
        effectiveDays: "", //兑换后有效天数		false
        endTime: "", //有效时间- 结束		false
        startTime: "", //有效时间- 开始		false
        goodsName: "", //商品名称		true
        keywords: "", //搜索关键字		true
        picture: "", //图片		true
        seriesId: "", //系列id		true
        useRange: "", //使用范围		true
        useRule: "", //使用规则
        jumpLink: "", //跳转链接,
        id: "", //商品id
        effectiveTime: [], //有效时间
      },
      // 是否上架
      isUp: "",
      // 弹出层标题
      title: "",
      dialogFormVisible: false,

      rules: {
        effectiveTime: [
          { validator: this.validateEffectiveTime, trigger: "change" }
        ],
        goodsName: [{ required: true, message: "商品名称", trigger: "change" }],
        score: [
          { required: true, message: "兑换需要的K分", trigger: "change" },
        ],
        useRange: [{ required: true, message: "使用范围", trigger: "change" }],
        useRule: [{ required: true, message: "使用规则", trigger: "change" }],
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        }
      },
      //分页的页码数据
      page: 1,
      limit: 7,
      totalElements: 0, //总页数
      jumpPage: null,
      isStarShow: false,
    };
  },
  mounted() {
    this.getDebitCardSeriesList();
  },
  methods: {
    validateEffectiveTime(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (value && value.length >= 2) {
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请选择时间范围")); // 长度不符合要求，验证失败
      }
    },
    /**
     * 结算卡系列————————————————————————————————————————————
     */
    // 展示结算卡系列列表
    async getDebitCardSeriesList() {
      try {
        const result = await reqDebitCardSeriesList();
        this.debitCardSeriesList = result.data.data;
      } catch (e) {}
    },

    //添加结算卡系列弹出框
    open() {
      this.$prompt("请输入结算卡名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          this.getAddDebitCardSeries(value);
          this.$message({
            type: "success",
            message: "添加成功",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 添加结算卡系列
    async getAddDebitCardSeries(seriesName) {
      try {
        const data = { seriesName };
        await reqAddDebitCardSeries(data);
        await this.getDebitCardSeriesList();
      } catch (e) {}
    },

    // 点击显示管理结算卡
    toDebitCardList(debitCardSerieItem) {
      this.isStarShow = true;
      this.seriesId = debitCardSerieItem.id;
      this.getDebitCardList();
    },

    /**
     * 一个系列结算卡————————————————————————————————————————————
     */

    // 表单重置
    reset() {
      this.addOrUpdateDebitCardForm = {
        amount: 1, //抵扣金额		true
        effectiveDays: "", //兑换后有效天数		false
        endTime: "", //有效时间- 结束		false
        startTime: "", //有效时间- 开始		false
        goodsName: "", //商品名称		true
        keywords: "", //搜索关键字		true
        picture: "", //图片		true
        score: 100, //兑换需要的K分		true
        seriesId: this.seriesId, //系列id		true
        useRange: "", //使用范围		true
        useRule: "", //使用规则
        jumpLink: "", //跳转链接,
        id: "", //商品id
        effectiveTime: [], //有效时间
      };
    },
    scoreChange() {
      this.addOrUpdateDebitCardForm.amount =
        this.addOrUpdateDebitCardForm.score / 100;
    },
    handleDateChange(value) {
      // 在选择时间范围时触发的 change 事件
      this.addOrUpdateDebitCardForm.startTime =
        this.addOrUpdateDebitCardForm.effectiveTime[0];
      this.addOrUpdateDebitCardForm.endTime =
        this.addOrUpdateDebitCardForm.effectiveTime[1];

      // 强制更新组件
      this.$forceUpdate();
    },
    // 展示结算卡(每个系列单个列表）列表
    async getDebitCardList() {
      try {
        const result = await reqDebitCardList(this.seriesId);
        console.log("debitCardList", result);
        this.debitCardList = result.data.data;
      } catch (e) {}
    },

    // 点击显示管理结算卡
    toDebitCard(debitCardItem) {
      this.dialogFormVisible = true;
      this.id = debitCardItem.id;
      this.isUp = debitCardItem.state

      this.addOrUpdateDebitCardForm = {
        amount: debitCardItem.amount, //抵扣金额		true
        effectiveDays: debitCardItem.effectiveDays, //兑换后有效天数		false
        endTime: debitCardItem.endTime, //有效时间- 结束		false
        startTime: debitCardItem.startTime, //有效时间- 开始		false
        goodsName: debitCardItem.goodsName, //商品名称		true
        keywords: debitCardItem.keywords, //搜索关键字		true
        picture: debitCardItem.picture, //图片		true
        score: debitCardItem.score, //兑换需要的K分		true
        seriesId: this.seriesId, //系列id		true
        useRange: debitCardItem.useRange, //使用范围		true
        useRule: debitCardItem.useRule, //使用规则
        jumpLink: debitCardItem.jumpLink, //跳转链接,
        id: debitCardItem.id, //商品id
      };
      this.addOrUpdateDebitCardForm.effectiveTime = [debitCardItem.startTime, debitCardItem.endTime];
      this.title = "修改结算卡";
    },

    //upload函数
    getUrl(e) {
      this.imgList.push(e);
      this.dialogFormVisible = true;
      this.title = "添加结算卡";
      this.reset();
      this.clearData();
      this.addOrUpdateDebitCardForm.picture = e;
    },

    cancelImg(idx) {
      this.imgList.splice(idx, 1);
    },

    clearData() {
      this.imgList = [];
      this.$refs.addOrUpdateDebitCardForm.resetFields();
      // this.addOrUpdateDebitCardForm = {}
    },

    // 关闭添加结算卡的对话框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.clearData();
          done();
        })
        .catch((_) => {});
    },

    // 提交增加的结算卡
    async handleAddDebitCardSubmit(addOrUpdateDebitCardForm) {
      await this.$refs["addOrUpdateDebitCardForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.addOrUpdateDebitCardForm.id) {
            reqUpdateDebitCard(this.addOrUpdateDebitCardForm).then(() => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.dialogFormVisible = false;
                this.getDebitCardList();
              }
            );
          } else {
            reqAddDebitCard(this.addOrUpdateDebitCardForm).then(() => {
              this.$message({
                type: "success",
                message: "创建成功!",
              });
              this.imgList = [];
              this.dialogFormVisible = false;
              this.getDebitCardList();
            });
          }
        }
      });
    },

    // 点击返回结算卡系列页面
    toCreditCardSeries() {
      this.isStarShow = false;
    },

    // 删除结算卡
    async handleDeleteDebitCardSubmit() {
      this.dialogFormVisible = false;

      await reqDeleteDebitCard({ id: this.addOrUpdateDebitCardForm.id });
      await this.getDebitCardList();
    },

    // 下架结算卡
    async getDelist() {
      try {
        await reqDelist({id:this.id});
        this.dialogFormVisible = false;
        await this.getDebitCardList();

        this.$message({
          message: '下架成功',
          type: "info"
        })
      } catch (e) {}
    },

    // 上架结算卡
    async getShelf() {
      try {
        await reqShelf({id:this.id});
        this.dialogFormVisible = false;
        await this.getDebitCardList();
        this.$message({
          message: '上架成功',
          type: "info"
        })
      } catch (e) {}
    },
    /**
     *
     * @param 页码部分
     */
    // 页码改变执行的函数

    handleCurrentChange(e) {
      this.page = e;
      this.getDebitCardList();
    },
    //显示条数执行的函数
    handleSizeChange(e) {
      this.limit = e;
      this.getDebitCardList();
    },
    // 跳转页面
    changejump() {
      this.page = +this.jumpPage;
      this.getDebitCardList();
      this.jumpPage = null;
    },
    // 跳转到创建星球页面
    jumpToStar() {
      this.$router.push("/manage/star");
    },
    // 取消创建跳转到管理星球页面
    jumpToManage() {
      this.$router.push("/manage");
      this.isStarShow = false;
    },
  },
};
</script>

<style scoped>
.cl-cc >>> .el-form-item__content {
  display: flex;
}

.img_container {
  display: flex;
}
.img_con {
  position: relative;
  display: flex;
}
.deduct_img {
  width: 120px;
  height: 120px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.remove_img {
  position: absolute;
  right: 5px;
  top: -5px;
  color: red;
  cursor: pointer;
}

.debitCardSerieItem {
  width: 270px;
  height: 85px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 29px;

  /*margin-bottom: 30px; */
  border: 1px solid transparent;
  border-radius: 10px;
  border-image: linear-gradient(to right, #5924ff, #20dfff);
  border-image-slice: 1;
}

.debitCardSerieItem .inner {
  height: 54px;
  width: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* border: #20dfff 1px solid; */
}
.debitCardSerieItem .right {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

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
.debitCardSerieItem .btn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 24px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
  /* justify-content: space-between; */
}
.debitCardItem {
  width: 270px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 10px;
  border-image: linear-gradient(to right, #5924ff, #20dfff);
  border-image-slice: 1;
  margin-left: 17px;
  margin-bottom: 20px;
}
/* .upload {
  width: 270px;
  height: 150px;
  display: flex;
  justify-content: space-between;
  border: 1px solid transparent;
  border-radius: 10px;
  border-image: linear-gradient(to right, #5924ff, #20dfff);
  border-image-slice: 1;
  margin-left: 17px;
} */
.debitCardItem .inner {
  display: flex;
  justify-content: space-between;
  width: 250px;
  height: 120px;
}

.debitCardItem .left {
  width: 120px;
  height: 120px;
}



.debitCardItem .inner .right {
  justify-content: flex-start;
  align-items: center;
  display: flex;
  flex-direction: column;

  width: 120px;
  height: 120px;
}
.debitCardItem .inner .right .inner2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* background: #20dfff; */
  width: 110px;
  /* height: 110px; */
}
.debitCardItem .inner .right .inner2 .top {
  font-size: 12px;
}
/* .debitCardItem .right .top {
  display: flex;
  justify-content: space-between;
} */
.debitCardItem .btn1 {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 25px;
  width: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 12px;
  color: #ffffff;
  margin-top: 12px;
  font-weight: bold;
}

.btn2 {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 25px;
  width: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
}
.starmanage {
  display: flex;
}

.starmanage .middle {
  display: flex;
  flex-direction: column;
  margin-left: 50px;
}

.stone .el-input {
  width: 60px;
  margin-right: 10px;
  margin-left: 10px;
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
.el-pagination {
  position: relative;
}
.el-pagination .pageUnit {
  position: absolute;
  position: absolute;
  bottom: 7px;
  right: -13px;
}
.el-pagination /deep/ .el-pager li {
  border: 1px solid #ccc;
  margin: 0px 3px;
}

.el-pagination /deep/ .one .el-input__inner {
  width: 48px;
  height: 30px;
}
::v-deep .el-textarea__inner {
  resize: none;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
