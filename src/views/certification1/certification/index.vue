<template>
  <div class="app-container" style="margin-right: 30px">
    <!-- 第一部分 认证流程 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span><img src="./fronticon.png"/></span>
        <span class="clearfix_text">认证流程</span>
      </div>
      <div class="box1">
        <div class="box1_top">
          <div class="box1_top1"><img src="./icon1.png"/></div>
          <div class="box1_top2"><img src="./line.png"/></div>
          <div class="box1_top3"><img src="./icon2.png"/></div>
          <div class="box1_top2"><img src="./line.png"/></div>
          <div class="box1_top3"><img src="./icon3.png"/></div>
        </div>
        <div class="box1_footer">
          <span style="margin-right: 110px">提交企业资料</span>
          <span style="margin-right: 96px">企业资料审核</span>
          <span>企业账号认证完成</span>
        </div>
      </div>
    </el-card>

    <!-- 第二部分 认证须知-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span><img src="./fronticon.png"/></span>
        <span class="clearfix_text">认证须知</span>
      </div>
      <div class="p2">
        <p>申请企业认证时，登录的账号即为认证账号，提交申请后无法更换账号。</p>
        <p>
          填写前请阅读<a>《Kmeta企业入驻手册》</a>
          及<a>《Kmeta企业认证规则》</a>，同一营业执照最多可申请1个企业账号。账号昵称需要基于商标/网站/软件应用命名，请提供对应商标等补充资质证明。不支持已被Kmeta元宇宙封号的账号进行认证，同时也不支持在审核过程中更换主体资质和主体归属地。认证申请一经提交即默认遵守Kmeta企业账号认证规则，如主体实际经营为禁入行业或资质虚假、不符合资质审核标准的，将做认证失败处理。企业专业号身份有效期为1年，每年需要完成一次年审。
        </p>
      </div>
    </el-card>

    <!-- 第三部分 主体信息-->
    <el-card>
      <div slot="header" class="clearfix">
        <img src="./fronticon.png"/>
        <span class="clearfix_text">主体信息</span>
      </div>
      <el-form
        :model="ruleForm1"
        :rules="rules1"
        ref="ruleForm1"
        label-width="150px"
        class="demo-ruleForm"
        label-position="left"
      >
        <div style="display: flex">
          <div class="left">
            <el-form-item label="主体名称：" prop="enterprise">
              <el-input
                v-model="ruleForm1.enterprise"
                :disabled="isFormDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="社会统一信用代码：" prop="creditCode">
              <el-input
                v-model="ruleForm1.creditCode"
                :disabled="isFormDisabled"
              ></el-input>
            </el-form-item>
          </div>

          <div class="right" style="margin-left: 50px">
            <el-form-item label="营业期限：" prop="businessTerm">
              <el-input
                v-model="ruleForm1.businessTerm"
                :disabled="isFormDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="所在地：" prop="location">
              <el-input
                v-model="ruleForm1.location"
                :disabled="isFormDisabled"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item
            label=" 营业执照："
            class="center"
            style="margin-left: 50px"
            prop="license"
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
                  <i
                    class="el-icon-delete remove_img"
                    @click="handleRemove1(index)"
                  ></i>
                </div>
                <UploadImg v-show="imgList1.length < 1" @get-url="getUrl1"/>
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
        :rules="rules2"
        ref="ruleForm2"
        label-width="150px"
        class="demo-ruleForm"
        label-position="left"
      >
        <div style="display: flex">
          <div class="left">
            <el-form-item label="法人姓名：" prop="legalPerson">
              <el-input
                v-model="ruleForm2.legalPerson"
                :disabled="isFormDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号码：" prop="idCard">
              <el-input
                v-model="ruleForm2.idCard"
                :disabled="isFormDisabled"
              ></el-input>
            </el-form-item>
          </div>
          <div class="center" style="margin-left: 50px">
            <el-form-item
              label=" 身份证原件"
              class="center"
              prop="idCardFront"
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
                  <i
                    class="el-icon-delete remove_img"
                    @click="handleRemove21(index)"
                  ></i>
                </div>
                <UploadImg v-show="imgList21.length < 1" @get-url="getUrl21"/>
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
                  <i
                    class="el-icon-delete remove_img"
                    @click="handleRemove22(index)"
                  ></i>
                </div>
                <UploadImg v-show="imgList22.length < 1" @get-url="getUrl22" style="margin-left: 20px"/>
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
              prop="idCardFrontHand"
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
                  <i
                    class="el-icon-delete remove_img"
                    @click="handleRemove23(index)"
                  ></i>
                </div>
                <UploadImg v-show="imgList23.length < 1" @get-url="getUrl23"/>
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
                  <i
                    class="el-icon-delete remove_img"
                    @click="handleRemove24(index)"
                  ></i>
                </div>
                <UploadImg v-show="imgList24.length < 1" @get-url="getUrl24" style="margin-left: 20px"/>
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
        >管理员信息 请填写真实有效的信息，避免影响审核进度</span
        >
      </div>
      <el-form
        :model="ruleForm3"
        :rules="rules3"
        ref="ruleForm3"
        label-width="130px"
        class="demo-ruleForm"
        label-position="left"
      >
        <div style="display: flex">
          <div class="left">
            <el-form-item label="管理员姓名：" prop="adminName">
              <el-input
                v-model="ruleForm3.adminName"
                :disabled="isFormDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="发票接收邮箱：" prop="invoiceEmail">
              <el-input
                v-model="ruleForm3.invoiceEmail"
                :disabled="isFormDisabled"
              ></el-input>
            </el-form-item>

          </div>
          <div class="center" style="margin-left: 50px">
            <el-form-item label="联系邮箱：" prop="adminEmail">
              <el-input
                v-model="ruleForm3.adminEmail"
                :disabled="isFormDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="adminPhone">
              <el-input
                placeholder="请填写您的联系手机"
                v-model="ruleForm3.adminPhone"
                :disabled="isFormDisabled"
              />
            </el-form-item>

            <div style="display: flex; justify-content: space-between"></div>
          </div>
          <div v-if="state === -1 || state === 3" style="margin-left: 50px; position: relative">
            <el-form-item prop="adminPassword" label="管理员密码">
              <div style="display: flex; position: relative">
                <el-input
                  v-model="ruleForm3.adminPassword"
                  :disabled="isFormDisabled"
                  placeholder="请填写管理员密码"
                  :type="passwordType === 'password' ? 'text' : 'password'"
                />
                <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye-open' : 'eye'"
                />
              </span>
              </div>
            </el-form-item>
            <div
              v-if="state === -1 || state === 3"
              style="display: flex; justify-content: space-between"
            >
              <el-form-item prop="smsVerifyCode" label="短信验证码：">
                <el-input
                  placeholder="请输入6位验证码"
                  v-model="ruleForm3.smsVerifyCode"
                  :disabled="isFormDisabled"
                />
              </el-form-item>
              <!-- <el-form-item
                @click.native="getSmsVerifyCode"
                :disabled="countdown > 0"
                > -->
              <div
                class="loginbtn"
                @click="getSmsVerifyCode"
                :disabled="countdown > 0"
              >
                {{
                  countdown > 0 ? countdown + "秒后重新发送" : "获取短信验证码"
                }}
              </div>
              <!-- </el-form-item> -->
            </div>
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
        :rules="rules4"
        ref="ruleForm4"
        label-width="100px"
        class="demo-ruleForm"
        label-position="left"
      >
        <div style="display: flex">
          <div class="left">
            <el-form-item label="品牌名称：" prop="brandName">
              <el-input
                v-model="ruleForm4.brandName"
                :disabled="isFormDisabled"
              ></el-input>
            </el-form-item>

            <el-form-item label="品牌简介" prop="synopsis">
              <el-input
                v-model="ruleForm4.synopsis"
                :disabled="isFormDisabled"
                type="textarea"
                style="width: 400px"
                :rows="3"
              ></el-input>
            </el-form-item>
          </div>
          <div class="center" style="margin-left: 50px">
            <el-form-item label="品牌logo：" prop="avatar">
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
                <i
                  class="el-icon-delete remove_img"
                  @click="handleRemove3(index)"
                ></i>
              </div>
              <UploadImg v-show="imgList3.length < 1" @get-url="getUrl3"/>
              <el-dialog :visible.sync="dialogVisible3">
                <img width="100%" :src="dialogImageUrl3" alt=""/>
              </el-dialog>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>
    <!-- 第七部分 遵守协议-->

        <el-card v-if="state === -1 || state === 3">
          <div slot="header" class="clearfix">
            <img src="./fronticon.png" />
            <span class="clearfix_text">遵守协议</span>
          </div>
          <div class="checkBox">
            <el-checkbox v-model="isAgree"
              >同意并遵守<a>《Kmeta入驻企业协议》</a>，认证账号所属权归属于账号主体</el-checkbox
            >
          </div>
          <div class="checkBoxP">
            <p>
              申请前请阅读<a>《Kmeta入驻企业协议》</a>及<a>《Kmeta入驻企业资质审核标准》</a>，提交后即默认您知晓并遵守相关准入规则，禁入行业或虚假资质申请认证等情况无法退换审核服务费
            </p>
          </div>
        </el-card>

    <div
      v-if="state === -1 || state === 3"
      type="primary"
      size="default"
      @click="handleLogin" class="submitbtn"
    >
      提交资料
    </div>

    <!-- <el-button type="primary" size="default">保存资料</el-button> -->
  </div>
</template>

<script>
import {reqSubmitMaterial} from "@/api/brand.js";
import {reqSmsVerifyCode} from "@/api/register";
import {reqGetMaterial} from "@/api/brand";

export default {
  data() {
    return {
      isAgree: false,
      labelPosition: 'top',
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
      disabled: false,
      state: "",
      isEmail: "",
      formData: "",
      imgList1: [],
      imgList21: [],
      imgList22: [],
      imgList23: [],
      imgList24: [],
      imgList3: [],

      // 倒计时
      countdown: "",
      loading: false,
      passwordType: "",

      BrandForm: {
        adminEmail: "",
        adminName: "",
        adminPassword: "",
        adminPhone: "",
        annex: "",
        authentication: 0,
        avatar: "",
        // belongingPlace: "",
        brandName: "",
        businessTerm: "",
        creditCode: "",
        enterprise: "",
        idCard: "",
        invoiceEmail: "",
        legalPerson: "",
        license: "",
        location: "",
        smsVerifyCode: "",
        synopsis: "",
      },

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
      rules1: {
        enterprise: [
          {required: true, message: "请填写主体名称", trigger: "blur"},
        ],
        creditCode: [
          {
            required: true,
            message: "请填写社会统一信用代码",
            trigger: "blur",
          },
        ],
        license: [
          {required: true, message: "请上传营业执照", trigger: "change"},
        ],
        businessTerm: [
          {required: true, message: "请填写营业期限", trigger: "blur"},
        ],
        location: [
          {
            required: true,
            message: "请填写所在地",
            trigger: "blur",
          },
        ],
      },
      rules2: {
        legalPerson: [
          {required: true, message: "请填写法人姓名", trigger: "blur"},
        ],
        idCard: [
          {
            required: true,
            message: "请填写身份证号",
            trigger: "blur",
          },
        ],
        idCardFront: [
          {
            validator: this.validateIdCardFront,
            trigger: "change",
          },
        ],
        idCardFrontHand: [
          {
            validator: this.validateIdCardFrontHand,
            trigger: "change",
          },
        ],
      },
      rules3: {
        adminName: [
          {required: true, message: "请输入管理员姓名", trigger: "blur"},
        ],
        adminEmail: [
          {required: true, message: "请输入联系邮箱", trigger: "change"},
          { validator: this.validateEmail, trigger: "blur" },
        ],
        smsVerifyCode: [
          {required: true, message: "请输入短信验证码", trigger: "change"},
          {
            pattern: /^\d{6}$/,
            message: "短信验证码为6位数字",
            trigger: "blur",
          },
        ],

        invoiceEmail: [
          {
            required: true,
            message: "请发票接收邮箱",
            trigger: "change",
          },
          { validator: this.validateEmail, trigger: "change" },
        ],
        adminPhone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "change",
          },
          { validator: this.validatePhone, trigger: "blur" },
        ],
        adminPassword: [
          {
            required: true,
            message: "管理员密码",
            trigger: "blur",
          },
          {min: 6, message: "密码长度不少于6位", trigger: "blur"},
        ],
      },
      rules4: {
        brandName: [
          {required: true, message: "请输入品牌名称", trigger: "blur"},
          {min: 2, max: 4, message: "长度在 2 到 4 个字符", trigger: "blur"},
        ],
        avatar: [{required: true, message: "请上传logo", trigger: "change"}],
        synopsis: [
          {
            required: true,
            message: "请填写简介",
            trigger: "change",
          },
        ],
      },
      upLoadData: {
        module: "brand", //上传时附带的其他参数
      },
    };
  },
  computed: {
    isFormDisabled() {
      return this.state === "0" || this.state === 1 || this.state === 2;
    },
  },
  beforeMount() {
    // 在 beforeMount 生命周期中清除表单的校验规则
    this.$nextTick(() => {
      this.$refs.ruleForm1.clearValidate();
      this.$refs.ruleForm2.clearValidate();
      this.$refs.ruleForm3.clearValidate();
      this.$refs.ruleForm4.clearValidate();
    });
  },
  mounted() {
    this.getMaterial();
  },
  methods: {
    validateIdCardFront(rule, value, callback) {
      if (!this.ruleForm2.idCardFront || !this.ruleForm2.idCardBack) {
        callback(new Error('请上传身份正反面'))
      } else {
        callback()
      }
    },
    validateIdCardFrontHand(rule, value, callback) {
      if (!this.ruleForm2.idCardFrontHand || !this.ruleForm2.idCardBackHand) {
        callback(new Error('请上传手持身份证正反面'))
      } else {
        callback()
      }
    },
    validateEmail(rule, value, callback) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || emailRegex.test(value)) {
        callback();
      } else {
        callback(new Error("请输入有效的邮箱地址"));
      }
    },
    validatePhone(rule, value, callback) {
      const phoneNumber = value.replace(/\D/g, "");
      if (/^1[3-9]\d{9}$/.test(phoneNumber)) {
        callback();
      } else {
        callback(new Error("请输入有效的手机号码"));
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    async getMaterial() {
      const result = await reqGetMaterial();
      this.formData = result.data.data;

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
        // adminPassword: this.formData.adminPassword,
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
      this.state = this.formData.state; //		状态 -1 待提交资料 0-邮箱待验证 1-待审核 2-审核通过 3-审核不通过
    },

    //upload函数
    getUrl1(e) {
      this.imgList1.push(e);
      this.ruleForm1.license = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    getUrl21(e) {
      this.imgList21.push(e);
      this.ruleForm2.idCardFront = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    getUrl22(e) {
      this.imgList22.push(e);
      this.ruleForm2.idCardBack = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    getUrl23(e) {
      this.imgList23.push(e);
      this.ruleForm2.idCardFrontHand = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    getUrl24(e) {
      this.imgList24.push(e);
      this.ruleForm2.idCardBackHand = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    getUrl3(e) {
      this.imgList3.push(e);
      this.ruleForm4.avatar = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },

    handleRemove1(index) {
      this.imgList1.splice(index, 1);
      this.ruleForm1.license = null;
    },
    handlePictureCardPreview1(file) {
      this.dialogImageUrl1 = this.imgList1[0];
      this.dialogVisible1 = true;
    },

    handleRemove21(index) {
      this.imgList21.splice(index, 1);
      this.ruleForm2.idCardFront = null;
    },
    handlePictureCardPreview21(file) {
      this.dialogImageUrl21 = this.imgList21[0];
      this.dialogVisible21 = true;
    },

    handleRemove22(index) {
      this.imgList22.splice(index, 1);
      this.ruleForm2.idCardBack = null;
    },
    handlePictureCardPreview22(file) {
      this.dialogImageUrl22 = this.imgList22[0];
      this.dialogVisible22 = true;
    },
    handleRemove23(index) {
      this.imgList23.splice(index, 1);
      this.ruleForm2.idCardFrontHand = null;
    },
    handlePictureCardPreview23(file) {
      this.dialogImageUrl23 = this.imgList23[0];
      this.dialogVisible23 = true;
    },

    handleRemove24(index) {
      this.imgList24.splice(index, 1);
      this.ruleForm2.idCardBackHand = null;
    },
    handlePictureCardPreview24(file) {
      this.dialogImageUrl24 = this.imgList24[0];
      this.dialogVisible24 = true;
    }, handleRemove3(index) {
      this.imgList3.splice(index, 1);
      this.ruleForm4.avatar = null;
    },
    handlePictureCardPreview3(file) {
      this.dialogImageUrl3 = this.imgList3[0];
      this.dialogVisible3 = true;
    },
    async handleLogin() {
      await this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
          this.$refs.ruleForm2.validate((valid2) => {
            if (valid2) {
              this.$refs.ruleForm3.validate((valid3) => {
                if (valid3) {
                  this.$refs.ruleForm4.validate(async (valid4) => {
                    if (valid4) {
                      if (!this.isAgree) {
                        this.$message({
                          offset: 200,
                          type: "info",
                          message: "请勾选协议",
                        });
                        return;
                      }

                      const BrandForm = {
                        businessTerm: this.ruleForm1.businessTerm,
                        creditCode: this.ruleForm1.creditCode,
                        enterprise: this.ruleForm1.enterprise,
                        license: this.ruleForm1.license,
                        location: this.ruleForm1.location,
                        idCardBack: this.ruleForm2.idCardBack,
                        idCardBackHand: this.ruleForm2.idCardBackHand,
                        idCardFront: this.ruleForm2.idCardFront,
                        idCardFrontHand: this.ruleForm2.idCardFrontHand,
                        idCard: this.ruleForm2.idCard,

                        legalPerson: this.ruleForm2.legalPerson,

                        adminEmail: this.ruleForm3.adminEmail,
                        adminName: this.ruleForm3.adminName,
                        adminPassword: this.ruleForm3.adminPassword,
                        adminPhone: this.ruleForm3.adminPhone,
                        smsVerifyCode: this.ruleForm3.smsVerifyCode,
                        invoiceEmail: this.ruleForm3.invoiceEmail,

                        avatar: this.ruleForm4.avatar,
                        brandName: this.ruleForm4.brandName,
                        synopsis: this.ruleForm4.synopsis,
                      };

                      this.loading = true;

                      try {
                        const result = await reqSubmitMaterial(BrandForm);
                        this.isEmail = result.data.data;
                        this.loading = false;
                        if (this.isEmail) {
                          await this.$alert("提交成功，请查看您的邮箱完成验证", "提示", {
                            confirmButtonText: "确定",
                            callback: (action) => {
                              this.$router.push("/");
                            },
                          });
                        } else {
                          this.$router.push("/");
                        }
                      } catch (e) {
                        console.log(e);
                        this.loading = false;
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });
    },

    jumpTo() {
      // this.$router.push("/login");
    },

    // 获取短信验证码
    async getSmsVerifyCode() {
      await this.$refs.ruleForm3.validateField('adminPhone', async (valid3) => {
        if (!valid3) {
          const data3 = {phone: this.ruleForm3.adminPhone};

          await reqSmsVerifyCode(data3);
          this.$message({
            type: "success",
            message: "发送成功",
          });
          this.startCountdown();
        }
      })
    },
    startCountdown() {
      this.countdown = 59;
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  watch: {
    countdown: {
      handler(newVal) {
        this.countdown = newVal;
      },
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

.show-pwd {
  position: absolute;
  right: 10px;
  top: 0;
  font-size: 16px;
  color: #c1c2c4;
  cursor: pointer;
  user-select: none;
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

.loginbtn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 40px;
  width: 136px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 14px;
  color: #ffffff;
  font-weight: bold;
  margin-left: 20px;
}

.submitbtn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 50px;
  width: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 17px;
  color: #ffffff;
  font-weight: bold;
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

.line {
  text-align: center;
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

.el-card {
  margin-bottom: 25px;
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

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
