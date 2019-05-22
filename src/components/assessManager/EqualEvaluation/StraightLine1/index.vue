<template>
  <div class="ProvincialAuthorities" id="strigline1hyg">
    <el-form class="issueTop" style="margin-top:3px;">
      <div class="asstopWrap">
        <el-form-item label="年度：" class="assessSelect">
          <el-select v-model="value" size="mini"  clearable  placeholder="请选择" class="selectWrap" @change="search()" style="width:150px">
            <el-option v-for="item in options" :key="item.niandu" :label="item.niandu" :value="item.niandu">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="btnworpbox">
          <el-button size="medium" class="bluebtnclass" type="primary" @click="exportExcel">数据导出</el-button>
          <el-button size="medium" class="bluebtnclass" type="primary" @click="save"> 保存</el-button>
        </div>
      </div>

      <div class="unitList">
        <p>{{value}}年度江苏省省级机关一类综合考核排名情况</p>
      </div>
    </el-form>
    <div>
      <div class="tableboxs">
        <el-table id="banzishuju" :data="assessmentScore" border style="width: 100%" stripe  height="500">
          <el-table-column type="index" label="序号" width="70"> </el-table-column>
          <el-table-column prop="name" label="考核对象"> </el-table-column>
          <el-table-column prop="score" label="得分" sortable> </el-table-column>
          <el-table-column prop="lev" label="等次">
            <template slot-scope="scope">
              <el-select v-model="scope.row.lev" placeholder="请选择等级" @change="getdenji(scope.row)" v-if="daochu">
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
  import {
    setTimeout
  } from 'timers';
  export default {
    data() {
      return {
        daochu: true,
        value: '',
        lev: "",
        options: [],
        assessmentScore: [],
        levdengji: [],
        dengjiArr: []
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
                fuwuId: item.id,
                remarks: item.remarks,
                lev: item.lev
              }
              this.dengjiArr.forEach((item, index) => {
                if (item.id == temp.id) {
                  this.dengjiArr.splice(index, 1)
                }
              })
              this.dengjiArr.push(temp)

              this.$http.post(globalConfig.server1 +
                  'fuwuQualityController/updateFuwuQuality', this.dengjiArr)
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
        this.$http.post(globalConfig.server5 + 'tDictionaryController/getListForCode',{"code":"10"}).then(res => {
          if (res.data.response_code === '0') {
            this.levdengji = res.data.response_body
          } else {
            this.levdengji = []
          }
        })
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
            }), '2018年度江苏省省级机关绩效考核.xlsx')
          } catch (e) {
            if (typeof console !== 'undefined') console.log(e, wbout)
          }
          this.daochu = true
          return wbout
        }.bind(this), 0)
      },
      getdenji(val) {
        let temp = {
          fuwuId: val.id,
          remarks: val.remarks,
          lev: val.lev
        }
        this.dengjiArr.forEach((item, index) => {
          if (item.fuwuId == temp.id) {
            this.dengjiArr.splice(index, 1)
          }
        })
        this.dengjiArr.push(temp)
      },
      //查询
      search() {
        let fd = new FormData()
        fd.append("niandu", this.value)
        fd.append("szType", "1")
        this.$http.post(globalConfig.server5 + 'fuwuQualityController/showFuwuQuality', fd).then(res => {
          if (res.data.response_code === '0') {
            this.assessmentScore = []
            let arr = res.data.response_body
            arr.map(item => {
              let temp = {
                id: item.fuwuZonghe.id,
                name: item.department.name,
                score: item.fuwuZonghe.score,
                lev: item.fuwuZonghe.lev,
                remarks:item.fuwuZonghe.remarks
              }
              this.assessmentScore.push(temp)
            })
            this.assessmentScore.map(item => {
              if (item.score) {
                item.score = Number(item.score)
              }
            })
          } else {

          }
        })
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
          } else {

          }
        })
      },
      //下拉等级菜单
      // select2() {
      //   this.$http.post(globalConfig.server5 + 'fuwuQualityController/showLev').then(res => {
      //     if (res.data.response_code === '0') {
      //       this.levdengji = []
      //       let arr = res.data.response_body
      //       arr.map(item => {
      //         let obj = {
      //           dengji: item
      //         }
      //         this.levdengji.push(obj)
      //       })
      //     } else {

      //     }
      //   })
      // },
      //保存
      save() {
        this.$http.post(globalConfig.server5 + 'fuwuQualityController/updateFuwuQuality', this.dengjiArr).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          } else {

          }
        })
      },
      mrxs() {
        setTimeout(function () {
          // var date = new Date;
          // var year = date.getFullYear()
          this.value = this.options[0].niandu
          this.search()
        }.bind(this), 600)
      }
    },
    mounted() {
      this.select()
      // this.select2()
      this.mrxs()
      this.getdengci()
      // this.search()
    }
  };

</script>

<style scoped lang="scss">
  #strigline1hyg {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .asstopWrap {
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
        width: 345px;
        margin-bottom: 32px;

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
        text-align: right;
        color: #ff0000;
        font-size: 14px;
      }
    }

    .assessIssue {
      min-height: 450px;
    }

  }

</style>
<style lang="scss">
  #strigline1hyg {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
    }
    .el-select-dropdown__item {
      font-size: 16px !important;
    }
    .ckyjcss>input{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }

  

</style>
