<template>
  <div>
    <div
      slot="header"
      class="clearfix"
      style="margin-top: 20px; margin-left: 20px"
    >
      <div class="addbtn" @click="clickAdd">添加虚拟头像</div>
    </div>

    <el-form
      :model="pageQuery"
      :inline="true"
      style="margin-top: 35px; margin-left: 20px"
    >
      <el-form-item label="商品名：">
        <el-input v-model="pageQuery.goodsName" style="width: 200px" />
      </el-form-item>
      <el-form-item label="状态：" style="margin-left: 30px">
        <el-select v-model="pageQuery.state" clearable>
          <el-option label="未发布" value="1"></el-option>
          <el-option label="已发布" value="2"></el-option>
          <el-option label="进行中" value="3"></el-option>
          <el-option label="已结束" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getMarketGoodsList"
        round
        style="margin-left: 40px"
      />
    </el-form>

    <div class="app-container" style="margin-right: 30px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="goodsName"
          label="商品名"
          width="150"
          align="center"
        />
        <el-table-column label="K集展示图" width="150" align="center">
          <template slot-scope="{ row }">
            <img
              style="width: 100px; height: 100px"
              :src="row.backgroundImage"
            />
          </template>
        </el-table-column>
        <el-table-column label="头像图" width="150" align="center">
          <template slot-scope="{ row }">
            <img style="width: 100px; height: 100px" :src="row.goodsPicture" />
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsScore"
          label="兑换所需K分"
          width="120"
          align="center"
        />
        <el-table-column
          prop="quantity"
          label="商品数量"
          width="150"
          align="center"
        />
        <el-table-column
          prop="inventory"
          label="库存"
          width="120"
          align="center"
        />
        <el-table-column label="有效时间" width="320" align="center">
          <template slot-scope="{ row }">
            {{ row.startTime }} -- {{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.state === 1"> 待发布 </el-tag>
            <el-tag v-if="row.state === 2" type="info"> 已发布 </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="250"
          align="center"
        />
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.state === 1"
              @click="clickUpdate(scope.row)"
              icon="el-icon-edit"
              type="text"
              size="small"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.state === 1"
              @click="clickPublish(scope.row)"
              icon="el-icon-s-promotion"
              type="text"
              size="small"
              >上架</el-button
            >
            <el-button
              v-if="scope.row.state === 2"
              @click="clickRevoke(scope.row)"
              icon="el-icon-refresh-left"
              type="text"
              size="small"
              >下架</el-button
            >
            <el-button
              v-if="scope.row.state === 1"
              @click="clickDelete(scope.row)"
              icon="el-icon-delete"
              type="text"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          layout="total, prev, pager, next"
          @current-change="handleChangeStarPage"
          :page-size="pageQuery.pageSize"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog title="虚拟头像" :visible.sync="dialogVisible" top="2vh" :close-on-click-modal="false">
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="formData"
      >
        <el-form-item label="头像名：" prop="goodsName">
          <el-input
            v-model="formData.goodsName"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="K集显示时间：" prop="exchangeTime" required>
          <el-date-picker
            v-model="formData.exchangeTime"
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
        <el-row :gutter="21">
          <el-col :span="7">
            <el-form-item label="商品库存：">
              <el-input-number
                v-model="formData.quantity"
                controls-position="right"
                :min="1"
                :precision="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="兑换所需K分：">
              <el-input-number
                v-model="formData.goodsScore"
                controls-position="right"
                :min="1"
                :precision="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品说明：" prop="goodsIllustrate">
          <el-input
            type="textarea"
            v-model="formData.goodsIllustrate"
            rows="4"
            style="width: 500px"
          ></el-input>
        </el-form-item>
        <el-row :gutter="21">
          <el-col :span="10">
            <el-form-item label="Banner图：" prop="backgroundImage">
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
              <UploadImg
                v-show="imgList2.length < 1"
                @get-url="getUrl2"
                :module="uploadModule"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="头像图：" prop="goodsPicture">
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
              <UploadImg
                v-show="imgList1.length < 1"
                @get-url="getUrl1"
                :module="uploadModule"
              />
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
import {
  reqAddMarketGoods,
  reqDeleteMarketGoods,
  reqGetMarketGoodsList,
  reqPublishMarketGoods,
  reqRevokeMarketGoods,
  reqUpdateMarketGoods,
} from "@/api/marketGoods";

export default {
  data() {
    return {
      uploadModule: "market/virtualAvatar",
      imgList1: [],
      imgList2: [],
      dialogVisible: false,
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
        goodsType: "virtualAvatar",
        goodsName: null,
      },
      tableData: null,
      formData: {
        id: null,
        goodsName: null,
        goodsType: "virtualAvatar",
        goodsPicture: null,
        backgroundImage: null,
        goodsScore: 1,
        quantity: 1,
        goodsIllustrate: null,
        startTime: null,
        endTime: null,
        exchangeTime: [],
      },
      rules: {
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "change" },
        ],
        exchangeTime: [
          { validator: this.validateExchangeTime, trigger: "change" },
        ],
        goodsIllustrate: [
          { required: true, message: "请填写使用规则", trigger: "change" },
        ],
        goodsPicture: [
          { required: true, message: "请上传头像图", trigger: "change" },
        ],
        backgroundImage: [
          { required: true, message: "请上传K集展示图", trigger: "change" },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        },
      },
    };
  },
  mounted() {
    this.getMarketGoodsList();
  },
  methods: {
    async getMarketGoodsList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}&goodsType=${this.pageQuery.goodsType}`;
      if (this.pageQuery.goodsName) {
        param = param + `&goodsName=${this.pageQuery.goodsName}`;
      }
      if (this.pageQuery.state) {
        param = param + `&state=${this.pageQuery.state}`;
      }
      const result = await reqGetMarketGoodsList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getMarketGoodsList();
    },
    clickAdd() {
      this.dialogVisible = true;
    },
    clickUpdate(row) {
      this.formData = {
        id: row.id,
        goodsName: row.goodsName,
        goodsType: row.goodsType,
        goodsPicture: row.goodsPicture,
        backgroundImage: row.backgroundImage,
        goodsScore: row.goodsScore,
        quantity: row.quantity,
        goodsIllustrate: row.goodsIllustrate,
        startTime: row.startTime,
        endTime: row.endTime,
        exchangeTime: [row.startTime, row.endTime],
      };
      this.dialogVisible = true;
      this.imgList1[0] = row.goodsPicture;
      this.imgList2[0] = row.backgroundImage;
    },
    clickPublish(row) {
      this.$confirm("是否确定发布上架？", { type: "warning" })
        .then((_) => {
          reqPublishMarketGoods({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "发布成功",
            });
            this.getMarketGoodsList();
          });
        })
        .catch((_) => {});
    },
    clickRevoke(row) {
      this.$confirm("是否确定撤销下架？", { type: "warning" })
        .then((_) => {
          reqRevokeMarketGoods({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "撤销成功",
            });
            this.getMarketGoodsList();
          });
        })
        .catch((_) => {});
    },
    clickDelete(row) {
      this.$confirm("是否确定删除？", { type: "warning" })
        .then((_) => {
          reqDeleteMarketGoods({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getMarketGoodsList();
          });
        })
        .catch((_) => {});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            reqUpdateMarketGoods(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getMarketGoodsList();
            });
          } else {
            reqAddMarketGoods(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getMarketGoodsList();
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
      this.formData = {
        id: null,
        goodsName: null,
        goodsType: "virtualAvatar",
        goodsPicture: null,
        backgroundImage: null,
        goodsScore: null,
        quantity: 1,
        goodsIllustrate: null,
        startTime: null,
        endTime: null,
        exchangeTime: [],
      };
      this.imgList1 = [];
      this.imgList2 = [];
    },
    getUrl1(e) {
      this.imgList1.push(e);
      this.formData.goodsPicture = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove1(index) {
      this.imgList1.splice(index, 1);
      this.formData.goodsPicture = null;
    },
    getUrl2(e) {
      this.imgList2.push(e);
      this.formData.backgroundImage = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove2(index) {
      this.imgList2.splice(index, 1);
      this.formData.backgroundImage = null;
    },
    validateExchangeTime(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (value && value.length >= 2) {
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请选择有效时间")); // 长度不符合要求，验证失败
      }
    },
    handleDateChange() {
      // 在选择时间范围时触发的 change 事件
      this.formData.startTime = this.formData.exchangeTime[0];
      this.formData.endTime = this.formData.exchangeTime[1];
      // 强制更新组件
      this.$forceUpdate();
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
  width: 150px;
  height: 150px;
  position: relative;
  display: flex;
  /* background-color: #b9d547; */
}
.deduct_img {
  width: 150px;
  height: 150px;
  /* margin-right: 10px; */
  /* margin-bottom: 10px; */
}
.remove_img {
  position: absolute;
  right: 45%;
  top: 50%;
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
  width: 120px;
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
