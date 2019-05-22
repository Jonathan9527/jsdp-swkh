<template>
  <div class="assessIssue" id="personlityClassh" style="margin-top:-10px;">
    <div class="asstopWrap clearfix">
      <ul>
        <!-- <li><span>责任单位：</span><span>发改委</span></li> -->
        <!-- <li><span>考核指标：</span><span>{{pageMsg.model_name}}</span></li> -->
        <li><span>年度：</span>
          <el-select   style="width: 150px;" v-model="selectkaohe" size="mini" value-key="model_name" placeholder="请选择" class="selectWrap" @change="getData">
            <el-option v-for="item in kaoheOption"  :key="item.model_name" :label="item.showniandu" :value="item">
            </el-option>
          </el-select>
        </li>
        <!-- <li><span>年份：</span><span>{{pageMsg.niandu}}</span></li> -->
        <li><span>牵头单位：</span><span>{{pageMsg.leader_dep_name}}</span></li>
        <!-- <li><span>被考核单位：</span><span>市区市</span></li> -->
        <li style="margin-right:0px">
          <el-button type="primary" size="medium" @click="submitexplanation" :disabled="huidiao" class="bluebtnclass">保存</el-button>
        </li>
      </ul>
    </div>
    <!-- <a href="http://192.168.11.208:9090/files/2018/12/“信用交通宣传月”专题学习会议通知.pdf">下载</a> -->
    <div class="unitList">
      <!--<p>{{pageMsg.model_name}}</p>-->
    </div>
    <div class="tableBox">
      <el-table :data="modelData" border :span-method="arraySpanMethod" style="width: 100%;" stripe>
        <!-- <el-table-column label="序号" type="index" width="70"></el-table-column> -->
        <el-table-column prop="one_name" width="100" label="一级指标">
          <template slot-scope="scope">
            <div style="font-size: 18px">{{scope.row.one_name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="two_name" width="130" label="二级指标">
        </el-table-column>
        <el-table-column prop="three_name" label="三级指标" width="200">
          <template slot-scope="scope">
            <el-popover placement="bottom" width="400"  class="box" trigger="hover" :content="scope.row.three_name" popper-class="tipClass"
              :visible-arrow="false">
              <div slot="reference" style="font-size: 14px">{{scope.row.three_name}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="three_content" label="指标内容" >
          <template slot-scope="scope">
            <el-popover placement="bottom" width="400" class="box" trigger="hover" :content="scope.row.three_content"
              popper-class="tipClass" :visible-arrow="false">
              <div slot="reference">{{scope.row.three_content}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="final_explanation" label="情况说明" width="100">
          <template slot-scope="scope">
            <!-- <el-input @blur="changeExplanation(scope.row)" type="textarea" size="mini" :autosize="{ minRows: 1, maxRows: 4}"
              placeholder="请输入内容" v-model="scope.row.final_explanation">
            </el-input> -->
            <div class="ckyj" @click="unitopinion(scope.row)">
              <div>
                <p class="tableclicksh">申报</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fileList" label="附件材料" width="300">
          <template slot-scope="scope">
            <el-upload class="upload-demo" :action="uri" :on-success="successFile" :on-remove="removeFile" multiple
              name="files" with-credentials style="width: 70%;margin: 0 auto;" :file-list="scope.row.examflieList">
              <el-button size="mini" type="text" @click="xuanze(scope.row)" class="tableclicksh" style="background: none;color: #0841B4;"
                :disabled="huidiao"><span>选择文件</span></el-button>
            </el-upload>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>


</template>
<script>
  export default {
    data() {
      return {
        uri: '',
        huidiao: '',
        modelName: '', //考核指标
        modelNameOption: [], //考核指标下拉框
        fileList: [],
        fileList2: [],
        fileObj: {},
        pageMsg: { //推进高质量指标考核佐证材料上报信息
          model_type: "",
          niandu: "",
          leader_dep_name: "",
          beexamed_dep_name: "",
          model_name: ""
        },
        // 记录初始意见
        csyj: "",
        table: [],
        table2: [],
        showModelVisible: false,
        modelData: [],
        flieList: [],
        firstTargetArr: [], //一级指标合并数组
        firstTargetPos: 0,
        secondTargetArr: [], //二级指标合并数组
        secondTargetPos: 0,
        assessOption: [],
        addMintable: [],
        explanationArr: [], //上传指标说明数组
        instance_id: '',
        addMiusShuoming: [],
        selectkaohe:"",
        kaoheOption:[],
        zhi:""
      }
    },
    methods: {
      getData(val){
        this.getMainData(val.id)
        this.zhi = val
        console.log(this.zhi);
        
      },
      // 单位意见
      unitopinion(item) {
        /* 
         *item=scope.row
         */
        console.log(item);
        
        this.csyj = item.final_explanation;
        setTimeout(function () {
          var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[2];
          ipt.value = item.final_explanation;
        }.bind(this), 0)
        const h = this.$createElement;
        this.$msgbox({
          title: '指标情况说明',
          message: h('p', [
            h('span', {
              style: 'color:red;'
            }, '*'),
            h('span', {
              style: 'font-size:20px;'
            }, '单位意见'),
            h('textarea', {
              style: 'padding-left:10px;border: 1px solid #dcdfe6;border-radius: 5px;font-size:16px;'
            })
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          customClass: "dwyj",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[2];
              item.final_explanation = ipt.value
              if (ipt.value == this.csyj) {
                this.$message({
                  type: 'error',
                  message: '请修改'
                });
                return
              }
              let temp = {
                instance_detail_id: item.instance_detail_id,
                final_explanation: item.final_explanation || "",
                final_explan_files: item.final_explan_files || ""
              }
              this.explanationArr.forEach((item, index) => {
                if (item.instance_detail_id == temp.instance_detail_id) {
                  this.explanationArr.splice(index, 1)
                }
              });
              this.explanationArr.push(temp)
              this.$http.post(globalConfig.server1 +
                "PromotingHighQualityAssessment/updateExplanation", this.explanationArr).then(res => {
                if (res.data.response_code === '200') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                } else {
                  this.$message({
                    type: 'error',
                    message: '修改失败'
                  });
                }
              })
              done();
            } else {
              done();
            }
          }
        }).catch(() => {});
      },
      // 根据英文名查询开关状态
      searchstatus() {
        let params = {
          name_en: "bkh_dept_uploadfile"
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
      //获取考核指标
      // getkaoheTarget() {
      //   let params = {
      //     model_type: "高质量加减"
      //   }
      //   this.$http.post(globalConfig.server1 + 'PromotingHighQualityAssessment/selectModelJiaJianFen', params).then(res => {
      //     if (res.data.response_code === '0') {
      //       this.modelNameOption = res.data.response_body
      //     } else {
      //       this.modelNameOption = []
      //     }
      //   })
      // },

      //获取指标情况说明--失去焦点
      changeExplanation(val) {

        let temp = {
          instance_detail_id: val.instance_detail_id,
          final_explanation: val.final_explanation || "",
          final_explan_files: val.final_explan_files || ""
        }
        this.explanationArr.forEach((item, index) => {
          if (item.instance_detail_id == temp.instance_detail_id) {
            this.explanationArr.splice(index, 1)
          }
        });
        this.explanationArr.push(temp)
      },
      //上传
      xuanze(val) {
        console.log(val);
        
        this.hang = val

      },
      successFile(response, file, fileList) {
        fileList.map(item => {
          item.id = this.hang.instance_detail_id
        })
        this.hang.examflieList = fileList
        let str = ""
        this.hang.examflieList.forEach(item => {
          if (item.response) {
            str += item.response.response_body
          } else {
            str += item.href + "^"
          }
        })
        this.hang.final_explan_files = str

        let temp = {
          instance_detail_id: this.hang.instance_detail_id,
          final_explanation: this.hang.final_explanation || "",
          final_explan_files: this.hang.final_explan_files || ""
        }
        this.explanationArr.forEach((item, index) => {
          if (temp.instance_detail_id == item.instance_detail_id) {
            this.explanationArr.splice(index, 1)
          }
        })
        this.explanationArr.push(temp)
      },
      //移除文件
      removeFile(file, fileList) {
        this.modelData.forEach(item => {
          if (item.instance_detail_id == file.id) {
            item.examflieList.forEach((val, index) => {
              if (file.uid == val.uid) {
                item.examflieList.splice(index, 1)
                this.hang = item
              }

            })
          }
        })

        let str = ""
        this.hang.examflieList.forEach(item => {
          if (item.response) {
            str += item.response.response_body
          } else {
            str += item.href + "^"
          }
        })
        this.hang.final_explan_files = str

        let temp = {
          instance_detail_id: this.hang.instance_detail_id,
          final_explanation: this.hang.final_explanation || "",
          final_explan_files: this.hang.final_explan_files || ""
        }
        this.explanationArr.forEach((item, index) => {
          if (item.instance_detail_id == temp.instance_detail_id) {
            this.explanationArr.splice(index, 1)
          }
        })
        this.explanationArr.push(temp)

      },
      //保存所有指标情况说明
      submitexplanation() {
        if (this.explanationArr.length == 0) {
          return this.$message({
            message: "请修改数据",
            type: 'error'
          });
        }
        this.$http.post(globalConfig.server1 + "PromotingHighQualityAssessment/updateExplanation", this.explanationArr)
          .then(res => {
            if (res.data.response_code == "200") {
              this.$message({
                message: "保存成功",
                type: 'success'
              });
              this.getMainData(this.zhi.id)
              // this.explanationArr = []
            } else {
              this.$message({
                message: "保存失败",
                type: 'error'
              });
              this.explanationArr = []
              this.getMainData(this.zhi.id)
            }
          })
      },
      //合并单元格
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

      //获取顶部内容
      getTopContent() {

        let person = JSON.parse(sessionStorage.getItem('personal'))
        let params = {
          user_id: person.id,
          model_type: "个性"
        }
        this.$http.post(globalConfig.server1 + "PromotingHighQualityAssessment/selectModel", params).then(res => {
          if (res.data.response_code == "0") {
            this.kaoheOption=res.data.response_body
            this.kaoheOption.forEach(item=>{
              if(item.niandu!=null)
              item.showniandu=this.formatDate("yyyy",item.niandu)
            })
            
            let data = res.data.response_body[0]
            this.pageMsg.model_type = data.model_type
            if(data.niandu!=null){
              this.pageMsg.niandu = this.formatDate("yyyy", data.niandu)
            }
            // this.pageMsg.niandu = 

            this.pageMsg.leader_dep_name = data.leader_dep_name
            // this.pageMsg.model_name = data.model_name
            this.selectkaohe=data.showniandu
            this.pageMsg.beexamed_dep_name = data.beexamed_dep_name
            this.zhi = data
            this.getMainData(data.id)
          } else {

          }
        })
      },
      //获取页面内容
      getMainData(id) {
        let params = {
          model_id: id
        }
        this.$http.post(globalConfig.server1 + "PromotingHighQualityAssessment/selectModelContent", params).then(res => {
          if (res.data.response_code == "0") {
            let data = res.data.response_body
            let arr = []
            for (let key in data) {
              let oneData = {}
              oneData = data[key][0]
              oneData.list = data[key][1]
              arr.push(oneData)
            }
            this.modelData = arr
            this.instance_id = this.modelData[0].instance_id
            this.modelData.forEach(item => {
              let examStr = item.final_explan_files
              item.examflieList = []

              let examArr = []
              let http = ""
              if (examStr) {
                this.splitStr(examStr, examArr, http)
                item.examflieList = examArr

              }
                item.examflieList.forEach(val => {
                val.id = item.instance_detail_id

              })

              item.examflieList.forEach(val => {
                val.id = item.instance_detail_id
              })
             
                item.one_name = item.one_name + "(" + item.one_value + "分)"
                item.two_name = item.two_name + "(" + item.two_value + "分)"
                item.three_name = item.three_name + "(" + item.three_value + "分）"
              
            })

            setTimeout(() => {
              $(".el-upload-list__item-name").each((index, item) => {
                $(item).attr("title", $(item).text())
              })
            }, 1000)

            this.merge()
          } else {
            this.modelData = []
          }
        })
      },

      //保存加减分说明
      baocunaddMinus() {
        this.$http.post(globalConfig.server1 + "PromotingHighQualityAssessment/updateInstanceDetail", this.addMiusShuoming)
          .then(
            res => {
              if (res.data.response_code == "200") {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
              } else {

              }
            })
      },
      getaddMinusDesp(val) {

        let temp = {
          instance_detail_id: val.instance_detail_id,
          final_explanation: val.final_explanation
        }
        this.addMiusShuoming.forEach((item, index) => {
          if (item.instance_detail_id == temp.instance_detail_id) {
            this.addMiusShuoming.splice(index, 1)
          }
        })
        this.addMiusShuoming.push(temp)

      },
      downLoadfile(url) {
        // 通过选择器获取img元素
        // var elments = $(".downloadtext")
        // 将图片的src属性作为URL地址
        // var url = $(".downloadtext").attr('src')
        var a = document.createElement('a')
        var event = new MouseEvent('click')

        // a.download = val.unitmaterials || '点击下载'
        a.href = "http://192.168.11.208:9090/files/2018/12/1544145841822~新建文本文档.txt"

        a.dispatchEvent(event)
        // var $form = $('<form method="GET"></form>');
        //     $form.attr('action', '');
        //     $form.appendTo($('body'));
        //     $form.submit();

      },

    },
    mounted() {
      this.getTopContent()
      // this.modelData = materials
      // this.getkaoheTarget()
      this.searchstatus()
      this.uri = globalConfig.server1 + "PromotingHighQualityAssessment/IndexUpload"
    }

  }

</script>
<style scoped lang="scss">
  .ckyj {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .ckyj>div {
    width: 92px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ckyj>div>i {
    font-size: 20px;
    margin-right: 5px;
    color: #0841b4;
  }

  .ckyj>div>p {
    border-bottom: 1px solid #0841b4;
    color: rgb(8, 65, 180);
  }
  .assessIssue {
    min-height: 450px;

    .asstopWrap {
      ul {
        overflow: hidden;
        li {
          /* display: inline-block; */
          float: left;
          color: #606266;
          margin-right: 20px;
          line-height: 38px;

          &:last-child {
          }
        }
      }
    }

    .qualityBox {
      min-height: 300px;

      .unitList {
        text-align: center;
        font-size: 30px;
        color: #333;
        font-weight: 600;
        margin-top: 32px;
        margin-bottom: 32px;
      }

      .tableBox {
        /* margin-top: 30px; */
      }

      .addminbox {
        margin: 30px auto;
      }


    }

    .clearfix {
      margin-top: 0px;
      padding: 15px 0 30px 0;
    }
  }

</style>
<style lang="scss">
/* .selectWrap>.el-input--mini>.el-input__inner{
    width: 380px;
    height: 50px;
    display: block;
  } */


  #personlityClassh {
.el-input--mini .el-input__inner{
  height: 38px;
  line-height: 38px;
  font-size:16px;
}
    .el-table--border,
    .el-table--group {
      border: 0
    }
  .el-button--mini>span{
      display: flex !important;
      justify-content: center;
      align-items: center;
    }

    .el-button--mini>span>i {
      font-size: 20px;
    }

    .el-button--mini>span>span {
      display: block;
      border-bottom: 1px solid #0841b4;
      height: 20px;
    }
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
