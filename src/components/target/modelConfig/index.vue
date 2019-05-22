<template>
  <div id="routerViewdd" style="margin-top:-5px;">
    <div v-show="modelListModule">
      <div class="clearfix">
        <el-form>
          <el-form-item label="年份：">
            <el-select v-model="params.niandu" clearable placeholder="请选择" size="medium" @change="xuanzhong">
              <el-option v-for="item in options" :key="item.niandu" :label="item.niandu" :value="item.niandu">
              </el-option>
            </el-select>
            <el-button style="margin-left: 20px;" type="primary" size="medium" class="bluebtnclass" @click="toggleadd">&nbsp;添加</el-button>
            <el-form-item>
            </el-form-item>
          </el-form-item>
        </el-form>
        <el-card class="box-card" v-for="(item,index) in modeldata" :key="index">
          <div slot="header" class="clearfix2">
            <span>{{item.model_name}}</span>
          </div>
          <div class="textItem">{{item.model_type}}</div>
          <div class="card-click">
            <el-button class="bluezhibiao" type="text" @click="lookOver(item)">查看指标</el-button>
            <el-button class="bluezhibiao " type="text" @click="editModel(item)" :disabled="item.status == 0?false:true">编辑模型</el-button>
            <el-button class="redszhibiao " type="text" @click="delmodel(item)" :disabled="item.status == 0?false:true">删除模型</el-button>
          </div>
        </el-card>

      </div>
      <div class='nodata' v-if="nodatablock">
        {{nodata}}
      </div>
      <div class="block" v-if='pagblock'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pageNum"
          :page-sizes="[15, 30,50,100]" :page-size="params.pageCount" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <addModel :modules="addModelModule" :editData="editModelData" @close="closeModule"></addModel>
    <showModel :modules="showModelModule" :detailData="detailModel" :modelType="typeshow" @close="closeModule"></showModel>



  </div>


</template>

<script>
  import showModel from "./components/showModel.vue"
  import addModel from "./components/addModel.vue"
  export default {
    components: {
      showModel,
      addModel
    },
    data() {
      return {
        typeshow: false,
        modelListModule: true, //模型列表模块
        addModelModule: false, //添加模型模块
        showModelModule: false, //编辑模型模块
        nodata: '', //暂无数据
        nodatablock: false, //暂无数据显示隐藏
        pagblock: true, //分页显示隐藏
        currentPage: 4,
        dialogVisible: false,
        enbale: false,
        editModelData: {},
        modeldata: [], //数据模型
        total: 1, //数据总条数
        params: { //数据传值
          niandu: "",
          pageNum: 1,
          pageCount: 15
        },
        detailModel: {},
        options: []
      }
    },
    methods: {
      //年度下拉
      select() {
        this.$http.post(globalConfig.server5 + 'fuwuQualityController/showNiandu').then(res => {
          if (res.data.response_code === '0') {
            this.options = []
            let arr = res.data.response_body
            arr.map(item => {
              let obj = {
                niandu: item
              }
              this.options.push(obj)
            })
          } else {

          }
        })
      },
      //xuanzhiong
      xuanzhong() {
        this.searchModel()
      },
      //分页器
      handleSizeChange(val) {
        this.params.pageCount = val
        this.searchModel()
      },
      handleCurrentChange(val) {
        this.params.pageNum = val
        this.searchModel()
      },
      toggleadd() {
        // this.enbale=!this.enbale
        this.editModelData = {}
        this.modelListModule = false
        this.addModelModule = true
      },
      //查看模型
      lookOver(val) {
        let params = {
          model_name: val.model_name,
          model_type: val.model_type
        }
        if (val.model_type == '党建加减分指标' || val.model_type == "高质量加减分指标" || val.model_type == "高质量发展共性指标") {
          this.typeshow = false
        } else {
          this.typeshow = true
        }
        this.$http.post(globalConfig.server2 + 'model/selectModelContentByModel', params).then(res => {
          if (res.data.response_code === '0') {
            this.modelListModule = false
            this.showModelModule = true
            this.detailModel = res.data.response_body
          } else {

          }

        })
      },
      //编辑模型
      editModel(val) {
        this.modelListModule = false
        this.addModelModule = true
        this.editModelData = JSON.parse(JSON.stringify(val))
        let time = String(this.editModelData.niandu)
        this.editModelData.niandu = time.substring(0, 4)
        this.editModelData.edit = 1
      },

      //删除模型
      delmodel(val) {
        // this.dialogVisible = true
        this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass:'whetherh',
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          let params = {
            isdelete: "1",
            id: val.id
          }
          this.$http.post(globalConfig.server2 + 'model/deleteModel', params).then(res => {
            if (res.data.response_code === '0') {
              this.searchModel()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }

          })

        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      closeModule(val) {

        this.modelListModule = true
        this.addModelModule = false
        this.showModelModule = false
        this.searchModel()
      },
      searchModel() {

        this.$http.post(globalConfig.server2 + 'model/selectModel', this.params).then(res => {
          if (res.data.response_code === '0') {
            this.pagblock = true;
            this.nodatablock = false;
            this.modeldata = res.data.response_body.list
            this.total = res.data.response_body.totalCount
          } else {
            this.modeldata = [];
            this.pagblock = false;
            this.nodatablock = true;
            this.nodata = res.data.response_body
          }

        })
      },
      mrsx() {
        setTimeout(function () {
          // var date = new Date;
          // var year = date.getFullYear()
          this.params.niandu = this.options[0].niandu
          this.xuanzhong()
        }.bind(this), 400)
      }
    },
    mounted() {
      this.select()
      //this.searchModel()
      this.mrsx();
    }
  }

</script>

<style scoped>
  .el-input el-input--suffix {
    width: 70%;
  }

  .nodata {
    font-size: 20px;
    color: #333;
    text-align: center;
    padding: 20px 0;
  }

  .textItem {
    font-size: 16px;
    margin: 20px;
    color: #999999;
    /* border: 1px solid red; */
    line-height: 1.7;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 50px;
    margin-top: 6px;
    margin-bottom: 12px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix2 {
    /* background:url(../../../assets/images/bj.png); */
    color: #333;
    font-size: 18px;
    display: inline-block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 358px;
    float: left;
    /* height: 321px; */
    margin-left: 30px;
    margin-bottom: 30px;
    background: #f3f6f6;
    border: 1px solid #efefef;
    box-shadow: none;
  }
  .box-card:hover{
   box-shadow: 2px 2px 5px #cccccc;
   background: #fff;  
  }

  #routerIndex .main #routerView {
    padding: 0px;
    background: #fff;
    min-width: 1200px;
    min-height: 900px;
    margin-top: 0px;
  }

  .card-click {
    width: 100%;
    /* border-top: 1px solid #e0dbdb; */
  }

  .card-click button {
    width: 80px;
    height: 28px;
    padding: 0;
    float: left;
    font-size: 14px;
    margin:0 19px 20px 19px;
    border-radius: 3px;
  }

  .el-button.is-disabled.el-button--text {
    background-color: #ccc;  
    color: #fff;
  }

  .block {
    margin-left: 30%;
  }

  .el-select-dropdown__item {
    font-size: 16px;
  }

  .bluezhibiao {
    background: #0841B4;
    color: #fff;
    /* margin-right: 28px; */
  }

  .bluezhibiao:hover {
    background: #1f6de2;
  }

  .redszhibiao{
    background: #f05050;
    color: #fff;
    /* margin-right: 0; */
  }
   .redszhibiao:hover{
    background: #ff7777;
    color: #fff;
  }


</style>
<style lang="scss">
  #routerViewdd {
    .el-form-item__label {
      font-size: 16px;
    }

    .el-card__header {
      height: 38px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 2;
      padding: 2px 20px;
      border-left: 5px solid #1054B8;
      margin-top: 12px;
      text-align: left;
      border-bottom: 0;
      margin-top: 15px;
    }

    .el-form-item {
      margin-top: 10px;
      margin-bottom: 22px;
    }

    .el-input--medium .el-input__inner {
      line-height: 38px;
      height: 38px;
    }
  }

</style>
