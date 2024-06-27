<template>
  <div>
      <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 20px;">
        <div class="addbtn" @click="clickAdd">添加</div>
      </div>

      <el-form :model="pageQuery" :inline="true" style="margin-top: 35px; margin-left: 20px;">
        <el-form-item>
          <el-date-picker
            v-model="pageQuery.bannerDate"
            type="date"
            value-format = "yyyy-MM-dd"
            placeholder="选择日期"/>
        </el-form-item>

        <el-form-item style="margin-left: 15px;">
          <el-select v-model="pageQuery.state" placeholder="是否通过">
            <el-option label="全部" value="0"></el-option>
            <el-option label="生效中" value="1"></el-option>
            <el-option label="已撤销" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary"  icon="el-icon-search"  @click="getBannerList" round style="margin-left: 40px;"/>
      </el-form>

      <div class="content-container">
        <el-carousel :interval="2500" height="900px" style="margin-left: 20px; width: 50%; flex: 1;" :autoplay="!bannerForm.id">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <h2 class="medium" style="text-align: center;">{{ item.title }}</h2>
            <img :src="item.image" alt="Banner Image" style="width: 100%; height: 100%;" @click="clickCarouselItem(item)">
          </el-carousel-item>
        </el-carousel>

        <div style="width: 50%;margin-left: 10%;">
          <div v-show="dialogFormVisible">
            <el-form
              :model="bannerForm"
              ref="bannerForm"
              :rules="rules"
              label-width="150px"
              :inline="false"
              size="normal"
            >
              <el-form-item label="Title：" prop="title">
                <el-input
                  v-model="bannerForm.title"
                  style="width: 170px"
                ></el-input>
              </el-form-item>
              <el-form-item label="有效时间" prop="effectiveTime">
                <el-date-picker
                  v-model="bannerForm.effectiveTime"
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
                <el-select v-model="bannerForm.client" placeholder="客户端">
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
                  v-model="bannerForm.version"
                  style="width: 170px"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否需要跳转：">
                <el-radio-group v-model="bannerForm.useLink">
                  <el-radio :label="false">不跳转</el-radio>
                  <el-radio :label="true">跳转</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="跳转类型：" v-if="bannerForm.useLink">
                <el-radio-group v-model="bannerForm.inStation">
                  <el-radio :label="true">站内跳转</el-radio>
                  <el-radio :label="false">站外跳转</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="跳转站点：" v-if="bannerForm.useLink && bannerForm.inStation">
                <el-select v-model="bannerForm.inStationCode">
                  <el-option
                    v-for="item in inStationEnum"
                    :key="item.code"
                    :label="item.desc"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="跳转地址：" v-if="bannerForm.useLink && (!bannerForm.inStation || bannerForm.inStationCode === 'web-page')">
                <el-input v-model="bannerForm.linkUrl" style="width: 400px" ></el-input>
              </el-form-item>
              <el-form-item label="banner图片：" prop="image">
                <div class="img_con" v-for="(i, index) in imgList" :key="index">
                  <el-image
                    class="deduct_img"
                    :src="i"
                    :preview-src-list="[i]"
                    style="width: 780px; height: 729px"
                  ></el-image>
                  <div class="overlay">
                    <i
                      class="el-icon-delete remove_img"
                      @click="handleRemove(index)"
                    ></i>
                  </div>
                </div>
                <UploadImg v-show="imgList.length < 1" @get-url="getUrl"/>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt=""/>
                </el-dialog>
              </el-form-item>
            </el-form>
            <div slot="footer" style="display: flex; margin-left: 15%;">
              <el-button class="subBtn" @click="submitForm">提 交</el-button>
              <el-button class="cancelBtn" v-if="bannerForm.id && bannerForm.state === 2" @click="bannerShelf">发 布</el-button>
              <el-button class="cancelBtn" v-if="bannerForm.id && bannerForm.state === 1" @click="bannerDelete">删 除</el-button>
              <el-button class="cancelBtn" @click="cancel">取 消</el-button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>

import {reqAddBanner, reqBannerShelf, reqDeleteBanner, reqGetWorldBannerList, reqUpdateBanner} from "@/api/banner";

export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      dialogImageUrl: false,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
        position: 2,
        state: "0",
        bannerDate: null
      },
      bannerList: null,
      imgList: [],
      bannerForm: {
        id: null,
        title: null,
        image: null,
        client: -1,
        position: 2,
        linkUrl: null,
        state: 1,
        startTime: null,
        endTime: null,
        effectiveTime: [],
        useLink: false,
        inStation: true,
        inStationCode: null,
        version: null,
      },
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
      clientEnum: [
        {code: -1, desc: "所有"},
        {code: 0, desc: "iOS"},
        {code: 1, desc: "Android"},
        {code: 2, desc: "小程序"},
      ],
      rules: {
        title: [{required: true, message: "请输入Banner Title", trigger: "change"}],
        effectiveTime: [
          {validator: this.validateEffectiveTime, trigger: "change"}
        ],
        image: [
          {required: true, message: "请上传Banner 图片", trigger: "change"},
        ],
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
    this.getBannerList();
  },
  methods: {
    async getBannerList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}&position=${this.pageQuery.position}`;
      if (this.pageQuery.bannerDate) {
        param = param + `&bannerDate=${this.pageQuery.bannerDate}`;
      }
      if (this.pageQuery.state >= 1) {
        param = param + `&state=${this.pageQuery.state}`;
      }
      const result = await reqGetWorldBannerList(param);
      this.bannerList = result.data.data.records;
    },
    clickAdd() {
      this.cancel();
      this.dialogFormVisible = true;
    },
    handleRemove(index) {
      this.imgList.splice(index, 1);
      this.bannerForm.image = null;
    },
    getUrl(e) {
      this.imgList.push(e);
      this.bannerForm.image = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleDateChange() {
      // 在选择时间范围时触发的 change 事件
      this.bannerForm.startTime = this.bannerForm.effectiveTime[0];
      this.bannerForm.endTime = this.bannerForm.effectiveTime[1];
      // 强制更新组件
      this.$forceUpdate();
    },
    validateEffectiveTime(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (value && value.length >= 2) {
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请选择时间范围")); // 长度不符合要求，验证失败
      }
    },
    clickCarouselItem(row) {
      this.bannerForm = {
        id: row.id,
        title: row.title,
        image: row.image,
        client: row.client,
        position: 2,
        linkUrl: row.linkUrl,
        state: row.state,
        startTime: row.startTime,
        endTime: row.endTime,
        effectiveTime: [row.startTime, row.endTime],
        useLink: false,
        inStation: true,
        inStationCode: null,
        version: row.version,
      };
      if (row.linkUrl){
        this.bannerForm.useLink = true;
        if (row.linkUrl.startsWith("out")){
          this.bannerForm.inStation = false;
          this.bannerForm.linkUrl = row.linkUrl.replace("out", "");
        }else {
          let link = row.linkUrl.replace("kmeta://", "");
          if (!link.startsWith("http")){
            this.bannerForm.inStationCode = link;
          }else {
            this.bannerForm.inStationCode = "web-page";
          }
        }
      }
      this.imgList[0] = row.image;
      this.dialogFormVisible = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.bannerForm.validate((valid) => {
        if (valid) {
          let linkUrl = "";
          if (this.bannerForm.useLink){
            if (this.bannerForm.inStation){
              linkUrl = "kmeta://";
              if (this.bannerForm.inStationCode === "web-page"){
                linkUrl = linkUrl + this.bannerForm.linkUrl;
              }else {
                linkUrl = linkUrl + this.bannerForm.inStationCode;
              }
            } else {
              linkUrl = "out" + this.bannerForm.linkUrl;
            }
          }
          this.bannerForm.linkUrl = linkUrl;
          if (this.bannerForm.id){
            reqUpdateBanner(this.bannerForm).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
            });
          } else {
            reqAddBanner(this.bannerForm).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
            });
          }
          this.dialogFormVisible = false;
          this.getBannerList();
        }
      });
    },
    bannerShelf() {
      reqBannerShelf({id: this.bannerForm.id}).then(() => {
        this.$message({
          type: "success",
          message: "发布成功",
        });
        this.dialogFormVisible = false;
        this.getBannerList();
      });
    },
    bannerDelete() {
      this.$confirm('是否确定删除？',{type: 'warning'})
        .then(_ => {
          reqDeleteBanner({id: this.bannerForm.id}).then(() => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.dialogFormVisible = false;
            this.getBannerList();
          });
        }).catch(_ =>{})
    },
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
      this.$refs.bannerForm.resetFields();
      this.imgList = [];
      this.bannerForm = {
        id: null,
        title: null,
        image: null,
        client: -1,
        position: 2,
        linkUrl: null,
        state: 1,
        startTime: null,
        endTime: null,
        effectiveTime: [],
        useLink: false,
        inStation: true,
        inStationCode: null,
        version: null,
      };
    },
  },
};
</script>

<style scoped>
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
  width: 780px;
  height: 729px;
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
  right: 48%;
  top: 48%;
  display: none;
  color: #fff;
  cursor: pointer;
}
.img_con:hover .remove_img {
  display: block;
}
</style>
