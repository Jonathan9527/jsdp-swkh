<template>
  <div id="roleAuthorityManger" style='margin-top:-2px;'>
    <div class="asstopWrap">
      <el-form :inline="true" class="demo-form-inline" onsubmit="return false">
        <el-form-item label="角色组：">
            <el-select v-model="params.role_flag" placeholder="请选择" clearable style="width:200px;">
              <el-option v-for="item in roleGroup" :key="item.id" :label="item.mainValue" :value="item.mainValue">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="角色名称：">
          <el-input v-model="params.name" placeholder="角色名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="角色状态：">
          <el-select v-model="params.status" placeholder="角色状态" size="mini" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="未启用" value="0"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item >
          <!-- <el-button type="primary" icon="el-icon-search" size="medium" @click="search"> 查询</el-button> -->
          <el-button type="primary" size="medium" class="bluebtnclass " @click="search">查询</el-button>
        </el-form-item>
        <div class="btnworpbox">
          <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" size="medium" @click="addRole">添加</el-button> -->
          <el-button type="primary" size="medium" class="bluebtnclass " @click="addRole">添加</el-button>
        </div>
      </el-form>
    </div>

    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border style="width: 100%;margin-top:10px;"
      stripe>
      <!-- <el-table-column type="selection" width="55">
      </el-table-column> -->
      <el-table-column prop="role_flag" label="角色组" width="200">
      </el-table-column>

      <el-table-column prop="name" label="角色名称" width="300">
      </el-table-column>

      <el-table-column prop="decription" label="角色描述">
      </el-table-column>
      
      <el-table-column prop="updatetime" label="更新时间" width="200">
      </el-table-column>
      <el-table-column label="启用" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#409EFF" inactive-color="#CCC" @change="statusUpdate(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addUser(scope.row)" style="background: none;color: #0841B4;"><span class="tableclicksh" style="border-bottom: 1px solid #0841B4;">添加用户</span></el-button>
          <el-button type="text" size="small" @click="permissSetting(scope.row)" style="background: none;color: #0841B4;"><span class="tableclicksh" style="border-bottom: 1px solid #0841B4;">设置权限</span></el-button>
          <el-button type="text" size="small" @click="editRole(scope.row)" style="background: none;color: #0841B4;"><span class="tableclicksh" style="border-bottom: 1px solid #0841B4;">编辑</span></el-button>
          <el-button type="text" size="small" @click="delRole(scope.row)" style="background: none;color: #f05050;"><span class="shanchush" style="border-bottom: 1px solid #f05050;">删除</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagings">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pageNum"
        :page-sizes="[15, 30, 50, 100]" :page-size="params.pageCount" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :close-on-click-modal="false" :visible.sync="addUserdialogVisible" width="50%" class='proupClass addrole'>
      <!-- {{rolesList}} -->
      <div class="clearfix">
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="title">选择用户</div>
            <div class="inputBox">
              <el-input placeholder="输入用户" v-model="userParams.name_cn" clearable size="mini">
                <el-button slot="append" icon="el-icon-search" size="mini" @click="getUsers"></el-button>
              </el-input>
            </div>
            <div class="content">
              <el-checkbox-group v-model="rolesList">
                <div v-for="role in users">
                  <el-checkbox :label="role" :key="role.name">{{role.name_cn}}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="title">
              <span>已选用户</span>
              <el-button type="text" class="cleanText" @click="cleanTag" style="background: none;">清空</el-button>
            </div>
            <div class="content">
              <div v-for="role in rolesList" class="tagBox">
                <el-tag :key="role.id" closable @close="handleClose(role)" disable-transitions>
                  {{role.name_cn}}
                </el-tag>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeModule">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="addUsersTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 权限设置弹窗-->
    <el-dialog title="权限配置" :close-on-click-modal="false" :visible.sync="permissSettingdialogVisible" width="500px" class="addrole proupClass" @close="closePremiss">
      <div class="clearfix quanxiancontent">
        <el-tree :data="premissTreeData" show-checkbox node-key="id" :default-checked-keys="getIdsArr" :props="defaultProps"
          :default-expand-all="true" ref="tree">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeModule" size="medium">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="setPermiss" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹窗-->
    <el-dialog title="编辑角色" :close-on-click-modal="false" :visible.sync="editRoledialogVisible" width="600px" class="addrole proupClass">
      <div class="clearfix">
        <el-form ref="form" :model="editRoleform" label-width="80px" onsubmit="return false">
          <el-form-item label="角色名称：">
            <el-input v-model="editRoleform.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="角色编号：">
            <el-input v-model="editRoleform.code"></el-input>
          </el-form-item> -->
          <el-form-item label="角色描述：">
            <el-input v-model="editRoleform.decription"></el-input>
          </el-form-item>
          <el-form-item label="角色组：">
            <el-select v-model="editRoleform.role_flag" placeholder="请选择">
              <el-option v-for="item in roleGroup" :key="item.id" :label="item.mainValue" :value="item.mainValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-switch v-model="editRoleform.status" active-color="#409EFF" inactive-color="#CCC" active-text="启用"
              inactive-text="停用"> </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeModule" size="medium">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="editRoleTrue" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色弹窗 -->
    <el-dialog title="添加角色" :close-on-click-modal="false" :visible.sync="addRoledialogVisible" width="600px" class="addrole proupClass">
      <!-- {{addRoleform}} -->
      <div class="clearfix">
        <el-form ref="form" :model="addRoleform" label-width="100px" onsubmit="return false">
          <el-form-item label="角色名称：" required>
            <el-input v-model="addRoleform.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：">
            <el-input v-model="addRoleform.decription"></el-input>
          </el-form-item>
          <el-form-item label="角色组：" required>
            <el-select v-model="addRoleform.role_flag" placeholder="请选择">
              <el-option v-for="item in roleGroup" :key="item.id" :label="item.mainValue" :value="item.mainValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-switch v-model="addRoleform.status" active-color="#409EFF" inactive-color="#CCC" active-text="启用"
              inactive-text="停用"> </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeModule" size="medium">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="addRoleTrue" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        getIdsArr: [],
        inputrole: "", //输入的用户
        rolesList: [],
        roleGroup: [],
        users: [], //用户列表
        addUserdialogVisible: false, //添加角色弹窗
        permissSettingdialogVisible: false, //权限设置
        editRoledialogVisible: false, // 编辑角色
        delRoledialogVisible: false, //删除角色
        addRoledialogVisible: false, //添加角色
        cxjuesezu: [], //查询角色组下拉框
        editRoleform: {},
        addRoleform: {
          status: true
        }, //添加角色数据
        params: {
          name: "",
          status: "",
          pageNum: 1,
          pageCount: 15,
          role_flag: ""
        },
        total: 10,
        checked: true,
        tableData: [],
        multipleSelection: [],
        premissTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        userParams: { //用户参数
          name_cn: "",
          department_id: "",
          pageNum: "1",
          pageCount: "100",
          role_name: ""
        },
        userToRole: {}, //角色绑定用户参数
        premissObj: {},
        quanxianobj:{}
      }
    },
    mounted() {
      this.search()
      this.addjuesezu()
    },
    methods: {
      //分页器
      handleSizeChange(val) {
        this.params.pageCount = val
        this.search()
      },
      handleCurrentChange(val) {
        this.params.pageNum = val
        this.search()
      },
      //状态开关
      statusUpdate(val) {
        let params = {
          id: val.id
        }
        if (val.status) {
          params.status = "1"
        } else {
          params.status = "0"
        }
        this.$http.post(globalConfig.server1 + "role/deleteRoleStatus", params).then(res => {
          if (res.data.response_code == "0") {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.search()
          } else {
            val.status = !val.status
            this.$message({
              message: '修改失败',
              type: 'success'
            });
          }
        })
      },
      // 关闭权限弹窗操作
      closePremiss() {
        this.$refs.tree.setCheckedKeys([])
      },
     
      //权限设置
      permissSetting(val) {
        this.quanxianobj = val
        this.premissTreeData = []
        
        let permissAll = this.$http.post(globalConfig.server1 + "button/select-button-tree").then(res => {
          if (res.data.code == "200") {
            this.premissTreeData.push(res.data.data)
          } else {

          }
        })

        let params = {
          roleId: val.id
        }
        let arr = []
        let permissSelect = this.$http.post(globalConfig.server1 + "button/select-button-tree-roleId", params).then(res => {
          if (res.data.code == "200") {
            arr.push(res.data.data)
          } else {

          }
        })
        Promise.all([permissAll, permissSelect]).then((result) => {
          this.permissSettingdialogVisible = true
          let leafArr = []
          this.getTreeleafID(arr,leafArr)
          setTimeout(() => {
          this.$refs.tree.setCheckedKeys(leafArr)
        }, 400)
        }).catch((error) => {
          console.log(error)
        })

      },
      setPermiss() {

        let arr1 = this.$refs.tree.getCheckedKeys()
        let arr2 = this.$refs.tree.getHalfCheckedKeys()

        let data = JSON.parse(JSON.stringify(this.premissTreeData))

        var arrIdFalse = arr1.concat(arr2)
        
        console.log(arrIdFalse)
        let arrSelectTrue = JSON.parse(JSON.stringify(arrIdFalse))
        let permissData = JSON.parse(JSON.stringify(this.premissTreeData))
        let arrAll = []
        this.getTreeAllId(permissData, arrAll)

        this.diff(arrAll, arrIdFalse)

        let arrSelectFalse = JSON.parse(JSON.stringify(arrAll))

        // console.log(arrSelectFalse)

        console.log(arrSelectTrue)
        let shuzu1 = []
        arrSelectTrue.forEach(item=>{
          let temp = {
            status:true,
            id: item
          }
          shuzu1.push(temp)
        })
        console.log(arrSelectFalse)
        arrSelectFalse.forEach(item=>{
           let temp = {
            status:false,
            id: item
          }
          shuzu1.push(temp)
        })

        console.log(shuzu1);
        
        // let selectAll = [...arrIdFalse,...arrSelectFalse]
        // console.log(selectAll)
        // arrSelectTrue.forEach(item => {
        //   this.updataTreeIDFalse(data, item)
        // })

        // arrSelectFalse.forEach(item => {
        //   this.updataTreeIDTrue(data, item)
        // })

        // let status
        // if (this.premissObj.status) {
        //   status = "1"
        // } else {
        //   status = "0"
        // }

        // let params = {
        //   id: this.premissObj.id,
        //   menus_sidebar: JSON.stringify(data),
        //   status: status,
        //   isdelete: '0'
        // }
          // console.log(shuzu1);
          
        let params = {
          roleId:this.quanxianobj.id,
          bids:shuzu1
        }
        this.update(params)



      },
      // 修改权限
      update(params) {
        this.$http.post(globalConfig.server1 + 'button/insert-role-button', params).then(res => {
          if (res.data.code == '200') {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            // this.search()
            this.permissSettingdialogVisible = false
          } else {
            this.$message({
              message: '修改失败',
              type: 'warning'
            });
          }

        })
        // this.$http.post(globalConfig.server1 + 'role/updateRoleMenus', params).then(res => {
        //   if (res.data.response_code === '0') {
        //     this.$message({
        //       message: '修改成功',
        //       type: 'success'
        //     });
        //     this.search()
        //     this.permissSettingdialogVisible = false
        //   } else {
        //     this.$message({
        //       message: '修改失败',
        //       type: 'warning'
        //     });
        //   }

        // })
      },
      // 遍历树 -- 修改树的权限
      updataTreeIDFalse(data, id) {
        for (var i in data) {
          if (data[i].id == id) {
            data[i].hidden = false
            break;
          } else {
            this.updataTreeIDFalse(data[i].children, id);
          }
        }
      },
      updataTreeIDTrue(data, id, val) {
        for (var i in data) {
          if (data[i].id == id) {
            data[i].hidden = true
            break;
          } else {
            this.updataTreeIDTrue(data[i].children, id);
          }
        }
      },
      //遍历树 -- 获取树的id
      getTreeID(data, arr) {
        function getId(data) {
          for (var i in data) {
            if (data[i].hidden == false && !data[i].children) {
              arr.push(data[i].id)
            } else {
              getId(data[i].children, arr)
            }
          }
        }
        getId(data)

      },
      //遍历树 -- 获取所有树的id
      getTreeAllId(data, arr) {
        function getId(data, arr) {
          for (var i in data) {
            arr.push(data[i].id)
            if (data[i].children) {
              getId(data[i].children, arr)
            }

          }
        }
        getId(data, arr)
        arr.sort((a, b) => {
          return a - b
        })

      },
      //遍历树获取叶子节点id
      getTreeleafID(data, arr) {
        function getId(data) {
          for (var i in data) {
            if (data[i].leaf == "1") {
              arr.push(data[i].id)
            } else {
              getId(data[i].children, arr)
            }
          }
        }
        getId(data)
      },
      //角色绑定添加用户
      addUser(val) {
        this.userToRole.role_id = val.id
        this.addUserdialogVisible = true
        this.getUsers()
      },
      addUsersTrue() {
        let arr = []
        this.rolesList.forEach(item => {
          arr.push(item.id)
        });
        this.userToRole.idMsg = arr

        this.$http.post(globalConfig.server1 + 'role/updateUsersRoleId', this.userToRole).then(res => {

          if (res.data.response_code == '0') {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.rolesList = []
            this.userToRole = {}
            this.addUserdialogVisible = false
          } else {

          }
        })
        // this.addUserdialogVisible = false
      },
      //获取用户
      getUsers() {
        this.$http.post(globalConfig.server1 + 'user/getUsersByPage', this.userParams).then(res => {
          if (res.data.response_code === '0') {
            this.users = res.data.response_body.list
          } else {

          }
        })
      },
      //添加角色
      addRole() {
        this.addRoledialogVisible = true
      },
      addjuesezu() {
        let params = {
          "code": "7"
        }
        this.$http.post(globalConfig.server1 + 'tDictionaryController/getListForCode', params).then(res => {
          if (res.data.response_code === '0') {
            console.log(res.data.response_body);

            this.roleGroup = res.data.response_body
          } else {
            this.roleGroup = []
          }
        })
      },

      addRoleTrue() {
        if (!this.addRoleform.name) {
          this.$message({
            message: '请填写角色名称',
            type: 'warning'
          });
          return
        }
        if (!this.addRoleform.role_flag) {
          this.$message({
            message: '请选择角色组',
            type: 'warning'
          });
          return
        }

        let menus = JSON.stringify(routes)
        let obj = {
          role_flag: this.addRoleform.role_flag,
          name: this.addRoleform.name,
          decription: this.addRoleform.decription || '',
          menus: menus,
          status: this.addRoleform.status,
          menus_sidebar: menus
        }

        if (obj.status) {
          obj.status = "1"
        } else {
          obj.status = "0"
        }

        // this.addRoleform.menus = JSON.stringify(routes)
        this.$http.post(globalConfig.server1 + 'role/insertRole', obj).then(res => {

          if (res.data.response_code === '0') {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.search()
            this.addRoledialogVisible = false
            this.addRoleform = {
              status: true
            }
          } else {
            this.$message({
              message: res.data.response_desc,
              type: 'warning'
            });
          }
        })
      },
      //编辑角色
      editRole(val) {
        this.editRoleform = JSON.parse(JSON.stringify(val))
        this.editRoledialogVisible = true
      },

      editRoleTrue() {
        if (!this.editRoleform.name) {
          this.$message({
            message: '请填写角色名称',
            type: 'warning'
          });
          return
        }
        if (!this.editRoleform.role_flag) {
          this.$message({
            message: '请选择角色组',
            type: 'warning'
          });
          return
        }

        let status = ""
        if (this.editRoleform.status) {
          status = 1
        } else {
          status = 0
        }
        let params = {
          id: this.editRoleform.id,
          role_flag: this.editRoleform.role_flag,
          name: this.editRoleform.name,
          code: this.editRoleform.code,
          decription: this.editRoleform.decription,
          status: status,
          isdelete: "0"
        }
        this.$http.post(globalConfig.server1 + 'role/updateRole', params).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.search()
            this.editRoledialogVisible = false
          } else {
            this.$message({
              message: res.data.response_desc,
              type: 'warning'
            });
          }

        })
      },
      //删除角色
      delRole(val) {
        let pararms = {
          id: val.id,
          isdelete: 1
        }
        this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'whetherh',
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          this.delRoleTrue(pararms)
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      delRoleTrue(params) {
        this.$http.post(globalConfig.server1 + 'role/deleteRole', params).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.search()
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning'
            });
          }

        })
      },
      //数组去重
      diff(arr, arr1) {
        var a = [];
        var b = [];
        var r;
        for (var i = 0; i < arr.length; i++) {
          var index = arr1.indexOf(arr[i]);
          if (index != -1) {
            var r = a[i];
            for (var j = index; j < arr1.length; j++) {
              if (arr1[j] == arr[i]) {
                arr1.splice(j, 1);
                j = j - 1;
              }
            }
            for (var k = i + 1; k < arr.length; k++) {
              if (arr[k] == arr[i]) {
                arr.splice(k, 1);
                k = k - 1;
              }
            }
            arr.splice(i, 1);
            i = i - 1;
          }
        }
        return arr.concat(arr1);
      },
      //关闭模态窗
      closeModule() {
        this.addUserdialogVisible = false
        this.permissSettingdialogVisible = false
        this.editRoledialogVisible = false
        this.addRoledialogVisible = false
      },
      handleClose(tag) {
        this.rolesList.splice(this.rolesList.indexOf(tag), 1);
      },
      cleanTag() {
        this.rolesList = []
      },
      //查询表格数据--获取角色
      search() {

        this.$http.post(globalConfig.server1 + 'role/getRoleByPage', this.params).then(res => {
          if (res.data.response_code === '0') {
            this.tableData = res.data.response_body.list
            this.tableData.map(item => {
              if (item.status == 0) {
                item.status = false
              } else if (item.status == 1) {
                item.status = true
              }
            })
            this.total = res.data.response_body.totalCount
          } else {
            this.tableData = []
          }
        }).catch(err => {})
      },
    }
  }

</script>
<style scoped lang="scss">
  /* 添加用户 */
  .addrole {
    .left {
      float: left;
    }

    .title {
      font-size: 18px;
      line-height: 34px;
      background: #ccc;
      height: 34px;
      padding-left: 13px;
    }

    .quanxiancontent {
      height: 500px;
      overflow: auto;
    }

    .inputBox {
      padding: 5px 20px;
      text-align: center;
    }

    .content {
      padding-left: 30px;
      height: 500px;
      overflow: auto;
    }

    .cleanText {
      float: right;
      margin-right: 20px;
    }

    .tagBox {
      padding: 3px 0 3px 5px
    }
  }

  .asstopWrap {
    margin-top: 5px;
    overflow: hidden;

    .btnworpbox {
      float: right;

      button {
        margin-left: 20px;
      }
    }
  }

  .el-form-item__label {
    font-size: 16px;
  }

  .el-select-dropdown__item {
    font-size: 16px;
  }

  .deleteWords {
    margin: 20px 35px;
  }

  .pagings {
    margin-top: 20px;
    margin-left: 30%;
  }

  .el-form--inline .el-form-item {
    margin-right: 20px;
    margin-bottom: 22px;
  }

  .el-button--primary {
    border-width: 0.5px;
  }

</style>
<style lang="scss">
  #roleAuthorityManger {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .el-checkbox__label {
      font-size: 16px;
    }

    .el-tag {
      font-size: 16px;
    }

    .el-button--text {
      font-size: 16px;
    }

    .el-tree-node__label {
      font-size: 16px;
    }

    .el-dialog__body {
      font-size: 16px;
      overflow: auto;
      max-height: 550px;
    }
  }

</style>
