<template>
  <div id="assessGroupScore" style="margin-top:-10px;">
    <!--{{searchParams}}-->
    <div class="showModelTop clearfix">
      <div class="topMiddle">
        <span class="tempName">年度：</span>
        <el-select
          @change="getOption"
          value-key="model_name"
          style="margin-left: -20px;width: 150px;"
          v-model="value"
          size="mini"
          placeholder="请选择"
        >
          <el-option
            v-for="item in kaoheOptions"
            :key="item.value"
            :label="item.niandu"
            :value="item"
          ></el-option>
        </el-select>
        <span class="tempName">被考核单位：</span>
        <el-select
          @change="getkaoheID"
          v-model="value1"
          size="mini"
          value-key="name"
          placeholder="请选择"
          class="tempconpy"
        >
          <el-option
            v-for="item in assessOption"
            :key="item.value1"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          size="medium"
          style="margin-left: 20px;"
          @click="search"
          class="bluebtnclass"
        >查询</el-button>
        <el-button
          type="primary"
          size="medium"
          style="margin-left: 20px;"
          @click="shangchuangprop"
          class="bluebtnclass"
        >综合报告上传</el-button>
        <div class="bottom-btn">
          <el-button
            type="primary"
            size="medium"
            style="margin-left: 20px;"
            @click="pingfenSure"
            class="bluebtnclass"
            :disabled="huidiao"
          >保存</el-button>
        </div>
      </div>
      <!--<div class="bottom">-->
      <!--<span>当前被考核单位：{{value1.name}}</span>-->
      <!--</div>-->
    </div>
    <el-table
      :data="modelData"
      border=""
      :span-method="arraySpanMethod"
      style="width: 100%;margin-top:20px;"
      stripe
    >
      <el-table-column prop="one_name" label="一级指标" width="200">
        <template slot-scope="scope">
          <div style="font-size: 18px">{{scope.row.one_name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="two_name" label="二级指标" width="250"></el-table-column>
      <el-table-column prop="three_name" label="三级指标">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            width="550"
            trigger="hover"
            class="box"
            :content="scope.row.three_name"
            popper-class="tipClass"
            :visible-arrow="false"
          >
            <div slot="reference" style="font-size: 14px">{{scope.row.three_name}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="three_content" label="计分说明">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            width="400"
            class="box"
            trigger="hover"
            :content="scope.row.three_content"
            popper-class="tipClass"
            :visible-arrow="false"
          >
            <div slot="reference">{{scope.row.three_content}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="group_score_files" label="附件材料">
        <template slot-scope="scope">
          <template v-for="item in scope.row.flieList">
            <div>
              <a :href="item.href" target="_blank">{{item.name}}</a>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="group_opinion" width="100" label="审核意见">
        <template slot-scope="scope">
          <!-- <div>{{scope.row.group_opinion}}</div> -->
          <div class="ckyj" @click="unitopinion(scope.row)">
            <div>
              <p class="tableclicksh">查看</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="group_score" label="审核分" width="100">
        <template slot-scope="scope">
          <el-input
            size="medium"
            maxlength="4"
            :data-dId="scope.row.three_name"
            oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/(\.\d)\./g,'$1').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');"
            @blur="dafen(scope.row)"
            :ref="scope.row.instanceDetails_id"
            v-model="scope.row.group_score"
          ></el-input>
          <p class="reds">评分值错误，请重新输入</p>
        </template>
      </el-table-column>
      <el-table-column label="补充材料" prop="attchment">
        <template slot-scope="scope">
          <el-upload
            class="upload-demo"
            :action="uri"
            :on-success="successFile"
            :on-remove="removeFile"
            multiple
            name="files"
            with-credentials
            style="display: inline-block;width: 60%;"
            :file-list="scope.row.acctflieList"
          >
            <el-button
              size="mini"
              type="primary"
              @click="xuanze(scope.row)"
              :disabled="huidiao"
              class="tableclicksh"
              style="background:none;color: #0841b4;border:none;"
            >
              <span>选择文件</span>
            </el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>
    <!-- 上传弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="综合材料上传"
      :visible.sync="shangchuangdialogVisible"
      width="30%"
      class="proupClass"
    >
      <div style="display:inline-block;vertical-align: top;">
        <el-upload
          class="upload-demo"
          :action="zhongheuri"
          :on-success="shangchuanchengg"
          :on-remove="zhongheremoveFile"
          multiple
          name="files"
          with-credentials
          style="display: inline-block;"
          :file-list="zhongheflieList"
        >
          <el-button
            size="mini"
            type="primary"
            :disabled="huidiao"
            style="background:none;color: #0841b4;border:none;"
          >
            <i class="el-icon-upload el-icon--right"></i>
            <span>请选择文件</span>
          </el-button>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="shangchuangdialogVisible = false">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="shangchuangBtns">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      shangchuangdialogVisible: false,
      uri: "",
      huidiao: "",
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
      value: "",
      value1: "",
      temp: {},
      fenshuArr: [],
      searchParams: {},
      hang: "",

      // 记录初始意见
      csyj: "",
      zhongheFlie: "",
      zhongheflieList: [],
      zhongheparams: {},
      zhongheuri: ""
    };
  },
  methods: {
    //上传弹窗
    shangchuangprop() {
      this.shangchuangdialogVisible = true;
      this.zonghesearch();
    },
    //确定按钮
    shangchuangBtns() {
      this.baocunzhonghe();
      this.shangchuangdialogVisible = false;
    },
    shangchuanchengg(response, file, fileList) {
      this.zhongheflieList = fileList;
      let str = "";
      this.zhongheflieList.forEach(item => {
        if (item.response) {
          str += item.response.response_body;
        } else {
          str += item.href + "^";
        }
      });
      this.zhongheFlie = str;
    },
    zhongheremoveFile(file, fileList) {
      this.zhongheflieList = fileList;
      let str = "";
      this.zhongheflieList.forEach(item => {
        if (item.response) {
          str += item.response.response_body;
        } else {
          str += item.href + "^";
        }
      });
      this.zhongheFlie = str;
    },
    //综合报告上传查询
    zonghesearch(val) {
      let params = {
        id: this.searchParams.model_id,
        examed_dep: this.searchParams.examed_dep
      };
      this.$http
        .post(globalConfig.server3 + "dangjian/selectfilesByid", params)
        .then(res => {
          if (res.data.response_code == "0") {
            this.zhongheparams.id = res.data.response_body.instances[0].id;
            this.zhongheparams.add_minus_explan_files =
              res.data.response_body.instances[0].add_minus_explan_files;
            let finalStr =
              res.data.response_body.instances[0].add_minus_explan_files;
            let finalArr = [];
            let http1 = "";
            if (finalStr) {
              this.splitStr(finalStr, finalArr, http1);
              this.zhongheflieList = finalArr;
            } else {
              this.zhongheflieList = [];
            }
          } else {
          }
        });
    },
    //综合报告上传保存
    baocunzhonghe() {
      this.zhongheparams.add_minus_explan_files = this.zhongheFlie;
      this.$http
        .post(
          globalConfig.server3 + "dangjian/publicUpload",
          this.zhongheparams
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.$message({
              type: "success",
              message: "上传成功"
            });
          } else {
            this.$message({
              type: "error",
              message: "上传失败"
            });
          }
        });
    },

    // 单位意见
    unitopinion(item) {
      this.csyj = item.group_opinion;
      setTimeout(
        function() {
          var ipt = document.getElementsByClassName(
            "el-message-box__message"
          )[0].children[0].children[2];
          ipt.value = item.group_opinion;
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
        closeOnClickModal:false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "dwyj",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            var ipt = document.getElementsByClassName(
              "el-message-box__message"
            )[0].children[0].children[2];
            item.group_opinion = ipt.value;
            if (ipt.value == this.csyj) {
              this.$message({
                type: "error",
                message: "请修改"
              });
              return;
            }
            let tempfen = {
              id: item.instanceDetails_id,
              group_score: item.group_score,
              group_opinion: item.group_opinion,
              group_score_files: item.group_score_files || ""
            };
            this.fenshuArr.forEach((item, index) => {
              if (item.id == tempfen.id) {
                this.fenshuArr.splice(index, 1);
              }
            });
            this.fenshuArr.push(tempfen);

            this.$http
              .post(
                globalConfig.server1 + "dangjian/updateKaoHeZu",
                this.fenshuArr
              )
              .then(res => {
                if (res.data.response_code == "0") {
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                } else {
                  this.$message({
                    message: "修改失败",
                    type: "error"
                  });
                }
              });

            done();
          } else {
            done();
          }
        }
      }).catch(() => {});
    },
    // 打分判断
    dafen2(item) {
      var ele = this.GetAttrElement("input", "data-dId", item.three_name);
      var blocks = ele.parentNode.parentNode.lastChild;
      if (Number(item.group_score) > Number(item.three_value)) {
        // 最大值判断
        item.group_score = "";
        ele.value = "";

        blocks.style.display = "block";
        setTimeout(
          function() {
            blocks.style.display = "none";
          }.bind(this),
          2000
        );
      } else if (Number(item.group_score < 0)) {
        // 最小值判断
        item.group_score = "";

        blocks.style.display = "block";
        setTimeout(
          function() {
            blocks.style.display = "none";
          }.bind(this),
          2000
        );
      } else {
        blocks.style.display = "none";
      }
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
    xuanze(val) {
      this.hang = val;
    },
    // 根据英文名查询开关状态
    searchstatus() {
      let params = {
        name_en: "khz_dept_score"
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
    //指标模型下拉
    searchOption() {
      this.$http
        .post(globalConfig.server3 + "dangjian/selectModel")
        .then(res => {
          if (res.data.response_code == "0") {
            for (let i = 0; i < res.data.response_body.length; i++) {
              res.data.response_body[i].niandu = this.formatDate(
                "yyyy",
                res.data.response_body[i].niandu
              );
            }
            this.kaoheOptions = res.data.response_body;
            this.model_id = res.data.response_body.model_id;
            this.value = this.formatDate("yyyy", this.kaoheOptions[0].niandu);
            this.getOption(this.kaoheOptions[0]);
          }
        });
    },
    getOption(val) {
      this.searchParams.model_id = val.id;
      this.searchAssessOption();
    },
    getkaoheID(val) {
      this.searchParams.examed_dep = val.id;
      this.zonghesearch();
      this.search();
    },
    //考核组-被考核单位
    searchAssessOption() {
      let person = JSON.parse(sessionStorage.getItem("personal"));
      let params = {
        id: person.id
      };
      this.$http
        .post(globalConfig.server3 + "dangjian/selectBeikaohe", params)
        .then(res => {
          if (res.data.response_code == "0") {
            this.assessOption = res.data.response_body.departments;
            this.value1 = this.assessOption[0].name;
            this.getkaoheID(this.assessOption[0]);
          }
        });
    },
    search() {
      this.modelData = [];

      var params = this.searchParams;

      if (!params.model_id && !params.examed_dep) {
        return;
      }
      this.$http
        .post(globalConfig.server3 + "dangjian/selectKaohezu", params)
        .then(res => {
          if (res.data.response_code == "0") {
            this.modelData = res.data.response_body.contents;

            this.modelData.map(item => {
              item.group_score = item.instanceDetails[0].group_score;
              item.instanceDetails_id = item.instanceDetails[0].id;
              item.group_opinion = item.instanceDetails[0].group_opinion;
              item.group_score_files =
                item.instanceDetails[0].group_score_files;

              item.final_explan_files =
                item.instanceDetails[0].final_explan_files;
            });
            this.modelData.map(item => {
              item.acctflieList = [];
              item.flieList = [];
              item.one_name = item.one_name + "(" + item.one_value + "分)";
              item.two_name = item.two_name + "(" + item.two_value + "分)";
              item.three_name =
                item.three_name + "(" + item.three_value + "分）";

              let examStr = item.group_score_files;
              let examArr = [];
              let http = "";
              if (examStr) {
                this.splitStr(examStr, examArr, http);
                item.acctflieList = examArr;
              }
              item.acctflieList.forEach(val => {
                val.id = item.instanceDetails_id;
              });

              let finalStr = item.final_explan_files;
              let finalArr = [];
              let http1 = globalConfig.server1;
              if (finalStr) {
                this.splitStr(finalStr, finalArr, http1);
                item.flieList = finalArr;
              }
            });

            setTimeout(() => {
              $(".el-upload-list__item-name").each((index, item) => {
                $(item).attr("title", $(item).text());
              });
            }, 1000);

            this.searchstatus();
            this.merge();
          } else {
            this.modelData = [];
          }
          // if(){
          //
          // }
        });
    },
    //上传文件
    successFile(response, file, fileList) {
      fileList.map(item => {
        item.id = this.hang.instanceDetails_id;
      });
      this.hang.acctflieList = fileList;
      let str = "";
      this.hang.acctflieList.forEach(item => {
        if (item.response) {
          str += item.response.response_body;
        } else {
          str += item.href + "^";
        }
      });
      this.hang.group_score_files = str;

      let temp = {
        id: this.hang.instanceDetails_id,
        group_score: this.hang.group_score || "",
        group_opinion: this.hang.group_opinion || "",
        group_score_files: this.hang.group_score_files || ""
      };
      this.fenshuArr.forEach((item, index) => {
        if (temp.id == item.id) {
          this.fenshuArr.splice(index, 1);
        }
      });
      this.fenshuArr.push(temp);
    },
    //移除文件
    removeFile(file, fileList) {
      this.modelData.forEach(item => {
        if (item.instanceDetails_id == file.id) {
          item.acctflieList.forEach((val, index) => {
            if (file.uid == val.uid) {
              item.acctflieList.splice(index, 1);
              this.hang = item;
            }
          });
        }
      });

      let str = "";
      this.hang.acctflieList.forEach(item => {
        if (item.response) {
          str += item.response.response_body;
        } else {
          str += item.href + "^";
        }
      });
      this.hang.group_score_files = str;

      let temp = {
        id: this.hang.instanceDetails_id,
        group_score: this.hang.group_score || "",
        group_opinion: this.hang.group_opinion || "",
        group_score_files: this.hang.group_score_files || ""
      };
      this.fenshuArr.forEach((item, index) => {
        if (temp.id == item.id) {
          this.fenshuArr.splice(index, 1);
        }
      });
      this.fenshuArr.push(temp);
    },
    //判断分值
    judgefen(item) {
      let refs = this.$refs;

      for (let key in refs) {
        if (key == item.instanceDetails_id) {
          if (
            Number(item.group_score) > Number(item.three_value) ||
            item.group_score == ""
          ) {
            // 最大值判断
            item.group_score = "";
            refs[key].currentValue = "";
            $(refs[key].$el)
              .siblings()
              .show();
            setTimeout(() => {
              $(refs[key].$el)
                .siblings()
                .hide();
            }, 2000);
          } else if (Number(item.group_score < 0)) {
            // 最小值判断
            item.group_score = "";

            $(refs[key].$el)
              .siblings()
              .show();
            setTimeout(() => {
              $(refs[key].$el)
                .siblings()
                .hide();
            }, 2000);
          } else {
            $(refs[key].$el)
              .siblings()
              .hide();
          }
        }
      }
    },
    //打分
    dafen(val) {
      this.judgefen(val);
      //存储修改
      let tempfen = {
        id: val.instanceDetails_id,
        group_score: val.group_score || "",
        group_opinion: val.group_opinion || "",
        group_score_files: val.group_score_files || ""
      };
      this.fenshuArr.forEach((item, index) => {
        if (item.id == tempfen.id) {
          this.fenshuArr.splice(index, 1);
        }
      });
      this.fenshuArr.push(tempfen);
    },
    pingfenSure() {
      for (var i = 0; i < this.modelData.length; i++) {
        if (!this.modelData[i].group_score) {
          this.$confirm("评分有空值, 是否保存?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            customClass: "whetherh",
            type: "warning"
          })
            .then(() => {
              this.$http
                .post(
                  globalConfig.server3 + "dangjian/updateKaoHeZu",
                  this.fenshuArr
                )
                .then(res => {
                  if (res.data.response_code == "0") {
                    this.$message({
                      message: "保存成功！",
                      type: "success"
                    });
                    this.search();
                  } else {
                    this.$message({
                      message: "保存失败",
                      type: "error"
                    });
                    this.search();
                  }
                });
              this.baocunzhonghe();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消保存"
              });
              this.search();
            });
          return;
        }
      }

      this.$http
        .post(globalConfig.server3 + "dangjian/updateKaoHeZu", this.fenshuArr)
        .then(res => {
          if (res.data.response_code == "0") {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
            this.search();
          } else {
            this.$message({
              message: "保存失败",
              type: "error"
            });
            this.search();
          }
        });
      this.baocunzhonghe();
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        //第一列的合并方法,省
        const _row_1 = this.firstTargetArr[rowIndex];
        const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
        return {
          rowspan: _row_1,
          colspan: _col_1
        };
      } else if (columnIndex === 1) {
        //第二列的合并方法,市
        const _row_2 = this.secondTargetArr[rowIndex];
        const _col_2 = _row_2 > 0 ? 1 : 0;
        return {
          rowspan: _row_2,
          colspan: _col_2
        };
      }
    },
    merge() {
      //合并相同数据
      this.mergeInit();
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
          if (
            this.modelData[i].two_name === this.modelData[i - 1].two_name &&
            this.modelData[i].one_name === this.modelData[i - 1].one_name
          ) {
            this.secondTargetArr[this.secondTargetPos] += 1;
            this.secondTargetArr.push(0);
          } else {
            this.secondTargetArr.push(1);
            this.secondTargetPos = i;
          }
        }
      }
    },
    mergeInit() {
      //合并初始化
      (this.firstTargetArr = []), //一级指标合并数组
        (this.firstTargetPos = 0),
        (this.secondTargetArr = []), //二级指标合并数组
        (this.secondTargetPos = 0);
    },
    // 默认显示数据
    mrsx() {
      setTimeout(
        function() {
          this.value = this.formatDate("yyyy", this.kaoheOptions[0].niandu);
          this.getOption(this.kaoheOptions[0]);
          this.value1 = this.assessOption[0].name;
          this.getkaoheID(this.assessOption[0]);
          setTimeout(
            function() {
              this.search();
              // this.zonghesearch()
            }.bind(this),
            500
          );
        }.bind(this),
        400
      );
    }
  },
  watch: {
    modules(val) {
      if (val) {
        this.showModelVisible = val;
      }
    },
    showModelVisible(val) {
      if (!val) {
        this.$emit("close");
      }
    }
  },
  mounted() {
    this.uri = globalConfig.server1 + "dangjian/uploadCailiaoBygroup ";
    this.zhongheuri = globalConfig.server1 + "dangjian/publicuploadfuwu ";
    this.searchOption();
    // this.mrsx()
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

.ckyj > div > i {
  font-size: 20px;
  margin-right: 5px;
  color: #0841b4;
}

.ckyj > div > p {
  border-bottom: 1px solid #0841b4;
  color: rgb(8, 65, 180);
}

#assessGroupScore {
  .showModelTop {
    margin-bottom: 10px;

    .topMiddle {
      line-height: 65px;
      /* float: left; */
      /* width: 100%; */

      span {
        margin-right: 15px;

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

    .bottom-btn {
      float: right;
    }
  }
}
</style>
<style lang="scss">
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

#assessGroupScore {
  .el-dialog__body {
    overflow: auto;
    max-height: 550px;
  }
  .el-input__inner {
    height: 38px;
    line-height: 38px;
    text-align: center;
  }

  .reds {
    color: #ff0000;
    display: none;
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
