<template>
  <div class="box">
    <!--  -1 待提交资料 -->
    <div class="innerBox" v-if="homeState.state == -1">
      <div class="innerText">
        <div>没有查看当前页面的权限</div>
        <div>通过企业认证后，才可开启权限</div>
      </div>
      <div class="loginbtn" :loading="loading" @click="jumpTo">企业认证</div>
    </div>
    <!--  0-邮箱待验证 -->
    <div class="innerBox" v-if="homeState.state == 0">
      <div class="innerText">
        <div>邮箱待验证</div>
        <div>请前往邮箱验证</div>
      </div>
    </div>
    <!-- 1-待审核 -->
    <div class="innerBox" v-if="homeState.state == 1">
      <div class="innerText">
        <div>您提交的资料正在审核中</div>
        <div>通过审核后，才可开启权限</div>
      </div>
    </div>
    <!-- 2-审核通过 -->
    <div class="innerBox" v-if="homeState.state == 2">
      <div class="innerText">
        <div>审核通过</div>
        <div>请使用管理员账号登录</div>
      </div>
    </div>
    <!--3-审核不通过  -->
    <div class="innerBox" v-if="homeState.state == 3">
      <div class="innerText">
        <div>审核不通过,请重新填写资料</div>
        <div>原因：<span style="color: red;">{{ homeState.remark }}</span></div>
      </div>
      <div class="loginbtn" :loading="loading" @click="jumpTo">
        修改企业认证
      </div>
    </div>
  </div>
</template>

<script>
import { reqGetApplyState } from "@/api/home";


export default {
  name: "HomeCert",

  data() {
    return {
      loading: false,

      homeState: {
        remark: "", //	备注	string
        state: "", //		状态 -1 待提交资料 0-邮箱待验证 1-待审核 2-审核通过 3-审核不通过
      },
    };
  },
  mounted() {
    this.getApplyState();
  },
  methods: {
    async getApplyState() {
      const result = await reqGetApplyState();
      this.homeState = result.data.data;
      console.log(this.homeState);
      // console.log(result);
    },

    jumpTo() {
      this.$router.push("/certification");
    },
    
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 90vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.innerBox {
  // background-color: #ad3333;
  height: 156px;
  width: 336px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  // margin: auto;
  .innerText {
    font-size: 24px;
    font-weight: bold;
    height: 66px;
    width: 336px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    align-items: center;
  }
}
.loginbtn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 50px;
  width: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 18px;
  color: #ffffff;
  margin-top: 40px;
  font-weight: bold;
}
</style>
