<template>
  <div id="userControl">
    <!-- {{addUserForm.department_id}} -->
    <el-tabs type="border-card">
      <!-- <el-tab-pane :label="item.label" v-for="(item,index) in tabpanes" :key="index"> -->
      <el-container>
        <el-aside width="265px">
          <el-scrollbar class="content_scroll">
            <div class="btnGroup">
              <div class="btns">
                <el-button type="primary" class="bluebtnclass" size="medium" @click="sortClick">排序</el-button>
                <el-button type="primary" class="bluebtnclass" size="medium" @click="open3" :disabled="addjy">添加</el-button>
                <el-button type="primary" class="bluebtnclass" size="medium" @click="delWrap">删除</el-button>
                <el-button type="primary" class="bluebtnclass" size="medium" @click="update">修改</el-button>
                
              </div>
            </div>
            <el-tree :highlight-current="true" @node-click="huoqujiedian" :expand-on-click-node="false" class="userTree zxgl"
              :data="userTreeData" style="margin-top:0px"  :props="defaultProps" node-key="id" :default-expanded-keys=scarr >
              <span slot-scope="{ node, data }" :class="nodeStyle(node)">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-scrollbar>
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
              <el-select v-model.trim="params.role_name" clearable size="medium" placeholder="角色名称" style="width:200px;">
                <el-option v-for="item in roleOptions" :key="item.value" :label="item.name" :value="item.name" ></el-option>
              </el-select>
              <el-form-item label="登录账号：">
                <el-input v-model.trim="params.name" placeholder="登录账号" size="medium" style="width:150px;"></el-input>
              </el-form-item>
              <el-button type="primary" size="medium" class="bluebtnclass" @click="searchUser" >查询</el-button>
            </el-form-item>
            <div style="float:right;margin-top:2px;">
              <el-form-item style="margin-right: 0px">
                <!-- <el-button type="primary" size="medium" class="iconfont icon-add" @click="addUser">&nbsp;添加</el-button> -->
                <el-button type="primary" size="medium" class="bluebtnclass guang" @click="addUser">添加</el-button>
                <el-button :disabled="editBt" size="medium" class="bluebtnclass guang" type="primary" @click="editUser(edvalue)"
                  >编辑</el-button>
                <!-- <el-button type="primary" size="medium" class="iconfont icon-shanchu" @click="delcadAll" style="background: #f09800;border: 1px solid #f09800;">&nbsp;删除</el-button> -->
                <el-button type="primary" size="medium" class="redsbtnclass guang" @click="delcadAll" >删除</el-button>
              </el-form-item>
            </div>
          </el-form>
          <el-table ref="multipleTable" :data="userTableData" tooltip-effect="dark" style="width: 100%;margin-top:10px"
            border="" @selection-change="handleSelectionChange" stripe>
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column label="角色组" prop="role_flag" width="200"></el-table-column>
            <el-table-column prop="role_name" label="角色名称"></el-table-column>
            <el-table-column label="姓名" prop="name_cn" width="200"></el-table-column>
            <el-table-column prop="departmentName" label="所属部门"></el-table-column>
            <el-table-column prop="name" label="登录账号" width="150"></el-table-column>
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
    <!-- 新增弹窗 -->
    <el-dialog title="添加部门" :close-on-click-modal="false" :visible.sync="addDepartDialogVisible" width="410px" class="proupClass">
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
    <el-dialog title="删除部门"  :close-on-click-modal="false" :visible.sync="delDepartDialogVisible" width="410px" class="proupClass">
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
    <el-dialog title="修改部门" :close-on-click-modal="false" :visible.sync="editDepartDialogVisible" width="410px" class="proupClass">
      <div>
        <el-form :model="editDrpartForm" label-width="120px">
          <el-form-item label="选择部门：">
            <el-select v-model="editDrpartForm.department" placeholder="请选择" size="medium">
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新部门名称：" required>
            <el-input v-model="editDrpartForm.departNewName" class="addbumen" size="medium"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="editDepartDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :close-on-click-modal="false" :visible.sync="addUserDialogVisible" width="750px" class="proupClass">
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
    <el-dialog title="编辑用户" :close-on-click-modal="false" :visible.sync="editUserDialogVisible" width="750px" class="proupClass">
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
        <el-tree :data="sortData" node-key="id" default-expand-all draggable="" :allow-drop="collapse" @node-drop="handleDrop"></el-tree>
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
        value: "",
        params: {
          //数据传值
          bianhao: "1",
          name_cn: "",
          department_id: "",
          pageNum: 1,
          pageCount: 15,
          role_name: ""
        },
        sectionOptions: [], //添加部门下拉框数据
        roleOptions: [], //角色下拉框
        jueseOptions: [], //角色名称下拉
        jueseOptions2: [],
        total: 1, //数据总条数
        idBatch: [], //多选框
        departmentOptions: [],
        userName: "", //查询用户名称
        currentPage: 1, //当前页码
        userTreeData: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        userTableData: [],
        // multipleSelection: []
        // 父级id
        uWrapId: "",
        // 修改的名称
        uWrapUp: "",
        // 获取当前节点
        uwid: "",
        sortData: [],
        sortChuanzhi: [],
        sortCan: [],
        // 需要修改的数据
        edvalue: {},
        // 按钮状态
        editBt: true,
        // 角色组
        roleGroup: [],
        jscount: 1,
        scarr:[],
        // 添加按钮禁用
        addjy:false,
        // 添加类型
        addex:""
      };
    },
    watch: {
      activeName(val) {
        this.searchUser();
      }
    },
    methods: {
      // 获取当前点击的信息
      getWrap(item) {
        console.log(item);
        // 点击的父节点
        this.uWrapId = item.data.id;
        // 点击的父节点名称
        // 获取当前节点
        this.uwid = item.data.id;
        // 获取内容
        this.uWrapUp = item.data.label;
      },
      // 增加栏
      open3() {
        if (!this.uWrapId) {
          this.$message({
            type: 'error',
            closeOnClickModal:false,
            message: '请选择新增部门归属的父级部门'
          });
          return
        }
        setTimeout(
          function () {
            var ipt1 = document.getElementsByClassName(
              "el-message-box__message"
            )[0].children[0].children[2];
            ipt1.innerHTML = this.uWrapUp;
          }.bind(this),
          0
        );
        // 父元素名称
        const h = this.$createElement;
        this.$msgbox({
          title: "添加部门",
          closeOnClickModal:false,
          message: h("p", [
            h(
              "span", {
                style: "color:red;"
              },
              "*"
            ),
           h('span', {
              style: 'font-size:16px;display: inline-block;margin:10px 0;'
            }, '父级部门：'),
            h('span', {
                style: 'line-height:38px; height: 38px;width: 330px;padding-left:10px;font-size:16px;'
            }),
            h("p", [
              h(
                "span", {
                  style: "color:red;"
                },
                "*"
              ),
              h('span', {
              style: 'font-size:16px;display: inline-block;margin:10px 0;'
            }, '新增部门：'),
            h('input', {
                style: 'height: 38px;width: 188px;padding-left:10px;border: 1px solid #dcdfe6;border-radius: 5px;font-size:16px;'
            })
              
            ])
          ]),
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          customClass: "dwtb",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              // 子元素名称
              var ipt = document.getElementsByClassName(
                "el-message-box__message"
              )[0].children[0].children[3].children[2];
              if (ipt.value) {
                var userwrap = this.$store.state.userwrap;
                  var wQuery = {
                    // 大标题
                    exam_type: this.addex,
                    // 新增部门名称
                    name: ipt.value,
                    // 父级id
                    parent_id: this.uwid,
                    // 省直类型
                    sz_type: ""
                  };
                  console.log(wQuery);
                  
                  this.$http
                    .post(globalConfig.server1 + "user/insertDepartment", wQuery)
                    .then(res => {
                      if (res.data.response_code == 500) {
                        this.$message({
                          type: 'error',
                          message: '部门名称已存在'
                        });
                        // alert("部门名称已存在");
                      } else if (res.data.response_code == 200) {
                        this.$message({
                          type: "success",
                          message: "添加成功"
                        });
                        done();
                        //考核单位树
                        this.getdepartTree();
                        this.addDrpartForm.department = "";
                        this.sectionQuery();
                        this.uWrapId=""
                      }
                    });
              } else {
                this.$message({
                  type: 'info',
                  message: '内容不能为空'
                });
              }
              // 添加后清空
              ipt.value = null;
              this.addDrpartForm.department = "";
              this.uWrapId=""
            } else {
              done();
              var ipt = document.getElementsByClassName(
                "el-message-box__message"
              )[0].children[0].children[3].children[2];
              ipt.value = "";
              this.addDrpartForm.department = "";
            }
          }
        }).catch(() => {
          var ipt = document.getElementsByClassName(
            "el-message-box__message"
          )[0].children[0].children[3].children[2];
          ipt.value = "";
          
          // this.$message({
          //   type: 'info',
          //   message: '取消输入'
          // });
          this.addDrpartForm.department = "";
        });
      },
      // 修改
      update: function () {
        if (!this.uWrapId) {
          this.$message({
            type: 'error',
            message: '请选择需要修改的部门'
          });
          return
        }
        setTimeout(
          function () {
            var ipt = document.getElementsByClassName(
              "el-message-box__message"
            )[0].children[0].children[2];
            ipt.value = this.uWrapUp;
          }.bind(this),
          0
        );
        const h = this.$createElement;
        this.$msgbox({
          title: "修改部门",
          closeOnClickModal:false,
          message: h("p", [
            h(
              "span", {
                style: "color:red;"
              },
              "*"
            ),
            h(
              "span", {
                style: "font-size:16px;"
              },
              "部门名称："
            ),
            h("input", {
              style: "width:230px;height:40px;padding-left:10px;border: 1px solid #dcdfe6;border-radius: 5px;font-size:16px;"
            })
          ]),
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          customClass: "dwtb",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              var ipt = document.getElementsByClassName(
                "el-message-box__message"
              )[0].children[0].children[2];
              var wQuery = {
                // 新增部门名称
                name: ipt.value,
                // 父级id
                parent_id:this.uWrapId,
                id: this.uwid,
                // 省直类型
                sz_type: ""
              };
              console.log(wQuery);
              
              this.$http
                .post(globalConfig.server1 + "user/updateDepartment", wQuery)
                .then(res => {
                  if (res.data.response_code == 500) {
                    this.$message({
                      type: 'error',
                      message: '部门名称已存在'
                    });
                    
                  } else if (res.data.response_code == 200) {
                    this.$message({
                      type: "success",
                      message: "修改成功"
                    });
                    done();
                    //考核单位树
                    this.getdepartTree();
                    this.editDrpartForm.departNewName = "";
                    this.sectionQuery();
                    this.uWrapId=""
                  }
                });
            } else {
              done();
              this.editDrpartForm.departNewName = "";
            }
          }
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '取消修改'
          // });
          this.editDrpartForm.departNewName = "";
        });
      },
      // 删除
      delWrap() {
        if (!this.uWrapId) {
          this.$message({
            type: 'error',
            closeOnClickModal:false,
            message: '请选择需要删除的部门'
          });
          return
        }
        this.$confirm("此操作将永久删除该部门, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal:false,
          customClass: "whetherh",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              var wQuery = {
                // 父级id
                id: this.uwid,
                // 省直类型
                sz_type: ""
              };
              this.$http
                .post(globalConfig.server1 + "user/deleteDepartment", wQuery)
                .then(res => {
                  if (res.data.response_desc == "存在子节点") {
                    this.$message({
                      type: 'error',
                      message: '存在子部门，请先删除子部门'
                    });
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
        this.jscount = 1;
        this.rolexiala();
        this.edrolexiala();
      },
      selectjuese1(){
        this.jscount1=1;
        this.roleQuery()
        this.params.role_name=""
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
      nodeStyle(node) {
        if (node.level == 1) {
          return "firstStyle";
        } else if (node.level == 2) {
          return "secondStyle";
        }
      },
      handleSelectionChange(val) {
        this.edvalue = val[0];
        if (val.length > 1 || val.length == 0) {
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
        this.uWrapId=""
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
        this.sectionQuery();
        this.addUserForm={}
        this.addUserForm.status = true
        // this.rolexiala()
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
              this.addUserForm = {
                status: true
              };
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
        let params = {
          id: val.id,
          status: 1
        };
        if (val.status) {
          params.status = 1;
        } else {
          params.status = 0;
        }

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
        if (val.name || val.parent_id) {
          this.editUserForm = JSON.parse(JSON.stringify(val));

          this.editUserDialogVisible = true;
          this.sectionQuery();
          this.edrolexiala();
          // this.rolexiala()
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
              this.$message({
                type: "error",
                message: "修改失败"
              });
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
              closeOnClickModal:false,
              customClass: "whetherh",
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
        this.$http
          .post(globalConfig.server3 + "user/getUserByPage", this.params)
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
          .post(globalConfig.server2 + "role/getRoleByPage", params)
          .then(res => {
            if (res.data.response_code === "0") {
              // this.jueseOptions = res.data.response_body;
              this.roleOptions = res.data.response_body.list;
              // if (this.jscount1 == 1) {
              //   this.params.role_name = this.roleOptions[0].name;
              // }
              // this.jscount1++;
              
            } else {}
          });
      },
      //表单下拉框数据
      sectionQuery() {
        let params = {
          eaxm_type: "khw_dept"
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
          exam_type: "khw_dept"
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
              var carr=this.userTreeData[0].children
              
              for (let i = 0; i < carr.length; i++) {
                this.scarr.push(carr[i].id)
              }
              console.log(this.scarr);
              this.sortData = JSON.parse(JSON.stringify(arr));
            } else {}
          });
      },
      huoqujiedian(val) {
        console.log(val);
        if (val.exam_type=="zr_dept") {
          this.addjy=true
        }else{
          this.addjy=false
        }
        
        
        // 点击的父节点
        if (val.exam_type=="khw_dept") {
          this.uWrapId = val.id;
        }else{
          this.uWrapId = val.parent_id;
        }
        // 点击的父节点名称
        // 获取当前节点
        this.uwid = val.id;
        // 获取内容
        this.uWrapUp =val.label;
        // 添加的父级类型
        this.addex=val.exam_type

        this.params.department_id = val.id;
        this.searchUser();

        this.selectshequshi = val.id;
      },
      // 排序
      sortClick() {
        this.sortdialogFormVisible = true;
      },
      collapse(moveNode, inNode, type) {
        if (moveNode.level == 3 && inNode.level == 3) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == "prev";
          } else {}
        }
        if (moveNode.level == 4 && inNode.level == 4) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == "prev";
          } else {}
        }
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        // this.sortChuanzhi = dropNode.store.data
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
          let arr = this.sortChuanzhi[0].children[0].children;
          arr.forEach((item, xu) => {
            item.sort = xu;
            let objpar = {
              id: item.id,
              sort: item.sort
            };
            this.sortCan.push(objpar);
            item.children.forEach((val, index) => {
              val.sort = index;
              let obj = {
                id: val.id,
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
      // this.sectionQuery()
      // this.rolexiala()
      this.addjuesezu();
    }
  };

</script>

<style scoped lang="scss">
  

  .content_scroll {
    height: 100%;
    width: 98%;
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
    // padding: 0 5px;
    text-align: center;
  }

  .btns button {
    width: 19%;
    padding: 5px;
    text-align: center;
  }

  .el-aside {
    height: 740px;
    overflow: auto;
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
      color: red;
    }
  }

  .paging {
    margin-top: 20px;
    margin-left: 30%;
    margin-bottom: 20px;
  }

  .el-button--text {
    font-size: 16px;
  }

  .dwtb>.el-message-box__header>.el-message-box__title {
    line-height: 54px;
  }

</style>
<style lang="scss">
  #userControl {
    .guang.el-button{
      margin-left:4px;
    }
    .el-form--inline .el-form-item{
      margin-right:5px
    }
    .el-tree-node__content:hover {
        background-color: #eaf3fa;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        color:#fff;
        background-color: #409eff; 
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

    .el-aside {
      height: 740px;
      overflow: auto;
      background-color: #eaf3fa;
      color: #333;
    }

    .sortBox {
      height: 500px;
      overflow: auto;
    }

    .zxgl .el-tree-node:focus>.el-tree-node__content {
      color: #fff;
      background-color: rgb(64, 158, 255) !important;
    }
    

    .content_scroll .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    // 弹框样式
    .el-message-box {
      width: 550px;
    }

    .el-message-box__header {
      padding: 0;
    }

    .el-message-box__title {
      height: 54px;
      line-height: 54px;
      text-align: center;
      font-weight: bold;
      background: rgba(242, 242, 242, 1);
    }

    .el-message-box__content {
      padding-top: 20px;
      padding-left: 80px;
      margin-bottom: 30px;
    }

    .el-message-box__message>p>span:nth-of-type(2) {
      padding-right: 20px;
    }

    .el-message-box__message>p>input {
      padding-left: 20px;
    }

    // 弹出框按钮样式
    .el-message-box__btns {
      height: 42px;
      text-align: center;
      padding: 0;
      display: flex;
      align-items: center;
      padding-bottom: 15px !important;
      justify-content: center;
    }

    .el-message-box__btns>.el-button {
      width: 142px;
      height: 42px;
    }

    .el-message-box__btns>.el-button:nth-of-type(1) {
      margin-right: 50px;
    }
  }

</style>
