<template>
  <div>
    <el-table :data="user" style="width: 100%">
      <el-table-column prop="id" label="序号"> </el-table-column>
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <el-table-column prop="drugType" label="单位"> </el-table-column>
      <el-table-column prop="type" label="身份"> </el-table-column>
      <el-table-column prop="address" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="userAdd(scope.row)">新增</el-button>
          <el-button @click="userUpdate(scope.row)">修改</el-button>
          <el-button @click="userDelete(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增" :visible.sync="userAdd_dialogFormVisible" id="sh">
      <template>
        <el-form :model="adduser" ref="adduser">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="username" :rules="[{ required: true, message: '用户名不能为空' }]">
            <el-input type="text" v-model="adduser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="pwd" :rules="[{ required: true, message: '密码不能为空' }]">
            <el-input type="password" v-model="adduser.pwd"></el-input>
          </el-form-item>
          <el-form-item label="单位" :label-width="formLabelWidth">
            <el-select v-model="adduser.drugType" placeholder="请选择单位">
              <el-option label="荆门" value="荆门"></el-option>
              <el-option label="友好" value="友好"></el-option>
              <el-option label="黄石" value="黄石"></el-option>
              <el-option label="柏瑞康" value="柏瑞康"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份" :label-width="formLabelWidth">
            <el-select v-model="adduser.type" placeholder="请选择身份">
              <el-option label="核查" value="核查"></el-option>
              <el-option label="审核" value="审核"></el-option>
              <el-option label="管理员" value="管理员"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add('adduser')">提交</el-button>
            <el-button @click="resetForm('adduser')">取消</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="userUpdate_dialogFormVisible" id="sh">
      <template>
        <el-form :model="adduser" ref="adduser">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="username" :rules="[{ required: true, message: '用户名不能为空' }]">
            <el-input type="text" v-model="adduser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="pwd" :rules="[{ required: true, message: '密码不能为空' }]">
            <el-input type="password" v-model="adduser.pwd"></el-input>
          </el-form-item>
          <el-form-item label="单位" :label-width="formLabelWidth">
            <el-select v-model="adduser.drugType" placeholder="请选择单位">
              <el-option label="荆门" value="荆门"></el-option>
              <el-option label="友好" value="友好"></el-option>
              <el-option label="黄石" value="黄石"></el-option>
              <el-option label="柏瑞康" value="柏瑞康"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份" :label-width="formLabelWidth">
            <el-select v-model="adduser.type" placeholder="请选择身份">
              <el-option label="核查" value="核查"></el-option>
              <el-option label="审核" value="审核"></el-option>
              <el-option label="管理员" value="管理员"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="update('adduser')">提交</el-button>
            <el-button @click="resetForm('adduser')">取消</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: [],
      formLabelWidth: "120px",
      adduser: {
        id: "",
        username: "",
        pwd: "123456",
        drugType: "友好",
        type: "核查"
      },
      userAdd_dialogFormVisible: false,
      userUpdate_dialogFormVisible: false
    };
  },
  created() {
    this.$http
      .post(
        "http://yaopin.zmq777.top/yaopingdata/userOperating.php",
        {
          q: "select"
        },
        {
          emulateJSON: true
        }
      )
      .then(response => {
        this.user = response.data.items;
      });
  },
  methods: {
    userAdd(row) {
      this.adduser.username = "";
      this.adduser.pwd = "";
      this.userAdd_dialogFormVisible = true;
    },
    userUpdate(row) {
      this.userUpdate_dialogFormVisible = true;
      this.adduser.id = row.id;
      this.adduser.username = row.username;
      this.adduser.drugType = row.drugType;
      this.adduser.type = row.type;
      this.adduser.pwd = row.pwd;
    },
    userDelete(row) {
      let id = row.id;
      this.$confirm("此操作将永久删除条记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(
              "http://yaopin.zmq777.top/yaopingdata/userOperating.php",
              {
                q: "delete",
                id: id
              },
              {
                emulateJSON: true
              }
            )
            .then(response => {
              if (response.data == 1) {
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
                this.onload();
              } else {
                this.$message.error("操作失败!");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    add(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.userOp("insert");
          this.$message({
            type: "success",
            message: "新增成功!"
          });
          this.user.push(this.adduser);
          this.userAdd_dialogFormVisible = false;
          this.onload();
        } else {
          return false;
        }
      });
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.userOp("update");
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.userUpdate_dialogFormVisible = false;
          this.$refs[formName].resetFields();
          this.onload();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.userAdd_dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    userOp(q) {
      let str = JSON.stringify(this.adduser);
      this.$http
        .post(
          "http://yaopin.zmq777.top/yaopingdata/userOperating.php",
          {
            q: q,
            str: str
          },
          {
            emulateJSON: true
          }
        )
        .then(response => {
          if (response.data == 1) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          } else {
            this.$message.error("操作失败!");
          }
        });
    },
    onload() {
      this.$http
        .post(
          "http://yaopin.zmq777.top/yaopingdata/userOperating.php",
          {
            q: "select"
          },
          {
            emulateJSON: true
          }
        )
        .then(response => {
          this.user = response.data.items;
        });
    }
  }
};
</script>

<style scoped>
.el-select {
  float: left;
}
</style>
