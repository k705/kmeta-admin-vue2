<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="addbtn" @click="handleAdd">新增角色</div>
      </div>

      <!-- 角色列表 -->
      <div>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="角色列表" name="first">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="role" label="角色名" width="300">
              </el-table-column>
              <!-- <el-table-column label="状态" align="center" width="100">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-value="0"
                    inactive-value="1"
                    @change="handleStatusChange(scope.row)"
                  ></el-switch>
                </template>
              </el-table-column> -->
              <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                  <el-button
                    @click="handleClick(scope.row)"
                    type="text"
                    size="small"
                    >分配权限</el-button
                  >
                  <!-- <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    >查看</el-button
                  > -->
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                  <!-- <el-button type="text" size="small">编辑 </el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 添加或修改角色配置对话框 -->
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="500px"
        append-to-body
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="菜单权限">
            <el-tree
              class="tree-border"
              :data="menuOptions"
              :default-checked-keys="defaultCheckedKeys"
              show-checkbox
              ref="menu"
              node-key="id"
              empty-text="加载中，请稍候"
              :props="defaultProps"
            ></el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" style="display: flex;margin-left: 50px;">
          <el-button type="primary"   class="subBtn" @click="submitForm">确 定</el-button>
          <el-button class="cancelBtn" @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {reqAddRole, reqDeleteRole, reqRoleDistribute, reqRoleList, reqRolePermission,} from "@/api/roleManage";
import {authMenu} from "@/api/user";

export default {
  data() {
    return {
      activeName: "first",
      // 菜单列表
      menuOptions: [],
      // 表单参数
      defaultProps: {
        children: "children",
        label: "title",
      },
      //角色列表数据
      tableData: null,

      // 弹出层标题
      title: "",
      loading: false,

      // 是否显示弹出层
      open: false,
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "角色名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
      },
      defaultCheckedKeys: [],
      // 权限数据
      form: {
        id: "",
        permissionIds: [],
      },
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    // 点击修改
    async handleClick(row) {
      this.defaultCheckedKeys = [];
      await reqRolePermission(row.id).then((res) => {
        this.defaultCheckedKeys = res.data.data;
      });

      this.open = true;
      this.form.id = row.id; //角色id
      this.title = "分配权限";
      this.getMenuTreeselect();
    },

    // 展示角色列表
    async getRoleList() {
      try {
        const result = await reqRoleList();
        console.log("打印的结果", result);
        this.tableData = result.data.data.records;
      } catch (e) {}
    },

    /** 查询菜单树结构 */
    getMenuTreeselect() {
      authMenu().then((response) => {
        this.menuOptions = response.data.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      console.log(checkedKeys, "checkedKeys");
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      console.log(halfCheckedKeys, "halfCheckedKeys");
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      console.log(checkedKeys, "checkedKeys");
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    // async getRoleMenuTreeselect(roleId) {
    //   const response = await reqRolePermission(roleId);
    //   this.menuOptions = response.data;
    //   return response;
    // },
    /** 新增按钮操作 */
    handleAdd() {
      this.$prompt("请输入角色名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          console.log(value, "value");
          this.AddRole(value);
          this.$message({
            type: "success",
            message: "创建成功",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    async AddRole(value) {
      try {
        const data = { role: value };
        await reqAddRole(data);
        console.log(111);
        this.getRoleList();
      } catch (e) {}
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row);
      const roleIds = row.id;
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.DeleteRole(roleIds);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    async DeleteRole(roleIds) {
      try {
        await reqDeleteRole({ id: roleIds });
        this.getRoleList();
      } catch (e) {}
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.form.permissionIds = this.getMenuAllCheckedKeys();
            reqRoleDistribute(this.form).then((response) => {
              this.$message({
                type: "success",
                message: "分配成功",
              });
              this.open = false;
              this.getRoleList();
            });
          }
          // else {
          //   this.form.menuIds = this.getMenuAllCheckedKeys();
          //   addRole(this.form).then(response => {
          //     this.$modal.msgSuccess("新增成功");
          //     this.open = false;
          //     this.getList();
          //   });
          // }
        }
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
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
  margin-top: 30px;
}
.img_con {
  position: relative;
  display: flex;
}
.deduct_img {
  width: 140px;
  height: 140px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.remove_img {
  position: absolute;
  right: 5px;
  top: -5px;
  color: red;
  cursor: pointer;
}

.line {
  text-align: center;
}

/* tree border */
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #ffffff none;
  border-radius: 4px;
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
