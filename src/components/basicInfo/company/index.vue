<template>
  <div id="basicInfoCompany">
    <div class="top">
      <el-form :inline="true" size="mini" style="width:100%;margin-bottom: 10px;margin-top: 5px;">
        <el-form-item label="单位名称：">
          <el-input  class="search" clearable v-model="params.name" placeholder="请输入单位名称"></el-input>
          
        </el-form-item>
        <el-form-item label="单位类型：">
          <el-select v-model="params.type" clearable placeholder="请选择单位类型">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class="bluebtnclass"  @click="search" style="margin-left:10px;">查询</el-button>
        </el-form-item>
        <el-form-item style="margin-right: 0px;">
          <el-button type="primary" size="medium" class="bluebtnclass" style="margin-left: 10px"
            @click="getsortData">&nbsp;排序</el-button>
            <el-button type="primary" size="medium"  class="bluebtnclass"   style="margin-left: 20px"
            @click="addcom">&nbsp;添加</el-button>
            <el-button :disabled="editBt" size="medium" type="primary"  class="bluebtnclass"  @click="editcom(edvalue)" style="margin-left: 20px">
              编辑</el-button>
            <el-button type="primary" size="medium" class="redsbtnclass"  style="margin-left: 20px;"
            @click="delAllCompany">&nbsp;删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <!-- {{multipleSelection}} -->
      <el-table :data="tableData" v-loading="tableLoading" element-loading-text="系统加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.6)" style="width: 100%" border @selection-change="handleSelectionChange" 
        stripe>
        <el-table-column type="selection" width="70">
        </el-table-column>
        <el-table-column label="单位类型" prop="parentName">
        </el-table-column>
        <el-table-column label="单位名称" prop="name">
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="editcom(scope.row)" style="color: #0841B4;background: none;">
              <span style="border-bottom: 1px solid #0841B4;">编辑</span></el-button>
            <el-button size="mini" type="text" @click="delcom(scope.row)" style="color: #f09800;background: none;">
              <span style="border-bottom: 1px solid #f09800;">删除</span></el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <div class="blockPage">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pageNum"
        :page-sizes="[15,30,50,100]" :page-size="params.pageCount" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--添加提示框-->
    <el-dialog title="新增被考核单位" width="410px"  v-dialogDrag :close-on-click-modal="false" :visible.sync="adddialogFormVisible" class="addcom proupClass">
      <div class="addUser" style="color:red;"><span class="req" style="color:red;">*</span>为必填项</div>
      <el-form ref="form" label-width="120px" :model="addcompanyForm">
        <el-form-item label="单位类型：" required>
          <el-select v-model="addcompanyForm.parent_id" clearable placeholder="请选择单位类型">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称：" required>
          <el-input autocomplete="off" clearable v-model="addcompanyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="机关类型：" required v-if="addcompanyForm.parent_id == '2'">
          <el-select v-model="addcompanyForm.sz_type" clearable placeholder="请选择机关类型">
            <el-option v-for="item in jiguanoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog" >取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="addcompany">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑提示框-->
    <el-dialog title="编辑被考核单位" width="410px"  v-dialogDrag :close-on-click-modal="false" :visible.sync="editdialogFormVisible" class="editcom proupClass">
      <div class="addUser"><span class="req">*</span>为必填项</div>
      <el-form ref="form" label-width="120px" :model="editForm">
        <el-form-item label="单位名称：" required>
          <el-input autocomplete="off" clearable v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="单位类型：" required>
          <el-select v-model="editForm.parent_id" clearable placeholder="请选择单位类型">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机关类型：" required v-if="editForm.parent_id == '2'">
          <el-select v-model="editForm.sz_type" clearable placeholder="请选择机关类型">
            <el-option v-for="item in jiguanoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="editCompany">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 排序弹窗 -->
    <el-dialog title="排序被考核单位" v-dialogDrag width="600px" :visible.sync="sortdialogFormVisible" :close-on-click-modal="false" class="editcom proupClass">
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
    name: "index",
    data() {
      return {
        dialogVisible: false,
        adddialogFormVisible: false,
        editdialogFormVisible: false,
        sortdialogFormVisible: false,
        addcompanyForm: { //添加单位信息
        },
        editForm: {}, //编辑修改单位信息
        params: {
          name: "",
          type: "",
          exam_type: "beexam_object",
          pageNum: 1,
          pageCount: 15
        },
        tableLoading: false,
        options: [{
          value: '2',
          label: '省直机关'
        }, {
          value: '3',
          label: '设区市'
        }],
        options2: [{
          value: '设区市',
          label: '设区市'
        }, {
          value: '省直一类',
          label: '省直一类'
        }, {
          value: '省直二类',
          label: '省直二类'
        }, {
          value: '省直三类',
          label: '省直三类'
        }],
        jiguanoptions: [{
          value: '1',
          label: '省直一类'
        }, {
          value: '2',
          label: '省直二类'
        }, {
          value: '3',
          label: '省直三类'
        }],
        tableData: [],
        total: 0,
        multipleSelection: [],
        sortData: [], //单位排序数据
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        sortChuanzhi: [],
        sortCan: [],
        // 需要修改的数据
        edvalue:{},
        // 按钮状态
        editBt:true
      }
    },
    methods: {
      //排序
      getsortData() {
        this.$http.post(globalConfig.server1 + 'department/selectExamTypeBySort', ).then(res => {
          if (res.data.response_code === "0") {
            this.sortdialogFormVisible = true
            this.sortData = res.data.response_body
         
          } else {
            this.prompt('warning', res.data.response_body)
          }
        })
      },
      collapse(moveNode, inNode, type) {
        if (moveNode.level == 2 && inNode.level == 2) {
          if (moveNode.parent.id == inNode.parent.id) {
            return type == 'prev';
          } else {}
        }
      },
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
              this.search()
            } else {
              this.prompt('warning', res.data.response_body)
            }
          })
        }

      },
      
      //删除
      delcom(val) {
        let params = {
          id: val.id,
          isdelete: 1
          // name:val.name
        }
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass:'whetherh',
          type: 'warning'
        }).then(() => {
          this.delCompany(params)
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      //省级机关添加
      shengjiselectAdd() {
        
        this.$http.post(globalConfig.server1 + 'department/insertDepartment', this.addcompanyForm).then(res => {
          if (res.data.response_code === "0") {
            this.search()
            this.adddialogFormVisible = false //添加单位
            this.$message({
              message: res.data.response_body,
              type: 'success'
            });
          } else {
            this.prompt('warning', res.data.response_body)
          }
        })
      },
      addcom() {
        this.addcompanyForm = {}
        this.adddialogFormVisible = true
      },
      //添加单位信息
      addcompany() {
        if (!this.addcompanyForm.name) {
          this.$message({
            message: '请填写单位名称',
            type: 'warning'
          });
          return
        }
        if (!this.addcompanyForm.parent_id) {
          this.$message({
            message: '请选择单位类型',
            type: 'warning'
          });
          return
        }
        
        if (this.addcompanyForm.parent_id == 2) {
         
          this.shengjiselectAdd()
          // this.adddialogFormVisible = false //添加单位
        } else {
          let query={
            name:this.addcompanyForm.name,
            parent_id:this.addcompanyForm.parent_id
          }
          this.$http.post(globalConfig.server1 + 'department/insertDepartment',query).then(res => {
            if (res.data.response_code === "0") {
              this.search()
              this.adddialogFormVisible = false //添加单位
              this.$message({
                message: res.data.response_body,
                type: 'success'
              });
            } else {
              this.prompt('warning', res.data.response_body)
            }
          })
        }
      },
      //省级机关编辑
      shengjiselectEait() {
        let params = {
          id: this.editForm.id,
          name: this.editForm.name,
          parent_id: this.editForm.parent_id,
          sz_type: this.editForm.sz_type
        }
        console.log(params);
        // return
        // let ddd = JSON.parse(JSON.stringify(params))
        this.$http.post(globalConfig.server1 + 'department/updateDepartment', params).then(res => {
          console.log(params);
          
          if (res.data.response_code === "0") {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.editdialogFormVisible = false
            this.search()
          } else {
            this.prompt('warning', res.data.response_body)
          }
        })
      },
      //编辑修改单位信息
      editcom(val) {
        
        if (val.name||val.parent_id) {
          this.editForm = JSON.parse(JSON.stringify(val))
          this.editdialogFormVisible = true
        }else{
          this.$message({
              message: '请先选择节点',
              type: 'error'
            })
        }
      },
      editCompany() {
        if (!this.editForm.name) {
          this.$message({
            message: '请填写单位名称',
            type: 'warning'
          });
          return
        }
        if (!this.editForm.parent_id) {
          this.$message({
            message: '请选择单位类型',
            type: 'warning'
          });
          return
        }
        if (this.editForm.parent_id == 2) {
          this.shengjiselectEait()
        } else {
          let params = {
            id: this.editForm.id,
            name: this.editForm.name,
            parent_id: this.editForm.parent_id,
            sz_type: ""
          }
          console.log(params);
          this.$http.post(globalConfig.server1 + 'department/updateDepartment', params).then(res => {
            if (res.data.response_code === "0") {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.editdialogFormVisible = false
              this.search()
            } else {
              this.prompt('warning', res.data.response_body)
            }
          })
        }
      },
      // 删除
      delCompany(params) {
        this.$http.post(globalConfig.server1 + 'department/deleteDepartmentById', params).then(res => {
          if (res.data.response_code === "0") {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.search()
          }
        })
      },
      //批量删除
      delAllCompany() {

        let ids = []
        this.multipleSelection.forEach((item) => {
          ids.push(item.id)
        })
        if (ids.length == 0) {
          this.$message({
            message: '请勾选要删除的单位',
            type: 'warning'
          });
          return
        }
        let params = {
          idMsg: JSON.stringify(ids),
          isdelete: 1
        }
      
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass:'whetherh',
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          this.$http.post(globalConfig.server1 + 'department/deleteDepartentById', params).then(res => {
            if (res.data.response_code === "0") {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.search()
            }
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });

      },
      //分页
      handleSizeChange(val) {
        this.params.pageCount = val;
        this.search()
      },
      handleCurrentChange(val) {
        this.params.pageNum = val
        this.search()
      },
      handleSelectionChange(val) {
        this.edvalue=val[0]
        
        if (val.length>1||val.length==0) {
          this.editBt=true
        }else{
          this.editBt=false
        }
        this.multipleSelection = val;
      },
      //查询单位信息
      search() {
        this.tableLoading = true
        this.tableData = []
        this.$http.post(globalConfig.server1 + 'department/getDepartmentByPage', this.params).then(res => {
          if (res.data.response_code === "0") {
            this.tableLoading = false
            let arr = res.data.response_body.list

            arr.forEach((item, index) => {
              if (item.id != 1 && item.id != 2 && item.id != 3) {
                this.tableData.push(item)
              }
            })

            this.total = res.data.response_body.totalCount

            if (res.data.response_body.list == []) {
              this.$message({
                type: 'success',
                message: '暂无数据!'
              });
            }

          } else {
            this.tableData = []
          }
        })
      },
      closeDialog() {
        this.adddialogFormVisible = false
        this.editdialogFormVisible = false
        this.sortdialogFormVisible = false
      }
    },
    mounted() {
      this.search()
    }
  }

</script>

<style lang="scss" scoped>
  #basicInfoCompany {
    box-sizing: border-box;
  }
  
  .blockPage {
    margin-right: 30%;
  }

  .addUser {
    color: #ccc;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .req {
    color: red;
  }

  .top {
    margin: 22px 0; 
    display: flex;
    justify-content: center;
    align-items: center ;
  }

</style>
<style lang="scss">

  #basicInfoCompany {
    .el-form-item__label {
      font-size: 16px;
      line-height: 38px;
    }
    
    .el-loading-spinner .el-loading-text {
      font-size: 40px;
    }

    .el-loading-spinner i {
      font-size: 40px;
    }

		.top .el-input__inner {
			padding-left:25px;
		}
		
    .el-input__inner{
      height: 38px;
      line-height: 38px;
      background-color: #FFF !important;
      border: 1px solid #DCDCDC;
      box-sizing: border-box;
      border-radius:3px;
    }

    .el-form-item__content {
      position: relative;
      border-radius: 19px;
    }

    .el-form-item__content>i {
      position: absolute;
      color: #999999;

      width: 18px;
      height: 18px;
      display: block;
      top: 6px;
      left: 18px;
      font-size: 18px;
      z-index: 3;
    }

    .sortBox {
      height: 500px;
      overflow: auto;
    }
  }

</style>
