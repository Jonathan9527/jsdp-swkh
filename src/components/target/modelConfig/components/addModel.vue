<template>
  <div v-show="addModelVisible" class="addModel" id="addModelkhz">
    <el-form :model="addusers">
      <el-row :gutter="20">
        <el-col style="overflow: hidden;">
          <el-button type="primary" size="medium" class="bluebtnclass" @click="goBack()">返回</el-button>
          <el-form-item label="模型信息" style="font-size:15px;font-weight: bold;display:block;">
          </el-form-item>
          <el-form-item label="为必填项" required style="float: left;font-size:14px;">
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="模型分类：">
            <br>
            <el-select v-model="addusers.model_type" clearable placeholder="请选择" v-if="!editData.edit" @change="getModelType">
              <el-option v-for="item in kaoheOptions" :key="item.id" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
            <el-input v-model="addusers.model_type" disabled v-if="editData.edit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="年份：" required>
            <br>
            <el-select v-model="addusers.niandu" placeholder="请选择">
              <el-option v-for="item in yearsts" :key="item.mainValue" :label="item.mainValue" :value="item.mainValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" style="position: relative;">
          <el-form-item label="模型名称：" required>
            <el-input v-model="addusers.model_name"></el-input>
          </el-form-item>
          <el-tooltip class="item fillHelp" effect="dark" content="模型名称不能重复" placement="top-start">
            <el-button style="background: none;">填写帮助</el-button>
          </el-tooltip>
        </el-col>

        <el-col :span="7">
          <el-form-item label="牵头单位：">
            <br>
            <el-select v-model="addusers.leader_dep_name" value-key="leader_value" placeholder="请选择" @change="selchange">
              <el-option v-for="item in initiatingUnit" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" style="margin-right: 100px">
          <el-form-item label="被考核单位：">
            <el-input v-model='addusers.beexamed_dep_name' readonly @focus="treeVisible=true" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="21">
          <el-form-item label="模型描述：">
            <el-input type="textarea" v-model='addusers.decription' clearable rows="6"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="21" v-if="showtagContent">
          <el-form-item label="指标内容">
            <el-table :data="tagDate" style="width: 100%">
              <!-- <el-table-column prop="one_name" label="指标标题">
                <template slot-scope="scope">
                  <el-input type="text" v-model="scope.row.one_name"></el-input>
                </template>
              </el-table-column> -->
              <el-table-column prop="one_name" label="指标内容">
                <template slot-scope="scope">
                  <el-input type="textarea" v-model="scope.row.one_name" @blur="addHang(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="one_value" label="类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.one_value" placeholder="请选择" @change="addHang(scope.row)">
                    <el-option v-for="item in leiXingoptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <!-- <el-input type="text" v-model="scope.row.one_value" @blur="addHang"></el-input> -->
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="margin-left: 36%">
        <el-button type="primary" style="width:10%;font-size:17px;" class="bluebtnclass" @click="toggleadd()">提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择单位" v-dialogDrag :close-on-click-modal="false" :visible.sync="treeVisible" width="30%" :before-close="handleClose" class="proupClass">
      <span>
        <el-tree ref="departTree" check-strictly :data="treedata" node-key="id" @check-change="changeClick" :props="defaultProps"
          show-checkbox default-expand-all></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button class="proupbtnquxiao" @click="treeVisible = false">取 消</el-button>
        <el-button type="primary" class="proupbtnqueding" @click="treeBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: ["modules", "editData"],
    data() {
      return {
        //添加指标数据
        tagDate: [{
          one_name: '',
          one_value: '1',
        }],
        showtagContent: false, //显示加减分添加指标表格
        treedata: [], //树状图
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        nd: '',
        addusers: {
          niandu: '',
          model_name: '',
        }, //提交表单对象
        addModelVisible: false, //页面显示
        treeVisible: false, //tree 显示
        initiatingUnit: [],
        kaoheOptions: [],
        yearsts: [],
        treeinput: [],
        lexingvalue: "",
        leiXingoptions: [{
          value: "1",
          label: '加分项'
        }, {
          value: "-1",
          label: '减分项'
        }],

      }
    },
    methods: {
      //获取下拉框选中的数据
      getniandu() {
        this.$http.post(globalConfig.server4 + 'tDictionaryController/getListForCode', {
          "code": "nd"
        }).then(res => {
          if (res.data.response_code == '0') {
            this.yearsts = res.data.response_body
          }
        })
      },
      //提交
      toggleadd() {
        if (this.addusers.niandu == '' || this.addusers.model_name == '') {
          this.$message({
            message: '带*的为必填项哟',
            type: 'warning'
          });
        } else {
          if (this.addusers.edit) {
            let params = {
              kpi_id: this.addusers.kpi_id,
              id: this.addusers.id,
              niandu: this.addusers.niandu,
              model_name: this.addusers.model_name,
              leader_department: this.addusers.leader_department,
              beexamed_department: this.addusers.beexamed_department,
              decription: this.addusers.decription,
              model_type: this.addusers.model_type,
              leader_dep_name: this.addusers.leader_dep_name,
              beexamed_dep_name: this.addusers.beexamed_dep_name
            }
            if (this.showtagContent) {
              this.xiugaiaddMinus(this.addusers)
            } else {
              this.$http.post(globalConfig.server2 + 'model/updateModel', params).then(res => {
                if (res.data.response_code === '0') {
                  this.$message({
                    message: res.data.response_body,
                    type: 'success'
                  });
                  this.addModelVisible = false

                } else {
                  this.$message({
                    message: res.data.response_body,
                    type: 'error'
                  });
                }

              })
            }

          } else {
            //判断是已添加
            this.judgeTarget(this.addusers)
            // this.tianjiaaddMinus(this.addusers)


          }

        }

      },
      //返回
      goBack() {
        this.addModelVisible = false
      },
      //tree 显示 隐藏
      handleClose(done) {
        done();
      },

      changeClick(val, isSele, isnode) {

        if (isSele) {
          this.$refs.departTree.setCheckedKeys([val.id])
          this.treeinput = val
        }
      },
      //指标模型下拉
      searchOption() {
        this.$http.post(globalConfig.server2 + 'kpi/selectModelType').then(res => {
          if (res.data.response_code == "0") {
            this.kaoheOptions = res.data.response_body
          }
        })
      },
      //牵头单位下拉
      qtOption() {
        this.$http.post(globalConfig.server2 + 'model/selectDepartmentQt').then(res => {
          if (res.data.response_code == "0") {
            this.initiatingUnit = res.data.response_body
          }
        })
      },
      //年度下拉
      ndchange(val) {
        this.addusers.niandu = val

      },
      //遍历树 -- 获取树的
      getTreeID(data) {
        function getId(data) {
          for (var i in data) {
            if (data[i].children.length !== 0) {
              data[i].disabled = true
              // getId(data[i].children)
            }
          }
        }
        getId(data)
      },
      //树状图接口
      treeModel() {
        let arr = []
        this.$http.post(globalConfig.server2 + 'department/getDepartmentDendrogramOne', {}).then(res => {
          if (res.data.response_code === '0') {
            arr.push(res.data.response_body)
            this.getTreeID(arr)
            this.treedata = arr
          }

        })
      },
      selchange(val) {
        var obj = {};
        obj = this.initiatingUnit.find(function (item) {
          return item.id === val
        });
        this.addusers.leader_department = obj.id
        this.addusers.leader_dep_name = obj.name

      },
      //tree确定事件
      treeBtn() {
        if (this.$refs.departTree.getCheckedKeys().length == 0) {
          this.addusers.beexamed_dep_name = ""
          this.addusers.beexamed_department = ""
        } else {
          this.addusers.beexamed_dep_name = this.treeinput.label
          this.addusers.beexamed_department = this.treeinput.id
        }

        this.treeVisible = false
      },
      //监听添加指标表格行事件
      addHang(row) {
        let hang = {
          one_name: '',
          one_value: "1",
        }
        let len = this.tagDate.length
        if (len > 1) {
          if (this.tagDate[len - 2].one_name == '') {
            this.tagDate.splice(len - 1, 1)
            return
          }
        }
        if (row.one_name !== '') {
          if (len > 1) {
            if (this.tagDate[len - 1].one_name == '') {
              return
            }
          }
          this.tagDate.push(hang)

        }

      },
      //获取模型分类
      getModelType(val) {
        if (val.indexOf("高质量加减分指标") != -1 || val.indexOf("党建加减分指标") != -1) {
          this.showtagContent = true
        } else {
          this.showtagContent = false
        }
      },
      //添加党建加减分模型和高质量加减分模型
      tianjiaaddMinus(val) {
        let modeltable = JSON.parse(JSON.stringify(this.tagDate))
        modeltable.splice(modeltable.length - 1, 1)
        let params = {
          model: val,
          modelContent: modeltable
        }
        this.$http.post(globalConfig.server2 + 'model/insertDanjianAndGaozhiliang', params).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              message: res.data.response_body,
              type: 'success'
            });
            this.addModelVisible = false

          } else {
            this.$message({
              message: res.data.response_body,
              type: 'error'
            });
          }

        })
      },
      //党建加减分和高质量加减分模型的修改
      xiugaiaddMinus(val) {
        let modeltable = JSON.parse(JSON.stringify(this.tagDate))
        modeltable.splice(modeltable.length - 1, 1)
        let params = {
          model: val,
          modelContent: modeltable
        }
        this.$http.post(globalConfig.server2 + 'model/updateAddmiusModel', params).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              message: res.data.response_body,
              type: 'success'
            })

          } else {
            this.$message({
              message: res.data.response_body,
              type: 'error'
            });
          }
        })
      },

      //编辑党建加减分或者高质量的模型
      editdangjianModel(val) {
        let params = {
          model_name: val.model_name,
          model_type: val.model_type
        }
        this.$http.post(globalConfig.server2 + 'model/selectAddmiusModelByModelNameAndModelType', params).then(res => {
          if (res.data.response_code === '0') {
            // this.$message({
            //   message: res.data.response_body,
            //   type: 'success'
            // });
          } else {

          }

        })
      },
      editdangjianModelTrue(val) {
        let params = {
          model: val,
          modelContent: val
        }
        this.$http.post(globalConfig.server2 + '/model/updateAddmiusModel', params).then(res => {
          if (res.data.response_code === '0') {
            this.$message({
              message: res.data.response_body,
              type: 'success'
            });
          } else {

          }

        })
      },
      //判断是否添加过该指标
      judgeTarget(val) {
        let params = {
          niandu: val.niandu,
          model_type: val.model_type
        }
        this.$http.post(globalConfig.server2 + 'model/selectModelByTypeAndNiandu', params).then(res => {
          if (res.data.response_code === '0') {
            this.addusers.niandu = this.addusers.niandu
            if (this.showtagContent) {
              //添加党建加减分模型和高质量加减分模型
              this.tianjiaaddMinus(this.addusers)
            } else {
              this.$http.post(globalConfig.server2 + 'model/insertModel', this.addusers).then(res => {
                if (res.data.response_code === '0') {
                  // this.$message({
                  //   message: res.data.response_body,
                  //   type: 'success'
                  // });
                  this.addusers = {}
                  this.addModelVisible = false
                } else {
                  this.$message({
                    message: res.data.response_body,
                    type: 'error'
                  });
                  return
                }
              })
            }
          } else {
            this.$message({
              message: res.data.response_body,
              type: 'error'
            });
            return
          }

        })
      }
    },
    mounted() {
      this.treeModel()
      this.searchOption()
      this.qtOption()
      this.getniandu()
    },
    watch: {
      modules(val) {
        this.addModelVisible = val
        this.addusers = JSON.parse(JSON.stringify(this.editData))
      },
      addModelVisible(val) {
        if (!val) {
          this.$emit('close')
        }
      },
      "addusers.model_type": {
        handler(newName, oldName) {
          if (!this.addusers.model_type) {
            return
          }
          if (this.addusers.model_type.indexOf("高质量加减分指标") != -1 || this.addusers.model_type.indexOf("党建加减分指标") != -1) {
            this.showtagContent = true
            this.editdangjianModel(this.addusers)
          } else {
            this.showtagContent = false
          }
        }

      }
    }

  }

</script>
<style scoped lang="scss">
  .fillHelp {
    position: absolute;
    top: 25px;
    right: 13px;
    font-size: 14px;
    border: 0;
    padding: 0;
  }

</style>
<style lang="scss">
  #addModelkhz {
    .el-dialog {
      width: 450px;
      // max-height: 600px;
      // overflow-y: scroll;
    }

    .el-dialog__body {
      max-height: 550px;
      overflow-y: scroll;
    }

  }

</style>
