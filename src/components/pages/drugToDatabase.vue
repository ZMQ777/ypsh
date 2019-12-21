<template>
  <div>
    <el-form ref="master_user.data" label-width="80px">
      <el-col class="box">
        <div class="el-table-add-row" style="width: 99.2%;">
          <el-upload class="upload-demo" action="http://47.98.208.25/filebox/index.php" accept=".xls,.xlsx,.csv" :on-change="upload" :show-file-list="false" :auto-upload="false">
            <el-button solt="trigger" size="small" type="primary" style="font-size:auto">导入表格</el-button>
          </el-upload>
        </div>
      </el-col>
      <el-col class="box">
        <div class="el-table-add-row" style="width: 99.2%;margin-bottom:10px;">
          <!-- <span class="tianjia">提交</span> -->
          <el-button solt="trigger" size="small" @click="clearMasterUser()" type="primary" style="font-size:auto">清除数据</el-button>
        </div>
      </el-col>
      <el-col class="box">
        <div class="el-table-add-row" style="width: 99.2%;margin-bottom:10px;">
          <!-- <span class="tianjia">提交</span> -->
          <el-button solt="trigger" size="small" @click="tjMasterUser()" :disabled="dis" type="primary" style="font-size:auto">提交数据</el-button>
        </div>
      </el-col>
      <el-col class="box">
        <el-table size="mini" :data="master_user.data" border style="width: 100%" highlight-current-row v-loading="loading">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="dateOfInbound" label="日期">
            <template slot-scope="scope">
              {{ Timef(scope.row.dateOfInbound) }}
            </template>
          </el-table-column>
          <el-table-column prop="drugType" label="部门"></el-table-column>
          <el-table-column prop="type" label="分类"></el-table-column>
          <el-table-column prop="name" label="药品名称" width="200"></el-table-column>
          <el-table-column prop="Formulation" label="剂型"></el-table-column>
          <el-table-column prop="format" label="规格"></el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column prop="money" label="进价"></el-table-column>
          <el-table-column prop="sellers" label="供货商"></el-table-column>
          <el-table-column prop="manufacturer" label="生产厂家"></el-table-column>
          <el-table-column prop="number" label="数量"></el-table-column>
        </el-table>
      </el-col>
    </el-form>
  </div>
</template>

<script>
var generateId = {
  _count: 1,
  get() {
    return +new Date() + "_" + this._count++;
  }
};
function formatDate(numb, format) {
  if (numb == "") {
    return "NULL";
  }
  let time = new Date((numb - 1) * 24 * 3600000 + 1);
  // console.log(numb);
  // console.log(time);
  time.setYear(time.getFullYear() - 70);
  let year = time.getFullYear() + "";
  let month = time.getMonth() + 1 + "";
  let date = time.getDate() + "";
  if (format && format.length === 1) {
    return year + format + month + format + date;
  }
  return (
    year + (month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date)
  );
}
import XLSX from "xlsx";
export default {
  data() {
    return {
      sb: "hello",
      master_user: {
        sel: null, //选中行
        data: []
      },
      d: {},
      restaurants: [],
      xlsxJson: "",
      loading: false,
      dis: false
    };
  },
  mounted() {},
  created() {},
  methods: {
    tjMasterUser() {
      if (this.master_user.data.length == 0) {
        alert("空数据无法提交！");
        return false;
      }
      this.dis = true;
      // console.log(this.master_user.data);
      let ypInfos = JSON.stringify(this.master_user.data);
      let _this = this;
      this.$http
        .post(
          "http://yaopin.zmq777.top/yaopingdata/addYpInfo.php",
          {
            ypInfos: ypInfos
          },
          {
            emulateJSON: true
          }
        )
        .then(response => {
          if (response.data == 1) {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            _this.master_user.data = [];
          } else {
            this.$message.error("添加失败!");
          }
          this.dis = false;
        });
    },
    clearMasterUser() {
      this.master_user.data = [];
    },
    upload(file, fileList) {
      this.loading = true;
      let _this = this;
      this.importExcel(file);
      this.loading = false;
    },
    fm(str) {
      if (typeof str == "undefined") {
        return "";
      } else {
        return str;
      }
    },
    importExcel(file) {
      // let file = file.files[0] // 使用传统的input方法需要加上这一步
      const types = file.name.split(".")[1];
      const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
        item => item === types
      );
      if (!fileType) {
        alert("格式错误！请重新选择");
        return;
      }
      this.file2Xce(file).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          //   this.master_user.data = tabJson[0].sheet;
          let datalist = tabJson[0].sheet;
          let _this = this;
          console.log(datalist);
          // console.log(datalist);
          if (
            datalist[0].药品名称 != "" &&
            datalist[0].药品名称 != "undefined" &&
            datalist[0].药品名称 != null
          ) {
            // console.log(1);
            datalist.forEach(item => {
              if (
                item.药品名称 == "" ||
                item.药品名称 == null ||
                typeof item.药品名称 == "undefined"
              ) {
                return;
              }
              let d = new Object();
              d.dateOfInbound =
                Date.parse(new Date(formatDate(item.日期, "."))) / 1000;
              if (isNaN(d.dateOfInbound)) {
                d.dateOfInbound = Date.parse(item.日期.trim()) / 1000;
              }
              d.drugType = this.fm(item.部门);
              d.type = this.fm(item.分类);
              d.name = this.fm(item.药品名称);
              d.Formulation = this.fm(item.剂型);
              d.format = this.fm(item.规格);
              d.unit = this.fm(item.单位);
              d.money = this.fm(item.进价);
              d.sellers = this.fm(item.供货商);
              d.manufacturer = this.fm(item.生产厂家);
              d.number = this.fm(item.数量);
              _this.master_user.data.push(d);
            });
          } else if (
            datalist[0].__EMPTY_3 != "" &&
            datalist[0].__EMPTY_3 != "undefined" &&
            datalist[0].__EMPTY_3 != null
          ) {
            datalist.forEach(item => {
              if (
                item.__EMPTY_3 == "" ||
                item.__EMPTY_3 == null ||
                typeof item.__EMPTY_3 == "undefined" ||
                item.__EMPTY_3 == "药品名称"
              ) {
                return;
              }
              let d = new Object();
              d.dateOfInbound =
                Date.parse(new Date(formatDate(item.__EMPTY, "."))) / 1000;
              if (isNaN(d.dateOfInbound)) {
                d.dateOfInbound = Date.parse(item.__EMPTY.trim()) / 1000;
              }
              d.drugType = this.fm(item.__EMPTY_1);
              d.type = this.fm(item.__EMPTY_2);
              d.name = this.fm(item.__EMPTY_3);
              d.Formulation = this.fm(item.__EMPTY_4);
              d.format = this.fm(item.__EMPTY_5);
              d.unit = this.fm(item.__EMPTY_6);
              d.money = this.fm(item.__EMPTY_7);
              d.sellers = this.fm(item.__EMPTY_8);
              d.manufacturer = this.fm(item.__EMPTY_9);
              d.number = this.fm(item.__EMPTY_10);
              _this.master_user.data.push(d);
            });
          } else {
            alert("文件格式异常");
          }
        }
      });
    },
    file2Xce(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const data = e.target.result;
          this.wb = XLSX.read(data, {
            type: "binary"
          });
          const result = [];
          this.wb.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
            });
          });
          resolve(result);
        };
        reader.readAsBinaryString(file.raw);
      });
    },
    handleSelect(item) {
      console.log(item);
    },
    Timef(value) {
      var unixTimestamp = new Date(value * 1000);
      var commonTime = unixTimestamp.toLocaleString().substring(0, 9);
      return commonTime;
    }
  }
};
</script>

<style scoped>
.el-table-add-row {
  margin-top: 10px;
  width: 100%;
  height: 34px;
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  display: flex;
  line-height: 34px;
}
.box {
  width: 100%;
}
.tianjia {
  font-size: 25px;
  font-weight: bold;
}
.el-upload--text {
  font-size: 0;
}
</style>
