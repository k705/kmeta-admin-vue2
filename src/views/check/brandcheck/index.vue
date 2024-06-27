<template>
  <div class="app-container" style="margin-right: 30px">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="requestId" label="提交人ID" width="350">
      </el-table-column>
      <el-table-column prop="submitBy" label="提交人名称" width="350">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌名称" width="350">
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" width="350">
      </el-table-column>

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="approveClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="企业认证" :visible.sync="dialogFormVisible" width="60%" top="1vh">
      <!-- 第三部分 主体信息-->
      <el-card>
        <div slot="header" class="clearfix">
          <img src="./fronticon.png"/>
          <span class="clearfix_text">主体信息</span>
        </div>
        <el-form
          :model="ruleForm1"
          label-width="150px"
          class="demo-ruleForm"
          label-position="left"
        >
          <div style="display: flex">
            <div class="left">
              <el-form-item label="主体名称：">
                <el-input
                  v-model="ruleForm1.enterprise"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="社会统一信用代码：">
                <el-input
                  v-model="ruleForm1.creditCode"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </div>

            <div class="right" style="margin-left: 50px">
              <el-form-item label="营业期限：">
                <el-input
                  v-model="ruleForm1.businessTerm"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="所在地：">
                <el-input
                  v-model="ruleForm1.location"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item
              label=" 营业执照："
              class="center"
              style="margin-left: 50px"
            >
              <div style="display: flex;width: 295px;height: 120px;">
                <div>
                  <div
                    class="img_con"
                    v-for="(i, index) in imgList1"
                    :key="index"
                  >
                    <el-image
                      class="deduct_img"
                      :src="i"
                      :preview-src-list="[i]"
                    ></el-image>
                    <i
                      class="el-icon-zoom-in preview_img"
                      @click.passive="handlePictureCardPreview1(index)"
                    ></i>
                  </div>
                  <el-dialog :visible.sync="dialogVisible1">
                    <img width="100%" :src="dialogImageUrl1" alt=""/>
                  </el-dialog>
                </div>
                <div style="width: 175px;height: 45px;font-size: 14px;margin-left: 17px;">
                  请上传最新版三证合一的营业执照清晰正面图或清晰完整的组织机构代码证
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </el-card>

      <!-- 第四部分 身份验证-->
      <el-card>
        <div slot="header" class="clearfix">
          <img src="./fronticon.png"/>
          <span class="clearfix_text">身份验证</span>
        </div>
        <el-form
          :model="ruleForm2"
          label-width="150px"
          class="demo-ruleForm"
          label-position="left"
        >
          <div style="display: flex">
            <div class="left">
              <el-form-item label="法人姓名：">
                <el-input
                  v-model="ruleForm2.legalPerson"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="身份证号码：">
                <el-input
                  v-model="ruleForm2.idCard"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </div>
            <div class="center" style="margin-left: 50px">
              <el-form-item
                label=" 身份证原件"
                class="center"
              >
                <div style="display: flex">
                  <div
                    class="img_con"
                    v-for="(i, index) in imgList21"
                    :key="index"
                  >
                    <el-image
                      class="deduct_img"
                      :src="i"
                      :preview-src-list="[i]"
                    ></el-image>
                    <i
                      class="el-icon-zoom-in preview_img"
                      @click.passive="handlePictureCardPreview21(index)"
                    ></i>
                  </div>
                  <el-dialog :visible.sync="dialogVisible21">
                    <img width="100%" :src="dialogImageUrl21" alt=""/>
                  </el-dialog>
                  <div
                    class="img_con"
                    v-for="(i, index) in imgList22"
                    :key="i"
                    style="margin-left: 20px"
                  >
                    <el-image
                      class="deduct_img"
                      :src="i"
                      :preview-src-list="[i]"
                    ></el-image>
                    <i
                      class="el-icon-zoom-in preview_img"
                      @click.passive="handlePictureCardPreview22(index)"
                    ></i>
                  </div>
                  <el-dialog :visible.sync="dialogVisible22">
                    <img width="100%" :src="dialogImageUrl22" alt=""/>
                  </el-dialog>
                </div>
              </el-form-item>
            </div>
            <div class="center" style="margin-left: 50px">
              <el-form-item
                label="手持身份证原件"
                class="center"
              >
                <div style="display: flex">
                  <div
                    class="img_con"
                    v-for="(i, index) in imgList23"
                    :key="index"
                  >
                    <el-image
                      class="deduct_img"
                      :src="i"
                      :preview-src-list="[i]"
                    ></el-image>
                    <i
                      class="el-icon-zoom-in preview_img"
                      @click.passive="handlePictureCardPreview23(index)"
                    ></i>
                  </div>
                  <el-dialog :visible.sync="dialogVisible23">
                    <img width="100%" :src="dialogImageUrl23" alt=""/>
                  </el-dialog>
                  <div
                    class="img_con"
                    v-for="(i, index) in imgList24"
                    :key="i"
                    style="margin-left: 20px"
                  >
                    <el-image
                      class="deduct_img"
                      :src="i"
                      :preview-src-list="[i]"
                    ></el-image>
                    <i
                      class="el-icon-zoom-in preview_img"
                      @click.passive="handlePictureCardPreview24(index)"
                    ></i>
                  </div>
                  <el-dialog :visible.sync="dialogVisible24">
                    <img width="100%" :src="dialogImageUrl24" alt=""/>
                  </el-dialog>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>

      <!-- 第五部分 管理员信息-->
      <el-card>
        <div slot="header" class="clearfix">
          <img src="./fronticon.png"/>
          <span class="clearfix_text"
          >管理员信息</span
          >
        </div>
        <el-form
          :model="ruleForm3"
          label-width="130px"
          class="demo-ruleForm"
          label-position="left"
        >
          <div style="display: flex">
            <div class="left">
              <el-form-item label="管理员姓名：">
                <el-input
                  v-model="ruleForm3.adminName"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="发票接收邮箱：">
                <el-input
                  v-model="ruleForm3.invoiceEmail"
                  :disabled="true"
                ></el-input>
              </el-form-item>

            </div>
            <div class="center" style="margin-left: 50px">
              <el-form-item label="联系邮箱：">
                <el-input
                  v-model="ruleForm3.adminEmail"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系电话：">
                <el-input
                  placeholder="请填写您的联系手机"
                  v-model="ruleForm3.adminPhone"
                  :disabled="true"
                />
              </el-form-item>

              <div style="display: flex; justify-content: space-between"></div>
            </div>
          </div>
        </el-form>
      </el-card>
      <!-- 第六部分 品牌信息-->

      <el-card>
        <div slot="header" class="clearfix">
          <img src="./fronticon.png"/>
          <span class="clearfix_text">品牌信息</span>
        </div>
        <el-form
          :model="ruleForm4"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
        >
          <div style="display: flex">
            <div class="left">
              <el-form-item label="品牌名称：">
                <el-input
                  v-model="ruleForm4.brandName"
                  :disabled="true"
                  style="width: 150px"
                ></el-input>
              </el-form-item>

              <el-form-item label="品牌简介" prop="synopsis">
                <el-input
                  v-model="ruleForm4.synopsis"
                  :disabled="true"
                  type="textarea"
                  style="width: 400px"
                  :rows="3"
                ></el-input>
              </el-form-item>
            </div>
            <div class="center" style="margin-left: 50px">
              <el-form-item label="品牌logo：">
                <div class="img_con" v-for="(i, index) in imgList3" :key="index">
                  <el-image
                    class="deduct_img"
                    :src="i"
                    :preview-src-list="[i]"
                  ></el-image>
                  <i
                    class="el-icon-zoom-in preview_img"
                    @click.passive="handlePictureCardPreview3(index)"
                  ></i>
                </div>
                <el-dialog :visible.sync="dialogVisible3">
                  <img width="100%" :src="dialogImageUrl3" alt=""/>
                </el-dialog>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>

      <el-form
        :model="checkData"
        :rules="rules"
        ref="form"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="审核" prop="action">
          <el-select v-model="checkData.action" placeholder="是否通过">
            <el-option label="通过" value="1"></el-option>
            <el-option label="拒绝" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input
            v-model="checkData.comment"
            type="textarea"
            style="width: 400px"
            :rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex;">
        <el-button class="subBtn" @click="submitForm"
        >确 定</el-button
        >
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {reqBrandCheckList, reqCheck} from "@/api/check.js";

export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogImageUrl1: "",
      dialogImageUrl21: "",
      dialogImageUrl22: "",
      dialogImageUrl23: "",
      dialogImageUrl24: "",
      dialogImageUrl3: "",
      dialogVisible1: false,
      dialogVisible21: false,
      dialogVisible22: false,
      dialogVisible23: false,
      dialogVisible24: false,
      dialogVisible3: false,
      // 待审核品牌列表数据
      tableData: null,
      // 第几页
      pageIndex: 1,
      // 每页记录数
      pageSize: 10,
      ruleForm1: {
        enterprise: "",
        creditCode: "",
        businessTerm: "",
        location: "",
        license: "",
      },
      ruleForm2: {
        idCardBack: "",
        idCardBackHand: "",
        idCardFront: "",
        idCardFrontHand: "",
        legalPerson: "",
        idCard: "",
      },
      ruleForm3: {
        adminName: "",
        adminEmail: "",
        invoiceEmail: "",
        adminPhone: "",
        // adminEmailCode: "",
        smsVerifyCode: "",
        adminPassword: "",
      },
      ruleForm4: {
        brandName: "",
        avatar: "",
        synopsis: "",
      },
      imgList1: [],
      imgList21: [],
      imgList22: [],
      imgList23: [],
      imgList24: [],
      imgList3: [],
      formData: "",
      checkData: {
        // 操作 1-通过 2-拒绝
        action: "2",
        // 审批意见
        comment: "",
        requestId: "",
      },
      rules: {
        comment: [
          {
            validator: this.validateComment,
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    this.getBrandList();
  },
  methods: {
    handlePictureCardPreview1() {
      this.dialogImageUrl1 = this.imgList1[0];
      this.dialogVisible1 = true;
    },
    handlePictureCardPreview21() {
      this.dialogImageUrl21 = this.imgList21[0];
      this.dialogVisible21 = true;
    },
    handlePictureCardPreview22() {
      this.dialogImageUrl22 = this.imgList22[0];
      this.dialogVisible22 = true;
    },
    handlePictureCardPreview23() {
      this.dialogImageUrl23 = this.imgList23[0];
      this.dialogVisible23 = true;
    },
    handlePictureCardPreview24() {
      this.dialogImageUrl24 = this.imgList24[0];
      this.dialogVisible24 = true;
    },
    handlePictureCardPreview3() {
      this.dialogImageUrl3 = this.imgList3[0];
      this.dialogVisible3 = true;
    },
    // 查看按钮
    async approveClick(row) {
      this.formData = row;
      this.ruleForm1 = {
        enterprise: this.formData.enterprise,
        creditCode: this.formData.creditCode,
        businessTerm: this.formData.businessTerm,
        location: this.formData.location,
        license: this.formData.license,
      };
      this.ruleForm2 = {
        legalPerson: this.formData.legalPerson,
        idCard: this.formData.idCard,
        idCardBack: this.formData.idCardBack,
        idCardBackHand: this.formData.idCardBackHand,
        idCardFront: this.formData.idCardFront,
        idCardFrontHand: this.formData.idCardFrontHand,
      };
      this.ruleForm3 = {
        adminName: this.formData.adminName,
        adminEmail: this.formData.adminEmail,
        invoiceEmail: this.formData.invoiceEmail,
        adminPhone: this.formData.adminPhone,
        smsVerifyCode: this.formData.smsVerifyCode,
      };
      this.ruleForm4 = {
        brandName: this.formData.brandName,
        avatar: this.formData.avatar,
        synopsis: this.formData.synopsis,
      };
      if (this.formData.license) {
        this.imgList1[0] = this.formData.license;
      }
      if (this.formData.avatar) {
        this.imgList3[0] = this.formData.avatar;
      }
      if (this.formData.idCardFront) {
        this.imgList21[0] = this.formData.idCardFront;
      }
      if (this.formData.idCardBack) {
        this.imgList22[0] = this.formData.idCardBack;
      }
      if (this.formData.idCardFrontHand) {
        this.imgList23[0] = this.formData.idCardFrontHand;
      }
      if (this.formData.idCardBackHand) {
        this.imgList24[0] = this.formData.idCardBackHand;
      }
      this.checkData.requestId = row.requestId;
      this.dialogFormVisible = true;
    },
    // async approveClick(row) {
    //   try {
    //     this.checkData.action = "1";
    //     this.checkData.requestId = row.requestId;
    //     console.log(this.checkData);
    //     await reqCheck(this.checkData);
    //     this.getBrandList();
    //   } catch (e) {}
    // },
    validateComment(rule, value, callback) {
      if (this.checkData.action === '2' && !this.checkData.comment) {
        callback(new Error('请填写审核批注'))
      } else {
        callback()
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          reqCheck(this.checkData).then(() => {
            this.$message({
              type: "success",
              message: "提交成功",
            });
            this.dialogFormVisible = false;
            this.getBrandList();
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
    },
    // 展示申请的品牌列表
    async getBrandList() {
      try {
        const result = await reqBrandCheckList();
        console.log("打印的结果", result);
        this.tableData = result.data.data;
      } catch (e) {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 标题样式 */
.clearfix {
  img {
    width: 5px;
    height: 20px;
  }

  .clearfix_text {
    font-size: 18px;
    font-weight: bold;
    margin-left: 10px;
    vertical-align: top;
  }
}

.box1 {
  height: 64px;
  width: 479px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // background: #409eff;
  .box1_top {
    display: flex;

    .box1_top1 {
      width: 32px;
      height: 32px;

      img {
        width: 32px;
        height: 32px;
      }
    }

    .box1_top2 {
      width: 122px;
      height: 1px;

      img {
        width: 122px;
        height: 1px;
      }

      margin-left: 16px;
    }

    .box1_top3 {
      width: 32px;
      height: 32px;

      img {
        width: 32px;
        height: 32px;
      }

      margin-left: 16px;
    }
  }

  .box1_footer {
    // background: #8c939d;
    margin-top: 18px;
    font-size: 13px;
    width: 479px;
    display: flex;
    justify-content: center;
    margin-left: 10px;
  }
}

.p2 {
  font-size: 14px;
  margin-left: 15px;

  a {
    color: #20d8ff;
  }
}

.checkBox {
  font-size: 14px;
}

.checkBoxP {
  font-size: 12px;
  // color: rgba(214, 222, 225, 1);
  margin-top: 16px;
}


/* 上传图片样式 */
.img_con {
  position: relative;
  display: flex;
  width: 120px;
  height: 120px;
}

.deduct_img {
  width: 120px;
  height: 120px;
  // margin-right: 10px;
  // margin-bottom: 10px;
  background: #20d8ff;
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

.line {
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-card {
  margin-bottom: 25px;
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
</style>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    font-size: 26px;
    color: $light_gray;
    text-align: left;
    font-weight: bold;

    .title {
      margin: 0px auto 20px auto;
    }
  }
}
</style>
@/api/brand.js
