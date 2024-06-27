<template>
  <div>
      <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 20px;">
        <div class="addbtn" @click="clickAdd">添加道具</div>
      </div>

      <div class="app-container" style="margin-top: 20px; margin-right: 30px">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="propName" label="道具" width="150" align="center"/>
          <el-table-column label="道具icon" width="120" align="center">
            <template slot-scope="{ row }">
              <img style="width: 67px; height: 89px" :src="row.propIcon">
            </template>
          </el-table-column>
          <el-table-column label="道具类型" width="200" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="propTypeEnum.some(item => item.code === row.propType)" type="info">
                {{ propTypeEnum.find(item => item.code === row.propType).desc }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="propDesc" label="道具描述" align="center"/>
          <el-table-column prop="weight" label="权重" width="150" align="center"/>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center"/>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="clickUpdate(scope.row)" icon="el-icon-edit" type="text" size="small">编辑</el-button>
              <el-button v-if="scope.row.state === 1" @click="clickPublish(scope.row)" icon="el-icon-s-promotion" type="text" size="small">发布</el-button>
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
        <el-form-item label="道具名称：" prop="propName">
          <el-input v-model="formData.propName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="道具图标：" prop="propIcon">
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
          <el-dialog :visible.sync="dialogVisible1">
            <img width="100%" :src="formData.taskIcon" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="道具类型：" prop="propType">
          <el-select v-model="formData.propType" placeholder="道具类型">
            <el-option
              v-for="item in propTypeEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.propType === 2" label="道具属性：">
          大分爆率增加<el-input-number v-model="formData.propAttribute" controls-position="right" :min="0" :precision="0" size="medium" style="width: 120px; margin-left: 10px; margin-right: 10px"/>%
        </el-form-item>
        <el-form-item v-if="formData.propType === 3" label="道具属性：">
          额外得<el-input-number v-model="formData.propAttribute" controls-position="right" :min="0" :precision="0" size="medium" style="width: 120px; margin-left: 10px; margin-right: 10px"/>K分
        </el-form-item>
        <el-form-item v-if="formData.propType === 4" label="道具属性：">
          <el-input-number v-model="formData.propAgeing" controls-position="right" :min="1" :precision="0" style="width: 120px; margin-right: 10px"/>秒内，挖矿爆率增加
          <el-input-number v-model="formData.propAttribute" controls-position="right" :min="0" :precision="0" size="medium" style="width: 120px; margin-left: 10px; margin-right: 10px"/>%
        </el-form-item>
        <el-form-item v-if="formData.propType === 5" label="道具属性：">
          连续<el-input-number v-model="formData.propAgeing" controls-position="right" :min="1" :precision="0" size="medium" style="width: 120px; margin-left: 10px; margin-right: 10px"/>颗矿石必得大分
        </el-form-item>
        <el-form-item label="权重：" prop="weight">
          <el-input-number v-model="formData.weight" controls-position="right" :min="1" :precision="0"/>
        </el-form-item>
        <el-form-item label="道具描述：" prop="propDesc">
          <el-input
            type="textarea"
            v-model="formData.propDesc"
            rows="3"
            style="width: 500px"
          ></el-input>
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

import {reqAddProp, reqDeleteProp, reqGetPropList, reqPublishProp, reqUpdateProp} from "@/api/prop";

export default {
  data() {
    return {
      dialogVisible: false,
      imgList1: [],
      dialogVisible1: false,
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: null,
      formData: {
        id: null,
        propName: null,
        propIcon: null,
        propType: 1,
        propAgeing: 0,
        propAttribute: 0,
        propDesc: null,
        weight: 1
      },
      propTypeEnum: [
        {code: 1, desc: "一键挖矿"},
        {code: 2, desc: "增加本轮大分爆率"},
        {code: 3, desc: "当前星球额外得K分"},
        {code: 4, desc: "增加倒计时爆率"},
        {code: 5, desc: "连续挖矿爆大分"},
      ],
      rules: {
        propName: [{required: true, message: "请输入道具名", trigger: "change"}],
        propIcon: [{required: true, message: "请上传道具图标", trigger: "change"}],
        propType: [{required: true, message: "请选择道具类型", trigger: "change"}],
        propDesc: [{required: true, message: "请输入道具描述", trigger: "change"}],
      },
    };
  },
  mounted() {
    this.getPropList();
  },
  methods: {
    async getPropList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
      const result = await reqGetPropList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getPropList();
    },
    clickAdd() {
      this.dialogVisible = true;
    },
    clickUpdate(row) {
      this.formData = {
        id: row.id,
        propName: row.propName,
        propIcon: row.propIcon,
        propType: row.propType,
        propAgeing: row.propAgeing,
        propAttribute: row.propAttribute,
        propDesc: row.propDesc,
        weight: row.weight
      };
      this.imgList1[0] = row.propIcon;
      this.dialogVisible = true;
    },
    clickPublish(row) {
      this.$confirm("是否确定发布？", { type: "warning" })
        .then((_) => {
          reqPublishProp({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "发布成功",
            });
            this.getPropList();
          });
        })
        .catch((_) => {});
    },
    clickDelete(row) {
      this.$confirm('确定删除道具【'+row.propName+'】吗？',{type: 'warning'})
        .then(_ => {
          reqDeleteProp({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getPropList();
          });
        }).catch(_ =>{})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.id){
            reqUpdateProp(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getPropList();
            });
          } else {
            reqAddProp(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getPropList();
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
        propName: null,
        propIcon: null,
        propType: 1,
        propAgeing: 0,
        propAttribute: 0,
        propDesc: null,
        weight: 1
      };
    },
    getUrl1(e) {
      this.imgList1.push(e);
      this.formData.propIcon = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove1(index) {
      this.imgList1.splice(index, 1);
      this.formData.propIcon = null;
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
