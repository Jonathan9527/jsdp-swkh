<template>
  <div class="assessIssue" id="examintionClassh" style="margin-top:-10px;">
    <div class="asstopWrap clearfix">
      <ul>
        <li>
          <span>年度：</span>
          <el-select v-model="modelName" size="mini" placeholder="请选择" value-key="model_name" @change="getyemianContent"
            style="width: 150px;">
            <el-option v-for="item in modelNameOption" :key="item.id" :label="item.showniandu" :value="item">
            </el-option>
          </el-select>
        </li>
        <li><span>牵头单位：</span><span>{{pageMsg.leader_dep_name}}</span></li>
        <!-- <li><span>年份：</span><span>{{pageMsg.niandu}}</span></li>
						<li><span>牵头单位：</span><span>{{pageMsg.leader_dep_name}}</span></li>
						<li><span>被考核单位：</span><span>{{pageMsg.beexamed_dep_name}}</span></li> -->
        <li style="margin-right:0px">
          <el-button type="primary" size="medium" @click="baocunaddMinus" :disabled="huidiao" class="bluebtnclass">保存</el-button>
        </li>
      </ul>
    </div>

    <div class="unitList">
      <!--<p>{{pageMsg.model_name}}</p>-->
    </div>
    <div class="AHeader">{{modelName.showniandu}}年度加减分项清单</div>

    <div class="addminbox">
      <el-table :data="addMintable" style="width: 100%" border stripe :span-method="arraySpanMethod">
        <!-- <el-table-column label="序号" type="index" width="70"></el-table-column> -->
        <el-table-column label="加减分项" prop="descrip" width="110"></el-table-column>
        <el-table-column label="指标名称" prop="one_name">
          <template slot-scope="scope">
            <el-popover placement="bottom" width="400" class="box" trigger="hover" :content="scope.row.one_name"
              popper-class="tipClass" :visible-arrow="false">
              <div slot="reference">{{scope.row.one_name}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="final_explanation" label="情况说明" width="100">
          <template slot-scope="scope">
            <div class="ckyj" @click="unitopinion(scope.row)">
              <div>
                <p class="tableclicksh">申报</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="examfileList" label="附件材料">
          <template slot-scope="scope">
            <el-upload class="upload-demo" :action="uri" :on-success="successFile" :on-remove="removeFile" multiple
              name="files" with-credentials style="width: 70%;margin: 0 auto;" :file-list="scope.row.examfileList">

              <el-button size="mini" type="text" style="background: none;color: #0841B4;" :disabled="huidiao" @click="xuanze(scope.row)"
                class="tableclicksh"><span>选择文件</span></el-button>

            </el-upload>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="fileList" label="下载加减分材料">
              <template slot-scope="scope">
                <template v-for="item in scope.row.fileList">
                  <a :href="item.href">{{item.name}}</a>
                </template>
              </template>
            </el-table-column> -->
      </el-table>
    </div>

    <!-- </el-tab-pane> -->
    <!-- </el-tabs> -->
  </div>


</template>
<script>
  export default {
    data() {
      return {
        uri: "",
        huidiao: '',
        modelName: '', //考核指标
        modelNameOption: [], //考核指标下拉框
        fileList: [],
        pageMsg: { //推进高质量指标考核佐证材料上报信息
          model_type: "",
          niandu: "",
          leader_dep_name: "",
          beexamed_dep_name: "",
          model_name: ""
        },
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
        hang: "",
        // 记录初始意见
        csyj: "",
        firstTargetArr:[],
        firstTargetPos:0
      }
    },
    methods: {
      // 单位意见
      unitopinion(item) {

        this.csyj = item.final_explanation;
        setTimeout(function () {
          var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[2];
          ipt.value = item.final_explanation;
        }.bind(this), 0)
        const h = this.$createElement;
        this.$msgbox({
          title: '单位意见',
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
                final_explanation: item.final_explanation,
                final_explan_files: item.final_explan_files || ""
              }
              this.addMiusShuoming.forEach((item, index) => {
                if (item.instance_detail_id == temp.instance_detail_id) {
                  this.addMiusShuoming.splice(index, 1)
                }
              })
              this.addMiusShuoming.push(temp)


              this.$http.post(globalConfig.server1 +
                  "PromotingHighQualityAssessment/updateInstanceDetail", this.addMiusShuoming)
                .then(
                  res => {
                    if (res.data.response_code == "200") {
                      this.$message({
                        message: '修改成功',
                        type: 'success'
                      });
                    } else {}

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
          name_en: "bkh_dept_jiajianfen"
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
      getkaoheTarget() {
        let params = {
          model_type: "高质量加减"
        }
        this.$http.post(globalConfig.server1 + 'PromotingHighQualityAssessment/selectModelJiaJianFen', params).then(res => {
          if (res.data.response_code === '0') {
            this.modelNameOption = res.data.response_body
            this.modelNameOption.forEach(item => {
              if (item.niandu != null) {
                item.showniandu = this.formatDate("yyyy", item.niandu)
                if (this.modelNameOption[0].leader_dep_name != null)
                  this.pageMsg.leader_dep_name = this.modelNameOption[0].leader_dep_name
              } else {}
            })
              let nd = this.modelNameOption[0].niandu
              if (nd != null)
              this.modelName = this.modelNameOption[0]

              this.getyemianContent(this.modelNameOption[0])
          } else {
            this.modelNameOption = []
          }
        })
      },
      //获取被考核单位加减分内容
      getyemianContent(val) {

        let personal = JSON.parse(sessionStorage.getItem("personal"))

        let params = {
          examed_dep: personal.roleData.department.id,
          model_id: val.id
        }
        this.pageMsg.leader_dep_name = val.leader_dep_name
        this.$http.post(globalConfig.server1 + 'PromotingHighQualityAssessment/selectJiaJianFen', params).then(res => {
          if (res.data.response_code === '0') {
            this.addMintable = []
            let tableData = res.data.response_body

            for (let key in tableData) {
              tableData[key][0].departList = tableData[key][1]
              this.addMintable.push(tableData[key][0])
            }

            this.addMintable.sort((a,b)=>{
                return b.one_value - a.one_value
            })
            
            this.addMintable.forEach(item => {
              if(item.one_value == "1"){
                item.descrip = "加分项"
              }else if(item.one_value == "-1"){
                item.descrip = "减分项"
              }

              item.examfileList = []
              let str = item.final_explan_files
              if (str) {
                let examArr = []
                let http = ""
                this.splitStr(str, examArr, http)
                item.examfileList = examArr
              }
              item.examfileList.forEach(val => {
                val.id = item.instance_detail_id
              })
            })
            console.log(this.addMintable)
            
            setTimeout(() => {
              $(".el-upload-list__item-name").each((index, item) => {
                $(item).attr("title", $(item).text())
              })
            }, 1000)
            this.merge()
            this.searchstatus()
          } else {

          }
        })
      },
      //获取说明--失去焦点
      getaddMinusDesp(val) {
        let temp = {
          instance_detail_id: val.instance_detail_id,
          final_explanation: val.final_explanation,
          final_explan_files: val.final_explan_files || ""
        }
        this.addMiusShuoming.forEach((item, index) => {
          if (item.instance_detail_id == temp.instance_detail_id) {
            this.addMiusShuoming.splice(index, 1)
          }
        })
        this.addMiusShuoming.push(temp)
      },
      //上传
      xuanze(val) {
        this.hang = val
      },
      successFile(response, file, fileList) {
        fileList.map(item => {
          item.id = this.hang.instance_detail_id
        })
        this.hang.examfileList = fileList
        let str = ""
        this.hang.examfileList.forEach(item => {
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
          final_explan_files: this.hang.final_explan_files || "",
        }
        this.addMiusShuoming.forEach((item, index) => {
          if (temp.instance_detail_id == item.instance_detail_id) {
            this.addMiusShuoming.splice(index, 1)
          }
        })
        this.addMiusShuoming.push(temp)
      },
      //移除文件
      removeFile(file, fileList) {
        this.addMintable.forEach(item => {
          if (item.instance_detail_id == file.id) {
            item.examfileList.forEach((val, index) => {
              if (file.uid == val.uid) {
                item.examfileList.splice(index, 1)
                this.hang = item
              }

            })
          }
        })

        let str = ""
        this.hang.examfileList.forEach(item => {
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
          final_explan_files: this.hang.final_explan_files || "",
        }
        this.addMiusShuoming.forEach((item, index) => {
          if (temp.instance_detail_id == item.instance_detail_id) {
            this.addMiusShuoming.splice(index, 1)
          }
        })
        this.addMiusShuoming.push(temp)

      },
      //保存加减分说明
      baocunaddMinus() {
        this.addMiusShuoming
        if (this.addMiusShuoming.length == 0) {
          return this.$message({
            message: '请修改说明',
            type: 'error'
          });
        }
        this.$http.post(globalConfig.server1 + "PromotingHighQualityAssessment/updateInstanceDetail", this.addMiusShuoming)
          .then(
            res => {
              if (res.data.response_code == "200") {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.addMiusShuoming.length = []
                this.getyemianContent()
              } else {
                this.$message({
                  message: '保存失败',
                  type: 'error'
                });
                this.addMiusShuoming.length = []
                this.getyemianContent()
              }
            })
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
        }
      },
      merge() { //合并相同数据
        this.mergeInit()
        for (var i = 0; i < this.addMintable.length; i++) {
          if (i === 0) {
            //第一行必须存在
            this.firstTargetArr.push(1);
            this.firstTargetPos = 0;
          } else {
            // 判断当前元素与上一个元素是否相同 this.firstTargetPos是firstTargetArr内容的序号
            if (this.addMintable[i].descrip === this.addMintable[i - 1].descrip) {
              this.firstTargetArr[this.firstTargetPos] += 1;
              this.firstTargetArr.push(0);
            } else {
              this.firstTargetArr.push(1);
              this.firstTargetPos = i;
            }

          }
        }
      },
      mergeInit() { //合并初始化
        this.firstTargetArr = [], //一级指标合并数组
        this.firstTargetPos = 0
      },
      mrxs() {
        setTimeout(function () {

        }.bind(this), 400)
      }

    },
    mounted() {
      this.getkaoheTarget()
      this.searchstatus()
      this.mrxs();
      this.uri = globalConfig.server1 + "PromotingHighQualityAssessment/updateBeiKaoheDanWeiFile"
    }

  }

</script>
<style scoped lang="scss">
  /*头部*/
  .AHeader {
    width: 100%;
    height: 70px;
    text-align: center;
    line-height: 50px;
    font-size: 30px;
    color: #000;
  }

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
        li {
          /* display: inline-block; */
          float: left;
          color: #606266;
          margin-right: 20px;
          line-height: 38px;

          &:last-child {
            /* float: right; */
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

    .dutyPersonTargetcheck {
      margin-top: 0;
      padding: 17px 0 15px 15px;
    }
  }

</style>
<style lang="scss">
  #examintionClassh {
    .el-button--mini>span {
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

    .el-input--mini .el-input__inner {
      height: 40px
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
