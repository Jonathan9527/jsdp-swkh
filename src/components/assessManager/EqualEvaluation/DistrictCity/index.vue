<template>
  <div class="DividedDistricts" id="discityshyg" style="padding: 0 15px;">
    <el-form class="issueTop">
      <div class="asstopWrap">
        <div class="assessTitle">
          <ul>
            <li><span>年份：</span>
              <el-select v-model="value" size="medium" @change="xuanzhong" style="width:150px">
                <el-option v-for="item in options" :key="item.niandu" :label="item.niandu" :value="item.niandu">
                </el-option>
              </el-select>
            </li>
            <!-- <li><span>牵头单位：</span><span>发改委</span></li> -->
            <!-- <li><span>被考核单位：</span><span>设区市</span></li> -->
          </ul>
        </div>
        <div class="btnworpbox">
          <el-button size="medium" class="bluebtnclass" type="primary" @click="countSum">汇总</el-button>
          <el-button size="medium" class="bluebtnclass" type="primary" @click="saveBc"> 保 存</el-button>
          <el-button size="medium" class="bluebtnclass" type="primary" @click="exportExcel">数据导出</el-button>
        </div>
      </div>

      <div class="unitList">
        <p><span>{{value}}</span>年度江苏省设区市综合考核排名情况</p>

      </div>
    </el-form>
    <div>
      <div class="tableboxs">
        <p class="scoringRule">*计算公式：推进高质量发展成效得分*加强党的建设成效得分/80</p>
        <el-table id="banzishuju" :data="assessmentScore" border style="width: 100%" stripe   height="500">
          <el-table-column prop="ranking" type="index" label="序号" width="70"> </el-table-column>
          <el-table-column prop="examed_name" label="考核对象"> </el-table-column>
          <el-table-column prop="dangjian_score" label="党的建设得分"> </el-table-column>
          <el-table-column prop="tuijin_score" label="推进高质量发展得分"> </el-table-column>
          <el-table-column prop="score" label="总分" sortable> </el-table-column>
          <el-table-column prop="lev" label="等次">
            <template slot-scope="scope">
              <el-select v-model="scope.row.lev" placeholder="请选择" @change="changelev(scope.row)" v-if="daochu">
                <el-option v-for="item in levdengji" :key="item.mainValue" :label="item.mainValue" :value="item.mainValue">
                </el-option>
              </el-select>
              <div v-if="!daochu">
                {{scope.row.lev}}
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="备注" width="200" prop="remarks">
            <template slot-scope="scope">
              <div class="ckyj" @click="unitopinion(scope.row)" v-if="daochu">
                <div>
                  <el-input v-model="scope.row.remarks" class="ckyjcss"></el-input>
                </div>
              </div> 
              <div v-if="!daochu">
                {{scope.row.remarks}}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>


    </div>

  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    data() {
      return {
        daochu: true,
        assessmentScore: [], //数据表格
        value: '',
        nianfen: '', //年度
        options: [],
        levdengji: [],
        changeArr: [],
        exlname: "年度江苏省设区市综合考核排名情况.xlsx",

      };
    },
    methods: {
    //备注
    unitopinion(item) {
      this.csyj = item.remarks||"";
      setTimeout(function () {
        var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[0]
        $(ipt).get(0).focus()
        ipt.value = item.remarks;
      }.bind(this), 0)
      const h = this.$createElement;
      this.$msgbox({
        title: '备注',
        message: h('p', [
          h('textarea', {
            style: 'padding-left:10px;border: 1px solid #dcdfe6;border-radius: 5px;font-size:16px;'
          })
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        customClass: "dwyj",
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[0];
            item.remarks = ipt.value
            if (ipt.value == this.csyj) {
              this.$message({
                type: 'error',
                message: '请修改'
              });
              return
            }
            let temp = {
              id: item.id,
              remarks: item.remarks,
              lev: item.lev
            }
            this.changeArr.forEach((item, index) => {
              if (item.id == temp.id) {
                this.changeArr.splice(index, 1)
              }
            })
            this.changeArr.push(temp)

            this.$http.post(globalConfig.server1 +
                "zonghe/updateLev", this.changeArr)
              .then(
                res => {
                  if (res.data.response_code == "0") {
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    });
                  } else {}

                })

            done();
          } else {
            done();
          }
        }
      }).catch(() => {});
    },
    //从字典表查询所有等次
      getdengci(){
        this.$http.post(globalConfig.server5 + 'tDictionaryController/getListForCode',{"code":"11"}).then(res => {
          if (res.data.response_code === '0') {
            this.levdengji = res.data.response_body
          } else {
            this.levdengji = []
          }
        })
      },
      changelev(val) {
        let temp = {
          id: val.id,
          remarks: val.remarks,
          lev: val.lev
        }

        this.changeArr.forEach((item, index) => {
          if (item.id == temp.id) {
            this.changeArr.splice(index, 1)
          }
        })
        this.changeArr.push(temp)
      },
      //数据导出
      exportExcel() {
        this.daochu = false
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
            }), this.value + this.exlname)
          } catch (e) {
            if (typeof console !== 'undefined') console.log(e, wbout)
          }
          this.daochu = true

          return wbout
        }.bind(this), 0)

      },
      //下拉年度菜单
      select() {
        this.$http.post(globalConfig.server5 + 'fuwuQualityController/showNiandu').then(res => {
          if (res.data.response_code === '0') {
            this.options = []
            let arr = res.data.response_body
            arr.map(item => {
              let obj = {
                niandu: item
              }
              this.options.push(obj)
            })
            this.value = this.options[0].niandu
            this.search()
          } else {
            this.options = []
          } 
        })
      },
      //搜索
      search() {
        let params = {
          "niandu": this.value
        }
        this.$http.post(globalConfig.server3 + 'zonghe/selectzonghe', params).then(res => {
          if (res.data.response_code === '0') {
            this.assessmentScore = res.data.response_body.zongHes
            this.assessmentScore.map(item => {
              if (item.score) {
                item.score = Number(item.score)
              }
            })
          } else {

          }
        })
      },
      //汇总计算
      countSum() {
        let params = {
          "niandu": this.value
        }
        this.$http.post(globalConfig.server3 + 'zonghe/updateZonghe', params).then(res => {
          if (res.data.response_code === '0') {
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
          }
        })
      },
      //保存
      saveBc() {
        this.$http.post(globalConfig.server3 + 'zonghe/updateLev', this.changeArr).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.search()
          } else {
            this.$message({
              message: '保存失败',
              type: 'error'
            });
            this.search()
          }
        })
      },
      //年份选择
      xuanzhong() {
        this.search()
      },
      mrxs() {
        setTimeout(function () {
          // var date = new Date;
          // var year = date.getFullYear()
          this.value = this.options[0].niandu
          this.search()
        }.bind(this), 400)
      }
    },
    mounted() {
      this.select()
      //this.search()
      // this.mrxs()
      this.getdengci()
    }
  };

</script>

<style scoped lang="scss">
  #discityshyg {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .asstopWrap {
      padding: 5px 0 20px 5px;
      overflow: hidden;

      .btnworpbox {
        float: right;

        button {
          margin-left: 20px;
        }
      }
    }

    .issueTop {
      .assessTitle {
        display: inline-block;

        ul {
          li {
            display: inline-block;
            color: #606266;
            margin-right: 20px;
            line-height: 38px;
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
        margin-bottom: 32px;
      }

      li {
        span {
          font-size: 16px;
        }
      }

    }

    .tableboxs {
      text-align: center;
      margin: 0 auto;
      margin-bottom: 30px;

      .scoringRule {
        text-align: left;
        color: #ff0000;
        font-size: 14px;
        padding: 10px;
        background: #FFF4DE;
        border: 1px solid #FFD085;
        margin: 10px 0;
      }
    }

    .assessIssue {
      min-height: 450px;
    }

  }

</style>
<style lang="scss">
  #discityshyg {
    .el-input--mini .el-input__inner {
      text-align: center;
      width: 100px;
    }
    .ckyjcss>input{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }

</style>
