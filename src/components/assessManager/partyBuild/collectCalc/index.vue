<template>
  <div id="collectCalc" style='margin-top:-5px;'>
    <div class="assessIssue">
      <div v-show="collectMoudle">
        <div class="title1">
          <span>年度：</span>
          <el-select v-model="value" value-key="model_name" size="medium" placeholder="请选择" @change="getData" style="width: 150px;">
            <el-option v-for="item in kaoheOptions" :key="item.value" :label="item.niandu" :value="item">
            </el-option>
          </el-select>
          <!-- <span prop="leader_dep_name">牵头单位：{{leader_dep_name}}</span> -->
          <el-button type="primary" size="medium" class="bluebtnclass" style="float: right;margin-left: 20px;margin-top: 6px;" @click="exportExcel">数据导出</el-button>
          <el-button type="primary" size="medium" class="bluebtnclass" style="float: right;margin-right: 5px;margin-top: 6px;" @click="collect">汇总</el-button>
        </div>
        <div class="title2">
          <p>{{value}}年度设区市党的建设考核指标排名情况</p>
        </div>
        <div>
          <div class="tableboxs">
            <div class="huizongtime">
              <span style="color:#0841B4">&nbsp;汇总时间：</span>
              <span>{{createtime}}</span>
            </div>
            <div class="scoringRule">
              <span style="color: #ff0000;">*计分规则：</span>
              <span>指标得分*0.9+满意度分</span>
              <span style="color:#ff0000">（注：加减分不列入总分）</span>
             </div>
            <el-table :data="assessmentScore" style="width: 100%" border stripe id="banzishuju">
              <el-table-column prop="ranking" type="index" width="70px" label="序号"></el-table-column>
              <el-table-column prop="examed_dep_name" label="考核对象"> </el-table-column>
              <el-table-column prop="response_score" label="指标得分">
                <template slot-scope="scope">
                  <el-button @click="scoreClickyet(scope.row)" type="text" size="small" style="background: none;color: #0841B4;"><span
                      style="border-bottom: 1px solid #0841B4;">{{scope.row.response_score}}</span></el-button>
                </template>
              </el-table-column>
              <el-table-column prop="satisfy_score" label="满意度分">
                  <template slot-scope="scope">
                      <el-button type="text" size="small" style="background: none;color: #0841B4;" @click="manyidudefen(scope.row)">
                        <span style="border-bottom: 1px solid #0841B4;">{{scope.row.satisfy_score}}</span>
                      </el-button>
                    </template>
              </el-table-column>
              <el-table-column prop="add_minus_score" label="加减分">
                <template slot-scope="scope">
                  <el-button type="text" size="small" style="background: none;color: #0841B4;" @click="minpoints(scope.row)">
                    <span style="border-bottom: 1px solid #0841B4;">{{scope.row.add_minus_score}}</span>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="score" sortable label="汇总得分"></el-table-column>

            </el-table>
          </div>
        </div>
      </div>
      <scoreSearch :modules="scoreSearch" :detailData="scoreModel" :rowData="scoreModel2" @close="closeModule"></scoreSearch>
      <minusPoints :modules="minusPoints" :rowData="clickrow" @close="closeModule"></minusPoints>
      <manyidu :modules="manyiduModule" :rowData="clickrow2"  @close="closeModule"></manyidu>
      
    </div>
  </div>
</template>
<script>
  import scoreSearch from "./components/scoreSearch.vue"
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import minusPoints from "./components/jiajianfen.vue" //加减分
  import manyidu from "./components/manyidu.vue"
  export default {
    components: {
      scoreSearch,
      minusPoints,
      manyidu
    },
    data() {
      return {
        clickrow: "",
        clickrow2: "",
        scoreModel2: "",
        chakanVist: true,
        minusPoints: false,
        collectMoudle: true,
        scoreSearch: false,
        manyiduModule:false,
        scoreModel: [],
        value: '',
        kaoheOptions: [],
        niandu: '', //年度
        beexamed_dep_name: '', //被考核单位
        leader_dep_name: '', //牵头单位
        assessmentScore: [],
        searchParams: {},
        searchTime:'',
        createtime:'',//汇总时间
      };
    },
    methods: {
      manyidudefen(row){
        this.clickrow2 = row
        this.clickrow2.niandu2 = this.niandu
        console.log(row);
        this.collectMoudle = false
        this.manyiduModule = true 
      },
      //加减分分值
      minpoints(row) {
        this.clickrow = row
        this.clickrow.niandu2 = this.niandu
        console.log(this.clickrow)
        this.collectMoudle = false
        this.minusPoints = true
      },
      //数据导出
      exportExcel() {
        this.chakanVist = false
        /* generate workbook object from table */
        setTimeout(function () {
          var wb = XLSX.utils.table_to_book(document.querySelector('#banzishuju'))
          /* get binary string as output */
          var wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            bookSST: true,
            type: 'array'
          })
          try {
            FileSaver.saveAs(new Blob([wbout], {
              type: 'application/octet-stream'
            }), '2018年度设区市党的建设考核指标排名情况.xlsx')
          } catch (e) {
            if (typeof console !== 'undefined') console.log(e, wbout)
          }
          this.chakanVist = true
          return wbout
        }.bind(this), 0)

      },
      getData(val) {
        this.niandu = val
        this.searchParams.model_id = val.id
        this.huizongshijian()
          let params ={
              niandu:this.value
            }
            this.$http.post(globalConfig.server3 + 'dangjian/selectModelByniandu',params).then(res=>{
              if(res.data.response_code === '0'){
                if(res.data.response_body.models[0]!=null &&res.data.response_body.models[0].id){
                  this.searchParams.model_id = res.data.response_body.models[0].id
                  this.search()
                }else {
                  this.assessmentScore = []
                }
              }
            })
      },
      //汇总得分
      collect() {

        let params = {
          "model_id": this.searchParams.model_id,
          "niandu" : this.value
        }
        this.$http.post(globalConfig.server3 + 'dangjian/updateHuizong', params).then(res => {
          if (res.data.response_code == "0") {
            this.huizongshijian()
            this.$message({
              message: '汇总成功',
              type: 'success'
            });
            this.search()
          } else {
            this.$message({
              message: '汇总失败',
              type: 'error'
            });
            this.search()
            this.assessmentScore = []
          }
        })
      },
      //查询上次汇总时间
       huizongshijian() {
        let params = {
          niandu: this.value
        }
        this.$http.post(globalConfig.server2 + 'dangjian/selectdangjianzongTime', params).then(res => {
          if (res.data.response_code == "0") {
            this.createtime = res.data.response_body.createtime
          } else {
            this.search()
          }
        })
      },
      //查询
      search() {
        let params = this.searchParams
        this.$http.post(globalConfig.server3 + 'dangjian/selectHuizong', params).then(res => {
          if (res.data.response_code == "0") {
            this.assessmentScore = res.data.response_body.dangjianHuizongs
            let instances = res.data.response_body.instances
            this.assessmentScore.map(item => {
              instances.forEach(val => {
                if (item.instance_Id == val.id) {
                  item.examed_dep_name = val.examed_dep_name
                  return
                }
              })
            })
            this.assessmentScore.map(item => {
              if (item.score) {
                item.score = Number(item.score)
              }
            })
           
          } else {
            this.assessmentScore = []
          }
        })
      },
      //指标模型下拉
      searchOption() {
        this.$http.post(globalConfig.server3 + 'fuwuQualityController/showNiandu').then(res => {
          if (res.data.response_code == "0") {
            this.kaoheOptions = []
            this.kaoheOptions = res.data.response_body
            this.value = this.kaoheOptions[0]
            this.getData(this.kaoheOptions[0])
            this.huizongshijian()
            let params ={
              niandu:this.value
            }
            this.$http.post(globalConfig.server3 + 'dangjian/selectModelByniandu',params).then(res=>{
              if(res.data.response_code === '0'){
                this.searchParams.model_id = res.data.response_body.models[0].id
                this.search()
              }
            })
          }
        })
      },
      scoreClickyet(row) {
        this.scoreModel2 = row
        console.log(row)
        let params = {
          examed_dep: row.examed_dep,
          model_id: this.searchParams.model_id
        }

        this.$http.post(globalConfig.server3 + 'dangjian/selectPingfen', params).then(res => {
          if (res.data.response_code == "0") {
            this.collectMoudle = false
            this.scoreSearch = true
            this.scoreModel = res.data.response_body.contents
            let instanceDetails = res.data.response_body.instanceDetails
            this.scoreModel.map(item => {
              instanceDetails.forEach(val => {

                if (val.model_content_id == item.id) {

                  item.score = val.score || ''
                  item.group_score = val.group_score || ''
                  item.group_opinion = val.group_opinion
                  item.group_score_files = val.group_score_files

                  item.zerencailiao = val.score_files || ""
                  item.zerencailiaoopinion = val.score_opinion

                  item.beikaohecailiao = val.final_explan_files || ""
                  item.beikaohecailiaoopinion = val.final_explanation

                }
              })


            })


            this.scoreModel.map((item) => {
              item.show_value = item.three_value + "分"
              item.one_name = item.one_name + "(" + item.one_value + "分)"
              item.two_name = item.two_name + "(" + item.two_value + "分)"
              item.three_name = item.three_name + "(" + item.three_value + "分）"

              item.zerencailiaoList = []

              let examStr = item.zerencailiao
              let examArr = []
              let http = globalConfig.server1
              if (examStr) {
                this.splitStr(examStr, examArr, http)
                item.zerencailiaoList = examArr
              }


              item.beikaohecailiaoList = []

              let beikao = item.beikaohecailiao
              let beikaoArr = []
              // let http = globalConfig.server1
              if (examStr) {
                this.splitStr(beikao, beikaoArr, http)
                item.beikaohecailiaoList = beikaoArr
              }


              item.kaohecailiaoList = []

              let kaohe = item.group_score_files
              let kaoheArr = []
              // let http = globalConfig.server1
              if (kaohe) {
                this.splitStr(kaohe, kaoheArr, http)
                item.kaohecailiaoList = kaoheArr
              }
            })

            // this.merge()


          } else {
            this.scoreModel = [] 
          }
        })

      },

      closeModule() {
        this.collectMoudle = true
        this.scoreSearch = false
        this.minusPoints = false
        this.manyiduModule = false
      },
      mrxs() {
        setTimeout(function () {
          // this.value = this.formatDate('yyyy', this.kaoheOptions[0].niandu)
          // this.value = this.kaoheOptions[0].decription
          // this.getData(this.kaoheOptions[0])
        }.bind(this), 400)
      }
    },
    mounted() {
      // this.search()
      this.searchOption()
      // this.mrxs();
      /* this.searchAssessOption()*/
    },
  };

</script>
<style scoped lang="scss">
  #collectCalc {
    .issueTop {
      margin: 10px 0 30px 0;

      .assessTitle {
        display: inline-block;

        ul {
          li {
            display: inline-block;
            color: #606266;
            margin-right: 20px;
            padding: 0 12px 0 0;
          }
        }
      }

      .assessSelect {
        display: inline-block;
        width: 350px;

        .el-button {
          margin-left: 60px;
        }
      }

      .unitList {
        text-align: center;
        font-size: 30px;
        color: #333;
        font-weight: 600;
        margin: 20px 0 30px 0;
      }
    }
    .huizongtime {
      margin-bottom: 15px
    }
    .tableboxs {
      margin-bottom: 30px;
      span {
        padding-top:10px 
      }
      .scoringRule {
        text-align: left;
      font-size: 16px;
      margin-top: 15px;
      margin: 10px 0;
      }
    }

    .assessIssue {
      min-height: 450px;
    }

    .el-form-item__label {
      font-size: 16px;
    }

    .el-select-dropdown__item {
      font-size: 16px;
    }

    .asstopWrap {
      padding-bottom: 5px;
      margin-top: 20px;
    }

    .title1 {
      height: 60px;
      line-height: 3.5;
      padding: 0px 0 15px 0px;
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
  }

</style>
<style lang="scss">
  #collectCalc {
    .assessIssue {
      .el-input--mini .el-input__inner {
        height: 38px;
        line-height: 38px;
      }

      .el-form-item__label {
        font-size: 16px;
        line-height: 42px;
      }
    }
  }

</style>
