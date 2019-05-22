<template>
  <div class="setting" style="margin-top:10px">
    <el-tabs type="border-card">
      <el-tab-pane label="指标开关设置">
        <el-table border :data="modelIndexes" style="width: 100%;margin-top:20px;">
          <el-table-column type="index" label="序号" width="70"> </el-table-column>
          <el-table-column prop="name" label="开关名称"> </el-table-column>
          <el-table-column prop="status" label="状态" width="300">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-color="#409EFF" inactive-color="#CCC" @change="editmodelIndexes(scope.row)"></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="党建开关设置">
        <el-table border :data="partyBuilding" style="width: 100%;margin-top:20px;" stripe>
          <el-table-column type="index" label="序号" width="70"> </el-table-column>
          <el-table-column prop="name" label="开关名称"> </el-table-column>
          <el-table-column prop="status" label="状态" width="300">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-color="#409EFF" inactive-color="#CCC" @change="editmodelIndexes(scope.row)"></el-switch>
            </template>
          </el-table-column>
        </el-table>

      </el-tab-pane>
      <el-tab-pane label="高质量开关设置">
        <el-table border :data="highQuality" style="width: 100%;margin-top:20px;" stripe>
          <el-table-column type="index" label="序号" width="70"> </el-table-column>
          <el-table-column prop="name" label="开关名称"> </el-table-column>
          <el-table-column prop="status" label="状态" width="300">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-color="#409EFF" inactive-color="#CCC" @change="editmodelIndexes(scope.row)"></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        modelIndexes: [{
          name: '指标内容上报',
          status: true,
        }],
        partyBuilding: [{
          dateName: '上报材料',
          status: true,
        }, {
          dateName: '责任单位打分',
          status: false,
        }, {
          dateName: '考核组打分',
          status: false,
        }],
        highQuality: [{
          dateName: '被考核单位上报指标',
          status: true,
        }, {
          dateName: '被考核单位上报加减分材料',
          status: true,
        }, {
          dateName: '责任单位审核指标',
          status: true,
        }, {
          dateName: '考核单位审核加减分材料',
          status: true,
        }, {
          dateName: '发改委评分',
          status: true,
        }]
      }
    },
    methods:{
      //模型指标
      getmodelIndexes(){
        let params = {
          model_id:"1"
        }
        this.$http.post(globalConfig.server1 + "configuration/selectConfiguration",params).then(res=>{
          if(res.data.response_code == "0"){
            this.modelIndexes = res.data.response_body
            this.modelIndexes.map(item=>{
              if(item.status == "0"){
                item.status = false
              }else if(item.status == "1"){
                item.status = true
              }
            })
          }else {
            this.modelIndexes = []
          }
        })
      },
      editmodelIndexes(val){
        let params = {
          id:val.id
        }
        if(val.status){
          params.status = "1"
        }else {
          params.status = "0"
        }
        this.$http.post(globalConfig.server1 + "configuration/updateConfiguration",params).then(res=>{
          if(res.data.response_code == "0"){
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          }else {
            val.status = !val.status
            this.$message({
              message: '修改失败',
              type: 'success'
            });
          }
        })
      },
      //党建开关
      getpartyBuilding(){
        let params = {
          model_id:"2"
        }
        this.$http.post(globalConfig.server1 + "configuration/selectConfiguration",params).then(res=>{
          if(res.data.response_code == "0"){
            this.partyBuilding = res.data.response_body
            this.partyBuilding.map(item=>{
              if(item.status == "0"){
                item.status = false
              }else if(item.status == "1"){
                item.status = true
              }
            })
          }else {
            this.partyBuilding = []
          }
        })
      },
      //高质量开关设置
      gethighQuality(){
        let params = {
          model_id:"3"
        }
        this.$http.post(globalConfig.server1 + "configuration/selectConfiguration",params).then(res=>{
          if(res.data.response_code == "0"){
            this.highQuality = res.data.response_body
            this.highQuality.map(item=>{
              if(item.status == "0"){
                item.status = false
              }else if(item.status == "1"){
                item.status = true
              }
            })
          }else {
            this.highQuality = []
          }
        })
      }
    },
    mounted () {
      this.getmodelIndexes()
      this.getpartyBuilding()
      this.gethighQuality()
    }
  }

</script>

<style scoped>
  .el-tabs--border-card {
    min-height: 575px;
  }

</style>
