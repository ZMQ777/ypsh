<template>
  <div class="login">
    <div class="dialog" style="margin-top:100px">
      <div class="loginPage">
        <h1>登录</h1>
        <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="user" prop="name" :rules="[{ required: true, message: '用户名不能为空' }]">
            <el-input type="text" v-model.number="numberValidateForm.name"></el-input>
          </el-form-item>
          <el-form-item label="password" prop="password" :rules="[{ required: true, message: '密码不能为空' }]">
            <el-input type="password" v-model="numberValidateForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>
            <el-button @click="resetForm('numberValidateForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "login",
      numberValidateForm: {
        name: "",
        password: ""
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let username = this.numberValidateForm.name;
          let password = this.numberValidateForm.password;
          this.$http
            .post(
              "http://yaopin.zmq777.top/yaopingdata/login.php",
              {
                q: "login",
                username: username,
                password: password
              },
              {
                emulateJSON: true
              }
            )
            .then(response => {
              let status = response.data.status;
              if (status) {
                this.$message({
                  type: "success",
                  message: "登陆成功!"
                });
                // console.log(JSON.stringify(user));
                let user = response.data.items[0];
                localStorage.setItem("loginUSer", JSON.stringify(user));
                this.$router.push({
                  path: "/"
                });
              } else {
                this.$message.error("账号或密码错误!");
              }
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
html,
body {
  padding: 0;
  margin: 0;
}
.login {
  width: 30%;
  margin: 0 auto;
}
</style>
