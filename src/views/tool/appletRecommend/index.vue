<template>
  <div>
      <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 20px;">
        <div class="addbtn" @click="clickAdd">添加道具</div>
      </div>

      <div class="app-container" style="margin-top: 20px; margin-right: 30px">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="title" label="标题" width="200" align="center"/>
          <el-table-column prop="subtitle" label="副标题" width="200" align="center"/>
          <el-table-column prop="button" label="按钮文案" width="150" align="center"/>
          <el-table-column prop="score" label="K分" width="150" align="center"/>
          <el-table-column label="图片" width="120" align="center">
            <template slot-scope="{ row }">
              <img style="width: 67px; height: 89px" :src="row.picture">
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="clickUpdate(scope.row)" icon="el-icon-edit" type="text" size="small">编辑</el-button>
              <el-button @click="clickDelete(scope.row)" icon="el-icon-delete" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            layout="total, prev, pager, next"
            @current-change="handleChangeStarPage"
            :page-size="pageQuery.pageSize"
            :total="total">
          </el-pagination>
        </div>
      </div>
    <el-dialog title="道具信息" :visible.sync="dialogVisible" top="10vh" :close-on-click-modal="false">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="formData.title" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="副标题：" prop="subtitle">
          <el-input v-model="formData.subtitle" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="按钮文案：" prop="button">
          <el-input v-model="formData.button" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="K分：" prop="weight">
          <el-input-number v-model="formData.score" controls-position="right" :min="1" :precision="0"/>
        </el-form-item>
        <el-form-item label="图片：" prop="picture">
          <div class="img_con" v-for="(i, index) in imgList1" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 134px; height: 178px"
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
      </el-form>
      <div slot="footer" style="display: flex;">
        <el-button class="subBtn" @click="submitForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  reqAddAppletRecommend,
  reqDeleteAppletRecommend,
  reqGetAppletRecommendList,
  reqUpdateAppletRecommend
} from "@/api/appletRecommend";

export default {
  data() {
    return {
      dialogVisible: false,
      imgList1: [],
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: null,
      formData: {
        id: null,
        title: null,
        subtitle: null,
        button: null,
        score: 0,
        picture: null
      },
      rules: {
        title: [{required: true, message: "请输入标题", trigger: "change"}],
        subtitle: [{required: true, message: "请输入副标题", trigger: "change"}],
        button: [{required: true, message: "请输入按钮文案", trigger: "change"}],
        picture: [{required: true, message: "请上传图片", trigger: "change"}],
      },
    };
  },
  mounted() {
    this.getAppletRecommendList();
  },
  methods: {
    async getAppletRecommendList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
      const result = await reqGetAppletRecommendList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getAppletRecommendList();
    },
    clickAdd() {
      this.dialogVisible = true;
    },
    clickUpdate(row) {
      this.formData = {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        button: row.button,
        score: row.score,
        picture: row.picture
      };
      this.imgList1[0] = row.picture;
      this.dialogVisible = true;
    },
    clickDelete(row) {
      this.$confirm('是否确定删除？',{type: 'warning'})
        .then(_ => {
          reqDeleteAppletRecommend({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getAppletRecommendList();
          });
        }).catch(_ =>{})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.id){
            reqUpdateAppletRecommend(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getAppletRecommendList();
            });
          } else {
            reqAddAppletRecommend(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getAppletRecommendList();
            });
          }
          this.dialogVisible = false;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
      this.$refs.formData.resetFields();
      this.imgList1 = [];
      this.formData = {
        id: null,
        title: null,
        subtitle: null,
        button: null,
        score: 0,
        picture: null
      };
    },
    getUrl1(e) {
      this.imgList1.push(e);
      this.formData.picture = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove1(index) {
      this.imgList1.splice(index, 1);
      this.formData.picture = null;
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
  display: flex;
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

.content-container {
  display: flex;
  justify-content: space-between;
}

.addbtn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 38px;
  width: 93px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 18px;
  color: #ffffff;
  font-weight: bold;
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
