<template>
  <div>
    <el-form ref="master_user.data" label-width="80px">
      <el-col class="box">
        <el-table size="mini" :data="master_user.data" border style="width: 100%" highlight-current-row>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="dateOfInbound" label="日期">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <!-- <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel['dateOfApplication']">
                </el-input> -->
                <el-date-picker size="mini" v-model="master_user.sel['dateOfInbound']" value-format="yyyy-M-d" type="date" placeholder="选择日期" style="width: 80px !important;">
                </el-date-picker>
              </span>
              <span v-else>{{ scope.row['dateOfInbound'] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="drugType" label="部门" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select v-model="master_user.sel['drugType']" placeholder="请选择类别">
                  <el-option label="友好" value="友好"></el-option>
                  <el-option label="荆门" value="荆门"></el-option>
                  <el-option label="黄石" value="黄石"></el-option>
                </el-select>
              </span>
              <span v-else>{{ scope.row['drugType'] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="分类" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select v-model="master_user.sel['type']" placeholder="请选择类别">
                  <el-option label="中药" value="中药"></el-option>
                  <el-option label="西药" value="西药"></el-option>
                  <el-option label="卫材" value="卫材"></el-option>
                </el-select>
              </span>
              <span v-else>{{ scope.row['type'] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="药品名称" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-autocomplete class="inline-input" v-model="master_user.sel['name']" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
              </span>
              <span v-else>{{ scope.row['name'] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Formulation" label="剂型">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel['Formulation']">
                </el-input>
              </span>
              <span v-else>{{ scope.row['Formulation'] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="format" label="规格">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel['format']">
                </el-input>
              </span>
              <span v-else>{{ scope.row['format'] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel['unit']">
                </el-input>
              </span>
              <span v-else>{{ scope.row['unit'] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="money" sortable label="进价">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel['money']">
                </el-input>
              </span>
              <span v-else>{{ scope.row['money'] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sellers" label="供货商">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel['sellers']">
                </el-input>
              </span>
              <span v-else>{{ scope.row['sellers'] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="manufacturer" label="生产厂家">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel['manufacturer']">
                </el-input>
              </span>
              <span v-else>{{ scope.row['manufacturer'] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="数量">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel['number']">
                </el-input>
              </span>
              <span v-else>{{ scope.row['number'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row, scope.$index, true)">
                {{ scope.row.isSet ? '保存' : '修改' }}
              </span>
              <span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteDrug(scope.row, scope.$index)">
                删除
              </span>
              <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row, scope.$index, false)">
                取消
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col class="box">
        <div class="el-table-add-row" style="width: 99.2%;">
          <!-- <span class="tianjia">添加</span> -->
          <el-button solt="trigger" @click="addMasterUser()" size="small" type="primary">添加药品</el-button>
        </div>
      </el-col>
      <el-col class="box">
        <div class="el-table-add-row" style="width: 99.2%;">
          <el-upload class="upload-demo" action="http://47.98.208.25/filebox/index.php" accept=".xls,.xlsx" :on-change="upload" :show-file-list="false" :auto-upload="false">
            <el-button solt="trigger" size="small" type="primary">导入表格</el-button>
          </el-upload>
        </div>
      </el-col>
      <el-col class="box">
        <div class="el-table-add-row" style="width: 99.2%;">
          <!-- <span class="tianjia">提交清单</span> -->
          <el-button solt="trigger" @click="tjMasterUser()" size="small" type="primary">提交清单</el-button>
        </div>
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
function formatDate1(numb, format) {
  if (numb == "") {
    return "NULL";
  }
  let time = new Date((numb - 1) * 24 * 3600000 + 1);
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
      master_user: {
        sel: null, //选中行
        columns: [
          { field: "type", title: "分类", width: "80" },
          { field: "name", title: "药品名称", width: "200" },
          { field: "Formulation", title: "剂型", width: "" },
          { field: "format", title: "规格", width: "" },
          { field: "unit", title: "单位", width: "" },
          { field: "money", title: "进价", width: "" },
          { field: "sellers", title: "供货商", width: "" },
          { field: "manufacturer", title: "生产厂家", width: "" },
          { field: "number", title: "数量", width: "" }
        ],
        data: []
      },
      yp_List: {
        dateOfApplication: "",
        drugType: "",
        username: "",
        status: "未审核",
        rmarks: "",
        listData: ""
      },
      restaurants: [],
      xlsxJson: ""
    };
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    //读取表格数据
    readMasterUser() {
      //根据实际情况，自己改下啊
      this.master_user.data.map(i => {
        i.id = generateId.get(); //模拟后台插入成功后有了id
        return i;
      });
    },
    tjMasterUser() {
      for (let i of this.master_user.data) {
        if (i.isSet) {
          return this.$message.warning("请先保存当前编辑项");
        } else {
          // this.master_user.data.dateOfApplication
        }
      }
      if (this.master_user.data.length > 0) {
        // alert(1);
        let loginUSer = JSON.parse(localStorage.getItem("loginUSer"));
        this.yp_List.dateOfApplication = this.formatDate(
          new Date(),
          "yyyy/M/d"
        );
        let timef = Date.parse(new Date(this.yp_List.dateOfApplication)) / 1000;
        // this.yp_List.drugType = loginUSer.drugType;
        this.yp_List.username = loginUSer.username;
        this.yp_List.listData = JSON.stringify(this.master_user.data);
        this.yp_List.dateOfApplication = timef;

        let yp_list_data = JSON.stringify(this.yp_List);
        let _this = this;
        this.$http
          .post(
            "http://yaopin.zmq777.top/yaopingdata/ypListOperating.php",
            {
              q: "insert",
              listInfo: yp_list_data
            },
            {
              emulateJSON: true
            }
          )
          .then(response => {
            if (response.data == 1) {
              this.$message({
                type: "success",
                message: "提交成功!"
              });
              // _this.addDrugList(timef, this.yp_List.listData);
              _this.master_user.data = [];
            } else {
              this.$message.error("提交失败!");
            }
          });
      } else {
        alert("至少要提交一条数据");
      }
    },
    addDrugList(dateOfInbound, list) {
      let ypInfos = list;
      this.$http
        .post(
          "http://yaopin.zmq777.top/yaopingdata/ypInfoOperating.php",
          {
            q: "insert",
            dateOfInbound: dateOfInbound,
            ypInfos: ypInfos,
            str: ""
          },
          {
            emulateJSON: true
          }
        )
        .then(response => {
          if (response.data == 1) {
            console.log("添加成功");
          } else {
            console.log("添加失败!");
          }
        });
    },
    //添加一条药品记录
    addMasterUser() {
      for (let i of this.master_user.data) {
        if (i.isSet) return this.$message.warning("请先保存当前编辑项");
      }
      let j = {
        i: 0,
        dateOfInbound: "",
        Formulation: "",
        drugType: "友好",
        type: "中药",
        name: "",
        format: "",
        unit: "",
        money: "",
        sellers: "",
        manufacturer: "",
        number: "",
        isSet: true,
        _temporary: true
      };
      this.master_user.data.push(j);
      this.master_user.sel = JSON.parse(JSON.stringify(j));
    },
    upload(file, fileList) {
      // console.log('file', file);
      // console.log('fileList', fileList);
      // let files = { 0: file.raw };
      this.importExcel(file);
    },
    fm(str) {
      if (typeof str == "undefined") {
        return "";
      } else {
        return str;
      }
    },
    importExcel(file) {
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
          // console.log(datalist);
          let _this = this;
          if (
            datalist[0].__EMPTY_3 != "" &&
            datalist[0].__EMPTY_3 != "undefined" &&
            datalist[0].__EMPTY_3 != null
          ) {
            datalist.forEach(item => {
              if (!item.__EMPTY_3 || item.__EMPTY_3 == "药品名称") {
                return;
              }
              let d = new Object();

              d.dateOfInbound = _this.Timef(
                Date.parse(new Date(formatDate1(item.__EMPTY, "."))) / 1000
              );
              if (d.dateOfInbound == "Invalid D") {
                d.dateOfInbound = item.__EMPTY.trim();
              }

              d.drugType = this.fm(item.__EMPTY_1);
              _this.yp_List.drugType = this.fm(item.__EMPTY_1);
              d.type = this.fm(item.__EMPTY_2);
              d.name = this.fm(item.__EMPTY_3);
              d.Formulation = this.fm(item.__EMPTY_4);
              d.format = this.fm(item.__EMPTY_5);
              d.unit = this.fm(item.__EMPTY_6);
              d.money = this.fm(item.__EMPTY_7);
              d.sellers = this.fm(item.__EMPTY_8);
              d.manufacturer = this.fm(item.__EMPTY_9);
              d.number = this.fm(item.__EMPTY_10);
              d.isSet = false;
              // d._temporary = true;
              _this.master_user.data.push(d);
            });
          } else if (
            datalist[0].药品名称 != "" &&
            datalist[0].药品名称 != null &&
            typeof datalist[0].药品名称 != "undefined"
          ) {
            datalist.forEach(item => {
              if (
                item.药品名称 == "" ||
                item.药品名称 == null ||
                typeof item.药品名称 == "undefined"
              ) {
                return;
              }
              // console.log(item);
              let d = new Object();
              d.dateOfInbound = _this.Timef(
                Date.parse(new Date(formatDate1(item.日期, "."))) / 1000
              );
              if (d.dateOfInbound == "Invalid D") {
                d.dateOfInbound = item.日期.trim();
              }
              // ;
              d.drugType = this.fm(item.部门);
              _this.yp_List.drugType = this.fm(item.部门);
              d.type = this.fm(item.分类);
              d.name = this.fm(item.药品名称);
              d.Formulation = this.fm(item.剂型);
              d.format = this.fm(item.规格);
              d.unit = this.fm(item.单位);
              d.money = this.fm(item.进价);
              d.sellers = this.fm(item.供货商);
              d.manufacturer = this.fm(item.生产厂家);
              d.number = this.fm(item.数量);
              d.isSet = false;
              // d._temporary = true;
              _this.master_user.data.push(d);
            });
          } else {
            alert("文件格式异常");
          }
        }
      });
      // console.log(this.master_user.data);
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
        // reader.readAsBinaryString(file) // 传统input方法
      });
    },
    //修改
    pwdChange(row, index, cg) {
      //点击修改 判断是否已经保存所有操作
      let _this = this;
      // alert(row.isSet);
      for (let i of _this.master_user.data) {
        if (i.isSet && i.id != row.id) {
          _this.$message.warning("请先保存当前编辑项");
          return false;
        }
      }
      //是否是取消操作
      if (!cg) {
        if (!this.master_user.sel.id) this.master_user.data.splice(index, 1);
        return (row.isSet = !row.isSet);
      }
      //提交数据
      if (row.isSet) {
        let data = JSON.parse(JSON.stringify(this.master_user.sel));
        _this.yp_List.drugType = data.drugType;
        if (data.name == "" || data.name == null) {
          _this.$message.warning("药品名称不能为空");
          return false;
        } else {
          for (let k in data) row[k] = data[k];
          // this.$message({
          //   type: 'success',
          //   message: '添加成功!'
          // });
          //然后这边重新读取表格数据
          this.readMasterUser();
          row.isSet = false;
        }
      } else {
        this.master_user.sel = JSON.parse(JSON.stringify(row));
        row.isSet = true;
      }
    },
    deleteDrug(row, index) {
      this.$confirm("此操作将永久删除条记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.master_user.data.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelect(item) {
      console.log(item);
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      return [
        { value: "地黄", name: "地黄" },
        { value: "金英胶囊", name: "金英胶囊" },
        { value: "蓝梦HCG", name: "蓝梦HCG" },
        { value: "一次性灭菌橡胶外壳手套", name: "一次性灭菌橡胶外壳手套" }
      ];
    },
    formatDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : this.padLeftZero(str)
          );
        }
      }
      return fmt;
    },
    Timef(value) {
      var unixTimestamp = new Date(value * 1000);
      var commonTime = unixTimestamp.toLocaleString().substring(0, 10);
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
</style>
