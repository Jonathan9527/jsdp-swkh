<template>
  <div id="ReviewGroupuser">
    <el-tabs type="border-card">
      <!-- <el-tab-pane :label="item.label" v-for="(item,index) in tabpanes" :key="index"> -->
      <el-container>
        <el-aside width="265px">

          <div class="btnGroup">
            <div class="btns">
              <el-button type="primary" class="bluebtnclass"  size="medium" @click="sortClick">排序</el-button>
              <el-button type="primary" class="bluebtnclass"  size="medium" @click="addDepart">添加</el-button>
              <el-button type="primary" class="bluebtnclass"  size="medium" @click="delDepart">删除</el-button>
              <el-button type="primary" class="bluebtnclass"  size="medium" @click="editDepart">修改</el-button>
              
            </div>
          </div>
          <el-table :highlight-current-row="true" :data="lefttredata" class="leftcebian zxgl" style="width: 100%">
            <el-table-column prop="name" class-name="displaynone">
              <template slot-scope="scope">
                <div @click="xianshi(scope)" style="cursor:pointer">{{scope.row.name}}</div>
              </template>
            </el-table-column>
          </el-table>

        </el-aside>
        <el-main style="padding: 0 15px;overflow: hidden;">
          <div class="userTableTitle">用户列表</div>
          <el-form :inline="true" class="demo-form-inline" onsubmit="return false">
              <el-form-item label="角色组：">
                <el-select v-model="params.role_flag" clearable placeholder="请选择" @change="selectjuese1" style="width:200px;">
                  <el-option v-for="item in roleGroup" :key="item.id" :label="item.mainValue" :value="item.mainValue"></el-option>
                </el-select>
              </el-form-item>
            <el-form-item label="角色：">
              <el-select @change="searchUser" v-model.trim="params.role_name" clearable size="medium" placeholder="角色名称" style="width:200px;">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
              <el-form-item label="登录账号：">
              <el-input v-model.trim="params.name" placeholder="登录账号" size="medium" style="width:150px;"></el-input>
            </el-form-item>
              <!-- <el-button type="primary" size="medium" class="iconfont icon-chaxun" @click="searchUser">&nbsp;查询</el-button> -->
              <el-button type="primary"  class="bluebtnclass" size="medium"  @click="searchUser">查询</el-button>
            </el-form-item>
            <div style="float:right">
              <el-form-item style="margin-right: 0px">
                <!-- <el-button type="primary" size="medium" class="iconfont icon-add" @click="addUser">&nbsp;添加</el-button> -->
                <el-button type="primary"  class="bluebtnclass guang" size="medium" @click="addUser">添加</el-button>

                <el-button :disabled="editBt"  class="bluebtnclass guang" size="medium" type="primary" @click="editUser(edvalue)" >编辑</el-button>
                <!-- <el-button type="primary" size="medium" class="iconfont icon-shanchu" @click="delcadAll" style="background: #f09800;border: 1px solid #f09800;">&nbsp;删除</el-button> -->
                <el-button type="primary" size="medium"  class="redsbtnclass guang" @click="delcadAll" >删除</el-button>

              </el-form-item>
            </div>
          </el-form>
          <el-table :data="userTableData" tooltip-effect="dark" style="width: 100%;margin-top:10px" border
            @selection-change="handleSelectionChange" stripe>
            <el-table-column type="selection" width="70">
            </el-table-column>
            <el-table-column label="角色组" prop="role_flag" width="200"></el-table-column>
            <el-table-column prop="role_name" label="角色名称"></el-table-column>
            <el-table-column label="姓名" prop="name_cn" width="300">
            </el-table-column>
            <el-table-column prop="departmentName" label="所属部门">
            </el-table-column>
            <!-- <el-table-column prop="duty" label="职务">
            </el-table-column> -->
            <el-table-column prop="name" label="登录账号" width="200">
            </el-table-column>
            <!-- <el-table-column prop="phone" label="手机">
            </el-table-column> -->
            <el-table-column label="启用" width="100">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" @change="kaiguan(scope.row)" active-color="#409eff"
                  inactive-color="#ccc">
                </el-switch>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editUser(scope.row)" style="color: #0841B4;background: none;"><span
                    style="border-bottom:1px solid #0841B4 ;">编辑</span></el-button>
                <el-button type="text" @click="delUser(scope.row)" style="color: #f09800;background: none;"><span style="border-bottom:1px solid #f09800 ;">删除</span></el-button>
              </template>
            </el-table-column> -->
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
      <!-- </el-tab-pane> -->
    </el-tabs>
    <!-- 新增弹窗 -->
    <el-dialog title="添加考核组部门" :close-on-click-modal="false" :visible.sync="addDepartDialogVisible" width="600px" class="proupClass">
      <div>
        <el-form label-width="120px">
          <el-form-item label="考核组名称：" required>
            <el-input placeholder="请输入考核组名称" v-model="commName" clearable>
            </el-input>
          </el-form-item>
          <div class="selectdanweibox">
            <p class="selecttoptitles">选择被考核单位</p>
            <!-- <el-table  max-height="300" :data="assessmentUnit" tooltip-effect="dark" border style="width: 100%"
              @selection-change="unitchange">
              <el-table-column type="selection" width="80">
              </el-table-column>
              <el-table-column prop="name" label="考核被单位名称">
              </el-table-column>
            </el-table> -->
            <el-tree ref="addTreeData" :data="treedata" node-key="id" :props="departProps" show-checkbox></el-tree>

          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding"  @click="kaoheBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog title="删除部门" :close-on-click-modal="false" :visible.sync="delDepartDialogVisible" width="410px" class="proupClass">
      <div>
        <div class="deltip">*提示：需要删除的部门下面不能有子部门或人员！</div>
        <el-form :model="addDrpartForm" label-width="80px">
          <el-form-item label="选择部门：">
            <el-select v-model="addDrpartForm.department" placeholder="请选择" size="medium">
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="delDe">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改部门弹窗 -->
    <el-dialog title="修改部门" :close-on-click-modal="false" :visible.sync="editDepartDialogVisible" width="600px" class="proupClass">
      <div>
        <el-form label-width="120px">
          <el-form-item label="考核组名称：" required class="xg">
            <el-input placeholder="请输入内容" v-model="commName" clearable>
            </el-input>
          </el-form-item>
          <div class="selectdanweibox">
            <p class="selecttoptitles">选择被考核单位</p>
            <!-- <el-table ref="selectdepartTable" max-height="300" :data="assessmentUnit" tooltip-effect="dark" border style="width: 100%"
              @selection-change="unitchange" >
              <el-table-column type="selection" width="80">
              </el-table-column>
              <el-table-column prop="name" class="khg" label="考核被单位名称">
              </el-table-column>
            </el-table> -->
            <el-tree ref="departTree" :data="treedata" node-key="id" :props="departProps" show-checkbox></el-tree>

          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding"  @click="xiugaiBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :close-on-click-modal="false" :visible.sync="addUserDialogVisible" width="750px" class="proupClass">
      <div>
        <div class="addUsertip"><span class="req">*</span>为必填项</div>
        <el-form :model="addUserForm" label-width="110px">
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input v-model="addUserForm.name_cn" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择部门：" required>
              <el-select v-model="selectKaohe" clearable filterable placeholder="请选择" size="medium">
                <el-option v-for="item in sectionOptions" :key="item.value" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="职务：">
              <el-input v-model="addUserForm.duty" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机：" required>
              <el-input v-model="addUserForm.phone" size="medium"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="登录账号：" required>
              <el-input v-model="addUserForm.name" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录密码：" required>
              <el-input v-model="addUserForm.password" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色组：" required>
              <el-select v-model="addUserForm.role_flag" placeholder="请选择" @change="selectjuese">
                <el-option
                  v-for="item in roleGroup"
                  :key="item.id"
                  :label="item.mainValue"
                  :value="item.mainValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色：" required>
              <el-select
                v-model="addUserForm.role_id"
                placeholder="请选择"
                size="medium"
                @change="edrolexiala"
              >
                <el-option
                  v-for="item in jueseOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：" required>
              <el-switch v-model="addUserForm.status" active-text="启用" inactive-text="未启用" active-color="#409eff"
                inactive-color="#ccc"></el-switch>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary"  class="proupbtnqueding"  @click="addensure('addUserForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑用户弹窗-->
    <el-dialog title="编辑用户" :close-on-click-modal="false" :visible.sync="editUserDialogVisible" width="750px"  class="proupClass">
      <div>
        <div class="addUsertip"><span class="req">*</span>为必填项</div>
        <el-form :model="editUserForm" label-width="110px">
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input v-model="editUserForm.name_cn" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择部门：" required>
              <el-select v-model="editUserForm.department_id" placeholder="请选择" size="medium">
                <el-option v-for="item in sectionOptions" :key="item.value" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录账号：" required>
              <el-input v-model="editUserForm.name" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录密码：" required>
              <el-input v-model="editUserForm.password" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色组：" required>
              <el-select v-model="editUserForm.role_flag" placeholder="请选择" @change="selectjuese">
                <el-option
                  v-for="item in roleGroup"
                  :key="item.id"
                  :label="item.mainValue"
                  :value="item.mainValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色：" required>
              <el-select
                v-model="editUserForm.role_id"
                placeholder="请选择"
                size="medium"
                @change="rolexiala"
              >
                <el-option
                  v-for="item in jueseOptions2"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：" required>
              <el-switch v-model="editUserForm.status" active-text="启用" inactive-text="未启用" active-color="#409eff"
                inactive-color="#ccc">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao"  @click="closeDialog">取 消</el-button>
        <el-button type="primary"  class="proupbtnqueding"  @click="editBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 排序弹窗 -->
    <el-dialog title="排序" width="500px" :close-on-click-modal="false" :visible.sync="sortdialogFormVisible" class="editcom proupClass">
      <div class="sortBox">
        <el-tree :data="sortData" :prop="defaultProps" ref="tree" node-key="id" default-expand-all draggable
          :allow-drop="collapse" @node-drop="handleDrop">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  class="proupbtnquxiao"  @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="sortgaibianTrue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Cryptojs from '@/assets/js/cryptojs.js'

  export default {
    props: ['activeName'],
    data() {
      return {
        selectKaohe: "",
        treedata: [],
        commName: '', //考核组名称
        commNameId: "", //考核组单位
        assessmentUnit: [], //选择考核组
        addDepartDialogVisible: false, //添加部门弹窗
        delDepartDialogVisible: false, //删除部门弹窗
        editDepartDialogVisible: false, //修改部门弹窗
        addUserDialogVisible: false, //添加用户弹窗
        editUserDialogVisible: false, //编辑用户弹窗
        sortdialogFormVisible: false, //单位排序隐藏
        addDrpartForm: {}, //添加部门表单
        editDrpartForm: {}, //修改部门表单
        addUserForm: {
          status: true
        }, //添加用户表单
        editUserForm: {}, //编辑用户表单
        lefttredata: [], //左边侧边栏
        params: { //数据传值
          bianhao: "3",
          name_cn: "",
          department_id: "",
          pageNum: 1,
          pageCount: 15,
          role_name: "",
          // 需要修改的数据
          edvalue:{},
          // 按钮状态
          editBt:false
        },
        jueseOptions: [],
        jueseOptions2: [],
        sectionOptions: [], //添加部门下拉框数据
        roleOptions: [], //角色下拉框
        total: 1, //数据总条数
        idBatch: [], //多选框
        idpuopcheck: [], //多选框
        tabpanes: [{
          label: '考核用户'
        }, {
          label: '被考核用户'
        }, {
          label: '考核组用户'
        }],
        departmentOptions: [],
        userName: "", //查询用户名称
        currentPage: 1, //当前页码

        userTableData: [],
        sortData: [],
        defaultProps: {
          children: 'children',
          label: "label",
          id: "sort"
        },
        departProps: {
          children: 'children',
          label: "label",
          id: "id"
        },
        sortChuanzhi: [],
        sortCan: [],
        // 右侧显示数据
        rightData:[],
        // multipleSelection: []
        // 需要修改的数据
        edvalue:{},
        // 按钮状态
        editBt:true,
        // 角色组
        roleGroup: [],
        jscount: 1,
        // 点击的exam_type
        etype:"",
        // 父节点parent_id
        uWrapId:"",
        cnCount:0
      }
    },
    watch: {
      activeName(val) {
        this.searchUser()
      }
    },
    methods: {
      //遍历树 -- 获取树的
      getTreeID(data) {
        function getId(data) {
          for (var i in data) {
            if (data[i].children.length !== 0) {
              data[i].disabled = true
              getId(data[i].children)
            }
          }
        }
        getId(data)
      },
      //获取部门
      getsortData() {

        this.$http.post(globalConfig.server1 + 'department/selectExamTypeBySort',).then(res => {
          if (res.data.response_code === "0") {

            let arr = res.data.response_body
            this.getTreeID(arr)
            this.treedata = arr
            if (this.commNameId) {
              this.selectDepart(this.commNameId)
            }
          } else {
            this.prompt('warning', res.data.response_body)
          }
        })
      },
      nodeStyle(node) {
        if (node.level == 1) {
          return "firstStyle"
        } else if (node.level == 2) {
          return "secondStyle"
        }
      },
      // guanbi(){
      //   this.$refs.departTree.setCheckedKeys([])
      // },
      // 查询角色组
      addjuesezu() {
        let params = {
          code: "7"
        };
        this.$http
          .post(
            globalConfig.server1 + "tDictionaryController/getListForCode",
            params
          )
          .then(res => {
            if (res.data.response_code === "0") {
              this.roleGroup = res.data.response_body;
            } else {
              this.roleGroup = [];
            }
          });
      },
      // 查询角色
      selectjuese() {
        this.addUserForm.role_id=""
        this.editUserForm.role_id=""
        this.jscount = 1;
        this.rolexiala();
        this.edrolexiala();
      },
      
      //角色下拉
      rolexiala() {
        let params = {
          role_flag: this.addUserForm.role_flag
        };
        this.$http.post(globalConfig.server3 + 'role/selectRoles',params).then(res => {
          if (res.data.response_code == "0") {
            this.jueseOptions = res.data.response_body
            if (this.jscount == 1) {
              this.addUserForm.role_id = this.jueseOptions[0].id;
            }
            this.jscount++;
          } else {
            this.jueseOptions = []
          }
        })
      },
      //编辑角色下拉
      edrolexiala() {
        let params = {
          role_flag: this.editUserForm.role_flag
        };

        this.$http
          .post(globalConfig.server3 + "role/selectRoles", params)
          .then(res => {
            if (res.data.response_code == "0") {
              console.log(res.data.response_body);

              this.jueseOptions2 = res.data.response_body;
              if (this.jscount == 1) {
                this.editUserForm.role_id = this.jueseOptions2[0].id;
              }
              this.jscount++;
            } else {
              this.jueseOptions2 = [];
            }
          });
      },
      //开关
      kaiguan(val) {
        if (val.status) {
          val.status = 1
        } else {
          val.status = 0
        }
        let params = {
          "id": val.id,
          "status": val.status
        }
        this.$http.post(globalConfig.server1 + 'user/updateUser', params).then(res => {

          if (res.data.response_code === '0') {
            this.searchUser()
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            });
          }

        })
      },
      //增加弹窗表格监听
      unitchange(val) {
        this.idpuopcheck = val
      },
      kaoheBtn() {
        let arr = this.$refs.addTreeData.getCheckedKeys()
        if (arr.length != 0) {
          // let arr = []
          // this.idpuopcheck.forEach((item) => {
          //   arr.push(item.id)
          // })
          let params = {
            name: this.commName,
            examed_depids: arr,
            exam_type:"exam_groupdept"
          }
          this.$http.post(globalConfig.server1 + 'department/insertKaohezu', params).then(res => {
            if (res.data.response_code === '200') {
              this.$message({
                message: '新增成功',
                type: 'success'
              });
              this.getdepartTree()
              this.sectionQuery()
              this.addDepartDialogVisible = false
              this.commName=""
            } else {
              this.$message({
                message: '新增失败',
                type: 'error'
              });
              this.commName=""
            }

          })
        } else {
          this.$message({
            message: '请选择被考核单位',
            type: 'warning'
          });
        }
      },

      // LeafNode() {
      //   this.$http.post(globalConfig.server1 + 'department/selectbeExamed', {}).then(res => {
      //     if (res.data.response_code === '200') {
      //       this.assessmentUnit = res.data.response_body
      //       if(this.commNameId){
      //         this.selectDepart(this.commNameId)
      //       }

      //     } else {

      //     }

      //   })
      // },

      handleSelectionChange(val) {
        this.edvalue=val[0]
        
        if (val.length>1|| val.length == 0) {
          this.editBt=true
        }else{
          this.editBt=false
          
        }
        this.idBatch = val
      },
      handleSizeChange(val) {
        this.params.pageCount = val
        this.searchUser();
      },
      handleCurrentChange(val) {
        this.params.pageNum = val
        this.searchUser();
      },
      closeDialog() {
        this.sortdialogFormVisible = false
        this.addDepartDialogVisible = false
        this.delDepartDialogVisible = false
        this.editDepartDialogVisible = false
        this.addUserDialogVisible = false
        this.editUserDialogVisible = false
        this.addDrpartForm.department = "";
      },
      addDepart() { //添加部门
        this.assessmentUnit = []
        this.addDepartDialogVisible = true
        this.commName=""
        this.addUserForm.status= true
        setTimeout(function () {
          // this.LeafNode()
          this.getsortData()
        }.bind(this), 0)
      },
      delDepart() { 
        //删除部门
        this.departmentOptions = [];
        this.delDepartDialogVisible = true;
        
        var tj = {}
        for (let i = 0; i < this.lefttredata.length; i++) {
          tj = {
            value: this.lefttredata[i].id,
            label: this.lefttredata[i].name
          }
          this.departmentOptions.push(tj)
        }
      },
      // 确认删除
      delDe() {
        this.delDepartDialogVisible = false;
        var wQuery = {
          // 父级id
          "id": this.addDrpartForm.department,
        }
        this.$http.post(globalConfig.server1 + 'user/deleteDepartment', wQuery).then(res => {

          if (res.data.response_desc == "存在子节点") {
            this.$message({
              message: '删除失败',
              type: 'error'
            });
          } else if (res.data.response_code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            //考核单位树
            this.getdepartTree();
            this.sectionQuery()
            this.addDrpartForm.department = "";
          }
        })
      },
      // 修改部门
      xianshi(item) {
        // 点击时先将右侧数据清空
        this.userTableData = []
        
        this.total = 0;

        // 添加数据
        for (let i = 0; i < this.rightData.length; i++) {
          if (item.row.id == this.rightData[i].department_id) {
            this.userTableData.push(this.rightData[i])
            this.total = this.userTableData.length
          }
        }


        this.commName = item.row.name;
        this.commNameId = item.row.id;
        this.selectKaohe = item.row.id
        this.cnCount=1
        console.log(item);
        
        // this.uWrapId
      },
      editDepart() { //编辑部门
      if (this.cnCount==0) {
          this.$message({
            type: 'error',
            message: '请选择需要修改的考核组'
          });
          return
        }else{
          this.assessmentUnit = []
          this.editDepartDialogVisible = true
          setTimeout(function () {
            // this.LeafNode()
            this.getsortData()
          }.bind(this), 0)
        }
      },
      //查询部门
      selectDepart(val) {
        let params = {
          id: val
        }
        this.$http.post(globalConfig.server1 + 'user/selectDepartmenByKhz', params).then(res => {
          if (res.data.response_code === '200') {
            let arr = res.data.response_body
            let selectArr = []
            if (arr.length != 0) {
              arr.forEach(item => {
                // this.assessmentUnit.forEach(val=>{
                //   if(item.id==val.id){
                //     selectArr.push(val)
                //   }
                // })
                // selectArr.push(item.id)
                this.$refs.departTree.setChecked(item.id, true)
              })
              // selectArr.forEach(row=>{

              // })
              // this.$refs.departTree.setCheckedKeys(selectArr)
            }
            // this.$refs.departTree.setCheckedKeys(selectArr)
          } else {

          }

        })
      },
      // 确认修改
      xiugaiBtn() {
        let arr1 = this.$refs.departTree.getCheckedKeys()
        if (arr1.length != 0) {
          // let arr = []
          // this.idpuopcheck.forEach((item) => {
          //   arr.push(item.id)
          // })
          let params = {
            name: this.commName,
            examed_depids: arr1,
            id: this.commNameId,
            exam_type:"exam_groupdept"
          }

          this.$http.post(globalConfig.server1 + 'user/selectDepartmentkhzdybkhbm', params).then(res => {
            if (res.data.response_code === '200') {
              this.cnCount=0
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              
              
              this.getdepartTree()
              this.sectionQuery()

              this.editDepartDialogVisible = false
              this.$refs.departTree.setCheckedKeys([])
            } else {
              this.$message({
                message: '修改失败',
                type: 'error'
              });
            }

          })
        } else {
          this.$message({
            message: '请选择被考核单位',
            type: 'warning'
          });
        }
      },
      selectjuese1(){
        this.roleQuery()
        this.params.role_name=""
      },

      addUser() { //添加用户
        this.addUserDialogVisible = true
        this.sectionQuery();
        this.addUserForm={}
        this.addUserForm.status = true
        // this.rolexiala()
      },
      addensure() {
        if (this.addUserForm.status) {
          this.addUserForm.status = 1
        } else {
          this.addUserForm.status = 0
        }
        this.addUserForm.department_id = this.selectKaohe
        let pwd = Cryptojs.Encrypt(this.addUserForm.password)
        this.addUserForm.password = pwd

        let params = JSON.parse(JSON.stringify({ ...this.addUserForm
        }))
        params.password = pwd

        this.$http.post(globalConfig.server1 + 'user/insertUser', params).then(res => {
          if (res.data.response_code === '0') {
            this.searchUser()
            this.addUserForm = {}
            this.addUserDialogVisible = false
            this.$message({
              message: res.data.response_body,
              type: 'success'
            });
          } else {
            this.$message({
              message: res.data.response_body,
              type: 'error'
            });
          }

        })
      },
      //编辑用户
      editUser(val) {
        
        if (Object.keys(val).length) {
          this.editUserForm = JSON.parse(JSON.stringify(val))
          this.editUserDialogVisible = true
          // this.rolexiala()
          this.sectionQuery();
          this.edrolexiala();
        }else{
          this.$message({
              message: '请先选择需要编辑的用户',
              type: 'error'
            })
        }
      },
      editBtn() {
        if (this.editUserForm.status) {
          this.editUserForm.status = 1
        } else {
          this.editUserForm.status = 0
        }

        let params = JSON.parse(JSON.stringify({ ...this.editUserForm
        }))
        if (this.editUserForm.password) {
          let pwd = Cryptojs.Encrypt(this.editUserForm.password)
          params.password = pwd
        }

        this.$http.post(globalConfig.server1 + 'user/updateUser', params).then(res => {
          if (res.data.response_code === '0') {
            this.searchUser()
            this.$message({
              type: 'success',
              message: res.data.response_body
            });
            this.editUserDialogVisible = false
            this.editUserForm = {}
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            });
          }

        })

      },
      //删除用户
      delUser(val) {
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass:'whetherh',
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          let params = {
            isdelete: 1,
            id: val.id
          }
          this.$http.post(globalConfig.server1 + 'user/updateUser', params).then(res => {
            if (res.data.response_code === '0') {
              this.searchUser()
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
            } else {
              this.$message({
                type: 'error',
                message: '刪除失败！'
              });
            }

          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //全部删除用户
      delcadAll() {
      if (this.idBatch.length != 0) {
        this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          customClass: "whetherh",
          closeOnClickModal:false,
          type: "warning"
        })
          .then(() => {
            
            
            let arr = [];
            this.idBatch.forEach(item => {
              arr.push(item.id);
            });

            let params = {
              idMsg: arr,
              isdelete: "1"
            };
            

            this.$http
              .post(globalConfig.server1 + "user/deleteUsers", params)
              .then(res => {
                if (res.data.response_code === "0") {
                  this.searchUser();
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                } else {
                }
              });
          })
          .catch(() => {
            // this.$message({
            //   type: "info",
            //   message: "已取消删除"
            // });
          });
      } else {
        this.$message({
          message: "请选择需要删除的用户",
          type: "warning"
        });
      }
    },
      //表单搜索
      searchUser() {
        this.$http.post(globalConfig.server2 + 'user/getUserByPage', this.params).then(res => {
          if (res.data.response_code === '0') {

            this.userTableData = res.data.response_body.list
            this.userTableData.map(item => {
              if (item.status == "0") {
                item.status = false
              } else if (item.status == '1') {
                item.status = true
              }
            })
            this.rightData = this.userTableData
            this.total = res.data.response_body.totalCount
            // this.total = 1
          } else {

          }

        })
      },
      //角色查询
      roleQuery() {
        let params = {
          "name": "",
          "status": "",
          "pageNum": "1",
          "pageCount": "100",
          role_flag:this.params.role_flag
        }
        this.$http.post(globalConfig.server1 + 'role/getRoleByPage', params).then(res => {
          if (res.data.response_code === '0') {
            this.roleOptions = res.data.response_body.list
          } else {

          }
        })
      },
      //表单下拉框数据
      sectionQuery() {
        let params = {
          "eaxm_type": "exam_groupdept"
        }
        this.$http.post(globalConfig.server1 + 'user/getDepartmentByUser', params).then(res => {
          if (res.data.response_code === '0') {
            this.sectionOptions = res.data.response_body
          } else {

          }
        })
      },
      //考核单位树
      getdepartTree() {
        let params = {
          exam_type: "exam_groupdept"
        }
        this.$http.post(globalConfig.server1 + 'department/getDepartmentKaoHeZu', params).then(res => {

          if (res.data.response_code === '0') {
            this.lefttredata = res.data.response_body
            let arr = JSON.parse(JSON.stringify(res.data.response_body))
            this.sortData = []
            arr.map(item => {
              let obj = {
                indexid: item.id,
                label: item.name,
                sort: item.sort
              }
              this.sortData.push(obj)
            })
          } else {

          }
        })
      },
      // 排序
      sortClick() {
        this.sortdialogFormVisible = true
        this.getdepartTree()
      },
      collapse(moveNode, inNode, type) {
        if (moveNode.level == 1 && inNode.level == 1) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev';
          } else {}
        }
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        let arr = dropNode.parent.data
        let arr1 = []
        arr.forEach((item, index) => {
          let obj = {
            id: item.indexid,
            label: item.label,
            sort: index
          }
          arr1.push(obj)
        })
        this.sortChuanzhi = [...arr1, ...this.sortChuanzhi]
        this.sortCan = []
        for (var i = 0; i < this.sortChuanzhi.length; i++) {
          var flag = true;
          for (var j = 0; j < this.sortCan.length; j++) {
            if (this.sortChuanzhi[i].id == this.sortCan[j].id) {
              flag = false;
            };
          };
          if (flag) {
            this.sortCan.push(this.sortChuanzhi[i]);
          };
        };
        this.sortChuanzhi = JSON.parse(JSON.stringify(this.sortCan))
      },
      sortgaibianTrue() {
        if (this.sortCan.length == 0) {
          this.sortdialogFormVisible = false
        } else {
          this.$http.post(globalConfig.server1 + 'department/updateSortById', this.sortCan).then(res => {
            if (res.data.response_code === "0") {
              this.$message({
                message: res.data.response_body,
                type: 'success'
              });
              this.sortCan = []
              this.sortdialogFormVisible = false
              this.getdepartTree()
            } else {
              this.prompt('warning', res.data.response_body)
            }
          })
        }
      },

    },

    mounted() {
      this.getdepartTree()
      this.searchUser()
      this.roleQuery()
      this.sectionQuery()
      // this.LeafNode()
      this.rolexiala()
      this.addjuesezu();
    }

  }

</script>

<style scoped lang="scss">
  .icon-chaxun {
    margin-left: 10px;
  }

  .btnGroup {
    width: 100%;
    padding: 5% 0;
    display: inline-block;
    margin: 0 auto
  }

  .btns {
    width: 100%;
    margin: 10px auto;
    padding: 0 5px;
    text-align: center;
  }

  .btns button {
    width: 19%;
    padding: 5px;
    text-align: center
  }

  .selectdanweibox {
    max-height: 500px;
    overflow: auto;

    .selecttoptitles {
      padding: 10px 22px;
      font-size: 16px;
      background: #cccccc;
      color: #333
    }
  }

  .el-table tr {
    background: red !important;
  }

  .el-aside {
    background-color: #EAF3FA;
    color: #333;
  }

  .el-main {
    margin: 0 !important;
    color: #333;
  }

  .userTableTitle {
    padding: 10px 0;
    font-size: 20px;
    margin-bottom: 20px;
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
  }


  .paging {
    margin-top: 20px;
    margin-left: 30%;
  }

  .el-button--text {
    font-size: 16px;
  }

  .selectdanweibox>.selecttoptitles {
    background: none !important;
    font-weight: bold;
    margin-bottom: 20px;
    font-size: 18px;
    padding-bottom: 0px !important;
  }

  .el-table_5_column_22>.cell {
    font-weight: normal !important;
  }

</style>
<style lang="scss">
  #ReviewGroupuser {
    .guang.el-button{
      margin-left:4px;
    }
    .el-form--inline .el-form-item{
      margin-right:5px
    }
    .el-dialog__body {
      overflow: auto;
      max-height: 550px;
    }
    .userTree {
      margin-top: 20px;
      background-color: #EAF3FA;
    }

    .firstStyle {
      font-size: 16px;
      line-height: 30px;
      font-weight: 600;
    }

    .secondStyle {
      font-size: 16px;
      line-height: 30px;
    }

    .el-form-item__label {
      font-size: 16px;
    }
    .el-form{
      overflow: hidden;
    }
    .el-tabs--border-card>.el-tabs__content {
      padding: 0;
    }

    .el-tabs--border-card>.el-tabs__header {
      border-bottom: 0;
    }

    .el-tabs--border-card {
      border: 0;
    }

    .has-gutter {
      .displaynone {
        display: none;
      }
    }

    .zxgl .current-row>td {
      color: #fff;
      background-color: rgb(64, 158, 255) !important;
    }



  }

</style>
