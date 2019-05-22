<template>
  <div id="stisifactiuonScore">
    <div class="title1">
      <span>考核指标：</span>
      <el-select style="margin-left: -10px;width: 320px;" v-model="value" size="medium" placeholder="2018年设市区党的建设考核指标模型">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span style="margin-left: 20px">年份：</span><span>2018</span>
      <span style="margin-left: 20px">牵头单位：</span><span>省委党建办</span>
      <span style="margin-left: 20px">被考核单位：</span><span>设市区</span>
      <el-button type="primary" size="medium" style="float: right;margin-top: 5px;margin-right: 5px;">检验</el-button>
      <el-button type="primary" size="medium" style="float: right;margin-top: 5px;margin-right: 5px;">提交</el-button>
      <el-button type="primary" size="medium" style="float: right;margin-top: 5px;margin-right: 5px;">导出结果</el-button>
    </div>
    <div class="title2">
      <p>2018年度设区市党的建设满意度打分</p>
    </div>
    <el-tabs>
      <div>
        <el-table :data="tableData" border stripe>
          <el-table-column label="排名" prop="ranking"></el-table-column>
          <el-table-column label="考核对象" prop="objass"></el-table-column>
          <el-table-column label="得分（共10分）">
            <template slot-scope="scope">
              <el-input type="text" size="mini" :autosize="{ minRows: 1, maxRows: 3}" :value="scope.row.addsub" class="fenshu"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        options: [{
          value: '选项1',
          label: '2018年设市区党的建设考核指标模型',
        }],
        value: '',
        tableData: [{
          ranking: '1',
          objass: '南京市',
          addsub: '5',
        }, {
          ranking: '1',
          objass: '南京市',
          addsub: '5',
        }, {
          ranking: '1',
          objass: '南京市',
          addsub: '5',
        }, {
          ranking: '1',
          objass: '南京市',
          addsub: '5',
        }, ]
      }
    },
    methods: {

    }
  }

</script>
<style scoped lang="scss">
  #stisifactiuonScore {
    span {
      color: #606266;
    }

    .title1 {
      height: 60px;
      line-height: 3.5;
      margin-top: 20px;
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

    .downloadtext {
      cursor: pointer;
      color: #ff0000;
    }

    .fenshu {
      width: 30%;

    }
  }

</style>
