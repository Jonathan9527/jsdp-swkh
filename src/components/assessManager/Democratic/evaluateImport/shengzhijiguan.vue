<template>
  <div id="shengzhijiguan">
    <div class="top">
      <el-form
        :inline="true"
        :model="form"
        class="demo-form-inline"
        onsubmit="return false"
        style="padding: 4px 0px 10px 0; overflow: hidden;"
      >
        <span style="line-height: 2.5;">年度：</span>
        <el-select
          v-model="form.niandu"
          placeholder="年度"
          size="medium"
          style="width: 90px;margin-right: 20px;"
          @change="change"
        >
          <el-option
            v-for="item in options"
            :key="item.mainValue"
            :label="item.mainValue"
            :value="item.mainValue"
          ></el-option>
        </el-select>
        <span style="line-height: 2.5;">单位类型：</span>
        <el-select
          v-model="form.deptType"
          placeholder="单位类型"
          size="medium"
          style="width: 115px;margin-right: 20px;"
          @change="getshengzhiName"
        >
          <el-option
            v-for="item in shengzhiType"
            :key="item.value"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
        <span style="line-height: 2.5;">单位名称：</span>
        <el-select
          v-model="form.deptName"
          placeholder="单位名称"
          size="medium"
          style="width: 300px;margin-right: 20px;"
          @change="change"
        >
          <el-option
            v-for="item in shengzhiName"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
        <span style="line-height: 2.5;">测评表分类：</span>
        <el-select
          v-model="form.modelType"
          placeholder="测评表分类"
          size="medium"
          @change="change"
          style="width: 210px;margin-right: 20px;"
        >
          <el-option label="省直机关班子民主测评表" value="省直机关班子民主测评表"></el-option>
          <el-option label="省直机关班子成员民主测评表" value="省直机关班子成员民主测评表"></el-option>
        </el-select>
        <div class="btnworpbox">
          <!-- <el-button type="primary" size="medium" @click="download">Excel模板下载</el-button> -->
          <el-button type="primary" size="medium" class="bluebtnclass" @click="Import">数据导入</el-button>
          <el-button
            type="primary"
            size="medium"
            class="bluebtnclass"
            @click="exportExcel(form.modelType)"
          >数据导出</el-button>
        </div>
      </el-form>
      <div class="tow" v-show="tow">
        <h1 class="title">省直机关班子民主测评表
          <br>
          <span style="font-size:20px">（{{form.deptName}}）</span>
        </h1>
        <div class="date">
          <div class="shujushow">测评时间：
            <span>{{form2.date}}</span>
          </div>
          <div class="shujushow">
            发出数：
            <span>{{form2.issue}}</span>
            收回数：
            <span>{{form2.takeBack}}</span>
            有效数：
            <span>{{form2.effective}}</span>
            无效数：
            <span>{{form2.invalid}}</span>
          </div>
        </div>
        <template>
          <el-table
            id="banzishujusz"
            ref="multipleTable"
            :data="tableData2"
            tooltip-effect="dark"
            border=""
            style="width: 100%;margin-top:10px;"
            stripe
          >
            <el-table-column prop="ruing" label="序号" width="70" type="index"></el-table-column>
            <el-table-column prop="title" label="类别" width="400">
              <!-- <el-table-column prop="title" label="类别" >
              </el-table-column>-->
            </el-table-column>
            <el-table-column label="评价意见">
              <el-table-column prop="excellent" label="好"></el-table-column>
              <el-table-column prop="good" label="较好"></el-table-column>
              <el-table-column prop="competent" label="一般"></el-table-column>
              <el-table-column prop="worse" label="较差"></el-table-column>
              <el-table-column prop="nohave" label="未填"></el-table-column>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="three" v-show="three">
        <h1 class="title">省直机关班子成员民主测评表
          <br>
          <span style="font-size:20px">（{{form.deptName}}）</span>
        </h1>
        <div class="date">
          <div class="shujushow">测评时间：
            <span>{{form2.date}}</span>
          </div>
          <div class="shujushow">
            发出数：
            <span>{{form2.issue}}</span>
            收回数：
            <span>{{form2.takeBack}}</span>
            有效数：
            <span>{{form2.effective}}</span>
            无效数：
            <span>{{form2.invalid}}</span>
          </div>
        </div>
        <el-table
          id="banzishujudz"
          ref="multipleTable"
          :row-class-name="tableRowClassName"
          :data="tableData3"
          tooltip-effect="dark"
          height="500"
          border=""
          style="margin-top:10px;"
        >
          <!-- <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="medium" type="primary" @click="bangding(scope.row)">绑定干部</el-button>
            </template>
          </el-table-column>-->
          <el-table-column prop="ruing" label="序号" width="70" type="index"></el-table-column>
          <el-table-column prop="peopleName" label="姓名" width="200"></el-table-column>
          <el-table-column :label="item.name" v-for="(item,index) in columnList" :key="index">
            <el-table-column
              :prop="val.prop"
              :label="val.name"
              v-for="(val,index) in item.children"
              :key="index"
            ></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        title="导入数据"
        :visible.sync="ImportData"
        width="30%"
        center
        class="proupClass"
      >
        <div>
          <div class="desc">
            <p class="daorutitle">步骤一：</p>
            <p class="daorubody">批量导入将按照年度、省直机关、测评表分类作为唯一识别码进行数据覆盖操作(数据库没有则新增；有则覆盖)。
              <br>
              <span>
                请下载：
                <a :href="mobanuri1" class="xiazaimoban" target="_blank">省直机关班子民主测评表</a>
                <a :href="mobanuri2" class="xiazaimoban" target="_blank">省直机关班子成员民主测评表</a>
              </span>
              <br>
              <span class="mobantip">根据模板提示填写评测内容，上传的文件须保持 “省直班子年度测评表” 、“省直班子成员民主测评表” 文件名不变。</span>
            </p>
            <p class="daorutitle">步骤二：</p>
            <p class="daorubody">下拉选择“年度”，“省直机关”，“测评表分类”，点击“选取文件”按钮进行选择需要导入的文件，四个属性都是必填</p>
            <p class="daorutitle">步骤三：</p>
            <p class="daorubody">
              点击“确定”按钮，则系统将文件上传至服务器并实时处理。注：处理过程中请不要关闭本窗口或浏览器
              点击“取消”按钮，则结束本次批量导入操作。
            </p>
          </div>
          <el-form
            :inline="true"
            :model="form"
            class="demo-form-inline"
            onsubmit="return false"
            label-width="90px"
            label-position="left"
          >
            <el-form-item label="年度:">
              <!-- <span class="sp">年度</span> -->
              <el-select v-model="form.niandu" placeholder="年度" size="mini" @change="change">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="省直机关:">
              <el-select v-model="form.deptName" placeholder="省直机关" size="mini" @change="change">
                <el-option
                  v-for="item in shengzhiName"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="测评表分类:">
              <el-select v-model="form.modelType" placeholder="测评表分类" size="mini" @change="change">
                <el-option label="省直机关班子民主测评表" value="省直机关班子民主测评表"></el-option>
                <el-option label="直机关班子成员民主测评表" value="直机关班子成员民主测评表"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文件:">
              <el-upload
                class="upload-demo"
                action="http://192.168.11.208:9095/democraticEvaluation/importExcel"
                :on-change="handlePreview"
                accept=".xls"
                :limit="1"
                :file-list="fileList"
                :auto-upload="false"
              >
                <el-button size="small" type="primary" class="proupbtnqueding">选取文件</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ImportData = false" class="proupbtnquxiao">取 消</el-button>
          <el-button type="primary" class="proupbtnqueding" @click="tan">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        title="提示"
        :visible.sync="prompt"
        width="30%"
        class="proupClass"
      >
        <span>已有相同表格，是否覆盖</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="prompt = false" class="proupbtnquxiao">取 消</el-button>
          <el-button type="primary" class="proupbtnqueding" @click="prompt2">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 评分弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        title="绑定干部信息"
        :visible.sync="pingfen"
        class="proupClass"
      >
        <div>
          <!-- 表格 -->
          <el-table
            :data="tanchuangData"
            border=""
            stripe
            highlight-current-row
            @current-change="handleCurrentChange"
            @row-click="showRow"
          >
            <el-table-column label="选择" width="70" center>
              <template scope="scope">
                <el-radio
                  class="radio"
                  v-model="radio"
                  :label="scope.$index"
                  @change.native="getCurrentRow(scope.row)"
                >&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
          </el-table>
        </div>
        <el-button
          @click="pingfen2"
          type="primary"
          class="proupbtnqueding"
          style="margin: 20px 0px 20px 90%"
        >确 定</el-button>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { log } from "util";
export default {
  data() {
    return {
      shengzhiType: [
        {
          value: "省直一类",
          id: "1"
        },
        {
          value: "省直二类",
          id: "2"
        },
        {
          value: "省直三类",
          id: "3"
        }
      ],
      shengzhiName: [],
      radio: "",
      params: {
        //数据传值
        name: "",
        id: "",
        niandu: "",
        departmentName: "",
        pageNum: 1,
        pageCount: 15
      },
      tanchuangData: [], //弹窗数据
      fileList: [],
      columnList: [
        {
          name: "评价意见",
          children: [
            {
              name: "优秀",
              prop: "overallExcellent"
            },
            {
              name: "优秀率(%)",
              prop: "overallExcellentPct"
            },
            {
              name: "称职",
              prop: "overallGood"
            },
            {
              name: "称职率(%)",
              prop: "overallGoodPct"
            },
            {
              name: "基本称职",
              prop: "overallCompetent"
            },
            {
              name: "基本称职率(%)",
              prop: "overallCompPct"
            },
            {
              name: "不称职",
              prop: "overallIncompetent"
            },
            {
              name: "不称职率(%)",
              prop: "overallIncompPct"
            },
            {
              name: "未填",
              prop: "overallNull"
            },
            {
              name: "未填率(%)",
              prop: "overallNullPct"
            }
          ]
        },
        // {
        //   name: "德",
        //   children: [
        //     {
        //       name: "优秀",
        //       prop: "deExcellent"
        //     },
        //     {
        //       name: "称职",
        //       prop: "deGood"
        //     },
        //     {
        //       name: "基本称职",
        //       prop: "deNormal"
        //     },
        //     {
        //       name: "不称职",
        //       prop: "deWorse"
        //     },
        //     {
        //       name: "未填",
        //       prop: "deNull"
        //     }
        //   ]
        // },
        // {
        //   name: "能",
        //   children: [
        //     {
        //       name: "优秀",
        //       prop: "nengExcellent"
        //     },
        //     {
        //       name: "称职",
        //       prop: "nengGood"
        //     },
        //     {
        //       name: "基本称职",
        //       prop: "nengNormal"
        //     },
        //     {
        //       name: "不称职",
        //       prop: "nengWorse"
        //     },
        //     {
        //       name: "未填",
        //       prop: "nengNull"
        //     }
        //   ]
        // },
        // {
        //   name: "勤",
        //   children: [
        //     {
        //       name: "优秀",
        //       prop: "qinExcellent"
        //     },
        //     {
        //       name: "称职",
        //       prop: "qinGood"
        //     },
        //     {
        //       name: "基本称职",
        //       prop: "qinNormal"
        //     },
        //     {
        //       name: "不称职",
        //       prop: "qinWorse"
        //     },
        //     {
        //       name: "未填",
        //       prop: "qinNull"
        //     }
        //   ]
        // },
        // {
        //   name: "绩",
        //   children: [
        //     {
        //       name: "优秀",
        //       prop: "jiExcellent"
        //     },
        //     {
        //       name: "称职",
        //       prop: "jiGood"
        //     },
        //     {
        //       name: "基本称职",
        //       prop: "jiNormal"
        //     },
        //     {
        //       name: "不称职",
        //       prop: "jiWorse"
        //     },
        //     {
        //       name: "未填",
        //       prop: "jiNull"
        //     }
        //   ]
        // },
        // {
        //   name: "廉",
        //   children: [
        //     {
        //       name: "优秀",
        //       prop: "lianExcellent"
        //     },
        //     {
        //       name: "称职",
        //       prop: "lianGood"
        //     },
        //     {
        //       name: "基本称职",
        //       prop: "lianNormal"
        //     },
        //     {
        //       name: "不称职",
        //       prop: "lianWorse"
        //     },
        //     {
        //       name: "未填",
        //       prop: "lianNull"
        //     }
        //   ]
        // }
      ],
      one: true,
      tow: false,
      three: false,
      ImportData: false,
      prompt: false,
      pingfen: false,
      options: [],
      form: {
        niandu: "2018",
        deptName: "",
        modelType: "省直机关班子民主测评表",
        deptType: "1"
      },
      tableData: [],
      tableData2: [],
      tableData3: [],
      fileObj: {},
      form2: {
        date: "",
        issue: "",
        takeBack: "",
        effective: "",
        invalid: ""
      },
      // 获取id
      uid: "",
      vid: "",
      mobanuri1: "",
      mobanuri2: ""
    };
  },
  methods: {
    getniandu() {
      this.$http
        .post(globalConfig.server4 + "tDictionaryController/getListForCode", {
          code: "nd"
        })
        .then(res => {
          if (res.data.response_code == "0") {
            this.options = res.data.response_body;
          }
        });
    },
    //获取省直单位
    getshengzhiName(val) {
      this.form.deptName = "";
      let params = {
        sz_type: val
      };
      this.$http
        .post(globalConfig.server4 + "department/selectNameBysztype", params)
        .then(res => {
          if (res.data.response_code == "0") {
            this.shengzhiName = res.data.response_body.departments;
            this.form.deptName = res.data.response_body.departments[0].name;
          } else {
            this.shengzhiName = [];
          }
          this.change();
        });
    },
    //查询
    tableRowClassName({ row, rowIndex }) {
      if (row.peopleNo == null || row.peopleNo == "") {
        return "warning-row";
      }
      return "";
    },
    change() {
      if (this.form.modelType == "省直机关班子民主测评表") {
        this.tow = true;
        this.one = false;
        this.three = false;
      } else if (this.form.modelType == "省直机关班子成员民主测评表") {
        this.three = true;
        this.one = false;
        this.tow = false;
      }
      // this.ControllershowMsg()
      let type = this.form.deptType;
      let fd = {
        niandu: this.form.niandu,
        deptName: this.form.deptName,
        modelType: this.form.modelType,
        type: Number(type) + 1
      };
      this.$http
        .post(
          globalConfig.server4 + "ShowMadeOrganMsgForExcelController/showMsg",
          fd
        )
        .then(res => {
          console.log(this.form.modelType);
          if (res.data.response_code === "0") {
            if (this.form.modelType == "省直机关班子民主测评表") {
              this.tableData2 = res.data.response_body.result;
              this.tableData2.forEach((item, index) => {
                // if (item.isdesc == 9) {
                //   this.tableData2.splice(index, 1);
                // }
              });

              this.form2.date = this.formatDate(
                "yyyy-MM-dd",
                res.data.response_body.model.evaluateDate
              );
              this.form2.issue = res.data.response_body.model.sendoutNum;
              this.form2.takeBack = res.data.response_body.model.backNum;
              this.form2.effective = res.data.response_body.model.validNum;
              this.form2.invalid = res.data.response_body.model.invalidNum;
            } else if (this.form.modelType == "省直机关班子成员民主测评表") {
              this.tableData3 = res.data.response_body.result
              this.tableData3.forEach(item=>{
                for(let key in item){
                  if(!item[key]){
                    item[key] = 0
                  }
                }
              })
              this.form2.date = this.formatDate(
                "yyyy-MM-dd",
                res.data.response_body.model.evaluateDate
              );
              this.form2.issue = res.data.response_body.model.sendoutNum;
              this.form2.takeBack = res.data.response_body.model.backNum;
              this.form2.effective = res.data.response_body.model.validNum;
              this.form2.invalid = res.data.response_body.model.invalidNum;
            }
          } else {
            this.form2 = {};
            this.tableData = [];
            this.tableData2 = [];
            this.tableData3 = [];
            this.$message({
              type: "success",
              message: "您查找的表格不存在!"
            });
          }
        });
    },
    showRow(row) {
      this.radio = this.tanchuangData.indexOf(row);
    },
    handleCurrentChange(val, index) {
      this.currentRow = val;
      this.$emit("data", val.pkg);
    },

    getCurrentRow(val) {
      this.vid = val.peopleId;
    },
    //弹出干部信息
    tanchuangsearch() {
      let params = {
        niandu: this.form.niandu,
        deptment: this.form.deptment
      };
      this.$http
        .post(globalConfig.server3 + "people/selectAllPeopleName", params)
        .then(res => {
          if (res.data.response_code === "0") {
            this.tanchuangData = res.data.response_body;
          } else {
          }
        });
    },
    //绑定干部
    pingfen2() {
      this.pingfen = true;
      let params = {
        peopleDetailId: this.uid,
        peopleId: this.vid
      };
      this.tanchuangsearch();

      this.$http
        .post(
          globalConfig.server4 + "democraticEvaluation/insertDutyToPeople",
          params
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.$message({
              type: "success",
              message: "绑定成功!"
            });
            this.pingfen = false;
            this.change();
          } else {
            this.$message({
              type: "error",
              message: "绑定失败!"
            });
            this.change();
          }
        });
    },
    download() {},
    bangding(val) {
      this.pingfen = true;
      this.uid = val.id;
    },
    Import() {
      this.ImportData = true;
      this.mobanuri1 =
        globalConfig.server1 + "shouce/省直机关班子民主测评表.xls";
      this.mobanuri2 =
        globalConfig.server1 + "shouce/省直机关班子成员民主测评表.xls";
    },

    dialogVisible2(params) {
      let fd = new FormData();
      fd.append("file", this.fileObj);
      fd.append("requestBody", JSON.stringify(params));

      this.$http
        .post(
          globalConfig.server4 + "GetPeopleForExcelController/importExcel",
          fd
        )
        .then(res => {
          if (res.data.response_code === "0") {
            this.$message({
              type: "success",
              message: "添加成功!"
            });

            let fd2 = new FormData();
            let type = this.form.deptType;
            fd2.append("niandu", this.form.niandu);
            fd2.append("deptName", this.form.deptName);
            fd2.append("modelType", this.form.modelType);
            fd2.append("type", Number(type) + 1);
            // console.log(fd2.get("type"));
            this.$http
              .post(
                globalConfig.server4 + "democraticEvaluation/callFormula",
                fd2
              )
              .then(res => {
                if (res.data.response_code === "0") {
                  this.$message({
                    type: "success",
                    message: "计算成功!"
                  });
                  let type = this.form.deptType;
                  let paramsss = {
                    niandu: this.form.niandu,
                    citytype: this.form.deptName,
                    type: Number(type) + 1
                  };
                  if (this.form.modelType == "省直机关班子成员民主测评表") {
                    this.$http
                      .post(
                        globalConfig.server4 +
                          "democraticEvaluation/bindingPeople",
                        paramsss
                      )
                      .then(res => {
                        if (res.data.response_code === "0") {
                          this.$message({
                            type: "success",
                            message: "绑定成功!"
                          });
                          this.change();
                        } else {
                          this.change();
                        }
                      });
                  }else{
                    this.change();
                  }
                  
                } else {
                }
              });

            this.ImportData = false;
            // this.form = {
            //   niandu: this.form.niandu,
            //   deptName: this.form.deptName,
            //   modelType: this.form.modelType,
            // }
            this.fileList = [];
            
          } else {
            this.$message({
              type: "error",
              message: res.data.response_body
            });
          }
        });
    },
    //文件查重
    tan() {
      let type = this.form.deptType;
      let params = {
        niandu: this.form.niandu,
        deptName: this.form.deptName,
        type: Number(type) + 1,
        modelType: this.form.modelType
      };
      this.$http
        .post(
          globalConfig.server4 + "GetPeopleForExcelController/selectOther",
          params
        )
        .then(res => {
          if (res.data.response_code === "0") {
            this.$message({
              type: "warning",
              message: "文件已存在!"
            });
            this.prompt = true;
          } else {
            this.dialogVisible2(params);
          }
        });
    },

    prompt2() {
      let type = this.form.deptType;
      let fd = {
        niandu: this.form.niandu,
        deptName: this.form.deptName,
        type: Number(type) + 1,
        modelType: this.form.modelType
      };
      this.$http
        .post(
          globalConfig.server4 + "GetPeopleForExcelController/deleteOthers",
          fd
        )
        .then(res => {
          if (res.data.response_code === "0") {
            this.$message({
              type: "success",
              message: "数据删除成功，请重新插入!"
            });
            this.prompt = false;
            this.tan();
          } else {
          }
        });
    },
    //数据导出
    exportExcel(val) {
      console.log(val);

      /* generate workbook object from table */
      if (val == "省直机关班子民主测评表") {
        var wb = XLSX.utils.table_to_book(
          document.querySelector("#banzishujusz")
        );
      } else if (val == "省直机关班子成员民主测评表") {
        var wb = XLSX.utils.table_to_book(
          document.querySelector("#banzishujudz")
        );
      }

      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          this.form.niandu + val + "(" + this.form.deptName + ")" + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    handlePreview(file) {
      this.fileObj = file.raw;
    }
  },
  mounted() {
    this.change();
    this.tanchuangsearch();
    this.getshengzhiName("1");
    this.getniandu();
  }
};
</script>
<style scoped lang="scss">
.bluebtnclass{
  margin-left: 10px!important;
}
.date div {
  display: inline-block;
  font-size: 18px;
  margin: 10px 0px;
  margin-right: 20px;
}

.shujushow {
  span {
    color: #0841b4;
    margin-right: 10px;
  }
}

.filter {
  width: 15%;
  float: right;
  margin: 10px 0;
}

.title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  color: #333;
  margin: 20px 0;
}

.top {
  overflow: hidden;


  .btnworpbox {
    float: right;

    button {
      margin-left: 20px;
    }
  }
}

.sp {
  display: inline-block;
  width: 10%;
}

.desc {
  padding-bottom: 10px;

  .daorutitle {
    font-size: 22px;
    font-weight: bold;
    line-height: 40px;
  }

  .daorubody {
    font-size: 16px;
    line-height: 25px;

    span {
      line-height: 40px;

      &.mobantip {
        line-height: 25px;
      }

      .xiazaimoban {
        text-decoration: underline;
        color: #1f6de2;
      }
    }
  }
}
</style>
<style lang="scss">
#shengzhijiguan {
  .el-dialog__body {
    overflow: auto;
    max-height: 550px;
  }
  .el-table .warning-row {
    background: #ecf4ff;
  }

  .el-table__body-wrapper::-webkit-scrollbar {
    width: 15px;
    height: 15px;
  }

  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
}
</style>
