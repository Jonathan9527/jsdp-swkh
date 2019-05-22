<template>
  <div id="ndcPersonalTagetScoreClassinh" style="margin-top:-6px;">
    <div>
      <div class="asstopWrap">
        <ul class="assessTitle clearfix">
          <li>
            <span>被考核单位：</span>
            <el-select
              v-model="zhibiao"
              placeholder="请选择"
              value-key="model_name"
              @change="xuanzhong"
              clearable
              style="width: 150px;"
            >
              <el-option
                v-for="item in targetOptions"
                :key="item.id"
                :label="item.beexamed_dep_name"
                :value="item"
              ></el-option>
            </el-select>
          </li>
          <!-- <li><span>年度：</span>
            <span>{{targetForm.niandu}}</span>
          </li>-->
          <li>
            <span>牵头单位：</span>
            <span>{{targetForm.leader_dep_name}}</span>
          </li>
          <li style="margin-right: 0px;">
            <el-button
              size="medium"
              type="primary"
              @click="submitBtn"
              :disabled="huidiao"
              class="bluebtnclass"
            >保存</el-button>
          </li>
        </ul>
      </div>
      <div class="tip">
        <!--南京市2018年高质量发展个性指标考核评分-->
      </div>
      <el-table
        :data="modelData"
        border=""
        :span-method="arraySpanMethod"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="one_name" width="100" label="一级指标">
          <template slot-scope="scope">
            <div style="font-size: 18px">{{scope.row.one_name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="two_name" width="130" label="二级指标">
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              width="400"
              :content="scope.row.two_name"
              popper-class="tipClass"
              :visible-arrow="false"
            >
              <div slot="reference">{{scope.row.two_name}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="three_name" width="200" label="三级指标">
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              width="400"
              class="box"
              trigger="hover"
              :content="scope.row.three_name"
              popper-class="tipClass"
              :visible-arrow="false"
            >
              <div slot="reference" style="font-size: 14px">{{scope.row.three_name}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="three_content" label="指标内容">
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
        <el-table-column prop="examed_dep_name" width="150" label="被考核单位">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="materListBtn(scope.row)"
              style="background: none;"
            >{{scope.row.examed_dep_name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="depatmentName" width="180" label="责任单位">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="dutySuggest">{{scope.row.dutyUnit}}</el-button> -->
            <template v-for="item in scope.row.depatmentName">
              <div class="colorfont" @click="dutySuggest(scope.row)">{{item}}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="score_opinion" label="审核意见" width="100">
          <template slot-scope="scope">
            <!-- <el-input type="textarea"  v-model="scope.row.score_opinion" @blur="dafen(scope.row)"></el-input> -->
            <div class="ckyj tableclicksh" @click="unitopinion(scope.row)">
              <div class="yijians" style="height:auto;">
                <p class="tableclicksh">查看</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="审核分" width="100">
          <template slot-scope="scope">
            <!-- <el-input size="mini" :data-dId="scope.row.three_content" v-model="scope.row.score" @blur="dafen(scope.row)"
            oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/(\.\d)\./g,'$1').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');" @change="dafen2(scope.row)"></el-input>-->
            <el-input
              size="mini"
              class="widths"
              maxlength="5"
              :data-dId="scope.row.three_content"
              v-model="scope.row.score"
              @blur="dafen(scope.row)"
              oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/(\.\d)\./g,'$1').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');"
              :ref="scope.row.three_content"
            ></el-input>
            <p class="reds">评分值错误，请重新输入</p>
          </template>
        </el-table-column>
        <el-table-column label="补充材料" prop="add_minus_explanation">
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
              :file-list="scope.row.examfileList"
            >
              <el-button
                size="mini"
                type="text"
                @click="xuanze(scope.row)"
                class="tableclicksh"
                :disabled="huidiao"
                style="background: none;color: #0841B4;"
              >
                <span>选择文件</span>
              </el-button>
            </el-upload>
            <!-- <el-button size="mini" type="text" @click="shangchan(scope.row)" :disabled="huidiao" style="background: none;color: #F05050;"><i class="el-icon-upload el-icon--right"></i>点击上传</el-button> -->
          </template>
        </el-table-column>
      </el-table>
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
            <el-table-column prop="department_name" label="单位名称"></el-table-column>
            <el-table-column prop="opinion" label="审核意见"></el-table-column>
            <el-table-column prop="score" label="审核分" width="100"></el-table-column>
            <el-table-column prop="examfileList" label="补充材料">
              <template slot-scope="scope">
                <!-- <el-button type="text">{{scope.row.final_explan_files}}</el-button> -->
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
          <!-- <el-button type="primary" @click="dutyUnitVisible = false" size="medium">取 消</el-button> -->
          <el-button
            type="primary"
            class="proupbtnqueding"
            @click="dutyUnitVisible = false"
            size="medium"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 被考核单位佐证材料列表 -->
      <el-dialog
        v-dialogDrag
        :close-on-click-modal="false"
        title="被考核单位详情"
        :visible.sync="materListVisible"
        width="30%"
        class="proupClass"
      >
        <div>
          <el-table :data="materListData" style="width: 100%" border="">
            <el-table-column prop="examed_dep_name" label="单位名称"></el-table-column>
            <el-table-column prop="final_explanation" label="情况说明"></el-table-column>
            <el-table-column prop="examedfile" label="附件材料">
              <template slot-scope="scope">
                <template v-for="item in scope.row.examedfile">
                  <div>
                    <a :href="item.href" target="_blank">{{item.name}}</a>
                  </div>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button type="primary" @click="materListVisible = false" size="medium">取 消</el-button> -->
          <el-button
            type="primary"
            class="proupbtnqueding"
            @click="materListVisible = false"
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
      model_dept: "",
      uri: "",
      huidiao: "",
      zhibiao: "",
      targetForm: {}, //头部
      dutyUnitVisible: false, //责任单位意见弹窗
      materListVisible: false, //被考核单位佐证材料列表
      targetOptions: [], //考核指标
      modelData: [],
      dutyUnitData: [],
      materListData: [],
      firstTargetArr: [], //一级指标合并数组
      firstTargetPos: 0,
      secondTargetArr: [], //二级指标合并数组
      secondTargetPos: 0,

      scoreArr: [],
      fileObj: {},
      fileList: [],
      hang: "", //上传的行
      // 记录初始意见
      csyj: ""
    };
  },
  methods: {
    //判断分值
    judgefen(item) {
      let refs = this.$refs;
      for (let key in refs) {
        if (key == item.three_content) {
          if (
            Number(item.score) > Number(item.three_value) ||
            item.score == ""
          ) {
            // 最大值判断
            item.score = "";
            refs[key].currentValue = "";
            $(refs[key].$el)
              .siblings()
              .show();
            setTimeout(() => {
              $(refs[key].$el)
                .siblings()
                .hide();
            }, 2000);
          } else if (Number(item.score < 0)) {
            // 最小值判断
            item.score = "";

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
    // 单位意见
    unitopinion(item) {
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
        closeOnClickModal:false,
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
            this.scoreArr.forEach((item, index) => {
              if (temp.instance_detail_id == item.instance_detail_id) {
                this.scoreArr.splice(index, 1);
              }
            });
            this.scoreArr.push(temp);

            this.$http
              .post(
                globalConfig.server1 +
                  "PromotingHighQualityAssessment/updateInstanceDetailScoreById",
                this.scoreArr
              )
              .then(res => {
                if (res.data.response_code == "0") {
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
    // 打分判断
    dafen2(item) {
      /*
         *item=scope.row
         */
      var ele = this.GetAttrElement("input", "data-dId", item.three_content);
      var blocks = ele.parentNode.parentNode.lastChild;
      if (Number(item.score) > Number(item.three_value)) {
        // 最大值判断
        item.score = "";
        //  var ele=this.GetAttrElement("input","data-dId",item.three_content)
        ele.value = "";
        blocks.style.display = "block";
        setTimeout(
          function() {
            blocks.style.display = "none";
          }.bind(this),
          2000
        );
      } else if (item.score < 0) {
        // 最小值判断
        item.score = "";
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
    // 根据英文名查询开关状态
    searchstatus() {
      let params = {
        name_en: "fgw_check"
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
    //选择上传文件
    shangchan(val) {
      let params = {
        instance_detail_id: val.instance_detail_id
      };
      let fd = new FormData();
      fd.append("files", this.fileObj);
      fd.append("requestBody", JSON.stringify(params));

      this.$http
        .post(
          globalConfig.server1 +
            "PromotingHighQualityAssessment/UploadFaiGaiWeiGeXing",
          fd
        )
        .then(res => {
          if (res.data.response_code === "0") {
            this.$message({
              type: "success",
              message: "上传成功!"
            });
          } else {
          }
        });
    },
    //打分获取
    dafen(val) {
      this.judgefen(val);
      let temp = {
        instance_detail_id: val.instance_detail_id,
        score: val.score || "",
        score_opinion: val.score_opinion || "",
        score_files: val.score_files || ""
      };
      this.scoreArr.forEach((item, index) => {
        if (temp.instance_detail_id == item.instance_detail_id) {
          this.scoreArr.splice(index, 1);
        }
      });
      this.scoreArr.push(temp);
    },
    //上传
    xuanze(val) {
      this.hang = val;
    },
    successFile(response, file, fileList) {
      fileList.map(item => {
        item.id = this.hang.instance_detail_id;
      });
      this.hang.examfileList = fileList;
      let str = "";
      this.hang.examfileList.forEach(item => {
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
      this.scoreArr.forEach((item, index) => {
        if (temp.instance_detail_id == item.instance_detail_id) {
          this.scoreArr.splice(index, 1);
        }
      });
      this.scoreArr.push(temp);
    },
    //移除文件
    removeFile(file, fileList) {
      this.modelData.forEach(item => {
        if (item.instance_detail_id == file.id) {
          item.examfileList.forEach((val, index) => {
            if (file.uid == val.uid) {
              item.examfileList.splice(index, 1);
              this.hang = item;
            }
          });
        }
      });

      let str = "";
      this.hang.examfileList.forEach(item => {
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
      this.scoreArr.forEach((item, index) => {
        if (temp.instance_detail_id == item.instance_detail_id) {
          this.scoreArr.splice(index, 1);
        }
      });
      this.scoreArr.push(temp);
    },
    dutySuggest(val) {
      this.dutyUnitVisible = true;

      let params = {
        instance_detail_id: val.instance_detail_id
      };
      this.popupdata(params);
    },
    materListBtn(val) {
      let obj = JSON.parse(JSON.stringify(val));

      let examStr = obj.final_explan_files;
      let examArr = [];
      let http = globalConfig.server1;
      if (examStr) {
        this.splitStr(examStr, examArr, http);
        obj.examedfile = examArr;
      }

      this.materListData = [];
      this.materListVisible = true;
      this.materListData.push(obj);
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

    //下拉框接口
    search() {
      let params = {
        model_type: "个性"
      };
      this.$http
        .post(
          globalConfig.server1 +
            "PromotingHighQualityAssessment/selectModelFaGaiWei",
          params
        )
        .then(res => {
          if (res.data.response_code === "0") {
            this.targetOptions = res.data.response_body;
            console.log(this.targetOptions);
            

            // 默认显示第一条数据
            // 默认显示的数据
            this.targetForm.id = res.data.response_body[0].id;
            // 下拉框默认显示数据
            this.zhibiao = res.data.response_body[0].beexamed_dep_name;
            this.targetForm.niandu = this.formatDate(
              "yyyy",
              res.data.response_body[0].niandu
            );
            this.targetForm.leader_dep_name =
              res.data.response_body[0].leader_dep_name;
            this.model_dept = res.data.response_body[0].leader_department;
            this.tabledata();

            this.searchstatus();
          } else {
          }
        });
    },
    xuanzhong(val) {
      if (val) {
        this.targetForm = val;
        this.targetForm.niandu = this.formatDate(
          "yyyy",
          this.targetForm.niandu
        );
        this.model_dept = val.leader_department;

        this.tabledata();
      } else {
        this.modelData = [];
      }
    },
    //查询接口
    tabledata() {
      let person = JSON.parse(sessionStorage.getItem("personal"));
      if (this.model_dept === person.roleData.department.id) {
        let params = {
          model_id: this.targetForm.id
        };

        this.$http
          .post(
            globalConfig.server1 +
              "PromotingHighQualityAssessment/selectModelContent",
            params
          )
          .then(res => {
            if (res.data.response_code === "0") {
              this.modelData = [];
              let data = res.data.response_body;
              for (let key in data) {
                data[key][0].depatmentName = data[key][1];
                this.modelData.push(data[key][0]);
              }

              this.modelData.map(item => {
                item.one_name = item.one_name + "(" + item.one_value + "分)";
                item.two_name = item.two_name + "(" + item.two_value + "分)";
                item.three_name =
                  item.three_name + "(" + item.three_value + "分）";

                item.examfileList = [];

                let str = item.score_files;
                if (str) {
                  let examArr = [];
                  let http = "";
                  this.splitStr(str, examArr, http);
                  item.examfileList = examArr;
                }
                item.examfileList.forEach(val => {
                  val.id = item.instance_detail_id;
                });
              });

              setTimeout(() => {
                $(".el-upload-list__item-name").each((index, item) => {
                  $(item).attr("title", $(item).text());
                });
              }, 1000);

              this.searchstatus();
              this.merge();
            } else {
            }
          });
      } else {
        this.modelData = [];
      }
    },

    //弹窗接口
    popupdata(params) {
      this.$http
        .post(
          globalConfig.server1 +
            "PromotingHighQualityAssessment/selectZenRenDanWeiFile",
          params
        )
        .then(res => {
          if (res.data.response_code === "200") {
            this.dutyUnitData = res.data.response_body;
            this.dutyUnitData.forEach(item => {
              let str = item.attachment;
              if (str) {
                let examArr = [];
                let http = globalConfig.server1;
                this.splitStr(str, examArr, http);
                item.examfileList = examArr;
              }
            });
          } else {
          }
        });
    },

    //保存按钮
    submitBtn() {
      for (var i = 0; i < this.modelData.length; i++) {
        if (this.modelData[i].score > this.modelData[i].three_value) {
          this.$message({
            message:
              this.modelData[i].three_name +
              "的加减分范围在（小于" +
              this.modelData[i].three_value +
              "）",
            type: "error"
          });
          return;
        } else if (!this.modelData[i].score) {
          this.$confirm("评分有空值, 是否保存?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              if (this.scoreArr.length == 0) {
                this.$message({
                  message: "请做出更改",
                  type: "error"
                });
                return;
              }
              this.$http
                .post(
                  globalConfig.server1 +
                    "PromotingHighQualityAssessment/updateInstanceDetailScoreById",
                  this.scoreArr
                )
                .then(res => {
                  if (res.data.response_code === "0") {
                    this.$message({
                      message: "修改成功",
                      type: "success"
                    });
                    this.scoreArr = [];
                    this.tabledata();
                  } else {
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消保存"
              });
            });
          return;
        }
        // let temp = {
        //   instance_id: this.modelData[i].id,
        //   score: this.modelData[i].score
        // }
        // arr.push(temp)
      }
      // let params = {
      //   "idMsg": this.targetForm.id
      // }
      if (this.scoreArr.length == 0) {
        this.$message({
          message: "请做出更改",
          type: "error"
        });
        return;
      }
      this.$http
        .post(
          globalConfig.server1 +
            "PromotingHighQualityAssessment/updateInstanceDetailScoreById",
          this.scoreArr
        )
        .then(res => {
          if (res.data.response_code === "0") {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.scoreArr = [];
            this.tabledata();
          } else {
          }
        });
    }
  },
  mounted() {
    this.search();
    this.uri =
      globalConfig.server1 +
      "PromotingHighQualityAssessment/UploadFaiGaiWeiGeXing";
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

#ndcPersonalTagetScoreClassinh {
  .formItem {
    margin-left: 40px;
  }

  .reds {
    color: #ff0000;
    display: none;
  }

  .tip {
    text-align: center;
    color: #333;
    font-size: 30px;
    margin: 32px 0;
    font-weight: 600;
  }
}

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

.asstopWrap {
  padding: 10px 0 0px 0px;
}

.el-button--text {
  font-size: 16px;
}

.accessorys {
  font-size: 16px;
}

.colorfont {
  color: #409eff;
  padding: 5px 0;
  cursor: pointer;
}
</style>
<style lang="scss">
#ndcPersonalTagetScoreClassinh {
  .el-dialog__body {
    overflow: auto;
    max-height: 550px;
  }
  .el-input--small .el-input__inner {
    height: 38px;
    line-height: 38px;
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

  .widths {
    width: 70px;

    input {
      height: 38px;
      line-height: 38px;
    }
  }

  .el-form-item__label {
    font-size: 16px;
    line-height: 42px;
  }

  .el-form-item__content {
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
</style>
