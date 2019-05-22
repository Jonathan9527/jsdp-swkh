<template>
  <div id="auditProcess" v-show="auditProcessVisible">
    <el-table :data="auditCheckData" border :span-method="arraySpanMethod" style="width: 100%" stripe>
      <el-table-column prop="beexamed_dep_name" label="被考核单位" width="150">
      </el-table-column>
      <el-table-column prop="model_type" label="指标类型">
      </el-table-column>
      <el-table-column prop="one_name" label="一级指标">
        <template slot-scope="scope">
          <div style="font-size: 18px">{{scope.row.one_name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="two_name" label="二级指标" width="150">

      </el-table-column>
      <el-table-column prop="three_name" label="三级指标" width="300">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="400" trigger="hover" :visible-arrow="false" popper-class="tipClass"
            :content="scope.row.three_name">
            <div slot="reference" class='overflowHiden'>{{scope.row.three_name}}</div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="list" label="责任单位" width="150">
        <template slot-scope="scope">
          <div v-for="item in scope.row.list" v-if="item.kaoheDepartment" style="padding:5px 0;">{{item.kaoheDepartment.name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="frequence" label="考核频度" width="130"></el-table-column>

    </el-table>
    <div class="bottomTip">
      <el-form :inline="true" class="demo-form-inline">

        <div class='subBtns'>
          <el-button type="info" @click="gobacks"><i class="iconfont icon-fanhui"></i>返回</el-button>
          <el-form-item>
            <el-input v-model="checkSuggest" placeholder="填写审核意见"></el-input>
          </el-form-item>
          <el-button type="primary" class="bluebtnclass" @click="checkPass">审核通过</el-button>
          <el-button type="primary" class="bluebtnclass"  @click="noPass">审核不通过</el-button>

        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    props: ["modules", 'detailData'],
    data() {
      return {
        checkSuggest: "", //审核意见
        pageMsg: {
          templateName: "2018年度设区市党的建设考核指标模型",
          year: "2018",
          leadDepartment: "省委党建办",
          checkDepartment: "设区市"
        },
        auditProcessVisible: false,
        auditCheckData: [],
        beexamed_dep_nameArr: [], //被考核单位合并数组
        beexamed_dep_namePos: 0,
        model_typeArr: [], //指标类型合并数组
        model_typePos: 0,
        one_nameArr: [], //一级指标合并数组
        one_namePos: 0,
        two_nameArr: [], //二级指标合并数组
        two_namePos: 0,
        
      }
    },
    methods: {
      arraySpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (columnIndex === 0) {
          //第一列的合并,被考核单位
          const _row_1 = this.beexamed_dep_nameArr[rowIndex];
          const _col_1 = _row_1 > 0 ? 1 : 0;
          return {
            rowspan: _row_1,
            colspan: _col_1
          }
        } else if (columnIndex === 1) {
          //第二列的合并,指标类型
          const _row_2 = this.model_typeArr[rowIndex];
          const _col_2 = _row_2 > 0 ? 1 : 0;
          return {
            rowspan: _row_2,
            colspan: _col_2
          }
        } else if (columnIndex === 2) {
          //第三列的合并,一级指标
          const _row_3 = this.one_nameArr[rowIndex];
          const _col_3 = _row_3 > 0 ? 1 : 0;
          return {
            rowspan: _row_3,
            colspan: _col_3
          }
        } else if (columnIndex === 3) {
          //第四列的合并,二级指标
          const _row_4 = this.two_nameArr[rowIndex];
          const _col_4 = _row_4 > 0 ? 1 : 0;
          return {
            rowspan: _row_4,
            colspan: _col_4
          }
        }
      },
      merge() { //合并相同数据
        this.mergeInit()
        for (var i = 0; i < this.auditCheckData.length; i++) {
          if (i === 0) {
            //第一行必须存在
            this.beexamed_dep_nameArr.push(1),
              this.beexamed_dep_namePos = 0,

              this.model_typeArr.push(1),
              this.model_typePos = 0,

              this.one_nameArr.push(1);
            this.one_namePos = 0;

            this.two_nameArr.push(1);
            this.two_namePos = 0;
          } else {
            //被考核单位
            if (this.auditCheckData[i].beexamed_dep_name === this.auditCheckData[i - 1].beexamed_dep_name) {
              this.beexamed_dep_nameArr[this.beexamed_dep_namePos] += 1;
              this.beexamed_dep_nameArr.push(0);
            } else {
              this.beexamed_dep_nameArr.push(1);
              this.beexamed_dep_namePos = i;
            }
            //指标类型
            if (this.auditCheckData[i].model_type === this.auditCheckData[i - 1].model_type && this.auditCheckData[i].beexamed_dep_name ===
              this.auditCheckData[
                i - 1].beexamed_dep_name) {
              this.model_typeArr[this.model_typePos] += 1;
              this.model_typeArr.push(0);
            } else {
              this.model_typeArr.push(1);
              this.model_typePos = i;
            }
            //一级指标
            if (this.auditCheckData[i].one_name === this.auditCheckData[i - 1].one_name && this.auditCheckData[i]
              .model_type ===
              this.auditCheckData[
                i - 1].model_type) {
              this.one_nameArr[this.one_namePos] += 1;
              this.one_nameArr.push(0);
            } else {
              this.one_nameArr.push(1);
              this.one_namePos = i;
            }
            //二级指标
            if (this.auditCheckData[i].two_name === this.auditCheckData[i - 1].two_name && this.auditCheckData[
                i].one_name ===
              this.auditCheckData[
                i - 1].one_name) {
              this.two_nameArr[this.two_namePos] += 1;
              this.two_nameArr.push(0);
            } else {
              this.two_nameArr.push(1);
              this.two_namePos = i;
            }
          }
        }
      },
      mergeInit() { //合并初始化
        this.beexamed_dep_nameArr = [], //被考核单位合并数组
          this.beexamed_dep_namePos = 0,
          this.model_typeArr = [], //指标类型合并数组
          this.model_typePos = 0,
          this.one_nameArr = [], //一级指标合并数组
          this.one_namePos = 0,
          this.two_nameArr = [], //二级指标合并数组
          this.two_namePos = 0
      },
      //审核通过
      checkPass() {
        // this.auditProcessVisible = false
        let params = {
          id: this.detailData.auditID,
          remark: this.checkSuggest
        }

        this.$http.post(globalConfig.server2 + 'model/ModelAuditIsOk', params).then(res => {
          if (res.data.response_code === '200') {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.auditProcessVisible = false
            this.auditProcessVisible = false
            this.$parent.auditState({
              "audit_status": "1"
            });
            this.$parent.auditState({
              "audit_status": "2"
            });
            this.$parent.auditState({
              "audit_status": "3"
            });
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            });
          }
        })

      },
      //审核不通过
      noPass() {
        let params = {
          id: this.detailData.auditID,
          remark: this.checkSuggest
        }

        this.$http.post(globalConfig.server2 + 'model/ModelAuditIsNo', params).then(res => {
          if (res.data.response_code === '200') {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.auditProcessVisible = false
            this.$parent.auditState({
              "audit_status": "1"
            });
            this.$parent.auditState({
              "audit_status": "2"
            });
            this.$parent.auditState({
              "audit_status": "3"
            });

          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            });
          }
        })


      },
      gobacks() {
        this.auditProcessVisible = false
      }

    },
    watch: {
      modules(val) {
        if (val) {
          this.auditCheckData = JSON.parse(JSON.stringify(this.detailData))
          this.merge()
          this.auditProcessVisible = val
        }
      },
      auditProcessVisible(val) {
        if (!val) {
          this.$emit('close')
        }
      }
    },
    mounted() {
      // this.auditCheckData = materials
      // this.merge()
    },
  }

</script>
<style scoped lang="scss">
  #auditProcess {
    .bottomTip {
      margin-top: 10px;
    }

    .iconfont {
      margin-right: 5px;
    }



    .subBtns {
      margin-top: 20px;

      button {
        margin-right: 20px;
      }
    }

  }

  .el-form-item__label {
    font-size: 16px;
  }

  .el-select-dropdown__item {
    font-size: 16px;
  }

</style>
<style lang="scss">
  #auditProcess {
    .el-form--inline .el-form-item__content {
      margin-right: 20px;
    }

    .overflowHiden {
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      font-size: 14px;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;

      /* autoprefixer: on */
    }
  }

</style>
