<template>
  <div id="showModelClass"  style="margin-top:-5px;">
    <!--{{searchParams}}-->
    <div class="showModelTop clearfix">
      <div class="topMiddle">
        <span class="tempName">年度：</span>
        <el-select @change="getOption" value-key="model_name" style="width: 150px;" v-model="value" size="mini"
          placeholder="请选择">
          <el-option v-for="item in kaoheOptions" :key="item.value" :label="item.niandu" :value="item">
          </el-option>
        </el-select>
        <span class="tempName" style="margin-left:20px">被考核单位：</span>

        <el-select @change="getkaoheID" v-model="value1" size="mini" style="margin-left: -5px;width: 200px;" value-key="examed_dep_name"
          placeholder="请选择" class="tempconpy">
          <el-option v-for="item in assessOption" :key="item.value1" :label="item.examed_dep_name" :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" size="medium" style="margin-left: 20px;" class="bluebtnclass" @click="chaxunsearch">查询</el-button>
          <el-button type="primary" size="medium" style="margin-left: 20px;" class="bluebtnclass" @click="pingfenSure"
            :disabled="huidiao">保存</el-button>
      </div>
        <div class="asstopWrap">
          <p>{{value.niandu}}年设区市高质量发展年度考核共性指标({{value1.examed_dep_name}})</p>
        </div>
    </div>
    
    <el-table :data="modelData" border :span-method="arraySpanMethod" style="width: 100%" stripe :default-sort="{prop:'sort'}">
      <!-- <el-table-column prop="sort"   label="序号"></el-table-column> -->
      <el-table-column prop="one_name" label="指标内容"></el-table-column>
      <el-table-column prop="one_value" label="指标分值">
        <template slot-scope="scope">
            <div slot="reference">{{scope.row.one_value}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="评分">
        <template slot-scope="scope">
          <el-input size="medium" :data-dId="scope.row.one_name"  
          oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/(\.\d)\./g,'$1').replace(/[^\d]*(\d+\.\d{100}).*/g,'$1');"
            @blur="dafen(scope.row)" :ref="scope.row.one_name" class="pingfencenter" style="width:150px;" v-model="scope.row.score">
          </el-input>
          <p class="reds">评分值错误，请重新输入</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        model_dept: "",
        indexContent: "指标内容",
        pageMsg: {
          templateName: "2018年度设区市党的建设考核指标模型",
          year: "2018",
          leadDepartment: "省委党建办",
          checkDepartment: "设区市"
        },
        /*showModelVisible:false,*/
        modelData: [],
        firstTargetArr: [], //一级指标合并数组
        firstTargetPos: 0,
        secondTargetArr: [], //二级指标合并数组
        secondTargetPos: 0,
        kaoheOptions: [],
        options: [],
        assessOption: [],
        value: '',
        value1: '',
        temp: {},
        huidiao: '',
        fenshuArr: [],
        searchParams: {

        }
      }
    },
    methods: {
      //判断分值
      judgefen(item) {
        let refs = this.$refs
        for (let key in refs) {
          if (key == item.one_name) {
            if (Number(item.score) > Number(item.one_value)||item.score == "") {
              // 最大值判断 
              item.score = ""
              refs[key].currentValue = ""
              $(refs[key].$el).siblings().show()
              setTimeout(() => {
                $(refs[key].$el).siblings().hide()
              }, 2000)

            } else if (Number(item.score < 0)) {
              // 最小值判断 
              item.score= "";

              $(refs[key].$el).siblings().show()
              setTimeout(() => {
                $(refs[key].$el).siblings().hide()
              }, 2000)
            } else {
              $(refs[key].$el).siblings().hide()
            }
          }
        }
      },
      // 打分判断
      dafen2(item) {

        /*
         *item=scope.row
         */
        
        var ele = this.GetAttrElement("input", "data-dId", item.one_name)
        var blocks = ele.parentNode.parentNode.lastChild
        if (Number(item.score) > Number(item.one_value)) {
          // 最大值判断 
          item.score = "";
          ele.value = ""
          blocks.style.display = "block";
          setTimeout(function () {
            blocks.style.display = "none";
          }.bind(this), 2000);
        } else if (item.score < 0) {
          // 最小值判断 
          item.score = "";
          blocks.style.display = "block";
          setTimeout(function () {
            blocks.style.display = "none";
          }.bind(this), 2000);
        } else {
          blocks.style.display = "none";
        }

      },
      // 获取元素
      GetAttrElement(tagid, attr, val) {
        // var e= document.getElementsByClassName(tagid)
        var e = document.getElementsByTagName(tagid)

        for (var i = 0; i < e.length; i++) {
          if (e[i].getAttribute(attr) == val) {
            return e[i];
          }
        }
        return (false);
      },

      // 根据英文名查询开关状态
      searchstatus() {
        let params = {
          name_en: "gongxing_score"
        }
        this.$http.post(globalConfig.server3 + 'configuration/selectStatusByEnName', params).then(res => {
          let bianliang = res.data.response_body
          this.shangchuanparams = bianliang.status

          if (bianliang.status == "1") {
            this.huidiao = false
          } else if (bianliang.status == "0") {
            this.huidiao = true
          }
        })
      },
      //默认选择的数据
      // mrxs() {
      //   setTimeout(function () {
          
      //     setTimeout(function () {
      //       this.chaxunsearch()
      //       setTimeout(function () {
      //         this.getkaoheID(this.assessOption[0])
      //         if (this.value1 != null) {
      //           this.indexContent = "（" + this.value1 + "）" + this.indexContent
      //         }
      //       }.bind(this), 200)
      //     }.bind(this), 300)
      //   }.bind(this), 200)
      // },
      //共性指标下拉框
      gongxingselect() {
        let params = {
          niandu:""
        }
        this.$http.post(globalConfig.server1 + 'tuijinGongxing/selectGonxingModelByType',params).then(res => {
          if (res.data.response_code == "200") {
            for (let i = 0; i < res.data.response_body.length; i++) {
              res.data.response_body[i].niandu=this.formatDate('yyyy', res.data.response_body[i].niandu)
            }
            this.kaoheOptions = res.data.response_body
            
            
            this.model_dept = this.kaoheOptions.leader_department
            this.value = this.kaoheOptions[0]
            console.log(this.value.niandu)
            this.getOption(this.kaoheOptions[0]);
          }
        })
      },
      //共性指标下拉框选中
      getOption(val) {
        this.searchParams.model_id = val.id

        this.model_dept = val.leader_department
        this.beikaoheselect()
        this.assessOption = []
        this.value1 = ''
      },
      //被考核单位
      beikaoheselect() {
        let params = {
          model_id: this.searchParams.model_id
        }

        this.$http.post(globalConfig.server1 + 'tuijinGongxing/selectGonxingInstanceByName', params).then(res => {
          if (res.data.response_code == "200") {
            this.assessOption = res.data.response_body
            this.value1 = res.data.response_body[0]
            this.searchParams.examed_dep = res.data.response_body[0].id
            this.getContent()
          }
        })

      },
      //被考核单位下拉框选中
      getkaoheID(val) {
        this.searchParams.examed_dep = val.id
        // this.getContent()
        this.searchParams.niandu = val.niandu
        console.log(this.searchParams.niandu);
        
        this.indexContent = '指标内容'
        this.getContent()
        if (this.value1 != null && this.value1.examed_dep_name != null)
          this.indexContent = "（" + this.value1.examed_dep_name + "）" + this.indexContent
      },

      //加载共性打分页面
      getContent() {

        let person = JSON.parse(sessionStorage.getItem('personal'))
        if (this.model_dept === person.roleData.department.id) {
          let params = {
            instance_id: this.searchParams.examed_dep
          }
          this.$http.post(globalConfig.server1 + 'tuijinGongxing/selectGonxingInstanceDetailById', params).then(res => {
            if (res.data.response_code == "200") {
              this.modelData = res.data.response_body
              this.modelData.map((item) => {
                item.one_name = item.one_name
                item.two_name = item.two_name
                item.three_name = item.three_name

              })
              this.searchstatus()
              this.merge()
            }
          })
        } else {}

      },
      //查询事件
      chaxunsearch() {
        let params = this.searchParams
        if (!params.model_id && !params.examed_dep) {
          this.$message({
            message: '请选择完整',
            type: 'warning'
          });
          return
        }
        this.getContent()
        //  this.$message({
        //   message:'查询成功！',
        //   type:'success'
        // })
      },
      //打分
      dafen(val) {
        this.judgefen(val)
        
        let tempfen = {
          id: val.id,
          instance_id: this.searchParams.examed_dep,
          score: val.score,
          niandu: this.value.niandu
        }
    
        this.fenshuArr.forEach((item, index) => {
          if (item.id == tempfen.id) {
            this.fenshuArr.splice(index, 1)
          }
        })
        this.fenshuArr.push(tempfen)
      },
      //保存评分
      pingfenSure() {
        for (var i = 0; i < this.modelData.length; i++) {
          if (!this.modelData[i].score) {
            this.$confirm('评分有空值, 是否保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.fenshuArr.length == 0) {
                this.$message({
                  type: 'error',
                  message: '请做出更改'
                });
                return
              } else {
                this.$http.post(globalConfig.server2 + 'tuijinGongxing/updateInstanceDetailScore', this.fenshuArr).then(
                  res => {
                    if (res.data.response_code == "200") {
                      this.$message({
                        message: '保存成功！',
                        type: 'success'
                      })
                      this.fenshuArr = []
                      setTimeout(function(){
                        
                        this.getContent()
                      }.bind(this),200)
                    } else {
                       this.$message({
                        message: '保存失败！',
                        type: 'error'
                      })
                    }
                  })
              }

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消保存'
              });
              this.fenshuArr = []
                setTimeout(function(){
                  this.getContent()
                }.bind(this),200)
            });
            return
          }
        }
        if (this.fenshuArr.length == 0) {
          this.$message({
            type: 'error',
            message: '请做出更改'
          });
          return
        } else {
          this.$http.post(globalConfig.server2 + 'tuijinGongxing/updateInstanceDetailScore', this.fenshuArr).then(res => {
            if (res.data.response_code == "200") {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.fenshuArr = []
              setTimeout(function(){
                
                this.getContent()
              }.bind(this),200)
             
            } else {
               this.$message({
                message: '保存失败！',
                type: 'error'
              })
              this.fenshuArr = []
              setTimeout(function(){
                
                this.getContent()
              }.bind(this),200)
            }
          })
        }
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

    },
    mounted() {
      this.gongxingselect() //共性指标下拉框
      // this.mrxs();

    },
  }

</script>
<style scoped lang="scss">
  #showModelClass {

    .showModelTop {
      margin-bottom: 10px;

      .topMiddle {
        height: 75px;
        line-height: 55px;
        float: left;
        width: 100%;

        span {

          &.tempTip {
            padding-left: 20px;
          }
        }
      }

      .topRight {
        float: left;
        margin-left: 30px;
      }

      .daoru .luru.baocun {
        margin-left: 20px;
      }

      .tempconpy {
        width: 150px;
        margin-left: -20px;
      }

      .bottom {
        display: inline-block;
        margin: 10px 20px 10px;
        width: 100%;

      }
    .asstopWrap {
      margin-bottom: 20px;
      display: inline-block;
      text-align: center;
      width: 100%;
      font-size: 30px;
      color: #000;
      line-height: 55px;
   }

      .bottom-btn {
        float: right;
      }
    }
  }

</style>
<style lang="scss">
  #showModelClass {
    .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .reds {
      color: #ff0000;
      display: none;
    }

    .cell .el-input .el-input__inner {
      box-sizing: border-box;
      text-align: center;
    }

  }

</style>
