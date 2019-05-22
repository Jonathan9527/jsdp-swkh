<template>
  <div id="ndcPersonalTagetScoreClassh" v-show="scoreSearch">
    <div style="margin: 10px 0;">
      <el-button type="primary" class="bluebtnclass" @click="gobacks" style="float:left">返回</el-button>
      <div class="asstopWrap">
        <p>{{rowData.model_name}}</p>
        <p>({{rowData.departmentName}})</p>
      </div>
    </div>
    <div>
      <el-table
        :data="modelData"
        border=""
        style="width: 100%"
        stripe
        :span-method="arraySpanMethod"
      >
        <el-table-column type="index" label="序号" width="70"></el-table-column>
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
        <el-table-column prop="three_content" label="考核内容">
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              width="400"
              class="box"
              trigger="hover"
              :content="scope.row.three_content"
              popper-class="tipClass"
              :visible-arrow="false"
            >
              <div slot="reference">{{scope.row.three_content}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="examed_dep_name" label="被考核单位" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="background: none;"
              @click="materListBtn(scope.row)"
            >{{scope.row.examed_dep_name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="departmentList" label="责任部门评分">
          <template slot-scope="scope">
            <template v-for="item in scope.row.departmentList">
              <div class="colorfont" @click="dutySuggest(scope.row)">{{item}}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="发改委评分" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="background: none;"
              @click="zhibiaoclick(scope.row)"
            >{{scope.row.score}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 加减分详情弹窗 -->
      <el-dialog
      v-dialogDrag
        title="加减分详细信息"
        :close-on-click-modal="false"
        :visible.sync="addminusVisible"
        width="40%"
        class="proupClass"
      >
        <div>
          <div>
            <span>被考核单位附件：</span>
            <del-button type="text">xx市加减分佐证材料.pdf</del-button>
          </div>
          <el-table style="width: 100%" :data="addminusData" border="">
            <el-table-column prop="add_minus_dep_name" label="单位名称"></el-table-column>
            <el-table-column prop="opinion" label="加减分意见"></el-table-column>
            <el-table-column prop="attchment" label="审核意见"></el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            class="proupbtnqueding"
            @click="addminusVisible = false"
            size="medium"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 指标得分弹窗 -->
      <el-dialog
      v-dialogDrag
        :close-on-click-modal="false"
        title="牵头单位评分详情"
        :visible.sync="zhibiaoVisible"
        width="30%"
        class="proupClass"
      >
        <div>
          <el-table :data="zhibiaoData" style="width: 100%" border="">
            <el-table-column prop="score_opinion" label="审核意见"></el-table-column>
            <el-table-column prop="score_files" label="补充材料">
              <template slot-scope="scope">
                <template v-for="item in scope.row.score_filesList">
                  <div>
                    <a :href="item.href" target="_blank">{{item.name}}</a>
                  </div>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            class="proupbtnqueding"
            @click="zhibiaoVisible = false"
            size="medium"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 责任单位意见弹窗 -->
      <el-dialog
      v-dialogDrag
        :close-on-click-modal="false"
        title="责任单位详情"
        :visible.sync="dutyUnitVisible"
        width="30%"
        @click="seachaddminus"
        class="proupClass"
      >
        <div>
          <el-table :data="dutyUnitData" style="width: 100%" border="">
            <el-table-column prop="department_name" label="单位名称"></el-table-column>
            <el-table-column prop="opinion" label="审核意见"></el-table-column>
            <el-table-column prop="score" label="审核分" width="100"></el-table-column>
            <el-table-column prop="examfileList" label="补充材料">
              <template slot-scope="scope">
                <!-- <el-button type="text">{{scope.row.final_explan_files}}</el-button> -->
                <template v-for="item in scope.row.examfileList">
                  <div>
                    <a :href="item.href" target="_blank">{{item.name}}</a>
                  </div>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            class="proupbtnqueding"
            @click="dutyUnitVisible = false"
            size="medium"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 被考核单位佐证材料列表 -->
      <el-dialog
        v-dialogDrag
        :close-on-click-modal="false"
        title="被考核单位详情"
        :visible.sync="materListVisible"
        width="30%"
        class="proupClass"
      >
        <div>
          <el-table :data="materListData" style="width: 100%" border="">
            <el-table-column prop="examed_dep_name" label="单位名称"></el-table-column>
            <el-table-column prop="final_explanation" label="情况说明"></el-table-column>
            <el-table-column prop="examedfile" label="附件材料">
              <template slot-scope="scope">
                <template v-for="item in scope.row.examedfile">
                  <div>
                    <a :href="item.href" target="_blank">{{item.name}}</a>
                  </div>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            class="proupbtnqueding"
            @click="materListVisible = false"
            size="medium"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props: ["modules", "detailData", "rowData"],
  data() {
    return {
      scoreSearch: false,
      options: [],
      value: "",
      targetForm: {},
      zhibiaoVisible: false, //指标意见弹窗
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
      zhibiaoData: [],
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
    dutySuggest(val) {
      let params = {
        instance_detail_id: val.instance_detail_id
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
            this.dutyUnitData.forEach(item => {
              let str = item.attachment;
              if (str) {
                let examArr = [];
                let http = globalConfig.server1;
                this.splitStr(str, examArr, http);
                item.examfileList = examArr;
              }
            });
            this.dutyUnitVisible = true;
          } else {
            this.$message({
              message: res.data.response_desc,
              type: "error"
            });
          }
        });
    },
    //指标评分
    zhibiaoclick(val) {
      this.zhibiaoData = [];

      let params = {
        score_files: val.score_files,
        score_opinion: val.score_opinion,
        score_filesList: []
      };

      let str = params.score_files;
      if (str) {
        let examArr = [];
        let http = globalConfig.server1;
        this.splitStr(str, examArr, http);
        params.score_filesList = examArr;
      }
      this.zhibiaoData.push(params);
      // this.zhibiaoData.score_files = val.score_files
      // this.zhibiaoData.score_opinion = val.score_opinion

      // this.$http.post(globalConfig.server2 + '',params).then(res=>{
      //   if(res.data.response_code == "0"){
      //       this.zhibiaoData = res.data.response_body

      this.zhibiaoVisible = true;
      //   }

      // })
    },
    //被考核单位佐证材料列表
    materListBtn(val) {
      let params = {
        instance_id: val.instance_id,
        model_content_id: val.model_content_id
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
            this.materListData.push(res.data.response_body);

            this.materListData.forEach(item => {
              let str = item.final_explan_files;
              if (str) {
                let examArr = [];
                let http = globalConfig.server1;
                this.splitStr(str, examArr, http);
                item.examedfile = examArr;
              }
            });

            this.materListVisible = true;
          } else {
            this.$message({
              message: res.data.response_desc,
              type: "error"
            });
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
    },
    gobacks() {
      this.scoreSearch = false;
      this.modelData = [];
    }
  },
  watch: {
    modules(val) {
      if (val) {
        this.modelData = JSON.parse(JSON.stringify(this.detailData));
        this.merge();
        this.scoreSearch = val;
      }
    },
    scoreSearch(val) {
      if (!val) {
        this.$emit("close");
      }
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

.colorfont {
  color: #409eff;
  padding: 5px 0;
  cursor: pointer;
}

.asstopWrap {
  margin-bottom: 20px;
  display: inline-block;
  text-align: center;
  width: 80%;
  font-size: 30px;
  color: #000;
  line-height: 55px;
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

  .el-table__row td .cell .box .el-popover__reference {
    height: 10%;
    display: -webkit-box;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;

    /* autoprefixer: on */
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
