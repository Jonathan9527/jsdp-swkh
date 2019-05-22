<template>
  <div id="showModelClasshyg" v-show="genscoreshow">
    <div style="margin: 10px 0;display: inline-block;float: left;">
      <el-button type="primary" class="bluebtnclass"  @click="gobacks">返回</el-button>
    </div>
    <div class="showModelTop clearfix">
      <div class="topMiddle">
        <p class="tempName">{{modelName}}</p>
        
        <p class="tempName">({{rowData2.departmentName}})</p>
      </div>
    </div>
    <el-table :data="modelData" border style="width: 100%" stripe :default-sort="{prop:'sort'}">
      <el-table-column type="index" label="序号" width="70"></el-table-column>
      <el-table-column prop="one_name" label="指标内容"></el-table-column>
      <el-table-column prop="one_value" label="指标分值">
      </el-table-column>
      <el-table-column prop="score" label="评分">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    props: ["modules", 'rowData2'],
    data() {
      return {
        genscoreshow: false,
        pageMsg: {
          templateName: "2018年度设区市党的建设考核指标模型",
          year: "2018",
          leadDepartment: "省委党建办",
          checkDepartment: "设区市"
        },
        modelData: [],
        kaoheOptions: [],
        assessOption: [],
        modelName: ''
      }
    },
    methods: {
      gobacks() {
        this.genscoreshow = false
        this.modelData = []
      },


      //共性指标下拉框
      gongxingselect() {
        let params = {
          niandu: this.rowData2.niandu2
        }
        this.$http.post(globalConfig.server1 + 'tuijinGongxing/selectGonxingModelByType', params).then(res => {
          if (res.data.response_code == "200") {
            this.kaoheOptions = res.data.response_body
            let model = this.kaoheOptions[0]
            this.modelName = model.model_name
            // this.getContent(this.kaoheOptions[0].id)
            this.beikaoheselect(model)
          }
        })
      },
      //被考核单位
      beikaoheselect(val) {
        let params = {
          model_id: val.id
        }

        this.$http.post(globalConfig.server1 + 'tuijinGongxing/selectGonxingInstanceByName', params).then(res => {
          if (res.data.response_code == "200") {
            this.assessOption = res.data.response_body
            this.assessOption.forEach(item => {
              if (item.examed_dep == this.rowData2.examed_dep) {
                this.getContent(item)
              }
            })

          }
        })

      },


      //加载共性打分页面
      getContent(val) {
        let params = {
          instance_id: val.id
        }
        this.$http.post(globalConfig.server1 + 'tuijinGongxing/selectGonxingInstanceDetailById', params).then(res => {
          if (res.data.response_code == "200") {
            this.modelData = res.data.response_body
            this.modelData.map((item) => {
              item.one_name = item.one_name
              item.two_name = item.two_name
              item.three_name = item.three_name

            })
          }
        })

      },


    },
    watch: {
      modules(val) {
        if (val) {
          this.gongxingselect() //共性指标下拉框
          this.genscoreshow = val
        } else {
          this.modelData = []
        }
      },
      genscoreshow(val) {
        if (!val) {
          this.$emit('close')
        }
      }
    },
    mounted() {

    },
  }

</script>
<style scoped lang="scss">
  #showModelClasshyg {
    .showModelTop {
      margin-bottom: 20px;
      display:inline-block;
      width: 80%;
      text-align: center;
      font-size:30px;
      color: #000;

      .topMiddle {
        line-height: 55px;
        float: left;
        width: 100%;

        span {

          &.tempTip {
            padding-left: 20px;
          }
        }
      }

      .topRight {
        float: left;
        margin-left: 30px;
      }

      .daoru .luru.baocun {
        margin-left: 20px;
        
      }

      .tempconpy {
        width: 150px;
        margin-left: -20px;
      }

      .bottom {
        display: inline-block;
        margin: 10px 20px 10px;
        width: 100%;

      }


      .bottom-btn {
        float: right;
      }
    }
  }

</style>
<style lang="scss">
  #showModelClasshyg {
    .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .pingfencenter {
      input {
        text-align: center;
      }
    }

  }

</style>
