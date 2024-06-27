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
            >查看</el-button
          >
          <!-- <el-button @click="refuseClick(scope.row)" type="text" size="small"
            >拒绝</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="星球审核"
      :visible.sync="dialogFormVisible"
      top="1vh"
      :before-close="cancel"
    >
      <el-form label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="星球昵称：" prop="nickname">
          <el-input
            v-model="form.nickname"
            style="width: 230px"
            disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="上线周期：">
          <el-date-picker
            v-model="form.effectiveTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            disabled="disabled"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="星球故事：" prop="story">
          <el-input
            disabled="disabled"
            v-model="form.story"
            type="textarea"
            style="width: 400px"
            :rows="7"
          ></el-input>
        </el-form-item>
        <el-form-item label="星球描述：" prop="describe">
          <el-input
            disabled="disabled"
            v-model="form.describe"
            type="textarea"
            style="width: 400px"
            :rows="7"
          ></el-input>
        </el-form-item>
        <el-form-item label="审核：" prop="action">
          <el-select v-model="form.action" placeholder="是否通过">
            <el-option label="通过" value="1"></el-option>
            <el-option label="拒绝" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见：" prop="comment">
          <el-input
            v-model="form.comment"
            type="textarea"
            style="width: 400px"
            :rows="3"
          ></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col>
            <el-form-item label=" 星球头像：" prop="avatar">
              <div class="img_con" v-for="(i, index) in imgList1" :key="index">
                <el-image
                  class="deduct_img"
                  :src="i"
                  :preview-src-list="[i]"
                ></el-image>
                <div class="overlay">
                  <i
                    class="el-icon-delete remove_img"
                    @click="handleRemove1(index)"
                  ></i>
                </div>
              </div>
              <UploadImg v-show="imgList1.length < 1" @get-url="getUrl1" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="星球矿石" prop="orePic">
              <div class="img_con" v-for="(i, index) in imgList2" :key="index">
                <el-image
                  class="deduct_img"
                  :src="i"
                  :preview-src-list="[i]"
                ></el-image>
                <div class="overlay">
                  <i
                    class="el-icon-delete remove_img"
                    @click="handleRemove2(index)"
                  ></i>
                </div>
              </div>
              <UploadImg v-show="imgList2.length < 1" @get-url="getUrl2" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="星球背景：" prop="background">
              <div class="img_con2" v-for="(i, index) in imgList3" :key="index">
                <el-image
                  class="deduct_img2"
                  :src="i"
                  :preview-src-list="[i]"
                ></el-image>
                <div class="overlay2">
                  <i
                    class="el-icon-delete remove_img2"
                    @click="handleRemove3(index)"
                  ></i>
                </div>
              </div>
              <UploadImg v-show="imgList3.length < 1" @get-url="getUrl3" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="display: flex">
        <el-button class="subBtn" @click="submitForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqStarApprove, reqStarCheckList } from "@/api/check.js";

export default {
  data() {
    return {
      dialogFormVisible: false,
      imgList1: [],
      imgList2: [],
      imgList3: [],
      loading: false,
      // 审核星球数据
      form: {
        avatar: "", //星球头像
        orePic: "", //	星球矿石图片
        background: "", //	背景图片
        // 星球描述
        describe: "",
        starId: "", //	星球id
        // ipDescribe: "1",
        // ipNickname: "1",
        // ipStory: "1",
        // 操作 1-通过 2-拒绝
        action: "2",
        // 审批意见
        comment: "", //
        requestId: "",
        effectiveTime: [],
      },
      rules: {
        avatar: [
          { required: true, message: "请上传星球头像", trigger: "change" },
        ],
        orePic: [
          { required: true, message: "请上传星球矿石图片", trigger: "change" },
        ],
        background: [
          { required: true, message: "请上传星球背景图片", trigger: "change" },
        ],
      },
      // 待审核星球列表数据
      tableData: null,
      // 第几页
      pageIndex: 1,
      // 每页记录数
      pageSize: 5,
    };
  },
  mounted() {
    this.getStarCheckList();
  },
  methods: {
    //upload函数
    getUrl1(e) {
      this.imgList1.push(e);
      this.form.avatar = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    getUrl2(e) {
      this.imgList2.push(e);
      this.form.orePic = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    getUrl3(e) {
      this.imgList3.push(e);
      this.form.background = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove1(index) {
      this.imgList1.splice(index, 1);
    },
    handleRemove2(index) {
      this.imgList2.splice(index, 1);
    },
    handleRemove3(index) {
      this.imgList3.splice(index, 1);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          reqStarApprove(this.form).then((response) => {
            this.$message({
              type: "success",
              message: "审核成功",
            });
            this.dialogFormVisible = false;
            this.cancel();
            this.getStarCheckList();
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
      this.form = {
        avatar: "", //星球头像
        orePic: "", //	星球矿石图片
        background: "", //	背景图片
        describe: "", // 星球描述
        starId: "", //	星球id
        action: "2",
        comment: "", // 审批意见
        requestId: "",
        effectiveTime: [],
      };
      this.imgList1 = [];
      this.imgList2 = [];
      this.imgList3 = [];
    },
    // 查看按钮
    async approveClick(row) {
      try {
        this.form.requestId = row.requestId;
        this.form.describe = row.describe;
        this.form.nickname = row.nickname;
        this.form.story = row.story;
        this.form.starId = row.starId;
        this.form.effectiveTime = [row.startTime, row.endTime];
        if (row.avatar) {
          this.form.avatar = row.avatar;
          this.imgList1[0] = row.avatar;
        }
        if (row.orePic) {
          this.form.orePic = row.orePic;
          this.imgList2[0] = row.orePic;
        }
        if (row.background) {
          this.form.background = row.background;
          this.imgList3[0] = row.background;
        }
        this.dialogFormVisible = true;
      } catch (e) {}
    },

    // 展示申请的品牌列表
    async getStarCheckList() {
      try {
        const result = await reqStarCheckList();
        this.tableData = result.data.data;
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s;
  display: none;
}

.img_con:hover .overlay {
  display: block;
}
.img_con {
  width: 120px;
  position: relative;
  display: flex;
  /* background-color: #b9d547; */
}
.deduct_img {
  width: 120px;
  height: 120px;
  /* margin-right: 10px; */
  /* margin-bottom: 10px; */
}

.remove_img {
  position: absolute;
  right: 45%;
  top: 45%;
  display: none;
  color: #fff;
  cursor: pointer;
}
.img_con:hover .remove_img {
  display: block;
}
.overlay2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s;
  display: none;
}

.img_con2:hover .overlay2 {
  display: block;
}
.img_con2 {
  width: 300px;
  position: relative;
  display: flex;
  /* background-color: #b9d547; */
}
.deduct_img2 {
  width: 300px;
  height: 620px;
  /* margin-right: 10px; */
  /* margin-bottom: 10px; */
}

.remove_img2 {
  position: absolute;
  right: 45%;
  top: 45%;
  display: none;
  color: #fff;
  cursor: pointer;
}
.img_con2:hover .remove_img2 {
  display: block;
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
::v-deep .el-textarea__inner {
  resize: none;
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
.cancelBtn:hover {
  background-color: transparent;
}
</style>
