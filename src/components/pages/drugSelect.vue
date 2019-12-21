<template>
  <div>
    <a href="" id="hf" style="display:none"></a>
    <el-col class="box">
      <el-form :model="drug_info" ref="drug_info" :inline="true" label-position="right" size="mini">
        <el-form-item label="起始日期" prop="dateOfInbound">
          <el-date-picker v-model="drug_info.dateOfInbound1" align="right" type="date" :clearable="onclearable" placeholder="选择日期" :picker-options="pickerOptions1" style="width: 130px !important;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" prop="dateOfInbound">
          <el-date-picker v-model="drug_info.dateOfInbound2" align="right" type="date" :clearable="onclearable" placeholder="选择日期" :picker-options="pickerOptions1" style="width: 130px !important;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="drug_info.name" style="width: 130px !important;"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="drug_info.drugType" placeholder="请选择部门" style="width: 100px !important;">
            <el-option label="无" value="无"></el-option>
            <el-option label="荆门" value="荆门"></el-option>
            <el-option label="友好" value="友好"></el-option>
            <el-option label="黄石" value="黄石"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="drug_info.type" placeholder="请选择分类" style="width: 100px !important;">
            <el-option label="无" value="无"></el-option>
            <el-option label="中药" value="中药"></el-option>
            <el-option label="西药" value="西药"></el-option>
            <el-option label="卫材" value="卫材"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectInfo()">查询</el-button>
          <el-button @click="resetForm('drug_info')">重置</el-button>
          <el-button size="small" @click="dc()" type="primary">导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col class="box">
      <el-table size="mini" :data="drug_infos.data" border style="width: 100%" highlight-current-row>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="dateOfInbound" label="日期" sortable width="80">
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
  </div>
</template>

<script>
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      drug_infos: { data: [] },
      onclearable: false,
      tableTitles: [
        {
          label: "日期",
          prop: "dateOfInbound"
        },
        {
          label: "部门",
          prop: "drugType"
        },
        {
          label: "分类",
          prop: "type"
        },
        {
          label: "药品名称",
          prop: "name"
        },
        {
          label: "剂型",
          prop: "Formulation"
        },
        {
          label: "规格",
          prop: "format"
        },
        {
          label: "单位",
          prop: "unit"
        },
        {
          label: "进价",
          prop: "money"
        },
        {
          label: "供货商",
          prop: "sellers"
        },
        {
          label: "生产厂家",
          prop: "manufacturer"
        },
        {
          label: "数量",
          prop: "number"
        }
      ],
      drug_info: {
        dateOfInbound1: "",
        dateOfInbound2: "",
        name: "",
        drugType: "无",
        type: "无"
      },
      drug_info1: { dateOfInbound: "", name: "", drugType: "", type: "" },
      tmpdata: "",
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.drug_info.drugType = "无";
      this.drug_info.type = "无";
      this.drug_info.dateOfInbound1 = "";
      this.drug_info.dateOfInbound2 = "";
    },
    selectInfo() {
      if (
        (this.drug_info.drugType == "无") &
        (this.drug_info.type == "无") &
        (this.drug_info.name == "") &
        (this.drug_info.dateOfInbound1 == "") &
        (this.drug_info.dateOfInbound2 == "")
      ) {
        alert("请至少选择一个条件");
      } else {
        let sql = "where 1=1";
        if (this.drug_info.drugType != "无") {
          sql += " and drugType='" + this.drug_info.drugType + "'";
        }
        if (this.drug_info.type != "无") {
          sql += " and type='" + this.drug_info.type + "'";
        }
        if (this.drug_info.name != "") {
          sql += " and name like '%" + this.drug_info.name + "%'";
        }
        if (this.drug_info.dateOfInbound1 != "") {
          let dateOfInbound1 = this.formatDate(
            this.drug_info.dateOfInbound1,
            "yyyy-M-d"
          );
          dateOfInbound1 = Date.parse(new Date(dateOfInbound1)) / 1000;
          sql += " and dateOfInbound >= '" + dateOfInbound1 + "'";
        }
        if (this.drug_info.dateOfInbound2 != "") {
          let dateOfInbound2 = this.formatDate(
            this.drug_info.dateOfInbound2,
            "yyyy-M-d"
          );
          dateOfInbound2 = Date.parse(new Date(dateOfInbound2)) / 1000 + 86400;
          sql += " and dateOfInbound <= '" + dateOfInbound2 + "'";
        }
        // console.log(sql);
        this.$http
          .post(
            "http://yaopin.zmq777.top/yaopingdata/ypInfoOperating.php",
            {
              q: "select",
              str: sql
            },
            {
              emulateJSON: true
            }
          )
          .then(response => {
            this.drug_infos.data = response.data;
          });
      }
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
    padLeftZero(str) {
      return ("00" + str).substr(str.length);
    },
    exportFile(data, sheetName, fileName) {
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
      FileSaver.saveAs(
        new Blob([this.s2ab(wbout)], {
          type: "application/octet-stream"
        }),
        fileName + ".xlsx"
      );
    },
    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    },
    dc() {
      if (this.drug_infos.data.length == 0) {
        return this.$message.warning("没有数据无法导出!");
      }
      let dd = this.getFileData();
      this.exportFile(dd, "sheet1", "all");
    },
    getFileData() {
      let tableDataParam = this.drug_infos.data;
      let _this = this;
      let allData = [];
      let titlesData = [];
      let lineData = [];
      let allLineData = [];
      for (let item of this.tableTitles) {
        titlesData.push(item.label);
      }
      let titleLen = this.tableTitles.length;
      for (let item of tableDataParam) {
        lineData = [];
        for (let i = 0; i < titleLen; i++) {
          if (this.tableTitles[i].prop == "dateOfInbound") {
            let timef = item[this.tableTitles[i].prop];
            timef = _this.Timef(timef);
            lineData.push(timef);
          } else {
            lineData.push(item[this.tableTitles[i].prop]);
          }
        }
        allLineData.push(lineData);
      }
      allData.push(titlesData);
      allData = allData.concat(allLineData);
      return allData;
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
.el-form-item--mini .el-input__inner {
  width: 143px !important;
}
</style>
