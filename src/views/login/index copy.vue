<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Kmeta 元宇宙</h3>
        <h3 class="title">开放平台后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
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
      <el-checkbox>记住账号</el-checkbox>
      <el-checkbox
        >已阅读并同意<a>《用户协议》</a>和 <a>《隐私政策》</a>以及
        <a>《相关法律法规》</a></el-checkbox
      >
      <div
        style="display: flex; justify-content: space-between; margin: 30px 0"
      >
        <el-button
          :loading="loading"
          type="primary"
          style="width: 60%"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
        <el-button

          type="primary"
          style="width: 35%"
          @click="jumpTo"
          >快速注册</el-button
        >
      </div>
      <div class="tips">
        <a style="margin-right: 20px">忘记密码</a>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { authMenu } from "@/api/user";
import router, { resetRouter } from '@/router'


export default {
  name: "Login",
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
          { required: true, trigger: "blur" },
          // { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
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
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$store
                .dispatch("permission/generateRoutes")
              .then(response => {
                router.addRoutes(response)
              this.$router.push({ path: this.redirect || "/" });

                  this.loading = false;
                })
                .catch((error) => {
                  console.log("err2", error);
                  this.loading = false;
                });
            })
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
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
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
