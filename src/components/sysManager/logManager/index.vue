<template>
  <div class="logmanager">
    <div class="asstopWrap">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="用户：">
          <!-- <el-select v-model="params.operatorName" placeholder="请选择" clearable>
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select> -->
          <el-input v-model="params.operatorName" placeholder="角色名称" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-date-picker v-model="params.startDate" type="date" placeholder="选择开始日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker v-model="params.endDate" type="date" placeholder="选择结束日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class="bluebtnclass " @click="search(params)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :data="tableData" border style="width: 100%;margin-top:10px;" stripe  >
      <el-table-column fixed prop="operatorName" label="用户">
      </el-table-column>
      <el-table-column prop="createtime" label="操作时间">
      </el-table-column>
      <el-table-column prop="methodName" label="操作对象">
      </el-table-column>
      <el-table-column label="详情">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showrequest(scope.row)" style="background: none;color: #0841B4;"><span style="border-bottom: 1px solid #0841B4;">请求报文</span></el-button>
          <el-button type="text" size="small" @click="showreponse(scope.row)" style="background: none;color: #0841B4;"><span style="border-bottom: 1px solid #0841B4;">返回报文</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="pagings">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pageNum"
        :page-sizes="[15,30,50,100]" :page-size="params.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 请求报文弹窗 -->
    <el-dialog title="请求报文" :close-on-click-modal="false" :visible.sync="requestMessage" width="30%" class='proupClass'>
      <div>
          {{request}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnqueding" @click="closeModel" type="primary">返 回</el-button>
      </span>
    </el-dialog>
    <!-- 返回报文弹窗 -->
    <el-dialog title="请求报文" :close-on-click-modal="false" :visible.sync="responseMessage" width="30%" class='proupClass'>
        <div>
          {{response}}
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button  class="proupbtnqueding"  @click="closeModel" type="primary" >返 回</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        logFrom: {},
        params: { //数据传值
          operatorName: "",
          pageNum: "",
          endTime: "",
          pageNum: 1,
          pageCount: 15,
        },
        userOptions: [],
        tableData: [],
        total: 1 ,//数据总条数
        request:"",//请求报文
        response:"",//请求报文
        responseMessage:false,
        requestMessage:false,
        loading: true
      }
    },
    methods: {
      //分页器 
      handleSizeChange(val) {
        this.params.pageCount = val
        this.search(this.params)
       
      },
      handleCurrentChange(val) {
        this.params.pageNum = val
        this.search(this.params)
      
      },
      showrequest(val){
        this.requestMessage = true
        this.request = JSON.parse(val.requestMessage)
      },
      showreponse(val){
        this.responseMessage = true
        this.response = JSON.parse(val.responseMessage)
      },
      search(val) {

        let end = this.formatDate("yyyyMMddHHmmss", val.endTime)
        let start = this.formatDate("yyyyMMddHHmmss", val.startTime)

        let params = {
          operatorName: val.operatorName,
          startTime: start,
          endTime: end,
          pageNum: val.pageNum,
          pageCount: val.pageCount
        }
        console.log(val.pageCount)
        this.$http.post(globalConfig.server5 + 'syslog/selectSyslogBypage', params).then(res => {
          if (res.data.response_code === '0') {
            this.tableData = res.data.response_body.list
            this.total = res.data.response_body.totalCount
            this.loading=false
            console.log(res.data.response_body)
          } else {
            this.tableData = res.data.response_body
            this.total = res.data.response_body.length
          }
        })

      },
      closeModel(){
        this.requestMessage = false
        this.responseMessage = false
      }
    },
    mounted() {
      let endTime = new Date()
      let startTime = endTime.getTime() - 3600 * 1000 * 24
      this.params.startTime = startTime
      this.params.endTime = endTime

      this.search(this.params)
    }
  }

</script>
<style scoped lang="scss">
	.logmanager {
		.el-select-dropdown__item {
			font-size: 16px;
		}
  .pagings {
    margin-top: 20px;
    margin-left: 35%;
  }
		.asstopWrap {
			margin-top: 5px;
		}

    .el-form--inline .el-form-item {
      margin-right: 20px;
      margin-bottom: 22px;
    }

    .el-button--primary {
      border-width: 0.5px;
    }

    .btnworpbox {
      float: right;

      button {
        margin-left: 20px;
      }
    }

  }

</style>
<style lang="scss">
  .logmanager {
    .el-input--small .el-input__inner {
      height: 38px;
      line-height: 38px;
    }
    .el-dialog__body{
      padding: 24px;

      max-height:550px;
      overflow: auto;
    }
    .el-form-item__label {
      font-size: 16px;
      line-height: 38px;
    }
  }

</style>
