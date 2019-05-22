<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="测评数据">
        <evaluateImport></evaluateImport>
      </el-tab-pane>
      <el-tab-pane label="班子成员测评汇总">
        <membersSummary></membersSummary>
      </el-tab-pane>
      <el-tab-pane label="党政正职测评汇总">
        <principalSummary></principalSummary>
      </el-tab-pane>
      <el-tab-pane label="数据分析">
        <dataAnalyze></dataAnalyze>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script> 
  import evaluateImport from "./EvaluateImport/index.vue" //测评数据导入
  import membersSummary from "./MembersSummary/index.vue" //班子成员测评汇总
  import principalSummary from "./PrincipalSummary/index.vue" //党政正职测评汇总
  import dataAnalyze from "./DataAnalyze/index.vue" //数据分析

export default {
  components: {
    evaluateImport,membersSummary,principalSummary,dataAnalyze
  },
  data(){
    return {

    }
  }
}
</script>
<style scoped lang="scss">

</style>
