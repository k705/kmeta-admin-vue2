<template>
  <div>
    <div
      slot="header"
      class="clearfix"
      style="margin-top: 20px; margin-left: 20px"
    >
      <div class="addbtn" @click="jumpToStar">创建星球</div>
    </div>

    <el-form
      :model="pageQuery"
      :inline="true"
      style="margin-top: 35px; margin-left: 20px"
    >
      <el-form-item label="星球名：">
        <el-input v-model="pageQuery.nickname" style="width: 200px" />
      </el-form-item>
      <el-form-item label="状态：" style="margin-left: 30px">
        <el-select v-model="pageQuery.state" clearable>
          <el-option label="审核中" value="1"></el-option>
          <el-option label="审核被拒" value="2"></el-option>
          <el-option label="在线" value="3"></el-option>
          <el-option label="过期失效" value="4"></el-option>
          <el-option label="已下架" value="5"></el-option>
          <el-option label="下架整改" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getStarList"
        round
        style="margin-left: 40px"
      />
    </el-form>

    <el-button
      v-if="multipleSelection && multipleSelection.length >= 1"
      @click="clickBatchSetOre"
      type="danger"
      round
      style="margin-left: 20px"
      >矿石批量配置</el-button
    >

    <div class="app-container" style="margin-right: 30px">
      <el-table
        :data="starList"
        border
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column
          prop="nickname"
          label="星球名"
          width="200"
          align="center"
        />
        <el-table-column label="星球头像" width="180" align="center">
          <template slot-scope="{ row }">
            <img
              v-if="row.state === 0 || row.state === 1"
              src="./in_review.png"
              style="width: 70px; height: 70px"
            />
            <img
              v-else-if="row.state === 3"
              src="./refuse.png"
              style="width: 70px; height: 70px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 1"
              :src="row.avatar"
              style="width: 70px; height: 70px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 2"
              src="./off_shelf.png"
              style="width: 70px; height: 70px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 3"
              src="./under_rectification.png"
              style="width: 70px; height: 70px"
            />
          </template>
        </el-table-column>
        <el-table-column label="星球矿石" width="180" align="center">
          <template slot-scope="{ row }">
            <img
              v-if="row.state === 0 || row.state === 1"
              src="./in_review.png"
              style="width: 50px; height: 50px"
            />
            <img
              v-else-if="row.state === 3"
              src="./refuse.png"
              style="width: 50px; height: 50px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 1"
              :src="row.orePic"
              style="width: 50px; height: 50px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 2"
              src="./off_shelf.png"
              style="width: 50px; height: 50px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 3"
              src="./under_rectification.png"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column label="上线周期" width="350" align="center">
          <template slot-scope="{ row }">
            {{ row.startTime }} -- {{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="oreQuantity"
          label="矿石个数"
          width="120"
          align="center"
        />
        <el-table-column label="中矿概率" width="120" align="center">
          <template slot-scope="{ row }"> {{ row.probability }}% </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="可用K分"
          width="150"
          align="center"
        />
        <el-table-column label="显示头像" width="200" align="center">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.showStarAvatar"
              @change="changeShowStarAvatar(row.id)"
              active-text="星球"
              inactive-text="所有者"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.state === 0 || row.state === 1"> 审核中 </el-tag>
            <el-tag v-else-if="row.state === 3" type="warning">
              审核未通过
            </el-tag>
            <el-tag
              v-else-if="
                row.state === 2 &&
                row.useState === 1 &&
                Date.parse(row.endTime) > Date.now()
              "
              type="success"
            >
              已上线
            </el-tag>
            <el-tag
              v-else-if="
                row.state === 2 &&
                row.useState === 1 &&
                Date.parse(row.endTime) < Date.now()
              "
              type="info"
            >
              过期失效
            </el-tag>
            <el-tag
              v-else-if="row.state === 2 && row.useState === 2"
              type="info"
            >
              已下架
            </el-tag>
            <el-tag
              v-else-if="row.state === 2 && row.useState === 3"
              type="danger"
            >
              下架整改中
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="250"
          align="center"
        />
        <el-table-column fixed="right" width="200" label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button
              @click="toStarManage(row)"
              icon="el-icon-edit"
              type="text"
              size="small"
              >编辑</el-button
            >
            <el-button
              v-if="row.state === 2 && row.useState === 1"
              @click="clickOffShelf(row)"
              icon="el-icon-refresh-left"
              type="text"
              size="small"
              >下架</el-button
            >
            <el-button
              v-if="row.state === 2 && (row.useState === 2 || row.useState === 3)"
              @click="clickPublish(row)"
              icon="el-icon-s-promotion"
              type="text"
              size="small"
              >发布</el-button
            >
            <el-button
              @click="clickAllocation(row)"
              icon="el-icon-s-finance"
              type="text"
              size="small"
            >充K分</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          layout="total, prev, pager, next, sizes"
          @current-change="handleChangeStarPage"
          @size-change="handleChangeStarPageSize"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageQuery.pageSize"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 修改星球信息（管理星球） -->
    <el-dialog
      title="星球管理"
      :visible.sync="isStarShow"
      top="2vh"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName" type="card">
        <!-- 星球管理 -->
        <el-tab-pane label="星球管理" name="first">
          <el-form
            :model="starUpdateForm"
            ref="starUpdateForm"
            :rules="rules"
            label-width="130px"
            :inline="false"
            size="normal"
          >
            <el-form-item label="星球昵称：" prop="nickname">
              <el-input
                style="width: 200px"
                v-model="starUpdateForm.nickname"
              ></el-input>
            </el-form-item>

            <el-form-item label="上线周期" prop="effectiveTime">
              <el-date-picker
                v-model="starUpdateForm.effectiveTime"
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

            <el-form-item label="星球故事：" prop="story">
              <el-input
                type="textarea"
                v-model="starUpdateForm.story"
                rows="5"
                style="width: 500px"
              ></el-input>
            </el-form-item>

            <el-form-item label="星球描述：" prop="describe">
              <el-input
                type="textarea"
                rows="5"
                style="width: 500px"
                v-model="starUpdateForm.describe"
              ></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col>
                <el-form-item label=" 星球头像：" class="center">
                  <img
                    v-if="starUpdateForm.avatar"
                    :src="starUpdateForm.avatar"
                    class="avatar"
                  /> </el-form-item
              ></el-col>
              <el-col
                ><el-form-item label=" 矿石图片：" class="center">
                  <img
                    v-if="starUpdateForm.orePic"
                    :src="starUpdateForm.orePic"
                    class="avatar"
                  /> </el-form-item
              ></el-col>
              <el-col>
                <el-form-item label=" 星球背景：" class="center">
                  <img
                    v-if="starUpdateForm.background"
                    :src="starUpdateForm.background"
                    style="width: 60%"
                    @click="dialogVisible = true"
                  /> </el-form-item
              ></el-col>
            </el-row>

            <el-form-item>
              <div style="display: flex">
                <el-button
                  class="subBtn"
                  @click="handleSubmit('starUpdateForm')"
                  >提交修改</el-button
                >
                <el-button class="cancelBtn" @click="jumpToManage"
                  >取消</el-button
                >
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 矿石管理 -->
        <el-tab-pane label="矿石管理" name="second">
          <el-form class="stone">
            <el-form-item> 可用K分：{{ starOreForm.score }} </el-form-item>

            <el-form-item prop="probability">
              挖中概率：<el-input-number
                v-model="starOreForm.probability"
                size="mini"
                :step="1"
                :min="1"
                :max="100"
                style="width: 90px"
                step-strictly
                controls-position="right"
              />
              %
            </el-form-item>

            <el-form-item prop="oreQuantity">
              矿石个数：<el-input-number
                v-model="starOreForm.oreQuantity"
                size="mini"
                :step="1"
                :min="15"
                :max="20"
                style="width: 90px"
                step-strictly
                controls-position="right"
              />
              颗
            </el-form-item>

            <el-form-item>
              矿石：<el-button
                @click="addOre"
                type="success"
                icon="el-icon-plus"
                size="mini"
                circle
              />
            </el-form-item>

            <el-form-item v-for="(ore, index) in starOreForm.ores" :key="index">
              价值：<el-input-number
                v-model="ore.minScore"
                :min="1"
                :max="ore.maxScore"
                step-strictly
                size="mini"
                controls-position="right"
                style="width: 95px"
              />
              <span style="margin: 0 10px">-</span>
              <el-input-number
                v-model="ore.maxScore"
                :min="ore.minScore"
                step-strictly
                size="mini"
                controls-position="right"
                style="width: 95px"
              />
              K分，
              <span style="margin: 0 10px">权重：</span>
              <el-input-number
                v-model="ore.weight"
                :step="1"
                :min="1"
                step-strictly
                size="mini"
                controls-position="right"
                style="width: 120px"
              />
              <el-button
                @click="removeOre(index)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                style="margin-left: 15px"
                circle
              />
            </el-form-item>
            <el-form-item>
              <div style="display: flex">
                <el-button type="primary" @click="submitSetOre"
                  >确认修改</el-button
                >
                <el-button class="cancelBtn" @click="jumpToManage"
                  >取消修改</el-button
                >
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 修改星球信息（管理星球） -->
    <el-dialog title="矿石配置" :visible.sync="isBatchStarShow" top="2vh" :close-on-click-modal="false">
      <el-form class="stone">
        <el-form-item prop="probability">
          中矿概率：<el-input-number
            v-model="batchStarOreForm.probability"
            size="mini"
            :step="1"
            :min="1"
            :max="100"
            style="width: 90px"
            step-strictly
            controls-position="right"
          />
          %
        </el-form-item>

        <el-form-item prop="oreQuantity">
          矿石个数：<el-input-number
            v-model="batchStarOreForm.oreQuantity"
            size="mini"
            :step="1"
            :min="15"
            :max="20"
            style="width: 90px"
            step-strictly
            controls-position="right"
          />
          颗
        </el-form-item>

        <el-form-item>
          矿石：<el-button
            @click="addBatchOre"
            type="success"
            icon="el-icon-plus"
            size="mini"
            circle
          />
        </el-form-item>

        <el-form-item
          v-for="(ore, index) in batchStarOreForm.ores"
          :key="index"
        >
          价值：<el-input-number
            v-model="ore.minScore"
            :min="1"
            :max="ore.maxScore"
            step-strictly
            size="mini"
            controls-position="right"
            style="width: 95px"
          />
          <span style="margin: 0 10px">-</span>
          <el-input-number
            v-model="ore.maxScore"
            :min="ore.minScore"
            step-strictly
            size="mini"
            controls-position="right"
            style="width: 95px"
          />
          K分，
          <span style="margin: 0 10px">权重：</span>
          <el-input-number
            v-model="ore.weight"
            :step="1"
            :min="1"
            step-strictly
            size="mini"
            controls-position="right"
            style="width: 120px"
          />
          <el-button
            @click="removeBatchOre(index)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            style="margin-left: 15px"
            circle
          />
        </el-form-item>
        <el-form-item>
          <div style="display: flex">
            <el-button type="primary" @click="submitBatchSetOre"
              >提交</el-button
            >
            <el-button @click="isBatchStarShow = false">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="星球K分分配" :visible.sync="allocationDialogVisible" width="15%" :before-close="cancelAllocation" :close-on-click-modal="false">
      <el-form class="stone">
        <el-form-item label="星球：">
          {{allocationForm.starName}}
        </el-form-item>
        <el-form-item label="充K分：">
          <el-input-number
            v-model="allocationForm.allocationScore"
            controls-position="right"
            :min="1"
            :precision="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex">
        <el-button class="subBtn" @click="allocationScore">确 定</el-button>
        <el-button class="cancelBtn" @click="cancelAllocation">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  offShelf,
  online,
  reqBatchSetOre,
  reqGetStarOre,
  reqSetOre,
  reqShowStarAvatar,
  reqStarList,
  reqUpdateStar,
} from "@/api/manage";
import {reqAllocation} from "@/api/scoreAllocation";

export default {
  data() {
    return {
      loading: false,
      passwordType: "",
      uploadUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传的图片服务器地址
      activeName: "first",
      in_review: "./../in_review.png",
      // 星球列表展示
      starList: null,
      total: 0,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
        nickname: null,
        state: null,
      },
      multipleSelection: [],
      // 更新新球列表
      starUpdateForm: {
        avatar: "",
        background: "",
        describe: "",
        id: 0,
        nickname: "",
        orePic: "",
        story: "",
        sharePicture: "",
        effectiveTime: [],
        startTime: "",
        endTime: "",
        state: null,
        useState: null,
      },
      starOreForm: {
        starId: null,
        oreQuantity: 0,
        probability: 0,
        score: 0,
        ores: [],
      },
      batchStarOreForm: {
        starIds: [],
        oreQuantity: 0,
        probability: 0,
        score: 0,
        ores: [],
      },
      rules: {
        nickname: [
          { required: true, message: "请输入星球昵称", trigger: "blur" },
          { max: 16, message: "昵称上限为16个字符", trigger: "blur" },
        ],
        story: [{ required: true, message: "请输入星球故事", trigger: "blur" }],
        effectiveTime: [
          { validator: this.validateEffectiveTime, trigger: "change" },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        },
      },
      //分页的页码数据
      page: 1,
      limit: 7,
      totalElements: 0, //总页数
      jumpPage: null,
      isStarShow: false,
      isBatchStarShow: false,
      dialogVisible: false,
      allocationDialogVisible: false,
      allocationForm: {
        starId: null,
        starName: null,
        allocationScore: 1,
      }
    };
  },
  mounted() {
    this.getStarList();
  },
  methods: {
    validateEffectiveTime(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (value && value.length >= 2) {
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请选择时间范围")); // 长度不符合要求，验证失败
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 展示星球列表
    async getStarList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
      if (this.pageQuery.nickname) {
        param = param + `&nickname=${this.pageQuery.nickname}`;
      }
      if (this.pageQuery.state) {
        param = param + `&state=${this.pageQuery.state}`;
      }
      const result = await reqStarList(param);
      this.starList = result.data.data.records;
      this.total = result.data.data.total;
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getStarList();
    },
    handleChangeStarPageSize(pageSize) {
      this.pageQuery.pageSize = pageSize;
      this.getStarList();
    },
    // 点击显示管理星球
    toStarManage(starItem) {
      this.activeName = "first";
      this.isStarShow = true;
      this.starUpdateForm.background = starItem.background;
      this.starUpdateForm.orePic = starItem.orePic;
      this.starUpdateForm.story = starItem.story;
      this.starUpdateForm.nickname = starItem.nickname;
      this.starUpdateForm.describe = starItem.describe;
      this.starUpdateForm.id = starItem.id;
      this.starUpdateForm.avatar = starItem.avatar;
      this.starUpdateForm.effectiveTime = [
        starItem.startTime,
        starItem.endTime,
      ];
      this.starUpdateForm.startTime = starItem.startTime;
      this.starUpdateForm.endTime = starItem.endTime;
      this.starUpdateForm.state = starItem.state;
      this.starUpdateForm.useState = starItem.useState;
      this.getStarOre(starItem.id);
    },
    // 点击显示管理星球
    clickBatchSetOre() {
      this.multipleSelection.forEach((value) => {
        this.batchStarOreForm.starIds.push(value.id);
      });
      this.isBatchStarShow = true;
    },
    //获取矿石配置
    async getStarOre(starId) {
      const result = await reqGetStarOre(starId);
      this.starOreForm = result.data.data;
      this.starOreForm.starId = starId;
    },
    //上传之前的钩子函数
    async beforeAvatarUpload(file) {
      const isImg = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      const isType = file.type === "image/png";
      const isType2 = file.type === "image/jpeg";

      if (!isType && !isType2) {
        this.$message.error("上传头像图片格式为png或jpg");
      }
      return (isType || isType2) && isImg;
    },
    // 修改有效时间
    handleDateChange() {
      // 在选择时间范围时触发的 change 事件
      this.starUpdateForm.startTime = this.starUpdateForm.effectiveTime[0];
      this.starUpdateForm.endTime = this.starUpdateForm.effectiveTime[1];

      // 强制更新组件
      this.$forceUpdate();
    },
    async handleSubmit(starUpdateForm) {
      this.$refs.starUpdateForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          try {
            this.handleSubmitReq();

            this.loading = false;
          } catch (e) {
            console.log(e);
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    async handleSubmitReq() {
      await reqUpdateStar(this.starUpdateForm);
      await this.getStarList();
      this.isStarShow = false;
    },
    submitSetOre() {
      reqSetOre(this.starOreForm);
      this.getStarList();
      this.$message({
        type: "success",
        message: "提交成功",
      });
      this.isStarShow = false;
    },
    submitBatchSetOre() {
      reqBatchSetOre(this.batchStarOreForm);
      this.getStarList();
      this.$message({
        type: "success",
        message: "提交成功",
      });
      this.multipleSelection = [];
      this.batchStarOreForm = {
        starIds: [],
        oreQuantity: 0,
        probability: 0,
        score: 0,
        ores: [],
      };
      this.isBatchStarShow = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
    },
    handleCurrentChange(e) {
      this.page = e;
      this.getStarList();
    },
    //显示条数执行的函数
    handleSizeChange(e) {
      this.limit = e;
      this.getStarList();
    },
    // 跳转页面
    changejump() {
      this.page = +this.jumpPage;
      this.getStarList();
      this.jumpPage = null;
    },
    // 跳转到创建星球页面
    jumpToStar() {
      this.$router.push("/manage/star");
    },
    // 取消创建跳转到管理星球页面
    jumpToManage() {
      this.$router.push("/manage/starmanage");
      this.isStarShow = false;
    },
    openDialog() {
      // 点击图片时打开弹窗
      this.dialogVisible = true;
    },
    addOre() {
      this.starOreForm.ores.push({ minScore: 1, maxScore: 1, weight: 1 });
    },
    removeOre(index) {
      this.starOreForm.ores.splice(index, 1);
    },
    addBatchOre() {
      this.batchStarOreForm.ores.push({ minScore: 1, maxScore: 1, weight: 1 });
    },
    removeBatchOre(index) {
      this.batchStarOreForm.ores.splice(index, 1);
    },
    async changeShowStarAvatar(starId) {
      let data = { id: starId };
      await reqShowStarAvatar(data);
      this.getStarList();
    },
    clickOffShelf(row) {
      this.$confirm("是否确定下架星球【" + row.nickname + "】", {
        type: "warning",
      })
        .then((_) => {
          offShelf({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.getStarList();
            this.jumpToManage();
          });
        })
        .catch((_) => {});
    },
    clickPublish(row) {
      let title = "是否确定发布星球【" + row.nickname + "】";
      if (row.score === 0){
        title = "星球【" + row.nickname + "】K分不足，是否继续发布？";
      }
      this.$confirm(title, {
        type: "warning",
      })
        .then((_) => {
          online({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "发布成功",
            });
            this.getStarList();
            this.jumpToManage();
          });
        })
        .catch((_) => {});
    },
    clickAllocation(row) {
      this.allocationForm.starId = row.id;
      this.allocationForm.starName = row.nickname,
      this.allocationDialogVisible = true;
    },
    // 取消按钮
    cancelAllocation() {
      this.allocationForm = {
        starId: null,
        starName: null,
        allocationScore: 1,
      }
      this.allocationDialogVisible = false;
    },
    // 分配K分
    async allocationScore() {
      let data = {
        starId: this.allocationForm.starId,
        allocationType: 2,
        score: this.allocationForm.allocationScore,
      };
      await reqAllocation(data);
      this.$message({
        type: "success",
        message: "分配成功",
      });
      await this.getStarList();
      this.cancelAllocation();
    },
  },
};
</script>

<style scoped>
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
.subBtn {
  border: none;
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 40px;
  width: 180px;
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
.starItem {
  width: 340px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 46px;
  margin-bottom: 30px;

  /* background: #0f0e0e; */

  /* border-radius: 10px; */
  border: 1px solid transparent;
  border-radius: 10px;
  border-image: linear-gradient(to right, #5924ff, #20dfff);
  border-image-slice: 1;
}
.starItem .inner {
  display: flex;
}
.starItem .left {
  width: 90px;
  height: 90px;
  /* display: flex;
  flex-direction: column;
  justify-content: space-between; */
  /* margin-left: 20px; */
}
.starItem .right {
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 15px;
}
.starItem .right .top {
  height: 70px;
  display: flex;
  flex-direction: column;
  font-size: 16px;

  /* justify-content: space-between; */
}
.starItem .right .btn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 24px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
  /* justify-content: space-between; */
}

.starmanage .middle {
  display: flex;
  flex-direction: column;
  margin-left: 50px;
}

.stone .el-input {
  width: 60px;
  margin-right: 10px;
  margin-left: 10px;
}

.el-pagination .pageUnit {
  position: absolute;
  position: absolute;
  bottom: 7px;
  right: -13px;
}
.el-pagination /deep/ .el-pager li {
  border: 1px solid #ccc;
  margin: 0px 3px;
}

.el-pagination /deep/ .one .el-input__inner {
  width: 48px;
  height: 30px;
}
::v-deep .el-textarea__inner {
  resize: none;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

/* 覆盖 el-dialog 的默认样式 */
.my-custom-dialog .el-dialog {
  margin: 0;
  padding: 0;
}

/* 覆盖 el-dialog__wrapper 的默认样式 */
.my-custom-dialog .el-dialog__wrapper {
  margin: 0;
}

.el-dialog__body img {
  max-width: 100%;
  max-height: 100vh; /* 设置最大高度为屏幕高度 */
  object-fit: contain; /* 保持图片纵横比，不拉伸变形 */
  cursor: pointer;
}
</style>
