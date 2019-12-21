<template>
  <div class="box">
    <div>
      <el-form :model="list_info" ref="yp_listOne" :inline="true" label-position="right" size="mini">
        <el-form-item label="起始日期" prop="dateOfInbound">
          <el-date-picker v-model="list_info.dateOfInbound1" align="right" type="date" :clearable="onclearable" placeholder="选择日期" :picker-options="pickerOptions1" style="width: 130px !important;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" prop="dateOfInbound">
          <el-date-picker v-model="list_info.dateOfInbound2" align="right" type="date" :clearable="onclearable" placeholder="选择日期" :picker-options="pickerOptions1" style="width: 130px !important;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请人姓名" prop="name">
          <el-input type="text" v-model="list_info.name" style="width: 130px !important;"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="list_info.drugType" placeholder="请选择部门" style="width: 100px !important;">
            <el-option label="无" value="无"></el-option>
            <el-option label="荆门" value="荆门"></el-option>
            <el-option label="友好" value="友好"></el-option>
            <el-option label="黄石" value="黄石"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="list_info.status" placeholder="请选择部门" style="width: 150px !important;">
            <el-option label="无" value="无"></el-option>
            <el-option label="未审核" value="未审核"></el-option>
            <el-option label="通过" value="通过"></el-option>
            <el-option label="未通过" value="未通过"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listInFoSub()">查询</el-button>
          <el-button @click="listInFoResetForm('list_info')">重置</el-button>
        </el-form-item>
      </el-form>
      </el-col>
      <el-table :data="yp_listOne" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="dateOfApplication" label="申请日期">
          <template slot-scope="scope">
            {{ Timef(scope.row.dateOfApplication) }}
          </template>
        </el-table-column>
        <el-table-column prop="drugType" label="部门"> </el-table-column>
        <el-table-column prop="username" label="申请人姓名"> </el-table-column>
        <el-table-column prop="listData" label="清单明细">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" @click="mingXi(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="清单审核" v-if="shbtn">
          <template slot-scope="scope">
            <div class="qxbtn">
              <el-button type="primary" icon="el-icon-edit" @click="shengHe(scope.row)"></el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态"> </el-table-column>
        <el-table-column prop="rmarks" label="备注" width=200>
          <template slot-scope="scope">
            <div v-for="item in scope.row.rmarks" class="mark">
              <span class="span1">[{{Timef1(item.timef)}}]</span> &nbsp;{{item.text}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="listData" label="删除" v-if="shbtn">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" @click="listDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="清单明细" :visible.sync="mx.dialogFormVisible" :fullscreen="mx.fullscreen">
        <template>
          <el-col class="box" v-if="mx.username == loginUserName||shbtn">
            <div class="el-table-add-row" style="width: 99.2%;" @click="tjMasterUser()">
              <span class="tianjia">提交明细清单修改</span>
            </div>
          </el-col>
          <el-col class="box">
            <div class="el-table-add-row green" style="width: 99.2%;" @click="dc()">
              <span class="tianjia">导出明细数据</span>
            </div>
          </el-col>
          <el-table :data="mx.mxData" style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <!-- <el-table-column prop="dateOfApplication" label="日期"></el-table-column> -->
            <el-table-column prop="dateOfInbound" label="日期">
              <template slot-scope="scope">
                <!-- <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="请输入内容" v-model="mx.sel['dateOfInbound']"></el-input>
              </span>
              <span v-else>{{ Timef(scope.row['dateOfInbound']) }}</span> -->
                <!-- <span>{{ Timef(scope.row['dateOfInbound']) }}</span> -->
                <span>{{scope.row['dateOfInbound']}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="drugType" label="部门">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-select v-model="mx.sel['drugType']" placeholder="请选择类别">
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
                  <el-select v-model="mx.sel['type']" placeholder="请选择类别">
                    <el-option label="中药" value="中药"></el-option>
                    <el-option label="西药" value="西药"></el-option>
                    <el-option label="卫材" value="卫材"></el-option>
                  </el-select>
                </span>
                <span v-else>{{ scope.row['type'] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="药品名称" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input class="inline-input" v-model="mx.sel['name']" placeholder="请输入内容"></el-input>
                </span>
                <span v-else>{{ scope.row['name'] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Formulation" label="剂型">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input size="mini" placeholder="请输入内容" v-model="mx.sel['Formulation']">
                  </el-input>
                </span>
                <span v-else>{{ scope.row['Formulation'] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="format" label="规格">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input size="mini" placeholder="请输入内容" v-model="mx.sel['format']">
                  </el-input>
                </span>
                <span v-else>{{ scope.row['format'] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input size="mini" placeholder="请输入内容" v-model="mx.sel['unit']">
                  </el-input>
                </span>
                <span v-else>{{ scope.row['unit'] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="money" sortable label="进价">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input size="mini" placeholder="请输入内容" v-model="mx.sel['money']">
                  </el-input>
                </span>
                <span v-else>{{ scope.row['money'] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sellers" label="供货商">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input size="mini" placeholder="请输入内容" v-model="mx.sel['sellers']">
                  </el-input>
                </span>
                <span v-else>{{ scope.row['sellers'] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="manufacturer" label="生产厂家">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input size="mini" placeholder="请输入内容" v-model="mx.sel['manufacturer']">
                  </el-input>
                </span>
                <span v-else>{{ scope.row['manufacturer'] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="number" label="数量">
              <template slot-scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input size="mini" placeholder="请输入内容" v-model="mx.sel['number']">
                  </el-input>
                </span>
                <span v-else>{{ scope.row['number'] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" v-if="mx.username == loginUserName">
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
            <el-table-column prop="address" label="价格对比">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-search" @click="db(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-dialog>

      <el-dialog title="价格对比" :visible.sync="drug_infos.dialogFormVisible" :fullscreen="drug_infos.fullscreen">
        <template>
          <div style="text-align: left;">
            <el-select v-model="drug_infos.name" filterable remote multiple reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="drug_infos.loading">
              <el-option v-for="item in drug_infos.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" @click="drug_infosSelect()" style="margin-left: 10px;">查询</el-button>
          </div>
          <el-table :data="drug_infos.data" style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="dateOfInbound" label="日期" width="120" sortable>
              <template slot-scope="scope">
                {{ Timef2(scope.row.dateOfInbound) }}
                <!-- {{ scope.row.dateOfInbound }} -->
              </template>
            </el-table-column>
            <el-table-column prop="drugType" label="部门"></el-table-column>
            <el-table-column prop="type" label="分类"></el-table-column>
            <el-table-column prop="name" label="药品名称" width="200"></el-table-column>
            <el-table-column prop="Formulation" label="剂型"></el-table-column>
            <el-table-column prop="format" label="规格"></el-table-column>
            <el-table-column prop="unit" label="单位"></el-table-column>
            <el-table-column prop="money" sortable label="进价"></el-table-column>
            <el-table-column prop="sellers" label="供货商"></el-table-column>
            <el-table-column prop="manufacturer" label="生产厂家"></el-table-column>
            <el-table-column prop="number" label="数量"></el-table-column>
          </el-table>
        </template>
      </el-dialog>
      <el-dialog title="清单审核" :visible.sync="sh.dialogFormVisible" id="sh">
        <template>
          <el-form :model="shValidateForm" ref="shValidateForm">
            <el-form-item label="id" :label-width="formLabelWidth" style="display:none">
              <el-input type="text" v-model="shValidateForm.id"></el-input>
            </el-form-item>
            <el-form-item label="审核状态" :label-width="formLabelWidth">
              <el-select v-model="shValidateForm.status" placeholder="请选择审核状态">
                <el-option label="未审核" value="未审核"></el-option>
                <el-option label="通过" value="通过"></el-option>
                <el-option label="未通过" value="未通过"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="shValidateForm.rmarks"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit(shValidateForm)">提交审核</el-button>
              <el-button @click="resetForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>
    </div>
    <div style="padding-top:5vh">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40,50,60,70,80,90,100]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
import XLSX from "xlsx";
import FileSaver from "file-saver";
var generateId = {
  _count: 1,
  get() {
    return +new Date() + "_" + this._count++;
  }
};

export default {
  name: "shenhe",
  data: function() {
    return {
      currentPage: 1, //当前页数
      total: 0, //总条数
      pageSize: 10, //每页条数
      onclearable: false,
      formLabelWidth: "120px",
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
      drug_infos: {
        data: [],
        name: "",
        options: [],
        value: [],
        list: [],
        states: [],
        loading: false,
        dialogFormVisible: false,
        fullscreen: true
      },
      shbtn: false,
      loginUserName: "",
      mx: {
        dialogFormVisible: false,
        fullscreen: true,
        drugType: "",
        username: "",
        type: "",
        dateOfApplication: "",
        mxData: [],
        mxDataDown: [],
        sel: null,
        id: 0,
        isSet: false
      },
      sh: { dialogFormVisible: false },
      shValidateForm: { id: 0, status: "", rmarks: "", oldStatus: "" },
      yp_List: [],
      yp_listOne: [],
      list_info: {
        dateOfInbound1: "",
        dateOfInbound2: "",
        name: "",
        status: "无",
        drugType: "无"
      },
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
  created() {
    let loginUSer = JSON.parse(localStorage.getItem("loginUSer"));
    let drugType = loginUSer.drugType;
    this.loginUserName = loginUSer.username;
    // this.mx.drugType = drugType;
    let type = loginUSer.type;
    if (type == "核查") {
      this.shbtn = false;
    } else {
      this.shbtn = true;
    }
    let username = loginUSer.username;

    let str = "";
    // if (type == '管理员' || type == '审核') {
    //   str = '';
    // } else {
    //   str = "where drugType='" + drugType + "' and username='" + username + "'";
    // }
    this.onload();
  },
  mounted() {},
  methods: {
    mingXi(row) {
      this.mx.dialogFormVisible = true;
      let mxData = JSON.parse(row.listData);
      this.mx.dateOfApplication = row.dateOfApplication;
      this.mx.id = row.id;
      this.mx.username = row.username;
      this.mx.mxDataDown = JSON.parse(row.listData);
      this.mx.mxData = [];
      let _this = this;
      mxData.forEach(element => {
        element.isSet = false;
        // element.dateOfInbound = Date.parse(element.dateOfInbound) / 1000;
        _this.mx.mxData.push(element);
      });
      // console.log(this.yp_List);
      console.log(this.mx.mxData);
    },
    listDelete(row) {
      let id = row.id;
      this.$confirm("此操作将永久删除条记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(
              "http://yaopin.zmq777.top/yaopingdata/ypListOperating.php",
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
    shengHe(row) {
      // console.log(row);
      this.sh.dialogFormVisible = true;
      this.shValidateForm.oldStatus = row.status;
      this.shValidateForm.status = row.status;
      this.shValidateForm.id = row.id;
      let mxData = JSON.parse(row.listData);
      this.mx.mxData = [];
      let _this = this;
      mxData.forEach(element => {
        element.isSet = false;
        element.dateOfInbound = Date.parse(element.dateOfInbound) / 1000;
        _this.mx.mxData.push(element);
      });
    },
    onSubmit(formName) {
      // console.log(this.mx.mxData);
      let timef = Date.parse(new Date()) / 1000;
      if (formName.status == this.shValidateForm.oldStatus) {
        if (formName.rmarks != "") {
          this.insertMark(formName.rmarks, timef, formName.id);
          this.shValidateForm.rmarks = "";
          this.sh.dialogFormVisible = false;
          this.onload();
        }
      } else {
        let sql = " set status='" + formName.status + "'";
        if (formName.rmarks != "") {
          this.insertMark(formName.rmarks, timef, formName.id);
        }
        sql += " where id=" + formName.id;
        this.updateYpList(sql);
        if (formName.status == "通过") {
          let listData = JSON.stringify(this.mx.mxData);
          this.addDrugList(timef, listData);
        }
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
    updateYpList(sql) {
      this.$http
        .post(
          "http://yaopin.zmq777.top/yaopingdata/ypListOperating.php",
          {
            q: "update",
            str: sql
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
            this.shValidateForm.rmarks = "";
            this.sh.dialogFormVisible = false;
            this.onload();
          } else {
            this.$message.error("提交失败!");
          }
        });
    },
    insertMark(mark, timef, p_id) {
      this.$http
        .post(
          "http://yaopin.zmq777.top/yaopingdata/rmarksOperating.php",
          {
            q: "insert",
            mark: mark,
            timef: timef,
            p_id: p_id,
            str: ""
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
          } else {
            this.$message.error("提交失败!");
          }
        });
    },
    resetForm(formName) {
      this.shValidateForm.rmarks = "";
      this.sh.dialogFormVisible = false;
    },
    listInFoResetForm(formName) {
      // this.$refs[formName].resetFields();
      this.list_info.drugType = "无";
      this.list_info.status = "无";
      this.list_info.name = "";
      this.list_info.dateOfInbound1 = "";
      this.list_info.dateOfInbound2 = "";
    },
    listInFoSub() {
      if (
        (this.list_info.drugType == "无") &
        (this.list_info.status == "无") &
        (this.list_info.name == "") &
        (this.list_info.dateOfInbound1 == "") &
        (this.list_info.dateOfInbound2 == "")
      ) {
        this.onload();
      } else {
        let sql = "where 1=1";
        if (this.list_info.drugType != "无") {
          sql += " and drugType='" + this.list_info.drugType + "'";
        }
        if (this.list_info.status != "无") {
          sql += " and status='" + this.list_info.status + "'";
        }
        if (this.list_info.name != "") {
          sql += " and username like '%" + this.list_info.name + "%'";
        }
        if (this.list_info.dateOfInbound1 != "") {
          let dateOfInbound1 = this.formatDate(
            this.list_info.dateOfInbound1,
            "yyyy-M-d"
          );
          dateOfInbound1 =
            Date.parse(new Date(dateOfInbound1 + " 00:00:00")) / 1000;
          sql += " and dateOfApplication >= '" + dateOfInbound1 + "'";
        }
        if (this.list_info.dateOfInbound2 != "") {
          let dateOfInbound2 = this.formatDate(
            this.list_info.dateOfInbound2,
            "yyyy-M-d"
          );
          dateOfInbound2 =
            Date.parse(new Date(dateOfInbound2 + " 00:00:00")) / 1000 + 86400;
          sql += " and dateOfApplication < '" + dateOfInbound2 + "'";
        }
        this.$http
          .post(
            "http://yaopin.zmq777.top/yaopingdata/ypListOperating.php",
            {
              q: "init",
              str: sql
            },
            {
              emulateJSON: true
            }
          )
          .then(response => {
            this.yp_List = response.data;
            this.yp_listOne = this.sizeUpdateData(1, this.pageSize);
          });
      }
    },
    db(row) {
      // console.log(this.mx.drugType);
      this.drug_infos.name = [];
      this.drug_infos.options = [];
      let sql = "where name like '%" + row.name + "%'";
      let _this = this;
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
          _this.drug_infos.data = response.data;
          _this.drug_infos.dialogFormVisible = true;
        });
      this.$http
        .post(
          "http://yaopin.zmq777.top/yaopingdata/ypInfoOperating.php",
          {
            q: "fiterName",
            str: ""
          },
          {
            emulateJSON: true
          }
        )
        .then(response => {
          // _this.drug_infos.states = response.data;
          _this.drug_infos.list = response.data.map(item => {
            return { value: item.name, label: item.name };
          });
        });
    },
    remoteMethod(query) {
      // this.drug_infos.name = query;
      if (query !== "") {
        this.drug_infos.loading = true;
        setTimeout(() => {
          this.drug_infos.loading = false;
          this.drug_infos.options = this.drug_infos.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.drug_infos.options = [];
      }
    },
    drug_infosSelect() {
      let name = this.drug_infos.name;
      if (name.length == 0 || name == "" || name == null) {
        alert("空值不能查询");
        return;
      }
      let strs = "";
      name.forEach(function(item) {
        strs += ",'" + item + "'";
      });
      strs = strs.substr(1);
      let sql = "where name in (" + strs + ")";
      let _this = this;
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
          _this.drug_infos.data = response.data;
          _this.drug_infos.dialogFormVisible = true;
        });
    },
    Timeformat(row, column, cellValue) {
      if (cellValue == null || cellValue == "") {
      } else {
        return column;
      }
    },
    onload() {
      this.$http
        .post(
          "http://yaopin.zmq777.top/yaopingdata/ypListOperating.php",
          {
            q: "init",
            str: ""
          },
          {
            emulateJSON: true
          }
        )
        .then(response => {
          this.yp_List = response.data;
          this.yp_listOne = this.sizeUpdateData(1, this.pageSize);
        });
    },
    pwdChange(row, index, cg) {
      //点击修改 判断是否已经保存所有操作
      let _this = this;

      for (let i of _this.mx.mxData) {
        if (i.isSet && i.id != row.id) {
          _this.$message.warning("请先保存当前编辑项");
          return false;
        }
      }
      //是否是取消操作
      if (!cg) {
        // if (!this.mx.sel.id) this.mx.mxData.splice(index, 1);
        return (row.isSet = !row.isSet);
      }
      //提交数据
      if (row.isSet) {
        let data = JSON.parse(JSON.stringify(this.mx.sel));
        if (data.name == "" || data.name == null) {
          _this.$message.warning("药品名称不能为空");
          return false;
        } else {
          for (let k in data) row[k] = data[k];
          // this.$message({
          //   type: 'success',
          //   message: '修改成功!'
          // });
          //然后这边重新读取表格数据
          this.readMasterUser();
          row.isSet = false;
        }
      } else {
        this.mx.sel = JSON.parse(JSON.stringify(row));
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
          this.mx.mxData.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    readMasterUser() {
      //根据实际情况，自己改下啊
      this.mx.mxData.map(i => {
        i.id = generateId.get(); //模拟后台插入成功后有了id
        return i;
      });
    },
    tjMasterUser() {
      // console.log(this.mx.mxData);
      for (let i of this.mx.mxData) {
        if (i.isSet) {
          return this.$message.warning("请先保存当前编辑项");
        } else {
        }
      }
      let id = this.mx.id;
      let listData = JSON.stringify(this.mx.mxData);
      let sql = " set listData='" + listData + "' where id=" + id;
      this.$http
        .post(
          "http://yaopin.zmq777.top/yaopingdata/ypListOperating.php",
          {
            q: "update",
            str: sql
          },
          {
            emulateJSON: true
          }
        )
        .then(response => {
          if (response.data == 1) {
            this.onload();
            this.$message({
              type: "success",
              message: "提交成功!"
            });
            this.mx.dialogFormVisible = false;
          } else {
            this.$message.error("提交失败!");
          }
        });
    },
    Timef(value) {
      // console.log(value);
      var unixTimestamp = new Date(value * 1000);
      var commonTime = unixTimestamp.toLocaleString();
      var commonTime = commonTime.substring(0, commonTime.indexOf("上"));
      return commonTime;
    },
    Timef2(value) {
      var unixTimestamp = new Date(value * 1000);
      var commonTime = unixTimestamp.toLocaleString();
      if (commonTime.indexOf("上") >= 0) {
        var commonTime = commonTime.substring(0, commonTime.indexOf("上"));
      } else if (commonTime.indexOf("下") >= 0) {
        var commonTime = commonTime.substring(0, commonTime.indexOf("下"));
      }
      return commonTime;
      // return value;
    },
    Timef1(value) {
      var unixTimestamp = new Date(value * 1000);
      var commonTime = unixTimestamp.toLocaleString();
      return commonTime;
    },
    dc() {
      if (this.mx.mxData.length == 0) {
        return this.$message.warning("没有数据无法导出!");
      }
      let dd = this.getFileData();
      // console.log(dd);
      this.exportFile(dd, "sheet1", "all");
    },
    getFileData() {
      let tableDataParam = this.mx.mxDataDown;
      let allData = [];
      let titlesData = [];
      let _this = this;
      let lineData = [];
      let allLineData = [];
      for (let item of this.tableTitles) {
        titlesData.push(item.label);
      }
      let titleLen = this.tableTitles.length;
      for (let item of tableDataParam) {
        lineData = [];
        for (let i = 0; i < titleLen; i++) {
          lineData.push(item[this.tableTitles[i].prop]);
        }

        // lineData.push();
        allLineData.push(lineData);
      }
      allData.push(titlesData);
      allData = allData.concat(allLineData);
      return allData;
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.yp_listOne = this.sizeUpdateData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      console.log(this.pageSize);
      this.yp_listOne = this.sizeUpdateData(val, this.pageSize);
      // console.log(this.yp_listOne);
    },
    sizeUpdateData(lev, size) {
      let listData = this.yp_List;
      this.total = listData.length;
      // console.log(lev);
      // console.log(size);
      let num = (lev - 1) * size,
        end = num + size,
        array = [];
      for (let i = num; i < end; i++) {
        if (listData[i]) {
          array.push(listData[i]);
        }
        //
        // console.log(listData[i]);
      }

      return array;
    }
  }
};
</script>

<style scoped>
.el-select {
  float: left;
}
.el-table-add-row {
  margin-bottom: 10px;
  width: 100%;
  height: 34px;
  /* border: 1px dashed #c1c1cd; */
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  display: flex;
  line-height: 34px;
  background-color: #23a67c;
  color: white;
  opacity: 0.8;
}
.el-table-add-row:hover {
  opacity: 1;
}
.green {
  background-color: #409eff;
}
.span1 {
  color: #5eb95e;
}

.span2 {
  color: #dd514c;
}

.span3 {
  color: #5aa4e7;
}
.mark {
  /* border-bottom: 1px solid #999; */
}
</style>
