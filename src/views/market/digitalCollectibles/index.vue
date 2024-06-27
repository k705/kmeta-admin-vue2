<template>
  <div>
    <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 20px;">
      <div class="addbtn" @click="clickAddSeries">添加NFT系列</div>
    </div>

    <div class="app-container" style="margin-top: 20px; margin-right: 30px">
      <el-table :data="seriesTableData" border style="width: 100%">
        <el-table-column prop="series" label="系列" align="center"/>
        <el-table-column label="缩略图" align="center">
          <template slot-scope="{ row }">
            <img style="width: 65px; height: 100px" :src="row.thumbnail">
          </template>
        </el-table-column>
        <el-table-column label="按钮图标" align="center">
          <template slot-scope="{ row }">
            <img style="width: 100px; height: 100px" :src="row.buttonIcon">
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center">
          <template slot-scope="{ row }">
            <el-tag
              v-for="(label, index) in JSON.parse(row.labels)"
              :key="index"
              style="margin-top: 5px;"
              :color="label.bgColor"
              :style="{ color: label.typefaceColor }"
              >
              {{label.tag}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序值" align="center"/>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="clickSeriesUpdate(scope.row)" icon="el-icon-edit" type="text" size="small">编辑</el-button>
            <el-button @click="clickNft(scope.row)" icon="el-icon-setting" type="text" size="small">NFT管理</el-button>
            <el-button @click="clickSeriesDelete(scope.row)" icon="el-icon-delete" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="NFT系列" :visible.sync="seriesDialogVisible" top="2vh" :close-on-click-modal="false" width="1000px" :before-close="seriesCancel">
      <el-form label-width="120px" :model="seriesFormData" :rules="rules2" ref="seriesFormData">
        <el-form-item label="NFT系列：" prop="series">
          <el-input v-model="seriesFormData.series" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="标签：" prop="dynamicTags">
          <el-tag
            :key="index"
            v-for="(item, index) in seriesFormData.dynamicTags"
            :closable = "true"
            :disable-transitions="false"
            :color="item.bgColor"
            :style="{ color: item.typefaceColor }"
            @click="handleTagClick2(index)"
            @close="handleClose2(index)">
            {{item.tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible2"
            v-model="inputValue2"
            ref="saveTagInput2"
            size="small"
            @keyup.enter.native="handleInputConfirm2"
            @blur="handleInputConfirm2"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput2">+ New Tag</el-button>
        </el-form-item>
        <el-row :gutter="22" v-if="seriesFormData.dynamicTagsIndex || seriesFormData.dynamicTagsIndex === 0">
          <el-col :span="10">
            <el-form-item
              label="标签颜色："
              class="form-item-flex">
              <el-input v-model="seriesFormData.dynamicTags[seriesFormData.dynamicTagsIndex].bgColor" style="width: 150px" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="字体颜色："
              class="form-item-flex">
              <el-input v-model="seriesFormData.dynamicTags[seriesFormData.dynamicTagsIndex].typefaceColor" style="width: 150px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="缩略图：" prop="thumbnail">
          <div class="img_con" v-for="(i, index) in imgList4" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 157px; height: 250px"
            ></el-image>
            <div class="overlay">
              <i
                class="el-icon-delete remove_img"
                @click="handleRemove4(index)"
              ></i>
            </div>
          </div>
          <UploadImg v-show="imgList4.length < 1" @get-url="getUrl4" :module="uploadModule"/>
        </el-form-item>
        <el-form-item label="按钮图标：" prop="buttonIcon">
          <div class="img_con" v-for="(i, index) in imgList5" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 177px; height: 177px"
            ></el-image>
            <div class="overlay">
              <i
                class="el-icon-delete remove_img"
                @click="handleRemove5(index)"
              ></i>
            </div>
          </div>
          <UploadImg v-show="imgList5.length < 1" @get-url="getUrl5" :module="uploadModule"/>
        </el-form-item>
        <el-form-item label="排序(小优先)：" >
          <el-input-number v-model="seriesFormData.sort" controls-position="right" :min="1" :precision="0"/>
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex;">
        <el-button class="subBtn" @click="submitSeriesForm">确 定</el-button>
        <el-button class="cancelBtn" @click="seriesCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="数字藏品" :visible.sync="nftDialogVisible" top="2vh" :close-on-click-modal="false" width="80%" :before-close="cancelNft">
      <div class="addbtn" @click="clickAdd">添加数字藏品</div>

      <el-form :model="pageQuery" :inline="true" style="margin-top: 35px; margin-left: 20px;">
        <el-form-item label="藏品名：">
          <el-input v-model="pageQuery.collectiblesName" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="状态：" style="margin-left: 30px;">
          <el-select v-model="pageQuery.state" clearable>
            <el-option label="未发布" value="1"></el-option>
            <el-option label="已发布" value="2"></el-option>
            <el-option label="进行中" value="3"></el-option>
            <el-option label="已结束" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary"  icon="el-icon-search"  @click="getDigitalCollectiblesList" round style="margin-left: 40px;"/>
      </el-form>

      <div class="app-container" style="margin-right: 30px">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="collectiblesName" label="藏品名" width="150" align="center"/>
          <el-table-column label="藏品展示图" width="150" align="center">
            <template slot-scope="{ row }">
              <img style="width: 100px; height: 100px" :src="row.displayImage">
            </template>
          </el-table-column>
          <el-table-column label="藏品卡片图" width="150" align="center">
            <template slot-scope="{ row }">
              <img style="width: 65px; height: 100px" :src="row.cardImage">
            </template>
          </el-table-column>
          <el-table-column label="稀有级别" width="150" align="center">
            <template slot-scope="{ row }">
              <el-tag type="success">{{row.rarityLevel}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="兑换所需K分" width="120" align="center"/>
          <el-table-column prop="collectiblesCode" label="藏品证书编号" width="200" align="center"/>
          <el-table-column prop="quantity" label="藏品数量" width="150" align="center"/>
          <el-table-column prop="inventory" label="剩余藏品" width="120" align="center"/>
          <el-table-column label="标签" width="300" align="center">
            <template slot-scope="{ row }">
              <el-tag
                :key="index"
                style="margin-top: 5px;"
                type="info"
                v-for="(tag, index) in row.tags.split(',')">
                {{tag}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="兑换时间" width="320" align="center">
            <template slot-scope="{ row }">
              {{row.startTime}} -- {{row.endTime}}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="200" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.state === 1">
                待发布
              </el-tag>
              <el-tag v-if="row.state === 2" type="info">
                已发布
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="250" align="center"/>
          <el-table-column fixed="right" width="200" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.state === 1" @click="clickUpdate(scope.row)" icon="el-icon-edit" type="text" size="small">编辑</el-button>
              <el-button v-if="scope.row.state === 1" @click="clickPublish(scope.row)" icon="el-icon-s-promotion" type="text" size="small">发布</el-button>
              <el-button v-if="scope.row.state === 2" @click="clickRevoke(scope.row)" icon="el-icon-refresh-left" type="text" size="small">下架</el-button>
              <el-button v-if="scope.row.state === 1" @click="clickDelete(scope.row)" icon="el-icon-delete" type="text" size="small">删除</el-button>
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
    </el-dialog>

    <el-dialog title="数字藏品" :visible.sync="dialogVisible" top="2vh" :close-on-click-modal="false" width="1000px" :before-close="cancel">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="藏品名：" prop="collectiblesName">
          <el-input v-model="formData.collectiblesName" style="width: 250px"></el-input>
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
        <!-- <el-row :gutter="21"> -->
          <!-- <el-col :span="7"> -->
            <el-form-item label="稀有级别：" prop="rarityLevel">
              <el-select v-model="formData.rarityLevel" @change="changeRarityLevel">
                <el-option
                  v-for="item in rarityLevelEnum"
                  :key="item.code"
                  :label="item.desc"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="7"> -->
            <el-form-item label="藏品数量：">
              <el-input-number v-model="formData.quantity" controls-position="right" :min="1" :precision="0"/>
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="7"> -->
            <el-form-item label="兑换所需K分：">
              <el-input-number v-model="formData.score" controls-position="right" :min="1" :precision="0"/>
            </el-form-item>
          <!-- </el-col> -->
        <!-- </el-row> -->
        <el-form-item label="创作者：" prop="creator">
          <el-input v-model="formData.creator" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="发行方：" prop="issuer">
          <el-input v-model="formData.issuer" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="标签：" prop="dynamicTags">
          <el-tag
            :key="index"
            v-for="(item, index) in formData.dynamicTags"
            :closable = "index !== 0 || !formData.rarityLevel"
            :disable-transitions="false"
            :color="item.bgColor"
            :style="{ color: item.typefaceColor }"
            @click="handleTagClick(index)"
            @close="handleClose(index)">
            {{item.tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
        <el-row :gutter="22" v-if="formData.dynamicTagsIndex || formData.dynamicTagsIndex === 0">
          <el-col :span="10">
            <el-form-item
              label="标签颜色："
              class="form-item-flex">
              <el-input v-model="formData.dynamicTags[formData.dynamicTagsIndex].bgColor" style="width: 150px" />
<!--              <el-row :gutter="10">-->
<!--                <el-col :span="11">-->
<!--                  <el-input v-model="formData.dynamicTags[formData.dynamicTagsIndex].bgColor" style="width: 150px" />-->
<!--                </el-col>-->
<!--                <el-col :span="1">-->
<!--                  <el-color-picker-->
<!--                    v-model="formData.dynamicTags[formData.dynamicTagsIndex].bgColor"-->
<!--                    @active-change="handleColorChange"-->
<!--                  />-->
<!--                </el-col>-->
<!--              </el-row>-->
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="字体颜色："
              class="form-item-flex">
              <el-input v-model="formData.dynamicTags[formData.dynamicTagsIndex].typefaceColor" style="width: 150px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="藏品简介：" prop="synopsis">
          <el-input
            type="textarea"
            v-model="formData.synopsis"
            rows="4"
            style="width: 500px"
          ></el-input>
        </el-form-item>
        <el-row :gutter="22">
          <el-col :span="10">
            <el-form-item label="展示图：" prop="displayImage">
              <div class="img_con" v-for="(i, index) in imgList1" :key="index">
                <el-image
                  class="deduct_img"
                  :src="i"
                  :preview-src-list="[i]"
                  style="width: 240px; height: 198px"
                ></el-image>
                <div class="overlay">
                  <i
                    class="el-icon-delete remove_img"
                    @click="handleRemove1(index)"
                  ></i>
                </div>
              </div>
              <UploadImg v-show="imgList1.length < 1" @get-url="getUrl1" :module="uploadModule"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="卡片图：" prop="cardImage">
              <div class="img_con" v-for="(i, index) in imgList2" :key="index">
                <el-image
                  class="deduct_img"
                  :src="i"
                  :preview-src-list="[i]"
                  style="width: 240px; height: 388px"
                ></el-image>
                <div class="overlay">
                  <i
                    class="el-icon-delete remove_img"
                    @click="handleRemove2(index)"
                  ></i>
                </div>
              </div>
              <UploadImg v-show="imgList2.length < 1" @get-url="getUrl2" :module="uploadModule"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="蒙层：">
          <div class="img_con" v-for="(i, index) in imgList3" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 240px; height: 388px"
            ></el-image>
            <div class="overlay">
              <i
                class="el-icon-delete remove_img"
                @click="handleRemove3(index)"
              ></i>
            </div>
          </div>
          <UploadImg v-show="imgList3.length < 1" @get-url="getUrl3" :module="uploadModule"/>
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
  reqAddDigitalCollectibles, reqAddNftSeries,
  reqDeleteDigitalCollectibles, reqDeleteNftSeries,
  reqGetDigitalCollectiblesList, reqGetNftSeries,
  reqPublishDigitalCollectibles,
  reqRevokeDigitalCollectibles,
  reqUpdateDigitalCollectibles, reqUpdateNftSeries
} from "@/api/digitalCollectibles";

export default {
  data() {
    return {
      uploadModule: 'market/digitalCollectibles',
      imgList1: [],
      imgList2: [],
      imgList3: [],

      imgList4: [],
      imgList5: [],
      seriesDialogVisible: false,
      nftDialogVisible: false,
      dialogVisible: false,
      seriesTableData: null,
      seriesFormData: {
        id: null,
        series: null,
        thumbnail: null,
        buttonIcon: null,
        labels: null,
        sort: 1,
        dynamicTags:[],
        dynamicTagsIndex: null,
      },
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
        nftSeriesId: null,
        collectiblesName: null,
        state: null,
      },
      tableData: null,
      inputVisible: false,
      inputValue: '',
      inputVisible2: false,
      inputValue2: '',
      formData: {
        id: null,
        collectiblesName: null,
        rarityLevel: null,
        displayImage: null,
        cardImage: null,
        covered: null,
        score: 1,
        quantity: 1,
        tags: null,
        synopsis: null,
        creator: null,
        issuer: null,
        dynamicTagsIndex: null,
        dynamicTags:[],
        labels: null,
        startTime: null,
        endTime: null,
        exchangeTime:[]
      },
      rarityLevelEnum: [
        {code: "稀有", desc: "稀有"},
        {code: "史诗", desc: "史诗"},
        {code: "传说", desc: "传说"},
        {code: "神话", desc: "神话"},
      ],
      rules: {
        collectiblesName: [{required: true, message: "请输入藏品名称", trigger: "change"}],
        rarityLevel: [{required: true, message: "请选择稀有级别", trigger: "change"}],
        exchangeTime: [{validator: this.validateExchangeTime, trigger: "change"}],
        dynamicTags: [{required: true, message: "请输入标签", trigger: "change"}],
        creator: [{required: true, message: "请填写创作者", trigger: "change"}],
        issuer: [{required: true, message: "请填写发行方", trigger: "change"}],
        synopsis: [{required: true, message: "请输入藏品简介", trigger: "change"}],
        displayImage: [{required: true, message: "请上传数字藏品展示图", trigger: "change"}],
        cardImage: [{required: true, message: "请上传数字藏品卡片图", trigger: "blur"}],
      },
      rules2: {
        series: [{required: true, message: "请输入NFT系列", trigger: "change"}],
        thumbnail: [{required: true, message: "请上传缩略图", trigger: "change"}],
        buttonIcon: [{required: true, message: "请上传按钮图标", trigger: "change"}],
        dynamicTags: [{required: true, message: "请输入标签", trigger: "change"}],
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        }
      },
    };
  },
  mounted() {
    this.getNftSeries();
  },
  methods: {
    async getNftSeries() {
      const result = await reqGetNftSeries();
      this.seriesTableData = result.data.data;
    },
    async getDigitalCollectiblesList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}&nftSeriesId=${this.pageQuery.nftSeriesId}`;
      if (this.pageQuery.collectiblesName){
        param = param + `&collectiblesName=${this.pageQuery.collectiblesName}`;
      }
      if (this.pageQuery.state){
        param = param + `&state=${this.pageQuery.state}`;
      }
      const result = await reqGetDigitalCollectiblesList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;
    },
    clickAddSeries() {
      this.seriesDialogVisible = true;
    },
    clickSeriesUpdate(row) {
      this.seriesFormData = {
        id: row.id,
        series: row.series,
        thumbnail: row.thumbnail,
        buttonIcon: row.buttonIcon,
        labels: row.labels,
        sort: row.sort,
        dynamicTags:[],
        dynamicTagsIndex: null,
      };
      this.seriesFormData.dynamicTags = JSON.parse(row.labels);
      this.seriesDialogVisible = true;
      this.imgList4[0] = row.thumbnail;
      this.imgList5[0] = row.buttonIcon;
    },
    clickSeriesDelete(row) {
      this.$confirm('是否确定删除？',{type: 'warning'})
        .then(_ => {
          reqDeleteNftSeries({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getNftSeries();
          });
        }).catch(_ =>{})
    },
    submitSeriesForm(){
      this.$refs.seriesFormData.validate((valid) => {
        if (valid) {
          this.seriesFormData.labels = JSON.stringify(this.seriesFormData.dynamicTags);
          if (this.seriesFormData.id){
            reqUpdateNftSeries(this.seriesFormData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.seriesCancel();
              this.getNftSeries();
            });
          } else {
            reqAddNftSeries(this.seriesFormData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.seriesCancel();
              this.getNftSeries();
            });
          }
          this.seriesDialogVisible = false;
        }
      });
    },
    // 取消按钮
    seriesCancel() {
      this.seriesDialogVisible = false;
      this.$refs.seriesFormData.resetFields();
      this.seriesFormData = {
        id: null,
        series: null,
        thumbnail: null,
        buttonIcon: null,
        labels: null,
        sort: 1,
        dynamicTags:[],
        dynamicTagsIndex: null,
      };
      this.imgList4 = [];
      this.imgList5 = [];
      this.inputValue = '';
      this.inputVisible = false
    },
    clickNft(row) {
      this.pageQuery.nftSeriesId = row.id;
      this.getDigitalCollectiblesList();
      this.nftDialogVisible = true;
    },
    cancelNft() {
      this.nftDialogVisible = false;
      this.pageQuery.nftSeriesId = null;
      this.this.tableData = [];
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getDigitalCollectiblesList();
    },
    clickAdd() {
      this.dialogVisible = true;
    },
    clickUpdate(row) {
      this.formData = {
        id: row.id,
        collectiblesName: row.collectiblesName,
        rarityLevel: row.rarityLevel,
        displayImage: row.displayImage,
        cardImage: row.cardImage,
        covered: row.covered,
        score: row.score,
        quantity: row.quantity,
        tags: row.tags,
        labels: row.labels,
        synopsis: row.synopsis,
        creator: row.creator,
        issuer: row.issuer,
        startTime: row.startTime,
        endTime: row.endTime,
        exchangeTime:[row.startTime, row.endTime],
        dynamicTags: [],
        dynamicTagsIndex: null,
      };
      if (!row.labels){
        for (const element of row.tags.split(",")) {
          this.formData.dynamicTags.push({
            tag: element,
            bgColor: "#1B2A3EFF",
            typefaceColor: "#647994FF"
          });
        }
      }else {
        this.formData.dynamicTags = JSON.parse(row.labels);
      }
      this.dialogVisible = true;
      this.imgList1[0] = row.displayImage;
      this.imgList2[0] = row.cardImage;
      if (row.covered){
        this.imgList3[0] = row.covered;
      }
    },
    clickPublish(row) {
      this.$confirm('是否确定发布上架？',{type: 'warning'})
        .then(_ => {
          reqPublishDigitalCollectibles({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "发布成功",
            });
            this.getDigitalCollectiblesList();
          });
        }).catch(_ =>{})
    },
    clickRevoke(row) {
      this.$confirm('是否确定撤销下架？',{type: 'warning'})
        .then(_ => {
          reqRevokeDigitalCollectibles({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "撤销成功",
            });
            this.getDigitalCollectiblesList();
          });
        }).catch(_ =>{})
    },
    clickDelete(row) {
      this.$confirm('是否确定删除？',{type: 'warning'})
        .then(_ => {
          reqDeleteDigitalCollectibles({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getDigitalCollectiblesList();
          });
        }).catch(_ =>{})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.formData.labels = JSON.stringify(this.formData.dynamicTags);
          this.formData.nftSeriesId = this.pageQuery.nftSeriesId;
          if (this.formData.id){
            reqUpdateDigitalCollectibles(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getDigitalCollectiblesList();
            });
          } else {
            reqAddDigitalCollectibles(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getDigitalCollectiblesList();
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
        collectiblesName: null,
        rarityLevel: null,
        displayImage: null,
        cardImage: null,
        covered: null,
        score: 1,
        quantity: 1,
        tags: null,
        labels: null,
        synopsis: null,
        creator: null,
        issuer: null,
        dynamicTags:[],
        startTime: null,
        endTime: null,
        exchangeTime:[],
        dynamicTagsIndex: null
      };
      this.imgList1 = [];
      this.imgList2 = [];
      this.imgList3 = [];
      this.inputValue2 = '';
      this.inputVisible2 = false
    },
    getUrl1(e) {
      this.imgList1.push(e);
      this.formData.displayImage = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove1(index) {
      this.imgList1.splice(index, 1);
      this.formData.displayImage = null;
    },
    getUrl2(e) {
      this.imgList2.push(e);
      this.formData.cardImage = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove2(index) {
      this.imgList2.splice(index, 1);
      this.formData.cardImage = null;
    },
    getUrl3(e) {
      this.imgList3.push(e);
      this.formData.covered = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove3(index) {
      this.imgList3.splice(index, 1);
      this.formData.covered = null;
    },
    getUrl4(e) {
      this.imgList4.push(e);
      this.seriesFormData.thumbnail = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove4(index) {
      this.imgList4.splice(index, 1);
      this.seriesFormData.thumbnail = null;
    },
    getUrl5(e) {
      this.imgList5.push(e);
      this.seriesFormData.buttonIcon = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove5(index) {
      this.imgList5.splice(index, 1);
      this.seriesFormData.buttonIcon = null;
    },
    handleClose(index) {
      this.formData.dynamicTags.splice(index, 1);
      this.formData.tags = this.formData.dynamicTags.map(item => item.tag).join(',');
    },
    handleTagClick(index) {
      this.formData.dynamicTagsIndex = index;
    },
    handleClose2(index) {
      this.seriesFormData.dynamicTags.splice(index, 1);
    },
    handleTagClick2(index) {
      this.seriesFormData.dynamicTagsIndex = index;
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        let item = {tag: inputValue, bgColor: "#1B2A3EFF", typefaceColor: "#647994FF"};
        this.formData.dynamicTags.push(item);
      }
      this.inputVisible = false;
      this.inputValue = '';
      this.formData.tags = this.formData.dynamicTags.map(item => item.tag).join(',');
    },
    showInput2() {
      this.inputVisible2 = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput2.$refs.input.focus();
      });
    },
    handleInputConfirm2() {
      let inputValue = this.inputValue2;
      if (inputValue) {
        let item = {tag: inputValue, bgColor: "#1B2A3EFF", typefaceColor: "#647994FF"};
        this.seriesFormData.dynamicTags.push(item);
      }
      this.inputVisible2 = false;
      this.inputValue2 = '';
    },
    changeRarityLevel(){
      if (!this.formData.dynamicTags.length || this.formData.dynamicTags.length === 0){
        let item = {tag: "级别：" + this.formData.rarityLevel, bgColor: "#1B2A3EFF", typefaceColor: "#647994FF"};
        this.formData.dynamicTags.push(item);
      }else if (this.formData.dynamicTags.length >= 1 && this.formData.dynamicTags[0].tag.startsWith("级别")){
        this.formData.dynamicTags[0] = {tag: "级别：" + this.formData.rarityLevel, bgColor: this.formData.dynamicTags[0].bgColor, typefaceColor: this.formData.dynamicTags[0].typefaceColor};
      }else {
        let item = {tag: "级别：" + this.formData.rarityLevel, bgColor: "#1B2A3EFF", typefaceColor: "#647994FF"};
        this.formData.dynamicTags.unshift(item);
      }
      this.formData.tags = this.formData.dynamicTags.map(item => item.tag).join(',');
    },
    handleDateChange() {
      // 在选择时间范围时触发的 change 事件
      this.formData.startTime = this.formData.exchangeTime[0];
      this.formData.endTime = this.formData.exchangeTime[1];
      // 强制更新组件
      this.$forceUpdate();
    },
    validateExchangeTime(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (value && value.length >= 2) {
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请选择有效时间")); // 长度不符合要求，验证失败
      }
    },
    handleColorChange(color) {
      // 假设color是一个对象，包含RGB值
      this.formData.dynamicTags[this.formData.dynamicTagsIndex].bgColor = this.rgbStringToHex(color).toUpperCase();
    },
    rgbStringToHex(rgbString) {
      alert(rgbString);
      const rgbValues = rgbString.match(/\d+/g).map(Number);
      return (
        "#" + rgbValues
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          }).join("")
      );
    },
  },
};
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
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
  width: 180px;
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
