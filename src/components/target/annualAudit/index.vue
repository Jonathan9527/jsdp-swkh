<template>
  <div class="annualAudit" id = "annualAuditId">
    <div v-show="annualAuditMoudle">
      <el-tabs type="border-card">
        <el-tab-pane :label="toAudit()">
          <el-table :data="modelIndexes" border style="width: 100%;margin-top:20px" stripe>
            <el-table-column prop="model_name" label="待审核指标"> </el-table-column>
						
            <el-table-column prop="status" label="" width="300">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small" style="background: none;color: #0841B4;"><span style="border-bottom: 1px solid #0841B4;">立即处理</span></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="yetAudit()">
          <el-table :data="partyBuilding" border style="width: 100%;margin-top: 20px" stripe>
            <el-table-column prop="model_name" label="已审核指标"> </el-table-column>
            <el-table-column prop="status" label="" width="300">
              <template slot-scope="scope">
                <el-button @click="handleClickyet(scope.row)" type="text" size="small" style="background: none;">查看</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane :label="yetsentBack()">
          <el-table :data="highQuality" border style="width: 100%;margin-top: 20px" stripe>
            <el-table-column prop="model_name" label="已退回指标"> </el-table-column>
            <el-table-column prop="status" label="" width="300">
              <template slot-scope="scope">
                <el-button @click="handleClickback(scope.row)" type="text" size="small" style="background: none;">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <auditProcess :modules="auditProcessModule" :detailData="detailModel" @close="closeModule"></auditProcess>
    <checkedProcess :modules="checkProcessModule" :detailData="checkdetailModel" @close="closeModule"></checkedProcess>
    <backProcess :modules="backProcessModule" :detailData="backdetailModel" @close="closeModule"></backProcess>

  </div>
</template>

<script>
  import auditProcess from "./components/auditProcess.vue"
  import checkedProcess from "./components/checkedProcess.vue"
  import backProcess from "./components/backProcess.vue"
  export default {
    components: {
      auditProcess,
      checkedProcess,
      backProcess
    },
    data() {
      return {
        annualAuditMoudle: true,
        auditProcessModule: false, //待审核处理模块
        checkProcessModule: false, //已审核处理模块
        backProcessModule: false, //已退回处理模块
        detailModel: {}, //待审核模块传值
        checkdetailModel: {}, //已审核模块传值
        backdetailModel: {}, //已退回模块传值
        toAudittext: "待审核",
        yetAudittext: "已审核",
        yetsentBacktext: "已退回",
        modelIndexes: [],
        partyBuilding: [],
        highQuality: [],
        toAudittextLeg: 0,
        partytextLeg: 0,
        hightextLeg: 0,
      }
    },
    methods: {
      toAudit() {
        return this.toAudittext + "（" + this.toAudittextLeg + "）";
      },
      yetAudit() {
        return this.yetAudittext + "（" + this.partytextLeg + "）";
      },
      yetsentBack() {
        return this.yetsentBacktext + "（" + this.hightextLeg + "）";
      },
      //待审核
      handleClick(row) {
        let params = {
          model_name: row.model_name,
          "audit_status": "1"
        }
        this.$http.post(globalConfig.server2 + 'model/selectModelAndModelContentwithDepartment', params).then(res => {
          if (res.data.response_code === '200') {
            this.annualAuditMoudle = false
            this.auditProcessModule = true
            let temp = res.data.response_body
            let data = res.data.response_body.list
            data.forEach(item => {
              item.model_type = temp.model_type
              item.beexamed_dep_name = temp.beexamed_dep_name
            });
            this.detailModel = data
            this.detailModel.auditID = temp.id
          
          } else {

          }
				
        })

      },
      //已审核
      handleClickyet(row) {
        let params = {
          model_name: row.model_name,
          "audit_status": "2"
        }
       
        this.$http.post(globalConfig.server2 + 'model/selectModelAndModelContentwithDepartment', params).then(res => {
          if (res.data.response_code === '200') {
            this.annualAuditMoudle = false
            this.checkProcessModule = true
            let temp = res.data.response_body
            let data = res.data.response_body.list
            data.forEach(item => {
              item.model_type = temp.model_type
              item.beexamed_dep_name = temp.beexamed_dep_name
            });
            this.checkdetailModel = data
         
          } else {

          }
        })
      },
      //已退回
      handleClickback(row) {
        let params = {
          model_name: row.model_name,
          "audit_status": "3"
        }
      
        this.$http.post(globalConfig.server2 + 'model/selectModelAndModelContentwithDepartment', params).then(res => {
          if (res.data.response_code === '200') {
            this.annualAuditMoudle = false
            this.backProcessModule = true
            let temp = res.data.response_body
            let data = res.data.response_body.list
            data.forEach(item => {
              item.model_type = temp.model_type
              item.beexamed_dep_name = temp.beexamed_dep_name
            });
            this.backdetailModel = data
          
          } else {

          }
        })

      },
      closeModule() {
        this.annualAuditMoudle = true
        this.auditProcessModule = false
        this.checkProcessModule = false
        this.backProcessModule = false

      },
      //获取审核状态接口
      auditState(params) {
        if(params.audit_status == 1){
          let de = JSON.parse(sessionStorage.getItem('personal')).roleData.department.id
          params.leader_department = de  
        }
        this.$http.post(globalConfig.server2 + 'model/selectToAudit', params).then(res => {
          if (res.data.response_code === '0') {
            if (params.audit_status == '1') {
              this.modelIndexes = res.data.response_body
              this.toAudittextLeg = res.data.response_body.length
            } else if (params.audit_status == '2') {
              this.partyBuilding = res.data.response_body
              this.partytextLeg = res.data.response_body.length
            } else if (params.audit_status == '3') {
              this.highQuality = res.data.response_body
              this.hightextLeg = res.data.response_body.length
            }

          } else {

          }
        })
      }
    },
    mounted() {
      this.auditState({
        "audit_status": "1"
      });
      this.auditState({
        "audit_status": "2"
      });
      this.auditState({
        "audit_status": "3"
      });
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#annualAuditId{
   .el-tabs--border-card {
    min-height: 575px;
    margin-top: 10px;
  }
}
 

</style>
