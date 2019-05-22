<template>
  <div id="ProvinEvaluate">
    <el-form class="issueTop">
      <div class="asstopWrap">
        <div class="assessTitle">
          <ul>
            <li><span>年份：</span><span>2018</span></li>
            <li><span>被考核单位：</span><span>省机关</span></li>
          </ul>
        </div>
        <div class="btnworpbox">
          <el-button size="medium" type="primary">检验</el-button>
          <el-button size="medium" type="primary">提交</el-button>
          <el-button size="medium" type="primary">导出结果</el-button>
        </div>
      </div>

      <div class="unitList">
        <p>2018年度省级机关党的建设满意度打分</p>

      </div>
    </el-form>
    <div>
      <div class="tableboxs">
        <el-table :data="assessmentScore" border style="width: 100%" stripe>
          <el-table-column prop="ranking" label="序号"> </el-table-column>
          <el-table-column prop="assessObject" label="考核对象"> </el-table-column>


          <el-table-column label="社会公众评分（5分）">
            <template slot-scope="scope">
              <el-input size="mini" :value="scope.row.publicScore"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="副省级以上在职领导评价（5分）">
            <template slot-scope="scope">
              <el-input size="mini" :value="scope.row.behalfScore"></el-input>
            </template>
          </el-table-column>



        </el-table>
      </div>


    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: '',
        options: [{
          value: "1",
          label: "2018设市区高质量发展共性指标"
        }],
        assessmentScore: [{
          ranking: '1',
          assessObject: "南京市",
          publicScore: "0.3",
          behalfScore: "9.34",

        }, {
          ranking: '2',
          assessObject: "南京市",
          publicScore: "0.3",
          behalfScore: "9.34",

        }]
      };
    },
    methods: {


    },
  };

</script>
<style scoped lang="scss">
  #ProvinEvaluate {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .asstopWrap {
      margin-top: 22px;
      margin-bottom: 32px;
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
  #ProvinEvaluate {
    .el-input--mini .el-input__inner {
      text-align: center;
      width: 100px ;
    }
  }

</style>
