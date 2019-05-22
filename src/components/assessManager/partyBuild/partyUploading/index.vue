<template>
  <div id="partyUploading" style="margin-top:-8px;">
    <div class="assessIssue">
      <el-form class="issueTop">
        <ul class="assessTitle clearfix">
          <li><span>年度：</span>
            <!-- <span>{{pageMsg.model_name}}</span> -->
            <el-select v-model="value" size="medium" placeholder="请选择" value-key="model_name" @change="xuanzhong" style="width: 150px;">
              <el-option v-for="item in pkioptions" :key="item.model_name" :label="item.showniandu" :value="item">
              </el-option>
            </el-select>
          </li>
          <li><span>牵头单位：</span><span>{{pageMsg.leader_dep_name}}</span></li>
          <!-- <li><span>年份：</span><span>{{pageMsg.niandu}}</span></li> -->
          <li style="float:right;margin-right: 0">
            <el-button size="medium" type="primary" @click="baocunBtn" class="bluebtnclass"  :disabled="huidiao">保存</el-button>
          </li>
        </ul>

      </el-form>
      <div>
        <el-table :data="highQuality" :span-method="arraySpanMethod" border style="width: 100%" stripe>
          <el-table-column prop="one_name" label="一级指标" width="200">
            <template slot-scope="scope">
              <div style="font-size: 18px">{{scope.row.one_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="two_name" label="二级指标" width="200"></el-table-column>
          <el-table-column prop="three_name" label="三级指标">
            <template slot-scope="scope">
              <el-popover placement="bottom" width="400" class="box" trigger="hover" :content="scope.row.three_name"
                popper-class="tipClass" :visible-arrow="false">
                <div slot="reference" style="font-size: 14px">{{scope.row.three_name}}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="three_content" label="内容" width="280">
            <template slot-scope="scope">
              <el-popover placement="bottom" width="400" class="box" trigger="hover" :content="scope.row.three_content"
                popper-class="tipClass" :visible-arrow="false">
                <div slot="reference">{{scope.row.three_content}}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="情况说明" prop="wenjian" width="100">
            <template slot-scope="scope">
              <!-- <el-input type="textarea" size="mini" :autosize="{ minRows: 3, maxRows: 3}" @blur="shuoming(scope.row)"
              v-model="scope.row.wenjian.final_explanation"></el-input> -->
              <div class="ckyj" @click="unitopinion(scope.row)">
                <div>
                  <p class="tableclicksh">申报</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="final_explan_files" label="附件材料" width="250">
            <template slot-scope="scope">
              <el-upload class="upload-demo" :action="uri" :on-success="handleAvatarSuccess" :on-remove='removeFile'
                style="width: 70%;margin: 0 auto;margin-bottom: 10px;" name="files" with-credentials multiple
                :file-list="scope.row.examfileList">
                <el-button size="mini" type="text" :disabled="huidiao" @click="xuanze(scope.row)" class="tableclicksh" style="background:none;color:#0841b4"><span>选择文件</span></el-button>
              </el-upload>
              <!-- <el-button size="mini" type="text" :disabled="huidiao" @click="shangchan(scope.row)" style="margin: 0 auto;color: #F05050;"><i
                class="el-icon-upload el-icon--right"></i>点击上传</el-button> -->
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
        uri: '',
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
          niandu: "",
          leader_dep_name: "",
        },
        pkioptions: [],
        value: "",
        highQuality: [],
        shuomingArr: [],
        shangchuanparams: {},
        hang: {},
        // 记录初始意见
        csyj: ""
      };
    },
    methods: {
      // 单位意见
      unitopinion(item) {
        /* 
         *item=scope.row
         */

        this.csyj = item.wenjian.final_explanation;
        setTimeout(function () {
          var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[2];
          ipt.value = item.wenjian.final_explanation;
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
              item.wenjian.final_explanation = ipt.value
              if (ipt.value == this.csyj) {
                this.$message({
                  type: 'error',
                  message: '请修改'
                });
                return
              }
              let every = {
                id: item.wenjian.id,
                final_explan_files: item.wenjian.final_explan_files || "",
                final_explanation: item.wenjian.final_explanation || "",
              }

              this.shuomingArr.forEach((item, index) => {
                if (item.id == every.id) {
                  this.shuomingArr.splice(index, 1)
                }
              })
              this.shuomingArr.push(every)

              this.$http.post(globalConfig.server1 +
                  "dangjian/updatefinal_explanation", this.shuomingArr)
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
      //选中
      xuanzhong(val) {
        this.pageMsg = {
          leader_dep_name: val.leader_dep_name
        }
        this.gettableContent(val)
      },
      //上传
      xuanze(val) {
        this.hang = val
      },
      shangchan(val) {
        // this.url = "http://192.168.11.208:9092/dangjian/uploadCailiao"
        this.url = globalConfig.server1 + 'dangjian/uploadCailiao'

        let params = {
          instance_detail_id: val.instanceDetails[0].id
        }

        if (JSON.stringify(this.fileObj) == "{}") {
          this.$message({
            type: 'warning',
            message: '请先选择文件!'
          });
        }
        let fd = new FormData()
        fd.append("files", this.fileObj)
        // fd.append("requestBody", JSON.stringify(bianliang.status))

        this.$http.post(globalConfig.server3 +
          'dangjian/uploadCailiao', fd).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              type: 'success',
              message: '上传成功!'
            });
            this.fileObj = {}
            this.fileList = []
          } else {

          }

        })
      },

      handlePreview(file) {

        this.fileObj = file.raw
      },
      //上传成功
      handleAvatarSuccess(response, file, fileList) {
        this.hang.examfileList = fileList
        this.hang.examfileList.map(item => {
          item.id = this.hang.wenjian.id
        })
        let str = ""
        this.hang.examfileList.forEach(item => {
          if (item.response) {
            str += item.response.response_body
          } else {
            str += item.href + '^'
          }
          // str += item.response.response_body
        })
        this.hang.wenjian.final_explan_files = str
        let every = {
          id: this.hang.wenjian.id,
          final_explan_files: this.hang.wenjian.final_explan_files || "",
          final_explanation: this.hang.wenjian.final_explanation || ""
        }
        this.shuomingArr.forEach((item, index) => {
          if (item.id == every.id) {
            this.shuomingArr.splice(index, 1)
          }
        })
        this.shuomingArr.push(every)

      },

      //删除
      //移除文件
      removeFile(file, fileList) {
        this.highQuality.forEach(item => {
          if (item.wenjian.id == file.id) {

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
            str += item.href + '^'
          }
        })
        this.hang.wenjian.final_explan_files = str
        let every = {
          id: this.hang.wenjian.id,
          final_explan_files: this.hang.wenjian.final_explan_files || "",
          final_explanation: this.hang.wenjian.final_explanation || ""
        }
        this.shuomingArr.forEach((item, index) => {
          if (item.id == every.id) {
            this.shuomingArr.splice(index, 1)
          }
        })
        this.shuomingArr.push(every)

      },

      //获取考核指标下拉框
      kpiselect() {
        this.$http.post(globalConfig.server3 + "dangjian/selectModel", {}).then(res => {
          if (res.data.response_code == "0") {
            this.pkioptions = res.data.response_body
            this.pkioptions.forEach(item => {
              if (item.niandu != null)
                item.showniandu = this.formatDate('yyyy', item.niandu)
            })
            this.value = this.pkioptions[0]
            this.xuanzhong(this.pkioptions[0])
          } else {

          }

        })

      },
      //保存
      shuoming(val) {

        let every = {
          id: val.wenjian.id,
          final_explan_files: val.wenjian.final_explan_files || "",
          final_explanation: val.wenjian.final_explanation || "",
        }


        this.shuomingArr.forEach((item, index) => {
          if (item.id == every.id) {
            this.shuomingArr.splice(index, 1)
          }
        })
        this.shuomingArr.push(every)
      },
      baocunBtn() {

        if (this.shuomingArr.length == "") {
          return this.$message({
            message: '请修改',
            type: 'error'
          });
        }
        this.$http.post(globalConfig.server3 + "dangjian/updatefinal_explanation", this.shuomingArr).then(res => {
          if (res.data.response_code == "0") {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.gettableContent(this.value)
            this.shuomingArr = []
          } else {
            this.$message({
              message: '保存失败',
              type: 'error'
            });
            this.shuomingArr = []
            this.gettableContent(this.value)
          }

        })

      },
      // 根据英文名查询开关状态
      searchstatus() {
        let params = {
          name_en: "uploadzuozFile"
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
      //获取页面内容
      gettableContent(val) {
        let id = JSON.parse(sessionStorage.getItem('personal')).id
        let params = {
          id: id,
          model_id: val.id,
          name_en: "uploadzuozFile"
        }
        this.$http.post(globalConfig.server3 + "dangjian/selectCailiao", params).then(res => {
          if (res.data.response_code == "0") {
            this.highQuality = res.data.response_body.contents
            this.highQuality.map(item => {
              item.wenjian = item.instanceDetails[0]
            })

            this.highQuality.map((item) => {
              item.one_name = item.one_name + "(" + item.one_value + "分)"
              item.two_name = item.two_name + "(" + item.two_value + "分)"
              item.three_name = item.three_name + "(" + item.three_value + "分）"
              item.examfileList = []

              let str = item.wenjian.final_explan_files
              if (str) {
                let examArr = []
                let http = globalConfig.server1
                this.splitStr(str, examArr, http)
                item.examfileList = examArr
              }
              item.examfileList.forEach(val => {
                val.id = item.wenjian.id

              })
            })

            setTimeout(() => {
              $(".el-upload-list__item-name").each((index, item) => {
                $(item).attr("title", $(item).text())
              })
            }, 1000)

            this.searchstatus()
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
      // mrxs() {
      //   setTimeout(function () {
      //     this.xuanzhong(this.pkioptions[0])
      //   }.bind(this), 400)
      // }

    },
    mounted() {
      this.kpiselect() //考核指标下拉框
      // this.mrxs()
      this.uri = globalConfig.server1 + 'dangjian/uploadCailiao'
    },
  };

</script>

<style scoped lang="scss">
  #partyUploading {
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
  }

</style>
<style lang="scss">
  #partyUploading {
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

    .assessIssue {
      .el-input--mini .el-input__inner {
        height: 38px;
        line-height: 38px;
      }

      .el-form-item__label {
        font-size: 16px;
        line-height: 42px;
      }

      .issueTop {
        margin-top: 0px;
        padding: 10px 0 30px 0px;
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
  }

</style>
