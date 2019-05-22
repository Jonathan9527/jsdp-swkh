<template>
  <div id="scoreSearch" v-show="scoreSearch">
    <el-button type="primary" class="bluebtnclass" @click="gobacks" style="margin-bottom: 10px;">返回</el-button>
    <ul class="assessTitle clearfix">
      <li>
        <span>被考核单位：</span>
        {{rowData.examed_dep_name}}
      </li>
      <li>
        <span class="zhonghetitle">综合报告：</span>
        <span v-if="zhongheFileList.length == 0">暂无文件</span>
        <div class="zhonghebottom">
          <el-row :gutter="20">
            <el-col
              :span="6"
              class="zhibiaobox"
              v-for="(item,index) in zhongheFileList"
              :key="index"
            >
              <a :href="item.href" target="_blank">{{item.name}}</a>
            </el-col>
          </el-row>
        </div>
      </li>
    </ul>
    <el-table :data="modelData" border="" :span-method="arraySpanMethod" style="width: 100%" stripe>
      <!-- <el-table-column type="index" label="序号" width="70"> </el-table-column> -->
      <el-table-column prop="one_name" label="一级指标" width="350"></el-table-column>
      <el-table-column prop="show_value" label="指标分值" width="100"></el-table-column>
      <el-table-column label="情况说明" prop="beikaohecailiaoopinion"></el-table-column>
      <el-table-column label="附件材料" prop="beikaohecailiao">
        <template slot-scope="scope">
          <template v-for="item in scope.row.beikaohecailiaoList">
            <div>
              <a :href="item.href" target="_blank" class="colorfont">{{item.name}}</a>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="责任单位评分" prop="score" width="260">
        <template slot-scope="scope">
          <template v-for="item in scope.row.list">
            <div class="colorfont" @click="zhibiaoclick(scope.row)">{{item.kaoheDepartment.name}}</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="考核组评分" prop="group_score" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="background: none;"
            @click="groupclick(scope.row)"
          >{{scope.row.group_score}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 责任单位意见弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="责任单位意见"
      :visible.sync="dutyUnitVisible"
      width="500"
      class="proupClass"
    >
      <div>
        <el-table :data="dutyUnitData" style="width: 100%" border="">
          <el-table-column prop="list" label="单位名称" width="120">
            <template slot-scope="scope">
              <div v-for="item in scope.row.list">{{item.kaoheDepartment.name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="zerencailiaoopinion" label="审核意见"></el-table-column>
          <el-table-column prop="score" label="审核分" width="100"></el-table-column>
          <el-table-column prop="zerencailiao" label="补充材料" width="240">
            <template slot-scope="scope">
              <template v-for="item in scope.row.zerencailiaoList">
                <div>
                  <a :href="item.href" target="_blank" class="colorfont">{{item.name}}</a>
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
    <!-- 考核组意见弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="考核组意见"
      :visible.sync="groupUnitVisible"
      width="35%"
      class="proupClass"
    >
      <div>
        <el-table :data="groupUnitData" style="width: 100%" border="">
          <el-table-column prop="group_opinion" label="审核意见"></el-table-column>
          <el-table-column prop="group_score" label="审核分" width="100"></el-table-column>
          <el-table-column prop="group_score_files" label="补充材料" width="240">
            <template slot-scope="scope">
              <template v-for="item in scope.row.kaohecailiaoList">
                <div>
                  <a :href="item.href" target="_blank" class="colorfont">{{item.name}}</a>
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
          @click="groupUnitVisible = false"
          size="medium"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["modules", "detailData", "rowData"],
  data() {
    return {
      scoreSearch: false,
      modelData: [],
      niandu: "",
      leader_dep_name: "",
      firstTargetArr: [], //一级指标合并数组
      firstTargetPos: 0,
      secondTargetArr: [], //二级指标合并数组
      secondTargetPos: 0,
      satisfy_score: "",
      add_minus_score: "",
      response_score: "",
      group_score: "",
      department_name: "",
      kaoheOptions: [],
      assessOption: [],
      name: "",
      value: "",
      value1: "",
      searchParams: {},
      //责任单位弹窗
      dutyUnitVisible: false,
      dutyUnitData: [
        {
          score: "",
          zerencailiaoopinion: "",
          zerencailiaoList: [],
          list: []
        }
      ],
      //考核组弹窗
      groupUnitVisible: false,
      groupUnitData: [
        {
          group_score: "",
          group_opinion: "",
          kaohecailiaoList: []
        }
      ],
      zhongheFileList: []
    };
  },
  methods: {
    //综合报告上传查询
    zonghesearch() {
      let params = {
        id: this.rowData.model_Id,
        examed_dep: this.rowData.examed_dep
      };
      this.$http
        .post(globalConfig.server3 + "dangjian/selectfilesByid", params)
        .then(res => {
          if (res.data.response_code == "0") {
            let finalStr =
              res.data.response_body.instances[0].add_minus_explan_files;
            let finalArr = [];
            let http1 = globalConfig.server1;
            if (finalStr) {
              this.splitStr(finalStr, finalArr, http1);
              this.zhongheFileList = finalArr;
            }
            console.log(this.zhongheFileList);
          }
        });
    },
    //责任单位弹窗
    zhibiaoclick(val) {
      this.dutyUnitData.forEach(item => {
        item.score = val.score;
        item.zerencailiaoopinion = val.zerencailiaoopinion;
        item.zerencailiaoList = val.zerencailiaoList;
        item.list = val.list;
      });
      this.dutyUnitVisible = true;
    },
    //考核组弹窗
    groupclick(val) {
      this.groupUnitData.forEach(item => {
        item.group_score = val.group_score;
        item.group_opinion = val.group_opinion;
        item.kaohecailiaoList = val.kaohecailiaoList;
      });
      this.groupUnitVisible = true;
    },
    getData(val) {
      this.niandu = this.formatDate("yyyy", val.niandu);
      this.leader_dep_name = val.leader_dep_name;
      this.beexamed_dep_name = val.beexamed_dep_name;
      this.searchParams.model_id = val.id;
    },
    getkaoheID(val) {
      this.searchParams.examed_dep = val.id;
    },
    //考核组-被考核单位
    searchAssessOption() {
      this.$http
        .post(globalConfig.server3 + "dangjian/selectBeikaoheP")
        .then(res => {
          if (res.data.response_code == "0") {
            this.assessOption = res.data.response_body.departments;
          }
        });
    },
    //指标模型下拉
    searchOption() {
      this.$http
        .post(globalConfig.server3 + "dangjian/selectModel")
        .then(res => {
          if (res.data.response_code == "0") {
            this.kaoheOptions = res.data.response_body;
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
      }
      // else if (columnIndex === 1) {
      //   //第二列的合并方法,市
      //   const _row_2 = this.secondTargetArr[rowIndex];
      //   const _col_2 = _row_2 > 0 ? 1 : 0;
      //   return {
      //     rowspan: _row_2,
      //     colspan: _col_2
      //   }
      // }
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
          if (this.modelData[i].one_name === this.modelData[i - 1].one_name) {
            this.firstTargetArr[this.firstTargetPos] += 1;
            this.firstTargetArr.push(0);
          } else {
            this.firstTargetArr.push(1);
            this.firstTargetPos = i;
          }
        }
      }
    },
    mergeInit() {
      //合并初始化
      (this.firstTargetArr = []), //一级指标合并数组
        (this.firstTargetPos = 0);
      // this.secondTargetArr = [], //二级指标合并数组
      // this.secondTargetPos = 0
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
        this.zonghesearch();
        this.merge();
        this.scoreSearch = val;
      } else {
        this.zhongheFileList = [];
      }
    },
    scoreSearch(val) {
      if (!val) {
        this.$emit("close");
      }
    }
  },
  mounted() {
    // this.search()
    this.searchOption();
    this.searchAssessOption();
  }
};
</script>
<style scoped lang="scss">
#scoreSearch {
  .zhibiaobox {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    color: #409eff;
    margin-left: 10px;
    text-decoration: underline;
  }

  .assessTitle {
    margin: 20px 0;
    line-height: 30px;
    color: #000;
    font-size: 18px;
  }

  .assessTitle li {
    display: inline-block;
    line-height: 30px;
    margin-right: 15px;
  }

  .zhonghetitle {
    font-weight: 400;
  }
  .zhibiaobox:hover {
    color: #0841b4;
  }
  .zhonghebottom {
    display: inline-block;
    line-height: 30px;
    float: right;
  }
  .showModelTop {
    margin-bottom: 20px;

    .goback {
      float: left;
    }

    .topMiddle {
      height: 75px;
      line-height: 5;
      padding: 0 10px;
      width: 100%;

      span {
        padding: 0 10px;

        &.tempTip {
          padding-left: 20px;
        }
      }
    }

    .tempconpy {
      width: 150px;
      margin-left: -20px;
    }
  }
}

.satbor {
  border: 1px red solid;
  width: 100%;
  margin-bottom: 20px;
}
</style>
<style lang="scss">
#scoreSearch {
  .el-dialog__body {
    overflow: auto;
    max-height: 550px;
  }
  .el-input--mini .el-input__inner {
    text-align: center;
  }

  .colorfont {
    color: #409eff;
    padding: 5px 0;
    cursor: pointer;
  }

  .el-table__row td .cell .box .el-popover__reference {
    height: 10%;
    display: -webkit-box;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;

    /* autoprefixer: on */
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
}
</style>
