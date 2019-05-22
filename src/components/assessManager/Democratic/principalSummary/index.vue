<template>
  <div id="banzichengyuanhyg">
    <div class="title1" style="margin-top:-10px;">
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
      <p>设区市党政正职民主测评得分</p>
    </div>
    <el-tabs>
      <div>
        <el-table
          id="banzishuju"
          :data="tableData"
          border=""
          :default-sort="{prop: 'rank', order: 'ascending'}"
          stripe
        >
          <el-table-column label="姓名" prop="peopleName" width="200"></el-table-column>
          <el-table-column label="职务" prop="duty"></el-table-column>
          <el-table-column label="测评得分" prop="overallPersonValue" sortable width="150">
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
          <el-table-column label="级差得分" prop="overallProvinceValue" sortable width="150"></el-table-column>
          <!-- <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="background: none;color: #0841B4;font-size: 16px;"
                @click="viewDetail(scope.row)"
              >
                <span style="border-bottom: 1px solid #0841B4;">个人得分</span>
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </el-tabs>
    <!--查看详情-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="viewLook"
      class="viewDetail tabelcalss proupClass proupClass2"
      width="60%"
    >
      <table
        border="1px"
        width="100%"
        height="350px"
        align="center"
        cellspacing="0"
        cellpadding="0"
        class="table"
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
          <!-- <td>{{(this.tableData3.overallExcellentPct)+(this.tableData3.overallGoodPct)}}</td> -->
          <td>{{this.tableData3.overallExcellGoodPct}}</td>
        </tr>
        <tr align="center">
          <td rowspan="1">总体测评结果</td>
          <td colspan="7"></td>
        </tr>
      </table>
    </el-dialog>
    <!--公式设置-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="scoreForm"
      title="级差得分公式设置"
      class="formula proupClass"
      width="750px"
    >
      <el-form>
        <div class="propboxs">
          <el-form-item style="margin-right:30px;">
            <span style="font-size:16px;">年度：</span>
            <!-- <el-select style="width: 150px;" class="nianduss" v-model="form.niandu" size="medium">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
            {{form.niandu}}
          </el-form-item>
          <el-form-item>
            <div class="formula-bor">
              <div class="formula-gs">
                <span>最高分：</span>
                <el-input
                  type="text"
                  v-model="form.provinceHigh"
                  oninput="value=value.replace(/[^\d^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"
                ></el-input>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最低分：</span>
                <el-input
                  type="text"
                  v-model="form.provinceLow"
                  oninput="value=value.replace(/[^\d^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"
                ></el-input>
              </div>
            </div>
          </el-form-item>
        </div>
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
    return {
      scoreForm: false,
      viewLook: false,
      radio: "1",
      options: [],
      city: "南京市",
      form: {
        niandu: "2018",
        provinceLow: "",
        provinceHigh: "",
        type: ""
      },
      tableData: [],
      tableData2: [],
      tableData3: []
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
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          this.form.niandu + "设区市党政正职民主测评汇总表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
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
            console.log(res);
            if(!res.data.response_body){
              this.form.provinceLow = "";
              this.form.provinceHigh = "";
            }
            this.form.id = res.data.response_body.id;
            this.form.type = res.data.response_body.type;
            this.form.provinceLow = res.data.response_body.provinceLow;
            this.form.provinceHigh = res.data.response_body.provinceHigh;
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
          } else {
          }
        });
    },
    scoreForm2() {
      let fd = new FormData();
      fd.append("niandu", this.form.niandu);
      fd.append("provinceLow", this.form.provinceLow);
      fd.append("provinceHigh", this.form.provinceHigh);
      fd.append("type", "1");
      if (this.form.provinceHigh <= this.form.provinceLow) {
        this.$message({
          type: "error",
          message: "最高分应大于最低分"
        });
        return;
      }
      this.$http
        .post(
          globalConfig.server4 +
            "democraticEvaluationOfShow/updateFormulaOfDifferenceValue",
          fd
        )
        .then(res => {
          if (res.data.response_code === "0") {
            let arrrust = [];
            this.tableData.forEach(item => {
              let obj = {
                niandu: this.formatDate("yyyy", item.niandu),
                leaderType: "1",
                modelType: "党政领导班子成员民主测评表",
                deptName: item.deptName
              };
              arrrust.push(obj);
            });

            this.$http
              .post(
                globalConfig.server4 +
                  "democraticEvaluation/updateScoreForMuch",
                arrrust
              )
              .then(res => {
                if (res.data.response_code === "0") {
                  this.$message({
                    type: "success",
                    message: res.data.response_body
                  });
                  this.scoreForm = false;
                  this.search();
                } else {
                }
              });
            this.scoreForm = false;
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
      this.$http
        .post(
          globalConfig.server4 +
            "democraticEvaluationOfShow/selectPeopleOfNiandu",
          fd
        )
        .then(res => {
          if (res.data.response_code === "0") {
            this.tableData = res.data.response_body;
            this.tableData.map(item => {
              if (item.overallPersonValue) {
                item.overallPersonValue = Number(item.overallPersonValue);
                item.overallProvinceValue = Number(item.overallProvinceValue);
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
    this.getniandu();
  }
};
</script>
<style scoped lang="scss">
.propboxs {
  overflow: hidden;

  .el-form-item {
    float: left;
  }
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
  border: 1px solid #000000;
  vertical-align: middle;
  line-height: 2;
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
  /* width: 550px;
    height: 100px;
    border: 2px #409EFF dashed; */
}

.formula-gs {
  .el-input__inner {
    text-align: center;
  }

  /* text-align: center;
    line-height: 6; */
  /* 
    input {
      width: 150px;
      height: 20px;
    } */

  span {
    font-size: 16px;
  }
}

.formula-title {
  /* width: 560px;
    height: 50px;
    background: #409EFF; */
  text-align: center;
  margin-top: -26px;

  span {
    font-size: 30px;
    color: #333;
    font-weight: bold;
  }
}
</style>
<style lang="scss">
#banzichengyuanhyg {
  .proupClass2 {
    .el-dialog__headerbtn .el-dialog__close {
      display: block;
    }

    .el-dialog__header {
      padding: 24px;
    }

    .el-dialog__body {
      background: #f8f8f8;
      padding: 24px 24px 50px 24px;
      overflow: auto;
      max-height: 550px;
    }
  }

  .el-form-item__label {
    font-size: 16px;
  }

  .formula-gs {
    .el-input__inner {
      text-align: center;
      width: 150px;
    }

    .el-input {
      display: inline;
    }
  }
}
</style>
