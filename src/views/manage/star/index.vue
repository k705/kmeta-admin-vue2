<template>
  <div>
    <div style="margin: 30px 0 30px 20px; font-size: 25px">创建星球</div>
    <el-form label-width="100px" :model="form" :rules="rules" ref="starForm">
      <el-form-item label="星球昵称：" prop="nickname">
        <el-input v-model="form.nickname" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="上线周期" prop="effectiveTime">
        <el-date-picker
          v-model="form.effectiveTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          @blur="handleDateChange"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="星球故事：" prop="story">
        <el-input
          v-model="form.story"
          type="textarea"
          style="width: 800px"
          :rows="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="星球描述：" prop="describe">
        <el-input
          v-model="form.describe"
          type="textarea"
          style="width: 800px"
          :rows="8"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('starForm')"
          >立即创建</el-button
        >
        <el-button @click="jumpToManage">取消创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reqCreateStar } from "@/api/createstar.js";


export default {
  data() {
    return {
      form: {
        // 星球描述
        describe: "",
        // 星球昵称
        nickname: "",
        // 星球故事
        story: "",
        ipDescribe: "1",
        ipNickname: "1",
        ipStory: "1",
        effectiveTime: [],
        startTime: "",
        endTime: "",
      },
      rules: {
        nickname: [
          { required: true, message: "请输入星球昵称", trigger: "blur" },
          { min: 1, max: 16, message: "昵称上限为16个字符", trigger: "blur" },
        ],
        story: [
          { required: true, message: "请输入星球故事", trigger: "change" },
        ],
        describe: [
          { required: true, message: "请输入星球描述", trigger: "change" },
        ],
        effectiveTime: [
          { validator: this.validateEffectiveTime, trigger: "change" }
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        }
      }
    };
  },
  mounted() {},
  methods: {
    validateEffectiveTime(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (value && value.length >= 2) {
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请选择时间范围")); // 长度不符合要求，验证失败
      }
    },
    // 创建星球提交数据
    submitForm(starForm) {
      this.$refs.starForm.validate((valid) => {
        if (valid) {
          try {
            this.$confirm("此操作将提交星球信息, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {

                this.submitStar(starForm);
                this.$message({
                  type: "success",
                  message: "创建成功!",
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消创建",
                });
              });
          } catch (e) {}
        }
      });
    },
    // 修改有效时间
    handleDateChange() {
      // 在选择时间范围时触发的 change 事件
      this.form.startTime = this.form.effectiveTime[0];
      this.form.endTime = this.form.effectiveTime[1];

      // 强制更新组件
      this.$forceUpdate();
    },
    // 展示提交星球数据
    async submitStar() {
      try {
        await reqCreateStar(this.form);
        this.$nextTick(() => {
          this.$refs.starForm.resetFields();
        });
      } catch (e) {
        console.log(e);
      }
    },

    // 取消创建跳转到管理星球页面
    jumpToManage() {
      this.$router.push("/manage/starmanage");
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}

::v-deep .el-textarea__inner {
  resize: none;
}
</style>
