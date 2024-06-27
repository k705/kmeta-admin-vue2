<template>
  <div class="login-container">
    <div class="bigBox">
      <div class="left">
        <div class="left_inner">
          <div class="title-container-top">
            <img src="./kmeta.png" />
          </div>
          <div class="title-container">
            <div class="title1">开放平台</div>
            <div class="title2">企业管理后台系统</div>
          </div>
          <el-form ref="formleft" :model="formleft" :rules="rules1">
            <el-form-item prop="enterprise" style="margin-top: 55px">
              <span class="svg-container">
                <img src="./enterprise.png" alt="" />
              </span>
              <el-input
                placeholder="请输入您的公司名称"
                tabindex="1"
                v-model="formleft.enterprise"
              />
            </el-form-item>
            <div style="margin-top: -15px">
              <el-form-item prop="phone">
                <span class="svg-container">
                  <img src="./phone.png" alt="" />
                </span>
                <el-input
                  placeholder="请填写您的联系手机"
                  v-model="formleft.phone"
                />
              </el-form-item>
            </div>
            <div class="warn">此处信息填写确认后不可轻易更改，请认真填写</div>
          </el-form>
        </div>
      </div>
      <div class="right">
        <div class="right_inner">
          <el-form ref="formright" :model="formright" :rules="rules2">
            <div style="margin-top: -55px">
              <el-form-item prop="email">
                <span class="svg-container">
                  <img src="./email.png" alt="" />
                </span>
                <el-input
                  placeholder="请输入您的邮箱账号一一推荐使用企业邮箱"
                  v-model="formright.email"
                />
              </el-form-item>
            </div>
            <!-- <div style="display: flex; justify-content: space-between">
            <el-form-item style="width: 80%" prop="emailVerifyCode">
              <span class="svg-container">
                <img src="./password.png" alt="" />
              </span>
              <el-input
                placeholder="请输入6位验证码"
                v-model="formright.emailVerifyCode"
              />
            </el-form-item>
            <el-form-item
              style="
                flex: 1;
                margin-left: 10px;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
              "
              @click.native="getEmailVerify()"
            >
              获取验证码</el-form-item
            >
          </div> -->
            <el-form-item prop="password">
              <span class="svg-container">
                <img src="./password.png" alt="" />
              </span>
              <el-input
                placeholder="请输入密码"
                v-model="formright.password"
                :type="passwordType === 'password' ? 'text' : 'password'"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye-open' : 'eye'"
                />
              </span>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <span class="svg-container">
                <img src="./password.png" alt="" />
              </span>
              <el-input
                placeholder="请再次输入密码"
                v-model="formright.confirmPassword"
                :type="passwordType1 === 'password' ? 'text' : 'password'"
              />
              <span class="show-pwd" @click="showPwd1">
                <svg-icon
                  :icon-class="
                    passwordType1 === 'password' ? 'eye-open' : 'eye'
                  "
                />
              </span>
            </el-form-item>
          </el-form>
          <el-checkbox
            style="color: #ffffffff; margin-top: 100px"
            v-model="agreement1"
          >
            <span style="font-size: 10px"
              >我同意并遵守<a style="color: #28c5ff"
                >《Kmeta元宇宙开放平台后台管理服务协议》</a
              ></span
            ></el-checkbox
          >
          <el-checkbox
            v-model="agreement2"
            style="color: #ffffffff; margin-top: 12px"
            ><span style="font-size: 10px"
              >已阅读并同意<a style="color: #28c5ff">《用户协议》</a>和
              <a>《隐私政策》</a>以及
              <a style="color: #28c5ff">《相关法律法规》</a></span
            ></el-checkbox
          >
          <div class="btn">
            <div
              class="loginbtn"
              id="loginbtn"
              :loading="loading"
              type="primary"
              @click="handleLogin"
            >
              注 册
            </div>
            <div class="regbtn" @click="jumpTo">已有账号登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reqRegister} from "@/api/register";

export default {
  name: "Register",

  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.formright.password !== value) {
        callback(new Error("请再次输入密码，请保持两次输入的密码一致"));
      } else {
        callback();
      }
    };
    return {
      agreement1: false,
      agreement2: false,
      loading: false,
      passwordType: "",
      passwordType1: "",
      redirect: undefined,
      formleft: {
        phone: "", //手机号
        enterprise: "", //企业名称
      },
      formright: {
        confirmPassword: "", //确认密码
        email: "", //邮箱
        password: "", //密码
      },

      rules1: {
        enterprise: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          { validator: this.validatePhone, trigger: "blur" },
        ],
      },
      rules2: {
        confirmPassword: [
          {
            required: true,
            message: "请再次确认密码",
            trigger: "blur",
          },
          { required: true, validator: equalToPassword, trigger: "blur" },
        ],
        email: [
          {
            required: true,
            message:
              "作为登录账号，请填写未被Kmeta元宇宙开放平台注册，未被个人Kmeta账号绑定的邮箱",
            trigger: "blur",
          },
          { validator: this.validateEmail, trigger: "change" },
        ],
        password: [
          {
            required: true,
            message: "字母、数字或者英文符号，最短6位，区分大小写",
            trigger: "blur",
          },
          { min: 6, message: "密码长度不少于6位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
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
    async handleLogin() {
      await this.$refs.formleft.validate((valid) => {
        if (valid) {
          this.$refs.formright.validate(async (valid2) => {
            if (valid2) {
              if (!this.agreement1 || !this.agreement2) {
                this.$message({
                  offset: 200,
                  type: "info",
                  message: "请勾选协议",
                });
                return;
              }
              this.loading = true;

              const loginForm = {
                phone: this.formleft.phone, //手机号
                confirmPassword: this.formright.confirmPassword, //确认密码
                email: this.formright.email, //邮箱
                enterprise: this.formleft.enterprise, //企业名称
                password: this.formright.password, //密码
              };
              try {
                await reqRegister(loginForm);
                await this.$alert("请查看您的邮箱完成验证", "提示", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    this.$router.push("/login");
                    this.loginForm = {};
                  },
                });
                this.loading = false;
              } catch (e) {
                console.log(e);
                this.loading = false;
              }
            }
          });
        }
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      // this.$nextTick(() => {
      //   this.$refs.password.focus();
      // });
    },
    showPwd1() {
      if (this.passwordType1 === "password") {
        this.passwordType1 = "";
      } else {
        this.passwordType1 = "password";
      }
      // this.$nextTick(() => {
      //   this.$refs.confirmPassword.focus();
      // });
    },
    jumpTo() {
      this.$router.push("/login");
    },
    // 注册
    //  async register() {
    //   try {
    //     await reqRegister();
    //     // console.log("打印的结果", result);

    //   } catch (e) {}
    // },
    // 获取邮箱验证码
    // async getEmailVerify() {
    //   try {
    //     const data2 = { email: this.formright.email };

    //     console.log(this.formright.email);
    //     await reqEmailVerify(data2);
    //     this.$message({
    //       type: "success",
    //       message: "发送成功",
    //     });
    //     // console.log("打印的结果", result);
    //   } catch (e) {}
    // },
  },
};
</script>

<!-- <style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background-image: url("./bac.png");
  background-size: cover;
  background-position: center;
  overflow: hidden;

  .bigBox {
    display: flex;

    width: 1227px;
    height: 700px;
    background-color: #a8c533;
    .left {
      display: flex;
      align-items: center;
      // justify-content: center;
      width: 500px;
      height: 700px;
      background-color: #3347c5;
      .left_inner {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        // justify-content: center;
        margin-left: 60px;
        width: 293px;
        height: 481px;
        background-color: #5a68c0;
        .title-container-top {
          width: 259px;
          height: 57px;
          background-color: #63c05a;
          img {
            width: 259px;
            height: 57px;
          }
        }
        .title-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 119px;
          height: 94px;
          margin-top: 15px;
          .title1 {
            // width: 95px;
            height: 24px;
            font-size: 24px;
            color: #ffffffff;
          }
          .title2 {
            width: 160px;
            height: 20px;
            font-size: 20px;
            color: #D5DDE0FF;
            margin-top: 98px;
          }
        }
      }
    }
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
    width: 33px;
    height: 32px;
    margin-left: 16px;
    // margin-top: 9px;
    display: inline-block;
    vertical-align: middle;
    img {
      width: 33px;
      height: 32px;
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
</style> -->

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.login-container {
  .el-input {
    display: inline-block;

    // width: 380px;
    background: rgba(55, 56, 60, 1);

    // border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(55, 56, 60, 1);
    // border-radius: 10px;
    // color: #454545;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      // padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  // .el-form-item {
  //   border: 1px solid rgba(255, 255, 255, 0.1);
  //   background: rgba(0, 0, 0, 0.1);
  //   border-radius: 5px;
  //   color: #454545;
  // }
  .el-form-item {
    // border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(55, 56, 60, 1);
    border-radius: 10px;
    // color: #454545;
    margin-bottom: 0px;
  }
}
</style>
<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

/* reset element-ui css */

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background-image: url("./bac.png");
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form-item {
    margin-top: 55px;
  }
  .el-input {
    height: 50px;
    // width: 380px;

    width: 80%;
  }
  .bigBox {
    display: flex;

    width: 1227px;
    height: 700px;
    background-image: url("./bac_inner.png");
    background-size: cover;
    background-position: center;

    .left {
      display: flex;
      align-items: center;
      // justify-content: center;
      width: 500px;
      height: 700px;
      // background-color: rgba(29, 33, 43, 0.4);
      .left_inner {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        // justify-content: center;
        margin-left: 60px;
        width: 293px;
        height: 481px;
        // background-color: #5a68c0;
        .title-container-top {
          width: 259px;
          height: 57px;
          // background-color: #63c05a;
          img {
            width: 259px;
            height: 57px;
          }
        }
        .title-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 119px;
          height: 94px;
          margin-top: 15px;
          margin-bottom: 55px;
          .title1 {
            // width: 95px;
            height: 24px;
            font-size: 24px;
            color: #ffffffff;
            font-weight: bold;
          }
          .title2 {
            width: 160px;
            height: 20px;
            font-size: 20px;
            color: #d5dde0ff;
            margin-top: 98px;
            font-weight: bold;
          }
        }
        .warn {
          width: 293px;
          height: 15px;
          font-size: 13px;
          margin-top: 59px;
          background-image: linear-gradient(
            to right,
            rgba(110, 80, 255, 1),
            rgba(25, 174, 204, 1)
          );
          color: transparent;
          -webkit-background-clip: text;
        }
      }
    }

    .right {
      width: 727px;
      height: 700px;
      display: flex;
      justify-content: center;
      align-items: center;
      // background-color: rgba(29, 33, 43, 0.8);
      .right_inner {
        height: 483px;
        width: 600px;
      }
    }
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
    width: 33px;
    height: 32px;
    margin-left: 16px;
    // margin-top: 9px;
    display: inline-block;
    vertical-align: middle;
    img {
      width: 33px;
      height: 32px;
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
  .btn {
    width: 600px;
    height: 50px;
    margin-top: 27px;
    display: flex;
    justify-content: space-between;
    .loginbtn {
      background: linear-gradient(to right, #5924ff, #20dfff);
      height: 50px;
      width: 340px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      font-size: 18px;
      color: #ffffff;
      font-weight: bold;
    }
    .regbtn {
      height: 51px;
      width: 240px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-weight: bold;
      margin-left: 20px;
      background-image: url("./border.png");
      background-size: cover;
      background-position: center;
      position: relative;
      // border: 1px solid transparent;
      // border-radius: 10px;
      // border-image: linear-gradient(to right, #5924ff, #20dfff);
      // border-image-slice: 1;
    }
  }
}
</style>
