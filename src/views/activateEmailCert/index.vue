<template>
  <div class="login-container">
    <div class="bigBox">
      <div class="bigBox_inner">
        <div class="title-container-top">
          <img src="./kmeta.png" />
        </div>
        <div class="title-container" v-if="activateEmail.isActivate">
          <div class="title">您的账号已成功激活</div>
          <!-- <div class="title">点击下方按钮进行登录</div> -->
        </div>
        <div class="title-container" v-else>
          <div class="title">链接已失效</div>
          <div class="title">点击下方按钮再次发送</div>
        </div>

        <div
          class="loginbtn"
          :loading="loading"
          @click="getSendEmailVerify"
          v-if="!activateEmail.isActivate"
        >
          再次发送
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqActivateEmail, reqSendEmailVerify } from "@/api/activateEmail";
import { removeToken } from "@/utils/auth";

export default {
  name: "Register",

  data() {
    return {
      loading: false,
      emailData: {
        certificate: "",
      },
      activateEmail: {
        email: "", //邮箱	string
        isActivate: "", //	是否成功激活	boolean
        scene: "", //	验证场景 1-注册 2-企业认证
      },
    };
  },
  mounted() {
    // 获取当前页面的 URL
    var currentURL = window.location.href;
    // 使用 URLSearchParams 获取参数值
    var urlParams = new URLSearchParams(currentURL.split("?")[1]);
    var parameterValue = urlParams.get("p");
    console.log(parameterValue, "parameterValue");
    this.getActivateEmail(parameterValue);
  },
  methods: {
   
    async getActivateEmail(parameterValue) {
      this.emailData.certificate = parameterValue;
      try {
        const result = await reqActivateEmail(this.emailData);
        console.log("打印的结果", result);
        this.activateEmail = result.data.data;
      } catch (e) {}
    },
    async getSendEmailVerify() {
      try {
        const result = await reqSendEmailVerify(this.activateEmail);
        console.log("打印的结果", result);
        this.$alert("发送成功，请查看您的邮箱完成验证", "提示", {
          confirmButtonText: "确定",

        });
      } catch (e) {
        this.$alert("发送失败，请重新发送", "提示", {
          confirmButtonText: "确定",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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

  .bigBox {
    display: flex;

    justify-content: center;
    align-items: center;
    width: 500px;
    height: 720px;
    background-color: rgba(2, 4, 7, 0.8);
    .bigBox_inner {
      width: 380px;
      height: 400px;
      // background: #20dfff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .title-container-top {
        width: 259px;
        height: 58px;
        img {
          width: 259px;
          height: 58px;
        }
      }
      .title-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 52px;
        margin-top: 119px;
        .title {
          // width: 95px;
          height: 24px;
          font-size: 20px;
          color: #ffffffff;
          font-weight: bold;
        }
      }
      .loginbtn {
        background: linear-gradient(to right, #5924ff, #20dfff);
        height: 50px;
        width: 380px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        font-size: 22px;
        color: #ffffff;
        font-weight: bold;
        margin-top: 120px;
      }
    }
  }
}
</style>
