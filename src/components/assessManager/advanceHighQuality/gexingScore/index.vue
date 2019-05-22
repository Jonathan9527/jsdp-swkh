<template>
    <div class="assessIssue" id = 'inspectocalcClassh' style='margin-top:-7px;'>
      <div v-show="collectMoudle">
        <el-form class="issueTop">
          <div class="asstopWrap">
            <ul class="assessTitle clearfix">
              <li>
                <span prop="niandu">
                  年度：
                </span>
                <el-select v-model="selectNain" size="mini" placeholder="请选择" class="selectWrap" @change="getData"
                  style="width:150px">
                  <el-option v-for="item in nianduOption" :key="item.niandu" :label="item.niandu" :value="item.niandu">
                  </el-option>
                </el-select>
              </li>
              <!-- <li>
                <span prop="beexamed_dep_name">被考核单位：{{beexamed_dep_name}}</span>
              </li> -->
              <li>
                <el-button size="medium" type="primary" class="bluebtnclass"  @click="huizongs">汇总</el-button>
              </li>
              <li>
                  <el-button type="primary" size="medium" class="bluebtnclass" @click="exportExcel">数据导出</el-button>
              </li>
            </ul>
          </div>
          <div class="unitList">
            <p>{{selectNain}}年度设区市高质量发展个性得分汇总情况</p>
          </div>
        </el-form>
        <div>
          <div class="tableboxs">
            <el-table :data="assessmentScore" id="banzishuju" border style="width: 100%" stripe  >
              <el-table-column prop="ranking" type="index" label="序号" width="70"> </el-table-column>
              <el-table-column prop="departmentName" label="考核对象"> </el-table-column>
              <el-table-column prop="gexing_score" label="个性得分">
                <template slot-scope="scope">
                  <el-button @click="scoreClickyet(scope.row)" type="text" size="small" style="background: none;color: #0841B4;">
                    <span class="tableclicksh" style="border-bottom: 1px solid #0841B4;">{{scope.row.gexing_score}}</span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
  
        </div>
      </div>
      <scoreSearch :modules="scoreSearch" :detailData="scoreModel" :rowData="scoreModel2" @close="closeModule"></scoreSearch>
    </div>
  </template>
  
  <script>
    import scoreSearch from "./components/scoreSearch.vue"
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
      components: {
        // generalsScore,
        scoreSearch,
      },
      data() {
        return {
          chakanVist: true,
          collectMoudle: true,
          scoreSearch: false,
          scoreModel: [],
          scoreModel2: "",
          value: '',
          clickrow: "",
          clickhang: "",
          assessmentScore: [],
          selectNain: "",
          kaoheOptions: [],
          nianduOption: [],
          niandu: '', //年度
          beexamed_dep_name: '设区市', //被考核单位
          leader_dep_name: '', //牵头单位
          searchParams: "",
          exlname: "年度设区市高质量发展考核指标汇总情况.xlsx",
          createtime:""
        };
      },
      methods: {
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
              }), this.selectNain + this.exlname)
            } catch (e) {
              if (typeof console !== 'undefined') console.log(e, wbout)
            }
            this.chakanVist = true
            return wbout
          }.bind(this), 0)
  
        },
        getData(val) {
          console.log(val)
          this.searchParams = val
          let params = {
            niandu: val
          }
          this.search(params)
          console.log(params);
        },
        search(params) {
          this.$http.post(globalConfig.server2 + 'tuijinHuizong/selectKaoheTuijingexing', params).then(res => {
            if (res.data.response_code == "200") {
              this.assessmentScore = res.data.response_body
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
        //年度下拉
        select() {
          this.$http.post(globalConfig.server5 + 'fuwuQualityController/showNiandu').then(res => {
            if (res.data.response_code === '0') {
              this.nianduOption = []
              let arr = res.data.response_body
              arr.map(item => {
                let obj = {
                  niandu: item
                }
                this.nianduOption.push(obj)
              })
              this.selectNain = this.nianduOption[0].niandu
              this.getData(this.selectNain)
  
            } else {
              this.nianduOption = []
            }
          })
        },
        //共性指标下拉框
        gongxingselect() {
          let params = {
            niandu: this.selectNain
          }
          this.$http.post(globalConfig.server1 + 'tuijinGongxing/selectGonxingModelByType', params).then(res => {
            if (res.data.response_code == "200") {
              this.leader_dep_name = res.data.response_body[0].leader_dep_name
            }
          })
        },
        
        //汇总
        huizongs() {
          let params = {
            niandu: this.searchParams
          }
         console.log(this.searchParams);
         
          this.$http.post(globalConfig.server2 + 'tuijinHuizong/updateTuijingexingHuizong', params).then(res => {
            if (res.data.response_code == "0") {
              this.createtime = res.data.response_body.createtime
              this.$message({
                message: '汇总成功',
                type: 'success'
              });
              this.search(params)
            } else {
               this.$message({
                message: '汇总失败',
                type: 'error'
              });
              this.search(params)
            }
          })
        },
  
        searchOption() {
          let params = {
            model_type: "个性"
          }
          this.$http.post(globalConfig.server2 + 'PromotingHighQualityAssessment/selectModelFaGaiWei', params).then(res => {
            if (res.data.response_code == "0") {
              this.kaoheOptions = res.data.response_body
            }
          })
        },
        
        //个性得分
        scoreClickyet(row) {
          this.scoreModel2 = row
          console.log(row)
          let params = {
            model_id: row.model_id
          }
          this.$http.post(globalConfig.server2 + 'PromotingHighQualityAssessment/selectModelContent', params).then(res => {
            if (res.data.response_code == "0") {
              this.collectMoudle = false
              this.scoreSearch = true
              this.scoreModel = []
              let obj = res.data.response_body
              for (let key in obj) {
                obj[key][0].departmentList = obj[key][1]
                this.scoreModel.push(obj[key][0])
              }
  
              this.scoreModel.map((item) => {
                item.one_name = item.one_name + "(" + item.one_value + "分)"
                item.two_name = item.two_name + "(" + item.two_value + "分)"
                item.three_name = item.three_name + "(" + item.three_value + "分）"
              })
            } else {
              this.$message({
                message: res.data.response_desc,
                type: 'error'
              });
            }
          })
        },
        closeModule() {
          this.collectMoudle = true
          this.scoreSearch = false
        },
        // 默认显示数据
        // mrsx() {
          
        // }
      },
      mounted() {
        this.select()
      },
    };
  
  </script>
  
  <style scoped lang="scss">
    .issueTop {
      padding: 0;
  
      .assessTitle {
        line-height: 42px;
  
        li {
          float: left;
          color: #606266;
          margin-right: 20px;
  
          &:last-child {
            /* float: right; */
          }
  
          &:nth-last-child(2) {
            /* float: right; */
          }
        }
      }
  
  
  
      .unitList {
        text-align: center;
        font-size: 30px;
        color: #333;
        font-weight: 600;
        margin: 32px 0;
      }
  
    }
  
    .tableboxs {
      margin-bottom: 30px;
  
      .scoringRule {
        text-align: left;
        font-size: 16px;
        margin-top: 15px;
        // background: #FFF4DE;
        // border: 1px solid #FFD085;
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
      margin-top: 10px;
    }
  
  </style>
  <style lang="scss">
    #inspectocalcClassh {
      .el-input--mini .el-input__inner {
        height: 38px;
        line-height: 38px;
      }
  
      .el-form-item__label {
        font-size: 16px;
        line-height: 42px;
      }
    }
  
  </style>
  