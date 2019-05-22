<template>
  <div class="assessIssue" id="dutyPersontareckCalssh" style="margin-top:-6px;">
    <el-form class="issueTop">
      <ul class="assessTitle clearfix">
        <!-- <li><span>考核指标：</span><span>{{pageMsg.model_name}}</span></li> -->
        <li>
          <span>被考核单位： </span>
          <el-select v-model="value2" style="width:150px;" size="mini" placeholder="请选择" value-key="beexamed_dep_name" @change="getpageContent"
            class="assessSelect">
            <el-option v-for="item in beexamedoptions" :key="item.beexamed_dep_name" :label="item.beexamed_dep_name" :value="item">
            </el-option>
          </el-select>
        </li>
        <li><span>牵头单位：</span><span>{{pageMsg.leader_dep_name}}</span></li>
        <!-- <li><span>年份：</span><span>{{pageMsg.niandu}}</span></li> -->

      </ul>
      <!-- <div class="unitList"> -->
      <!--<p><span>责任单位：</span><span>{{pageMsg.bendanwei}}</span></p>-->
      <!--<p><span>被考核单位：</span><span>{{value.beexamed_dep_name}}</span></p>-->
      <el-button size="medium" type="primary" class="bluebtnclass"  @click="baocunshuom" :disabled="huidiao"> 保存</el-button>
      <!-- </div> -->
    </el-form>
    <div>
      <el-table :data="highQuality" :span-method="arraySpanMethod" border style="width: 100%" stripe>
        <el-table-column prop="one_name" label="一级指标" width="100">
          <template slot-scope="scope">
            <div style="font-size: 18px">{{scope.row.one_name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="two_name" label="二级指标"> </el-table-column>
        <el-table-column prop="three_name" label="三级指标">
          <template slot-scope="scope">
            <el-popover placement="bottom" width="400" :content="scope.row.three_name" class="box" trigger="hover"
              popper-class="tipClass" :visible-arrow="false">
              <div slot="reference" class="threeflow">{{scope.row.three_name}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="three_content" label="指标内容">
          <template slot-scope="scope">
            <el-popover placement="bottom" width="400" class="box" trigger="hover" :content="scope.row.three_content"
              popper-class="tipClass" :visible-arrow="false">
              <div slot="reference">{{scope.row.three_content}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <!--<el-table-column prop="examed_dep_name" label="责任单位"> </el-table-column>-->
        <el-table-column prop="final_explanation" label="情况说明" width="200"> </el-table-column>
        <el-table-column label="附件材料" prop="final_explanation" width="200">
          <template slot-scope="scope">
            <template v-for="item in scope.row.fileList">
              <div><a :href="item.href" target="_blank">{{item.name}}</a></div>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" prop="examopinion" width="100">
          <template slot-scope="scope">
            <!-- <el-input type="textarea" size="mini" :autosize="{ minRows: 1, maxRows: 3}" v-model="scope.row.examopinion"
              @blur="getyijian(scope.row)"></el-input> -->
            <!-- <el-button type="primary" @click="unitopinion(scope.row)">查看意见</el-button> -->
            <div class="ckyj" @click="unitopinion(scope.row)">
              <div class="tableclicksh" style="height:auto;">
                <p>查看</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核分" prop="examedscore" width="100">
          <template slot-scope="scope">
            <!-- <el-input type="text"  size="mini" :data-dId="scope.row.three_content"  v-model="scope.row.examedscore" @blur="getyijian(scope.row)"
oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/(\.\d)\./g,'$1').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');" @change="dafen(scope.row)"></el-input> -->
            <el-input type="text" class="widths" maxlength="5" size="mini" :ref="scope.row.instance_detail_id"
              :data-dId="scope.row.three_content" v-model="scope.row.examedscore" @blur="getyijian(scope.row)" oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/(\.\d)\./g,'$1').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');"></el-input>
            <p class="reds">评分值错误，请重新输入</p>
          </template>
        </el-table-column>
        <el-table-column prop="uploadmaterials" label="补充材料">
          <template slot-scope="scope">
            <el-upload class="upload-demo" :action="uri" :on-success="successFile" :on-remove="removeFile" multiple
              name="files" with-credentials style="width: 70%;margin: 0 auto;" :file-list="scope.row.examedfile">
              <el-button size="mini" type="text" @click="xuanze(scope.row)" :disabled="huidiao" class="tableclicksh"
                style="color: #0841B4;background: none;"><span>选择文件</span></el-button>
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
        huidiao: '',
        fileObj: {},
        fileList: [],
        table: [],
        firstTargetArr: [], //一级指标合并数组
        firstTargetPos: 0,
        secondTargetArr: [], //二级指标合并数组
        secondTargetPos: 0,
        currentPage: 4,
        pageMsg: {
          model_name: "",
          bendanwei: "",
          niandu: "",
          leader_dep_name: "",
          beexamed_dep_name: ""
        },
        beexamedoptions: [],
        value2: "",
        value: "",
        highQuality: [],
        addMiusShuoming: [],
        uri: "",
        hang: "",
        query: "",
        // 记录初始意见
        csyj: ""
      };
    },
    methods: {
      //判断分值
      judgefen(item) {
        let refs = this.$refs
        for (let key in refs) {

          if (key == item.instance_detail_id) {
            if (Number(item.examedscore) > Number(item.three_value) || item.examedscore == "") {
              // 最大值判断 

              item.examedscore = ""
              refs[key].currentValue = ""
              $(refs[key].$el).siblings().show()
              setTimeout(() => {
                $(refs[key].$el).siblings().hide()
              }, 2000)

            } else if (Number(item.examedscore < 0)) {
              // 最小值判断 
              item.examedscore = "";

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
        this.csyj = item.examopinion;
        setTimeout(function () {
          var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[2];
          ipt.value = item.examopinion;
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
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          customClass: "dwyj",
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[2];
              item.examopinion = ipt.value
              if (ipt.value == this.csyj) {
                this.$message({
                  type: 'error',
                  message: '请修改'
                });
                return
              }
              let temp = {
                gexing_detail_id: item.examedfileList.id,
                opinion: item.examopinion || "",
                score: item.examedscore || "",
                attachment: item.examFiles || ""
              }
              this.addMiusShuoming.forEach((item, index) => {
                if (item.gexing_detail_id == temp.gexing_detail_id) {
                  this.addMiusShuoming.splice(index, 1)
                }
              })
              this.addMiusShuoming.push(temp)
              this.$http.post(globalConfig.server1 +
                'PersonalityAuditOfResponsibleUnits/updateGeXingDetail', this.addMiusShuoming).then(res => {
                if (res.data.response_code === '200') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  setTimeout(function () {
                    this.getpageContent(this.query)
                  }.bind(this), 400)
                  // this.mrsx()
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

      // 打分判断
      dafen(item) {
        /*
         *item=scope.row
         */
        var ele = this.GetAttrElement("input", "data-dId", item.three_content)
        var blocks = ele.parentNode.parentNode.lastChild
        if (Number(item.examedscore) > Number(item.three_value)) {
          // 最大值判断 
          item.examedscore = "";

          ele.value = ""
          blocks.style.display = "block";
          setTimeout(function () {
            blocks.style.display = "none";
          }.bind(this), 2000);

        } else if (item.examedscore < 0) {
          // 最小值判断 
          item.examedscore = "";
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
          name_en: "zr_dept_check"
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
      //获得意见
      getyijian(val) {

        this.judgefen(val)
        let temp = {
          gexing_detail_id: val.examedfileList.id,
          opinion: val.examopinion || "",
          score: val.examedscore || "",
          attachment: val.examFiles || ""
        }
        this.addMiusShuoming.forEach((item, index) => {
          if (item.gexing_detail_id == temp.gexing_detail_id) {
            this.addMiusShuoming.splice(index, 1)
          }
        })

        this.addMiusShuoming.push(temp)


      },
      //保存说明
      baocunshuom() {
        for (var i = 0; i < this.highQuality.length; i++) {
          console.log(this.highQuality[i].examedscore)
          if (!this.highQuality[i].examedscore) {
            this.$confirm('评分有空值, 是否保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.addMiusShuoming.length == 0) {
                this.$message({
                  type: 'error',
                  message: '请做出更改'
                });
              } else {
                this.$http.post(globalConfig.server1 +
                  'PersonalityAuditOfResponsibleUnits/updateGeXingDetail', this.addMiusShuoming).then(res => {
                  if (res.data.response_code === '200') {
                    this.$message({
                      type: 'success',
                      message: '保存成功!'
                    });
                    this.addMiusShuoming = []
                    setTimeout(function () {

                      this.getpageContent(this.query)
                    }.bind(this), 200)
                    // this.mrsx()
                  } else {
                    this.$message({
                      type: 'error',
                      message: '保存失败!'
                    });
                    this.addMiusShuoming = []
                    setTimeout(function () {

                      this.getpageContent(this.query)
                    }.bind(this), 400)
                  }
                })
              }
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消保存'
              });
            });
            return
          }
        }
        if (this.addMiusShuoming.length == 0) {
          this.$message({
            type: 'error',
            message: '请做出更改'
          });
        } else {
          this.$http.post(globalConfig.server1 +
            'PersonalityAuditOfResponsibleUnits/updateGeXingDetail', this.addMiusShuoming).then(res => {
            if (res.data.response_code === '200') {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.addMiusShuoming = []
              setTimeout(function () {

                this.getpageContent(this.query)
              }.bind(this), 400)
              // this.mrsx()
            } else {
              this.$message({
                type: 'error',
                message: '保存失败!'
              });
              this.addMiusShuoming = []
              setTimeout(function () {

                this.getpageContent(this.query)
              }.bind(this), 400)
            }
          })
        }
      },
      //上传
      xuanze(val) {
        this.hang = val
      },
      successFile(response, file, fileList) {
        fileList.map(item => {
          item.id = this.hang.examedfileList.id
        })
        this.hang.attachmentfileList = fileList
        let str = ""
        this.hang.attachmentfileList.forEach(item => {
          if (item.response) {
            str += item.response.response_body
          } else {
            str += item.href + "^"
          }
        })
        this.hang.examFiles = str

        let temp = {
          gexing_detail_id: this.hang.examedfileList.id,
          opinion: this.hang.examopinion || "",
          score: this.hang.examedscore || "",
          attachment: this.hang.examFiles || ""
        }
        this.addMiusShuoming.forEach((item, index) => {
          if (item.gexing_detail_id == temp.gexing_detail_id) {
            this.addMiusShuoming.splice(index, 1)
          }
        })
        this.addMiusShuoming.push(temp)

      },
      //移除文件
      removeFile(file, fileList) {
        this.highQuality.forEach(item => {
          if (item.examedfileList.id == file.id) {

            item.examedfile.forEach((val, index) => {
              if (file.uid == val.uid) {
                item.examedfile.splice(index, 1)
                this.hang = item
              }

            })
          }
        })

        let str = ""
        this.hang.examedfile.forEach(item => {
          if (item.response) {
            str += item.response.response_body
          } else {
            str += item.href + "^"
          }
        })
        this.hang.examFiles = str

        let temp = {
          gexing_detail_id: this.hang.examedfileList.id,
          opinion: this.hang.examopinion || "",
          score: this.hang.examedscore || "",
          attachment: this.hang.examFiles || ""
        }
        this.addMiusShuoming.forEach((item, index) => {
          if (item.gexing_detail_id == temp.gexing_detail_id) {
            this.addMiusShuoming.splice(index, 1)
          }
        })
        this.addMiusShuoming.push(temp)

      },

      downLoadfile(val) {

        // 通过选择器获取img元素
        var elments = $(".downloadtext")
        // 将图片的src属性作为URL地址
        var url = $(".downloadtext").attr('src')
        var a = document.createElement('a')
        var event = new MouseEvent('click')

        a.download = val.unitmaterials || '我是下载'
        a.href = url

        a.dispatchEvent(event)
      },



      //获取责任单位个性指标下拉框
      getContent() {

        let person = JSON.parse(sessionStorage.getItem('personal'))
        let params = {
          user_id: person.id,
          model_type: "个性"
        }

        this.$http.post(globalConfig.server1 + "PersonalityAuditOfResponsibleUnits/selectModel", params).then(res => {
          if (res.data.response_code == "0") {
            this.beexamedoptions = res.data.response_body
            
            this.value2 = this.beexamedoptions[0].beexamed_dep_name;
            this.getpageContent(this.beexamedoptions[0])
          } else {

          }

        })
      },
      //获取页面数据
      getpageContent(val) {
        this.query = val
        this.pageMsg = {
          model_name: val.model_name,
          niandu: this.formatDate('yyyy', val.niandu),
          leader_dep_name: val.leader_dep_name,
          beexamed_dep_name: val.beexamed_dep_name
        }
        let params = {
          model_id: val.id,
          department_id: val.department_id
        }
        this.getpartment()
        this.$http.post(globalConfig.server1 +
          "PersonalityAuditOfResponsibleUnits/selectZeRenDanWeiGeXingZhiBiaoShenHe", params).then(res => {
          if (res.data.response_code == "0") {
            this.highQuality = []
            let data = res.data.response_body

            for (let key in data) {
              data[key][0].examedfileList = data[key][1][0]
              this.highQuality.push(data[key][0])
            }
            console.log(this.highQuality);
            this.highQuality.forEach(item => {
              item.examopinion = item.examedfileList.opinion
              item.examedscore = item.examedfileList.score
              item.examFiles = item.examedfileList.attachment
              item.examedfile = []
              item.one_name = item.one_name + "(" + item.one_value + "分)"
              item.two_name = item.two_name + "(" + item.two_value + "分)"
              item.three_name = item.three_name + "(" + item.three_value + "分）"


              let arr = []
              let str = item.final_explan_files

              if (str) {
                let strArr = str.split('^')
                strArr.splice(strArr.splice.length - 1, 1)
                strArr.map(val => {
                  let obj = {}
                  obj.name = val.split('~')[1]
                  val = val.substring(1)
                  obj.href = globalConfig.server1 + val
                  arr.push(obj)
                })
                item.fileList = arr
              }

              let examStr = item.examedfileList.attachment

              let examArr = []
              let http = ""
              if (examStr) {
                this.splitStr(examStr, examArr, http)
                item.examedfile = examArr

              }

              item.examedfile.forEach(val => {
                val.id = item.examedfileList.id
              })
              setTimeout(() => {
                $(".el-upload-list__item-name").each((index, item) => {
                  $(item).attr("title", $(item).text())
                })
              }, 1000)


            })
            this.merge()
          } else {
            this.highQuality = []
          }
        })
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
        for (var i = 0; i < this.highQuality.length; i++) {
          if (i === 0) {
            //第一行必须存在
            this.firstTargetArr.push(1);
            this.firstTargetPos = 0;

            this.secondTargetArr.push(1);
            this.secondTargetPos = 0;
          } else {
            // 判断当前元素与上一个元素是否相同 this.firstTargetPos是firstTargetArr内容的序号

            //一级指标
            if (this.highQuality[i].one_name === this.highQuality[i - 1].one_name) {
              this.firstTargetArr[this.firstTargetPos] += 1;
              this.firstTargetArr.push(0);
            } else {
              this.firstTargetArr.push(1);
              this.firstTargetPos = i;
            }

            //二级指标
            if (this.highQuality[i].two_name === this.highQuality[i - 1].two_name && this.highQuality[i].one_name ===
              this.highQuality[
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
      //获取本单位
      getpartment() {
        let person = JSON.parse(sessionStorage.getItem('personal'))
        let params = {
          user_id: person.id
        }
        this.$http.post(globalConfig.server1 + "PersonalityAuditOfResponsibleUnits/selectDepartmentIdByUserId", params)
          .then(
            res => {
              if (res.data.response_code == "200") {

                this.pageMsg.bendanwei = res.data.response_desc
              } else {

              }
            })
      },
      mrsx() {
        setTimeout(function () {
         
        }.bind(this), 500)
      }

    },
    mounted() {
      this.searchstatus()
      this.getContent()
      this.uri = globalConfig.server1 + "PersonalityAuditOfResponsibleUnits/selectZeRenDanWeiGeXingZhiBiaoShenHeUpload"
      // this.mrsx();
    },
  };

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

  .issueTop {
    margin: 10px 0 32px 0;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .assessTitle {
      line-height: 42px;

      li {
        float: left;
        color: #606266;
        margin-right: 20px;
      }
    }

    .unitList {
      overflow: hidden;
      line-height: 38px;

      p {
        display: inline-block;
        margin-right: 20px;

        span {
          color: #606266;
          font-size: 16px;
        }
      }

      .el-button {
        float: right;
        margin-right: 30px;
      }
    }

  }

  .downloadtext {
    cursor: pointer;
    color: #ef6f12;
  }

  .block {
    margin-top: 15px;
  }

  .assessIssue {
    min-height: 450px;
  }

  .el-form-item__label {
    font-size: 16px;
  }

  .el-select-dropdown__item {
    font-size: 16px;
  }

</style>
<style lang="scss">
  #dutyPersontareckCalssh {
    .assessSelect {
      width: 370px;
    }

    .el-input--mini .el-input__inner {
      text-align: center;
      height: 38px;
      line-height: 38px;
    }

    .widths {
      input {
        text-align: center;
        width: 70px;
      }
    }

    .reds {
      color: #ff0000;
      display: none;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .el-table__row td .cell .box .el-popover__reference {
      height: 10%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .threeflow {
      height: 10%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 14px;
    }

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
  }

</style>
