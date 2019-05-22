<template>
  <div id="SummaryScore" >
    <el-form class="issueTop">
      <div class="asstopWrap">
        <el-form-item label="年度：" class="assessSelect">
          <el-select v-model="value" size="mini" placeholder="请选择" class="selectWrap" @change="select()">
            <el-option v-for="item in options" :key="item.niandu" :label="item.niandu" :value="item.niandu">
            </el-option>
          </el-select>
        </el-form-item>

        <div class="assessTitle">
          <ul>
            <!-- <li><span>牵头单位：</span><span>发改委</span></li> -->
            <li><span>被考核单位：</span><span>省直机关</span></li>
          </ul>
        </div>
        <div class="btnworpbox">
          <el-button size="medium" type="primary" @click="search" class="iconfont icon-chaxun" > 查询</el-button>
          <el-button size="medium" type="primary" @click="save"  class="iconfont icon-baocun"> 保存</el-button>
        </div>
      </div>

      <div class="unitList">
        <p>{{value}}年度江苏省省级机关绩效考核</p>
      </div>
    </el-form>
    <div>
      <div class="tableboxs">
        <el-table :data="assessmentScore" border style="width: 100%" stripe  >
          <el-table-column type="index" label="序号"  width="80"> </el-table-column>
          <el-table-column prop="depName" label="考核对象"> </el-table-column>
          <el-table-column prop="score" label="得分">
            <template slot-scope="scope">
            <el-input type="text"  class="widthscores" 
            @blur="dafen(scope.row)"
            oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/(\.\d)\./g,'$1').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');"
            v-model.trim="scope.row.score"></el-input>
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
        huidiao:'',
        value: '',
        lev: "",
        options: [],
        assessmentScore: [],
        levdengji: [],
        // dengjiArr: []
        df:[]
      };
    },
    methods: {
      dafen(val){
        var df={}
        console.log(val);
        
        df.fuwuId=val.id
        df.score=val.score
        this.df.push(df)
      },
      // 根据英文名查询开关状态
      searchstatus(){
        let params = {
          name_en:"sz_one_lev_score"
        }
        this.$http.post(globalConfig.server3 + 'configuration/selectStatusByEnName',params).then(res=>{
          let bianliang = res.data.response_body
          this.shangchuanparams = bianliang.status

     
          if(bianliang.status == "1"){
            this.huidiao = false
          }else if(bianliang.status == "0"){
            this.huidiao = true
          }
        })
      },
      //年度下拉
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
      //查询
      search() {
       let fd = {
        niandu:this.value
       }
        this.$http.post(globalConfig.server5 + 'fuwuQualityController/selectAllForNiandu', fd).then(res => {
          if (res.data.response_code === '0') {
            this.assessmentScore = res.data.response_body
            
            this.searchstatus()
          } else {

          }
        })
      },
      //保存
      save() {
  
        this.$http.post(globalConfig.server5 + 'fuwuQualityController/updateFuwuQuality', this.dengjiArr).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.df=[]
          } else {

          }
        })
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
      // this.select2()
      // this.search()
      this.mrxs()
    }
  };
</script>

<style scoped lang="scss">
  #SummaryScore {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }
   .widthscores {width: 100px;
   input{text-align: center;}
   }
    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .asstopWrap {
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
        width: 345px;
        margin-bottom: 32px;

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
  #SummaryScore {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }
    .widthscores {width: 100px;
      input{text-align: center;}
      }
    .el-form-item__label {
      font-size: 16px;
    }
  }

  .el-select-dropdown__item {
    font-size: 16px !important;
  }
</style>
