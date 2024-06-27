<template>
  <div></div>
</template>

<script>
import {
  getAccessedRoutes,
  setAccessedRoutes,
  removeAccessedRoutes,
} from "@/utils/auth";

export default {
  name: "First",

  data() {
    return {
      loading: false,
    };
  },
  created() {
    // const accessedRoutes = getAccessedRoutes();
    // console.log(accessedRoutes, "cookie");
    const accessedRoutes = localStorage.getItem('routes');
    console.log(accessedRoutes, "cookie");


    // 假设你的 JSON 数据已经存储在变量 jsonData 中

    // 获取第一个元素的 path 对应的值
    const firstPathValue = JSON.parse(accessedRoutes)[0].path;
    console.log(firstPathValue, 'firstPathValue');
    this.$router.push(firstPathValue+'1')
  },
  methods: {


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
