<template>
  <div id="showModelkhz" v-show="showModelVisible">
    <!-- {{detailData}} -->
    <div class="showModelTop clearfix">
      <div class="topMiddle">
        <el-button type="primary" size="medium" class="bluebtnclass" style="margin-right:20px;" @click="goback">返回</el-button>
        <span class="tempName">模板名称: {{detailData.model_name}}</span>
        <span class="tempYear">年份: {{detailData.niandu|filter}}</span>
        <span class="tempLead">牵头单位: {{detailData.leader_dep_name}}</span>
        <span class="tempCheck">被考核单位: {{detailData.beexamed_dep_name}}</span>
        <!-- <div class='btnworpbox'>
          <el-button type="primary" size="medium" class="iconfont icon-baocun" @click="submitModel" v-if="detailData.status == 0">&nbsp;保存</el-button>
        </div> -->
      </div>
    </div>
    <el-table :data="modelData" border :span-method="arraySpanMethod"  stripe>
      <el-table-column prop="one_name" label="一级指标" >
        <template slot-scope="scope">
          <div style="font-size: 18px">{{scope.row.one_name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="two_name" label="二级指标" width="250" v-if="modelType">
      </el-table-column>
      <el-table-column prop="three_name" label="三级指标" width="320" v-if="modelType">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="400" class="box" trigger="hover" :visible-arrow="false" popper-class="tipClass"
            :content="scope.row.three_name">
            <div slot="reference" style="font-size: 14px">{{scope.row.three_name}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="three_value" label="分值" width="70" v-if="modelType">
      </el-table-column>
      <el-table-column prop="three_content" label="计分说明" width="350" v-if="modelType">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="400" class="box" trigger="hover" :visible-arrow="false" popper-class="tipClass"
            :content="scope.row.three_content">
            <div slot="reference">{{scope.row.three_content}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="one_value" label="分值" width="70" v-if="!modelType">
      </el-table-column>

      <el-table-column prop="list" label="责任单位" >
        <template slot-scope="scope">
          <div v-for="item in scope.row.list" @click="openTree(scope.row)" class="colorfont">{{item.kaoheDepartmentName}}</div>
        </template>

      </el-table-column>

      <el-table-column prop="frequence" label="考核频度" >

      </el-table-column>
    </el-table>
    <el-dialog title="选择责任单位" v-dialogDrag :close-on-click-modal="false" :visible.sync="treedutyVisible" width="500px" class="proupClass">

      <!-- <div class="content">
              <el-checkbox-group v-model="rolesList">
                <div v-for="role in users">
                  <el-checkbox :label="role" :key="role.name">{{role.name_cn}}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div> -->
      <el-tree :data="treeduty" :props="defaultProps" @check="handleNodeClick" default-expand-all show-checkbox ref="tree"
        node-key="id"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="treedutyVisible = false">取 消</el-button>
        <el-button type="primary"  class="proupbtnqueding" @click="treedutyBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: ["modules", 'detailData', 'modelType'],
    data() {
      return {
        // typeshow:false,
        showModelVisible: false,
        treeduty: [], //树状图
        treedutyinput: [],
        defaultProps: {
          // children: 'children',
          label: 'name'
        },
        treedutyVisible: false, //tree 显示
        modelData: [],
        firstTargetArr: [], //一级指标合并数组
        firstTargetPos: 0,
        secondTargetArr: [], //二级指标合并数组
        secondTargetPos: 0,
        tempDuty: [],
        updateDuty: [] //更改责任单位数组
      }
    },
    methods: {
      //判断查看的指标
      openTree(val) {
        this.treedutyModel(this.detailData.leader_department);
        this.treedutyinput = val
        this.treedutyVisible = true
      },
      arraySpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (columnIndex === 0) {
          //第一列的合并方法,省
          const _row_1 = this.firstTargetArr[rowIndex];
          const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
          return {
            rowspan: _row_1,
            colspan: _col_1
          }
        } else if (columnIndex === 1) {
          //第二列的合并方法,市
          const _row_2 = this.secondTargetArr[rowIndex];
          const _col_2 = _row_2 > 0 ? 1 : 0;
          return {
            rowspan: _row_2,
            colspan: _col_2
          }
        }
      },

      merge() { //合并相同数据
        this.mergeInit()
        for (var i = 0; i < this.modelData.length; i++) {
          if (i === 0) {
            //第一行必须存在
            this.firstTargetArr.push(1);
            this.firstTargetPos = 0;

            this.secondTargetArr.push(1);
            this.secondTargetPos = 0;
          } else {
            // 判断当前元素与上一个元素是否相同 this.firstTargetPos是firstTargetArr内容的序号

            //一级指标
            if (this.modelData[i].one_name === this.modelData[i - 1].one_name) {
              this.firstTargetArr[this.firstTargetPos] += 1;
              this.firstTargetArr.push(0);
            } else {
              this.firstTargetArr.push(1);
              this.firstTargetPos = i;
            }

            //二级指标
            if (this.modelData[i].two_name === this.modelData[i - 1].two_name && this.modelData[i].one_name === this.modelData[
                i - 1].one_name) {
              this.secondTargetArr[this.secondTargetPos] += 1;
              this.secondTargetArr.push(0);
            } else {
              this.secondTargetArr.push(1);
              this.secondTargetPos = i;
            }


          }
        }
      },
      mergeInit() { //合并初始化
        this.firstTargetArr = [], //一级指标合并数组
          this.firstTargetPos = 0,
          this.secondTargetArr = [], //二级指标合并数组
          this.secondTargetPos = 0
      },
      goback() { //返回上个页面
        this.showModelVisible = false
      },

      //弹出树形插件
      handleNodeClick(val) {

      },
      //树状图接口
      treedutyModel(val) {
        let arr = []
        let params = {
          leader_department: val
        }
        this.$http.post(globalConfig.server2 + 'modelContent/selectDepartmentByLeaderDepartment', params).then(res => {
          if (res.data.response_code === '0') {
            this.treeduty = res.data.response_body
          } else {}
        })
      },

      //tree确定事件
      treedutyBtn() {
        // this.scope.row.leader_department =  this.treedutyinput.label
        var arr = this.$refs.tree.getCheckedNodes()

        if (arr.length == 0) {
          return this.treedutyVisible = false
        }

        let temp = []
        let pagecha = []
        let tempdutyevery = {
          model_content_id: this.treedutyinput.id,
          department_id: []
        }
        arr.forEach(item => {
          tempdutyevery.department_id.push(item.id)
          let obj = {
            kaoheDepartmentName: item.name
          }
          pagecha.push(obj)
        })

        temp.push(tempdutyevery)
        this.updateDuty.push(tempdutyevery)

        this.treedutyinput.list = pagecha



        let department_id = this.$refs.tree.getCheckedKeys()

        let params = {
          model_content_id: this.treedutyinput.id,
          department_id: this.$refs.tree.getCheckedKeys()
        }
        let arrpararm = []
        arrpararm.push(params)
        this.$http.post(globalConfig.server2 + 'modelContent/insertModelResponseDep', arrpararm).then(res => {
          if (res.data.response_code === '0') {
            // this.treeduty = res.data.response_body
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.$refs.tree.setCheckedKeys([])
            this.treedutyVisible = false
          } else {}

        })

      },
      submitModel() { //保存提交责任单位

        this.$http.post(globalConfig.server2 + 'modelContent/insertModelResponseDep', this.updateDuty).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            // this
          } else {}
        })
      }

    },
    filters: {
      filter(val) {

        let time = String(val)
        return val = time.substring(0, 4)

      }
    },
    watch: {
      modules(val) {
        if (val) {
          this.modelData = JSON.parse(JSON.stringify(this.detailData.list))
          this.modelData.map((item) => {
            item.one_name = item.one_name + "(" + item.one_value + "分)"
            item.two_name = item.two_name + "(" + item.two_value + "分)"
            item.list.map(val => {
              if (val.kaoheDepartment != null)
                val.kaoheDepartmentName = val.kaoheDepartment.name
              else
                val.kaoheDepartmentName = '请选择'

            });
          })

          this.merge()
          this.showModelVisible = val
        }
      },
      showModelVisible(val) {
        if (!val) {
          this.$emit('close')
        }
      }
    },
    mounted() {
      //  this.modelData = modeldata


    },
  }

</script>
<style scoped lang="scss">
  #showModelkhz {
    .showModelTop {
      margin-bottom: 20px;

      .goback {
        float: left;
      }

      .topMiddle {
        height: 60px;
        line-height: 3.5;
        width: 100%;

        span {
          padding: 0 10px;
          color: #606266;

          &.tempTip {
            padding-left: 20px;
          }
        }
      }
    }

    .colorfont {
      color: #409EFF;
      padding: 5px 0;
      cursor: pointer;
    }

    .btnworpbox {
      float: right;

      button {
        margin-left: 20px;
      }
    }

  }

  .el-select-dropdown__item {
    font-size: 16px;
  }

</style>
<style lang="scss">
  #showModelkhz {
    .el-input--medium .el-input__inner {
      height: 38px;
    }
   .el-dialog__body {
    padding: 24px 24px 0;
    max-height: 550px;
    overflow-y: scroll;
   }
    // thead .el-table_1_column_6 .cell:before {
    //   content: '*';
    //   color: #ff0000;
    //   margin-right: 4px;
    // }

    // thead .el-table_1_column_9 .cell:before {
    //   content: '*';
    //   color: #ff0000;
    //   margin-right: 4px;
    // }

    .el-table__row td .cell .box .el-popover__reference {
      height: 10%;
      display: -webkit-box;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;

      /* autoprefixer: on */
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

</style>
