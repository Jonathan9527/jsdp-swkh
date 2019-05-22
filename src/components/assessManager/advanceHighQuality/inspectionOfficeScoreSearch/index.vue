<template>
  <div id="ndcPersonalTagetScoreClassh">
    <div>
      <div class="asstopWrap">
        <ul class="assessTitle clearfix">
          <li>
            <span>考核指标：</span>
            <el-select
              v-model="value"
              value-key="model_name"
              size="medium"
              placeholder="请选择"
              @change="getData"
              style="width: 350px;"
            >
              <el-option
                v-for="item in kaoheOptions"
                :key="item.value"
                :label="item.model_name"
                :value="item"
              ></el-option>
            </el-select>
          </li>
          <!--<li>
            <span>被考核单位：</span>
            <el-select v-model="targetForm.unit" size="medium" placeholder="请选择被考核单位">
              <el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </li>-->
          <li>
            <span prop="niandu">年份：{{niandu}}</span>
          </li>
          <li>
            <span prop="leader_dep_name">牵头单位：{{leader_dep_name}}</span>
          </li>
          <!-- <li>
            <el-button type="primary" size="medium" @click="search" >查询</el-button>
          </li>-->
        </ul>
        <ul class="addDetails clearfix">
          <li>
            <span>高质量发展共性指标分值：{{gongxingData.score}}</span>
          </li>
          <li>
            <span>加减分分值：{{gongxingaddminusData.add_minus_score}}</span>
          </li>
          <li>
            <el-button type="primary" @click="seachaddminus" size="medium">加减分详情</el-button>
          </li>
        </ul>
      </div>
      <div class="tip">
        <!-- <span>南京市2018年高质量发展个性指标考核评分</span> -->
      </div>
      <el-table
        :data="modelData"
        border=""
        :span-method="arraySpanMethod"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="one_name" label="一级指标">
          <template slot-scope="scope">
            <div style="font-size: 18px">{{scope.row.one_name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="two_name" label="二级指标"></el-table-column>
        <el-table-column prop="three_name" label="三级指标">
          <template slot-scope="scope">
            <div style="font-size: 14px">{{scope.row.three_name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="three_content" label="考核内容"></el-table-column>
        <el-table-column prop="departmentList" label="责任部门">
          <template slot-scope="scope">
            <el-button type="text" @click="dutySuggest">{{scope.row.departmentList[0]}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="examed_dep_name" label="被考核单位">
          <template slot-scope="scope">
            <el-button type="text" @click="materListBtn">{{scope.row.examed_dep_name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="评分" width="100"></el-table-column>
      </el-table>
      <!-- 加减分详情弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        title="加减分详细信息"
        :visible.sync="addminusVisible"
        width="40%"
      >
        <div>
          <div>
            <span>被考核单位附件：</span>
            <del-button type="text">xx市加减分佐证材料.pdf</del-button>
          </div>
          <el-table style="width: 100%" :data="addminusData" border="">
            <el-table-column prop="add_minus_dep_name" label="单位名称"></el-table-column>
            <el-table-column prop="opinion" label="情况说明"></el-table-column>
            <el-table-column prop="attchment" label="附件材料"></el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addminusVisible = false" size="medium">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 责任单位意见弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        title="责任单位详情"
        :visible.sync="dutyUnitVisible"
        width="30%"
        @click="seachaddminus"
      >
        <div>
          <div>
            <span>附件:</span>
            <el-button type="text"></el-button>
          </div>
          <el-table :data="dutyUnitData" style="width: 100%" border="">
            <el-table-column prop="department_name" label="单位名称"></el-table-column>
            <el-table-column prop="opinion" label="审核意见"></el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dutyUnitVisible = false" size="medium">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 被考核单位佐证材料列表 -->
      <el-dialog
        :close-on-click-modal="false"
        title="被考核单位详情"
        :visible.sync="materListVisible"
        width="30%"
      >
        <div>
          <el-table :data="materListData" style="width: 100%" border="">
            <el-table-column prop="examed_dep_name" label="单位名称"></el-table-column>
            <el-table-column prop="final_explan_files" label="附件材料">
              <template slot-scope="scope">
                <el-button type="text"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="materListVisible = false" size="medium">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [],
      value: "",
      targetForm: {},
      dutyUnitVisible: false, //责任单位意见弹窗
      materListVisible: false, //被考核单位佐证材料列表
      addminusVisible: false,
      kaoheOptions: [],
      niandu: "",
      leader_dep_name: "", //牵头单位
      unitOptions: [],
      modelData: [],
      dutyUnitData: [],
      addminusData: [],
      gongxingaddminusData: {},
      gongxingData: {},
      materListData: [],
      examed_dep_name: "",
      firstTargetArr: [], //一级指标合并数组
      firstTargetPos: 0,
      secondTargetArr: [], //二级指标合并数组
      secondTargetPos: 0,
      searchParams: {},
      instance_id: ""
    };
  },
  methods: {
    getData(val) {
      this.niandu = this.formatDate("yyyy", val.niandu);
      this.leader_dep_name = val.leader_dep_name;
      this.beexamed_dep_name = val.name;
      this.examed_dep_name = val.beexamed_dep_name;
      this.searchParams.model_id = val.id;
      this.searchParams.beexamed_dep_name = val.name;
      this.search();
    },
    //查询页面数据
    search() {
      let params = this.searchParams;
      this.$http
        .post(
          globalConfig.server2 +
            "PromotingHighQualityAssessment/selectModelContent",
          params
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.modelData = [];
            let obj = res.data.response_body;
            for (let key in obj) {
              obj[key][0].departmentList = obj[key][1];
              this.modelData.push(obj[key][0]);
            }
            let ins = res.data.response_body.list1[0].instance_id;
            this.instance_id = ins;

            let insdtl = res.data.response_body.list1[0].instance_detail_id;
            this.instance_detail_id = insdtl;

            let modelcontent = res.data.response_body.list1[0].model_content_id;
            this.model_content_id = modelcontent;

            this.modelData.map(item => {
              item.one_name = item.one_name + "(" + item.one_value + "分)";
              item.two_name = item.two_name + "(" + item.two_value + "分)";
              item.three_name =
                item.three_name + "(" + item.three_value + "分）";
            });
            this.merge();
          }
        });
      this.searchgxaddmin();
      this.searchgongxing();
    },
    //加减分的弹窗查询
    seachaddminus() {
      let params = {
        instance_id: this.instance_id
      };
      if (this.instance_id == "") {
        this.$message.error("请先查询！谢谢- -");
      } else {
        this.$http
          .post(
            globalConfig.server2 +
              "PromotingHighQualityAssessment/selectTuijinDetail",
            params
          )
          .then(res => {
            if (res.data.response_code == "0") {
              this.addminusData = res.data.response_body;
              this.addminusVisible = true;
            }
          });
      }
    },
    //下拉
    searchOption() {
      let params = {
        model_type: "个性"
      };
      this.$http
        .post(
          globalConfig.server2 +
            "PromotingHighQualityAssessment/selectModelFaGaiWei",
          params
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.kaoheOptions = res.data.response_body;
          }
        });
    },
    //责任单位弹窗
    dutySuggest() {
      let params = {
        instance_detail_id: this.instance_detail_id
      };
      this.$http
        .post(
          globalConfig.server2 +
            "PromotingHighQualityAssessment/selectTuijinGexingDetail",
          params
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.dutyUnitData = res.data.response_body;
            this.dutyUnitVisible = true;
          }
        });
    },
    //被考核单位佐证材料列表
    materListBtn() {
      let params = {
        instance_id: this.instance_id,
        model_content_id: this.model_content_id
      };
      this.$http
        .post(
          globalConfig.server2 +
            "PromotingHighQualityAssessment/selectInstanceDetailByMsg",
          params
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.materListData = [];
            // this.materListData =res.data.response_body
            this.materListData.push(res.data.response_body);
            this.materListVisible = true;
          }
        });
    },
    //加减分
    searchgxaddmin() {
      let params = {
        examed_dep_name: this.examed_dep_name,
        niandu: this.niandu
      };
      this.$http
        .post(globalConfig.server2 + "instanceDetail/selectAddScore", params)
        .then(res => {
          if (res.data.response_code == "0") {
            this.gongxingaddminusData = res.data.response_body;
          }
        });
    },
    //共性指标
    searchgongxing() {
      let params = {
        examed_dep_name: this.examed_dep_name,
        niandu: this.niandu
      };
      this.$http
        .post(
          globalConfig.server2 + "tuijinGongxing/selectTuijinGongxinScore",
          params
        )
        .then(res => {
          if (res.data.response_code == "200") {
            this.gongxingData = res.data.response_body;
          }
        });
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        //第一列的合并方法,省
        const _row_1 = this.firstTargetArr[rowIndex];
        const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
        return {
          rowspan: _row_1,
          colspan: _col_1
        };
      } else if (columnIndex === 1) {
        //第二列的合并方法,市
        const _row_2 = this.secondTargetArr[rowIndex];
        const _col_2 = _row_2 > 0 ? 1 : 0;
        return {
          rowspan: _row_2,
          colspan: _col_2
        };
      }
    },
    merge() {
      //合并相同数据
      this.mergeInit();
      for (var i = 0; i < this.modelData.length; i++) {
        if (i === 0) {
          //第一行必须存在
          this.firstTargetArr.push(1);
          this.firstTargetPos = 0;

          this.secondTargetArr.push(1);
          this.secondTargetPos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同 this.firstTargetPos是firstTargetArr内容的序号

          //一级指标
          if (this.modelData[i].one_name === this.modelData[i - 1].one_name) {
            this.firstTargetArr[this.firstTargetPos] += 1;
            this.firstTargetArr.push(0);
          } else {
            this.firstTargetArr.push(1);
            this.firstTargetPos = i;
          }

          //二级指标
          if (
            this.modelData[i].two_name === this.modelData[i - 1].two_name &&
            this.modelData[i].one_name === this.modelData[i - 1].one_name
          ) {
            this.secondTargetArr[this.secondTargetPos] += 1;
            this.secondTargetArr.push(0);
          } else {
            this.secondTargetArr.push(1);
            this.secondTargetPos = i;
          }
        }
      }
    },
    mergeInit() {
      //合并初始化
      (this.firstTargetArr = []), //一级指标合并数组
        (this.firstTargetPos = 0),
        (this.secondTargetArr = []), //二级指标合并数组
        (this.secondTargetPos = 0);
    }
  },
  mounted() {
    this.searchOption();
  }
};
</script>
<style scoped lang="scss">
#ndcPersonalTagetScoreClassh {
  .formItem {
    margin-left: 40px;
  }

  .tip {
    text-align: center;
    color: #333;
    font-size: 30px;
    margin: 32px 0;
    font-weight: 600;
  }
}

.asstopWrap {
  margin-top: 17px;

  .assessTitle {
    line-height: 42px;

    li {
      float: left;
      color: #606266;
      margin-right: 20px;

      &:last-child {
        margin-right: 20px;
      }
    }
  }

  .addDetails {
    margin-top: 20px;
    color: #333;
    line-height: 42px;

    li {
      float: left;

      span {
        margin-right: 20px;
        font-size: 16px;
      }
    }
  }
}

.el-button--text {
  font-size: 16px;
}

.accessorys {
  font-size: 16px;
}
</style>
<style lang="scss">
#ndcPersonalTagetScoreClassh {
  .el-dialog__body {
    overflow: auto;
    max-height: 550px;
  }
  .el-input--small .el-input__inner {
    height: 38px;
    line-height: 38px;
  }

  .el-form-item__label {
    font-size: 16px;
    line-height: 42px;
  }

  .el-form-item__content {
    font-size: 16px;
    line-height: 42px;
  }
}
</style>
