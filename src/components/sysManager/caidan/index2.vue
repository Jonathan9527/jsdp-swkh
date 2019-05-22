<template>
  <div id="menuManger">
    <el-container>
      <el-aside width="3.37rem">
        <el-scrollbar class="content_scroll">
          <div class="btnGroup">
            <div class="btns">
              <el-button type="primary" size="medium" @click="addEditMeun('add')">&nbsp;新增</el-button>
              <el-button type="primary" size="medium" @click="shanchuDepart" :disabled="firstNodeId === menuNodeData.id">&nbsp;删除</el-button>
              <el-button type="primary" size="medium" @click="addEditMeun('edit')" :disabled="firstNodeId === menuNodeData.id">&nbsp;修改</el-button>
              <el-button type="primary" size="medium" @click="sortClick">&nbsp;排序</el-button>
            </div>
          </div>
          <el-tree :expand-on-click-node="false" class="userTree" :data="meunsTreeData" :props="defaultProps"
            @node-click="getMenuNode" :default-expanded-keys="morenArr" node-key="id">
            <span slot-scope="{ node, data }" :class="nodeStyle(node)">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </el-aside>
    </el-container>
    <!-- 添加&&修改菜单弹窗 -->
    <el-dialog title="添加菜单" :close-on-click-modal="false" :visible.sync="addAndEditDialogVisible" width="4.10rem"  class="proupClass" >
      <div>
        <el-form 
          :model="addEditMenuForm" 
          label-width="1.20rem" 
          :rules="addEditMenuFormRules" 
          ref="addEditMenuForm">
          <el-form-item label="菜单层级：">
            <el-select v-model="addEditMenuForm.grade" placeholder="请选择" size="medium" disabled>
              <el-option v-for="item in gradeOptions" :key="item.label" :label="item.label" :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级菜单名称：" v-if="!(addEditMenuForm.grade=='一级菜单')">
            <el-input v-model="addEditMenuForm.menuparentName" size="medium" disabled></el-input>
          </el-form-item>
          <el-form-item label="菜单名称：" prop="menuName">
            <el-input v-model="addEditMenuForm.menuName" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标：" v-if="addEditMenuForm.grade=='一级菜单'" prop="menuicon">
            <el-input v-model="addEditMenuForm.menuicon" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径：" prop="menulujin">
            <el-input v-model="addEditMenuForm.menulujin" size="medium"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button  class="proupbtnquxiao"  @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="addEditMenuTrue">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 排序弹窗 -->
    <el-dialog title="排序" width="4.10rem" :visible.sync="sortdialogFormVisible" class="editcom proupClass">
      <div class="sortBox">
        <el-tree :data="sortData" node-key="id" default-expand-all draggable :allow-drop="collapse" @node-drop="handleDrop">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="sortgaibianTrue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        /**
         * 菜单树
         */
        addAndEditDialogVisible: false, //添加&&修改菜单
        menuNodeData: {},//获取点击的菜单节点
        addEditMenuForm: {
          grade:"",
          menuparentName:"",
          menuName:"",
          menuicon:"",
          menulujin:""
        }, //添加部门表单
        addEditMenuFormRules:{
          menuName: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'}
          ],
          menuicon: [
            {required: true, message: '请输入菜单图标', trigger: 'blur'}
          ],
          menulujin: [
            {required: true, message: '请输入路径', trigger: 'blur'}
          ]
        },
        firstNodeId:"",



        editDepartDialogVisible: false, //修改部门弹窗
        addUserDialogVisible: false, //添加用户弹窗
        editUserDialogVisible: false, //编辑用户弹窗
        sortdialogFormVisible: false, //单位排序隐藏
        xiugaiMenuForm: {
          menuparentName: "",
          menuname: '',
          menulujin: "",
          grade: "",
          menuicon: ''
        }, //修改部门表单
        addUserForm: {
          status: true
        }, //添加用户表单
        editUserForm: {}, //编辑用户表单
        params: { //查询数据传值
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
        total: 1, //数据总条数
        idBatch: [], //多选用户删除
        gradeOptions: [], //部门下拉框
        meunsTreeData: [],
        defaultProps: {
          children: 'children',
          label: "label"
        },
        userTableData: [], //查询用户表格数据
        sortData: [], //排序弹窗数据
        
        lujinshow: false,
        sortChuanzhi: [],
        sortCan: [],
        morenArr: []
      }
    },

    methods: {
      /**
       * 查询菜单树
       */
      searchMunes() {
        this.meunsTreeData = []
        this.morenArr = []
        this.$http.post(globalConfig.server1 + 'button/select-button-tree').then(res => {
          if (res.data.code == "200") {
            this.meunsTreeData = [res.data.data]
            this.firstNodeId = res.data.data.id
            this.morenArr = res.data.data.children.map(el=>el.id)
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
      },
      /**
       * 获取点击的节点
       */
      getMenuNode(val) {
        console.log(val);
        
        this.menuNodeData = val
        if (this.menuNodeData.leaf == "1") {
          this.lujinshow = true
        } else {
          this.lujinshow = false
        }
      },
      /**
       * 添加修改菜单
       */
      addEditMeun(type) {
        if (JSON.stringify(this.menuNodeData) == "{}") {
          return this.$message({
            type: 'warning',
            message: "请选择节点"
          });
        }
        this.addEditMenuForm.type = type

        if(type === "add"){
          this.addEditMenuForm.menuparentName = this.menuNodeData.label
          if (!this.menuNodeData.grade) {
            this.addEditMenuForm.grade = "一级菜单"
          }
          if (this.menuNodeData.grade == "一级菜单") {
            this.addEditMenuForm.grade = "二级菜单"
          } else if (this.menuNodeData.grade == "二级菜单") {
            this.addEditMenuForm.grade = "三级菜单"
          } else if (this.menuNodeData.grade == "三级菜单") {
            this.addEditMenuForm.grade = "四级菜单"
          }

        }else {
          this.$http.post(globalConfig.server1 + 'button/select-name-id', {id: this.menuNodeData.parent_id}).then(res => {
          if (res.data.code == "200") {
            console.log(res.data.data);
            
            this.addEditMenuForm.menuparentName = res.data.data

            this.addEditMenuForm.grade = this.menuNodeData.grade
            this.addEditMenuForm.menuName = this.menuNodeData.label
            this.addEditMenuForm.menuicon = this.menuNodeData.icon
            if (!this.menuNodeData.path) {
              this.addEditMenuForm.menulujin = ""
            } else {
              this.addEditMenuForm.menulujin = this.menuNodeData.path.split("/")[1]
            }
            console.log(this.addEditMenuForm);
            
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
        }
        this.addAndEditDialogVisible = true

      },
      addEditMenuTrue() {
        this.$refs['addEditMenuForm'].validate((valid) => {
          if (valid) {
            let url = this.addEditMenuForm.type==="add"?"button/insert-button":"button/update-button"
            
            let params = {
              button: {
                name: this.addEditMenuForm.menuName || "",
                parentId: this.menuNodeData.id,
                path: this.addEditMenuForm.menulujin || "",
                grade: this.addEditMenuForm.grade || ""
              },
              buttonIcon: {
                iconFiles: this.addEditMenuForm.menuicon || ""
              }
            }
            for (let key in params.button) {
              if (params.button[key] == "") {
                return this.$message({
                  type: 'warning',
                  message: "有空值"
                });
              }
            }
            this.$http.post(globalConfig.server1 + 'button/insert-button', params).then(res => {
              if (res.data.code == "200") {
                this.addAndEditDialogVisible = false
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
                this.addEditMenuForm = {}
                this.menuNodeData = {}
                this.searchMunes()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                });
              }
            })
          } else {
              return false;
            }
          });
        
      },


      //获取层级
      getgrade() {
        this.$http.post(globalConfig.server1 + 'button/select-grade').then(res => {
          this.gradeOptions = []
          if (res.data.code == "200") {
            // this.meunsTreeData.push(res.data.data)
            let dengji = res.data.data
            dengji.forEach(item => {
              let obj = {
                label: item
              }
              this.gradeOptions.push(obj)
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
      },
      

     
      // 菜单删除确认
      shanchuDepart() {
        if (JSON.stringify(this.menuNodeData) == "{}") {
          return this.$message({
            type: 'warning',
            message: "请选择节点"
          });
        }

        this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          customClass: "menuMangerDel",
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass:'whetherh',
          closeOnClickModal:false,
          type: 'warning',
        }).then(() => {
          this.deletecaidan()
        })
      },
      // 删除菜单
      deletecaidan() {

        let params = {
          id: this.menuNodeData.id
        }
        this.$http.post(globalConfig.server1 + 'button/delete-button', params).then(res => {
          if (res.data.code == "200") {
            this.$message({
              type: 'success',
              message: res.data.message
            });
            this.menuNodeData = {}
            this.searchMunes()
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
      },
      //根据菜单等级查询所拥有的菜单
      getcaidan(id) {
        let params = {
          id: id
        }
        this.$http.post(globalConfig.server1 + 'button/select-name-id', params).then(res => {
          if (res.data.code == "200") {
            // this.meunsTreeData.push(res.data.data)
            this.xiugaiMenuForm.menuparentName = res.data.data

            this.xiugaiMenuForm.grade = this.menuNodeData.grade
            this.xiugaiMenuForm.menuName = this.menuNodeData.label
            this.xiugaiMenuForm.menunicon = this.menuNodeData.icon
            if (!this.menuNodeData.path) {
              this.xiugaiMenuForm.menulujin = ""
            } else {
              this.xiugaiMenuForm.menulujin = this.menuNodeData.path.split("/")[1]
            }
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
      },
      //修改菜单
      xiugaiMenus() {
        if(this.menuNodeData.id =="1"){
          this.menuNodeData = {}
        }
        if (JSON.stringify(this.menuNodeData) == "{}") {
          return this.$message({
            type: 'warning',
            message: "请选择节点"
          });
        }

        let params = {
          id: this.menuNodeData.parent_id
        }
        this.$http.post(globalConfig.server1 + 'button/select-name-id', params).then(res => {
          if (res.data.code == "200") {
            // this.meunsTreeData.push(res.data.data)
            this.xiugaiMenuForm.menuparentName = res.data.data

            this.xiugaiMenuForm.grade = this.menuNodeData.grade
            this.xiugaiMenuForm.menuName = this.menuNodeData.label
            this.xiugaiMenuForm.menuicon = this.menuNodeData.icon
            if (!this.menuNodeData.path) {
              this.xiugaiMenuForm.menulujin = ""
            } else {
              this.xiugaiMenuForm.menulujin = this.menuNodeData.path.split("/")[1]
            }
            this.editDepartDialogVisible = true
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })



      },
      //修改确认
      xiugaiMenusTrue() {


        let params = {
          button: {
            id: this.menuNodeData.id,
            name: this.xiugaiMenuForm.menuName || "",
            parentId: this.menuNodeData.parent_id,
            path: this.xiugaiMenuForm.menulujin || "/",
            grade: this.xiugaiMenuForm.grade || ""
          },
          buttonIcon: {
            iconFiles: this.xiugaiMenuForm.menuicon
          }
        }
        if (params.button["name"] == "") {
          return this.$message({
            type: 'warning',
            message: "有空值"
          });
        }
        if(this.menuNodeData.leaf == "1"){
          if (params.button["path"] == "/") {
          return this.$message({
            type: 'warning',
            message: "有空值"
          });
        }
        }
        
        this.$http.post(globalConfig.server1 + 'button/update-button', params).then(res => {
          if (res.data.code == "200") {
            this.$message({
              type: 'success',
              message: res.data.message
            });
            this.menuNodeData = {}
            this.searchMunes()
            this.editDepartDialogVisible = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
      },
      // 排序
      sortClick() {

        this.sortdialogFormVisible = true
      },
      //排序
      handleDrop(draggingNode, dropNode, dropType, ev) {
        let arr = dropNode.parent.data.children
        let arr1 = []
        arr.forEach((item, index) => {
          let obj = {
            id: item.id,
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
      //排序确认
      sortgaibianTrue() {

        if (this.sortCan.length == 0) {
          this.sortdialogFormVisible = false
        } else {
          this.$http.post(globalConfig.server1 + 'button/button-sorts', this.sortCan).then(res => {
            if (res.data.code == "200") {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
              this.sortCan = []
              this.sortdialogFormVisible = false
              this.searchMunes()
            } else {
              this.prompt('warning', res.data.message)
            }
          })
        }
      },

      nodeStyle(node) {
        if (node.level == 1) {
          return "firstStyle"
        } else if (node.level == 2) {
          return "secondStyle"
        }
      },
      handleSelectionChange(val) {
        this.idBatch = val;
      },
      handleSizeChange(val) {
        this.params.pageCount = val

      },
      handleCurrentChange(val) {
        this.params.pageNum = val

      },
      closeDialog() {
        this.sortdialogFormVisible = false
        this.addAndEditDialogVisible = false
        this.editDepartDialogVisible = false
        this.addUserDialogVisible = false
        this.editUserDialogVisible = false

        this.xiugaiMenuForm = {
          menuparentName: "",
          menuname: '',
          menulujin: "",
          grade: "",
          menuicon: ''
        }
        this.addEditMenuForm = {}

      },



      addUser() { //添加用户
        this.addUserDialogVisible = true
      },
      addensure() {
        if (this.addUserForm.status) {
          this.addUserForm.status = 1
        } else {
          this.addUserForm.status = 0
        }

        let params = JSON.parse(JSON.stringify({ ...this.addUserForm
        }))

      },
      //开关
      kaiguan(val) {
        let params = {
          "id": val.id,
          "status": 1
        }
        if (val.status) {
          params.status = 1
        } else {
          params.status = 0
        }

      },
      //编辑用户
      editUser(val) {
        this.editUserForm = JSON.parse(JSON.stringify(val))

        this.editUserDialogVisible = true
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


        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      //全部删除用户
      delcadAll() {
        if (this.idBatch.length != 0) {
          this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass:'whetherh',
            closeOnClickModal:false,
            type: 'warning'
          }).then(() => {
            let arr = []
            this.idBatch.forEach((item) => {
              arr.push(item.id)
            })

            let params = {
              idMsg: arr,
              "isdelete": "1"
            }



          }).catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // });
          });
        } else {
          this.$message({
            message: '请选择删除项',
            type: 'warning'
          });
        }

      },


      collapse(moveNode, inNode, type) {
        if (moveNode.level == 2 && inNode.level == 2) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev';
          } else {}
        }
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


    },
    mounted() {
      this.searchMunes()
      this.getgrade()
    }

  }

</script>

<style scoped lang="scss">
  .el-aside {
    height: 8.30rem;
    overflow: auto;
    background-color: #EAF3FA;
    color: #333;
  }

  .el-main {
    margin: 0 !important;
    color: #333;
    margin-left: .24rem !important;

  }

  .content_scroll {
    height: 100%;
    width: 3.37rem;

    .btnGroup {
      width: 100%;
      margin: 0 auto;

      .btns {
        width: 100%;
        margin: .26rem auto;
        padding: 0 .1rem;
        text-align: center;
        .is-disabled{
          background-color: #a0cfff;
          border-color: #a0cfff;
        }
        button {
          width: 20%;
          padding: .1rem;
          font-size: .16rem;
          background-color: #0068D3;

        }
      }
    }

  }

  .userTableTitle {
    padding: .22rem 0 .33rem 0;
    font-size: .18rem;
    font-weight: bold;
  }

  .deltip {
    color: red;
    font-size: .14rem;
    padding: .12rem 0;
  }

  .addUsertip {
    color: #ccc;
    font-size: .12rem;
    margin-bottom: .10rem;

    .req {
      color: red;
    }
  }


  .paging {
    margin-top: .20rem;
    margin-left: 30%;
    margin-bottom: .20rem;
  }

  .el-button--text {
    font-size: .16rem;
  }

</style>
<style lang="scss">
  #menuManger {

    .content_scroll .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .userTree .is-current>.el-tree-node__content {
      background-color: #0068d3;
      color: #fff;
    }
    .userTree {
      margin-top: 0rem;
      background-color: #EAF3FA;
    }

    .firstStyle {
      font-size: .18rem;
      line-height: .30rem;
    }

    .secondStyle {
      font-size: .16rem;
      line-height: .16rem;
    }

    .el-form-item__label {
      font-size: .16rem;
    }

    /* 弹窗顶部样式 */
    .el-dialog__header {
      background: #F8F8F8;
      height: .54rem;
      border-bottom: .01rem solid #DCDCDC;

      .el-dialog__title {
        font-size: .16rem;
        color: #333333;
      }

    }

    .el-dialog__body {
      overflow: auto;
      max-height: 550px;
    }

    .el-dialog__footer {
      text-align: center;

      .el-button {
        width: .90rem;
        height: .38rem;
        border-radius: .03rem;

        &.el-button--info {
          color: #666;
          background: rgba(255, 255, 255, 1);
          border: .01rem solid rgba(191, 191, 191, 1);
          margin-right: .24rem;
        }

        &.el-button--primary {
          color: #fff;
          background: #1960CB;
        }
      }

    }
  }

  /* 删除弹窗 */
  .menuMangerDel {
    /* 弹框样式 */
    &.el-message-box {
      .el-message-box__header {
        padding: 0;
        .el-message-box__title {
          height: .54rem;
          line-height: .54rem;
          text-align: center;
          font-weight: bold;
          background: rgba(242, 242, 242, 1);
        }
      }

      .el-message-box__content {
        padding-top: .20rem;
        padding-left: .80rem;
        margin-bottom: .30rem;
      }

      .el-message-box__btns {
        height: .42rem;
        text-align: center;
        padding: 0;
        display: flex;
        align-items: center;
        padding-bottom: .15rem !important;
        justify-content: center;
        .el-button {
          width: .90rem;
          height: .38rem;
          border-radius: .03rem;
          &:nth-of-type(1) {
            color: #333;
            background: rgba(255, 255, 255, 1);
            border: .01rem solid rgba(191, 191, 191, 1);
            margin-right: .24rem;
          }
        }
      }
    }
  }

</style>
