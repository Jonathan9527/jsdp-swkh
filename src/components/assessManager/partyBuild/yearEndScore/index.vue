<template>
  <div id="yearEndScore" style="margin-top:-10px;">
    <div class="showModelTop clearfix">
      <div class="topMiddle">
        <!-- {{value}} -->
        <span class="tempName">年度：</span>
        <el-select v-model="value" value-key="model_name" style="margin-left:-20px;margin-right:20px;width: 150px;"
          size="medium" placeholder="请选择" @change="getData">
          <el-option v-for="item in kaoheOptions" :key="item.value" :label="item.niandu" :value="item">
          </el-option>
        </el-select>
        <!-- <span prop="niandu">年度：{{niandu}}</span> -->
        <span prop="leader_dep_name">牵头单位：<span>{{leader_dep_name}}</span></span>
        <!-- <span prop="beexamed_dep_name">被考核单位：<span>{{beexamed_dep_name}}</span></span> -->
      </div>
      <!--<div class="topRight">-->
      <!--<el-button type="primary" size="medium" class="iconfont icon-chaxun" @click="search">查询</el-button>-->
      <!--</div>-->
    </div>
    <el-table :data="modelData" border :span-method="arraySpanMethod" style="width: 100%">
      <el-table-column prop="one_name" label="一级指标" width="350">
        <template slot-scope="scope">
          <div style="font-size: 18px">{{scope.row.one_name}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="two_name" label="二级指标" width="150">
      </el-table-column>
      <el-table-column prop="three_name" label="三级指标">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="550" trigger="hover" class="box" :content="scope.row.three_name"
            popper-class="tipClass" :visible-arrow="false">
            <div slot="reference" style="font-size: 14px">{{scope.row.three_name}}</div>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column prop="three_content" label="计分说明">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="550" trigger="hover" class="box" :content="scope.row.three_content"
            popper-class="tipClass" :visible-arrow="false">
            <div slot="reference">{{scope.row.three_content}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="100" label="平时分"></el-table-column>
      <el-table-column width="100" label="年度分"></el-table-column>
      <el-table-column width="100" label="汇总分"></el-table-column>

      <el-table-column label="操作" width="100" prop="nCount">
        <template slot-scope="scope">
          <el-badge v-if="scope.row.nCount!=0" :value="scope.row.nCount" class="item">
            <el-button size="medium" type="primary" @click="handleEdit(scope.row)" class="bluebtnclass " :disabled="huidiao">评分</el-button>
          </el-badge>
          <el-button v-if="scope.row.nCount==0" size="medium" type="primary" class="bluebtnclass " @click="handleEdit(scope.row)" :disabled="huidiao">评分</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分值按钮弹窗-->
    <el-dialog title="指标得分表" :visible.sync="addIndictor" width="1000px" height="300px" class="addrole proupClass" @close="clearnianzhong"
      :close-on-click-modal="false" >
      <div class="clearfix">
        <div class="poupTitles">
          <p class="scoreTitle">{{value.model_name}}</p>
          <p class="assessSection"><span>考核内容：</span><span>{{pingfrndata.show_name}}</span></p>
          <p class="assessSection"><span>考核部门：</span><span>{{pingfrndata.list[0].kaoheDepartment.name}}</span></p>
          <!-- 批量上传 -->
            <!-- <el-upload class="upload-demo" :action="uri" :on-success="updataSuccess" :file-list="plsc" style="width: 70%;margin: 0 auto;margin-bottom: 10px;"
              name="files" with-credentials multiple>
              <el-button size="mini" type="text" :disabled="huidiao" style="background:none;color: #0841b4;"><i class="el-icon-upload el-icon--right"></i><span>综合报告</span></el-button>
            </el-upload> -->
            <el-button type="primary" size="medium" style="margin-left: 20px;"  class="bluebtnclass "  @click="shangchuangprop">批量上传文件</el-button>
        </div>
        <div class="pouptable">
          <el-table :data="pouptableData" border style="width: 100%" height="450">
            <el-table-column prop="examed_dep_name" label="设区市" width="100">
            </el-table-column>
            <el-table-column prop="final_explanation" label="情况说明">
            </el-table-column>
            <el-table-column prop="fiLes2" label="附件材料">
              <template slot-scope="scope">
                <template v-for="item in scope.row.fiLes2">
                  <div><a :href="item.href" target="_blank">{{item.name}}</a></div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="审核意见" width="100px;" prop="score_opinion">
              <template slot-scope="scope">
                <!-- <el-input type="textarea" size="medium" v-model="scope.row.score_opinion" @blur="dafen(scope.row)"></el-input> -->
                <div class="ckyj" @click="unitopinion(scope.row)">
                  <div>
                    <p class=" tableclicksh">查看</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="审核分" width="100px;" prop="score">
              <template slot-scope="scope">
                <el-input size="medium" v-model="scope.row.score" :data-dId="scope.row.instanceDetailId" maxlength="4" :ref="scope.row.id"
                  oninput="this.value=this.value.replace(/^[^\d]|[^\d.]/g,'').replace(/^0[^\.]/g,'0').replace(/\.{2}/g,'.').replace(/(\.\d)\./g,'$1').replace(/[^\d]*(\d+\.\d{2}).*/g,'$1');"
                  placeholder="请输入分值" @blur="dafen(scope.row)"></el-input>
                <p class="reds">评分值错误，请重新输入</p>
              </template>
            </el-table-column>
            <el-table-column label="补充材料" width="200">
              <template slot-scope="scope">
                <el-upload class="upload-demo" :action="uri" :on-success="handleAvatarSuccess" :on-remove='removeFile'
                  style="width: 70%;margin: 0 auto;margin-bottom: 10px;" name="files" with-credentials multiple :ref="scope.row.instanceDetailId"
                  :file-list="scope.row.fileList">
                  <el-button size="mini" type="text" :disabled="huidiao" @click="xuanze(scope.row)" class=" tableclicksh" style="background:none;color: #0841b4;"><span>选择文件</span></el-button>
                </el-upload>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao"  @click="addIndictor = false">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="pingfenSure">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上传弹窗 -->
    <el-dialog :close-on-click-modal="false" title="综合材料上传" :visible.sync="shangchuangdialogVisible" width="30%" class="proupClass" >
      <div style="display:inline-block;vertical-align: top;">
        <el-upload class="upload-demo" :action="uri"  :file-list="plsc" style="margin: 0 auto;margin-bottom: 10px;"
              name="files" with-credentials multiple  ref="piliang">
              <el-button size="mini" type="text" :disabled="huidiao" style="background:none;color: #0841b4;"><i class="el-icon-upload el-icon--right"></i><span>选择文件</span></el-button>
            </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="guanbisangc">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="shangchuangBtns">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        uri: '',
        huidiao: '',
        pageTitle: {},
        resets: [],
        valuethree: "",
        showModelVisible: false,
        addIndictor: false, // 分值按钮弹窗
        modelData: [],
        fileList: [],
        firstTargetArr: [], //一级指标合并数组
        firstTargetPos: 0,
        niandu: '', //年度
        beexamed_dep_name: '', //被考核单位
        leader_dep_name: '', //牵头单位
        secondTargetArr: [], //二级指标合并数组
        secondTargetPos: 0,
        kaoheOptions: [],
        //分值按钮弹出层表格数据
        // pouptableData: [{
        //   poupdivided: "南京市",
        //   scoreName: "2",
        // }, {
        //   poupdivided: "南京市",
        //   scoreName: "",
        // }],
        pouptableData: [],
        value: '',
        kaoheOptions: {

        },
        pingfrndata: {
          list: [{
            kaoheDepartment: {
              name: ''
            }
          }]
        },
        fenshuArr: [],
        huidiao: '',
        hang: '',
        // 记录初始意见
        csyj: "",
        // 下拉框
        xlk: {},
        // 批量上传地址
        plsc: [],
        plscStr: "",
        shangchuangdialogVisible:false
      }
    },
    methods: {
      guanbisangc(){
        this.$refs.piliang.uploadFiles = []
        this.shangchuangdialogVisible = false
        
      },
      //判断分值
      judgefen(item) {
        
        let refs = this.$refs
        for (let key in refs) {
          if (key == item.id) {
            if (Number(item.score) > Number(this.valuethree)||item.score == "") {
              // 最大值判断 
              item.score = ""
              refs[key].currentValue = ""
              
              $(refs[key].$el).siblings().show()
              setTimeout(() => {
                $(refs[key].$el).siblings().hide()
              }, 2000)

            } else if (Number(item.score < 0)) {
              // 最小值判断 
              item.score = "";

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
      //批量删除
      changeFlie(file, fileList){
        console.log(file)
        this.pouptableData.forEach(item => {
            item.fileList.forEach((val, index) => {
              if (file.name == val.name) {
                item.fileList.splice(index, 1)
              }
            })


        })

        this.pouptableData.map(item => {
          let str = ""
          item.fileList.forEach(item => {
          if (item.response) {
            str += item.response.response_body
          } else {
            str += item.href + '^'
          }})

          item.score_files = str
          let every = {
            id: item.instanceDetailId,
            score: item.score||"",
            score_opinion: item.score_opinion||"",
            score_files: item.score_files||""
          }
          this.fenshuArr.forEach((item, index) => {
            if (item.id == every.id) {
              this.fenshuArr.splice(index, 1)
            }
          })
          this.fenshuArr.push(every)
          
        })

      },
      //上传弹窗
      shangchuangprop(){
         this.shangchuangdialogVisible = true
      },
      // 批量上传
      updataSuccess(response, file, fileList) {
        this.pouptableData.map(item => {
          let zhongheFile = JSON.parse(JSON.stringify(file))
          zhongheFile.id = item.instanceDetailId
          if (zhongheFile.response) {
            item.score_files += zhongheFile.response.response_body
          }
           item.fileList.push(zhongheFile)
          

          let every = {
            id: item.instanceDetailId,
            score: item.score||"",
            score_opinion: item.score_opinion||"",
            score_files: item.score_files||""
          }
          this.fenshuArr.forEach((item, index) => {
            if (item.id == every.id) {
              this.fenshuArr.splice(index, 1)
            }
          })
          this.fenshuArr.push(every)
          
        })
      },
      shangchuangBtns(){
        let arr = this.$refs.piliang.uploadFiles
        if(arr.length == 0){
          return this.shangchuangdialogVisible = false
        }
        

        // console.log(this.$refs)
        this.pouptableData.map(item => {
          
          
          item.fileList = [...arr,...item.fileList]
          let str = ""
          item.fileList.forEach(val=>{
            if(val.response){
            str += val.response.response_body
          }else{
            str += val.href + '^'
          }
          })
          
          item.score_files = str
          let every = {
            id: item.instanceDetailId,
            score: item.score||"",
            score_opinion: item.score_opinion||"",
            score_files: item.score_files||""
          }
          this.fenshuArr.forEach((item, index) => {
            if (item.id == every.id) {
              this.fenshuArr.splice(index, 1)
            }
          })
          this.fenshuArr.push(every)
          
        })      


        let uploadrefs = this.$refs
        for(let key in uploadrefs){
          console.log(key);
          this.pouptableData.forEach(item=>{
            if(item.instanceDetailId == key){
              uploadrefs[key].uploadFiles = item.fileList
            }
          })
          
        }
        this.$refs.piliang.uploadFiles = []
        this.shangchuangdialogVisible = false
      },
      // 单位意见
      unitopinion(item) {

        this.csyj = item.score_opinion;
        setTimeout(function () {
          var ipt = document.getElementsByClassName("el-message-box__message")[0].children[0].children[2];
          ipt.value = item.score_opinion;
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
              item.score_opinion = ipt.value
              if (ipt.value == this.csyj) {
                this.$message({
                  type: 'error',
                  message: '请修改'
                });
                return
              }
              let tempfen = {
                id: item.instanceDetailId,
                score: item.score || "",
                score_opinion: item.score_opinion || "",
                score_files: item.score_files || ""
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
                  'dangjian/updateScore', this.fenshuArr)
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
      // 打分判断
      dafenxianzhi(item) {

        var ele = this.GetAttrElement("input", "data-dId", item.instanceDetailId)
        var blocks = ele.parentNode.parentNode.lastChild
        if (Number(item.score) > Number(this.valuethree)) {
          // 最大值判断 
          item.score = ""

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
          name_en: "zr_dept_score"
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
      //选择文件
      xuanze(val) {
        this.hang = val
      },
      //上传成功
      handleAvatarSuccess(response, file, fileList) {

        this.hang.fileList = fileList
        this.hang.fileList.map(item => {
          item.id = this.hang.instanceDetailId
        })
        let str = ""
        this.hang.fileList.forEach(item => {
          // item.id = this.hang.instanceDetailId
          if (item.response) {
            str += item.response.response_body
          } else {
            str += item.href + '^'
          }
        })

        this.hang.score_files = str
        let every = {
          id: this.hang.instanceDetailId,
          score: this.hang.score,
          score_opinion: this.hang.score_opinion,
          score_files: this.hang.score_files
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
        this.pouptableData.forEach(item => {
          if (item.instanceDetailId == file.id) {

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
            str += item.href + "^"
          }
        })


        this.hang.score_files = str
        let every = {
          id: this.hang.instanceDetailId,
          score: this.hang.score,
          score_opinion: this.hang.score_opinion,
          score_files: this.hang.score_files
        }
        this.fenshuArr.forEach((item, index) => {
          if (item.id == every.id) {
            this.fenshuArr.splice(index, 1)
          }
        })
        this.fenshuArr.push(every)


      },
      // //选择文件

      getData(val) {
        this.niandu = this.formatDate("yyyy", val.niandu)
        this.leader_dep_name = val.leader_dep_name
        this.beexamed_dep_name = val.beexamed_dep_name
        this.xlk.id = val.id
        this.search()

      },
      search() {
        let person = JSON.parse(sessionStorage.getItem('personal'))

        let params = {
          "id": person.id,
          "model_id": this.xlk.id
        }

        this.$http.post(globalConfig.server3 + 'dangjian/selectnianzhong', params).then(res => {
          if (res.data.response_code == "0") {
            var arr = res.data.response_body.contents

            this.$http.post(globalConfig.server3 + 'dangjian/selectCount', params).then(res => {
              if (res.data.response_code == "0") {
                // 键
                var kz = Object.keys(res.data.response_body)
                // 值
                var zs = Object.values(res.data.response_body)
                for (let i = 0; i < arr.length; i++) {
                  for (let j = 0; j < kz.length; j++) {
                    if (arr[i].id == kz[j]) {
                      arr[i].nCount = zs[i]
                      console.log(arr[i].nCount);
                    }
                  }
                }
              }
            }).then(res => {
              this.modelData = arr
              this.modelData.map((item) => {
                item.show_name = item.one_name + "(" + item.three_value + "分）"
                item.one_name = item.one_name + "(" + item.three_value + "分)"
                // item.two_name = item.two_name + "(" + item.two_value + "分)"
                // item.three_name = item.three_name + "(" + item.three_value + "分）"
              })
              this.searchstatus()
              this.merge()
              // 初始按钮状态判断
              this.anzt(this.modelData[0])
            })
          } else {
            this.modelData = []
          }
        })
      },
      // 初始按钮状态判断
      anzt(row) {
        this.valuethree = row.three_value

        this.pingfrndata = JSON.parse(JSON.stringify(row))
        let params = {
          model_content_id: this.pingfrndata.id,
          model_id: this.pingfrndata.model_id
        }

        this.$http.post(globalConfig.server3 + 'dangjian/selecttanchu', params).then(res => {
          if (res.data.response_code == "0") {
            this.pouptableData = res.data.response_body.instances
            let temp = res.data.response_body.instanceDetail

            this.pouptableData.map(item => {
              temp.forEach(val => {
                if (item.id == val.instance_id) {
                  item.score = val.score
                  item.instanceDetailId = val.id
                  item.instanceDetailopinion = val.score_opinion
                  item.score_opinion = val.score_opinion
                  item.score_files = val.score_files
                  item.final_explanation = val.final_explanation
                  item.final_explan_files = val.final_explan_files
                  item.fileList = []

                  let http = globalConfig.server1
                  let str = item.score_files
                  if (str) {
                    let examArr = []
                    this.splitStr(str, examArr, http)
                    item.fileList = examArr
                  }

                  let fileStr = item.final_explan_files
                  let fileArr = []
                  if (fileStr) {
                    this.splitStr(fileStr, fileArr, http)
                    item.fiLes2 = fileArr

                  }

                  item.fileList.forEach(val => {
                    val.id = item.instanceDetailId
                  })
                }
              })
            })
            setTimeout(() => {
              $(".el-upload-list__item-name").each((index, item) => {
                $(item).attr("title", $(item).text())
              })
            }, 1000)
          } else {
            this.pouptableData = []
          }
        })
        this.uri = globalConfig.server2 + 'dangjian/uploadCailiaoByzhibiao'
      },
      //指标模型下拉
      searchOption() {
        this.$http.post(globalConfig.server3 + 'dangjian/selectModel').then(res => {
          if (res.data.response_code == "0") {
            for (let i = 0; i < res.data.response_body.length; i++) {
              res.data.response_body[i].niandu=this.formatDate('yyyy', res.data.response_body[i].niandu)
            }
            this.kaoheOptions = res.data.response_body

            this.mrxs()
          } else {

          }
        })
      },
      clearnianzhong() {
        this.pouptableData = []
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
      //表单按钮
      handleEdit(row) {
        this.valuethree = row.three_value

        this.pingfrndata = JSON.parse(JSON.stringify(row))
        let params = {
          model_content_id: this.pingfrndata.id,
          model_id: this.pingfrndata.model_id
        }

        this.$http.post(globalConfig.server3 + 'dangjian/selecttanchu', params).then(res => {
          if (res.data.response_code == "0") {
            this.pouptableData = res.data.response_body.instances
            let temp = res.data.response_body.instanceDetail

            this.pouptableData.map(item => {
              temp.forEach(val => {
                if (item.id == val.instance_id) {
                  item.score = val.score
                  item.instanceDetailId = val.id
                  item.instanceDetailopinion = val.score_opinion
                  item.score_opinion = val.score_opinion
                  item.score_files = val.score_files
                  item.final_explanation = val.final_explanation
                  item.final_explan_files = val.final_explan_files
                  item.fileList = []

                  let http = globalConfig.server1
                  let str = item.score_files
                  if (str) {
                    let examArr = []
                    this.splitStr(str, examArr, http)
                    item.fileList = examArr
                  }

                  let fileStr = item.final_explan_files
                  let fileArr = []
                  if (fileStr) {
                    this.splitStr(fileStr, fileArr, http)
                    item.fiLes2 = fileArr

                  }

                  item.fileList.forEach(val => {
                    val.id = item.instanceDetailId
                  })
                }
              })
            })
            setTimeout(() => {
              $(".el-upload-list__item-name").each((index, item) => {
                $(item).attr("title", $(item).text())
              })
            }, 1000)
          } else {
            this.pouptableData = []
          }
        })
        this.addIndictor = true
        this.uri = globalConfig.server2 + 'dangjian/uploadCailiaoByzhibiao'

        
      },
      dafen(val) {
        this.judgefen(val)
        let tempfen = {
          id: val.instanceDetailId,
          score: val.score || "",
          score_opinion: val.score_opinion || "",
          score_files: val.score_files || ""
        }

        this.fenshuArr.forEach(
          (item, index) => {
            if (item.id == tempfen.id) {
              this.fenshuArr.splice(index, 1)
            }
          }
        )
        this.fenshuArr.push(tempfen)


      },
      pingfenSure() {
        for (var i = 0; i < this.pouptableData.length; i++) {
          console.log(this.pouptableData[i].score)
          if (!this.pouptableData[i].score) {
            this.$confirm('评分有空值, 是否保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.post(globalConfig.server3 + 'dangjian/updateScore', this.fenshuArr).then(res => {
                if (res.data.response_code == "0") {
                  this.$message({
                    message: '保存成功！',
                    type: 'success'
                  })
                  this.addIndictor = false
                  this.search()
                }else {
                  this.$message({
                    message: '保存失败',
                    type: 'error'
                  })
                  this.addIndictor = false
                  this.search()
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消保存'
              });
            });
            return
          }
        }
        this.$http.post(globalConfig.server3 + 'dangjian/updateScore', this.fenshuArr).then(res => {
          if (res.data.response_code == "0") {
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.search()
            this.addIndictor = false
          }else {
            this.$message({
              message: '保存失败',
              type: 'error'
            })
            this.search()
          }
        })
      },


      mrxs(val) {
        setTimeout(function () {
          this.value = this.kaoheOptions[0]
          // this.value=this.formatDate('yyyy', this.kaoheOptions[0].niandu)
          this.getData(this.kaoheOptions[0])
        }.bind(this), 400)
      }

    },

    mounted() {
      this.searchOption()
      // this.mrxs()

      // this.search()
    },
  }

</script>
<style scoped lang="scss">
  .clearfix {
    position: relative;
  }

  .plshangchuan {
    width: 120px;
    height: 30px;
    overflow: hidden;
    position: absolute;
    top: 13px;
    left: 788px;
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

  #yearEndScore {

    .showModelTop {
      margin-bottom: 10px;

      .goback {
        float: left;
      }

      .topRight {
        margin-top: -49px;
      }

      .topMiddle {
        height: 60px;
        line-height: 33px;
        float: left;
        width: 100%;
        margin-top: 15px;

        span {
          margin-right: 20px;

          &.tempTip {
            padding-left: 20px;
          }
        }
      }

      .topRight {
        float: right;
      }
    }
  }

  .poupTitles {
    text-align: center;
    color: #333;

    .scoreTitle {
      font-size: 20px;
      font-weight: 600
    }

    .assessSection {
      display: inline-block;
      font-size: 16px;
      margin: 20px 30px 30px 30px;
    }
  }

</style>
<style lang="scss">


  #yearEndScore {
    .el-dialog__body {
      overflow: auto;
      max-height: 550px;
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
    .el-table__row td .cell .box .el-popover__reference {
      height: 10%;
      display: -webkit-box;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;

      /* autoprefixer: on */
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .reds {
      color: #ff0000;
      display: none;
    }

    .el-table .cell {
      overflow: initial;
    }
  }

</style>
