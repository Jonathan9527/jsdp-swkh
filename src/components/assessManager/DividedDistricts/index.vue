<template>
  <div class="DividedDistricts" id="DividedDistrictshyg" style="padding: 0 15px;">
    <el-form class="issueTop">
      <div class="asstopWrap" >
        <div class="assessTitle">
          <ul>
            <li><span>年份：</span>
              <el-select v-model="value" clearable size="medium" @change="xuanzhong">
					 	<el-option v-for="item in options" :key="item.niandu" :label="item.niandu" :value="item.niandu">
                </el-option>
              </el-select>
            </li>
            <li><span>牵头单位：</span><span>发改委</span></li>
            <li><span>被考核单位：</span><span>设区市</span></li>
          </ul>
        </div>
        <div class="btnworpbox">
          <el-button size="medium" type="primary" @click="countSum">汇总</el-button>
          <el-button size="medium" type="primary" @click="saveBc">保存</el-button>
        </div>
      </div>

      <div class="unitList">
        <p><span>{{value}}</span>年度江苏省设区市综合考核排名情况</p>

      </div>
    </el-form>
    <div>
      <div class="tableboxs">
        <p class="scoringRule">*计算公式：推进高质量发展成效得分*加强党的建设成效得分/80</p>
        <el-table :data="assessmentScore" border style="width: 100%" stripe>
          <el-table-column prop="ranking" type="index" label="排名" width="80"> </el-table-column>
          <el-table-column prop="examed_name" label="考核对象"> </el-table-column>
          <el-table-column prop="dangjian_score" label="党的建设得分"> </el-table-column>
          <el-table-column prop="tuijin_score" label="推进高质量发展得分"> </el-table-column>
          <el-table-column prop="score" label="总分"> </el-table-column>
          <el-table-column prop="lev" label="等次">
            <template slot-scope="scope">
              <el-select v-model="scope.row.lev" placeholder="请选择等级"  @change="changelev(scope.row)">
                <el-option v-for="item in levdengji" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
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
        assessmentScore: [], //数据表格
        value:'',
        nianfen: '', //年度
        options: [],
        levdengji: [{
          value: "一等",
          label: "一等"
        }, {
          value: "二等",
          label: "二等"
        }, {
          value: "三等",
          label: "三等"
        }],
        changeArr:[]

      };
    },
    methods: {
      changelev(val){
        let temp = {
          id:val.id,
          lev:val.lev
        }
        
        this.changeArr.forEach((item,index)=>{
          if(item.id == temp.id){
            this.changeArr.splice(index,1)
          }
        })
        this.changeArr.push(temp)
      },
        //下拉年度菜单
      select() {
        this.$http.post(globalConfig.server5 + 'fuwuQualityController/showNiandu').then(res => {
          if (res.data.response_code === '0') {
            this.options = []
            let arr = res.data.response_body
            arr.map(item => {
              let obj = {
                niandu: item
              }
              this.options.push(obj)
            })

          } else {

          }
        })
      },
      //搜索
      search() {
        let params = {"niandu": this.value}
        this.$http.post(globalConfig.server3 + 'zonghe/selectzonghe', params).then(res => {
          if (res.data.response_code === '0') {
            this.assessmentScore = res.data.response_body.zongHes
          } else {

          }
        })
      },
      //汇总计算
      countSum() {
        let params = {"niandu": this.value}
        this.$http.post(globalConfig.server3 + 'zonghe/updateZonghe', params).then(res => {
          if (res.data.response_code === '0') {
            this.search()
            this.$message({
              message: res.data.response_body,
              type: 'success'
            });
          } else {

          }
        })
      },
      //保存
      saveBc() {
        this.$http.post(globalConfig.server3 + 'zonghe/updateLev', this.changeArr).then(res => {
          if (res.data.response_code === '0') {
            this.search()
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          } else {
             this.$message({
              message: '保存失败',
              type: 'error'
            });
          }
        })
      },
      //年份选择
      xuanzhong() {
        this.search()
      },
      mrxs(){
        setTimeout(function(){
          var date=new Date;
          var year=date.getFullYear()
          this.value=year
          this.search()
        }.bind(this),600)
      }
    },
    mounted() {
      this.select()
      //this.search()
      this.mrxs()
    }
  };

</script>

<style scoped lang="scss">
  #DividedDistrictshyg {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .asstopWrap {
      padding: 30px 0 20px 5px;
      overflow: hidden;

      .btnworpbox {
        float: right;

        button {
          margin-left: 20px;
        }
      }
    }

    .issueTop {
      .assessTitle {
        display: inline-block;

        ul {
          li {
            display: inline-block;
            color: #606266;
            margin-right: 20px;
            line-height: 38px;
          }
        }
      }

      .assessSelect {
        display: inline-block;
        width: 350px;

        .el-button {
          margin-left: 60px;
        }
      }

      .unitList {
        text-align: center;
        font-size: 30px;
        color: #333;
        font-weight: 600;
        margin-bottom: 32px;
      }

      li {
        span {
          font-size: 16px;
        }
      }

    }

    .tableboxs {
      text-align: center;
      margin: 0 auto;
      margin-bottom: 30px;

      .scoringRule {
        text-align: right;
        color: #ff0000;
        font-size: 14px;
      }
    }

    .assessIssue {
      min-height: 450px;
    }
  }

</style>
<style lang="scss">
  #DividedDistrictshyg {
    .el-input--mini .el-input__inner {
      text-align: center;
      width: 100px;
    }
  }

</style>
