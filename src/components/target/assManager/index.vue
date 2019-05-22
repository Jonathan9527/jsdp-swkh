<template>
  <div id="assManager" style="margin-top:15px">

    <el-tabs type="border-card" v-model="activeName" style="padding: 20px 0;">
      <el-tab-pane :label="item.label" v-for="(item,index) in assMangerTab" :key="index" :name="item.label">
        <div>
          <el-button type="primary" class="btns bluebtnclass" @click="addTarget" size="medium">添加</el-button>
          <el-button type="primary" class="btns bluebtnclass" :disabled=!anjy @click="delTarget" size="medium">删除</el-button>
          <el-button type="primary" class="btns bluebtnclass" :disabled=!anjy @click="editTarget" size="medium">修改</el-button>
          <el-button type="primary" class="bluebtnclass" size="medium" @click="sortClick">&nbsp;排序</el-button>
        </div>
        <el-select v-model="form.city" placeholder="请选择" v-if="item.label=='高质量个性'" @change="gaizhiliangSearch" style="margin-top: 20px;">
          <el-option size="mini" v-for="item in cityOptions" :key="item.name" :label="item.name" :value="item.name">
          </el-option>
        </el-select>

        <el-tree ref="assmatree" v-loading="tableLoading" element-loading-text="系统加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.6)" :expand-on-click-node="false" class="assManagerTree" :data="targetTree" :props="defaultProps"
          @node-click="dainji" node-key="id" :default-expanded-keys=scarr2>
          <span slot-scope="{ node, data }" :class="nodeStyle(node)">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>

      </el-tab-pane>

    </el-tabs>

    <!-- 新增指标 -->
    <el-dialog title="新增指标"  v-dialogDrag :close-on-click-modal="false" :visible.sync="addTargetdialogVisible" width="600px" class="proupClass">
      <div>
        <el-form ref="form" :model="form" label-width="130px" onsubmit="return false">
          <el-form-item label="上级指标名称：">
            {{this.tianjialable}}
          </el-form-item>
          <el-form-item label="指标名称：">
            <el-input v-model="form.newName"></el-input>
          </el-form-item>
          <el-form-item label="指标分值：">
            <el-input v-model="form.score"></el-input>
          </el-form-item>
          <el-form-item label="指标内容：">
            <el-input v-model="form.content"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao btns" @click="closeDialog" >取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="addTargetdialogVisible2">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除指标 -->
    <el-dialog title="删除指标"   v-dialogDrag :close-on-click-modal="false" :visible.sync="delTargetdialogVisible" width="30%" class="proupClass">
      <div>
        <div class="delTip">*请先确定该指标没有下级指标</div>
        <div class="delContent">是否删除当前指标</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao btns" @click="closeDialog" >取 消</el-button>
        <el-button type="primary" class="proupbtnqueding"  @click="delTargetdialogVisible2">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改指标 -->
    <el-dialog title="修改指标"  v-dialogDrag  :close-on-click-modal="false" :visible.sync="editTargetdialogVisible" width="600px" class="proupClass">
      <div>
        <div class="delTip">*指标修改后，请核实上下级指标信息</div>
        <el-form ref="form" :model="form" label-width="120px" onsubmit="return false">
          <el-form-item label="指标名称：">
            <el-input v-model="form.newName2"></el-input>
          </el-form-item>
          <el-form-item label="指标分值：">
            <el-input v-model="form.score2"></el-input>
          </el-form-item>
          <el-form-item label="指标内容：">
            <el-input v-model="form.content2"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao btns" @click="closeDialog" >取 消</el-button>
        <el-button type="primary"  class="proupbtnqueding"  @click="editTargetdialogVisible2">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 排序弹窗 -->
    <el-dialog title="排序" width="600px"   v-dialogDrag  :close-on-click-modal="false" :visible.sync="sortdialogFormVisible" class="editcom proupClass">
      <div class="sortBox">
        <el-tree :data="sortData" node-key="id" default-expand-all draggable :allow-drop="collapse" @node-drop="handleDrop">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="closeDialog">取 消</el-button>
        <el-button type="primary"  class="proupbtnqueding"  @click="sortgaibianTrue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
  #assManager {
    .assManagerTree {
      margin-top: 20px;
    }

    .firstStyle {
      font-size: 25px;
      line-height: 30px;
    }

    .secondStyle {
      font-size: 20px;
      line-height: 20px;
    }

    .el-tabs__nav  {
      width: 100%;
    }

  }

</style>
<script>
  export default {
    data() {
      return {
        tableLoading: false,
        addTargetdialogVisible: false, //新增指标弹窗
        delTargetdialogVisible: false, //删除指标弹窗
        editTargetdialogVisible: false, //修改指标弹窗
        sortdialogFormVisible: false,
        activeName: "",
        assMangerTab: [{
          label: "高质量共性"
        }, {
          label: "高质量个性"
        }, {
          label: "党建"
        }],
        targetTree: [],
        defaultProps: {
          children: 'children',
          label: "label"
        },
        form: {
          newName: "",
          score: ""
        },
        cityOptions: [],
        sortData: [],
        sortChuanzhi: [],
        sortCan: [],
        tianjiaid: "",
        tianjialable: "",
        tianjiaidParent: "",
        tianjiaLev: "",
        qurey:{},
        fjsz:0,
        anjy:true,
        scarr2:[]
      }
    },

    methods: {
      dainji(data, val) {
        if (!data.parent_id) {
          this.fjsz=1
          this.anjy=false
        }else{
          this.fjsz=0
          this.anjy=true
          this.qurey.id=data.id
          this.$http.post(globalConfig.server3 + 'kpi/selectKpiById',this.qurey).then(res => {
            if (res.data.response_code === "0") {
                this.form.newName2=res.data.response_body.name
                this.form.score2=res.data.response_body.value
                this.form.content2=res.data.response_body.content
            }
          })
        }
        
        this.form.newName2=data.label
        this.tianjiaid = data.id
        this.tianjiaidParent = data.parent_id
        this.tianjialable = data.label
        this.tianjiaLev = val.level
      },
      closeDialog() { //关闭弹窗
        this.form={}
        this.addTargetdialogVisible = false
        this.delTargetdialogVisible = false
        this.editTargetdialogVisible = false
        this.sortdialogFormVisible = false
      },
      nodeStyle(node) { //tree行级样式
        if (node.level == 1) {
          return "firstStyle"
        } else if (node.level == 2) {
          return "secondStyle"
        }
      },

      //添加
      addTarget() {
        if (this.tianjiaid == "") {
          this.$message({
            type: 'success',
            message: '请选择节点！'
          })
        } else if (this.tianjiaLev == 4){
          this.$message({
            type: 'success',
            message: '此节点不可选！'
          })
        }else {
          this.addTargetdialogVisible = true
        }
      },
      addTargetdialogVisible2() {
        let params = {
          name: this.form.newName,
          value: this.form.score,
          content: this.form.content,
          parent_Id: this.tianjiaid,
          remark: "",
          kpi_level: this.tianjiaLev
        }
      
        this.$http.post(globalConfig.server3 + 'kpi/insertKpi', params).then(res => {
          if (res.data.response_code === "0") {
            this.$message({
              type: 'success',
              message: '添加成功！'
            })

            if (this.activeName == "党建") {
              this.search()
            } else if (this.activeName == "高质量个性") {
              this.gaizhiliangSearch()
            } else if (this.activeName == "高质量共性") {
              this.getgongxing()
            }

            this.form.newName = ""
            this.form.score = ""
            this.form.content = ""
            this.tianjialable = ""
          }
        })
        this.addTargetdialogVisible = false

      },

      //删除
      delTarget() {
        if (this.fjsz) {
            this.form.newName=""
            this.delTargetdialogVisible = false
        }else{
          if (this.tianjiaid == "") {
            this.$message({
              type: 'success',
              message: '请选择节点！'
            })
          } else {
            this.delTargetdialogVisible = true
          }
        }
      },
      delTargetdialogVisible2() {
        let params = {
          id: this.tianjiaid,
        }
        this.$http.post(globalConfig.server3 + 'kpi/deleteKpi', params).then(res => {
          if (res.data.response_code === "0") {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })

            if (this.activeName == "党建") {
              this.search()
            } else if (this.activeName == "高质量个性") {
              this.gaizhiliangSearch()
            } else if (this.activeName == "高质量共性") {
              this.getgongxing()
            }

            this.form.newName = ""
            this.form.score = ""
            this.form.content = ""
            this.tianjialable = ""
          }
        })
        this.delTargetdialogVisible = false
      },

      //修改
      editTarget() {
        if (this.fjsz) {
            this.form.newName=""
            this.editTargetdialogVisible = false
        }else{
          if (this.tianjiaid == "") {
            this.$message({
              type: 'success',
              message: '请选择节点！'
            })
          } else {
            this.editTargetdialogVisible = true
          }
        }
      },
      editTargetdialogVisible2() {

        let params = {
          id: this.tianjiaid,
          name: this.form.newName2,
          value: this.form.score2,
          content: this.form.content2,
        }
        this.$http.post(globalConfig.server3 + 'kpi/updateKpi', params).then(res => {
          if (res.data.response_code === "0") {
            this.$message({
              type: 'success',
              message: '修改成功！'
            })
            if (this.activeName == "党建") {
              this.search()
            } else if (this.activeName == "高质量个性") {
              this.gaizhiliangSearch()
            } else if (this.activeName == "高质量共性") {
              this.getgongxing()
            }
            this.form.newName = ""
            this.form.score = ""
            this.form.content = ""
            this.tianjialable = ""
          }
        })
        this.editTargetdialogVisible = false

      },

      searchOption() {
        let params = {
          name: "高质量发展个性指标"
        }
        this.$http.post(globalConfig.server3 + 'kpi/queryKpiByParentId', params).then(res => {
          if (res.data.response_code === "0") {
            this.cityOptions = res.data.response_body

          }
        })
      },
      gaizhiliangSearch() {
        this.tableLoading = true
        let params = {
          name: this.form.city,
        }
        let arr = []
        this.$http.post(globalConfig.server3 + 'kpi/queryGexingZhibiao', params).then(res => {
          if (res.data.response_code === "0") {
            arr.push(res.data.response_body)
            this.targetTree = arr

            var carr=this.targetTree
              
              console.log(carr);
              
              for (let i = 0; i < carr.length; i++) {
                this.scarr2.push(carr[i].id)
              }
              console.log(this.scarr2);
            this.sortData = JSON.parse(JSON.stringify(arr))
            this.tableLoading = false
          }
        })
      },

      search() {
        this.tableLoading = true
        let arr = []
        this.$http.post(globalConfig.server3 + 'kpi/queryZhibiao1', ).then(res => {
          if (res.data.response_code == "0") {
            arr.push(res.data.response_body)
            this.targetTree = arr

            var carr=this.targetTree
              
              console.log(123);
              
              for (let i = 0; i < carr.length; i++) {
                this.scarr2.push(carr[i].id)
              }
              console.log(this.scarr2);
            this.sortData = JSON.parse(JSON.stringify(arr))
            this.tableLoading = false
          } else {
      
          }
        })

      },
      getgongxing() {
        this.tableLoading = true
        let arr = []
        this.$http.post(globalConfig.server3 + 'kpi/queryZhibiao2', ).then(res => {
          if (res.data.response_code == "0") {
            arr.push(res.data.response_body)
            this.targetTree = arr

            var carr=this.targetTree
              
              console.log(123);
              
              for (let i = 0; i < carr.length; i++) {
                this.scarr2.push(carr[i].id)
              }
              console.log(this.scarr2);
            this.sortData = JSON.parse(JSON.stringify(arr))
            this.tableLoading = false
          } else {
    
          }
        })
      },
      // 排序
      sortClick() {
        this.sortdialogFormVisible = true
      },
      collapse(moveNode, inNode, type) {
        if (this.activeName == "党建") {
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
        } else if (this.activeName == "高质量个性") {
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
        } else if (this.activeName == "高质量共性") {
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
      sortgaibian() {
   
        if (this.sortChuanzhi.length == 0) {
          return
        } else {
          let arr = this.sortChuanzhi


        }

        // this.sortgaibianTrue()
      },
      sortgaibianTrue() {
        if (this.sortCan.length == 0) {
          this.sortdialogFormVisible = false
        } else {
          this.$http.post(globalConfig.server1 + 'kpi/updateKpiSortById', this.sortCan).then(res => {
            if (res.data.response_code === "0") {
              this.$message({
                message: res.data.response_body,
                type: 'success'
              });
              this.sortCan = []
              this.sortdialogFormVisible = false
              // this.getdepartTree()
              if (this.activeName == "党建") {
                this.search()
              } else if (this.activeName == "高质量个性") {
                this.gaizhiliangSearch()
              } else if (this.activeName == "高质量共性") {
                this.getgongxing()
              }
            } else {
              this.prompt('warning', res.data.response_body)
            }
          })
        }
      }

    },
    watch: {
      activeName(val) {
        if (val == "党建") {
          this.search()
        } else if (val == "高质量个性") {
          this.targetTree = []
          this.form.city = ''
        } else if (val == "高质量共性") {
          this.getgongxing()
        }
      }
    },
    mounted() {
      // this.targetTree = JSON.parse(JSON.stringify(dangjian))
      // this.search()
      this.activeName = "高质量共性"
      this.searchOption()
    }
  }

</script>

<style scoped lang="scss">
  // .btns {
  //   background: #0841B4;
  //   color: #fff;
  // }

  .delTip {
    color: red;
    font-size: 12px;
    padding: 10px 0;
  }

  .delContent {
    text-align: center;
    font-size: 20px;
    margin: 20px 0;
  }

  .btnGroup {
    margin-bottom: 20px;
  }

  /* .sortBox {
    height: 550px;
    overflow: auto;
  } */

</style>
<style lang="scss">
  #assManager {
    .el-loading-spinner .el-loading-text {
      font-size: 40px;
    }
    .el-dialog__body {
      overflow: auto;
      max-height: 550px;
    }
    .el-loading-spinner i {
      font-size: 40px;
    }

    .el-tree-node {
      white-space: inherit;

    }

    .el-tree {
      line-height: 2;
    }

    .el-tree-node__content {
      height: auto;
    }


    .el-tabs--border-card {
      border: 0
    }

    .el-tabs__nav-scroll {
      border-top: 1px solid #e4e7ed;
    }

    .el-tabs--border-card>.el-tabs__header {
      width: 25%;
      margin: 0 auto;
      border: 1px solid #0841B4;
      border-radius: 5px;
      background-color: #fff
    }

    .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
      color: #999;
    }

    .el-tabs__item {
      font-size: 16px;
      text-align: center;
      width: 34%;
      border-left:1px solid #0841B4
    }

    .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
      background-color: #0841B4;
      color: #fff
    }

    .el-tabs__nav-scroll {
      border: 0;
    }

    .el-tabs__item {
      height: 42px;
      line-height: 42px;
    }

    .el-tabs__nav-wrap {
      margin-bottom: 0
    }


  }


</style>
