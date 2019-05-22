<template>
  <div class="DividedDistricts" id="leaderganbuhrl" style="padding: 0 15px;">
    <el-form class="issueTop">
      <div class="asstopWrap">
        <div class="assessTitle">
          <ul>
            <li><span>年份：</span>
              <el-select v-model="value" clearable size="medium" @change="xuanzhong" style="width: 150px;">
                <el-option v-for="item in options" :key="item.niandu" :label="item.niandu" :value="item.niandu">
                </el-option>
              </el-select>
            </li>
            <li><span>单位：</span>
              <el-select v-model="value2"  clearable filterable size="medium" @change="xuanzhong" style="width: 350px;">
                <el-option v-for="item in options2" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </li>
          </ul>
        </div>
        <div class="btnworpbox">
          <el-button size="medium" class="bluebtnclass" type="primary" @click="scoreForm2">公式设置</el-button>
          <el-button size="medium" class="bluebtnclass" type="primary" @click="countSum">汇总</el-button>
          <el-button size="medium" class="bluebtnclass" type="primary" @click="saveBc"> 保 存</el-button>
          <el-button size="medium" class="bluebtnclass" type="primary" @click="exportExcel">数据导出</el-button>
        </div>
      </div>

      <div class="unitList">
        <p><span>{{value}}</span>年度省直机关二类领导干部排名情况</p>

      </div>
    </el-form>
    <div>
      <div class="tableboxs">
        <p class="scoringRule"></p>
        <el-table id="banzishuju" :data="assessmentScore" border style="width: 100%" stripe height="500">
          <el-table-column type="index" label="序号" width="70"> </el-table-column>
          <el-table-column prop="examed_name" label="单位" width="100"> </el-table-column>
          <!-- 新加 -->
          <el-table-column prop="duty" label="职务" width="250"> </el-table-column>
          <el-table-column prop="people_name" label="考核对象" width="70"> </el-table-column>
          <el-table-column label="年度综合考核">
              <el-table-column prop="city_score" label="得分"> </el-table-column>
              <el-table-column prop="city_lev" label="等次"> </el-table-column>
          </el-table-column>
          <el-table-column label="民主测评">
            <el-table-column prop="overall_excellent_pct" sortable label="优秀率（%）">
            </el-table-column>
            <el-table-column prop="overall_good_pct" label="称职率（%）">
            </el-table-column>
            <el-table-column prop="overall_excell_good_pct" label="优称率（%）">
            </el-table-column>
            <el-table-column prop="people_score" label="测评得分">
            </el-table-column>
          </el-table-column>
          <el-table-column prop="score" sortable label="汇总得分" >
          </el-table-column>
          <el-table-column prop="lev" label="等次" width="130">
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
          <el-table-column  label="备注" width="150" prop="remarks">
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
    <!-- 公式弹窗 -->
    <el-dialog :visible.sync="scoreForm" :close-on-click-modal="false" title="省直机关干部成员等次公式" class="formula proupClass" width="700px" @close="clearnianzhong">
      <el-form>
        <el-form-item label="年份：" style="font-size: 18px;">
          <!-- <el-select v-model="value" clearable size="medium" @change="xuanzhong" style="width: 150px;">
            <el-option v-for="item in options" :key="item.niandu" :label="item.niandu" :value="item.niandu">
            </el-option>
          </el-select> -->
          {{value}}
        </el-form-item>
        <el-form-item>
            <div class="formula-bor">
            <div style="font-size:16px;">党政正职汇总得分公式：</div>
              <div class="formula-gs" style="margin-top:0;">
                <span>设区市综合考核得分*</span>
                <el-input type="text" v-model="ext1" style="width: 100px;"></el-input>
                <span>民主测评得分*</span>
                <el-input type="text" v-model="ext2" style="width: 100px;"></el-input>
              </div>
            </div>
          </el-form-item>
        <el-form-item>
            <div style="font-size:16px;">其他领导干部汇总得分公式：</div>
          <div class="formula-bor" style="margin-top:0;">
            <div class="formula-gs">
              <span>设区市综合考核得分*</span>
              <el-input type="text" v-model="ext3" style="width: 100px;"></el-input>
              <span>民主测评得分*</span>
              <el-input type="text" v-model="ext4" style="width: 100px;"></el-input>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="scoreForm = false">取 消</el-button>
        <el-button class="proupbtnqueding" type="primary" @click="scoreFormsqs">确 定</el-button>
      </div>
    </el-dialog>
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
        value2: '',
        ext1:'',//综合考核得分
        ext2:'',//民主测评得分
        ext3: '',
        ext4: '',
        valID: '',
        scoreForm: false,
        nianfen: '', //年度
        options: [],
        options2: '',
        levdengji: [],
        changeArr: [],
        exlname: "年度全省领导干部排名情况.xlsx",

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
                  "PeopleZonghe/updateLev", this.changeArr)
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
        this.$http.post(globalConfig.server5 + 'tDictionaryController/getListForCode',{"code":"9"}).then(res => {
          if (res.data.response_code === '0') {
            this.levdengji = res.data.response_body
          } else {
            this.levdengji = []
          }
        })
      },
       clearnianzhong(){
        this.ext3 = ''
        this.ext4 = ''
        this.ext1 = ''
        this.ext2 = ''
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

          } else {

          }
        })
      },
     //下拉单位菜单省直二类
      select2() {
        let params = {
          sz_type:"2"
        }
        this.$http.post(globalConfig.server5 + 'department/selectNameBysztype',params).then(res => {
          if (res.data.response_code === '0') {
            this.options2 = res.data.response_body.departments
          } else {

          }
        })
      },
      //搜索
      search() {
        let params = {
          "niandu": this.value,
          "type": "3",
          "examed_name": this.value2
        }
        this.$http.post(globalConfig.server3 + 'PeopleZonghe/selectZongheByNianduAndType', params).then(res => {
          if (res.data.response_code === '0') {
            this.assessmentScore = res.data.response_body.peopleZonghes
            this.assessmentScore.map(item => {
              if (item.score) {
                item.score = Number(item.score)
              }
            })
          } else {
            this.$message({
              message: res.data.response_desc,
              type: 'success'
            });
            this.assessmentScore = []
          }
        })
      },
      //汇总计算
      countSum() {
        let params = {
          "nd": this.value,
          "leaderType": "3"
        }
        this.$http.post(globalConfig.server3 + 'PeopleZonghe/updateHuizong', params).then(res => {
          if (res.data.response_code === '0') {
            this.search()
            this.$message({
              message: res.data.response_body,
              type: 'success'
            });
          } else {
            this.$message({
              message: res.data.response_desc,
              type: 'error'
            });
            this.assessmentScore = []
          }
        })
      },
      //保存
      saveBc() {
        this.$http.post(globalConfig.server3 + 'PeopleZonghe/updateLev', this.changeArr).then(res => {
          if (res.data.response_code === '0') {
            this.search()
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '保存失败',
              type: 'error'
            });
          }
        })
      },
      //弹框查询
      scoreForm2() {
        let params = {
          "niandu": this.value,
          "type": "3"
        }
        this.$http.post(globalConfig.server3 + 'democraticEvaluationOfShow/showFormulaOfCoefficient', params).then(res => {
          if (res.data.response_code === '0') {
            this.scoreForm = true
           
            this.ext1 = res.data.response_body.ext1
            this.ext2 = res.data.response_body.ext2
            this.ext3 = res.data.response_body.ext3
            this.ext4 = res.data.response_body.ext4
            this.valID = res.data.response_body.id
            console.log(this.valID)
          } else {
            this.$message({
              message: res.data.response_body,
              type: 'error'
            });
          }
        })
      },
      //弹框保存
      scoreFormsqs() {
        let params = {
          "niandu": this.value,
          "type": "3",
          "id": this.valID,
          "nianduZh": this.ext3,
          "minzhuScore": this.ext4,
          "ndzonghe":this.ext1,
          "mzceping":this.ext2
        }
        this.$http.post(globalConfig.server3 + 'democraticEvaluationOfShow/updateForPeople', params).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
            this.scoreForm = false
            this.search()
            this.countSum() 
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
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
        }.bind(this), 600)
      }
    },
    mounted() {
      this.select()
      this.select2()
      this.getdengci()
      //this.search()
      this.mrxs()
    }
  };

</script>

<style scoped lang="scss">
  #leaderganbuhrl {
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

    .formula-bor {
      border-radius: 5px;
    }

    .el-form-item__label {
      font-size: 16px;
    }

    .formula-gs {
      text-align: center;
      line-height: 6;
      background: #f3f3f3;
      margin-top: 20px;

      input {
        text-align: center;
      }

      span {
        font-size: 18px;
      }
    }

    .formula-title {
      width: 560px;
      height: 50px;
      text-align: center;
      margin: 0 auto;

      span {
        font-size: 30px;
        color: #333;
        font-weight: bold;

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
  #leaderganbuhrl {
    .el-input--mini .el-input__inner {
      text-align: center;
      width: 100px;
    }
    .el-dialog__body {
      overflow: auto;
      max-height: 550px;
    }
    .ckyjcss>input{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }

</style>
