<template>
  <div>
    <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 20px;">
      <div class="addbtn" @click="clickAdd">添加广告栏</div>
    </div>

    <div class="app-container" style="margin-right: 30px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="adColumn" label="广告栏目" width="150" align="center"/>
        <el-table-column label="显示样式" width="210" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.displayStyle === 1">一排多个</el-tag>
            <el-tag v-if="row.displayStyle === 2" type="success">一排一个</el-tag>
            <el-tag v-if="row.displayStyle === 3" type="info">一排两个</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="客户端" width="300" align="center">
          <template slot-scope="{ row }">
            {{ getClientDesc(row.client) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="clickUpdate(scope.row)" icon="el-icon-edit" type="text" size="small">编辑</el-button>
            <el-button @click="clickAd(scope.row)" icon="el-icon-s-marketing" type="text" size="small">广告位</el-button>
            <el-button @click="clickDelete(scope.row)" icon="el-icon-delete" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序值" width="150" align="center"/>
        <el-table-column prop="createTime" label="创建时间" width="150" align="center"/>
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
    <el-dialog title="广告栏目" :visible.sync="dialogVisible" top="10vh" width="30%" :close-on-click-modal="false">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="广告栏目：" prop="adColumn">
          <el-input v-model="formData.adColumn" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="显示形式：" prop="client">
          <el-select v-model="formData.displayStyle" placeholder="显示形式">
            <el-option
              v-for="item in displayStyleEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户端：" prop="client">
          <el-select v-model="formData.client" placeholder="客户端">
            <el-option
              v-for="item in clientEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序(小优先)：" >
          <el-input-number v-model="formData.sort" controls-position="right" :min="1" :precision="0"/>
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex;">
        <el-button class="subBtn" @click="submitForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="广告配置" :visible.sync="adDialogVisible" top="5vh" width="800px" :before-close="cancelAd" :close-on-click-modal="false">
      <div style="margin-top: 20px; margin-left: 20px;">
        <div class="addbtn" @click="clickAddAd">添加广告位</div>
      </div>

      <div class="app-container" style="margin-right: 30px">
        <el-carousel :interval="2500" height="350px" style="margin-left: 20px; flex: 1;" :autoplay="!adFormData.id">
          <el-carousel-item v-for="item in adTableData" :key="item.id">
            <h2 class="medium" style="text-align: center;">{{ item.title }}</h2>
            <div style="display: flex; justify-content: center; height: 100%;">
              <img :src="item.image" @click="clickCarouselItem(item)">
            </div>
          </el-carousel-item>
        </el-carousel>

        <div style="margin-top: 40px;">
          <div v-show="addAdDialogVisible">
            <el-form
              :model="adFormData"
              ref="adFormData"
              :rules="rules"
              label-width="150px"
              :inline="false"
              size="normal"
            >
              <el-form-item label="Title：" prop="title">
                <el-input
                  v-model="adFormData.title"
                  style="width: 170px"
                ></el-input>
              </el-form-item>
              <el-form-item label="有效时间" prop="effectiveTime">
                <el-date-picker
                  v-model="adFormData.effectiveTime"
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
              <el-form-item label="客户端：" prop="client">
                <el-select v-model="adFormData.client" placeholder="客户端">
                  <el-option
                    v-for="item in clientEnum"
                    :key="item.code"
                    :label="item.desc"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="版本号：" >
                <el-input
                  v-model="adFormData.version"
                  style="width: 170px"
                ></el-input>
              </el-form-item>
              <el-form-item label="排序(小优先)：" >
                <el-input-number v-model="adFormData.sort" controls-position="right" :min="1" :precision="0"/>
              </el-form-item>
              <el-form-item label="是否需要跳转：">
                <el-radio-group v-model="adFormData.useLink">
                  <el-radio :label="false">不跳转</el-radio>
                  <el-radio :label="true">跳转</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="跳转类型：" v-if="adFormData.useLink">
                <el-radio-group v-model="adFormData.inStation">
                  <el-radio :label="true">站内跳转</el-radio>
                  <el-radio :label="false">站外跳转</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="跳转站点：" v-if="adFormData.useLink && adFormData.inStation">
                <el-select v-model="adFormData.inStationCode">
                  <el-option
                    v-for="item in inStationEnum"
                    :key="item.code"
                    :label="item.desc"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="跳转地址：" v-if="adFormData.useLink && (!adFormData.inStation || adFormData.inStationCode === 'web-page')">
                <el-input v-model="adFormData.linkUrl" style="width: 400px" ></el-input>
              </el-form-item>
              <el-form-item label="banner图片：" prop="image">
                <div class="img_con" v-for="(i, index) in imgList" :key="index">
                  <el-image
                    class="deduct_img"
                    :src="i"
                    :preview-src-list="[i]"
                    style="width:300px; height: 300px"
                  ></el-image>
                  <div class="overlay">
                    <i
                      class="el-icon-delete remove_img"
                      @click="handleRemove(index)"
                    ></i>
                  </div>
                </div>
                <UploadImg v-show="imgList.length < 1" @get-url="getUrl"/>
              </el-form-item>
            </el-form>
            <div slot="footer" style="display: flex; margin-left: 10%;">
              <el-button class="subBtn" @click="submitAdForm">提 交</el-button>
              <el-button class="cancelBtn" v-if="adFormData.id && adFormData.state === 1" @click="adPublish">发 布</el-button>
              <el-button class="cancelBtn" v-if="adFormData.id && adFormData.state === 2" @click="adDelete">删 除</el-button>
              <el-button class="cancelBtn" @click="cancelAddAd">取 消</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  reqAddAd,
  reqAddAdColumn,
  reqDeleteAd,
  reqDeleteAdColumn,
  reqGetAdColumnList,
  reqGetAdList,
  reqPublishAd,
  reqUpdateAd,
  reqUpdateAdColumn
} from "@/api/worldAd";

export default {
  data() {
    return {
      dialogVisible: false,
      adDialogVisible: false,
      addAdDialogVisible: false,
      imgList: [],
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
        client: null,
      },
      tableData: null,
      formData: {
        id: null,
        adColumn: null,
        displayStyle: 1,
        client: -1,
        version: null,
        sort: 1
      },
      adPageQuery: {
        adColumnId: null,
        pageIndex: 1,
        pageSize: 10,
        client: null,
      },
      adTotal: 0,
      adTableData: null,
      adFormData: {
        id: null,
        adColumnId: null,
        title: null,
        image: null,
        client: -1,
        linkUrl: null,
        state: 1,
        startTime: null,
        endTime: null,
        version: null,
        effectiveTime: [],
        useLink: false,
        inStation: true,
        inStationCode: null,
        sort: 1
      },
      clientEnum: [
        {code: -1, desc: "所有"},
        {code: 0, desc: "iOS"},
        {code: 1, desc: "Android"},
        {code: 2, desc: "微信小程序"},
      ],
      displayStyleEnum: [
        {code: 1, desc: "一排多个"},
        {code: 2, desc: "一排一个"},
        {code: 3, desc: "一排两个"},
      ],
      inStationEnum: [
        {code:"home-tab", desc: "探索"},
        {code:"message-tab", desc: "K盟"},
        {code:"world-tab", desc: "K界"},
        {code:"market-tab", desc: "K集"},
        {code:"market-tab?index=1", desc: "K集-数字藏品"},
        {code:"mine-tab", desc: "我的"},
        {code:"rank-daily", desc: "当日排行榜"},
        {code:"invite", desc: "邀请码"},
        {code:"web-page", desc: "网页"},
      ],
      rules: {
        adColumn: [{required: true, message: "请输入广告栏目", trigger: "change"}],
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
    this.getAdColumnList();
  },
  methods: {
    getClientDesc(clientCode) {
      // 获取描述信息
      return this.clientEnum.find(item => item.code === clientCode).desc;
    },
    async getAdColumnList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
      if (this.pageQuery.client){
        param = param + `&client=${this.pageQuery.client}`;
      }
      const result = await reqGetAdColumnList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.reqGetAdColumnList();
    },
    clickAdd() {
      this.dialogVisible = true;
    },
    clickUpdate(row) {
      this.formData = {
        id: row.id,
        adColumn: row.adColumn,
        displayStyle: row.displayStyle,
        client: row.client,
        version: row.version,
        sort: row.sort
      };
      this.dialogVisible = true;
    },
    clickDelete(row) {
      this.$confirm('确定删除广告栏目【'+row.adColumn+'】吗？',{type: 'warning'})
        .then(_ => {
          reqDeleteAdColumn({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getAdColumnList();
          });
        }).catch(_ =>{})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.id){
            reqUpdateAdColumn(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getAdColumnList();
            });
          } else {
            reqAddAdColumn(this.formData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getAdColumnList();
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
        adColumn: null,
        displayStyle: 1,
        client: -1,
        version: null,
        sort: 1
      };
    },
    clickAd(row) {
      this.adPageQuery.adColumnId = row.id;
      this.getAdList();
      this.adDialogVisible = true;
    },
    async getAdList() {
      let param = `adColumnId=${this.adPageQuery.adColumnId}&pageIndex=${this.adPageQuery.pageIndex}&pageSize=${this.adPageQuery.pageSize}`;
      if (this.adPageQuery.client){
        param = param + `&client=${this.adPageQuery.client}`;
      }
      const result = await reqGetAdList(param);
      this.adTableData = result.data.data.records;
      this.adTotal = result.data.data.total;
    },
    clickAddAd() {
      this.addAdDialogVisible = true;
    },
    handleRemove(index) {
      this.imgList.splice(index, 1);
      this.adFormData.image = null;
    },
    getUrl(e) {
      this.imgList.push(e);
      this.adFormData.image = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleDateChange() {
      // 在选择时间范围时触发的 change 事件
      this.adFormData.startTime = this.adFormData.effectiveTime[0];
      this.adFormData.endTime = this.adFormData.effectiveTime[1];
      // 强制更新组件
      this.$forceUpdate();
    },
    adPublish() {
      reqPublishAd({id: this.adFormData.id}).then(() => {
        this.$message({
          type: "success",
          message: "发布成功",
        });
        this.addAdDialogVisible = false;
        this.getAdList();
      });
    },
    adDelete() {
      this.$confirm('是否确定删除？',{type: 'warning'})
        .then(_ => {
          reqDeleteAd({id: this.adFormData.id}).then(() => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.addAdDialogVisible = false;
            this.getAdList();
          });
        }).catch(_ =>{})
    },
    clickCarouselItem(row) {
      this.adFormData = {
        id: row.id,
        adColumnId: row.adColumnId,
        title: row.title,
        image: row.image,
        client: row.client,
        linkUrl: row.linkUrl,
        state: row.state,
        startTime: row.startTime,
        endTime: row.endTime,
        effectiveTime: [row.startTime, row.endTime],
        version: row.version,
        sort: row.sort,
        useLink: false,
        inStation: true,
        inStationCode: null,
      };
      if (row.linkUrl){
        this.adFormData.useLink = true;
        if (row.linkUrl.startsWith("out")){
          this.adFormData.inStation = false;
          this.adFormData.linkUrl = row.linkUrl.replace("out", "");
        }else {
          let link = row.linkUrl.replace("kmeta://", "");
          if (!link.startsWith("http")){
            this.adFormData.inStationCode = link;
          }else {
            this.adFormData.inStationCode = "web-page";
          }
        }
      }
      this.imgList[0] = row.image;
      this.addAdDialogVisible = true;
    },
    submitAdForm() {
      this.$refs.adFormData.validate((valid) => {
        if (valid) {
          let linkUrl = "";
          if (this.adFormData.useLink){
            if (this.adFormData.inStation){
              linkUrl = "kmeta://";
              if (this.adFormData.inStationCode === "web-page"){
                linkUrl = linkUrl + this.adFormData.linkUrl;
              }else {
                linkUrl = linkUrl + this.adFormData.inStationCode;
              }
            } else {
              linkUrl = "out" + this.adFormData.linkUrl;
            }
          }
          this.adFormData.linkUrl = linkUrl;
          if (this.adFormData.id){
            reqUpdateAd(this.adFormData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
            });
          } else {
            this.adFormData.adColumnId = this.adPageQuery.adColumnId;
            reqAddAd(this.adFormData).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancelAddAd();
            });
          }
          this.addAdDialogVisible = false;
          this.getAdList();
        }
      });
    },
    cancelAd() {
      this.adDialogVisible = false;
      this.cancelAddAd();
    },
    cancelAddAd() {
      this.addAdDialogVisible = false;
      this.$refs.adFormData.resetFields();
      this.imgList = [];
      this.adFormData = {
        id: null,
        adColumnId: null,
        title: null,
        image: null,
        client: -1,
        linkUrl: null,
        state: 1,
        startTime: null,
        endTime: null,
        effectiveTime: [],
        version: null,
        useLink: false,
        inStation: true,
        inStationCode: null,
        sort: 1
      };
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
  width: 300px;
  position: relative;
  display: flex;
  /* background-color: #b9d547; */
}
.deduct_img {
  width: 120px;
  height: 120px;
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
