<template>
  <div id="table-box"> 
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="index" :index="indexMethod" width="70">
          </el-table-column>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column :prop="item.prop" :width="item.width" v-for="(item,index) in tableTitle" :key="index" :label="item.label" sortable>
          </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pages.currentPage"
          :page-sizes="pages.pageSizes" :page-size="pages.pageSize"
          :layout="pages.layout"
          :total="pages.totalRows"
          style="margin-top:25px">
      </el-pagination>
  </div>
</template>
<script>
import paginations from "./mixins/paginations.js"
export default {
    props:['tableTitle','params','url'],
    mixins:[paginations],
     data() {
      return {
          tableData: [],
          checked: true,
          multipleSelection: [],
          currentPage: 0,
          total: 0,
          pageSize: 0,
      }
     },
     methods:{
         // 表格选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      indexMethod(index) {
        return index + 1;
      },
      getTableData() {
        this.params.pageNum = this.pages.currentPage, //起始页
        this.params.pageCount= this.pages.pageSize, //每页条数
        this.$http.post(globalConfig.server1 + this.url, this.params).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.list
            this.pages.totalRows = res.data.data.totalCount
          }
        })
      },
       
     }

}
</script>
<style>
 .el-table--scrollable-x .el-table__body-wrapper{
    overflow:auto!important;
   height: 540px;

  }
  .el-table__body-wrapper .is-scrolling-middle{
   overflow:auto!important;
   height: 540px;
 }
 .el-table__body-wrapper.is-scroll-right::-webkit-scrollbar, .el-table__body-wrapper.is-scroll-left::-webkit-scrollbar, .el-table__body-wrapper.is-scroll-middle::-webkit-scrollbar, .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar, .el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar{
   height: 15px;
   width: 0;
 }
 .el-table th{
   padding: 0;
 }
 .cell span{
   font-size: 17px;
 }
</style>