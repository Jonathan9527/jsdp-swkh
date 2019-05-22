<template>
  <div id="minzhubanzihyg" style="margin-top:-9px;">
    <div class="title1">
      <span>年度：</span>
      <el-select
        style="width: 100px;margin-right: 20px;"
        v-model="form.niandu"
        size="medium"
        @change="search"
      >
        <el-option
          v-for="item in options"
          :key="item.mainValue"
          :label="item.mainValue"
          :value="item.mainValue"
        ></el-option>
      </el-select>
      <span>设区市：</span>
      <el-select style="width: 100px;" v-model="city" size="medium" @change="search">
        <el-option v-for="item in District" :key="item.city" :label="item.mainValue" :value="item.mainValue"></el-option>
      </el-select>
      <el-button
        type="primary"
        size="medium"
        class="bluebtnclass"
        style="float: right;margin-top: 8px;"
        @click="exportExcel"
      >数据导出</el-button>
      <el-button
        type="primary"
        size="medium"
        class="bluebtnclass"
        style="float: right;margin-top: 8px;margin-right: 20px;"
        @click="formula"
      >公式设置</el-button>
    </div>
    <div class="title2">
      <p>{{city}}市党政领导班子成员民主测评得分</p>
      <!-- <div class="change">
        <span>结果显示：</span>
        <el-checkbox-group v-model="staScore1" :min="1" :max="2" @change="xianshi">
          <el-checkbox v-for="score in scores" :label="score" :key="score">{{score}}</el-checkbox>
        </el-checkbox-group>
      </div>-->
    </div>
    <el-tabs>
      <div>
        <el-table
          :data="tableData"
          id="banzishuju"
          border=""
          :default-sort="{prop: 'rank', order: 'ascending'}"
          stripe
        >
          <el-table-column label="序号" type="index" width="70"></el-table-column>
          <el-table-column label="姓名" prop="peopleName" width="200"></el-table-column>
          <el-table-column label="职务" prop="duty"></el-table-column>
          <el-table-column label="优秀率" prop="manyiduValue" sortable v-if="manyi" width="150"></el-table-column>
          <el-table-column label="得分" sortable  prop='overallPersonValue' v-if="defen" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="background: none;color: #0841B4;font-size: 16px;"
                @click="viewDetail(scope.row)"
              >
                <span style="border-bottom: 1px solid #0841B4;">{{scope.row.overallPersonValue}}</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tabs>
    <!--查看详情-->
    <el-dialog
      :visible.sync="viewLook"
      :close-on-click-modal="false"
      title="测评表详情"
      class="viewDetail tableboxclass proupClass proupClass2"
      width="60%"
    >
      <table
        border="1px"
        width="100%"
        height="400px"
        align="center"
        cellspacing="0"
        cellpadding="0"
        class="table tabelcalss"
        stripe
      >
        <tr align="center">
          <td width="100px">姓名</td>
          <td width="100px">{{this.tableData3.peopleName}}</td>
          <td width="150px" rowspan="2">发出票数</td>
          <td width="150px" rowspan="2">{{this.tableData2.sendoutNum}}</td>
          <td width="150px" rowspan="2">收回票数</td>
          <td width="180px" rowspan="2">{{this.tableData2.backNum}}</td>
          <td width="150px" rowspan="2">有效票数</td>
          <td width="150px" rowspan="2">{{this.tableData2.validNum}}</td>
        </tr>
        <tr align="center">
          <td>职务</td>
          <td>{{this.tableData3.duty}}</td>
        </tr>
        <tr align="center">
          <td colspan="2" rowspan="2">测评项目</td>
          <td rowspan="1" colspan="6">评价意见结果</td>
        </tr>
        <tr align="center">
          <td>优秀</td>
          <td>称职</td>
          <td>基本称职</td>
          <td>不称职</td>
          <td>优秀称职合计</td>
          <td>得分</td>
        </tr>
        <tr align="center">
          <td rowspan="2">总体评价</td>
          <td>总票数</td>
          <td>{{this.tableData3.overallExcellent}}</td>
          <td>{{this.tableData3.overallGood}}</td>
          <td>{{this.tableData3.overallCompetent}}</td>
          <td>{{this.tableData3.overallIncompetent}}</td>
          <td>{{(this.tableData3.overallExcellent)+(this.tableData3.overallGood)}}</td>
          <td rowspan="2">{{this.tableData3.overallPersonValue}}</td>
        </tr>
        <tr align="center">
          <td rowspan="1">百分比（%）</td>
          <td>{{this.tableData3.overallExcellentPct}}</td>
          <td>{{this.tableData3.overallGoodPct}}</td>
          <td>{{this.tableData3.overallCompPct}}</td>
          <td>{{this.tableData3.overallIncompPct}}</td>
          <!-- <td>{{this.tableData3.overallExcellentPct+this.tableData3.overallGoodPct}}</td> -->
          <td>{{this.tableData3.overallExcellGoodPct}}</td>
        </tr>
        <tr align="center">
          <td rowspan="1">总体测评结果</td>
          <td colspan="7">{{this.tableData3.lev}}</td>
        </tr>
      </table>
    </el-dialog>
    <!--公式设置-->
    <el-dialog
      :visible.sync="scoreForm"
      :close-on-click-modal="false"
      title="个人民主测评公式设置"
      class="formula proupClass"
      width="1000px"
    >
      <el-form>
        <el-form-item label="年度：" style="font-size: 18px;">
          <!-- <el-select style="width: 150px;" v-model="form.niandu" size="medium">
            <el-option
              v-for="item in options"
              :key="item.mainValue"
              :label="item.mainValue"
              :value="item.mainValue"
            ></el-option>
          </el-select> -->
          {{form.niandu}}
        </el-form-item>
        <el-form-item>
          <div class="formula-bor">
            <div class="formula-gs">
              <span>（优秀率*</span>
              <el-input type="text" v-model="form.excellentParm" style="width: 100px;"></el-input>
              <span>+称职率*</span>
              <el-input type="text" v-model="form.goodParm" style="width: 100px;"></el-input>
              <span>-基本称职率*</span>
              <el-input type="text" v-model="form.competentParm" style="width: 100px;"></el-input>
              <span>-不称职率*</span>
              <el-input type="text" v-model="form.incompetentParm" style="width: 100px;"></el-input>
              <span>）*100</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="scoreForm = false">取 消</el-button>
        <el-button class="proupbtnqueding" type="primary" @click="scoreForm2">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    const staScore = ["满意度", "得分"];
    return {
      manyi: true,
      defen: true,
      scoreForm: false,
      viewLook: false,
      staScore1: ["满意度", "得分"],
      scores: staScore,
      radio: "1",
      options: [],
      District: [
        
      ],
      city: "南京",
      form: {
        niandu: "2018",
        excellentParm: "",
        goodParm: "",
        competentParm: "",
        incompetentParm: ""
      },
      tableData: [],
      tableData2: [],
      tableData3: [],
      idTmr: ""
    };
  },
  methods: {
    getShequshi(){
      this.$http
        .post(globalConfig.server4 + "tDictionaryController/getListForCode", {
          code: "1"
        })
        .then(res => {
          if (res.data.response_code == "0") {
            this.District = res.data.response_body;
          }
        })
    },
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
    //数据导出
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#banzishuju"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          this.form.niandu + this.city + "市领导班子成员民主测评表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    xianshi() {
      if (this.staScore1 == "满意度") {
        this.manyi = true;
        this.defen = false;
      } else if (this.staScore1 == "得分") {
        this.manyi = false;
        this.defen = true;
      } else if (this.staScore1 == "得分,满意度") {
        this.manyi = true;
        this.defen = true;
      } else if (this.staScore1 == "满意度,得分") {
        this.manyi = true;
        this.defen = true;
      }
    },
    formula() {
      let type = this.form.deptType;
      let params = {
        niandu: this.form.niandu,
        type: "1"
      };
      this.$http
        .post(
          globalConfig.server4 +
            "democraticEvaluationOfShow/showFormulaOfCoefficient",
          params
        )
        .then(res => {
          if (res.data.response_code === "0") {
            if(!res.data.response_body){
              this.form.excellentParm = "";
              this.form.goodParm = "";
              this.form.competentParm = "";
              this.form.incompetentParm = "";
            }
            
            this.form.id = res.data.response_body.id;
            this.form.type = res.data.response_body.type;
            this.form.excellentParm = res.data.response_body.excellentParm;
            this.form.goodParm = res.data.response_body.goodParm;
            this.form.competentParm = res.data.response_body.competentParm;
            this.form.incompetentParm = res.data.response_body.incompetentParm;

            
          } else {
            
          }
        });
      this.scoreForm = true;
    },
    viewDetail(val) {
      this.viewLook = true;
      let fd = new FormData();
      fd.append("modeId", val.modelId);
      fd.append("peopleId", val.id);
      this.$http
        .post(
          globalConfig.server4 +
            "democraticEvaluationOfShow/selectPeopleAndModeById",
          fd
        )
        .then(res => {
          if (res.data.response_code === "0") {
            this.tableData2 = res.data.response_body.mode;
            this.tableData3 = res.data.response_body.people[0];
            console.log(this.tableData3);
          } else {
          }
        });
    },
    scoreForm2() {
      let fd = new FormData();
      fd.append("niandu", this.form.niandu);
      fd.append("excellentParm", this.form.excellentParm);
      fd.append("goodParm", this.form.goodParm);
      fd.append("competentParm", this.form.competentParm);
      fd.append("incompetentParm", this.form.incompetentParm);
      fd.append("type", this.form.type);
      fd.append("id", this.form.id);
      this.$http
        .post(
          globalConfig.server4 +
            "democraticEvaluationOfShow/updateFormulaOfCoefficient",
          fd
        )
        .then(res => {
          if (res.data.response_code === "0") {
            let fd = new FormData();
            fd.append("niandu", this.form.niandu);
            fd.append("deptName", this.city);
            fd.append("modelType", "党政领导班子成员民主测评表");
            fd.append("type", this.form.type);
            this.$http
              .post(
                globalConfig.server4 + "democraticEvaluation/callFormula",
                fd
              )
              .then(res => {
                if (res.data.response_code === "0") {
                  this.$message({
                    type: "success",
                    message: "提交成功!"
                  });
                  this.scoreForm = false;
                  this.search();
                } else {
                }
              });
          } else {
            this.$message({
              type: "error",
              message: "请完整填入数据"
            });
          }
        });
    },
    search() {
      let fd = new FormData();
      fd.append("niandu", this.form.niandu);
      fd.append("deptName", this.city);
      fd.append("type", "1");
      this.$http
        .post(
          globalConfig.server4 +
            "democraticEvaluationOfShow/selectPeopleOfDeptname",
          fd
        )
        .then(res => {
          if (res.data.response_code === "0") {
            this.tableData = res.data.response_body;
            this.tableData.map(item => {
              if (item.overallPersonValue) {
                item.overallPersonValue = Number(item.overallPersonValue);
                item.manyiduValue = Number(item.manyiduValue);
              }
            });
          } else {
            this.tableData = [];
          }
        });
    }
  },
  mounted() {
    this.search();
    this.getniandu()
    this.getShequshi()
  }
};
</script>
<style scoped lang="scss">
.tabelcalss {
  background: #f8f8f8;
  color: #333;
}
.quxiaobtns {
  background: #fff;
  color: #333333;
}
.quxiaobtns:hover {
  background: #f3f3f3;
  color: #409eff;
}
.quedingbtns {
  border: 1px solid #0841b4;
}
.quedingbtns:hover {
  background: #3179e4;
  border: 1px solid #3179e4;
}
.table td {
  border: 1px solid #908f8f;
  vertical-align: middle;
}

.change {
  display: inline-flex;
  float: right;
}

.title1 {
  height: 60px;
  line-height: 3.5;
  padding: 5px 0px 10px 0;
}

.title2 {
  margin: 20px 0 20px;

  p {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: #333;
  }
}

.fenshu {
  width: 30%;
}

.formula-bor {
  /* width: 650px; */
  /* border: 2px #409EFF dashed; */
  border-radius: 5px;
}
.el-form-item__label {
  font-size: 16px;
}
.formula-gs {
  text-align: center;
  line-height: 6;
  background: #f3f3f3;
  margin-top: 20px;
  input {
    /* width: 20px;
      height: 20px; */
    text-align: center;
  }

  span {
    font-size: 18px;
  }
}

.formula-title {
  width: 560px;
  height: 50px;
  text-align: center;
  // margin-top: -26px;
  margin: 0 auto;
  span {
    font-size: 30px;
    color: #333;
    font-weight: bold;
  }
}
</style>
<style lang="scss">
#minzhubanzihyg {
  .el-dialog__body {
    padding: 24px 24px 30px;
    overflow: auto;
    max-height: 550px;
  }
  .el-form-item__label {
    font-size: 16px;
  }
  .formula-gs {
    .el-input__inner {
      text-align: center;
    }
  }
  .tableboxclass {
    .el-dialog__body {
      padding: 24px 24px 40px;
    }
  }
  .proupClass2 {
    .el-dialog__headerbtn .el-dialog__close {
      display: block;
    }
  }
}
</style>
