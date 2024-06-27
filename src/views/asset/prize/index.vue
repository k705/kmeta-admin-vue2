<template>
  <div style="background-color: #171515">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="addbtn" @click="handleAdd">创建奖品</div>
      </div>

      <!-- 奖品列表 -->
      <div style="display: flex; flex-wrap: wrap">
        <!-- <div class="starItemout"> -->
        <div
          class="starItem"
          v-for="prizeItem in prizeList"
          :key="prizeItem.id"
        >
          <div class="inner">
            <div class="left">
              <img
                :src="prizeItem.prizePic"
                style="width: 90px; height: 90px"
              />
            </div>
            <div class="right">
              <div class="top">
                <div style="font-weight: bold">{{ prizeItem.prizeName }}</div>
                <div style="margin-top: 10px">
                  <div style="font-size: 12px">
                    创建日期:{{ prizeItem.createTime }}
                  </div>
                </div>
              </div>
              <div style="display: flex">
                <div class="btn" @click="handleUpdate(prizeItem)">管理奖品</div>
                <div
                  class="btn"
                  style="margin-left: 10px"
                  @click="handleDelete(prizeItem)"
                >
                  删除奖品
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </div>
      <!-- 页码导航区域 -->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[3, 5, 7, 9]"
        :page-size="limit"
        layout="->,total, prev, pager, next,sizes, slot"
        :total="totalElements"
      >

        <template>
          跳转
          <el-input
            v-model="jumpPage"
            class="one"
            @change="changejump"
          ></el-input>
          <div class="pageUnit">页</div>
        </template>
      </el-pagination> -->
      <el-dialog :visible.sync="open">
        <!-- 修改奖品信息（管理奖品） -->

        <el-tabs v-model="activeName" type="card">
          <!-- 奖品管理 -->
          <el-tab-pane :label="title" name="first">
            <el-form
              :model="form"
              ref="form"
              :rules="rules"
              label-width="130px"
              :inline="false"
              size="normal"
            >
              <el-form-item label="奖品名称：" prop="prizeName">
                <el-input
                  style="width: 200px"
                  v-model="form.prizeName"
                ></el-input>
              </el-form-item>

              <el-form-item label="使用规则：" prop="useRule">
                <el-input
                  type="textarea"
                  v-model="form.useRule"
                  style="width: 400px"
                  rows="4"
                ></el-input>
              </el-form-item>

              <el-form-item label="使用范围：" prop="useRange">
                <el-input
                  type="textarea"
                  v-model="form.useRange"
                  style="width: 400px"
                  rows="4"
                ></el-input>
              </el-form-item>
              <el-form-item label="价值：" prop="prizeAmount">
                <el-input
                  v-model="form.prizeAmount"
                  style="width: 100px"
                ></el-input>
                元
              </el-form-item>
              <el-form-item label="数量：" prop="quantity">
                <el-input
                  v-model="form.quantity"
                  style="width: 100px"
                ></el-input>
                个
              </el-form-item>

              <el-form-item
                label=" 奖品图片："
                class="center"
                prop="prizePic"
                style="width: 250px"
              >
                <div class="img_con" v-for="(i, index) in imgList" :key="index">
                  <el-image
                    class="deduct_img"
                    :src="i"
                    :preview-src-list="[i]"
                  ></el-image>
                  <div class="overlay">
                    <i
                      class="el-icon-zoom-in preview_img"
                      @click.passive="handlePictureCardPreview1(index)"
                    ></i>
                    <i
                      class="el-icon-delete remove_img"
                      @click="handleRemove1(index)"
                    ></i>
                  </div>
                </div>
                <UploadImg v-show="imgList.length < 1" @get-url="getUrl" />
                <el-dialog :visible.sync="dialogVisible1">
                  <img width="100%" :src="dialogImageUrl1" alt="" />
                </el-dialog>
              </el-form-item>

              <el-form-item>
                <div style="display: flex">
                  <el-button class="subBtn" type="primary" @click="submitForm()"
                    >提交</el-button
                  >

                  <el-button class="cancelBtn" @click="cancel()"
                    >取消</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  reqPrizeList,
  reqCreatePrize,
  reqDeletePrize,
  reqUpdatePrize,
  reqSelectPrize,
  reqSelectEnterprise,
} from "@/api/prize";

export default {
  data() {
    return {
      dialogImageUrl1: "",
      dialogVisible1: false,
      imgList: [],
      loading: false,
      // 是否显示弹出层
      open: false,
      activeName: "first",
      // 弹出层标题
      title: "",
      // 新增或修改奖品
      form: {
        id: "", //		奖品id
        prizeAmount: "", //	奖品价值

        prizeName: "", //	奖品名称

        prizePic: "", //	奖品图片

        quantity: "", //	奖品数量

        useRange: "", //	使用范围

        useRule: "", //	使用规则
      },
      // 奖品列表展示
      prizeList: null,

      /**
        records	查询的记录	array	PrizePageRes
        createBy	创建人	string
        createTime	创建时间	string
        effectiveDays	effectiveDays	integer
        id	奖品id	string
        jumpLink	跳转链接	string
        prizeAmount	奖品价值	number
        prizeName	奖品名称	string
        prizePic	奖品图片	string
        quantity	奖品数量	integer
        residue	剩余数量	integer
        useRange	使用范围	string
        useRule	使用规则
  */

      rules: {
        prizeAmount: [
          { required: true, message: "请输入奖品价值", trigger: "blur" },
        ],
        prizeName: [
          { required: true, message: "请输入奖品名称", trigger: "blur" },
        ],
        prizePic: [
          { required: true, message: "请上传奖品图片", trigger: "change" },
        ],
        quantity: [
          { required: true, message: "请输入奖品数量", trigger: "change" },
        ],
        useRange: [
          { required: true, message: "请输入使用范围", trigger: "change" },
        ],
        useRule: [
          { required: true, message: "请输入使用规则", trigger: "change" },
        ],
      },
      //分页的页码数据
      page: 1,
      limit: 7,
      totalElements: 0, //总页数
      jumpPage: null,
      isStarShow: false,
      dialogVisible: false,
    };
  },
  mounted() {
    this.getPrizeList();
  },
  methods: {
    // 展示星球列表
    async getPrizeList() {
      try {
        const result = await reqPrizeList();
        console.log("打印的结果", result);
        this.prizeList = result.data.data.records;
      } catch (e) {}
    },

    //upload函数
    getUrl(e) {
      this.imgList.push(e);
      console.log(e, "e");
      this.form.prizePic = e;
    },

    handleRemove1(index) {
      this.imgList.splice(index, 1);
    },
    handlePictureCardPreview1(file) {
      this.dialogImageUrl1 = this.imgList[0];
      this.dialogVisible1 = true;
    },
    clearData() {
      this.imgList = [];
      // this.$refs.form.resetFields();
      // this.addOrUpdateDebitCardForm = {}
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.$refs.form.resetFields();
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: "", //		奖品id
        prizeAmount: "", //	奖品价值

        prizeName: "", //	奖品名称

        prizePic: "", //	奖品图片

        quantity: "", //	奖品数量

        useRange: "", //	使用范围

        useRule: "", //	使用规则
      };
      this.imgList = [];
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加奖品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true;
      this.title = "修改用户";
      this.form.id = row.id;
      this.form.prizeAmount = row.prizeAmount; //	奖品价值
      this.form.prizeName = row.prizeName; //	奖品名称
      this.form.prizePic = row.prizePic; //	奖品图片
      this.imgList[0] = row.prizePic; //	奖品图片
      this.form.quantity = row.quantity; //	奖品数量
      this.form.useRange = row.useRange; //	使用范围
      this.form.useRule = row.useRule; //	使用规则
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            reqUpdatePrize(this.form).then((response) => {
              this.$message({
                type: "success",
                message: "修改成功",
              });
              this.open = false;
              this.getPrizeList();
              this.$refs.form.resetFields();
            });
          } else {
            reqCreatePrize(this.form).then((response) => {
              this.$message({
                type: "success",
                message: "添加成功",
              });
              this.open = false;
              this.getPrizeList();
              this.$refs.form.resetFields();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = { id: row.id };
      this.$confirm("此操作将删除此奖品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return reqDeletePrize(id);
        })
        .then(() => {
          this.getPrizeList();
          this.$message({
            type: "success",
            message: "删除成功",
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.img_container {
  display: flex;
}
.img_con {
  width: 120px;
  height: 120px;
  position: relative;
  display: flex;
  background: #20dfff;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s;
  display: none;
}

.img_con:hover .overlay {
  display: block;
}
.deduct_img {
  width: 120px;
  height: 120px;
  /* margin-right: 10px; */
  /* margin-bottom: 10px; */
  background: #225239;
}
.remove_img {
  position: absolute;
  right: 30%;
  top: 50%;
  display: none;
  color: #fff;
  cursor: pointer;
}
.img_con:hover .remove_img {
  display: block;
}
.preview_img {
  display: none;
  position: absolute;
  right: 60%;
  top: 50%;

  color: #fff;
  cursor: pointer;
}
.img_con:hover .preview_img {
  display: block;
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
.starItem {
  width: 340px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 46px;
  margin-bottom: 30px;

  /* background: #0f0e0e; */

  /* border-radius: 10px; */
  border: 1px solid transparent;
  border-radius: 10px;
  border-image: linear-gradient(to right, #5924ff, #20dfff);
  border-image-slice: 1;
}
.starItem .inner {
  display: flex;
}
.starItem .left {
  width: 90px;
  height: 90px;
  /* display: flex;
  flex-direction: column;
  justify-content: space-between; */
  /* margin-left: 20px; */
}
.starItem .right {
  width: 200px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 15px;
}
.starItem .right .top {
  height: 70px;
  display: flex;
  flex-direction: column;
  font-size: 16px;

  /* justify-content: space-between; */
}
.starItem .right .btn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 24px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
  /* justify-content: space-between; */
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

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

/* 覆盖 el-dialog 的默认样式 */
.my-custom-dialog .el-dialog {
  margin: 0;
  padding: 0;
}

/* 覆盖 el-dialog__wrapper 的默认样式 */
.my-custom-dialog .el-dialog__wrapper {
  margin: 0;
}

.el-dialog__body img {
  max-width: 100%;
  max-height: 100vh; /* 设置最大高度为屏幕高度 */
  object-fit: contain; /* 保持图片纵横比，不拉伸变形 */
  cursor: pointer;
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
