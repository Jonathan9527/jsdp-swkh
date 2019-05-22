<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="被考核单位上传佐证材料">
        <assessOriganMater></assessOriganMater>
      </el-tab-pane>
      <el-tab-pane label="年终评分">
        <yearEndScore></yearEndScore>
      </el-tab-pane>
      <el-tab-pane label="考核组评分">
        <assessGroupScore></assessGroupScore>
      </el-tab-pane>
      <el-tab-pane label="加减分评分">
        <addminusScore></addminusScore>
      </el-tab-pane>
      <!-- <el-tab-pane label="满意度评分">
        <stisifactiuonScore></stisifactiuonScore>
      </el-tab-pane> -->
      <el-tab-pane label="评分查询">
        <scoreSearch></scoreSearch>
      </el-tab-pane>
      <el-tab-pane label="汇总计算">
        <collectCalc></collectCalc>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import assessOriganMater from "./assessOriganMater/index.vue" //被考核单位上传佐证材料
  import yearEndScore from "./yearEndScore/index.vue" //年终评分
  import assessGroupScore from "./assessGroupScore/index.vue" //考核组评分
  import addminusScore from "./addminusScore/index.vue" //加减分评分
  import stisifactiuonScore from "./stisifactiuonScore/index.vue" //满意度评分
  import scoreSearch from "./scoreSearch/index.vue" //评分查询
  import collectCalc from "./collectCalc/index.vue" //汇总计算

export default {
  components:{assessOriganMater,yearEndScore,assessGroupScore,addminusScore,stisifactiuonScore,scoreSearch,collectCalc},
  data(){
    return{

    }
  }
}
</script>
<style scoped lang="sass">

</style>