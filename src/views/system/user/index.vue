<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="addbtn" @click="handleAdd">新增用户</div>
      </div>

      <!-- 用户列表 -->
      <div>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="用户列表" name="first">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="id" label="用户ID" width="300">
              </el-table-column>
              <el-table-column prop="username" label="用户名" width="300">
              </el-table-column>
              <el-table-column prop="phone" label="用户手机号" width="300">
              </el-table-column>
              <el-table-column prop="email" label="用户邮箱" width="300">
              </el-table-column>
              <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                  <el-button
                    @click="handleClick(scope.row)"
                    icon="el-icon-edit"
                    type="text"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog
        width="600px"
        :title="title"
        :visible.sync="open"
        append-to-body
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="头像" prop="avatar">
                <div
                  class="img_con"
                  v-for="(i, index) in imgList1"
                  :key="index"
                >
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
                  <img width="100%" :src="dialogImageUrl1" alt="" />
                </el-dialog>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phone">
                <el-input
                  v-model="form.phone"
                  placeholder="请输入手机号码"
                  maxlength="11"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="请输入邮箱"
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名称" prop="username">
                <el-input
                  v-model="form.username"
                  placeholder="请输入用户名称"
                  maxlength="30"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户密码" prop="password">
                <el-input
                  v-model="form.password"
                  placeholder="请输入用户密码"
                  type="password"
                  maxlength="20"
                  show-password
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="角色">
                <el-select
                  v-model="form.roleIds"
                  multiple
                  placeholder="请选择角色"
                >
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.id"
                    :label="item.role"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" style="display: flex;margin-left: 50px;">
          <el-button type="primary" @click="submitForm" class="subBtn">确 定</el-button>
          <el-button @click="cancel" class="cancelBtn">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  reqUserList,
  reqUpdateUser,
  reqAddUser,
  reqRoleSelect,
  reqDeleteUser,
} from "@/api/userManage";
export default {
  data() {
    return {
      //用户列表数据
      tableData: null,
      //上传头像
      imgList1: [],
      dialogImageUrl1: "",
      dialogVisible1: false,
      /* current, //当前页码	integer(int64)
          pages, //总页数	integer(int64)
          records, //查询的记录	array	UserVo
          avatar, //头像	string
          email, //邮箱	string
          id, //用户id	string
          phone, //手机号	string
          state, //状态	integer
          username, //	用户名	string
          size, //每页显示记录数	integer(int64)
      total, //总记录数	integer(int64)
          */
      // 表单参数
      form: {
        avatar: "", //头像
        email: "", //邮箱
        id: "", //用户id
        password: "", //密码
        phone: "", //手机号
        username: "", //	用户名
        roleIds: [], //	角色id
      },
      // 角色选项
      roleOptions: [],
      // 弹出层标题
      title: "",
      loading: false,
      activeName: "first",
      // 是否显示弹出层
      open: false,
      // 表单校验
      rules: {
        username: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        avatar: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "用户密码长度必须介于 5 和 20 之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 点击修改
    handleClick(row) {
      this.open = true;
      console.log(row);
      this.form = {
        avatar: row.avatar, //头像
        email: row.email, //邮箱
        id: row.id, //用户id
        password: row.password, //密码
        phone: row.phone, //手机号
        username: row.username, //	用户名
      };
      this.title = "修改用户";
      reqRoleSelect().then((response) => {
        // this.postOptions = response.posts;
        this.roleOptions = response.data.data;

        // this.form.password = this.initPassword;
      });
    },

    // 展示用户列表
    async getUserList() {
      try {
        const result = await reqUserList();
        console.log("打印的结果", result);
        this.tableData = result.data.data.records;
      } catch (e) {}
    },

    //upload函数
    getUrl1(e) {
      this.imgList1.push(e);
      this.form.avatar = e;
      console.log(e, "e");
      console.log("imgList1", this.imgList1);
    },
    handleRemove1(index) {
      this.imgList1.splice(index, 1);
    },
    handlePictureCardPreview1(file) {
      this.dialogImageUrl1 = this.imgList1[0];
      this.dialogVisible1 = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        avatar: "", //头像
        email: "", //邮箱
        id: "", //用户id
        password: "", //密码
        phone: "", //手机号
        username: "", //	用户名
        roleIds: [],
      };
      this.imgList1 = [];
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
      reqRoleSelect().then((response) => {
        // this.postOptions = response.posts;
        this.roleOptions = response.data.data;

        // this.form.password = this.initPassword;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            reqUpdateUser(this.form).then((response) => {
              this.$message({
                type: "success",
                message: "修改成功",
              });
              this.open = false;
              this.getUserList();
            });
          } else {
            reqAddUser(this.form).then((response) => {
              console.log(this.form, "this.form");
              this.$message({
                type: "success",
                message: "添加成功",
              });
              this.open = false;
              this.getUserList();
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.form.id = row.id;
      this.$confirm("是否确认删除用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          reqDeleteUser({ id: this.form.id });
        })
        .then(() => {
          this.getUserList();
          this.$message({
            type: "success",
            message: "删除成功",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
  margin-top: 30px;
}
.img_con {
  width: 120px;
  position: relative;
  display: flex;
}
.deduct_img {
  width: 120px;
  height: 120px;
  /* margin-right: 10px;
  margin-bottom: 10px; */
}



.line {
  text-align: center;
}

/* btn */
.subBtn {
  border: none;
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 40px;
  width: 160px;
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
