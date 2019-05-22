<template>
  <div class="assessIssue" id="assdivh" style="margin-top:-8px;">
    <el-form class="issueTop">
      <div class="asstopWrap">
        <ul class="assessTitle clearfix">
          <li>
            <span>年度：</span>
            <el-select
              v-model="modelName"
              size="mini"
              placeholder="请选择"
              @change="getChange"
              value-key="model_name"
              style="width: 150px;"
            >
              <el-option
                v-for="item in modelNameOption"
                :key="item.id"
                :label="item.niandu"
                :value="item"
              ></el-option>
            </el-select>
          </li>
          <li></li>
          <li>
            <span>被考核单位：</span>
            <el-select
              v-model="beexamed"
              size="mini"
              style="width: 150px;"
              placeholder="请选择"
              value-key="examed_dep_name"
              @change="getpageContent"
            >
              <el-option
                v-for="item in beexamedOption"
                :key="item.id"
                :label="item.examed_dep_name"
                :value="item"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-button
              type="primary"
              size="medium"
              style="margin-left: 20px;"
              class="bluebtnclass"
              @click="getpageContent(searchCanshu)"
            >查询</el-button>
          </li>
          <li style="margin-right:0px">
            <el-button
              size="medium"
              type="primary"
              @click="baocunshuoming"
              :disabled="huidiao"
              class="bluebtnclass"
            >保存</el-button>
          </li>
        </ul>
      </div>
      <div class="unitList">
        <!-- <p>2018年度推进高质量指标加减分项材料审核</p> -->
      </div>
    </el-form>
    <div>
      <el-table :data="highQuality" border="" style="width: 100%" stripe :span-method="arraySpanMethod">
        <el-table-column label="加减分项" prop="descrip" width="110"></el-table-column>
        <el-table-column prop="one_name" label="指标名称">
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              width="400"
              class="box"
              trigger="hover"
              :content="scope.row.one_name"
              popper-class="tipClass"
              :visible-arrow="false"
            >
              <div slot="reference">{{scope.row.one_name}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="情况说明" prop="final_explanation"></el-table-column>
        <el-table-column label="附件材料" prop="fileList">
          <!-- <template slot-scope="scope">
              <span @click="downLoadfile(scope.row)" title="点击下载" class="downloadtext">{{scope.row.final_explan_files}}</span>
          </template>-->
          <template slot-scope="scope">
            <template v-for="item in scope.row.fileList">
              <div>
                <a :href="item.href" target="_blank">{{item.name}}</a>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="责任单位" prop="flag">
          <template slot-scope="scope">
            <template v-for="item in scope.row.flag">
              <div class="colorfont" @click="dutySuggest(scope.row)">{{item}}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" width="100" prop="score_opinion">
          <template slot-scope="scope">
            <div class="ckyj" @click="unitopinion(scope.row)">
              <div>
                <p class="tableclicksh" style="color:#0841b4;border-bottom:1px solid #0841b4;">查看</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核分" prop="score" width="100">
          <template slot-scope="scope">
            <el-input
              class="zongpin"
              @blur="getshuoming(scope.row)"
              v-model="scope.row.score"
              size="mini"
              :data-dId="scope.row.instance_detail_id"
              oninput="this.value=this.value.replace(/^[^\+\-\d]|[^\+\-\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').replace(/[\+\-][^\d.]/g,'')"
            >{{scope.row.score}}</el-input>
            <p class="red1s">{{tiptishi}}</p>
          </template>
        </el-table-column>
        <el-table-column label="补充材料" prop="score_files" width="350">
          <template slot-scope="scope">
            <el-upload
              class="upload-demo"
              :action="uri"
              :on-success="successFile"
              :on-remove="removeFile"
              multiple
              name="files"
              with-credentials
              style="width: 70%;margin: 0 auto;"
              :file-list="scope.row.scorefiles"
            >
              <el-button
                size="mini"
                type="text"
                @click="xuanze(scope.row)"
                :disabled="huidiao"
                class="tableclicksh"
                style="background: none;color: #0841B4;"
              >
                <span>选择文件</span>
              </el-button>
            </el-upload>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="chakan(scope.row)">查看详情</el-button>
            </template>
        </el-table-column>-->
      </el-table>
      <!-- 加减分详情弹窗 -->
      <el-dialog
        v-dialogDrag
        title="提示"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="30%"
        class="proupClass"
      >
        <div>
          <el-table :data="addminusdata" style="width: 100%">
            <el-table-column prop="examed_dep_name" label="责任单位" width="180"></el-table-column>
            <el-table-column prop="opinion" label="审核意见"></el-table-column>
            <el-table-column prop="score" label="审核分" width="180"></el-table-column>
            <el-table-column prop="attchment" label="补充材料"></el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="proupbtnquxiao" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" class="proupbtnqueding" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 责任单位意见弹窗 -->
      <el-dialog
        v-dialogDrag
        :close-on-click-modal="false"
        title="责任单位详情"
        :visible.sync="dutyUnitVisible"
        width="30%"
        class="proupClass"
      >
        <div>
          <el-table :data="dutyUnitData" style="width: 100%" border="">
            <el-table-column prop="add_minus_name" label="单位名称"></el-table-column>
            <el-table-column prop="opinion" label="审核意见"></el-table-column>
            <el-table-column prop="score" label="审核分" width="100"></el-table-column>
            <el-table-column prop="examfileList" label="补充材料">
              <template slot-scope="scope">
                <template v-for="item in scope.row.examfileList">
                  <div>
                    <a :href="item.href" target="_blank">{{item.name}}</a>
                  </div>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="dutyUnitVisible = false" size="medium">取 消</el-button> -->
          <el-button
            type="primary"
            class="proupbtnqueding"
            @click="dutyUnitVisible = false"
            size="medium"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uri: "",
      dutyUnitVisible: false,
      dialogVisible: false,
      dutyUnitData: [],
      addminusdata: [],
      fileList: [],
      table: [],
      currentPage: 4,
      options: [],
      model_dept: "",
      value: "",
      huidiao: "",
      beexamed_dep_name: "", //被考核单位
      leader_dep_name: "", //牵头单位
      exame_dep_name: "", //考核单位
      highQuality: [],
      shuomingArr: [],
      fileObj: {},
      modelName: "", //考核指标
      modelNameOption: [], //考核指标下拉框
      beexamed: "", //被考核单位
      beexamedOption: [], //被考核单位下拉框
      hang: "",
      // 记录初始意见
      csyj: "",
      tiptishi: "",
      searchCanshu:{},
      firstTargetArr:[],
      firstTargetPos:0
    };
  },
  methods: {
    // 单位意见
    unitopinion(item) {
      /* 
         *item=scope.row
         */

      this.csyj = item.score_opinion;
      setTimeout(
        function() {
          var ipt = document.getElementsByClassName(
            "el-message-box__message"
          )[0].children[0].children[2];
          ipt.value = item.score_opinion;
        }.bind(this),
        0
      );
      const h = this.$createElement;
      this.$msgbox({
        title: "单位意见",
        message: h("p", [
          h(
            "span",
            {
              style: "color:red;"
            },
            "*"
          ),
          h(
            "span",
            {
              style: "font-size:16px;width: 400px;display: inline-block;"
            },
            "单位意见："
          ),
          h("textarea", {
            style:
              "padding-left:10px;border: 1px solid #dcdfe6;border-radius: 5px;font-size:16px;"
          })
        ]),
        showCancelButton: true,
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "dwyj",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            var ipt = document.getElementsByClassName(
              "el-message-box__message"
            )[0].children[0].children[2];
            item.score_opinion = ipt.value;
            if (ipt.value == this.csyj) {
              this.$message({
                type: "error",
                message: "请修改"
              });
              return;
            }
            let temp = {
              instance_detail_id: item.instance_detail_id,
              score: item.score || "",
              score_opinion: item.score_opinion || "",
              score_files: item.score_files || ""
            };
            this.shuomingArr.forEach((item, index) => {
              if (temp.instance_detail_id == item.instance_detail_id) {
                this.shuomingArr.splice(index, 1);
              }
            });
            this.shuomingArr.push(temp);
            this.$http
              .post(
                globalConfig.server1 +
                  "AuditOfAdditionOrReductionOfResponsibleUnits/updateFaGaiWeiJiaJianFenTwo",
                this.shuomingArr
              )
              .then(res => {
                if (res.data.response_code == "200") {
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                } else {
                }
              });

            done();
          } else {
            done();
          }
        }
      }).catch(() => {});
    },
    //责任单位意见
    dutySuggest(val) {
      let params = {
        instance_detail_id: val.instance_detail_id
      };

      this.$http
        .post(
          globalConfig.server3 +
            "AuditOfAdditionOrReductionOfResponsibleUnits/selectFaGaiWeiJiaJianFenAnNiu",
          params
        )
        .then(res => {
          if (res.data.response_code == "200") {
            this.dutyUnitData = res.data.response_body;
            this.dutyUnitData.forEach(item => {
              let str = item.attchment;
              if (str) {
                let examArr = [];
                let http = globalConfig.server1;
                this.splitStr(str, examArr, http);
                item.examfileList = examArr;
              }
            });
            this.dutyUnitVisible = true;
          } else {
            this.dutyUnitData = [];
          }
        });
    },
    // 根据英文名查询开关状态
    searchstatus() {
      let params = {
        name_en: "fgw_am_check"
      };
      this.$http
        .post(
          globalConfig.server3 + "configuration/selectStatusByEnName",
          params
        )
        .then(res => {
          let bianliang = res.data.response_body;
          this.shangchuanparams = bianliang.status;

          if (bianliang.status == "1") {
            this.huidiao = false;
          } else if (bianliang.status == "0") {
            this.huidiao = true;
          }
        });
    },
    // 获取元素
    GetAttrElement(tagid, attr, val) {
      // var e= document.getElementsByClassName(tagid)
      var e = document.getElementsByTagName(tagid);

      for (var i = 0; i < e.length; i++) {
        if (e[i].getAttribute(attr) == val) {
          return e[i];
        }
      }
      return false;
    },
    //获取说明
    getshuoming(val) {
      let temp = {
        instance_detail_id: val.instance_detail_id,
        score: val.score || "",
        score_opinion: val.score_opinion || "",
        score_files: val.score_files || ""
      };
      var ele = this.GetAttrElement(
        "input",
        "data-dId",
        val.instance_detail_id
      );
      var blocks = ele.parentNode.parentNode.lastChild;
      if (val.one_value == "1") {
        this.tiptishi = "这是加分项,请输入正值";
        if (Number(val.score) < 0) {
          val.score = "";
          blocks.style.display = "block";
          setTimeout(
            function() {
              blocks.style.display = "none";
            }.bind(this),
            2000
          );
        }
      } else {
        this.tiptishi = "这是减分项,请输入负值";
        if (Number(val.score) > 0) {
          val.score = "";
          blocks.style.display = "block";
          setTimeout(
            function() {
              blocks.style.display = "none";
            }.bind(this),
            2000
          );
        }
      }
      this.shuomingArr.forEach((item, index) => {
        if (item.instance_detail_id == temp.instance_detail_id) {
          this.shuomingArr.splice(index, 1);
        }
      });
      this.shuomingArr.push(temp);
    },
    //上传
    xuanze(val) {
      this.hang = val;
    },
    successFile(response, file, fileList) {
      fileList.map(item => {
        item.id = this.hang.instance_detail_id;
      });
      this.hang.scorefiles = fileList;
      let str = "";
      this.hang.scorefiles.forEach(item => {
        if (item.response) {
          str += item.response.response_body;
        } else {
          str += item.href + "^";
        }
      });
      this.hang.score_files = str;

      let temp = {
        instance_detail_id: this.hang.instance_detail_id,
        score: this.hang.score || "",
        score_opinion: this.hang.score_opinion || "",
        score_files: this.hang.score_files || ""
      };
      this.shuomingArr.forEach((item, index) => {
        if (temp.instance_detail_id == item.instance_detail_id) {
          this.shuomingArr.splice(index, 1);
        }
      });
      this.shuomingArr.push(temp);
    },
    //移除文件
    removeFile(file, fileList) {
      this.highQuality.forEach(item => {
        if (item.instance_detail_id == file.id) {
          item.scorefiles.forEach((val, index) => {
            if (file.uid == val.uid) {
              item.scorefiles.splice(index, 1);
              this.hang = item;
            }
          });
        }
      });

      let str = "";
      this.hang.scorefiles.forEach(item => {
        if (item.response) {
          str += item.response.response_body;
        } else {
          str += item.href + "^";
        }
      });
      this.hang.score_files = str;

      let temp = {
        instance_detail_id: this.hang.instance_detail_id,
        score: this.hang.score || "",
        score_opinion: this.hang.score_opinion || "",
        score_files: this.hang.score_files || ""
      };
      this.shuomingArr.forEach((item, index) => {
        if (temp.instance_detail_id == item.instance_detail_id) {
          this.shuomingArr.splice(index, 1);
        }
      });
      this.shuomingArr.push(temp);
    },
    //保存提交
    baocunshuoming() {
      // 规定加减的大小
      var count = 0;
      var arr = document.getElementsByClassName("zongpin");

      for (let i = 0; i < arr.length; i++) {
        count += Number(arr[i].children[0].value);
      }

      if (count > 5 || count < -5) {
        this.$message({
          message: "加减分项总分在-5到5之间",
          type: "error"
        });
        return;
      }

      if (this.shuomingArr.length == 0) {
        return this.$message({
          message: "请修改",
          type: "error"
        });
      }
      this.$http
        .post(
          globalConfig.server1 +
            "AuditOfAdditionOrReductionOfResponsibleUnits/updateFaGaiWeiJiaJianFenTwo",
          this.shuomingArr
        )
        .then(res => {
          if (res.data.response_code == "200") {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.shuomingArr = [];
            this.getpageContent(this.searchCanshu);
          } else {
            this.$message({
              message: "保存失败",
              type: "success"
            });
            this.shuomingArr = [];
            this.getpageContent(this.searchCanshu);
          }
        });
    },
    //获取考核指标下拉框查询
    getkaoheTarget() {
      let params = {
        model_type: "高质量加减"
      };
      this.$http
        .post(
          globalConfig.server1 +
            "AuditOfAdditionOrReductionOfResponsibleUnits/selectModelJiaJianFen",
          params
        )
        .then(res => {
          if (res.data.response_code == "0") {
            for (let i = 0; i < res.data.response_body.length; i++) {
              res.data.response_body[i].niandu = this.formatDate(
                "yyyy",
                res.data.response_body[i].niandu
              );
            }
            this.modelNameOption = res.data.response_body;
            this.modelName = this.formatDate(
              "yyyy",
              this.modelNameOption[0].niandu
            );
            this.getChange(this.modelNameOption[0]);
            this.model_dept = res.data.response_body[0].leader_department;
          } else {
            this.modelNameOption = [];
          }
        });
    },
    //获取被考核单位下拉框查询
    getbeExamed(id) {
      let params = {
        model_id: id
      };
      this.$http
        .post(
          globalConfig.server1 +
            "PersonalityAuditOfResponsibleUnits/selectModelExamedDept",
          params
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.beexamedOption = res.data.response_body;
            this.beexamed = this.beexamedOption[0].examed_dep_name;
            this.getpageContent(this.beexamedOption[0]);
          } else {
            this.beexamedOption = [];
          }
        });
    },
    //获取页面数据
    getpageContent(val) {
      this.searchCanshu = val
      let person = JSON.parse(sessionStorage.getItem("personal"));

      if (this.model_dept === person.roleData.department.id) {
        let params = {
          instance_id: val.id
        };
        this.$http
          .post(
            globalConfig.server1 +
              "AuditOfAdditionOrReductionOfResponsibleUnits/selectFaGaiWeiJiaJianFenChaXun",
            params
          )
          .then(res => {
            if (res.data.response_code == "200") {
              this.highQuality = res.data.response_body;
              this.highQuality.sort((a,b)=>{
                return b.one_value - a.one_value
              })
              this.highQuality.forEach(item => {
                if(item.one_value == "1"){
                  item.descrip = "加分项"
                }else if(item.one_value == "-1"){
                  item.descrip = "减分项"
                }

                item.scorefiles = [];

                let str = item.final_explan_files;
                if (str) {
                  let examArr = [];
                  let http = globalConfig.server1;
                  this.splitStr(str, examArr, http);
                  item.fileList = examArr;
                }

                let scorestr = item.score_files;
                if (scorestr) {
                  let examArr = [];
                  let http = "";
                  this.splitStr(scorestr, examArr, http);
                  item.scorefiles = examArr;
                }
                item.scorefiles.forEach(val => {
                  val.id = item.instance_detail_id;
                });
              });

              setTimeout(() => {
                $(".el-upload-list__item-name").each((index, item) => {
                  $(item).attr("title", $(item).text());
                });
              }, 1000);
              
              console.log(this.highQuality);
              this.merge()
              this.searchstatus();
            } else {
              this.highQuality = [];
            }
          });
      } else {
        this.highQuality = [];
      }
    },
    //获得加减分材料审核数据
    getCaiLiaoShenHe(params) {
      //this.leader_dep_name = val.leader_dep_name
      //this.beexamed_dep_name = val.beexamed_dep_name
      this.$http
        .post(
          globalConfig.server1 +
            "PersonalityAuditOfResponsibleUnits/selectJiaJIanFenCaiLiaoShenHe",
          params
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.highQuality = res.data.response_body;
          } else {
            this.highQuality = [];
          }
        });
    },
    getChange(val) {
      let person = JSON.parse(sessionStorage.getItem("personal"));
      let params = {
        user_id: person.id,
        niandu: val,
        model_type: "个性"
      };
      let id = val.id;
      this.getbeExamed(id);
      // this.getCaiLiaoShenHe(params)
    },

    downLoadfile(val) {
      // 通过选择器获取img元素
      var elments = $(".downloadtext");
      // 将图片的src属性作为URL地址
      var url = $(".downloadtext").attr("src");
      var a = document.createElement("a");
      var event = new MouseEvent("click");

      a.download = val.unitmaterials || "我是下载";
      a.href = url;

      a.dispatchEvent(event);
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
        for (var i = 0; i < this.highQuality.length; i++) {
          if (i === 0) {
            //第一行必须存在
            this.firstTargetArr.push(1);
            this.firstTargetPos = 0;
          } else {
            // 判断当前元素与上一个元素是否相同 this.firstTargetPos是firstTargetArr内容的序号
            if (this.highQuality[i].descrip === this.highQuality[i - 1].descrip) {
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
    // 默认显示数据
    mrsx() {
      setTimeout(
        function() {
          setTimeout(
            function() {
              this.beexamed = this.beexamedOption[0].examed_dep_name;
              this.getpageContent(this.beexamedOption[0]);
            }.bind(this),
            500
          );
        }.bind(this),
        400
      );
    }
  },
  mounted() {
    this.uri =
      globalConfig.server1 +
      "AuditOfAdditionOrReductionOfResponsibleUnits/uplodeFaGaiWei";
    this.getkaoheTarget();
    this.searchstatus();
    // this.mrsx();
  }
};
</script>

<style scoped lang="scss">
.ckyj {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.ckyj > div {
  width: 92px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.issueTop {
  margin: 12px 0 40px 0;
  padding: 0;

  .assessTitle {
    line-height: 42px;

    li {
      float: left;
      color: #606266;
      margin-right: 20px;

      &:last-child {
      }
    }
  }

  .assessSelect {
    display: inline-block;
    width: 600px;

    .el-button {
      margin-left: 60px;
    }
  }

  .unitList {
    text-align: center;
    font-size: 30px;
    color: #333;
    font-weight: 600;
    margin-top: 32px;
  }
}

.colorfont {
  color: #409eff;
  padding: 5px 0;
  cursor: pointer;
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
.red1s {
  color: #ff0000;
  display: none;
}
.el-select-dropdown__item {
  font-size: 16px;
}

#assdiv {
  .zongpin {
    width: 70px;
  }
}
</style>
<style lang="scss">
#assdivh {
  .el-dialog__body {
    overflow: auto;
    max-height: 550px;
  }
  .el-button--mini > span {
    display: flex !important;
    justify-content: center;
    align-items: center;
  }

  .el-button--mini > span > i {
    font-size: 20px;
  }

  .el-button--mini > span > span {
    display: block;
    border-bottom: 1px solid #0841b4;
    height: 20px;
  }

  &.assessIssue {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }

    .cell .el-input .el-input__inner {
      box-sizing: border-box;
      text-align: center;
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
