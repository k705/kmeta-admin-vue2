<template xmlns="">
  <div>
    <div
      slot="header"
      class="clearfix"
      style="margin-top: 20px; margin-left: 20px"
    >
      <div class="addbtn" @click="clickAdd">添加区块大奖</div>
    </div>

    <div class="app-container" style="margin-top: 20px; margin-right: 30px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="title"
          label="主题"
          width="150"
          align="center"
        />
        <el-table-column
          prop="prizeName"
          label="奖品"
          width="150"
          align="center"
        />
        <el-table-column label="奖品图" width="150" align="center">
          <template slot-scope="{ row }">
            <img style="width: 70px; height: 100px" :src="row.prizePic" />
          </template>
        </el-table-column>
        <el-table-column
          prop="blockNumber"
          label="区块个数"
          width="120"
          align="center"
        />
        <el-table-column
          prop="inventory"
          label="剩余区块"
          width="120"
          align="center"
        />
        <el-table-column
          prop="prizeNumber"
          label="奖品个数"
          width="120"
          align="center"
        />
        <el-table-column
          prop="needScore"
          label="K分/区块"
          width="120"
          align="center"
        />
        <el-table-column
          prop="quota"
          label="限购"
          width="120"
          align="center"
        />
        <el-table-column label="抢兑时间" width="320" align="center">
          <template slot-scope="{ row }">
            {{ row.exchangeStartTime }} -- {{ row.exchangeEndTime }}
          </template>
        </el-table-column>
        <el-table-column label="解密时间" width="320" align="center">
          <template slot-scope="{ row }">
            {{ row.decryptStartTime }} -- {{ row.decryptEndTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150" align="center">
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
              v-if="!(scope.row.state === 2 && Date.parse(scope.row.decryptEndTime) < Date.now())"
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
              >发布</el-button
            >
            <el-button
              v-if="scope.row.state === 1"
              @click="clickDelete(scope.row)"
              icon="el-icon-delete"
              type="text"
              size="small"
              >删除</el-button
            >
            <el-button
              v-if="scope.row.state === 2 && Date.parse(scope.row.exchangeStartTime) > Date.now()"
              @click="clickRevoke(scope.row)"
              icon="el-icon-refresh-left"
              type="text"
              size="small"
            >撤销</el-button
            >
            <el-button
              v-if="scope.row.state === 2 && Date.parse(scope.row.decryptStartTime) < Date.now()"
              @click="clickPrizeView(scope.row)"
              icon="el-icon-s-custom"
              type="text"
              size="small"
            >开奖信息</el-button>
            <el-button
              v-if="scope.row.state === 1 && scope.row.isUsedCode"
              @click="clickUsedCode(scope.row)"
              icon="el-icon-folder-add"
              type="text"
              size="small"
            >导入使用码</el-button>
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
    <el-dialog title="区块大奖" :visible.sync="dialogVisible" top="2vh" :before-close="cancel" :close-on-click-modal="false">
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="formData"
      >
        <el-form-item label="活动主题：">
          <el-input
            v-model="formData.title"
            style="width: 250px"
            :disabled = "formData.state === 2"
          ></el-input>
        </el-form-item>
        <el-form-item label="奖品：" prop="prizeName">
          <el-input
            v-model="formData.prizeName"
            style="width: 250px"
            :disabled = "formData.state === 2"
          ></el-input>
        </el-form-item>
        <el-form-item label="抢兑时间：" prop="exchangeTime" required>
          <el-date-picker
            v-model="formData.exchangeTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @blur="handleDateChange1"
            :picker-options="pickerOptions1"
            :disabled = "formData.state === 2"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="解密时间：" prop="exchangeTime" required>
          <el-date-picker
            v-model="formData.decryptTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @blur="handleDateChange2"
            :picker-options="pickerOptions2"
            :disabled = "formData.state === 2"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-row :gutter="21">
          <el-col :span="7"> -->
        <el-form-item label="区块个数：">
          <el-input-number
            v-model="formData.blockNumber"
            controls-position="right"
            :min="1"
            :precision="0"
            :disabled = "formData.state === 2"
          />
        </el-form-item>
        <!-- </el-col>
          <el-col :span="7"> -->
        <el-form-item label="奖品个数：">
          <el-input-number
            v-model="formData.prizeNumber"
            controls-position="right"
            :min="1"
            :max="formData.blockNumber"
            :precision="0"
            :disabled = "formData.state === 2"
          />
        </el-form-item>
        <!-- </el-col>
          <el-col :span="7"> -->
        <el-form-item label="每个区块K分：">
          <el-input-number
            v-model="formData.needScore"
            controls-position="right"
            :min="1"
            :precision="0"
            :disabled = "formData.state === 2"
          />
        </el-form-item>
        <el-form-item label="限购：">
          <el-input-number
            v-model="formData.quota"
            controls-position="right"
            :min="1"
            :max="formData.blockNumber"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="额外兑换：">
          <el-radio-group v-model="formData.isUsableAdditional">
            <el-radio :label="true">可用</el-radio>
            <el-radio :label="false">不可用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否需要核销：">
          <el-radio-group v-model="formData.isUsedCode">
            <el-radio :label="true">需要</el-radio>
            <el-radio :label="false">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="短信模板：">
          <el-input
            v-model="formData.smsTemplate"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <!-- </el-col>
        </el-row> -->
        <el-row :gutter="22">
          <el-col :span="8">
            <el-form-item label="奖品图片：" prop="prizePic">
              <div class="img_con" v-for="(i, index) in imgList1" :key="index">
                <el-image
                  class="deduct_img"
                  :src="i"
                  :preview-src-list="[i]"
                  style="width: 240px; height: 450px"
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
          <el-col :span="8">
            <el-form-item label="分享图片：" prop="winningSharePic">
              <div class="img_con" v-for="(i, index) in imgList3" :key="index">
                <el-image
                  class="deduct_img"
                  :src="i"
                  :preview-src-list="[i]"
                  style="width: 240px; height: 450px"
                ></el-image>
                <div class="overlay">
                  <i
                    class="el-icon-delete remove_img"
                    @click="handleRemove3(index)"
                  ></i>
                </div>
              </div>
              <UploadImg
                v-show="imgList3.length < 1"
                @get-url="getUrl3"
                :module="uploadModule"
              />
            </el-form-item>
          </el-col>
        </el-row>
          <!-- <el-col :span="6"> -->
          <el-form-item label="中奖动画：" prop="winningCartoon">
            <div
              v-show="formData.winningCartoon"
              class="deduct_img"
              id="winningCanvas"
              ref="winningCanvas"
            />
            <el-upload
              class="upload-demo"
              accept=".svga"
              :action="uploadAction"
              :headers="uploadHeaders"
              :on-change="handleUploadChange"
              :on-success="handleUploadSuccess"
              :file-list="imgList2"
            >
              <el-button class="addbtn">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <!-- </el-col> -->
        <el-form-item label="活动规则图片：">
          <div class="img_con" v-for="(i, index) in imgList4" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 240px; height: 450px"
            ></el-image>
            <div class="overlay">
              <i
                class="el-icon-delete remove_img"
                @click="handleRemove4(index)"
              ></i>
            </div>
          </div>
          <UploadImg
            v-show="imgList4.length < 1"
            @get-url="getUrl4"
            :module="uploadModule"
          />
        </el-form-item>
        <el-form-item label="活动规则：" prop="activityRule">
          <el-input
            type="textarea"
            v-model="formData.activityRule"
            rows="4"
            style="width: 500px"
            :disabled = "formData.state === 2 && Date.parse(formData.decryptEndTime) < Date.now()"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex">
        <el-button class="subBtn" @click="submitForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="开奖信息" :visible.sync="winningDialogVisible" top="2vh" :before-close="cancelWinning" :close-on-click-modal="false">
      <p style="font-weight: bold;">已开奖：{{lotteryInfo.lotteryNum}}</p>
      <p style="font-weight: bold;">未开奖：{{lotteryInfo.unLotteryNum}}</p>
      <div style="margin-top:25px;">
        中奖名单：⬇⬇⬇
      </div>
      <el-table :data="winningList" border style="margin-top:5px; width: 100%">
        <el-table-column prop="nickName" label="昵称" width="150" align="center"/>
        <el-table-column label="头像" width="100" align="center">
          <template slot-scope="{ row }">
            <el-avatar :size="50" :src="row.avatar"/>
          </template>
        </el-table-column>
        <el-table-column prop="kmetaId" label="Kmeta ID" width="150" align="center"/>
        <el-table-column prop="receiverName" label="收货人" width="150" align="center"/>
        <el-table-column prop="receiverPhone" label="收货手机号" width="150" align="center"/>
        <el-table-column prop="address" label="收货地址" align="center" show-overflow-tooltip />
        <el-table-column v-if="showWaybillNo" prop="waybillNo" label="物流单号" width="180" align="center">
          <template slot-scope="{ row, column, $index }">
            <div class="input-box" v-if="editWaybillNoId === row.id && editWaybillNo">
              <el-input size="small" @blur="handleInputBlur(row)" v-model="row.waybillNo" ></el-input>
            </div>
            <span v-else class="cell-value">{{row.waybillNo}}
              <el-button @click="handleCellClick(row)" icon="el-icon-edit-outline" type="text" size="medium"/>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="导入使用码" :visible.sync="usedCodeDialogVisible" top="2vh" :before-close="cancelUsedCode" :close-on-click-modal="false" width="600px">
      <el-form label-width="120px" :model="usedCodeForm" :rules="rules" ref="formData">
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
          <div v-if="usedCodeForm.usedCodes && usedCodeForm.usedCodes.length >= 1">
            <h3>核销码预览：{{usedCodeForm.usedCodes.length}}个</h3>
            <el-tag v-for="(item, index) in usedCodeForm.usedCodes" :key="index" style="margin-right: 30px;" >{{item}}</el-tag>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-left: 150px; display: flex">
        <el-button class="subBtn" @click="submitUsedCodeForm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqAddBlockPrize,
  reqDeleteBlockPrize,
  reqGetBlockPrizeList,
  reqLotteryInfo,
  reqPublishBlockPrize,
  reqRevokeBlockPrize,
  reqSetBlockWaybillNo,
  reqUpdateBlockPrize,
  reqUploadUsedCode,
  reqWinningList,
} from "@/api/blockPrize";

import SVGA from "svgaplayerweb";
import {getToken} from "@/utils/auth";

export default {
  data() {
    return {
      uploadModule: "market/blockPrize",
      uploadAction:
        `${process.env.VUE_APP_BASE_API}` +
        "/file/upload?module=market/blockPrize",
      uploadHeaders: {
        accessToken: getToken(),
      },
      imgList1: [],
      imgList2: [],
      imgList3: [],
      imgList4: [],
      fileList: [],
      dialogVisible: false,
      winningDialogVisible: false,
      usedCodeDialogVisible: false,
      showWaybillNo: false,
      editWaybillNo: false,
      editWaybillNoId: null,
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: null,
      formData: {
        id: null,
        title: null,
        prizeName: null,
        prizePic: null,
        blockNumber: 100,
        prizeNumber: 1,
        needScore: 1,
        quota: 1,
        winningCartoon: null,
        winningSharePic: null,
        exchangeStartTime: null,
        exchangeEndTime: null,
        decryptStartTime: null,
        decryptEndTime: null,
        exchangeTime: [],
        decryptTime: [],
        activityRule: null,
        ruleImage: null,
        state: null,
        isUsableAdditional: true,
        isUsedCode: false,
        smsTemplate: null,
      },
      usedCodeForm: {
        id: null,
        usedCodes: [],
      },
      winningList: [],
      lotteryInfo:{},
      rules: {
        prizeName: [
          { required: true, message: "请输入奖品名称", trigger: "change" },
        ],
        exchangeTime: [
          { validator: this.validateExchangeTime, trigger: "change" },
        ],
        decryptTime: [
          { validator: this.validateDecryptTime, trigger: "change" },
        ],
        prizePic: [
          { required: true, message: "请上传奖品图片", trigger: "change" },
        ],
        winningCartoon: [
          { required: true, message: "请上传中奖动画", trigger: "change" },
        ],
        winningSharePic: [
          { required: true, message: "请上传中奖分享图片", trigger: "change" },
        ],
        activityRule: [
          { required: true, message: "请填写活动规则", trigger: "change" },
        ],
      },
      pickerOptions1: {
        disabledDate(time) {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        },
      },
      pickerOptions2: {
        disabledDate: (time) => {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          if (
            !this.formData.exchangeTime ||
            this.formData.exchangeTime.length !== 2
          ) {
            return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
          }

          // 将 formData.exchangeTime[1] 转换为 Date 对象
          const exchangeEndTime = new Date(this.formData.exchangeTime[1]);
          // 检查转换后的日期是否有效
          if (isNaN(exchangeEndTime.getTime())) {
            // 如果转换失败，可能需要进行适当的处理或默认行为
            return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
          }
          // 禁用所有早于抢兑时间结束时间的日期
          return (
            time.getTime() <
            exchangeEndTime.getTime() -
              exchangeEndTime.getHours() * 3600000 -
              exchangeEndTime.getMinutes() * 60000
          );
        },
      },
    };
  },
  mounted() {
    this.getBlockPrizeList();
  },
  methods: {
    async getBlockPrizeList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
      const result = await reqGetBlockPrizeList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getBlockPrizeList();
    },
    clickAdd() {
      this.dialogVisible = true;
    },
    clickUpdate(row) {
      this.formData = {
        id: row.id,
        title: row.title,
        prizeName: row.prizeName,
        prizePic: row.prizePic,
        blockNumber: row.blockNumber,
        prizeNumber: row.prizeNumber,
        needScore: row.needScore,
        quota: row.quota,
        winningCartoon: row.winningCartoon,
        winningSharePic: row.winningSharePic,
        exchangeStartTime: row.exchangeStartTime,
        exchangeEndTime: row.exchangeEndTime,
        decryptStartTime: row.decryptStartTime,
        decryptEndTime: row.decryptEndTime,
        exchangeTime: [row.exchangeStartTime, row.exchangeEndTime],
        decryptTime: [row.decryptStartTime, row.decryptEndTime],
        activityRule: row.activityRule,
        ruleImage: row.ruleImage,
        state: row.state,
        isUsableAdditional: row.isUsableAdditional,
        isUsedCode: row.isUsedCode,
        smsTemplate: row.smsTemplate
      };
      this.dialogVisible = true;
      this.imgList1[0] = row.prizePic;
      this.imgList2[0] = row.winningCartoon;
      this.imgList3[0] = row.winningSharePic;
      this.imgList4[0] = row.ruleImage;
      if (row.winningCartoon) {
        this.playSvg(row.winningCartoon);
      }
    },
    clickPublish(row) {
      this.$confirm("是否确定发布？", { type: "warning" })
        .then((_) => {
          reqPublishBlockPrize({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "发布成功",
            });
            this.getBlockPrizeList();
          });
        })
        .catch((_) => {});
    },
    clickRevoke(row) {
      this.$confirm("是否确定撤销？", { type: "warning" })
        .then((_) => {
          reqRevokeBlockPrize({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "撤销成功",
            });
            this.getBlockPrizeList();
          });
        })
        .catch((_) => {});
    },
    clickDelete(row) {
      this.$confirm("是否确定删除？", { type: "warning" })
        .then((_) => {
          reqDeleteBlockPrize({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getBlockPrizeList();
          });
        })
        .catch((_) => {});
    },
    handleDateChange1() {
      // 在选择时间范围时触发的 change 事件
      this.formData.exchangeStartTime = this.formData.exchangeTime[0];
      this.formData.exchangeEndTime = this.formData.exchangeTime[1];
      // 设置解密时间的开始时间为抢兑时间的结束时间
      this.formData.decryptTime = [
        this.formData.exchangeTime[1],
        this.formData.exchangeTime[1],
      ];
      // 强制更新组件
      this.$forceUpdate();
      this.handleDateChange2();
    },
    handleDateChange2() {
      // 在选择时间范围时触发的 change 事件
      this.formData.decryptStartTime = this.formData.decryptTime[0];
      this.formData.decryptEndTime = this.formData.decryptTime[1];
      // 强制更新组件
      this.$forceUpdate();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          console.log('formData', this.formData)
          if (this.formData.id) {
            reqUpdateBlockPrize(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getBlockPrizeList();
            });
          } else {
            reqAddBlockPrize(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getBlockPrizeList();
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
        title: null,
        prizeName: null,
        prizePic: null,
        blockNumber: 100,
        prizeNumber: 1,
        needScore: 1,
        quota: 1,
        winningCartoon: null,
        winningSharePic: null,
        exchangeStartTime: null,
        exchangeEndTime: null,
        decryptStartTime: null,
        decryptEndTime: null,
        exchangeTime: [],
        decryptTime: [],
        activityRule: null,
        ruleImage: null,
        state: null,
        isUsableAdditional: true,
        isUsedCode: false,
        smsTemplate: null
      };
      this.imgList1 = [];
      this.imgList2 = [];
      this.imgList3 = [];
      this.imgList4 = [];
    },
    getUrl1(e) {
      this.imgList1.push(e);
      this.formData.prizePic = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove1(index) {
      this.imgList1.splice(index, 1);
      this.formData.prizePic = null;
    },
    getUrl3(e) {
      this.imgList3.push(e);
      this.formData.winningSharePic = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove3(index) {
      this.imgList3.splice(index, 1);
      this.formData.winningSharePic = null;
    },
    getUrl4(e) {
      this.imgList4.push(e);
      this.formData.ruleImage = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove4(index) {
      this.imgList4.splice(index, 1);
      this.formData.ruleImage = null;
    },
    handleUploadChange(file, fileList) {
      this.imgList2 = fileList.slice(-1);
    },
    handleUploadSuccess(response) {
      this.formData.winningCartoon = response.data;
      this.playSvg(this.formData.winningCartoon);
    },
    playSvg(svgaUrl) {
      //一定要使用$nextTick，等到页面加载完成再处理数据，否则会找不到页面元素，报Undefind的错误
      this.$nextTick(() => {
        const player = new SVGA.Player("#winningCanvas");
        const parser = new SVGA.Parser("#winningCanvas");
        parser.load(svgaUrl, function (videoItem) {
          player.setVideoItem(videoItem);
          player.startAnimation();
        });
      });
    },
    validateExchangeTime(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (value && value.length >= 2) {
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请选择抢兑时间")); // 长度不符合要求，验证失败
      }
    },
    validateDecryptTime(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (value && value.length >= 2) {
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请选择解密时间")); // 长度不符合要求，验证失败
      }
    },
    async clickPrizeView(row) {
      const result = await reqWinningList(row.id);

      this.showWaybillNo = !row.isUsedCode;
      this.winningList = result.data.data;

      const result2 = await reqLotteryInfo(row.id);
      this.lotteryInfo = result2.data.data;
      this.winningDialogVisible = true;
    },
    // 取消按钮
    cancelWinning() {
      this.winningList = [];
      this.winningDialogVisible = false;
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
          this.usedCodeForm.usedCodes = fileContentArray;
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
        this.usedCodeForm.usedCodes = [];
      }
    },
    async clickUsedCode(row) {
      this.usedCodeForm.id = row.id;
      this.usedCodeDialogVisible = true;
    },
    cancelUsedCode() {
      this.usedCodeDialogVisible = false;
      this.usedCodeForm.id = null;
      this.usedCodeForm.usedCodes = [];
      this.fileList = [];
    },
    submitUsedCodeForm() {
      reqUploadUsedCode(this.usedCodeForm).then(() => {
        this.$message({
          type: "success",
          message: "提交成功",
        });
        this.cancelUsedCode();
        this.getBlockPrizeList();
      });
    },
    //单元格点击后，显示input，并让input 获取焦点
    handleCellClick(row){
      this.editWaybillNoId = row.id;
      this.editWaybillNo = true;
    },

    //input框失去焦点事件
    handleInputBlur(row){
      this.editWaybillNoId = null;
      this.editWaybillNo = false;
      reqSetBlockWaybillNo({id: row.id, waybillNo: row.waybillNo});
    },
  },
};
</script>

<style>
.cell-container {
  display: flex;
  justify-content: space-between; /* 使内部元素分散对齐 */
}

.button-container {
  display: flex;
  align-items: center; /* 使按钮垂直居中 */
}
</style>

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
  width: 240px;
  height: 450px;
  position: relative;
  display: flex;
  /* background-color: #b9d547; */
}
.deduct_img {
  width: 180px;
  height: 180px;
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
