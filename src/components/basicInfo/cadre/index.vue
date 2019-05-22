<template>
  <div id="userManger2">
    <el-container>
      <el-aside width="337px">
        <el-form :model="departParams"  label-width="50px">
          <el-form-item label="年度：">
            <el-select v-model="departParams.niandu" placeholder="请选择年度" @change="getdepartAlltree">
              <el-option :label="item.mainValue" :value="item.mainValue" v-for="item in yearList" :key="item.mainValue"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-scrollbar class="content_scroll">
          <div class="btnGroup">
            <div class="btns">
              <el-button type="primary" class="bluebtnclass" size="medium" @click="addAndEditDepart('add')" :disabled="addDepartStatus">&nbsp;新增</el-button>
              <el-button type="primary" class="redsbtnclass" size="medium" @click="delDepart" :disabled="deleteDepartStatus">&nbsp;删除</el-button>
              <el-button type="primary" class="bluebtnclass" size="medium" @click="addAndEditDepart('edit')" :disabled="editDepartStatus">&nbsp;编辑</el-button>
              <el-button type="primary" class="bluebtnclass" size="medium" @click="sortClick">&nbsp;排序</el-button>
            </div>
          </div>

          <el-tree :expand-on-click-node="false" class="userTree" @node-click="getDepartnode" :data="departmentTree" :props="defaultProps"
            default-expand-all>
            <span slot-scope="{ node }" :class="nodeStyle(node)">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <div class="userTableTitle">用户列表</div>
        <el-form :inline="true" onsubmit="return false" class="clearfix demo-form-inline">
          <el-form-item label="姓名：">
            <el-input v-model="params.name_cn" placeholder="请输入姓名" size="medium"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="bluebtnclass" size="medium" @click="searchUsersInform">&nbsp;查询</el-button>
          </el-form-item>
          <div style="display: inline-block;">
            <el-form-item style="margin-right: 0">
              <!-- <el-button type="primary" class="bluebtnclass" size="medium" @click="sortUser">&nbsp;排序</el-button> -->
              <el-button type="primary" class="bluebtnclass" size="medium" @click="addAndEditUserClick('add')">&nbsp;添加</el-button>
              <el-button :disabled="editBt" size="medium" class="bluebtnclass" type="primary" @click="addAndEditUserClick('edit',idBatch[0])"
                style="margin-left: 13px;">编辑</el-button>
              <el-button type="primary" size="medium" @click="deleteUserInformItems" :disabled="idBatch.length == 0" class="redsbtnclass">&nbsp;删除</el-button>

              <el-button type="primary" size="medium" @click="linkUserInformDialog" class="bluebtnclass" :disabled="!clicknode.id || clicknode.id==firstUnit">&nbsp;关联干部人员</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-table ref="multipleTable" :data="userTableData" tooltip-effect="dark" style="width: 100%;margin-top:10px"
          border @selection-change="handleSelectionChange" stripe v-loading="scheduleLoading" element-loading-text="系统正在获取数据"
          element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.9)">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="序号" type="index">
          </el-table-column>
          <el-table-column label="姓名" prop="name" width="80">
          </el-table-column>
          <el-table-column label="职务" prop="dutyName">
          </el-table-column>
          <el-table-column label="职级" prop="dutyLev" >
          </el-table-column>
          <el-table-column label="职务标签" prop="dutyLabel" width="110">
          </el-table-column>
          <el-table-column label="性别" prop="sex" width="70">
          </el-table-column>
          <el-table-column label="民族" prop="nation" width="80">
          </el-table-column>
          <el-table-column label="出生年月" prop="birthDate" width="110">
          </el-table-column>
          <el-table-column label="入党时间" prop="partyDate" width="110">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="paging">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pageNum"
            :page-sizes="[15, 30, 50,100,]" :page-size="params.pageCount" layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
    <!-- 新增部门弹窗 -->
    <el-dialog title="添加部门" v-dialogDrag  :close-on-click-modal="false" :visible.sync="departDialogVisible" width="410px"
      class="proupClass" @close="closeDialog">
      <div>
        <el-form :model="addEditDrpartForm" label-width="120px">
          <el-form-item label="上级部门：" v-if="addEditDrpartForm.highDepartStatus">
            <el-input v-model="addEditDrpartForm.highDepart" class="addbumen" size="medium" disabled></el-input>
          </el-form-item>
          <el-form-item label="部门名称：" required >
            <el-input v-model="addEditDrpartForm.departName" class="addbumen" size="medium" :disabled="addEditDrpartForm.departNameStatus"></el-input>
          </el-form-item>
          <el-form-item label="新部门名称：" required v-if="addEditDrpartForm.newDepartNameStatus">
            <el-input v-model="addEditDrpartForm.newDepartName" class="addbumen" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="部门类型：" required v-if="addEditDrpartForm.departTypeStatus">
            <el-select v-model="addEditDrpartForm.departType" placeholder="请选择类型">
              <el-option :label="item.valueDesc" :value="item.mainValue" v-for="item in departTypeList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="addAndEditDepartTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加&&编辑用户弹窗 -->
    <el-dialog :title="addAndEditUserForm.title" class="proupClass redactuserDia" v-dialogDrag :close-on-click-modal="false" :visible.sync="addAndEditUserDia"
      width="750px" @close="userDialogClose">
      <div>
        <div class="addUsertip"><span class="req">*</span>为必填项</div>
        <el-form :model="addAndEditUserForm" label-width="110px" :rules="addAndEditUserFormRules" ref="addAndEditUserForm"> 
          <el-col :span="12">
            <el-form-item label="干部姓名：" prop="name">
              <el-input placeholder="请输入姓名" v-model="addAndEditUserForm.name" class="wid24" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职级：" prop="dutyLev">
              <el-input placeholder="请输入职级" v-model="addAndEditUserForm.dutyLev" class="wid24" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" >
              <el-radio-group v-model="addAndEditUserForm.sex">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族：" >
              <el-input placeholder="请输入民族" v-model="addAndEditUserForm.nation" class="wid24" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期：" >
              <el-date-picker
                size="medium"
                v-model="addAndEditUserForm.birthDate"
                type="date"
                class="wid24"
                value-format="yyyy-MM-dd"
                placeholder="请选择出生日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入党日期：" >
              <el-input placeholder="请输入入党日期" v-model="addAndEditUserForm.partyDate" class="wid24" size="medium"></el-input>
             </el-form-item>
          </el-col>
          <el-col :span="24" v-if="addAndEditUserForm.type!=='add'">
            <el-form-item label="正职：" prop="mainUnitmainFlag" >
              <el-radio-group v-model="addAndEditUserForm.mainUnitmainFlag">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        <hr class="splitLine">
        <div class="addUsertip">{{addAndEditUserForm.type==="add"?'主':""}}单位信息：</div>
          <el-col :span="12">
            <el-form-item :label="addAndEditUserForm.type==='add'?'主单位名称：':'单位名称：'" prop="mainUnitdepartmentId">
                <el-select filterable v-model="addAndEditUserForm.mainUnitdepartmentId" placeholder="请选择单位" size="medium">
                  <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务标签：" prop="mainUnitdutyLabel">
              <el-input v-model="addAndEditUserForm.mainUnitdutyLabel" class="wid24" size="medium" placeholder="请填写职务标签"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="职务：" prop="mainUnitdutyName" >
              <el-input v-model="addAndEditUserForm.mainUnitdutyName" size="medium" placeholder="请填写职务"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item label="正职：" prop="mainUnitmainFlag" v-if="addAndEditUserForm.type==='add'">
              <el-radio-group v-model="addAndEditUserForm.mainUnitmainFlag">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="主单位：" prop="MainUnit" v-else>
              <el-radio-group v-model="addAndEditUserForm.mainUnit">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <div v-if="addAndEditUserForm.type==='add'">
          <hr class="splitLine">
          <div class="addUsertip">
            任职其他单位信息：
            <el-button type="primary" class="iconfont icon-add" size="mini" @click="addOtherUnit"></el-button>
          </div>
          <el-table
            :data="addAndEditUserForm.otherUntis"
            style="width: 100%">
            <el-table-column
              v-for="(v,i) in otherUnitsCo1"
              :key="i"
              :prop="v.prop"
              :label="v.label"
              :width="v.width">
              <template slot-scope="scope">
                <el-select  filterable v-if="v.prop =='departmentId'" v-model="scope.row[v.prop]" placeholder="请选择单位" size="medium">
                  <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-switch
                  size="medium"
                  v-else-if="v.prop =='mainFlag'"
                  v-model="scope.row[v.prop]"
                  active-text="是"
                  inactive-text="否">
                </el-switch>
                <el-input v-else v-model="scope.row[v.prop]" size="medium"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deleteUnit(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="userDialogClose">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="addAndEditUserTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 部门排序弹窗 -->
    <el-dialog title="排序" width="510px" @close="closeDialog" v-dialogDrag :close-on-click-modal="false" :visible.sync="sortdialogFormVisible"
      class="editcom proupClass">
      <div class="sortBox">
        <el-tree :data="sortData" node-key="id" default-expand-all draggable :allow-drop="collapse" @node-drop="handleDrop">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="sortgaibianTrue">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 用户排序弹窗 -->
    <!-- <el-dialog title="排序" width="510px" @close="closeDialog" v-dialogDrag :close-on-click-modal="false" :visible.sync="userSortdialogFormVisible"
      class="editcom proupClass">
      <div class="sortBox">
        <el-tree :data="usersortData" node-key="id" default-expand-all draggable :allow-drop="usercollapse" @node-drop="userhandleDrop">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="userSortTrue">确 定</el-button>
      </div>
    </el-dialog> -->
    <!-- 关联干部人员 -->
    <el-dialog title="关联现有干部人员"
      @close="closeDialog" 
      width="750px" v-dialogDrag 
      :close-on-click-modal="false" 
      :visible.sync="linkUserInformVisible"
      class="proupClass redactuserDia">
      <div>
        <div class="addUsertip"><span class="req">*</span>为必填项</div>
        <el-form 
          :model="linkUserInform" 
          label-width="110px" 
          :rules="linkUserInformRules" 
          ref="linkUserInform">
          <el-col :span="12">
            <el-form-item label="所属单位：" prop="departmentId">
                <el-select filterable v-model="linkUserInform.departmentId" placeholder="请选择单位" size="medium">
                  <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="干部人员：" prop="peopleName">
              <!-- <el-input v-model="linkUserInform.peopleName" class="wid24" size="medium"></el-input> -->
              <el-select filterable v-model="linkUserInform.peopleName" placeholder="请选择人员" size="medium">
                <el-option
                  v-for="item in peopleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
             </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="主单位：" prop="isMainUnit" >
              <el-radio-group v-model="linkUserInform.isMainUnit">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="正职：" prop="mainFlag" >
              <el-radio-group v-model="linkUserInform.mainFlag">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务：" prop="dutyName" >
              <el-input v-model="linkUserInform.dutyName" class="wid24" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务标签：" prop="dutyLabel" >
              <el-input v-model="linkUserInform.dutyLabel" class="wid24" size="medium"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="linkUserInformBtntrue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Cryptojs from '@/assets/js/cryptojs.js'

  export default {
   
    data() {
      return {
        /**
         * 部门
         */
        clicknode: {}, //获取点击的部门节点
        yearList:[],//年度下拉框
        departTypeList:[],//部门类型
        departParams:{ //查询部门树参数
          "niandu": new Date().getFullYear(),
          "parentId": "4000000" //三处400 二处500
        },
        departmentTree:[],//部门树数据
        defaultProps: {
          children: "children",
          label: "label"
        },
        deleteDepartStatus:true,//部门删除按钮状态
        addDepartStatus: true, //部门编辑新增按钮状态
        editDepartStatus:true,
        addEditDrpartForm: { //添加&编辑部门表单
          highDepart:"",
          departName:"",
          newDepartName:"",
          departType:""
        }, 
        departDialogVisible : false,//添加编辑部门
        sortData: [], //部门排序弹窗数据
        sortdialogFormVisible: false, //部门排序窗口
        sortCan: [],
        sortChuanzhi: [],
        /**
         * 用户
         */
        params: { //查询数据传值
          name_cn: "",
          department_id: "",
          pageNum: 1,
          pageCount: 15
        },
        peopleList:[],
        firstUnit:"",
        addAndEditUserDia:false,//添加修改用户弹窗
        addAndEditUserForm: {//用户表单
          title: "添加用户",
          name:"", //干部姓名
          dutyLev:"",//职级
          sex:"男",//性别
          nation:"",//民族
          birthDate:"",//出生日期
          partyDate:"",//入党日期
          mainUnitdepartmentId:"",//单位id
          mainUnitdepartmentName:"",//单位Name
          mainUnitdutyLabel:"",//职务标签
          mainUnitdutyName:"",//职务
          mainUnitmainFlag:'否',//正职
          mainUnit:'否',//主单位
          otherUntis:[]
        }, 
        addAndEditUserFormRules:{
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          dutyLev: [
            {required: true, message: '请输入职级', trigger: 'blur'}
          ],
          mainUnitdepartmentId: [
            {required: true, message: '请选择单位名称', trigger: 'change'}
          ],
          mainUnitdutyLabel: [
            {required: true, message: '请输入职务标签', trigger: 'blur'}
          ],
          mainUnitdutyName: [
            {required: true, message: '请输入职务', trigger: 'blur'}
          ],
          mainUnitmainFlag: [
            {required: true}
          ],
          mainUnit:[
            {required: true}
          ]
        },
        otherUnitsCo1:[ //其他单位
          {
            prop:"departmentId",
            label:"单位名称",
            width:""
          },{
            prop:"dutyLabel",
            label:"职务标签",
            width:""
          },{
            prop:"dutyName",
            label:"职务",
            width:""
          },{
            prop:"mainFlag",
            label:"是否正职",
            width:""
          }
        ],
        departmentList:[],//部门列表
        scheduleLoading: true,
        userTableData: [], //查询用户表格数据
        idBatch: [], //多选用户删除
        checkmainDepart:"",
        /**
         * 关联干部
         */
        linkUserInformVisible:false,
        linkUserInform:{
          departmentId:"",
          isMainUnit:"是",
          peopleId:"",
          peopleName:"",
          mainFlag:"否",
          dutyName:"",
          dutyLabel:""
        },
        linkUserInformRules:{
          departmentId:[
            {required: true, message: '请选择单位', trigger: 'change'}
          ],
          isMainUnit:[
            {required: true, message: '请选择主单位', trigger: 'change'}
          ],
          peopleName:[
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          mainFlag:[
            {required: true, message: '请选择正职', trigger: 'change'}
          ],
          dutyName:[
            {required: true, message: '请输入职务', trigger: 'blur'}
          ],
          dutyLabel:[
            {required: true, message: '请输入职务标签', trigger: 'blur'}
          ],
        },
        total: 1, //数据总条数
        editBt: true,// 按钮状态
        
      
      }
    },

    methods: {
      /**
       * 获取年度
       */
      getNianDu(){
        this.$http.post(globalConfig.server1 + 'tDictionaryController/getListForCode', {code: "nd"}).then(res => {
          if (res.data.response_code == "0") {
            this.yearList = res.data.response_body
          }else{
            this.yearList = []
          }
        })
      },
      /**
       * 单位列表下拉
       */
      
      getdepartmentList(){
        this.$http.post(globalConfig.server1 + 'department2/select-MainDepartment',{"niandu":this.departParams.niandu,"type":"gb3_dept_"}).then(res => {
          if (res.data.code === 200) {
            this.departmentList = res.data.data

            // this.firstUnit
          }else{
            this.departmentList = []
          }
        })
      },
      /**
       * 获取部门树
       */
      getdepartAlltree(){
        this.deleteDepartStatus = true
        this.addDepartStatus = true
        this.editDepartStatus = true
        this.clicknode = {}

        let params = {
          "niandu": this.departParams.niandu,
          "parentId": this.departParams.parentId 
        }
        
        this.$http.post(globalConfig.server1 + 'department2/select-department-tree', params).then(res => {
          if (res.data.code === 200) {
            if(res.data.data.id){
              this.departmentTree = [res.data.data]
              this.firstUnit = res.data.data.id
            }
            else
              this.departmentTree = []
          } else {
            this.departmentTree = []
          }
          
        })
      },
      /**
       * 点击获取部门节点数据
       */
      getDepartnode(val) {
        console.log(val);
        this.clicknode = val
        if (val.id === "06bf3153-462e-11e9-8711-000c2952d39e") 
          this.deleteDepartStatus = true
        else
          this.deleteDepartStatus = false
        
        if (val.id) {
          this.editDepartStatus = false
          this.getDeparttype()
        }
          
        
        

        this.searchUsersInform()
      },
      /**
       * 查找部门类型
       */
      getDeparttype(){
        let params = {
          "typeId":"4000000",
          "code":this.clicknode.type
        }
        this.departTypeList = []
        this.$http.post(globalConfig.server1 + "tDictionaryController/select-by-CodeandTypeId",params).then(res => {
          if (res.data.code === 200) {
            this.departTypeList = res.data.data
            if(this.departTypeList.length > 0){
              this.addEditDrpartForm.departType = this.departTypeList[0].mainValue
              this.addDepartStatus = false
            }else{
              this.addDepartStatus = true
            }
          } else {
            this.message('error',res.data.message)
          }
        })
      },
      /**
       * 添加&修改部门
       */
      addAndEditDepart(val) {
        if (!this.clicknode.id) {
          this.message('warning','请选择部门')
          return
        }
        switch (val){
          case 'add':
          // this.getDeparttype()
          this.addEditDrpartForm = { 
            highDepart:this.clicknode.label,
            departName:"",
            newDepartName:"",
            departType:""
          }
          

          this.addEditDrpartForm.highDepartStatus = true
          this.addEditDrpartForm.departNameStatus = false
          this.addEditDrpartForm.newDepartNameStatus = false
          this.addEditDrpartForm.departTypeStatus = true

          this.addEditDrpartForm.url = "department2/insert-department"
          break;
          case 'edit':
          this.addEditDrpartForm.highDepart = this.clicknode.partmentName
          this.addEditDrpartForm.departName = this.clicknode.label
          this.addEditDrpartForm.newDepartName = ""
          this.addEditDrpartForm.departType = this.clicknode.type

          if(this.clicknode.id === "06bf3153-462e-11e9-8711-000c2952d39e"){
            this.addEditDrpartForm.highDepartStatus = false
          }
          else{
            this.addEditDrpartForm.highDepartStatus = true
          }
          
          this.addEditDrpartForm.departNameStatus = true
          this.addEditDrpartForm.newDepartNameStatus = true
          this.addEditDrpartForm.departTypeStatus = false

          this.addEditDrpartForm.url = "department2/update-department"
          break;
        }

        this.addEditDrpartForm.open = val
        this.departDialogVisible = true

      },
      /**
       * 删除部门
       */
      delDepart() {
        if (!this.clicknode.id) {
          this.message('warning',"请选择部门")
          return 
        }

        if (this.clicknode.leaf != "1") {
          this.message('error',"该部门存在子部门")
          return 
        }
        let params = {
          id: this.clicknode.id
        }

        this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          customClass: "userMangerDel",
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: "whetherh",
          closeOnClickModal: false,
          type: 'warning',
        }).then(() => {
          this.$http.post(globalConfig.server1 + 'department2/delete-department', params).then(res => {
            if (res.data.code == "200") {
              this.message('success',res.data.message)
              // this.clicknode = {}
              this.getdepartAlltree()
            } else {
              this.message('error',res.data.message)
              
            }
          })

        }).catch(() => {})

            
      },
      /**
       * 部门排序
       */
      sortClick() {
        this.sortData = JSON.parse(JSON.stringify(this.departmentTree)) 
        this.sortdialogFormVisible = true
        
      },
      collapse(moveNode, inNode, type) {
        if (moveNode.level == 3 && inNode.level == 3) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev';
          } else {}
        }
        if (moveNode.level == 4 && inNode.level == 4) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev';
          } else {}
        }
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        let arr = dropNode.parent.data.children;
        
        let arr1 = [];
        arr.forEach((item, index) => {
          let obj = {
            id: item.id,
            sort: index
          };
          arr1.push(obj);
        });
        this.sortChuanzhi = [...arr1, ...this.sortChuanzhi];
        this.sortCan = [];
        for (var i = 0; i < this.sortChuanzhi.length; i++) {
          var flag = true;
          for (var j = 0; j < this.sortCan.length; j++) {
            if (this.sortChuanzhi[i].id == this.sortCan[j].id) {
              flag = false;
            }
          }
          if (flag) {
            this.sortCan.push(this.sortChuanzhi[i]);
          }
        }
        this.sortChuanzhi = JSON.parse(JSON.stringify(this.sortCan));
      },
      sortgaibianTrue() {
        if (this.sortCan.length == 0) {
          this.sortdialogFormVisible = false;
        } else {
          this.$http
            .post(globalConfig.server1 + "department2/sort-department", this.sortCan)
            .then(res => {
              if (res.data.code == "200") {
                this.message('success', res.data.message)
                this.sortCan = [];
                this.sortdialogFormVisible = false;
                this.getdepartAlltree();
              } else {
                this.message('error', res.data.message)
              }
            });
        }
      },
      /**
       * 关闭弹窗
       */
      closeDialog() {
        this.departDialogVisible = false
        this.addEditDrpartForm = { 
          highDepart:"",
          departName:"",
          newDepartName:"",
          departType:""
        }
        this.sortdialogFormVisible = false

        this.linkUserInform = {
          departmentId:"",
          isMainUnit:"是",
          peopleId:"",
          peopleName:"",
          mainFlag:"否",
          dutyName:"",
          dutyLabel:""
        },
        this.linkUserInformVisible = false
        // $('.is-current').removeClass('is-current')
        // this.clicknode = {}
      },
      /**
       * 用户弹窗关闭
       */
      userDialogClose(){
        // this.clicknode = {}
        this.addAndEditUserDia = false
        this.addAndEditUserForm = {//用户表单
          title: "添加用户",
          name:"", //干部姓名
          dutyLev:"",//职级
          sex:"男",//性别
          nation:"",//民族
          birthDate:"",//出生日期
          partyDate:"",//入党日期
          mainUnitdepartmentId:"",//单位id
          mainUnitdepartmentName:"",//单位Name
          mainUnitdutyLabel:"",//职务标签
          mainUnitdutyName:"",//职务
          mainUnitmainFlag:'否',//正职
          mainUnit:'否',//主单位
          otherUntis:[]
        }, 
        this.$refs['addAndEditUserForm'].resetFields();
      },
      /**
       * 添加&修改部门确认
       */
      addAndEditDepartTrue() {
        var params
        if(this.addEditDrpartForm.open === "add"){
          params = {
            "leaderId": "",
            "name": this.addEditDrpartForm.departName,
            "niandu": `${this.departParams.niandu}`,
            "parentId": this.clicknode.id,
            "type": this.addEditDrpartForm.departType
          }

          if(!params.name){
            this.message('warning','请填写部门名称')
            return
          }
          if(!params.type){
            this.message('warning','请选择部门类型')
            return
          }
        }else if(this.addEditDrpartForm.open === "edit"){
          params = {
            "id": this.clicknode.id,
            "leaderId": "",
            "name": this.addEditDrpartForm.newDepartName,
            "niandu": `${this.departParams.niandu}`,
            "parentId": this.clicknode.parent_id,
            "type": this.clicknode.type
          }
        }
        

        this.$http.post(globalConfig.server1 + this.addEditDrpartForm.url, params).then(res => {
          if (res.data.code === 200) {
            this.addEditDrpartForm = { 
              highDepart:"",
              departName:"",
              newDepartName:"",
              departType:""
            }
            this.getdepartAlltree()
            this.message('success',res.data.message)
            this.departDialogVisible = false
            
          } else {
            this.message('error',res.data.message)
          }
        })
      },
      /**
       * 添加其他单位信息
       */
      addOtherUnit(){
        let oneUnit = {
          "niandu": this.departParams.niandu,
          "departmentId": "",
          "dutyName": "",
          "dutyLabel": "",
          "mainFlag": false,
          "isMainUnit": "0"
        }
        this.addAndEditUserForm.otherUntis.push(oneUnit)
      },
      /**
       * 删除其他单位信息
       */
      deleteUnit(val){
        this.$confirm('是否删除该条信息？', '提示', {
          customClass: "userMangerDel",
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: "whetherh",
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.addAndEditUserForm.otherUntis.splice(this.addAndEditUserForm.otherUntis.indexOf(val), 1);
        }).catch(() => {
        });
      },
      /**
       * 用户多选
       */
      handleSelectionChange(val) {
        if (val.length > 1 || val.length == 0) {
          this.editBt = true;
        } else {
          this.editBt = false;
        }
        this.idBatch = val;
      },
      /**
       * 添加&&修改用户弹窗
       */
      addAndEditUserClick(type,val){
        if(type === 'add'){
          this.addAndEditUserForm.title = "添加用户"
          this.addAndEditUserForm.mainUnitdepartmentId = this.clicknode.id
        }else {
          this.addAndEditUserForm.title = "编辑用户"
          this.addAndEditUserForm.id = val.id
          this.addAndEditUserForm.mainUnit = '是'
          this.$http.post(globalConfig.server1 + 'People2/select-people-ById', {"prdId":val.id}).then(res => {
              if(res.data.code === 200){
                let data = res.data.data
                
                this.addAndEditUserForm.name = data.name
                this.addAndEditUserForm.dutyLev = data.dutyLev
                this.addAndEditUserForm.sex = data.sex
                this.addAndEditUserForm.nation = data.nation
                this.addAndEditUserForm.birthDate = data.birthDate
                this.addAndEditUserForm.partyDate = data.partyDate
                this.addAndEditUserForm.mainUnitmainFlag = data.mainFlag==0?'否':'是'

                this.addAndEditUserForm.mainUnitdepartmentId = data.departmentId
                this.addAndEditUserForm.mainUnitdutyLabel = data.dutyLabel
                this.addAndEditUserForm.mainUnitdutyName = data.dutyName
                

                this.checkmainDepart = data.departmentId
                this.addAndEditUserForm.mainUnit = this.addAndEditUserForm.mainUnitdepartmentId == this.checkmainDepart?"是":"否"
              }else{
                this.message('error',res.data.message)
              }
          })
        }
        this.addAndEditUserForm.type = type
        this.addAndEditUserDia = true
      },
      /**
       * 添加修改用户确认btn
       */
      addAndEditUserTrue(){
        this.$refs['addAndEditUserForm'].validate((valid) => {
          if (valid) {
            let url = this.addAndEditUserForm.type==="add"?"People2/insert-people":"People2/update-people"
            let params

            var otherUntis = JSON.parse(JSON.stringify(this.addAndEditUserForm.otherUntis)).map(el=>{
              el.mainFlag = el.mainFlag?'1':'0'
              return el
            })
            if(this.addAndEditUserForm.type==="add"){
              params = {
                "name": this.addAndEditUserForm.name,
                "dutyLev": this.addAndEditUserForm.dutyLev,
                "birthDate": this.addAndEditUserForm.birthDate,
                "sex": this.addAndEditUserForm.sex,
                "nation": this.addAndEditUserForm.nation,
                "partyDate": this.addAndEditUserForm.partyDate,
                "otherUntis": [{
                  "niandu": this.departParams.niandu,
                  "departmentId": this.addAndEditUserForm.mainUnitdepartmentId,
                  "dutyName": this.addAndEditUserForm.mainUnitdutyName,
                  "dutyLabel": this.addAndEditUserForm.mainUnitdutyLabel,
                  "mainFlag": this.addAndEditUserForm.mainUnitmainFlag=="否"?'0':'1',
                  "isMainUnit": "1"
                },...otherUntis]
              }
            }else {

              params = {
                "prdId": this.addAndEditUserForm.id,
                "isMainUnit": this.addAndEditUserForm.mainUnit==="否"?"0":"1",
                "departmentId": this.addAndEditUserForm.mainUnitdepartmentId,
                "dutyName": this.addAndEditUserForm.mainUnitdutyName,
                "dutyLabel": this.addAndEditUserForm.mainUnitdutyLabel,
                "mainFlag": this.addAndEditUserForm.mainUnitmainFlag==="否"?"0":"1",
                "name": this.addAndEditUserForm.name,
                "dutyLev": this.addAndEditUserForm.dutyLev,
                "birthDate": this.addAndEditUserForm.birthDate,
                "sex": this.addAndEditUserForm.sex,
                "nation": this.addAndEditUserForm.nation,
                "partyDate":  this.addAndEditUserForm.partyDate
              }
              
            }
            this.$http.post(globalConfig.server1 + url, params).then(res => {
              if(res.data.code === 200){
                this.searchUsersInform()
                this.addAndEditUserDia = false
                this.message('success',res.data.message)
              }else{
                this.message('error',res.data.message)
              }
              
            })
        } else {
            return false;
          }
        });
      },
      /**
       * 查询用户信息
       */
      searchUsersInform() {
        this.scheduleLoading = true
        let params = {
          "items": {
            departmentId: this.clicknode.id||"",
            name: this.params.name_cn||"",
            type:"gb3"
          },
          "pages": {
            sortname: 'sort',
            sortorder: '',
            pageNum: this.params.pageNum,
            pageCount: this.params.pageCount,
            total: 0,
          }
        }
        
        this.$http.post(globalConfig.server1 + "People2/select-peopleByPages", params).then(res => {
            if(res.data.code === 200){
              res.data.data.list.forEach(item=>{
                item.birthDate = item.birthDate?this.$tools.formatTime(item.birthDate,'YYYY-MM-DD'):""
              })
              this.userTableData = res.data.data.list
              this.total = res.data.data.totalCount
            } 
            
            this.scheduleLoading = false
        });

      },
      /**
       * 查询所有用户
       */
      searchAllPeople(){
        this.$http.post(globalConfig.server1 + "People2/query_PeopleByDepartment", {type:"gb3",niandu:this.params.niandu||""}).then(res => {
            if(res.data.code === 200){
              console.log(res.data.data);
              this.peopleList = res.data.data
            } 
            
        });
      },
      /**
       * 删除用户
       */
      deleteUserInformItems() {
        if (this.idBatch.length != 0) {
          this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              customClass: "whetherh",
              closeOnClickModal: false,
              type: "warning"
            })
            .then(() => {
              
              let params = {
                prdIds: this.idBatch.map(el=>el.id)
              };
              this.$http.post(globalConfig.server4 + "People2/delete-people", params).then(res => {
                if (res.data.code == "200") {
                  this.message('success',res.data.message)
                 
                  this.searchUsersInform();
                } else {
                  this.message('error',res.data.message)
                  
                }
              });
            })
        } else {
          this.message('warning',"请选择需要删除的用户")
        }


      },
      /**
       * 关联用户弹窗
       */
      linkUserInformDialog(){
        this.linkUserInform.departmentId = this.clicknode.id
        this.linkUserInformVisible = true
      },
      /**
       * 关联用户确认
       */
      linkUserInformBtntrue(){
        this.$refs['linkUserInform'].validate((valid) => {
          if (valid) {
            let params = {
              "departmentId":this.clicknode.id,
              "niandu": this.departParams.niandu,
              "isMainUnit":"1",
              "peopleId":"155263756447483",
              "mainFlag":"1",
              "dutyName":"职务5555",
              "dutyLabel":"职务标签5555"
            }

            this.$http.post(globalConfig.server1 + 'insert-associatepeoples', params).then(res => {
              if(res.data.code === 200){
                $('.is-current').removeClass('is-current')
                this.linkUserInformVisible = false
                this.message('success',res.data.message)
              }else{
                this.message('error',res.data.message)
              }
              
            })
        } else {
            return false;
          }
        });
      },
      /**
       * 分页
       */
      handleSizeChange(val) {
        this.params.pageCount = val
        this.searchUsersInform();
      },
      handleCurrentChange(val) {
        this.params.pageNum = val
        this.searchUsersInform();
      },
      /**
       * 节点样式
       */
      nodeStyle(node) {
        if (node.level == 1) {
          return "firstStyle"
        } else if (node.level == 2) {
          return "secondStyle"
        }
      },
      
    },

    mounted() {
      //获取当前年份
      this.getNianDu()
      this.getdepartmentList()
      this.getdepartAlltree()
      this.searchUsersInform()
      this.searchAllPeople()
    }

  }

</script>

<style scoped lang="scss">
  .el-aside {
    min-height: 830px;
    overflow: auto;
    background-color: #EAF3FA;
    color: #333;
  }

  .el-main {
    margin: 0 !important;
    color: #333;
    margin-left: 24px !important;

  }

  .content_scroll {
    height: 100%;
    width: 337px;

  }

  .btnGroup {
    width: 100%;
    margin: 0 auto;

    .btns {
      width: 100%;
      margin: 0 auto;
      padding: 10px;
      text-align: center;

      button {
        width: 20%;
        padding: 10px;
        font-size: 16px;
        border: none;
      }
    }
  }

  .userTableTitle {
    padding: 22px 0 33px 0;
    font-size: 18px;
    font-weight: bold;
  }

  .deltip {
    color: red;
    font-size: 14px;
    padding: 12px 0;
  }

  .addUsertip {
    color: #ccc;
    font-size: 12px;
    margin-bottom: 10px;

    .req {
      color: red;
    }
    .el-button--mini {
      background-color: #1960CB;
    }
  }

  .splitLine {
    margin-bottom: 10px;
  }

  .paging {
    margin-top: 20px;
    margin-left: 30%;
    margin-bottom: 20px;
  }

  .el-button--text {
    font-size: 16px;
  }

</style>
<style lang="scss">
  #userManger2 {
    background-color: #fff;
    border-radius: 10px;
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
      font-size: 16px
    }

    .userTree .is-current>.el-tree-node__content {
      background-color: #0068d3;
      color: #fff;
    }

    .content_scroll .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .userTree {
      margin-top: 0;
      background-color: #EAF3FA;
    }

    .wid24 {
      width: 240px;
    }

    .firstStyle {
      font-size: 18px;
      line-height: 30px;
    }

    .secondStyle {
      font-size: 16px;
      line-height: 16px;
    }

    .el-form-item__label {
      font-size: 16px;
    }

    /* 弹窗顶部样式 */
    .redactuserDia {
      .el-dialog__body {
        overflow: hidden;
      }
    }
    .el-dialog__footer {
      text-align: center;

      .el-button {
        border-radius: 3px;

        &.el-button--info {
          color: #666;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(191, 191, 191, 1);
          margin-right: 24px;
        }

        &.el-button--primary {
          color: #fff;
          background: #1960CB;
        }
      }

    }

    .sortBox {
      height: 500px;
      overflow: auto;
    }


  }

  /* 删除弹窗 */
  .userMangerDel {

    /* 弹框样式 */
    &.el-message-box {

      .el-message-box__header {
        padding: 0;

        .el-message-box__title {
          height: 54px;
          line-height: 54px;
          text-align: center;
          font-weight: bold;
          background: rgba(242, 242, 242, 1);
        }
      }

      .el-message-box__content {
        padding-top: 20px;
        padding-left: 80px;
        margin-bottom: 30px;
      }

      .el-message-box__btns {
        height: 42px;
        text-align: center;
        padding: 0;
        display: flex;
        align-items: center;
        padding-bottom: 15px !important;
        justify-content: center;

        .el-button {

          width: 90px;
          height: 38px;

          border-radius: 3px;

          &:nth-of-type(1) {
            color: #333;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(191, 191, 191, 1);
            margin-right: 24px;
          }
        }



      }

    }

  }

</style>
