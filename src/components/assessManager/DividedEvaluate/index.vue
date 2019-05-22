<template>
  <div class="dividedWrap" id="divievaluatehyg" style="margin-top:5px;">
    <el-form class="issueTop">
      <div class="asstopWrap">
        <div class="assessTitle">
          <ul>
            <li><span>年份：</span>
              <el-select v-model="nianfen" size="medium" @change="xuanzhong" style="width: 150px;">
                <el-option v-for="item in nianduoptions" :key="item.niandu" :label="item.niandu" :value="item.niandu">
                </el-option>
              </el-select>
            </li>
            <!-- <li><span>被考核单位：</span><span>设区市</span></li> -->
          </ul>
        </div>
        <div class="btnworpbox">
          <!-- <el-button size="medium" type="primary">检验</el-button> -->
          <el-button size="medium" type="primary" @click="submitBtn" :disabled="huidiao" class="bluebtnclass"> 保存</el-button>
          <!-- <el-button size="medium" type="primary">导出结果</el-button> -->
        </div>
      </div>

      <div class="unitList">
        <p>{{nianfen}}年度设区市党的建设满意度打分</p>

      </div>
    </el-form>
    <div>
      <div class="tableboxs">
        <el-table :data="assessmentScore" style="width: 100%" stripe   >
          <el-table-column prop="ranking" type="index" label="序号" width="100"> </el-table-column>
          <el-table-column prop="department_name" label="考核对象" width="200"> </el-table-column>

          <el-table-column label="社会公众（含“两代表一委员”）评价（5分）">
            <el-table-column :label="publicmax()" >
              <template slot-scope="scope">
                <el-input size="mini" v-model.number="scope.row.public_score" 
                :data-dId="scope.row.instance_id"
                maxlength="4"
                @blur="dafenxianzhi1(scope.row)"
                :ref="scope.row.instance_id"
                oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');"></el-input>
               <p class="reds">评分值错误，请重新输入</p>
              </template>
            </el-table-column>
            <el-table-column :label="twoonemax()" >
              <template slot-scope="scope">
                <el-input size="mini" v-model.number="scope.row.two_one_score"
                :data-dId="scope.row.instance_id"
                maxlength="4"
                @blur="dafenxianzhi2(scope.row)"
                :ref="scope.row.instance_id"
                 oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');"></el-input>
               <p class="reds">评分值错误，请重新输入</p>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="省直相关部门评价（5分）">
            <el-table-column :label="tuijinmax()" >
              <template slot-scope="scope">
                <el-input size="mini" v-model.number="scope.row.tuijin_score" 
                :data-dId="scope.row.instance_id"
                maxlength="4"
                @blur="dafenxianzhi3(scope.row)"
                :ref="scope.row.instance_id"
                oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');"></el-input>
              <p class="reds">评分值错误，请重新输入</p>
              </template>
            </el-table-column>
            <el-table-column :label="dangjianmax()" >
              <template slot-scope="scope">
                <el-input size="mini" v-model.number="scope.row.dangjian_score" 
                :data-dId="scope.row.instance_id"
                maxlength="4"
                @blur="dafenxianzhi4(scope.row)"
                :ref="scope.row.instance_id"
                 oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');"></el-input>
              <p class="reds">评分值错误，请重新输入</p>
              </template>
            </el-table-column>
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
        value: '',
        huidiao:'',
        publicmaxtext: '社会公众评分',
        twoonemaxtext: '“两代表一委员”评分',
        tuijinmaxtext: '推进高质量发展评分',
        dangjianmaxtext: '加强党的建设年度成效满意度评价',
        nianfen: '', //年度
        nianduoptions: [],
        assessmentScore: [],
        fenshuObj: {
          public_max: '',
          two_one_max: "",
          tuijin_max: "",
          dangjian_max: ""
        }
      };
    },
    methods: {
      //判断分值
      judgefen1(item) {
        let refs = this.$refs
        console.log(item);
        for (let key in refs) {
          if (key == item.instance_id) {
            if (Number(item.public_score) > Number(item.dangjian_max)||item.public_score == "") {
              // 最大值判断 
              
              item.public_score = ""
              refs[key].currentValue = ""
              $(refs[key].$el).siblings().show()
              setTimeout(() => {
                $(refs[key].$el).siblings().hide()
              }, 2000)

            } else if (Number(item.public_score < 0)) {
              // 最小值判断 
              item.public_score= "";

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
      //判断分值
      judgefen2(item) {
        console.log(item.examed_dep);
        console.log(item.id);
        console.log(item.instance_id);
        
        let refs = this.$refs
        for (let key in refs) {
          if (key == item.two_one_score) {
            if (Number(item.two_one_score) > Number(item.three_value)||item.two_one_score == "") {
              // 最大值判断 
              item.two_one_score = ""
              refs[key].currentValue = ""
              $(refs[key].$el).siblings().show()
              setTimeout(() => {
                $(refs[key].$el).siblings().hide()
              }, 2000)

            } else if (Number(item.two_one_score < 0)) {
              // 最小值判断 
              item.two_one_score= "";

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
      //判断分值
      judgefen3(item) {
        let refs = this.$refs
        for (let key in refs) {
          if (key == item.one_name) {
            if (Number(item.score) > Number(item.three_value)||item.score == "") {
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
      //判断分值
      judgefen4(item) {
        let refs = this.$refs
        for (let key in refs) {
          if (key == item.one_name) {
            if (Number(item.score) > Number(item.three_value)||item.score == "") {
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
      //年度下拉
      select() {
        this.$http.post(globalConfig.server5 + 'fuwuQualityController/showNiandu').then(res => {
          if (res.data.response_code === '0') {
            this.nianduoptions = []
            let arr = res.data.response_body
            arr.map(item => {
              let obj = {
                niandu: item
              }
              this.nianduoptions.push(obj)
            })
            this.nianfen = this.nianduoptions[0].niandu
            this.search()
          } else {

          }
        })
      },
      // 打分判断
      dafenxianzhi1(item){
          var ele=this.GetAttrElement("input","data-dId",item.instance_id)
          var blocks =  ele.parentNode.parentNode.lastChild
       if (Number(item.public_score)>Number(item.dangjian_max)) {
         item.public_score="";
         ele.value=""
          blocks.style.display="block";
         setTimeout(function(){
            blocks.style.display="none";
        }.bind(this),2000);
       }else if (item.public_score<0) {
         item.public_score="";
          blocks.style.display="block";
         setTimeout(function(){
            blocks.style.display="none";
        }.bind(this),2000);
       }else{
          blocks.style.display="none";
       }
      },
      dafenxianzhi2(item){
        //  var ele=this.GetAttrElement("input","data-dId",item.instance_id)
        let ele = $("input[data-dId$="+item.instance_id+"]")
        var blocks =  ele[1].parentNode.parentNode.lastChild
       if (Number(item.two_one_score)>Number(item.two_one_max)) {
         item.two_one_score="";
         ele.value=""
          blocks.style.display="block";
         setTimeout(function(){
            blocks.style.display="none";
        }.bind(this),2000);
       }else if (item.two_one_score<0) {
         item.two_one_score="";    
           blocks.style.display="block";
         setTimeout(function(){
            blocks.style.display="none";
        }.bind(this),2000);
       }else{
          blocks.style.display="none";
       }
      },
      dafenxianzhi3(item){
         let ele = $("input[data-dId$="+item.instance_id+"]")
         var blocks =  ele[2].parentNode.parentNode.lastChild
       if (Number(item.tuijin_score)>Number(item.tuijin_max)) {
         item.tuijin_score="";
        //  var ele=this.GetAttrElement("input","data-dId",item.instance_id)
         ele.value=""
          blocks.style.display="block";
         setTimeout(function(){
            blocks.style.display="none";
        }.bind(this),2000);
       }else if (item.tuijin_score<0) {
         item.tuijin_score="";
           blocks.style.display="block";
         setTimeout(function(){
            blocks.style.display="none";
        }.bind(this),2000);
       }else{
          blocks.style.display="none";
       }
      },
      dafenxianzhi4(item){
        let ele = $("input[data-dId$="+item.instance_id+"]")
         var blocks =  ele[3].parentNode.parentNode.lastChild
       if (Number(item.dangjian_score)>Number(item.public_max)) {
         item.dangjian_score="";
        //  var ele=this.GetAttrElement("input","data-dId",item.instance_id)
         ele.value=""
           blocks.style.display="block";
         setTimeout(function(){
            blocks.style.display="none";
        }.bind(this),2000);
       }else if (item.dangjian_score<0) {
         item.dangjian_score="";
           blocks.style.display="block";
         setTimeout(function(){
            blocks.style.display="none";
        }.bind(this),2000);
       }else{
          blocks.style.display="none";
       }
      },
      // 获取元素
      GetAttrElement(tagid,attr,val){
        // var e= document.getElementsByClassName(tagid)
        var e=document.getElementsByTagName(tagid)
        
        for(var i=0;i<e.length;i++){
            if(e[i].getAttribute(attr)==val){
                return e[i];
            }
        }
        return(false);
      },
      // 根据英文名查询开关状态
      searchstatus(){
        let params = {
          name_en:"satisfy_score"
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
      publicmax() {
        return this.publicmaxtext + "（" + this.fenshuObj.public_max + "分）";
      },
      twoonemax() {
        return this.twoonemaxtext + "（" + this.fenshuObj.two_one_max + "分）";
      },
      tuijinmax() {
        return this.tuijinmaxtext + "（" + this.fenshuObj.tuijin_max + "分）";
      },
      dangjianmax() {
        return this.dangjianmaxtext + "（" + this.fenshuObj.dangjian_max + "分）";
      },
      //提交
      submitBtn() {
          let arr = []
        for(var i = 0;i<this.assessmentScore.length;i++){
          let temp = {
            id: this.assessmentScore[i].id,
            public_score: this.assessmentScore[i].public_score,
            two_one_score: this.assessmentScore[i].two_one_score,
            tuijin_score: this.assessmentScore[i].tuijin_score,
            dangjian_score: this.assessmentScore[i].dangjian_score
          }
          arr.push(temp)
        }

        for (var i = 0; i< this.assessmentScore.length; i++){
          if(!this.assessmentScore[i].public_score||!this.assessmentScore[i].two_one_score||!this.assessmentScore[i].tuijin_score||!this.assessmentScore[i].dangjian_score){
            this.$confirm('评分有空值, 是否保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.post(globalConfig.server3 + 'satisfy/updateSatisfy', arr).then(res => {
                if (res.data.response_code === '0') {
                this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                  this.search()
                } else {
                  this.$message({
                    message: '保存失败',
                    type: 'error'
                  });
                  this.search()
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消保存'
              });          
              this.search()
            });
            return
          }
        }


        this.$http.post(globalConfig.server3 + 'satisfy/updateSatisfy', arr).then(res => {
          if (res.data.response_code === '0') {
           this.$message({
              message: res.data.response_body,
              type: 'success'
            });
            this.search()
          } else {
            this.$message({
              message: '提交失败',
              type: 'error'
            });
          }
        })
      },
      //搜索
      search() {
        let params = {
          niandu: this.nianfen,
          name_en:"satisfy_score"
        }
        this.$http.post(globalConfig.server3 + 'satisfy/selectSatisfyByNiandu', params).then(res => {
          if (res.data.response_code === '0') {
            this.assessmentScore = res.data.response_body
            this.fenshuObj.public_max = res.data.response_body[0].public_max
            this.fenshuObj.two_one_max = res.data.response_body[0].two_one_max
            this.fenshuObj.tuijin_max = res.data.response_body[0].tuijin_max
            this.fenshuObj.dangjian_max = res.data.response_body[0].dangjian_max
            this.searchstatus()
          } else {
            this.$message({
                type: 'error',
                message: res.data.response_desc
              }); 
              this.assessmentScore = []
          }
        })

      },
      //年份选中事件
      xuanzhong() {
        this.search()
      }, 
      mrxs(){
        setTimeout(function(){
          // var date=new Date;
          // var year=date.getFullYear()
          this.nianfen=this.nianduoptions[0].niandu
          this.search()
        }.bind(this),200)
      }
    },
    mounted() {
      this.select()
      // this.search()
      // this.mrxs()
    }
  };

</script>

<style scoped lang="scss">
  #divievaluatehyg {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .asstopWrap {
      margin-bottom: 32px;
      overflow: hidden;
      padding: 0px 0 15px 0px;

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
      }
    }

    .assessIssue {
      min-height: 450px;
    }
  }

</style>
<style lang="scss">
  #divievaluatehyg {
    .el-input--mini .el-input__inner {
      text-align: center;
      width: 100px;
    }
     .reds{color: #ff0000;display: none;}
  }

</style>
