<template>
  <div id="AssessedUser">
    <el-tabs type="border-card">
      <!-- <el-tab-pane :label="item.label" v-for="(item,index) in tabpanes" :key="index"> -->
      <el-container>
        <el-aside width="265px">
          <el-scrollbar class="content_scroll">
            <div class="btnGroup">
              <div class="btns">
                <el-button type="primary" class="bluebtnclass" size="medium" @click="sortClick">排序</el-button>
                <el-button type="primary" class="bluebtnclass" size="medium" @click="addcom" :disabled="tjan">添加</el-button>
                <el-button type="primary" class="bluebtnclass" size="medium" @click="delWrap">删除</el-button>
                <el-button type="primary" class="bluebtnclass" size="medium" @click="update">修改</el-button>
               
              </div>
            </div>
          </el-scrollbar>
          <el-tree :highlight-current="true" :expand-on-click-node="false" class="userTree zxgl" :data="userTreeData"
            :props="defaultProps" style="margin-top:10px" @node-click="huoqujiedian" node-key="id" :default-expanded-keys=scarr2 >
            <span slot-scope="{ node, data }" :class="nodeStyle(node)">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
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
              <el-select v-model.trim="params.role_name" clearable size="medium" placeholder="角色名称" style="width:200px;" >
                <el-option v-for="item in roleOptions" :key="item.value" :label="item.name" :value="item.name"></el-option>
              </el-select>
              <el-form-item label="登录账号：">
                <el-input v-model.trim="params.name" placeholder="登录账号" size="medium" style="width:150px;"></el-input>
              </el-form-item>
              <!-- <el-button type="primary" size="medium" class="iconfont icon-chaxun" @click="searchUser">&nbsp;查询</el-button> -->
              <el-button type="primary" class="bluebtnclass" size="medium" @click="searchUser">查询</el-button>
            </el-form-item>
            <div style="float:right">
              <el-form-item style="margin-right: 0px">
                <el-button type="primary" size="medium" @click="addUser" class="bluebtnclass guang">添加</el-button>
                <!-- <el-button type="primary" size="medium" class="iconfont icon-add" @click="addUser">&nbsp;添加</el-button> -->
                <el-button :disabled="editBt" size="medium" type="primary" class="bluebtnclass guang" @click="editUser(edvalue)"
                  >编辑</el-button>
                <el-button type="primary" size="medium" @click="delcadAll" class="redsbtnclass guang" >删除</el-button>
                <!-- <el-button type="primary" size="medium" class="iconfont icon-shanchu" @click="delcadAll" style="background: #f09800;border: 1px solid #f09800;">&nbsp;删除</el-button> -->
              </el-form-item>
            </div>
          </el-form>
          <el-table ref="multipleTable" :data="userTableData" tooltip-effect="dark" style="width: 100%;margin-top:10px"
            border="" @selection-change="handleSelectionChange" stripe>
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column label="角色组" prop="role_flag" width="200"></el-table-column>
            <el-table-column prop="role_name" label="角色名称"></el-table-column>
            <el-table-column label="姓名" prop="name_cn" width="300"></el-table-column>
            <el-table-column prop="departmentName" label="所属部门"></el-table-column>
            <!-- <el-table-column prop="duty" label="职务">
            </el-table-column>-->
            <el-table-column prop="name" label="登录账号" width="200"></el-table-column>
            <!-- <el-table-column prop="phone" label="手机">
            </el-table-column>-->
            <el-table-column label="启用" width="100">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" @change="kaiguan(scope.row)" active-color="#409eff"
                  inactive-color="#ccc"></el-switch>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editUser(scope.row)" style="color: #0841B4;background: none;"><span
                    style="border-bottom:1px solid #0841B4 ;">编辑</span></el-button>
                <el-button type="text" @click="delUser(scope.row)" style="color: #f09800;background: none;"><span style="border-bottom:1px solid #f09800 ;">删除</span></el-button>
              </template>
            </el-table-column>-->
          </el-table>
          <!-- 分页 -->
          <div class="paging">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pageNum"
              :page-sizes="[15, 30, 50,100,]" :page-size="params.pageCount" layout="total, sizes, prev, pager, next, jumper"
              :total="total"></el-pagination>
          </div>
        </el-main>
      </el-container>
      <!-- </el-tab-pane> -->
    </el-tabs>
    <!-- 添加社区市 -->
    <el-dialog title="新增被考核单位" :close-on-click-modal="false"  width="410px" :visible.sync="adddialogFormVisible" class="addcom proupClass">
      <div class="addUser" style="color:red;">
        <span class="req">*</span>为必填项
      </div>
      <el-form ref="form" label-width="120px" :model="addcompanyForm">
        <el-form-item label="单位类型：">
          <!-- <el-select v-model="addcompanyForm.parent_id" clearable placeholder="请选择单位类型">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>-->
          <span style="font-size:18px;">{{addcompanyForm.parent_name}}</span>
          <!-- <el-input type="text" v-model="addcompanyForm.parent_name" disabled></el-input> -->
        </el-form-item>
        <el-form-item label="单位名称：" required>
          <el-input autocomplete="off" clearable v-model="addcompanyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="机关类型：" required v-if="addcompanyForm.parent_name == '省直机关'">
          <el-select v-model="addcompanyForm.sz_type" clearable placeholder="请选择机关类型">
            <el-option v-for="item in jiguanoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog2">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="addcompany">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增弹窗 -->
    <el-dialog title="添加部门"  :close-on-click-modal="false"  :visible.sync="addDepartDialogVisible" width="410px" class="proupClass">
      <div>
        <el-form :model="addDrpartForm" label-width="120px">
          <el-form-item label="上级部门：">
            <el-select v-model="addDrpartForm.department" placeholder="请选择" size="medium">
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门名称：" required>
            <el-input v-model="addDrpartForm.departName" class="addbumen" size="medium"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="addDepartDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog title="删除部门"  :close-on-click-modal="false"  :visible.sync="delDepartDialogVisible" width="410px" class="proupClass">
      <div>
        <div class="deltip">*提示：需要删除的部门下面不能有子部门或人员！</div>
        <el-form :model="addDrpartForm" label-width="120px">
          <el-form-item label="选择部门：">
            <el-select v-model="addDrpartForm.department" placeholder="请选择" size="medium">
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="delDepartDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改部门弹窗 -->
    <el-dialog title="修改部门"  :close-on-click-modal="false"  :visible.sync="editDepartDialogVisible" width="410px" class="proupClass">
      <div class="addUser">
        <span class="req">*</span>为必填项
      </div>
      <el-form ref="form" label-width="120px" :model="editcompanyForm">
        <el-form-item label="单位类型：">
          <!-- <el-input type="text" v-model="editcompanyForm.parent_name" disabled></el-input> -->
          <span style="font-size:18px;">{{editcompanyForm.parent_name}}</span>
          <!-- <span style="font-size:18px;">{{123}}</span> -->
        </el-form-item>
        <el-form-item label="单位名称：" required>
          <el-input autocomplete="off" clearable v-model="editcompanyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="机关类型：" required v-if="editcompanyForm.parent_name == '省直机关'">
          <el-select v-model="editcompanyForm.sz_type" clearable placeholder="请选择机关类型">
            <el-option v-for="item in jiguanoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="edqr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :close-on-click-modal="false"  :visible.sync="addUserDialogVisible" width="750px" class="proupClass">
      <div>
        <div class="addUsertip">
          <span class="req">*</span>为必填项
        </div>
        <el-form :model="addUserForm" label-width="110px">
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input v-model="addUserForm.name_cn" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择部门：" required>
              <el-select v-model="selectshequshi" clearable filterable placeholder="请选择" size="medium">
                <el-option v-for="item in sectionOptions" :key="item.value" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
                <el-option v-for="item in roleGroup" :key="item.id" :label="item.mainValue" :value="item.mainValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色：" required>
              <el-select v-model="addUserForm.role_id" placeholder="请选择" size="medium" @change="edrolexiala">
                <el-option v-for="item in jueseOptions" :key="item.value" :label="item.name" :value="item.id"></el-option>
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
        <el-button type="primary" class="proupbtnqueding" @click="addensure('addUserForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑用户弹窗-->
    <el-dialog title="编辑用户" :close-on-click-modal="false"  :visible.sync="editUserDialogVisible" width="750px" class="proupClass">
      <div>
        <div class="addUsertip">
          <span class="req">*</span>为必填项
        </div>
        <el-form :model="editUserForm" label-width="110px">
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input v-model="editUserForm.name_cn" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择部门：" required>
              <el-select v-model="editUserForm.department_id" placeholder="请选择" size="medium">
                <el-option v-for="item in sectionOptions" :key="item.value" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="职务：">
              <el-input v-model="editUserForm.duty" size="medium"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机：" required>
              <el-input v-model="editUserForm.phone" size="medium"></el-input>
            </el-form-item>
          </el-col>-->
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
                <el-option v-for="item in roleGroup" :key="item.id" :label="item.mainValue" :value="item.mainValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色：" required>
              <el-select v-model="editUserForm.role_id" placeholder="请选择" size="medium" @change="rolexiala">
                <el-option v-for="item in jueseOptions2" :key="item.value" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：" required>
              <el-switch v-model="editUserForm.status" active-text="启用" inactive-text="未启用" active-color="#409eff"
                inactive-color="#ccc"></el-switch>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="editBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 排序弹窗 -->
    <el-dialog title="排序" width="500px" :close-on-click-modal="false" :visible.sync="sortdialogFormVisible" class="editcom proupClass">
      <div class="sortBox">
        <el-tree :data="sortData" ref="tree" node-key="id" default-expand-all draggable="" :allow-drop="collapse"
          @node-drop="handleDrop"></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="sortgaibianTrue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Cryptojs from "@/assets/js/cryptojs.js";

  export default {
    props: ["activeName"],
    data() {
      return {
        selectshequshi: "",
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
        params: {
          //数据传值
          bianhao: "2",
          name_cn: "",
          department_id: "",
          pageNum: 1,
          pageCount: 15,
          role_name: "",
          isdelete: "1"
        },
        jueseOptions: [],
        jueseOptions2: [],
        sectionOptions: [], //添加部门下拉框数据
        roleOptions: [], //角色下拉框
        total: 1, //数据总条数
        idBatch: [], //多选框
        tabpanes: [{
            label: "考核用户"
          },
          {
            label: "被考核用户"
          },
          {
            label: "考核组用户"
          }
        ],
        departmentOptions: [{
            value: "选项1",
            label: "省考核委"
          },
          {
            value: "选项2",
            label: "省考核办"
          },
          {
            value: "选项3",
            label: "省委组织部"
          },
          {
            value: "选项4",
            label: "省委编办"
          }
        ],
        userName: "", //查询用户名称
        currentPage: 1, //当前页码
        userTreeData: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        userTableData: [],
        sortData: [],
        sortChuanzhi: [],
        sortCan: [],
        // multipleSelection: []
        adddialogFormVisible: false, //添加弹框
        addcompanyForm: {
          //添加单位信息
        },
        // 修改部门
        editcompanyForm: {},
        options: [{
            value: "2640",
            label: "省直机关"
          },
          {
            value: "2499",
            label: "设区市"
          }
        ],
        options2: [{
            value: "设区市",
            label: "设区市"
          },
          {
            value: "省直一类",
            label: "省直一类"
          },
          {
            value: "省直二类",
            label: "省直二类"
          },
          {
            value: "省直三类",
            label: "省直三类"
          }
        ],
        jiguanoptions: [{
            value: "1",
            label: "省直一类"
          },
          {
            value: "2",
            label: "省直二类"
          },
          {
            value: "3",
            label: "省直三类"
          }
        ],
        // 点击选中的单位
        djdw: "",
        uWrapId: "",
        uwid: "",
        upwr: "",
        edsz: "",
        // 需要修改的数据
        edvalue: {},
        // 按钮状态
        editBt: true,
        // 角色组
        roleGroup: [],
        jscount: 1,
        // 点击的exam_type
        etype: "",
        // 父节点parent_id
        parid: "",
        // 添加按钮
        tjan: false,
        scarr2:[],
      };
    },
    watch: {
      activeName(val) {
        this.searchUser();
      }
    },
    methods: {
      selectjuese1(){
        this.roleQuery()
        this.params.role_name=""
      },
      // 添加弹框
      addcom() {
        if (!this.uWrapId) {
          this.$message({
            type: 'error',
            message: '请选择新增部门归属的父级部门'
          });
          return
        }
        this.adddialogFormVisible = true;
        this.addcompanyForm.name = "";
      },
      // 关闭弹框
      closeDialog2() {
        this.adddialogFormVisible = false;
        this.editdialogFormVisible = false;
      },
      //添加单位信息
      addcompany() {
        var wQuery = {
          // 大标题
          exam_type: "beexam_object",
          // 新增部门名称
          name: this.addcompanyForm.name,
          // 父级id
          parent_id: this.uWrapId,
          // 省直类型
          sz_type: this.addcompanyForm.sz_type
        };
        console.log(wQuery);

        this.$http
          .post(globalConfig.server1 + "user/insertDepartment", wQuery)
          .then(res => {
            if (res.data.response_code == 500) {
              this.$message({
                message: "部门名称已存在",
                type: "warning"
              });
            } else if (res.data.response_code == 200) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.addcompanyForm = {};
              this.adddialogFormVisible = false;
              this.addcompanyForm.name = " ";
              this.editcompanyForm.sz_type = ""
              this.upwr=""
              // this.editdialogFormVisible = false
              //考核单位树
              this.getdepartTree();
              this.sectionQuery();
            }
          });
      },
      // 删除
      delWrap() {
        if (!this.uWrapId) {
          this.$message({
            type: 'error',
            message: '请选择需要删除的部门'
          });
          return
        }
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          customClass: "whetherh",
          closeOnClickModal:false,
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              var wQuery = {
                // 父级id
                id: this.uwid
              };

              this.$http
                .post(globalConfig.server1 + "user/deleteDepartment", wQuery)
                .then(res => {
                  if (res.data.response_desc == "存在子节点") {
                    this.$message.error("存在子节点");
                  } else if (res.data.response_code == 200) {
                    this.$message({
                      type: "success",
                      message: "删除成功"
                    });
                    done();
                    //考核单位树
                    this.getdepartTree();
                    this.sectionQuery();
                  }
                });
            } else {
              done();
            }
          }
        });
      },

      //修改单位信息
      update() {
        if (!this.uWrapId) {
          this.$message({
            type: 'error',
            message: '请选择需要修改的部门'
          });
          return
        }
        // this.editcompanyForm.name="";
        // this.editcompanyForm.name="";
        this.editDepartDialogVisible = true;
        this.editcompanyForm.name = this.upwr;
        this.editcompanyForm.sz_type = this.edsz;
      },
      // 确认修改
      edqr() {
        var wQuery = {
          // 新增部门名称
          name: this.editcompanyForm.name,
          // 当前id
          id: this.uwid,
          // 父级id
          parent_id:this.uWrapId,
          // 省直类型
          sz_type: this.editcompanyForm.sz_type
        };

        this.$http
          .post(globalConfig.server1 + "user/updateDepartment", wQuery)
          .then(res => {
            if (res.data.response_code == 500) {
              this.$message.error("部门名称已存在");
            } else if (res.data.response_code == 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.editcompanyForm = {};
              this.editDepartDialogVisible = false;
              //考核单位树
              this.getdepartTree();
              this.sectionQuery();
              this.uWrapId=""
            }
          });
      },

      //查询单位信息
      search() {
        this.tableLoading = true;
        this.tableData = [];
        this.$http
          .post(
            globalConfig.server1 + "department/getDepartmentByPage",
            this.params
          )
          .then(res => {
            if (res.data.response_code === "0") {
              this.tableLoading = false;
              let arr = res.data.response_body.list;

              arr.forEach((item, index) => {
                if (item.id != 1 && item.id != 2 && item.id != 3) {
                  this.tableData.push(item);
                }
              });

              this.total = res.data.response_body.totalCount;

              if (res.data.response_body.list == []) {
                this.$message({
                  type: "success",
                  message: "暂无数据!"
                });
              }
            } else {
              this.tableData = [];
            }
          });
      },
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
            console.log(res);

            if (res.data.response_code === "0") {
              this.roleGroup = res.data.response_body;
            } else {
              this.roleGroup = [];
            }
          });
      },
      // 查询角色
      selectjuese() {
        this.addUserForm.role_id = "";
        this.editUserForm.role_id = "";
        this.jscount = 1;
        this.rolexiala();
        this.edrolexiala();
      },
      //角色下拉
      rolexiala() {
        let params = {
          role_flag: this.addUserForm.role_flag
        };
        this.$http
          .post(globalConfig.server3 + "role/selectRoles", params)
          .then(res => {
            if (res.data.response_code == "0") {
              this.jueseOptions = res.data.response_body;
              if (this.jscount == 1) {
                this.addUserForm.role_id = this.jueseOptions[0].id;
              }
              this.jscount++;
            } else {
              this.jueseOptions = [];
            }
          });
      },
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
      huoqujiedian(val) {
        console.log(val);
        
        if (val.id == 1) {
          this.tjan = true
          return
        }
        this.tjan = false;
        if (val.id ==3 || val.parent_id == 3) {
          this.addcompanyForm.parent_name = "设区市";
          this.editcompanyForm.parent_name = "设区市";
          console.log(this.editcompanyForm.parent_name);
          
          this.uWrapId = 3;
          this.addcompanyForm.sz_type = "";
          this.editcompanyForm.sz_type = "";
        } else if (val.id ==2 || val.parent_id == 2) {
          this.addcompanyForm.parent_name = "省直机关";
          this.editcompanyForm.parent_name = "省直机关";
          this.uWrapId = 2;
        }
        this.upwr = val.label;
        this.edsz = val.sz_type;
        // 获取当前节点
        this.uwid = val.id;

        this.params.department_id = val.id;
        this.uwid = val.id;

        this.selectshequshi = val.id;

        this.searchUser();
      },
      nodeStyle(node) {
        if (node.level == 1) {
          return "firstStyle";
        } else if (node.level == 2) {
          return "secondStyle";
        }
      },
      handleSelectionChange(val) {
        this.edvalue = val[0];
        if (val.length > 1|| val.length == 0) {
          this.editBt = true;
        } else {
          this.editBt = false;
        }
        this.idBatch = val;
      },
      handleSizeChange(val) {
        this.params.pageCount = val;
        this.searchUser();
      },
      handleCurrentChange(val) {
        this.params.pageNum = val;
        this.searchUser();
      },
      closeDialog() {
        this.sortdialogFormVisible = false;
        this.addDepartDialogVisible = false;
        this.delDepartDialogVisible = false;
        this.editDepartDialogVisible = false;
        this.addUserDialogVisible = false;
        this.editUserDialogVisible = false;
        this.addUserForm = {};
      },
      addDepart() {
        //添加部门
        this.addDepartDialogVisible = true;
      },
      delDepart() {
        //删除部门
        this.delDepartDialogVisible = true;
      },
      editDepart() {
        //编辑部门
        this.editDepartDialogVisible = true;
      },

      addUser() {
        //添加用户
        this.addUserDialogVisible = true;
        // this.rolexiala()
        this.sectionQuery();
        this.addUserForm = {};
        this.addUserForm.status = true
      },
      addensure() {
        if (this.addUserForm.status) {
          this.addUserForm.status = 1;
        } else {
          this.addUserForm.status = 0;
        }

        this.addUserForm.department_id = this.selectshequshi;
        let pwd = Cryptojs.Encrypt(this.addUserForm.password);
        this.addUserForm.password = pwd;

        let params = JSON.parse(JSON.stringify({ ...this.addUserForm
        }));
        params.password = pwd;

        this.$http
          .post(globalConfig.server1 + "user/insertUser", params)
          .then(res => {
            if (res.data.response_code === "0") {
              this.searchUser();
              this.addUserForm = {};
              this.addUserDialogVisible = false;
              this.$message({
                message: res.data.response_body,
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.response_body,
                type: "error"
              });
            }
          });
      },
      //开关
      kaiguan(val) {
        if (val.status) {
          val.status = 1;
        } else {
          val.status = 0;
        }
        let params = {
          id: val.id,
          status: val.status
        };
        this.$http
          .post(globalConfig.server1 + "user/updateUser", params)
          .then(res => {
            if (res.data.response_code === "0") {
              this.searchUser();
              this.$message({
                type: "success",
                message: "修改成功"
              });
            } else {
              this.$message({
                type: "error",
                message: "修改失败"
              });
            }
          });
      },
      //编辑用户
      editUser(val) {
        if (Object.keys(val).length) {
          this.editUserForm = JSON.parse(JSON.stringify(val));

          this.editUserDialogVisible = true;
          this.sectionQuery();
          this.edrolexiala();
          // this.rolexiala();
        } else {
          this.$message({
            message: "请先选择节点",
            type: "error"
          });
        }
      },
      editBtn() {
        if (this.editUserForm.status) {
          this.editUserForm.status = 1;
        } else {
          this.editUserForm.status = 0;
        }

        let params = JSON.parse(JSON.stringify({ ...this.editUserForm
        }));
        if (this.editUserForm.password) {
          let pwd = Cryptojs.Encrypt(this.editUserForm.password);
          params.password = pwd;
        }

        this.$http
          .post(globalConfig.server1 + "user/updateUser", params)
          .then(res => {
            if (res.data.response_code === "0") {
              this.searchUser();
              this.$message({
                type: "success",
                message: res.data.response_body
              });
              
              this.editUserDialogVisible = false;
              this.editUserForm = {};
            } else {
              // this.$message({
              //   type: "error",
              //   message: "修改失败"
              // });
            }
          });
      },
      //删除用户
      delUser(val) {
        this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            customClass: "whetherh",
            closeOnClickModal:false,
            type: "warning"
          })
          .then(() => {
            let params = {
              isdelete: 1,
              id: val.id
            };
            this.$http
              .post(globalConfig.server1 + "user/updateUser", params)
              .then(res => {
                if (res.data.response_code === "0") {
                  this.searchUser();
                  this.$message({
                    type: "success",
                    message: "删除成功！"
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: "刪除失败！"
                  });
                }
              });
          })
          .catch(() => {
            // this.$message({
            //   type: "info",
            //   message: "已取消删除"
            // });
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
                  } else {}
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
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
        this.$http
          .post(globalConfig.server2 + "user/getUserByPage", this.params)
          .then(res => {
            if (res.data.response_code === "0") {
              
              this.userTableData = res.data.response_body.list;
              console.log(this.userTableData);
              
              this.userTableData.map(item => {
                if (item.status == "0") {
                  item.status = false;
                } else if (item.status == "1") {
                  item.status = true;
                }
              });
              this.total = res.data.response_body.totalCount;
            } else {}
          });
      },
      //角色查询
      roleQuery() {
        let params = {
          name: "",
          status: "",
          pageNum: "1",
          pageCount: "100",
          role_flag:this.params.role_flag
        };
        this.$http
          .post(globalConfig.server1 + "role/getRoleByPage", params)
          .then(res => {
            if (res.data.response_code === "0") {
              this.roleOptions = res.data.response_body.list;
            } else {}
          });
      },
      //表单下拉框数据
      sectionQuery() {
        let params = {
          eaxm_type: "beexam_object"
        };
        this.$http
          .post(globalConfig.server1 + "user/getDepartmentByUser", params)
          .then(res => {
            if (res.data.response_code === "0") {
              this.sectionOptions = res.data.response_body;
            } else {}
          });
      },
      //考核单位树
      getdepartTree() {
        let params = {
          exam_type: "beexam_object"
        };
        this.$http
          .post(
            globalConfig.server1 + "department/getDepartmentDendrogram",
            params
          )
          .then(res => {
            if (res.data.response_code === "0") {
              let arr = [];
              arr.push(res.data.response_body);
              this.userTreeData = arr;
              var carr=this.userTreeData
              
              console.log(carr);
              
              for (let i = 0; i < carr.length; i++) {
                this.scarr2.push(carr[i].id)
              }
              console.log(this.scarr2);
              
              this.sortData = JSON.parse(JSON.stringify(arr));
            } else {}
          });
      },
      // 排序
      sortClick() {
        this.sortdialogFormVisible = true;
      },
      collapse(moveNode, inNode, type) {
        if (moveNode.level == 2 && inNode.level == 2) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == "prev";
          } else {}
        }
        if (moveNode.level == 3 && inNode.level == 3) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == "prev";
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
      sortgaibian() {
        if (this.sortChuanzhi.length == 0) {
          return;
        } else {
          let arr = this.sortChuanzhi[0].children;

          arr.forEach((item, xu) => {
            item.children.forEach((val, index) => {
              val.sort = index;
              let obj = {
                id: val.id,
                label: val.label,
                sort: val.sort
              };
              this.sortCan.push(obj);
            });
          });
        }
        this.sortgaibianTrue();
      },
      sortgaibianTrue() {
        if (this.sortCan.length == 0) {
          this.sortdialogFormVisible = false;
        } else {
          this.$http
            .post(
              globalConfig.server1 + "department/updateSortById",
              this.sortCan
            )
            .then(res => {
              if (res.data.response_code === "0") {
                this.$message({
                  message: res.data.response_body,
                  type: "success"
                });
                this.sortCan = [];
                this.sortdialogFormVisible = false;
                this.getdepartTree();
              } else {
                this.prompt("warning", res.data.response_body);
              }
            });
        }
      }
    },

    mounted() {
      this.getdepartTree();
      this.searchUser();
      this.roleQuery();
      this.rolexiala();
      this.sectionQuery();
      this.addjuesezu();
    }
  };

</script>

<style scoped lang="scss">
  .icon-chaxun {
    margin-left: 10px;
  }

  #AssessedUser .el-aside {
    background-color: #eaf3fa;
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
      color: red !important;
    }
  }

  .el-form {
    overflow: hidden;
  }

  .paging {
    margin-top: 20px;
    margin-left: 30%;
  }

  .el-button--text {
    font-size: 16px;
  }

</style>
<style lang="scss">
  #AssessedUser {
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
    .el-tree-node__content:hover {
        background-color: #eaf3fa;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        color:#fff;
        background-color: #409eff; 
    }
    .zxgl .el-tree-node:focus>.el-tree-node__content {
      color: #fff;
      background-color: rgb(64, 158, 255) !important;
    }

    .req {
      color: red !important;
    }

    .btnGroup {
      width: 100%;
      padding: 5% 0 3% 0;
      display: inline-block;
      margin: 0 auto;
    }

    .btns {
      width: 100%;
      margin: 10px auto;
      text-align: center;
    }

    .btns button {
      width: 19%;
      padding: 5px;
      text-align: center;
    }

    .userTree {
      margin-top: 20px;
      background-color: #eaf3fa;
    }

    .firstStyle {
      font-size: 16px;
      line-height: 30px;
    }

    .secondStyle {
      font-size: 16px;
      line-height: 20px;
    }

    .el-form-item__label {
      font-size: 16px;
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
  }

</style>
