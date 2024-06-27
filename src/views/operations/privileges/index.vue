<template>
  <div class="app-container" style="margin-right: 30px">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="requestId" label="提交人ID" width="350">
      </el-table-column>
      <!-- <el-table-column prop="nickname" label="提交人名称" width="350">
      </el-table-column> -->
      <el-table-column prop="nickname" label="星球名称" width="350">
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" width="350">
      </el-table-column>

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="approveClick(scope.row)" type="text" size="small"
            >通过</el-button
          >
          <el-button @click="refuseClick(scope.row)" type="text" size="small"
            >拒绝</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reqStarCheckList } from "@/api/check.js";
import { reqCheck } from "@/api/check.js";

export default {
  data() {
    return {
      // tableData: [
      //   {
      //     requestId: "",
      //     nickname: "",
      //     // brandName: "",
      //     applyTime: "",
      //   },
      // ],
      // 待审核星球列表数据
      tableData:null,
      // 第几页
      pageIndex: 1,
      // 每页记录数
      pageSize: 5,
      checkData: {
        // 操作 1-通过 2-拒绝
        action: "",
        // 审批意见
        comment: "",
        requestId: "",
      },
    };
  },
  mounted() {
    this.getStarCheckList();
  },
  methods: {
    async approveClick(row) {
      try {
        this.checkData.action = "1";
        this.checkData.requestId = row.requestId;
        console.log(this.checkData);
        await reqCheck(this.checkData);
        this.getStarCheckList();
      } catch (e) {}
    },
    async refuseClick(row) {
      try {
        this.$prompt("请输入审核意见", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        })
          .then(({ value }) => {
            this.checkData.comment = value;
            this.checkData.requestId = row.requestId;
            this.checkData.action = "2";
            // await  reqCheck(this.checkData)
            reqCheck(this.checkData);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入",
            });
          });
      } catch (e) {
        console.log(e);
      }
    },

    // 展示申请的品牌列表
    async getStarCheckList() {
      try {
        const result = await reqStarCheckList();
        console.log("打印的结果", result);
        this.tableData = result.data.data;
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
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
@/api/brand.js
