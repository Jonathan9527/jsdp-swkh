<template>
  <div id="addminusScore" style="margin-top:-10px;">
    <div class="title1">
      <span>年度：</span>
      <el-select v-model="value" value-key="model_name" size="medium" placeholder="请选择" @change="getData" style="width: 150px;margin-right: 20px">
        <el-option v-for="item in kaoheOptions" :key="item.value" :label="item.niandu" :value="item">
        </el-option>
      </el-select>
      <!--<span prop="niandu">年度：{{niandu}}</span>-->
      <span class="tempName">被考核单位：</span>
      <el-select v-model="value1" @change="getkhData" value-key="examed_dep_name" size="medium" placeholder="请选择" class="tempconpy"
        style="width: 150px;">
        <el-option v-for="item in assessOption" :key="item.value1" :label="item.examed_dep_name" :value="item">
        </el-option>
      </el-select>
      <span prop="leader_dep_name" style="margin-left:20px;">牵头单位：<span>{{leader_dep_name}}</span></span>
      <el-button type="primary" size="medium" style="margin-top: 10px;margin-left: 20px;" @click="search" class="bluebtnclass ">
        查询</el-button>
      <el-button type="primary" size="medium" style="float: right;margin-top: 10px;" @click="pingfenSure" class="bluebtnclass "
        :disabled="huidiao"> 保存</el-button>

    </div>
    <!--<div class="title2">-->
    <!--<p>2018年度设区市党建考核加减分考核</p>-->
    <!--</div>-->
    <el-tabs>
      <div>
        <el-table :data="tableData" border stripe :span-method="arraySpanMethod">
          <el-table-column label="加减分项" prop="descrip" width="110"></el-table-column>
          <el-table-column label="指标内容" prop="one_name" width="400">
            <template slot-scope="scope">
              <el-popover placement="bottom" width="400" class="box" trigger="hover" :content="scope.row.one_name"
                popper-class="tipClass" :visible-arrow="false">
                <div slot="reference">{{scope.row.one_name}}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="情况说明">
            <template slot-scope="scope">
              <template v-for="item in scope.row.fileList3">
                <div><a :href="item.href" target="_blank">{{item.name}}</a></div>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="附件材料">
            <template slot-scope="scope">
              <div>{{scope.row.final_explanation}}</div>
            </template>
          </el-table-column>
          <el-table-column label="审核意见" width="100">
            <template slot-scope="scope">
              <!-- <el-input type="textarea" size="medium" :autosize="{ minRows: 2, maxRows: 3}" v-model="scope.row.remark"
                @blur="dafen(scope.row)"></el-input> -->
              <div class="ckyj" @click="unitopinion(scope.row)">
                <div>
                  <p class="tableclicksh">查看</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="审核分" width="100">
            <template slot-scope="scope">
              <el-input type="text" size="medium" maxlength="4" :data-dId="scope.row.id" oninput="this.value=this.value.replace(/^[^\+\-\d]|[^\+\-\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').replace(/[\+\-][^\d.]/g,'')"
                @blur="dafen(scope.row)" v-model="scope.row.score" class="fenshu">
              </el-input>
              <p class="red1s">{{tiptishi}}</p>
            </template>
          </el-table-column>
          <el-table-column label="补充材料">
            <template slot-scope="scope">
              <!-- action="https://jsonplaceholder.typicode.com/posts/" -->
              <el-upload class="upload-demo" :action="uri" :on-success="handleAvatarSuccess" :on-remove='removeFile'
                style="width: 70%;margin: 0 auto;margin-bottom: 10px;" name="files" with-credentials multiple
                :file-list="scope.row.fileList">
                <el-button size="mini" type="text" :disabled="huidiao" @click="xuanze(scope.row)" class="tableclicksh"
                  style="background:none;color:#0841b4"><span style="color:#0841b4">选择文件</span></el-button>
              </el-upload>

              <!-- <el-button size="mini" type="text" @click="shangChuan(scope.row)" style="background: none;color: #F05050;"
                :disabled="huidiao"><i class="el-icon-upload el-icon--right"></i>点击上传</el-button> -->
            </template>
          </el-table-column>

        </el-table>
      </div>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        uri: '',
        value: '',
        value1: '',
        fileList: [],
        niandu: '', //年度
        beexamed_dep_name: '', //被考核单位
        leader_dep_name: '', //牵头单位
        kaoheOptions: [],
        assessOption: [],
        searchParams: {},
        tableData: [],
        fenshuArr: [],
        huidiao: '',
        hang: '',
        // 记录初始意见
        csyj: "",
        tiptishi: "",
        firstTargetArr:[],
        firstTargetPos:0
      }
    },
    methods: {
      //判断分值
      judgefen(item) {
        let refs = this.$refs

        for (let key in refs) {
          if (key == item.instanceDetails_id) {
            if (Number(item.group_score) > Number(item.three_value) || item.group_score == "") {
              // 最大值判断 
              item.group_score = ""
              refs[key].currentValue = ""
              $(refs[key].$el).siblings().show()
              setTimeout(() => {
                $(refs[key].$el).siblings().hide()
              }, 2000)

            } else if (Number(item.group_score < 0)) {
              // 最小值判断 
              item.group_score = "";

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
      // 单位意见
      unitopinion(item) {
        /* 
         *item=scope.row
         */

        this.csyj = item.remark;
        setTimeout(function () {
          var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[2];
          ipt.value = item.remark;
        }.bind(this), 0)
        const h = this.$createElement;
        this.$msgbox({
          title: '单位意见',
          message: h('p', [
            h('span', {
              style: 'color:red;'
            }, '*'),
            h('span', {
              style: 'font-size:16px;width: 400px;display: inline-block;'
            }, '单位意见：'),
            h('textarea', {
              style: 'padding-left:10px;border: 1px solid #dcdfe6;border-radius: 5px;font-size:16px;'
            })
          ]),
          showCancelButton: true,
          closeOnClickModal:false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: "dwyj",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[2];
              item.remark = ipt.value
              if (ipt.value == this.csyj) {
                this.$message({
                  type: 'error',
                  message: '请修改'
                });
                return
              }
              let tempfen = {
                id: item.id,
                AddminusScore: item.score,
                attchment: item.attchment,
                remark: item.remark
              }
              this.fenshuArr.forEach(
                (item, index) => {
                  if (item.id == tempfen.id) {
                    this.fenshuArr.splice(index, 1)
                  }
                }
              )
              this.fenshuArr.push(tempfen)

              this.$http.post(globalConfig.server1 +
                  'dangjian/updateAddMinus', this.fenshuArr)
                .then(
                  res => {


                    if (res.data.response_code == "0") {
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
          name_en: "addminus_dept_score"
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
      //数据导出

      //选择文件
      xuanze(val) {
        this.hang = val
      },
      // //上传成功
      handleAvatarSuccess(response, file, fileList) {
        // this.hang.fileList = fileList
        this.hang.fileList = fileList
        this.hang.fileList.map(item => {
          item.id = this.hang.id
        })
        let str = ""
        console.log(this.hang.fileList);
        
        this.hang.fileList.forEach(item => {
          if (item.response) {
            str += item.response.response_body
          } else {
            str += item.href + '^'
          }
          console.log(item.response.response_body);

        })
        this.hang.attchment = str
        
        let every = {
          id: this.hang.id,
          AddminusScore: this.hang.score,
          attchment: this.hang.attchment,
          remark: this.hang.remark
        }
        this.fenshuArr.forEach((item, index) => {
          if (item.id == every.id) {
            this.fenshuArr.splice(index, 1)
          }
        })
        this.fenshuArr.push(every)

      },

      //删除
      //移除文件
      removeFile(file, fileList) {
        this.tableData.forEach(item => {
          if (item.id == file.id) {

            item.fileList.forEach((val, index) => {
              if (file.uid == val.uid) {
                item.fileList.splice(index, 1)
                this.hang = item
              }

            })
          }
        })

        let str = ""
        this.hang.fileList.forEach(item => {
          if (item.response) {
            str += item.response.response_body
          } else {
            str += item.href + '^'
          }
          
        })


        this.hang.attchment = str
        let every = {
          id: this.hang.id,
          AddminusScore: this.hang.score,
          attchment: this.hang.attchment,
          remark: this.hang.remark
        }
        this.fenshuArr.forEach((item, index) => {
          if (item.id == every.id) {
            this.fenshuArr.splice(index, 1)
          }
        })
        this.fenshuArr.push(every)

      },
      //打分材料上传

      getkhData(val) {
        this.searchParams.instance_id = val.id
        this.search()
        // this.searchParams.examed_dep = val.examed_dep
      },
      getData(val) {
        this.value1 = ''
        let person = JSON.parse(sessionStorage.getItem('personal'))
        if (val.niandu == null) {
          this.niandu = this.formatDate("yyyy", val.niandu)
        } else {}
        this.leader_dep_name = val.leader_dep_name
        this.beexamed_dep_name = val.beexamed_dep_name
        this.searchParams.model_id = val.id
        this.searchParams.add_minus_dep = person.roleData.department.id
        // this.searchParams.id = person.id
        if (this.searchParams.model_id == null) {
          this.tableData = []
        } else {
          this.searchAssessOption()
        }
      },
      search() {
        this.tableData = []
        let params = this.searchParams

        this.$http.post(globalConfig.server3 + 'dangjian/selectAddminus', params).then(res => {
          if (res.data.response_code == "0") {
            this.tableData = res.data.response_body.addminusDetails

            this.tableData.sort((a,b)=>{
              return b.one_value - a.one_value
            })

            this.tableData.forEach(item => {

              if(item.one_value == "1"){
                item.descrip = "加分项"
              }else if(item.one_value == "-1"){
                item.descrip = "减分项"
              }

              let examStr = item.attchment
              let examArr = []
              item.fileList = []
              let http = ""
              if (examStr) {
                this.splitStr(examStr, examArr, http)
                item.fileList = examArr

              }
              let fileStr = item.final_explan_files
              let fileArr = []
              if (fileStr) {
                this.splitStr(fileStr, fileArr, http)
                item.fileList3 = fileArr
              }
              item.fileList.forEach(val => {
                val.id = item.id

              })

            })

            setTimeout(() => {
              $(".el-upload-list__item-name").each((index, item) => {
                $(item).attr("title", $(item).text())
              })
            }, 1000)
            
            this.merge()
            this.searchstatus()
          }
        })

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
      //打分
      dafen(val) {
        let tempfen = {
          id: val.id,
          AddminusScore: val.score,
          attchment: val.attchment,
          remark: val.remark
        }
        var ele = this.GetAttrElement("input", "data-dId", val.id)
        var blocks = ele.parentNode.parentNode.lastChild;
        if (val.one_value == "1") {
          this.tiptishi = "这是加分项,请输入正值"
          if (Number(val.score) < 0) {
            val.score = '';
            blocks.style.display = "block";
            setTimeout(function () {
              blocks.style.display = "none";
            }.bind(this), 2000);
          }

        } else {
          this.tiptishi = "这是减分项,请输入负值"
          if (Number(val.score) > 0) {
            val.score = '';
            blocks.style.display = "block";
            setTimeout(function () {
              blocks.style.display = "none";
            }.bind(this), 2000);
          }
        }
        // if (Number( val.score)>2||Number( val.score)<-2) {
        //   this.$message({
        //     message: '加减分项在-2到2之间',
        //     type: 'error'
        //   });
        //   val.score = '';
        // }

        this.fenshuArr.forEach(
          (item, index) => {
            if (item.id == tempfen.id) {
              this.fenshuArr.splice(index, 1)
            }
          }
        )
        this.fenshuArr.push(tempfen)
      },
      //考核组-被考核单位
      searchAssessOption() {
        let params = {
          model_id: this.searchParams.model_id
        }
        this.$http.post(globalConfig.server3 + 'dangjian/selectInstance2ByModelId', params).then(res => {
          if (res.data.response_code == "0") {
            this.assessOption = res.data.response_body.instances
            this.assessOption.map(item => {

              if (item.instances != null) {
                item.examed_dep_name = item.instances[0].examed_dep_name
              }

            })
            this.value1 = this.assessOption[0].examed_dep_name
            this.getkhData(this.assessOption[0])
            this.search()
          }
        })
      },
      pingfenSure() {
        // 规定加减的大小
        // var count=0;
        // var arr=document.getElementsByClassName("fenshu")

        // for (let i = 0; i < arr.length; i++) {
        //   count = Number(arr[i].children[0].value)
        //   if (count>2||count<-2) {
        //   this.$message({
        //     message: '加减分项总分在-2到2之间',
        //     type: 'error'
        //   });
        //   return
        // }
        // }

        for (var i = 0; i < this.tableData.length; i++) {
          console.log('@@@@@@'+this.tableData[i].score+'@@@@@')
          if (this.tableData[i].score == '') {
            this.$confirm('评分有空值, 是否保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
              
            }).then(() => {
              this.$http.post(globalConfig.server3 + 'dangjian/updateAddMinus', this.fenshuArr).then(res => {
                if (res.data.response_code == "0") {
                  this.$message({
                    message: '保存成功！',
                    type: 'success'
                  })
                   console.log('@@@@@@'+this.tableData[i].score+'@@@@@')
                  this.search();
                } else {
                  this.$message({
                    message: '保存失败！',
                    type: 'error'
                  })
                  this.search();
                }
              })
               console.log('@@@@@@'+this.tableData[i].score+'@@@@@')
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消保存'
              });
            });
            return
          }
        }

        this.$http.post(globalConfig.server3 + 'dangjian/updateAddMinus', this.fenshuArr).then(res => {
          if (res.data.response_code == "0") {
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.search();
          } else {
            this.$message({
              message: '保存失败！',
              type: 'error'
            })
            this.search();
          }
        })
      },
      //指标模型下拉
      searchOption() {
        this.$http.post(globalConfig.server3 + 'dangjian/selectModelByModelType').then(res => {
          if (res.data.response_code == "0") {
            for (let i = 0; i < res.data.response_body.length; i++) {
              res.data.response_body[i].niandu = this.formatDate('yyyy', res.data.response_body[i].niandu)
            }
            this.kaoheOptions = res.data.response_body
            this.value = this.formatDate('yyyy', this.kaoheOptions[0].niandu)
            this.getData(this.kaoheOptions[0])
          }

        })
      },
      downLoadfile(val) {

        // 通过选择器获取img元素
        var elments = $(".downloadtext")
        // 将图片的src属性作为URL地址
        var url = $(".downloadtext").attr('src')
        var a = document.createElement('a')
        var event = new MouseEvent('click')

        a.download = val.unitmaterials || '镇江市高质量考核加减分附件.pdf'
        a.href = url

        a.dispatchEvent(event)
      },
      handleRemove(file, fileList) {

      },
      handlePreview(file) {

        this.fileObj = file.raw
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
        for (var i = 0; i < this.tableData.length; i++) {
          if (i === 0) {
            //第一行必须存在
            this.firstTargetArr.push(1);
            this.firstTargetPos = 0;
          } else {
            // 判断当前元素与上一个元素是否相同 this.firstTargetPos是firstTargetArr内容的序号
            if (this.tableData[i].descrip === this.tableData[i - 1].descrip) {
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
          this.value = this.formatDate('yyyy', this.kaoheOptions[0].niandu)
          // this.value=this.kaoheOptions[0].decription
          this.getData(this.kaoheOptions[0])
          setTimeout(function () {
            this.value1 = this.assessOption[0].examed_dep_name
            this.getkhData(this.assessOption[0])
            setTimeout(function () {
              this.search()
            }.bind(this), 600)
          }.bind(this), 500)
        }.bind(this), 400)
      }
    },
    mounted() {
      this.searchOption()
      // this.mrxs();
      this.uri = globalConfig.server2 + 'dangjian/uploadBeikaohe'
    },
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

  span {
    color: #606266;
  }

  .title1 {
    height: 70px;
    line-height: 3.5;
    padding: 5px 0px 0px 0px;
  }

  .title2 {
    margin: 20px 0 20px;

    p {
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      color: #333;
    }
  }

  .red1s {
    color: #ff0000;
    display: none;
  }

  .red2s {
    color: #ff0000;
    display: none;
  }

  .downloadtext {
    cursor: pointer;
    color: #ff0000;
  }

  .fenshu {
    width: 70px;

  }

</style>
<style lang="scss">
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

  #addminusScore {
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
