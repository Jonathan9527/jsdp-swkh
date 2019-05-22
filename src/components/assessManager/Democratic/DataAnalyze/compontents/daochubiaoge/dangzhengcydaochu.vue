<template>
  <div id="minzhubanzi" v-show="daochushow">
    <div class="returnclick">
      <el-button type="primary" class="bluebtnclass leftcla" @click="goback">返回</el-button>
    </div>
    <div class="lis">
      <h2>一、历史数据对比</h2>
      <div style="margin-top:20px">
        <span>年度：</span>
        <el-select v-model="value" multiple value-key="niandu" size="medium" placeholder="请选择" class="selectWrap">
          <el-option v-for="item in options" :key="item.niandu" :label="item.niandu" :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" class="bluebtnclass" @click="exportExcel" style="margin-left:20px;float:right">导出excel</el-button>
        <el-button type="primary" class="bluebtnclass" @click="search" style="float:right">查询</el-button>
      </div>
      <el-tabs>
        <div>
          <el-table :data="tableData" id="banzishuju" border stripe>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="出生年月" prop="birthDate"></el-table-column>
            <el-table-column label="职务" prop="duty"></el-table-column>
            <el-table-column label="党政班子排名">
              <el-table-column label="2016" prop="2016年排名"></el-table-column>
              <el-table-column label="2017" prop="2017年排名"></el-table-column>
              <el-table-column label="2018" prop="2018年排名"></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </el-tabs>
    </div>
    <div style="margin-top:20px">
      <h2>二、干部数据对比</h2>
      <div style="margin-top:20px">
        <span>年度：</span>
        <el-select v-model="value1" size="medium" placeholder="请选择" class="selectWrap" @click="search">
          <el-option v-for="item in options" :key="item.niandu" :label="item.niandu" :value="item.niandu">
          </el-option>
        </el-select>
        <el-button type="primary" class="bluebtnclass" @click="exportExcel1" style="margin-left:20px;float:right">导出excel</el-button>
        <el-button type="primary" class="bluebtnclass" @click="search1" style="float:right">查询</el-button>

      </div>
      <el-tabs>
        <div>
          <el-table :data="tableData1" id="banzishuju1" border stripe>
            <el-table-column label="设区市" prop="deptment" sortable></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="有效票" prop="duty"></el-table-column>
            <el-table-column label="优秀票" prop="overallExcellent">
              <el-table-column label="总体评价" prop="validNum"></el-table-column>
              <el-table-column label="德" prop="de"></el-table-column>
              <el-table-column label="能" prop="neng"></el-table-column>
              <el-table-column label="勤" prop="qin"></el-table-column>
              <el-table-column label="绩" prop="ji"></el-table-column>
              <el-table-column label="廉" prop="lian"></el-table-column>
            </el-table-column>
            <el-table-column label="满意率" prop="manyi"></el-table-column>
            <el-table-column label="党政班子排序" prop="rank"></el-table-column>
          </el-table>
        </div>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    props: ['modules'],
    data() {
      return {
        value: [],
        value1: '',
        options: [],
        daochushow: false,
        tableData: [],
        tableData1: [],
      }
    },
    methods: {
      //年度下拉
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
      //数据导出
      exportExcel() {
        /* generate workbook object from table */
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
          }), '历史数据对比分析表.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      },
      exportExcel1() {
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(document.querySelector('#banzishuju1'))
        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(new Blob([wbout], {
            type: 'application/octet-stream'
          }), '干部数据对比分析表.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      },
      goback() {
        this.daochushow = false
      },
      search() {
        let niandus = this.value
        this.$http.post(globalConfig.server4 + 'democraticEvaluationToExcel/peopleToExcel', niandus).then(res => {
          if (res.data.response_code == "0") {
            this.tableData = res.data.response_body
          }
        })
      },
      search1() {
        let params = {
          niandu: this.value1,
          dutySz: "市长",
          dutySj: "书记"
        }
        this.$http.post(globalConfig.server4 + 'democraticEvaluationToExcel/dutyToExcel', params).then(res => {
          if (res.data.response_code == "0") {
            this.tableData1 = res.data.response_body
          }
        })
      }


    },
    watch: {
      modules(val) {
        if (val) {
          this.daochushow = val
        }
      },
      daochushow(val) {
        this.$emit('close', val)
      }
    },
    mounted() {
      this.select()
    }
  }

</script>
<style scoped lang="scss">
  .lis .analyzeContent .checkedbox{
    margin: 0 !important;
  }
  .returnclick {
    overflow: hidden;
    position: relative;
    left: 0;
    margin-bottom: 20px;
  }

  .asstopWrap {
    padding: 10px 0 0px 0px;
  }
  .leftcla{
    float: left;
  }
</style>
<style lang="scss">

</style>
