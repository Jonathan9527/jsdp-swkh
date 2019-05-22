<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="被考核单位上传佐证材料">
        <examinationUnitMaterial></examinationUnitMaterial>
      </el-tab-pane>
      <el-tab-pane label="责任单位个性指标审核">
        <dutyPersonTargetcheck></dutyPersonTargetcheck>
      </el-tab-pane>
      <el-tab-pane label="责任单位加减分材料审核">
        <dutyAddMinusMaterCheck></dutyAddMinusMaterCheck>
      </el-tab-pane>
      <el-tab-pane label="发改委个性指标评分">
        <ndcPersonTargetScore></ndcPersonTargetScore>
      </el-tab-pane>
      <el-tab-pane label="发改委加减评分">
        <ndcAddMinusScore></ndcAddMinusScore>
      </el-tab-pane>
      <el-tab-pane label="考核办共性指标评分导入">
        <inspectionOfficePublicTargetScore></inspectionOfficePublicTargetScore>
      </el-tab-pane>
      <el-tab-pane label="考核办评分查询">
        <inspectionOfficeScoreSearch></inspectionOfficeScoreSearch>
      </el-tab-pane>
      <el-tab-pane label="考核办汇总计算">
        <inspectionOfficeTotalCalc></inspectionOfficeTotalCalc>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script> 
  import examinationUnitMaterial from "./examinationUnitMaterial/index.vue" //被考核单位上传佐证材料
  import dutyPersonTargetcheck from "./dutyPersonTargetcheck/index.vue" //责任单位个性指标审核
  import dutyAddMinusMaterCheck from "./dutyAddMinusMaterCheck/index.vue" //责任单位加减分材料审核
  import ndcPersonTargetScore from "./ndcPersonTargetScore/index.vue" //发改委个性指标评分
  import ndcAddMinusScore from "./ndcAddMinusScore/index.vue" //发改委加减评分
  import inspectionOfficePublicTargetScore from "./inspectionOfficePublicTargetScore/index.vue" //考核办共性指标评分导入
  import inspectionOfficeScoreSearch from "./inspectionOfficeScoreSearch/index.vue" //考核办评分查询
  import inspectionOfficeTotalCalc from "./inspectionOfficeTotalCalc/index.vue" //考核办汇总计算

export default {
  components: {
    examinationUnitMaterial,dutyPersonTargetcheck,dutyAddMinusMaterCheck,ndcPersonTargetScore,ndcAddMinusScore,inspectionOfficePublicTargetScore,inspectionOfficeScoreSearch,inspectionOfficeTotalCalc
  },
  data(){
    return {

    }
  }
}
</script>
<style scoped lang="scss">

</style>