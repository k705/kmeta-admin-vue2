<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="addbtn" @click="toAddDebitCard">新增结算卡推荐</div>
      </div>

      <!-- 结算卡推荐列表 -->

      <div style="display: flex; flex-wrap: wrap">
        <div
          class="debitCardRecommend"
          v-for="debitCardRecommend in debitCardRecommendedList"
          :key="debitCardRecommend.id"
        >
          <div class="inner">
            <div class="left">
              <img
                :src="debitCardRecommend.picture"
                style="width: 120px; height: 120px"
              />
            </div>
            <div class="right">
              <div class="inner2">
                <div class="top">
                  <div>{{ debitCardRecommend.goodsNam }}</div>
                  <div>已推荐:0天</div>
                  <div style="margin-top: 5px; ">剩余期限:0天</div>
                </div>

                <div style="margin-top: 32px; font-size: 10px">
                  创建时间：{{ debitCardRecommend.startTime }}
                </div>

                <div class="btn1" @click="toDebitCard(debitCardRecommend)">
                  查看结算卡推荐
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
          :model="addOrUpdateDebitCardRecommended"
          ref="addOrUpdateDebitCardRecommended"
          :rules="rules"
          label-width="150px"
          :inline="false"
          size="normal"
        >
          <el-form-item label="选择企业">
            <el-select
              placeholder="请选择企业"
              :disabled="isdisabled1"
              v-model="addOrUpdateDebitCardRecommended.enterprise"
              @change="getdefaults1"
            >
              <el-option
                v-for="item in enterpriseOptions"
                :key="item.enterpriseId"
                :label="item.brandName"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算卡">
            <el-select
              :disabled="isdisabled2"
              v-model="addOrUpdateDebitCardRecommended.debitCard"
              placeholder="请选择结算卡"
              @change="getdefaults"
            >
              <el-option
                v-for="item in debitCardOptions"
                :key="item.id"
                :label="item.goodsName"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="奖品权重" prop="priority">
            <el-input
              :disabled="isdisabled3"
              v-model="addOrUpdateDebitCardRecommended.priority"
              style="width: 160px"
            ></el-input>
          </el-form-item>

          <el-form-item label="推荐周期" prop="effectiveTime">
            <el-date-picker
              :disabled="isdisabled4"
              v-model="addOrUpdateDebitCardRecommended.effectiveTime"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="dateChange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结算卡图片" size="normal">
            <div>
              <img :src="debitCardImg" style="width: 120px; height: 120px" />
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" style="display: flex;">
          <el-button
            type="primary"  class="subBtn"
            @click="handleAddDebitCardSubmit('addOrUpdateDebitCardRecommended')"
            >提交</el-button
          >

          <el-button class="cancelBtn"  v-if="title=='添加用户'"
            @click="dialogFormVisible=false"
            >取消</el-button
          >
          <el-button class="cancelBtn" v-else
            @click="handleDeleteDebitCardSubmit('addOrUpdateDebitCardForm')"
            >删除</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  reqDebitCardRecommendedList,
  reqUpdateDebitCardRecommended,
  reqDeleteDebitCardRecommended,
  reqDddDebitCardRecommended,
  reqSelectDebitCard,
  reqSelectEnterprise,
} from "@/api/debitCardRecommended";
export default {
  data() {
    return {
      loading: false,
isPic:false,
      //结算卡推荐列表
      debitCardRecommendedList: null,
      /**
       current	当前页码	integer(int64)
      pages	总页数	integer(int64)
      records	查询的记录	array	RecommendGoodsVo
      amount	价值金额	number
      endTime	显示结束时间	string
      goodsId	商品id	string
      goodsName	商品名称	string
      id	id	string
      picture	商品图片	string
      priority	显示优先级	integer
      score	所需K分	integer
      startTime	显示开始时间	string
      useRange	使用范围	string
      useRule	使用规则	string
      size	每页显示记录数	integer(int64)
      otal	总记录数	integer(int64)

       */
      // 添加结算卡推荐
      addOrUpdateDebitCardRecommended: {
        endTime: "", //结束时间
        goodsId: "", //商品id,
        id: "", //id,
        priority: "", //优先级
        startTime: "", //开始时间
        // state:'', //状态 1-正常，
        effectiveTime: [],
        enterprise: "",
        debitCard: "",
      },
      // 企业选项
      enterpriseOptions: [],
      // 结算卡选项
      debitCardOptions: [],

      // 弹出层标题
      title: "",
      dialogFormVisible: false,
      //结算卡图片
      debitCardImg: "",
      //
      // debitCard: '',
      enterpriseId: "",
      // enterprise: '',
      isdisabled1: false,
      isdisabled2: false,
      isdisabled3: false,
      isdisabled4: false,
      rules: {
        amount: [
          { required: true, message: "抵扣金额", trigger: "blur" },
          { max: 16, message: "昵称上限为16个字符", trigger: "blur" },
        ],
        effectiveDays: [
          { required: true, message: "兑换后有效天数", trigger: "blur" },
        ],
        effectiveEndTime: [
          { required: true, message: "有效时间- 结束", trigger: "change" },
        ],
        goodsName: [{ required: true, message: "商品名称", trigger: "change" }],
        keywords: [
          { required: true, message: "搜索关键字", trigger: "change" },
        ],

        score: [
          { required: true, message: "兑换需要的K分", trigger: "change" },
        ],

        useRange: [{ required: true, message: "使用范围", trigger: "change" }],
        useRule: [{ required: true, message: "使用规则", trigger: "change" }],
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
    this.getDebitCardRecommendedList();
  },
  methods: {
    /**
     * 结算卡系列————————————————————————————————————————————
     */
    // 展示结算卡系列列表
    async getDebitCardRecommendedList() {
      try {
        const result = await reqDebitCardRecommendedList();
        console.log("打印的结果", result);

        this.debitCardRecommendedList = result.data.data.records;
      } catch (e) {}
    },

    // 表单重置
    reset() {
      this.addOrUpdateDebitCardRecommended = {
        endTime: "", //结束时间
        goodsId: "", //商品id,
        id: "", //id,
        priority: "", //优先级
        startTime: "", //开始时间
        // state:'', //状态 1-正常，
        effectiveTime: [],
      };
      this.debitCardImg = "";
    },
    // 修改有效时间
    dateChange() {
      console.log(this.addOrUpdateDebitCardRecommended.effectiveTime);
      this.addOrUpdateDebitCardRecommended.endTime =
        this.addOrUpdateDebitCardRecommended.effectiveTime[1];
      this.addOrUpdateDebitCardRecommended.startTime =
        this.addOrUpdateDebitCardRecommended.effectiveTime[0];
    },

    async toAddDebitCard() {
      (this.isdisabled1 = false),
        (this.isdisabled2 = false),
        (this.isdisabled3 = false),
        (this.isdisabled4 = false),
        this.reset();
      this.dialogFormVisible = true;
      this.title = "添加用户";

      await reqSelectEnterprise().then((response) => {
        this.enterpriseOptions = response.data.data;
        console.log(this.enterpriseOptions, "this.enterpriseOptions");
      });
    },
    // 点击查看管理结算卡
    toDebitCard(debitCardRecommend) {
      this.isdisabled1 = true;
      this.isdisabled2 = true;
      this.isdisabled3 = true;
      this.isdisabled4 = true;
      this.dialogFormVisible = true;

      this.addOrUpdateDebitCardRecommended = {
        endTime: debitCardRecommend.endTime, //结束时间
        goodsId: debitCardRecommend.goodsId, //商品id,
        id: debitCardRecommend.id, //id,
        priority: debitCardRecommend.priority, //优先级
        startTime: debitCardRecommend.startTime, //开始时间
        // state:debitCardRecommend., //状态 1-正常，
      };
      this.debitCardImg = debitCardRecommend.picture;
      (this.addOrUpdateDebitCardRecommended.effectiveTime = [
        this.addOrUpdateDebitCardRecommended.endTime,
        this.addOrUpdateDebitCardRecommended.startTime,
      ]),
        (this.title = "查看结算卡推荐");
    },

    clearData() {
      // this.imgList = [];
      this.$refs.addOrUpdateDebitCardRecommended.resetFields();
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
    getdefaults(value) {
      console.log(value, "value2");
      this.addOrUpdateDebitCardRecommended.debit = value.goodsName;
      this.addOrUpdateDebitCardRecommended.goodsId = value.id;
      this.debitCardImg = value.picture;
    },
    async getdefaults1(value) {
      console.log(value, "value1");
      this.enterpriseId = value.enterpriseId;
      console.log(this.enterpriseId, "this.enterpriseId??");

      this.addOrUpdateDebitCardRecommended.enterprise = value.brandName;
      await reqSelectDebitCard(this.enterpriseId).then((response) => {
        console.log(response, "this.enterpriseId???");

        this.debitCardOptions = response.data.data;
      });
    },
    // 提交增加的结算卡
    async handleAddDebitCardSubmit(addOrUpdateDebitCardRecommended) {
      this.$refs["addOrUpdateDebitCardRecommended"].validate((valid) => {
        if (valid) {
          this.loading = true;
          console.log(
            this.addOrUpdateDebitCardRecommended.id,
            "this.addOrUpdateDebitCardRecommended.id"
          );
          if (this.addOrUpdateDebitCardRecommended.id) {
            this.dialogFormVisible = false;

            // });
          } else {
            try {
              reqDddDebitCardRecommended(
                this.addOrUpdateDebitCardRecommended
              ).then((response) => {
                this.dialogFormVisible = false;
                this.getDebitCardRecommendedList();
              });
            } catch (e) {
              console.log(e);
              this.loading = false;
            }
          }
        } else {
          console.log("请填写信息");
          return false;
        }
      });
    },

    /** 删除结算卡 */

    handleDeleteDebitCardSubmit() {
      this.$confirm("此操作将删除此奖品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          reqDeleteDebitCardRecommended({
            id: this.addOrUpdateDebitCardRecommended.id,
          });
        })
        .then(() => {
          this.getDebitCardRecommendedList();
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: "删除成功",
          });
        })
        .catch(() => {});
    },

    // 删除结算卡
    // async handleDeleteDebitCardSubmit() {
    //   this.dialogFormVisible = false;

    //   await reqDeleteDebitCardRecommended({
    //     id: this.addOrUpdateDebitCardRecommended.id,
    //   });

    //   this.getDebitCardRecommendedList();
    // },
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
      // console.log("e", e);
      this.limit = e;
      this.getDebitCardList();
    },
    // 跳转页面
    changejump() {
      // console.log("执行了");
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

.addbtn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 38px;
  width: 160px;
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
.debitCardRecommend {
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
.debitCardRecommend .inner {
  display: flex;
  justify-content: space-between;
  width: 250px;
  height: 120px;
}

.debitCardRecommend .left {
  width: 120px;
  height: 120px;
}
.debitCardRecommend .inner .right {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
/* background: #20dfff;  */
  width: 120px;
  height: 120px;
}
.debitCardRecommend .inner .right .inner2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 110px;
  height: 120px;
}
.debitCardRecommend .inner .right .inner2 .top {
  font-size: 12px;
}
/* .debitCardRecommend .right .top {
  display: flex;
  justify-content: space-between;
} */
.debitCardRecommend .btn1 {
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
  margin-top: 10px;
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
