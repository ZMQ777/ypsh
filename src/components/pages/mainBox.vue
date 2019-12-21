<template>
  <el-container>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="1-4-1" :unique-opened="bol" class="el-menu-vertical-demo" :router="true" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
          <div v-for="a in arr" :key="a.title">
            <div v-if="a.children.length == 0">
              <el-menu-item v-bind:index="a.index">
                <i v-bind:class="a.icon"></i>
                <span slot="title">{{ a.title }}</span>
              </el-menu-item>
            </div>
            <div v-else>
              <el-submenu v-bind:index="a.index">
                <template slot="title">
                  <i v-bind:class="a.icon"></i>
                  <span slot="title">{{ a.title }}</span>
                </template>
                <el-menu-item-group v-for="b in a.children" :key="b.title">
                  <el-menu-item v-bind:index="b.index">{{
                    b.title
                    }}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </div>
          </div>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "mainBox",
  data() {
    return {
      isCollapse: false,
      bol: true,
      arr: []
    };
  },
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {}
  },
  created() {
    let loginUSer = JSON.parse(localStorage.getItem("loginUSer"));
    let type = loginUSer.type;
    this.$http
      .post(
        "http://yaopin.zmq777.top/yaopingdata/login.php",
        {
          q: "main",
          type: type
        },
        {
          emulateJSON: true
        }
      )
      .then(response => {
        this.arr = response.data;
        // console.log(JSON.stringify(response.data));
      });
  }
};
</script>

<style scoped>
html,
body {
  padding: 0;
  margin: 0;
}
.el-menu-vertical-demo {
  height: 100vh;
  padding-top: 5vh;
  box-sizing: border-box;
}
.left,
.right {
  float: left;
}
.left {
  width: 15%;
}
.right {
  width: 85%;
  height: 100vh;
}
</style>
