<template>
  <div id="jiajianfen">
    <div class="assessIssue" v-show="minpoinshow">
      <el-button type="primary" @click="gobacks" class="bluebtnclass" style="float:left">返回</el-button>
      <el-form class="issueTop">
        <div class="asstopWrap">
          <p>{{modelName}}</p>
          <p>({{rowData.examed_dep_name}})</p>
        </div>
      </el-form>
      <div>
        <el-table :data="highQuality" border="" style="width: 100%" stripe :span-method="arraySpanMethod">
          <el-table-column label="加减分项" prop="descrip" width="110"></el-table-column>
          <el-table-column prop="one_name" label="指标名称">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                width="400"
                class="box"
                trigger="hover"
                :content="scope.row.one_name"
                popper-class="tipClass"
                :visible-arrow="false"
              >
                <div slot="reference">{{scope.row.one_name}}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="情况说明" prop="fileList">
            <template slot-scope="scope">
              <template v-for="item in scope.row.fileList">
                <div>
                  <a :href="item.href" target="_blank">{{item.name}}</a>
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="附件材料" prop="final_explanation"></el-table-column>
          <el-table-column label="责任单位" prop="flag">
            <template slot-scope="scope">
              <template v-for="item in scope.row.flag">
                <div class="colorfont" @click="dutySuggest(scope.row)">{{item}}</div>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- 责任单位意见弹窗 -->
        <el-dialog
          :close-on-click-modal="false"
          title="责任单位详情"
          :visible.sync="dutyUnitVisible"
          width="30%"
          class="proupClass"
        >
          <div>
            <el-table :data="dutyUnitData" style="width: 100%" border="">
              <el-table-column prop="add_minus_name" label="单位名称"></el-table-column>
              <el-table-column prop="opinion" label="审核意见"></el-table-column>
              <el-table-column prop="score" label="审核分" width="100"></el-table-column>
              <el-table-column prop="examfileList" label="补充材料">
                <template slot-scope="scope">
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
            <el-button class="proupbtnquxiao" @click="dutyUnitVisible = false" size="medium">取 消</el-button>
            <el-button
              type="primary"
              class="proupbtnqueding"
              @click="dutyUnitVisible = false"
              size="medium"
            >确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["modules", "rowData"],
  data() {
    return {
      uri: "",
      minpoinshow: false,
      dutyUnitVisible: false,
      dialogVisible: false,
      dutyUnitData: [],
      addminusdata: [],
      fileList: [],
      table: [],
      currentPage: 4,

      value: "",
      huidiao: "",
      beexamed_dep_name: "", //被考核单位
      leader_dep_name: "", //牵头单位
      exame_dep_name: "", //考核单位
      highQuality: [],
      shuomingArr: [],
      fileObj: {},
      modelName: "", //考核指标
      modelNameOption: [], //考核指标下拉框
      beexamed: "", //被考核单位
      beexamedOption: [], //被考核单位下拉框
      hang: "",
      firstTargetArr:[],
      firstTargetPos:0
    };
  },
  methods: {
    gobacks() {
      this.minpoinshow = false;
    },
    //责任单位意见
    dutySuggest(val) {
      let params = {
        instance_detail_id: val.instance_detail_id
      };

      this.$http
        .post(
          globalConfig.server3 + "dangjian/selectDangjianAddminusDetail",
          params
        )
        .then(res => {
          if (res.data.response_code == "200") {
            this.dutyUnitData = res.data.response_body
            this.dutyUnitData.forEach(item => {
              let str = item.attchment;
              if (str) {
                let examArr = [];
                let http = globalConfig.server1
                this.splitStr(str, examArr, http)
                item.examfileList = examArr
              }
            });
            this.dutyUnitVisible = true
          } else {
            this.dutyUnitData = []
          }
        })
    },

    //指标模型下拉
    getkaoheTarget() {
      this.$http
        .post(globalConfig.server3 + "dangjian/selectModelByModelType")
        .then(res => {
          if (res.data.response_code == "0") {
            this.modelNameOption = res.data.response_body;
            this.modelNameOption.forEach((item, index) => {
              if (item.niandu.substring(0, 4) == this.rowData.niandu2) {
                this.modelName = item.model_name;
                this.getChange(item);
                this.mrsx(item);
              }
            });
          }
        });
    },
    //获取被考核单位下拉框查询
    getbeExamed(id) {
      let params = {
        model_id: id
      };
      this.$http
        .post(
          globalConfig.server1 +
            "PersonalityAuditOfResponsibleUnits/selectModelExamedDept",
          params
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.beexamedOption = res.data.response_body;
            this.beexamedOption.forEach(item => {
              if (item.examed_dep == this.rowData.examed_dep) {
                this.beexamed = item.examed_dep_name;
                this.getpageContent(item);
              }
            });
          } else {
            this.beexamedOption = [];
          }
        });
    },
    //获取页面数据
    getpageContent(val) {
      let params = {
        instance_id: val.id
      };
      this.$http
        .post(
          globalConfig.server1 +
            "AuditOfAdditionOrReductionOfResponsibleUnits/selectFaGaiWeiJiaJianFenChaXun",
          params
        )
        .then(res => {
          if (res.data.response_code == "200") {
            this.highQuality = res.data.response_body;

            this.highQuality.sort((a,b)=>{
              return b.one_value - a.one_value
            })

            this.highQuality.forEach(item => {

              if(item.one_value == "1"){
                item.descrip = "加分项"
              }else if(item.one_value == "-1"){
                item.descrip = "减分项"
              }

              item.scorefiles = [];

              let str = item.final_explan_files;
              if (str) {
                let examArr = [];
                let http = globalConfig.server1;
                this.splitStr(str, examArr, http);
                item.fileList = examArr;
              }

              let scorestr = item.score_files;
              if (scorestr) {
                let examArr = [];
                let http = globalConfig.server1;
                this.splitStr(scorestr, examArr, http);
                item.scorefiles = examArr;
              }
              item.scorefiles.forEach(val => {
                val.id = item.instance_detail_id;
              })
            })

            this.merge()
          } else {
            this.highQuality = [];
          }
        });
    },
    //获得加减分材料审核数据
    getCaiLiaoShenHe(params) {
      this.$http
        .post(
          globalConfig.server1 +
            "PersonalityAuditOfResponsibleUnits/selectJiaJIanFenCaiLiaoShenHe",
          params
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.highQuality = res.data.response_body;
          } else {
            this.highQuality = [];
          }
        });
    },
    getChange(val) {
      let person = JSON.parse(sessionStorage.getItem("personal"));
      let params = {
        user_id: person.id,
        niandu: val,
        model_type: "个性"
      };
      let id = val.id;
      this.getbeExamed(id);
    },

    downLoadfile(val) {
      // 通过选择器获取img元素
      var elments = $(".downloadtext");
      // 将图片的src属性作为URL地址
      var url = $(".downloadtext").attr("src");
      var a = document.createElement("a");
      var event = new MouseEvent("click");

      a.download = val.unitmaterials || "我是下载";
      a.href = url;

      a.dispatchEvent(event);
    },
    //合并单元格
    arraySpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 0) {
        //第一列的合并方法,省
        const _row_1 = this.firstTargetArr[rowIndex];
        const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
        return {
          rowspan: _row_1,
          colspan: _col_1
        }
      }
    },
    merge() { //合并相同数据
      this.mergeInit()
      for (var i = 0; i < this.highQuality.length; i++) {
        if (i === 0) {
          //第一行必须存在
          this.firstTargetArr.push(1);
          this.firstTargetPos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同 this.firstTargetPos是firstTargetArr内容的序号
          if (this.highQuality[i].descrip === this.highQuality[i - 1].descrip) {
            this.firstTargetArr[this.firstTargetPos] += 1;
            this.firstTargetArr.push(0);
          } else {
            this.firstTargetArr.push(1);
            this.firstTargetPos = i;
          }

        }
      }
    },
    mergeInit() { //合并初始化
      this.firstTargetArr = [], //一级指标合并数组
      this.firstTargetPos = 0
    },
    // 默认显示数据
    mrsx(val) {
      setTimeout(
        function() {
          // this.modelName = this.modelNameOption[0].decription
          this.getChange(val);
        }.bind(this),
        400
      );
    }
  },
  watch: {
    modules(val) {
      if (val) {
        this.getkaoheTarget();
        // this.mrsx()
        this.minpoinshow = val;
      } else {
        this.highQuality = [];
      }
    },
    minpoinshow(val) {
      if (!val) {
        this.$emit("close");
      }
    }
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
#jiajianfen {
  .issueTop {
    .asstopWrap {
      margin-bottom: 20px;
      display: inline-block;
      text-align: center;
      width: 80%;
      font-size: 30px;
      color: #000;
      line-height: 55px;
    }

    .assessSelect {
      display: inline-block;
      width: 600px;

      .el-button {
        margin-left: 60px;
      }
    }

    .unitList {
      text-align: center;
      font-size: 30px;
      color: #333;
      font-weight: 600;
      margin-top: 32px;
    }
  }

  .colorfont {
    color: #409eff;
    padding: 5px 0;
    cursor: pointer;
  }

  .downloadtext {
    cursor: pointer;
    color: #ef6f12;
  }

  .block {
    margin-top: 15px;
  }

  .assessIssue {
    min-height: 450px;
  }

  .el-select-dropdown__item {
    font-size: 16px;
  }
}
</style>
<style lang="scss">
#jiajianfen {
  .el-dialog__body {
    overflow: auto;
    max-height: 550px;
  }
  .assessIssue {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
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
}
</style>
