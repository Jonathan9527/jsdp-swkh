import Vue from 'vue'
import Router from 'vue-router'



const routerIndex = () =>
  import('@/components/index.vue');
const Login = () =>
  import('@/components/login.vue'); //登录
const shouye = () =>
  import('@/components/shouye.vue'); //首页

//系统设置
const RoleAuthorityManger = () =>
  import('@/components/sysManager/roleAuthorityManger/index.vue'); //角色权限设置
const Systemsettings = () =>
  import('@/components/sysManager/Systemsettings/index.vue') //系统开关设置
const LogManager = () =>
  import('@/components/sysManager/logManager/index.vue') //日志管理
const menusManger = () =>
  import('@/components/sysManager/caidan/index.vue') //菜单配置
//基本信息
const CompanyManager = () =>
  import('@/components/basicInfo/company/index.vue'); //单位信息管理
const CadreManager = () =>
  import('@/components/basicInfo/cadre/index.vue'); //干部信息二处
const CadreManager2 = () =>
  import('@/components/basicInfo/cadre/index2.vue'); //干部信息三处  
const UserAdm = () =>
  import('@/components/basicInfo/user/index.vue'); //用户管理

//指标管理
const AssManager = () =>
  import('@/components/target/assManager/index.vue'); //考核指标管理
const ModelConfig = () =>
  import('@/components/target/modelConfig/index.vue'); //指标模型配置
const AnnualReport = () =>
  import('@/components/target/annualReport/index.vue'); //年度指标上报
const AnnualAudit = () =>
  import('@/components/target/annualAudit/index.vue'); //年度指标审核
const AnnualRel = () =>
  import('@/components/target/annualRel/index.vue'); //年度考核发布

//考核管理(设区市)
const PartyBuild = () =>
  import('../components/assessManager/partyBuild/index.vue'); //党建考核
//党建考核三级
const assessOriganMater = () =>
  import('../components/assessManager/partyBuild/assessOriganMater/newindex.vue'); //加减分佐证材料
const yearEndScore = () =>
  import('../components/assessManager/partyBuild/yearEndScore/index.vue'); //年终评分
const assessGroupScore = () =>
  import('../components/assessManager/partyBuild/assessGroupScore/index.vue'); //考核组评分
const addminusScore = () =>
  import('../components/assessManager/partyBuild/addminusScore/index.vue'); //加减分评分
// const stisifactiuonScore = () =>
//   import('../components/assessManager/partyBuild/stisifactiuonScore/index.vue'); //满意度评分
const scoreSearch = () =>
  import('../components/assessManager/partyBuild/scoreSearch/index.vue'); //评分查询
const collectCalc = () =>
  import('../components/assessManager/partyBuild/collectCalc/index.vue'); //汇总计算
const IndicatorScore = () =>
  import('../components/assessManager/partyBuild/IndicatorScore/index.vue'); //指标打分佐证材料
const partyUploading = () =>
  import('../components/assessManager/partyBuild/partyUploading/index.vue'); //党建佐证材料上传


const AdvanceHighQuality = () =>
  import('../components/assessManager/advanceHighQuality/index.vue'); //推进高质量考核
const examinationUnitMaterial = () =>
  import('../components/assessManager/advanceHighQuality/examinationUnitMaterial/index.vue'); //被考核单位上传佐证材料
const dutyPersonTargetcheck = () =>
  import('../components/assessManager/advanceHighQuality/dutyPersonTargetcheck/index.vue'); //责任单位个性指标审核
const dutyAddMinusMaterCheck = () =>
  import('../components/assessManager/advanceHighQuality/dutyAddMinusMaterCheck/index.vue'); //责任单位加减分材料审核
const ndcPersonTargetScore = () =>
  import('../components/assessManager/advanceHighQuality/ndcPersonTargetScore/index.vue'); //发改委个性指标评分
const ndcAddMinusScore = () =>
  import('../components/assessManager/advanceHighQuality/ndcAddMinusScore/index.vue'); //发改委加减评分
const inspectionOfficePublicTargetScore = () =>
  import('../components/assessManager/advanceHighQuality/inspectionOfficePublicTargetScore/index.vue'); //考核办共性指标评分导入
const inspectionOfficeScoreSearch = () =>
  import('../components/assessManager/advanceHighQuality/inspectionOfficeScoreSearch/index.vue'); //考核办评分查询
const inspectionOfficeTotalCalc = () =>
  import('../components/assessManager/advanceHighQuality/inspectionOfficeTotalCalc/index.vue'); //考核办汇总计算
const PersonalityIndicator = () =>
  import('../components/assessManager/advanceHighQuality/PersonalityIndicator/index.vue'); //个性指标上传材料
const commonIndicators = () =>
  import('../components/assessManager/advanceHighQuality/commonIndicators/index.vue'); //共性指标评分

const gongxingScore = () =>
  import('../components/assessManager/advanceHighQuality/gongxingScore/index.vue'); //共性得分  
const gexingScore = () =>
  import('../components/assessManager/advanceHighQuality/gexingScore/index.vue'); //个性得分
//民主测评
const Democratic = () =>
  import('../components/assessManager/Democratic/index.vue'); //党建考核
//民主测评三级
const EvaluateImport = () =>
  import('../components/assessManager/Democratic/EvaluateImport/index.vue'); //测评数据导入 --- 设区市
const Shengzhijiguan = () =>
  import('../components/assessManager/Democratic/EvaluateImport/shengzhijiguan.vue'); //测评范围对象 --- 省直机关  
const MembersSummary = () =>
  import('../components/assessManager/Democratic/MembersSummary/index.vue'); //班子成员测评汇总
const PrincipalSummary = () =>
  import('../components/assessManager/Democratic/PrincipalSummary/index.vue'); //党政正职测评汇总
const DataAnalyze = () =>
  import('../components/assessManager/Democratic/DataAnalyze/index.vue'); //数据分析  

const DividedEvaluate = () =>
  import('../components/assessManager/DividedEvaluate/index.vue'); //设区市满意度评价
const ProvinEvaluate = () =>
  import('../components/assessManager/ProvinEvaluate/index.vue'); //省机关满意度评价
const DividedDistricts = () =>
  import('../components/assessManager/DividedDistricts/index.vue'); //设区市考核
const ProvincialAuthorities = () =>
  import('../components/assessManager/ProvincialAuthorities/index.vue'); //省机关综合考核

//考核管理(省直机关)
const IndicatorScoreTwo = () =>
  import('../components/assessManager/ProvincialAuthority/IndicatorScoreTwo/index.vue'); //指标得分
const SummaryScore = () =>
  import('../components/assessManager/ProvincialAuthority/SummaryScore/index.vue'); //汇总得分
const shenghiIndex = () =>
  import('../components/assessManager/Democratic/MembersSummary/shenghiIndex.vue'); //班子成员测评汇总
//等次评定
const DistrictCity = () =>
  import('../components/assessManager/EqualEvaluation/DistrictCity/index.vue'); //设区市等次

const Leaderbanzi = () =>
  import('../components/assessManager/EqualEvaluation/DistrictCity/leaderbanzi.vue'); //领导班子等次
const Leaderganbu = () =>
  import('../components/assessManager/EqualEvaluation/DistrictCity/leaderganbu.vue'); //领导干部等次

const StraightLine1 = () =>
  import('../components/assessManager/EqualEvaluation/StraightLine1/index.vue'); //省直一类
const StraightLine1Leaderbanzi = () =>
  import('../components/assessManager/EqualEvaluation/StraightLine1/leaderbanzi.vue'); //领导班子等次
const StraightLine1Leaderganbu = () =>
  import('../components/assessManager/EqualEvaluation/StraightLine1/leaderganbu.vue'); //领导干部等次

const StraightLine2 = () =>
  import('../components/assessManager/EqualEvaluation/StraightLine2/index.vue'); //省直二类
const StraightLine2Leaderbanzi = () =>
  import('../components/assessManager/EqualEvaluation/StraightLine2/leaderbanzi.vue'); //领导班子等次
const StraightLine2Leaderganbu = () =>
  import('../components/assessManager/EqualEvaluation/StraightLine2/leaderganbu.vue'); //领导干部等次

const StraightLine3 = () =>
  import('../components/assessManager/EqualEvaluation/StraightLine3/index.vue'); //省直三类
const StraightLine3Leaderbanzi = () =>
  import('../components/assessManager/EqualEvaluation/StraightLine3/leaderbanzi.vue'); //领导班子等次
const StraightLine3Leaderganbu = () =>
  import('../components/assessManager/EqualEvaluation/StraightLine3/leaderganbu.vue'); //领导干部等次

// //导出页面
// const dangzhengbanzidaochu = () =>
//   import('../components/assessManager/Democratic/DataAnalyze/compontents/daochubiaoge/dangzhengbanzidaochu.vue'); //党政班子导出
// const dangzhengcydaochu = () =>
//   import('../components/assessManager/Democratic/DataAnalyze/compontents/daochubiaoge/dangzhengcydaochu.vue'); //党政成员导出

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      name: '基本信息',
      component: routerIndex,
      hidden: false,
      icon: 'iconfont icon-jibenxinxi',
      children: [{
          path: '/companyManager',
          component: CompanyManager,
          name: '单位信息'
        },
        {
          path: '/cadreManager',
          component: CadreManager,
          name: '干部三处'
        },
        {
          path: '/cadreManager2',
          component: CadreManager2,
          name: '干部二处'
        },
        {
          path: '/userAdm',
          component: UserAdm,
          name: '用户管理'
        },
      ]
    },
    {
      path: '/',
      name: '指标管理',
      component: routerIndex,
      hidden: false,
      icon: 'iconfont icon-kaohezhibiao',
      children: [{
          path: '/assManager',
          component: AssManager,
          name: '指标配置'
        },
        {
          path: '/modelConfig',
          component: ModelConfig,
          name: '指标关联'
        },
        {
          path: '/annualReport',
          component: AnnualReport,
          name: '指标上报'
        },
        {
          path: '/annualAudit',
          component: AnnualAudit,
          name: '指标审核'
        },
        {
          path: '/annualRel',
          component: AnnualRel,
          name: '指标发布'
        },
      ]
    },
    {
      path: '/',
      name: '考核管理',
      component: routerIndex,
      hidden: false,
      icon: 'iconfont icon-juece',
      children: [{
          path: '/DividedEvaluate',
          component: DividedEvaluate,
          name: '满意度评价'
        },
        {
          path: '/ProvinEvaluate',
          component: ProvinEvaluate,
          name: '省机关满意度评价'
        },
        {
          path: '/DividedDistricts',
          component: DividedDistricts,
          name: '设区市'
        },
        {
          path: '/ProvincialAuthorities',
          component: ProvincialAuthorities,
          name: '得分统计'
        }
      ]
    },
    {
      path: '/',
      name: '系统设置',
      component: routerIndex,
      hidden: false,
      icon: 'iconfont icon-shezhi1',
      children: [
        /*{ path: '/sysManager', component: SysManager, name: '管理员设置' },*/
        {
          path: '/roleAuthorityManger',
          component: RoleAuthorityManger,
          name: '角色配置'
        },
        {
          path: '/systemsettings',
          component: Systemsettings,
          name: '开关设置'
        },
        {
          path: '/logManager',
          component: LogManager,
          name: '用户日志'
        },
        {
          path: '/menusManger',
          component: menusManger,
          name: '菜单配置'
        },
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: Login,
      hidden: true,
      icon: 'iconfont icon-shouyemenhu',
		},
    //不正常的二级路由
    {
      path: '/',
      component: routerIndex,
      name: '',
      abnormal: true,
      children: [{
          path: 'assessOriganMater',
          name: "加减分项材料",
          component: assessOriganMater
        },
        {
          path: 'yearEndScore',
          name: "指标评分管理",
          component: yearEndScore
        },
        {
          path: 'assessGroupScore',
          name: "考核组",
          component: assessGroupScore
        },
        {
          path: 'addminusScore',
          name: "加减分项评分",
          component: addminusScore
        },
        // {
        //   path: 'stisifactiuonScore',
        //   name: "满意度评分",
        //   component: stisifactiuonScore
        // },
        {
          path: 'scoreSearch',
          name: "评分查询",
          component: scoreSearch
        },
        {
          path: 'collectCalc',
          name: "得分统计",
          component: collectCalc
        },
        {
          path: 'examinationUnitMaterial',
          name: "加减分项材料",
          component: examinationUnitMaterial
        },
        {
          path: 'dutyPersonTargetcheck',
          name: "个性指标审核",
          component: dutyPersonTargetcheck
        },
        {
          path: 'dutyAddMinusMaterCheck',
          name: "加减分项审核",
          component: dutyAddMinusMaterCheck
        },
        {
          path: 'ndcPersonTargetScore',
          name: "个性指标评分",
          component: ndcPersonTargetScore
        },
        {
          path: 'ndcAddMinusScore',
          name: "加减分项评分",
          component: ndcAddMinusScore
        },
        {
          path: 'inspectionOfficePublicTargetScore',
          name: "考核办共性指标评分导入",
          component: inspectionOfficePublicTargetScore
        },
        {
          path: 'commonIndicators',
          name: "共性指标评分",
          component: commonIndicators
        },
        {
          path: 'partyUploading',
          name: "党建指标材料",
          component: partyUploading
        },
        {
          path: 'inspectionOfficeScoreSearch',
          name: "考核办评分查询",
          component: inspectionOfficeScoreSearch
        },
        {
          path: 'inspectionOfficeTotalCalc',
          name: "得分统计",
          component: inspectionOfficeTotalCalc
        },
        {
          path: 'gongxingScore',
          name: "共性得分",
          component: gongxingScore
        },
        {
          path: 'gexingScore',
          name: "个性得分",
          component: gexingScore
        },
        {
          path: 'evaluateImport',
          name: "民主测评得票",
          component: EvaluateImport
        },
        {
          path: 'shengzhijiguan',
          name: "民主测评得票",
          component: Shengzhijiguan
        },

        {
          path: 'shenghiIndex',
          name: "民主测评得分",
          component: shenghiIndex
        },
        {
          path: 'MembersSummary',
          name: "民主测评得分",
          component: MembersSummary
        },
        {
          path: 'PrincipalSummary',
          name: "党政正职测评得分",
          component: PrincipalSummary
        },
        {
          path: 'DataAnalyze',
          name: "数据统计分析",
          component: DataAnalyze
        },
        //设区市
        {
          path: 'districtCity',
          name: "单位综合",
          component: DistrictCity
        },
        {
          path: 'leaderbanzi',
          name: "领导班子等次",
          component: Leaderbanzi
        },
        {
          path: 'leaderganbu',
          name: "领导干部等次",
          component: Leaderganbu
        },
        //省直一类
        {
          path: 'straightLineone',
          name: "单位综合",
          component: StraightLine1
        },
        {
          path: 'straightLineOneleaderbanzi',
          name: "领导班子等次",
          component: StraightLine1Leaderbanzi
        },
        {
          path: 'straightLineOneleaderganbu',
          name: "领导干部等次",
          component: StraightLine1Leaderganbu
        },
        //省直二类
        {
          path: 'straightLinetwo',
          name: "单位综合",
          component: StraightLine2
        },
        {
          path: 'straightLinetwoleaderbanzi',
          name: "领导班子等次",
          component: StraightLine2Leaderbanzi
        },
        {
          path: 'straightLinetwoleaderganbu',
          name: "领导干部等次",
          component: StraightLine2Leaderganbu
        },
        //省直三类
        {
          path: 'straightLinesan',
          name: "单位综合",
          component: StraightLine3
        },
        {
          path: 'straightLinesanleaderbanzi',
          name: "领导班子等次",
          component: StraightLine3Leaderbanzi
        },
        {
          path: 'straightLinesanleaderganbu',
          name: "领导干部等次",
          component: StraightLine3Leaderganbu
        },
        {
          path: 'indicatorScore',
          name: "指标打分佐证材料",
          component: IndicatorScore
        },
        {
          path: 'indicatorScoreTwo',
          name: "指标评分管理",
          component: IndicatorScoreTwo
        },
        {
          path: 'summaryScore',
          name: "指标得分统计",
          component: SummaryScore
        },
        {
          path: 'personalityIndicator',
          name: "个性指标材料",
          component: PersonalityIndicator
        },
        {
          path: 'shouye',
          name: "首页",
          component: shouye
				},
				
      ]
    },
  ]
})
