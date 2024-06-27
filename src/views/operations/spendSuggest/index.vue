<template>
  <div>
    <div style="margin-top: 30px;">
      <el-form label-width="150px" :model="formData" ref="formData">
        <el-form-item label="花-推荐图片：" prop="ruleImage">
          <div class="img_con" v-for="(i, index) in imgList" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 310px; height: 210px"
            ></el-image>
            <div class="overlay">
              <i
                class="el-icon-delete remove_img"
                @click="handleRemove(index)"
              ></i>
            </div>
          </div>
          <UploadImg
            v-show="imgList.length < 1"
            @get-url="getUrl"
            :module="uploadModule"
          />
        </el-form-item>
        <el-form-item label="是否需要跳转：">
          <el-radio-group v-model="formData.useLink">
            <el-radio :label="false">不跳转</el-radio>
            <el-radio :label="true">跳转</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跳转类型：" v-if="formData.useLink">
          <el-radio-group v-model="formData.inStation">
            <el-radio :label="true">站内跳转</el-radio>
            <el-radio :label="false">站外跳转</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跳转站点：" v-if="formData.useLink && formData.inStation">
          <el-select v-model="formData.inStationCode">
            <el-option
              v-for="item in inStationEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转地址：" v-if="formData.useLink && (!formData.inStation || formData.inStationCode === 'web-page')">
          <el-input v-model="formData.linkUrl" style="width: 400px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="header" class="clearfix" style="margin-top: 50px; margin-left: 130px;">
        <div class="addbtn" @click="submitForm">保存</div>
      </div>
    </div>
  </div>
</template>

<script>
import {reqGetSpendSuggest, reqSetSpendSuggest} from "@/api/config";

export default {
  data() {
    return {
      uploadModule: "config",
      imgList: [],
      formData: {
        spendSuggest: null,
        useLink: false,
        inStation: true,
        inStationCode: null,
        linkUrl: null,
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
    };
  },
  mounted() {
    this.getScoreConfig();
  },
  methods: {
    async getScoreConfig() {
      const result = await reqGetSpendSuggest();
      this.formData.spendSuggest = result.data.data.spendSuggest;
      this.imgList[0] = this.formData.spendSuggest;
      this.formData.linkUrl = result.data.data.linkUrl;
      if (this.formData.linkUrl){
        this.formData.useLink = true;
        if (this.formData.linkUrl.startsWith("out")){
          this.formData.inStation = false;
          this.formData.linkUrl = this.formData.linkUrl.replace("out", "");
        }else {
          let link = this.formData.linkUrl.replace("kmeta://", "");
          if (!link.startsWith("http")){
            this.formData.inStationCode = link;
          }else {
            this.formData.inStationCode = "web-page";
          }
        }
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          let linkUrl = "";
          if (this.formData.useLink){
            if (this.formData.inStation){
              linkUrl = "kmeta://";
              if (this.formData.inStationCode === "web-page"){
                linkUrl = linkUrl + this.formData.linkUrl;
              }else {
                linkUrl = linkUrl + this.formData.inStationCode;
              }
            } else {
              linkUrl = "out" + this.formData.linkUrl;
            }
          }
          this.formData.linkUrl = linkUrl;
          let param = `spendSuggest=${this.formData.spendSuggest}&spendSuggestLink=${this.formData.linkUrl}`;
          reqSetSpendSuggest(param).then(() => {
            this.$message({
              type: "success",
              message: "保存成功",
            });
            this.getScoreConfig();
          });
        }
      });
    },
    getUrl(e) {
      this.imgList.push(e);
      this.formData.spendSuggest = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove(index) {
      this.imgList.splice(index, 1);
      this.formData.spendSuggest = null;
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
  width: 310px;
  height: 210px;
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
</style>

