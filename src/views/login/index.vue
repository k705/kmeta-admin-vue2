<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-form-inner">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container-top"><img src="./title.png" /></div>
          <div class="title-container">
            <div class="title1">开放平台</div>
            <div
            v-if="
                domain != 'admintest.kmeta.world' &&
                domain != 'admin.kmeta.world'
              "
              class="title2"
            >
              企业管理后台
            </div>
            <div v-else class="title2">系统管理后台</div>
          </div>
          <!-- <div class="input1"> -->
          <el-form-item prop="username" style="margin-top: 40px">
            <span class="svg-container">
              <!-- <svg-icon icon-class="user" /> -->
              <img src="./username.png" alt="" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入账号"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>
          <!-- </div> -->
          <el-form-item prop="password" style="margin-top: 35px">
            <span class="svg-container">
              <!-- <svg-icon icon-class="user" /> -->
              <img src="./password.png" alt="" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
          <el-checkbox
            v-model="isRemember"
            style="margin-top: 45px; color: #d5dde0; font-size: 14px"
            ><span>记住密码</span></el-checkbox
          >
          <el-checkbox
            v-if="
              domain !== 'admintest.kmeta.world' &&
              domain !== 'admin.kmeta.world'
            "
            v-model="isAgree"
            style="color: #ffffffff; margin-top: 14px"
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
              登录
            </div>
            <div
              class="regbtn"
              @click="jumpTo"
              v-if="
                domain !== 'admintest.kmeta.world' &&
                domain !== 'admin.kmeta.world'
              "
            >
              快速注册
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { authMenu } from "@/api/user";
import router, { resetRouter } from "@/router";
import store from "@/store";
import { getToken } from "@/utils/auth";
import Cookies from "js-cookie";

import { decrypt, encrypt } from "@/utils/encrypt";
import CryptoJS from "crypto-js";

export default {
  name: "Login_enterprise",
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error("Please enter the correct user name"));
    //   } else {
    //     callback();
    //   }
    // };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不少于6个字符"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入帐号" },
          // { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      isRemember: false,
      isAgree: false,
      domain: null,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },

  mounted() {
    this.isPasswordRemember();
    this.domain = window.location.host;
    let that = this; //将vue对象的引用保存在that中
    if (
      that.domain === "admintest.kmeta.world" ||
      that.domain === "admin.kmeta.world"
    ) {
      var loginbtn = document.getElementById("loginbtn");
      loginbtn.style.width = "381px";
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

    // 判断是否勾选记住密码按钮并进行操作
    remember() {
      // 登录成功后 判断是否选择了勾选密码
      if (this.isRemember) {
        //添加cookie
        Cookies.set("userName", this.loginForm.username, {
          expires: 30,
        });
        //使用crypto-js进行加密（需要npm加载后引入） 并存储到cookie中 此处user123! 为秘钥
        Cookies.set(
          "userPwd",
          CryptoJS.AES.encrypt(this.loginForm.password, "user123!"),
          {
            expires: 30, // 存储30天
          }
        );
      } else {
        // 删除cookie
        Cookies.remove("userName");
        Cookies.remove("userPwd");
      }
    },

    // 下次进来时判断cookie中的用户名和密码是否存在
    isPasswordRemember() {
      this.loginForm.username = Cookies.get("userName")
        ? Cookies.get("userName")
        : "";
      const enPassword = Cookies.get("userPwd") ? Cookies.get("userPwd") : "";
      if (enPassword) {
        // 对密码进行解密
        this.loginForm.password = CryptoJS.AES.decrypt(
          enPassword,
          "user123!"
        ).toString(CryptoJS.enc.Utf8);
        // this.loginForm.username = CryptoJS.AES.decrypt(enPassword,'user123!').toString(CryptoJS.enc.Utf8);
        // 将是否记住密码置为true
        this.isRemember = true;
      } else {
        this.loginForm.password = "";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.domain !== 'admintest.kmeta.world' && this.domain !== 'admin.kmeta.world' && !this.isAgree){
            this.$message({
              offset: 200,
              type: "info",
              message: "请勾选协议",
            });
            return;
          }
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              console.log(store.getters.token, "store.getters.token");
              // this.$store
              //   .dispatch("permission/generateRoutes")
              // .then(response => {
              //   router.addRoutes(response)
              this.remember();
              location.reload();
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            // .catch((error) => {
            //   console.log("err2", error);
            //   this.loading = false;
            // });
            // })
            .catch((error) => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 发用户权限请求，拿动态路由
    async getRouterList() {
      try {
        const result = await authMenu();
        console.log("路由", result.data.data);
      } catch (e) {}
    },

    jumpTo() {
      this.$router.push("/register");
    },
  },
};
</script>

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
    // margin-bottom: 0px;
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
  .title-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 119px;
    height: 94px;
    margin-top: 15px;
    margin-bottom: 42px;
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
      margin-top: 50px;
      font-weight: bold;
    }
  }
  .el-input {
    height: 50px;
    // width: 380px;

    width: 85%;
  }
  .login-form {
    // position: relative;
    width: 500px;
    // max-width: 100%;
    height: 720px;
    // padding: 160px 35px 0;
    // margin: 0 auto;
    // overflow: hidden;
    // background-color: rgba(22, 22, 27, 1);
    // border-radius: 20px;
    background-image: url("./bac2.png");
    background-size: cover;
    background-position: center;
    // position: relative;
    // background-color: #73bf30;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-form-inner {
      width: 380px;
      height: 517px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      // background-color: #bf9230;

      .title-container-top {
        width: 242px;
        height: 57px;
        // background-color: #73bf30;
      }

      .title-container-center {
        width: 210px;
        height: 52px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-top: 59px;
        font-size: 20px;
        color: rgba(213, 221, 224, 1);
        font-weight: bold;
        .title2 {
          margin-top: 12px;
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

  .input1 {
    width: 380px;
    height: 50px;
    margin-top: 40px;
    background-color: rgba(55, 56, 60, 1);
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
  .btn {
    width: 381px;
    height: 50px;
    margin-top: 18px;
    display: flex;
    justify-content: space-between;
    .loginbtn {
      background: linear-gradient(to right, #5924ff, #20dfff);
      height: 50px;
      width: 240px;
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
      width: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-weight: bold;

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
