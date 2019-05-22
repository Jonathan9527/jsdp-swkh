<template>
  <div v-show="manyidushow">
    <el-button type="primary" @click="gobacks" class="bluebtnclass" style="float:left">返回</el-button>
    <div class="dividedWrap" id="divievaluatehyg">
      <el-form class="issueTop">
        <div class="unitList">
          <p>{{this.rowData.niandu2}}年度设区市党的建设满意度打分</p>
          <p>({{this.rowData.examed_dep_name}})</p>
        </div>
      </el-form>
      <div>
        <div class="tableboxs">
          <el-table :data="assessmentScore" style="width: 100%" stripe>
            <el-table-column prop="ranking" type="index" label="序号" width="70"> </el-table-column>
            <el-table-column prop="department_name" label="考核对象" width="200"> </el-table-column>
            <el-table-column label="社会公众（含“两代表一委员”）评价（5分）">
              <el-table-column :label="publicmax()" prop="public_score">
              </el-table-column>
              <el-table-column :label="twoonemax()" prop="two_one_score">
              </el-table-column>
            </el-table-column>
            <el-table-column label="省直相关部门评价（5分）">
              <el-table-column :label="tuijinmax()" prop="tuijin_score">
              </el-table-column>
              <el-table-column :label="dangjianmax()" prop="dangjian_score">
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  export default {
    props: ["modules", 'detailData', 'rowData'],
    data() {
      return {
        manyidushow: false,
        value: '',
        huidiao: '',
        publicmaxtext: '社会公众评分',
        twoonemaxtext: '“两代表一委员”评分',
        tuijinmaxtext: '推进高质量发展评分',
        dangjianmaxtext: '加强党的建设年度成效满意度评价',
        nianfen: '', //年度
        nianduoptions: [],
        assessmentScore: [],
        fenshuObj: {
          public_max: '',
          two_one_max: "",
          tuijin_max: "",
          dangjian_max: ""
        }
      }
    },
    methods: {
      gobacks() {
        this.manyidushow = false
      },
      publicmax() {
        return this.publicmaxtext + "（" + this.fenshuObj.public_max + "分）";
      },
      twoonemax() {
        return this.twoonemaxtext + "（" + this.fenshuObj.two_one_max + "分）";
      },
      tuijinmax() {
        return this.tuijinmaxtext + "（" + this.fenshuObj.tuijin_max + "分）";
      },
      dangjianmax() {
        return this.dangjianmaxtext + "（" + this.fenshuObj.dangjian_max + "分）";
      },
      //搜索
      search() {
        let params = {
          niandu: Number(this.rowData.niandu2),
          name_en: "satisfy_score"
        }
        this.$http.post(globalConfig.server3 + 'satisfy/selectSatisfyByNiandu', params).then(res => {
          if (res.data.response_code === '0') {
            let arr = res.data.response_body
            arr.forEach(item => {
              if (this.rowData.examed_dep == item.examed_dep) {
                this.assessmentScore.push(item)
                this.fenshuObj.public_max = item.public_max
                this.fenshuObj.two_one_max = item.two_one_max
                this.fenshuObj.tuijin_max = item.tuijin_max
                this.fenshuObj.dangjian_max = item.dangjian_max
              }
            });
          } else {
            this.$message({
                type: 'error',
                message: res.data.response_desc
              }); 
          }
        })

      },

      mrxs() {
        setTimeout(function () {
          var date = new Date;
          var year = date.getFullYear()
          this.nianfen = year
          this.search()
        }.bind(this), 600)
      }
    },
    watch: {
      modules(val) {
        if (val) {
          this.manyidushow = val
          this.mrxs()
        } else {
          this.assessmentScore = []
          this.fenshuObj.public_max = ""
          this.fenshuObj.two_one_max = ""
          this.fenshuObj.tuijin_max = ""
          this.fenshuObj.dangjian_max = ""
        }
      },
      manyidushow(val) {
        if (!val) {
          this.$emit('close')
        }
      }
    },
    mounted() {

    }
  }

</script>

<style scoped lang="scss">
  #divievaluatehyg {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .asstopWrap {
      margin-bottom: 32px;
      overflow: hidden;
      padding: 0px 0 15px 0px;

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
        margin-bottom: 20px;
        line-height: 55px;
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
      }
    }

    .assessIssue {
      min-height: 450px;
    }
  }

</style>
<style lang="scss">
  #divievaluatehyg {
    .el-input--mini .el-input__inner {
      text-align: center;
      width: 100px;
    }

    .reds {
      color: #ff0000;
      display: none;
    }
  }

</style>
