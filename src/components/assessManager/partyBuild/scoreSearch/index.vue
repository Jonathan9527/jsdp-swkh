<template>
  <div id="scoreSearch">
    <div class="showModelTop clearfix">
      <div class="topMiddle">
        <span class="tempName">考核指标：</span>
        <el-select style="margin-left: -20px;width: 350px;" value-key="model_name" v-model="value" size="medium"
          placeholder="请选择" @change="getData">
          <el-option v-for="item in kaoheOptions" :key="item.value" :label="item.model_name" :value="item">
          </el-option>
        </el-select>
        <span class="tempName">被考核单位：</span>
        <el-select v-model="value1" value-key="name" size="medium" placeholder="请选择" class="tempconpy" @change="getkaoheID">
          <el-option v-for="item in assessOption" :key="item.value1" :label="item.name" :value="item">
          </el-option>
        </el-select>
        <span prop="niandu">年度：{{niandu}}</span>
        <span prop="leader_dep_name">牵头单位：<span>{{leader_dep_name}}</span></span>
        <span prop="add_minus_score">加减分：{{add_minus_score}}</span>
        <span prop="satisfy_score">满意度评分：{{satisfy_score}}</span>
        <div style="float: right;">
          <el-button style="margin-left: 20px;" type="primary" size="medium" class="iconfont icon-chaxun" @click="search">查询</el-button>
          <!--<el-button type="primary" size="medium">计算得分</el-button>-->
        </div>
      </div>
    </div>
    <el-table :data="modelData" border :span-method="arraySpanMethod" style="width: 100%" stripe>
      <el-table-column prop="one_name" label="一级指标" width="150">
        <template slot-scope="scope">
          <div style="font-size: 18px">{{scope.row.one_name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="two_name" label="二级指标" width="200">
      </el-table-column>
      <el-table-column prop="three_name" label="三级指标">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="400" trigger="hover" :content="scope.row.three_name" popper-class="tipClass"
            :visible-arrow="false">
            <div slot="reference" style="font-size: 14px">{{scope.row.three_name}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="three_content" label="计分说明">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="400" trigger="hover" :content="scope.row.three_content" popper-class="tipClass"
            :visible-arrow="false">
            <div slot="reference">{{scope.row.three_content}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="list" label="责任单位" width="150">
        <template slot-scope="scope">
          <div v-for="item in scope.row.list">{{item.kaoheDepartment.name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="年终评分" prop="score" width="120"></el-table-column>
      <el-table-column label="考核组打分" prop="group_score" width="120"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    props: ["modules"],
    data() {
      return {
        /*showModelVisible:false,*/
        modelData: [{
          one_name: '',
          two_name: '',
          three_name: '',
          three_content: '',
          list: []
        }],
        niandu: '',
        leader_dep_name: '',
        firstTargetArr: [], //一级指标合并数组
        firstTargetPos: 0,
        secondTargetArr: [], //二级指标合并数组
        secondTargetPos: 0,
        satisfy_score: '',
        add_minus_score: '',
        response_score: '',
        group_score: '',
        department_name: '',
        kaoheOptions: [],
        assessOption: [],
        name: '',
        value: '',
        value1: '',
        searchParams: {

        }
      }
    },
    methods: {
      getData(val) {
        this.niandu = this.formatDate("yyyy", val.niandu)
        this.leader_dep_name = val.leader_dep_name
        this.beexamed_dep_name = val.beexamed_dep_name
        this.searchParams.model_id = val.id

      },
      getkaoheID(val) {
        this.searchParams.examed_dep = val.id
        this.search()
      },
      search() {
        let params = this.searchParams
        this.$http.post(globalConfig.server3 + 'dangjian/selectPingfen', params).then(res => {
          if (res.data.response_code == "0") {
            this.modelData = res.data.response_body.contents
            this.satisfy_score = res.data.response_body.huizongs[0].satisfy_score
            this.add_minus_score = res.data.response_body.huizongs[0].add_minus_score
            let instanceDetails = res.data.response_body.instanceDetails
            this.modelData.map(item => {
              instanceDetails.forEach(val => {
                if (val.model_content_id == item.id) {
                  item.score = val.score
                  item.group_score = val.group_score
                }
              })
            })


            this.modelData.map((item) => {
              item.one_name = item.one_name + "(" + item.one_value + "分)"
              item.two_name = item.two_name + "(" + item.two_value + "分)"
              item.three_name = item.three_name + "(" + item.three_value + "分）"
            })
            this.merge()

          } else {
            this.modelData = []
          }
        })
      },
      //考核组-被考核单位
      searchAssessOption() {
        this.$http.post(globalConfig.server3 + 'dangjian/selectBeikaoheP').then(res => {
          if (res.data.response_code == "0") {
            this.assessOption = res.data.response_body.departments
          }
        })
      },
      //指标模型下拉
      searchOption() {
        this.$http.post(globalConfig.server3 + 'dangjian/selectModel').then(res => {
          if (res.data.response_code == "0") {
            this.kaoheOptions = res.data.response_body
          }
        })
      },
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
        } else if (columnIndex === 1) {
          //第二列的合并方法,市
          const _row_2 = this.secondTargetArr[rowIndex];
          const _col_2 = _row_2 > 0 ? 1 : 0;
          return {
            rowspan: _row_2,
            colspan: _col_2
          }
        }
      },
      merge() { //合并相同数据
        this.mergeInit()
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
            if (this.modelData[i].city === this.modelData[i - 1].city && this.modelData[i].one_name === this.modelData[
                i - 1].one_name) {
              this.secondTargetArr[this.secondTargetPos] += 1;
              this.secondTargetArr.push(0);
            } else {
              this.secondTargetArr.push(1);
              this.secondTargetPos = i;
            }


          }
        }
      },
      mergeInit() { //合并初始化
        this.firstTargetArr = [], //一级指标合并数组
          this.firstTargetPos = 0,
          this.secondTargetArr = [], //二级指标合并数组
          this.secondTargetPos = 0
      },
      goback() {
        this.showModelVisible = false
      },
      mrxs() {
        setTimeout(function () {
          this.value = this.kaoheOptions[0].decription
          this.getData(this.kaoheOptions[0])
          setTimeout(function () {
            this.value1 = this.assessOption[0].name
            this.getkaoheID(this.assessOption[0])
            setTimeout(function () {
              this.search()
            }.bind(this), 600)
          }.bind(this), 500)
        }.bind(this), 400)
      }
    },
    watch: {
      modules(val) {
        if (val) {
          this.showModelVisible = val
        }
      },
      showModelVisible(val) {
        if (!val) {
          this.$emit('close')
        }
      }
    },
    mounted() {
      // this.search()
      this.searchOption()
      this.searchAssessOption()
      this.mrxs();
    },

  }

</script>
<style scoped lang="scss">
  #scoreSearch {
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
    .el-input--mini .el-input__inner {
      text-align: center;
    }
  }

</style>
