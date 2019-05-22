<template>
  <div class="assessIssue" id = 'inspectionClassh'>
    <el-form class="issueTop">
      <div class="asstopWrap">
        <ul class="assessTitle clearfix">
          <li>
            <span>考核指标：</span>
            <el-select v-model="model_name" size="mini" clearable placeholder="请选择" @change="xuanzhong" value-key="model_name"  style="width: 350px;">
              <el-option v-for="item in assessselect" :key="item.value" :label="item.model_name" :value="item">
              </el-option>
            </el-select>
          </li>
          <li>
            <span>责任单位：</span>
            <span>{{topData.leader_dep_name}}</span>
          </li>
          <li>
            <span>年份：</span>
            <span>{{topData.niandu}}</span>
          </li>
          <li>
            <span>牵头单位：</span>
            <span>{{topData.leader_dep_name}}</span>
          </li>
          <li>
            <span>被考核单位：</span>
            <span>{{topData.beexamed_dep_name}}</span>
          </li>
          <li>
            <el-button size="medium" type="primary" @click="submitBtn">提交</el-button>
          </li>
          <li>
            <!-- <el-button size="medium" type="primary">导入excel</el-button> -->
          </li>
          <li>
            <!-- <el-button type="primary" size="medium" icon="el-icon-search" @click="search">查询</el-button> -->
          </li>
        </ul>
      </div>
      <div class="unitList">
        <p>2018年度设区市高质量考核共性指标得分情况</p>
      </div>
    </el-form>
    <div>
      <div class="tableboxs">
        <el-table :data="tableData" border style="width: 100%" stripe>
          <el-table-column prop="ranking" type="index" label="排名" width="100"> </el-table-column>
          <el-table-column prop="department_name" label="考核对象"> </el-table-column>
          <el-table-column prop="score" label="得分">
            <template slot-scope="scope">
              <el-input v-model="scope.row.score" class="fenshu" 
              oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');"
                placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        topData: {
          leader_dep_name: '',
          niandu: '',
          beexamed_dep_name: ''
        },
        model_name: '',
        value: '',
        assessselect: [],
        tableData: []
      };
    },
    methods: {
      //下拉框接口
      dropdownBox() {
        this.$http.post(globalConfig.server2 + 'tuijinGongxing/selectGonxingModelName').then(res => {
          if (res.data.response_code === '200') {
            this.assessselect = res.data.response_body
          } else {

          }
        })

      },


      //头部接口
      searchHead(val) {
        let params = {
          model_name: val.model_name
        }
        this.$http.post(globalConfig.server2 + 'tuijinGongxing/selectModelByModlName', params).then(res => {
          if (res.data.response_code === '200') {
            this.topData.model_name = res.data.response_body.model_name
            this.topData.leader_dep_name = res.data.response_body.leader_dep_name
            this.topData.niandu = this.formatDate('yyyy', res.data.response_body.niandu)
            this.topData.beexamed_dep_name = res.data.response_body.beexamed_dep_name

          } else {
            this.topData = {
              leader_dep_name: '',
              niandu: '',
              beexamed_dep_name: ''
            }
          }
        })

      },
      //表格搜索
      search(val) {
        let params = {
          beexmed_dep_name: val.beexamed_dep_name
        }
        this.$http.post(globalConfig.server2 + 'tuijinGongxing/selectTuijinGongxingMsg', params).then(res => {
          if (res.data.response_code === '0') {
            this.tableData = res.data.response_body
          } else {
            this.tableData = []
          }
        })

      },
      //选中事件
      xuanzhong(val) {
        if (val) {
          this.searchHead(val)
          this.search(val)
        } else {
          this.tableData = []
          this.topData = {
            leader_dep_name: '',
            niandu: '',
            beexamed_dep_name: ''
          }
        }

      },
      //提交事件
      submitBtn() {
        let arr = []
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].score === '' || this.tableData[i].score == null || this.tableData[i].score == undefined) {
            this.$message({
              message: this.tableData[i].department_name + '的得分为必填项',
              type: 'error'
            });
            return;
          } else if (this.tableData[i].score < 0  || this.tableData[i].score >100){
             this.$message({
              message: this.tableData[i].department_name + '的得分范围在（0~100）',
              type: 'error'
            });
            return
          }
          let temp = {
            id: this.tableData[i].id,
            score:this.tableData[i].score
          }
          arr.push(temp)
        }
           this.$http.post(globalConfig.server2 + 'tuijinGongxing/updateTuijinGongxingMsg', arr).then(res => {
          if (res.data.response_code === '200') {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '提交失败',
              type: 'error'
            });
          }
        })
      },
    },
    mounted() {
      this.dropdownBox()
    }
  };

</script>

<style scoped lang="scss">
  .issueTop {
    margin-top: 10px;

    .assessTitle {
      line-height: 42px;

      li {
        float: left;
        color: #606266;
        margin-right: 20px;

        &:nth-last-child(2) {
          float: right;
        }

        &:nth-last-child(3) {
          float: right;
        }

        &:last-child {
          /* float: right; */
          margin-right: 20px;
        }
      }
    }


    .unitList {
      text-align: center;
      font-size: 30px;
      color: #333;
      font-weight: 600;
      margin: 32px 0;
    }

  }



  .assessIssue {
    min-height: 450px;
  }


  .el-select-dropdown__item {
    font-size: 16px;
  }

</style>
<style lang="scss">
  #inspectionClassh {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .fenshu {
      input {
        width: 90px;
        text-align: center;
      }
    }

  }

</style>
