<template>
  <div>
    <div
      slot="header"
      class="clearfix"
      style="margin-top: 20px; margin-left: 20px"
    >
      <div class="addbtn" @click="clickAdd">添加地推券</div>
    </div>

    <div class="app-container" style="margin-right: 30px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="goodsName"
          label="商品名"
          width="150"
          align="center"
        />
        <el-table-column label="产品图" width="150" align="center">
          <template slot-scope="{ row }">
            <img style="width: 100px; height: 100px" :src="row.goodsPicture" />
          </template>
        </el-table-column>
        <el-table-column label="背景图" width="250" align="center">
          <template slot-scope="{ row }">
            <img style="width: 230px; height: 100px" :src="row.backgroundImage" />
          </template>
        </el-table-column>
        <el-table-column
          prop="originalPrice"
          label="原价"
          width="120"
          align="center"
        />
        <el-table-column label="有效时间" width="320" align="center">
          <template slot-scope="{ row }">
            {{ row.startTime }} -- {{ row.endTime }}
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
              @click="clickUpdate(scope.row)"
              icon="el-icon-edit"
              type="text"
              size="small"
              >编辑</el-button
            >
            <el-button
              @click="clickCodeList(scope.row)"
              icon="el-icon-more"
              type="text"
              size="small"
            >兑换码</el-button
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
    <el-dialog title="实物商品" :visible.sync="dialogVisible" top="2vh" :close-on-click-modal="false">
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="formData"
      >
        <el-form-item label="商品名：" prop="goodsName">
          <el-input
            v-model="formData.goodsName"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="有效时间：" prop="exchangeTime" required>
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
            <el-form-item label="原价：">
              <el-input-number
                v-model="formData.originalPrice"
                controls-position="right"
                :min="1"
                :precision="0"
              />
            </el-form-item>
        <el-form-item label="使用规则：" prop="goodsIllustrate">
          <el-input
            type="textarea"
            v-model="formData.goodsIllustrate"
            rows="4"
            style="width: 500px"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品图：" prop="goodsPicture">
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
        <el-row :gutter="22">
          <el-col :span="13">
            <el-form-item label="背景图：" prop="backgroundImage" required>
              <div class="img_con2" v-for="(i, index) in imgList2" :key="index">
                <el-image
                  class="deduct_img2"
                  :src="i"
                  :preview-src-list="[i]"
                  style="width: 450px; height: 180px"
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
        </el-row>
      </el-form>
      <div slot="footer" style="display: flex">
        <el-button class="subBtn" @click="submitForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="兑换码" :visible.sync="codeListDialogVisible" top="2vh" :before-close="codeListCancel" :close-on-click-modal="false" width="1250px">
      <div class="clearfix">
        {{dataSummary.total}} 个兑换码，已发放{{dataSummary.used}}，未发放{{dataSummary.unissued}}
      </div>

      <el-form :model="codePageQuery" ref="codePageQuery" :inline="true" style="margin-top: 25px; margin-left: 20px;">
        <el-form-item label="发放时间：">
          <el-date-picker
            v-model="codePageQuery.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @blur="codeHandleDateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号：" style="margin-left: 16px">
          <el-input v-model="codePageQuery.receivePhone" style="width: 250px"/>
        </el-form-item>
        <el-button type="primary"  icon="el-icon-search"  @click="getPersonnelCodeList" round style="margin-left: 20px;"/>
        <el-button type="primary"  icon="el-icon-download" @click="exportSendRecord" round style="margin-left: 40px;">导出</el-button>
        <el-button type="primary"  icon="el-icon-upload"  @click="clickImport" round style="margin-left: 40px;">导入兑换码</el-button>
      </el-form>

      <div class="app-container" style="margin-right: 30px">
        <el-table :data="codeTableData" border style="width: 100%">
          <el-table-column prop="usedCode" label="兑换码" width="200" align="center"/>
          <el-table-column prop="startTime" label="开始发放时间" width="180" align="center"/>
          <el-table-column prop="receivePhone" label="发放手机号" width="200" align="center"/>
          <el-table-column label="状态" width="150" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.state === 1"> 未发放 </el-tag>
              <el-tag v-if="row.state === 2" type="info"> 已发放 </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center"/>
        </el-table>
        <div class="block">
          <el-pagination
            layout="total, prev, pager, next"
            @current-change="codeHandleChangeStarPage"
            :page-size="codePageQuery.pageSize"
            :total="codeTotal">
          </el-pagination>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="导入兑换码" :visible.sync="codeDialogVisible" top="2vh" :before-close="codeCancel" :close-on-click-modal="false" width="600px">
      <el-form label-width="120px" :model="codeFormData" :rules="codeRules" ref="codeFormData">
        <el-form-item label="开始发放时间：" prop="startTime" required>
          <el-date-picker
            v-model="codeFormData.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="upload"
            drag accept=".txt"
            action=""
            :auto-upload="false"
            :on-change="handleUploadCodeChange"
            :file-list="fileList">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <div v-if="codeFormData.usedCodes && codeFormData.usedCodes.length >= 1">
            <h3>兑换码预览：{{codeFormData.usedCodes.length}}个</h3>
            <el-tag v-for="(item, index) in codeFormData.usedCodes" :key="index" style="margin-right: 30px;" >{{item}}</el-tag>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-left: 150px; display: flex">
        <el-button class="subBtn" @click="codeSubmitForm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {reqAddMarketGoods, reqGetMarketGoodsList, reqUpdateMarketGoods,} from "@/api/marketGoods";
import {reqGetDataSummary, reqGetPersonnelCodeList, reqImportUsedCode} from "@/api/coffeeVoucher";
import {getToken} from "@/utils/auth";

export default {
  data() {
    return {
      uploadModule: "promotion",
      imgList1: [],
      imgList2: [],
      dialogVisible: false,
      exchangeDialogVisible: false,
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
        goodsType: "promotion",
        goodsName: null,
      },
      tableData: null,
      formData: {
        id: null,
        goodsName: null,
        goodsType: "promotion",
        goodsPicture: null,
        goodsScore: 0,
        originalPrice: 1,
        quantity: 0,
        goodsIllustrate: null,
        backgroundImage: null,
        jumpLink: null,
        startTime: null,
        endTime: null,
        exchangeTime: [],
        state: 2
      },
      exchangePageQuery: {
        pageIndex: 1,
        pageSize: 10,
        goodsId: null,
      },
      exchangeTotal: 0,
      exchangeList: [],
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
        color: [
          { required: true, message: "请选择兑换按钮颜色", trigger: "change" },
        ],
        goodsPicture: [
          { required: true, message: "请上传产品图", trigger: "change" },
        ],
        backgroundImage: [
          { required: true, message: "请上传背景底图", trigger: "change" },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        },
      },

      codeListDialogVisible: false,
      codeDialogVisible: false,
      fileList: [],
      codeTotal: 0,
      codePageQuery: {
        pageIndex: 1,
        pageSize: 10,
        goodsId: null,
        receivePhone: null,
        date: [],
        startDate: null,
        endDate: null,
      },
      codeTableData: null,
      codeFormData: {
        goodsId: null,
        startTime: null,
        usedCodes: [],
      },
      dataSummary: {
        total: 0,
        unissued: 0,
        used: 0
      },
      codeRules: {
        startTime: [{required: true, message: "请选择开始发放时间", trigger: "change"}],
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
        goodsScore: row.goodsScore,
        originalPrice: row.originalPrice,
        quantity: row.quantity,
        goodsIllustrate: row.goodsIllustrate,
        backgroundImage: row.backgroundImage,
        color: row.color,
        jumpLink: row.jumpLink,
        startTime: row.startTime,
        endTime: row.endTime,
        exchangeTime: [row.startTime, row.endTime],
        state: row.state,
      };
      this.dialogVisible = true;
      this.imgList1[0] = row.goodsPicture;
      this.imgList2[0] = row.backgroundImage;
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
        goodsType: "goodsType",
        goodsPicture: null,
        goodsScore: 0,
        originalPrice: 1,
        quantity: 0,
        goodsIllustrate: null,
        backgroundImage: null,
        jumpLink: null,
        startTime: null,
        endTime: null,
        exchangeTime: [],
        state: 2
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
    handleColorChange(color) {
      // 假设color是一个对象，包含RGB值
      this.formData.color = this.rgbStringToHex(color).toUpperCase();
    },
    rgbStringToHex(rgbString) {
      const rgbValues = rgbString.match(/\d+/g).map(Number);
      return (
        "#" +
        rgbValues
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("")
      );
    },

    clickCodeList(row) {
      this.codePageQuery.goodsId = row.id;
      this.getPersonnelCodeList();
      this.codeListDialogVisible = true;
    },
    codeListCancel() {
      this.codeListDialogVisible = false;
    },
    async getPersonnelCodeList() {
      let param = `goodsId=${this.codePageQuery.goodsId}&pageIndex=${this.codePageQuery.pageIndex}&pageSize=${this.codePageQuery.pageSize}`;
      if (this.codePageQuery.startDate) {
        param += `&startDate=${this.codePageQuery.startDate}`;
      }
      if (this.codePageQuery.endDate) {
        param += `&endDate=${this.codePageQuery.endDate}`;
      }
      if (this.codePageQuery.receivePhone) {
        param += `&receivePhone=${this.codePageQuery.receivePhone}`;
      }
      const result = await reqGetPersonnelCodeList(param);
      this.codeTableData = result.data.data.records;
      this.codeTotal = result.data.data.total;

      const result2 = await reqGetDataSummary(param);
      this.dataSummary = result2.data.data;
    },
    codeHandleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getPersonnelCodeList();
    },
    clickImport() {
      this.codeDialogVisible = true;
    },
    codeHandleDateChange() {
      if (this.codePageQuery.date && this.codePageQuery.date.length === 0) {
        this.codePageQuery.startDate = null;
        this.codePageQuery.endDate = null;
      }else {
        // 在选择时间范围时触发的 change 事件
        this.codePageQuery.startDate = this.codePageQuery.date[0];
        this.codePageQuery.endDate = this.codePageQuery.date[1];
      }
      // 强制更新组件
      this.$forceUpdate();
    },
    exportSendRecord() {
      this.$refs.codePageQuery.validate((valid) => {
        if (valid) {
          let param = `goodsId=${this.codePageQuery.goodsId}&startDate=${this.codePageQuery.startDate}&endDate=${this.codePageQuery.endDate}`;

          // 目标路径
          const url = `${process.env.VUE_APP_BASE_API}` + '/promotionCode/exportSendRecord?' + param;

          // 请求头设置
          const headers = new Headers({
            'accessToken': getToken(),
          });

          // 发起请求
          fetch(url, {
            method: 'GET', // 请求方法
            headers: headers // 指定的请求头
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.blob(); // 将响应内容作为 Blob 对象返回
          }).then(blob => {
            let filename = "兑换码发放明细(" + this.codePageQuery.startDate + "-" + this.codePageQuery.endDate + ")";
            const url = window.URL.createObjectURL(new Blob([blob])); // 创建 Blob 对象的 URL
            const a = document.createElement('a');
            a.href = url;
            a.download = filename + '.xlsx'; // 指定下载文件的名称
            document.body.appendChild(a);
            a.click(); // 模拟点击下载链接
            window.URL.revokeObjectURL(url); // 释放 URL 对象
          })
            .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
            });
        }
      })
    },
    /** 提交按钮 */
    codeSubmitForm() {
      this.codeFormData.goodsId = this.codePageQuery.goodsId;
      reqImportUsedCode(this.codeFormData).then(() => {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.codeCancel();
        this.getPersonnelCodeList();
      });
    },
    // 取消按钮
    codeCancel() {
      this.codeDialogVisible = false;
      this.$refs.codeFormData.resetFields();
      this.fileList = [];
      this.codeFormData = {
        goodsId: null,
        startTime: null,
        usedCodes: []
      };
    },
    handleUploadCodeChange(file, fileList) {
      this.fileList = fileList.slice(-1);

      if (fileList.length > 0) {
        // 获取选中的第一个文件
        const selectedFile = fileList[0];

        // 使用 FileReader 读取文件内容
        const reader = new FileReader();

        reader.onload = (e) => {
          // 读取文件内容
          const fileContent = e.target.result;

          // 将文件内容拆分为行
          const lines = fileContent.split('\n');

          // 将每行存储到数组中
          const fileContentArray = lines.map(line => line.trim());

          // 在此处你可以使用 fileContentArray 进行后续处理，例如将其存储到组件状态中
          console.log("File content array:", fileContentArray);
          this.codeFormData.usedCodes = fileContentArray;
        };

        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        // 根据文件类型选择不同的读取方式
        if (selectedFile.raw.type.startsWith('text')) {
          reader.readAsText(selectedFile.raw, "gb2312");
        } else {
          // 如果是其他类型的文件，可以根据需要选择不同的读取方式
          reader.readAsDataURL(selectedFile.raw);
        }
      } else {
        // 清空文件内容预览
        this.codeFormData.usedCodes = [];
      }
    },
  },
};
</script>

<style scoped>
.form-item-flex {
  align-items: center; /* 垂直居中 */
}

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
.img_con2:hover .overlay {
  display: block;
}
.img_con2 {
  width: 450px;
  height: 180px;
  position: relative;
  display: flex;
  /* background-color: #b9d547; */
}
.img_con2:hover .remove_img {
  display: block;
}
.deduct_img2 {
  width: 545px;
  height: 210px;
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
