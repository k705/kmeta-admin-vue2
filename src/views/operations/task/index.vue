<template>
  <div>
      <div slot="header" class="clearfix" style="margin-top: 20px; margin-left: 20px;">
        <div class="addbtn" @click="clickAdd">添加任务</div>
      </div>

      <el-form :model="pageQuery" :inline="true" style="margin-top: 35px; margin-left: 20px;">
        <el-form-item label="客户端：">
          <el-select v-model="pageQuery.client" clearable>
            <el-option
              v-for="item in clientEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary"  icon="el-icon-search"  @click="getTaskList" round style="margin-left: 40px;"/>
      </el-form>

      <div class="app-container" style="margin-right: 30px">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="任务icon" width="120" align="center">
            <template slot-scope="{ row }">
              <img style="width: 50px; height: 50px" :src="row.taskIcon">
            </template>
          </el-table-column>
          <el-table-column prop="taskName" label="任务" width="150" align="center"/>
          <el-table-column prop="subtitle" label="副标题" width="350" align="center"/>
          <el-table-column label="任务奖励/次" width="210" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.score >= 1" style="margin-right: 10px;">K分：{{row.score}}</el-tag>
              <el-tag type="success" v-if="row.growthValue >= 1" >探索值：{{row.growthValue}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="repetitions" label="可完成次数" width="150" align="center"/>
          <el-table-column label="任务场景" width="200" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="sceneEnum.some(item => item.code === row.scene)" type="info">
                {{ sceneEnum.find(item => item.code === row.scene).desc }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="客户端" width="300" align="center">
            <template slot-scope="{ row }">
              <el-tag v-for="clientCode in row.client" :key="clientCode" v-if="getClientDesc(clientCode)" type="info" style="margin-right: 15px;">
                {{ getClientDesc(clientCode) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="任务分类" width="150" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="taskClassifyEnum.some(item => item.code === row.taskClassify)" type="info">
                {{ taskClassifyEnum.find(item => item.code === row.taskClassify).desc }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" width="180" align="center"/>
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
    <el-dialog title="任务信息" :visible.sync="dialogVisible" top="10vh" >
      <el-form label-width="120px" :model="taskForm" :rules="rules" ref="taskForm">
        <el-form-item label="任务icon：" prop="taskIcon">
          <div class="img_con" v-for="(i, index) in imgList1" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
            ></el-image>
            <div class="overlay">
              <i
                class="el-icon-zoom-in preview_img"
                @click.passive="handlePictureCardPreview1(index)"
              ></i>
              <i
                class="el-icon-delete remove_img"
                @click="handleRemove1(index)"
              ></i>
            </div>
          </div>
          <UploadImg v-show="imgList1.length < 1" @get-url="getUrl1" />
          <el-dialog :visible.sync="dialogVisible1">
            <img width="100%" :src="taskForm.taskIcon" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="任务名称：" prop="taskName">
          <el-input v-model="taskForm.taskName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="副标题：" prop="subtitle">
          <el-input v-model="taskForm.subtitle" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="任务场景：" prop="scene">
          <el-select v-model="taskForm.scene" placeholder="任务场景">
            <el-option
              v-for="item in sceneEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务分类：">
          <el-select v-model="taskForm.taskClassify" placeholder="任务分类">
            <el-option
              v-for="item in taskClassifyEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户端：" prop="client">
          <el-select v-model="taskForm.client" multiple placeholder="客户端">
            <el-option
              v-for="item in clientEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可完成次数：" prop="repetitions">
          <el-input-number v-model="taskForm.repetitions" controls-position="right" :min="1" :precision="0"/>
        </el-form-item>
        <el-form-item label="完成探索值/次：" prop="reward">
          <el-input-number v-model="taskForm.growthValue" controls-position="right" :min="0" :precision="0"/>
        </el-form-item>
        <el-form-item label="完成K分/次：" prop="reward">
          <el-input-number v-model="taskForm.score" controls-position="right" :min="0" :precision="0"/>
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

import {reqAddTask, reqDeleteTask, reqGetTaskList, reqUpdateTask} from "@/api/task";

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
        client: null,
      },
      tableData: null,
      taskForm: {
        id: null,
        taskName: null,
        subtitle: null,
        taskIcon: null,
        growthValue: 0,
        score: null,
        taskType: 2,
        taskClassify: "daily",
        targetProgress: 1,
        repetitions: 1,
        scene: null,
        taskTarget: 1,
        description: null,
        client: [],
        state: 1
      },
      sceneEnum: [
        {code: "bindWechat", desc: "绑定微信"},
        {code: "downloadApp", desc: "下载APP"},
        {code: "signIn", desc: "每日签到"},
        {code: "excavateOre", desc: "挖矿"},
        {code: "exploreStar", desc: "探索星球"},
        {code: "starShareFriend", desc: "星球分享-好友"},
        {code: "starShareCircleOfFriends", desc: "星球分享-朋友圈"},
        {code: "drawShareFriend", desc: "K奖分享-好友"},
        {code: "drawShareCircleOfFriends", desc: "K奖分享-朋友圈"},
        {code: "appletShareFriend", desc: "小程序分享-好友"},
        {code: "appletShareCircleOfFriends", desc: "小程序分享-朋友圈"},
      ],
      taskClassifyEnum: [
        {code: "daily", desc: "每日任务"},
        {code: "explore", desc: "探索任务"},
      ],
      clientEnum: [
        {code: 0, desc: "iOS"},
        {code: 1, desc: "Android"},
        {code: 2, desc: "微信小程序"},
      ],
      rules: {
        taskName: [{required: true, message: "请输入任务名称", trigger: "change"}],
        subtitle: [{required: true, message: "请输入副标题", trigger: "change"}],
        taskIcon: [{required: true, message: "请上传任务icon", trigger: "change"}],
        scene: [{required: true, message: "请选择任务场景", trigger: "change"}],
        reward: [{validator: this.validateReward, trigger: "blur"}],
        client: [{validator: this.validateClient, trigger: "change"}],
      },
    };
  },
  mounted() {
    this.getTaskList();
  },
  methods: {
    getClientDesc(clientCode) {
      // 获取描述信息
      return this.clientEnum.find(item => item.code === clientCode).desc;
    },
    async getTaskList() {
      let param = `pageIndex=${this.pageQuery.pageIndex}&pageSize=${this.pageQuery.pageSize}`;
      if (this.pageQuery.client){
        param = param + `&client=${this.pageQuery.client}`;
      }
      const result = await reqGetTaskList(param);
      this.tableData = result.data.data.records;
      this.total = result.data.data.total;
    },
    handleChangeStarPage(pageIndex) {
      this.pageQuery.pageIndex = pageIndex;
      this.getTaskList();
    },
    clickAdd() {
      this.dialogVisible = true;
    },
    clickUpdate(row) {
      this.taskForm = {
        id: row.id,
        taskName: row.taskName,
        subtitle: row.subtitle,
        taskIcon: row.taskIcon,
        growthValue: row.growthValue,
        score: row.score,
        taskType: row.taskType,
        taskClassify: row.taskClassify,
        targetProgress: row.targetProgress,
        repetitions: row.repetitions,
        scene: row.scene,
        taskTarget: row.taskTarget,
        description: row.description,
        client: row.client,
        state: row.state
      };
      this.imgList1[0] = row.taskIcon;
      this.dialogVisible = true;
    },
    clickDelete(row) {
      this.$confirm('确定删除任务【'+row.taskName+'】吗？',{type: 'warning'})
        .then(_ => {
          reqDeleteTask({id: row.id}).then(() =>{
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getTaskList();
          });
        }).catch(_ =>{})
    },
    validateReward(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (this.taskForm.score >= 1 || this.taskForm.growthValue >= 1){
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请输入任务奖励探索值/K分")); // 长度不符合要求，验证失败
      }
    },
    validateClient(rule, value, callback) {
      // 自定义验证函数，检查 effectiveTime 的长度
      if (this.taskForm.client.length >= 1){
        callback(); // 长度符合要求，验证通过
      } else {
        callback(new Error("请选择任务客户端")); // 长度不符合要求，验证失败
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.taskForm.validate((valid) => {
        if (valid) {
          if (this.taskForm.id){
            reqUpdateTask(this.taskForm).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getTaskList();
            });
          } else {
            reqAddTask(this.taskForm).then(() => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.cancel();
              this.getTaskList();
            });
          }
          this.dialogVisible = false;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
      this.$refs.taskForm.resetFields();
      this.imgList1 = [];
      this.taskForm = {
        id: null,
        taskName: null,
        subtitle: null,
        taskIcon: null,
        growthValue: 0,
        score: 0,
        taskType: 2,
        taskClassify: "daily",
        targetProgress: 1,
        repetitions: 1,
        scene: null,
        taskTarget: 1,
        description: null,
        client: [],
        state: 1
      };
    },
    getUrl1(e) {
      this.imgList1.push(e);
      this.taskForm.taskIcon = e;
      this.$message({
        type: "success",
        message: "上传成功",
      });
    },
    handleRemove1(index) {
      this.imgList1.splice(index, 1);
      this.taskForm.taskIcon = null;
    },
    handlePictureCardPreview1() {
      this.taskForm.taskIcon = this.imgList1[0];
      this.dialogVisible1 = true;
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
  right: 30%;
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
