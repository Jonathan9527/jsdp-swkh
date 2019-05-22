<template>
  <div id="minzhubanzicyhh" v-show="daochushow">
    <el-button type="primary" class="bluebtnclass"  @click="goback">返回</el-button>
    <el-button type="primary" class="bluebtnclass"  @click="exportExcel">导出excel</el-button>
    <el-tabs>
      <div>
        <el-table :data="tableData" id="banzishuju" border stripe>
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
</template>
<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    props: ['modules'],
    data() {
      return {
        tableData: [],
        daochushow: false,
      }
    },
    methods: {
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
          }), '党政班子数据分析表.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      },
      goback() {
        this.daochushow = false
      },
      search() {
        let params = {
          niandu: "2018",
          dutySz: "市长",
          dutySj: "书记"
        }
        this.$http.post(globalConfig.server4 + 'democraticEvaluationToExcel/dutyToExcel', params).then(res => {
          if (res.data.response_code == "0") {
            this.tableData = res.data.response_body
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
      this.search()
    }
  }

</script>
<style scoped lang="scss">


</style>
<style lang="scss">

</style>
