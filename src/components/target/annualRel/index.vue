<template>
  <div class="assessIssue" id="annulRelkh" style="margin-top:5px;">
    <div class="asstopWrap">
      <el-form label-width="50px" style="display:inline-block;">
        <el-form-item label="年度：" style="text-align:left">
          <el-select v-model="params.niandu" size="mini" placeholder="请选择" @change="search()">
            <el-option v-for="item in options" :key="item.niandu" :label="item.niandu" :value="item.niandu">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <!-- <div class="btnworpbox" style="float:right;">
        <el-button type="primary" class="iconfont icon-chaxun" size="medium" @click="search()">&nbsp;查询</el-button>
      </div> -->
    </div>

    <div>
      <el-table :data="highQuality" border style="width: 100%;margin-top:10px;" stripe>
        <el-table-column type="index" label="序号" width="70"> </el-table-column>
        <el-table-column prop="model_name" label="考核项"> </el-table-column>
        <el-table-column prop="createtime" label="启动时间"> </el-table-column>
        <el-table-column prop="status" label="启动考核" width="200">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#409EFF" inactive-color="#CCC" :disabled="scope.row.status"
              @change="sitchStu(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pageNum"
          :page-sizes="[15,30,50,100]" :page-size="params.pageCount" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        // pagblock:true,//分页显示隐藏
        total: 1, //数据总条数
        params: { //数据传值
          niandu: "",
          pageNum: 1,
          pageCount: 15
        },
        options: [],
        value: "",
        highQuality: []
      };
    },
    methods: {
        //下拉年度菜单
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
      handleSizeChange(val) {
        this.params.pageCount = val
        this.search()
      },
      handleCurrentChange(val) {
        this.params.pageNum = val
        this.search()
      },
      sitchStu(val) {
        this.$confirm('考核启动后将无法进行撤销，是否确定继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: val.id,
            status: "1"
          }
          if (val.status) {
            params.status = 1
          } else {
            params.status = 0
          }
          
          this.$http.post(globalConfig.server2 + 'model/updateModelStatus', params).then(res => {
            if (res.data.response_code === '0') {
            } else {
               this.highQuality.forEach((item) => {
                  if (item.id == val.id) {
                    item.status = false
                  }
                })
            }

          })

        }).catch(() => {
          this.highQuality.forEach((item) => {
            if (item.id == val.id) {
              item.status = false
            }
          })
        });
      },
      // 查询所有信息
      search() {
        this.$http.post(globalConfig.server2 + 'model/selectModel', this.params).then(res => {
          if (res.data.response_code === '0') {
            // this.pagblock= true;
            this.highQuality = res.data.response_body.list
            this.highQuality.map(item => {
              if (item.status == "0") {
                item.status = false
              } else if (item.status == '1') {
                item.status = true
              }
              let time = String(item.niandu)
              return item.niandu = time.substring(0, 10)
            })
            this.total = res.data.response_body.totalCount
						
						console.log(this.highQuality)
          } else {
            this.highQuality = []
            // this.pagblock= false;
          }
        
        })
      },
      mrxs(){
        setTimeout(function(){
          // var date=new Date;
          // var year=date.getFullYear()
          this.params.niandu=this.options[0].niandu
          this.search()
        }.bind(this),600)
      }

    },
    mounted() {
      this.select()
      //this.search()
      this.mrxs()
    }
  };

</script>

<style scoped lang="scss">
  .block {
    margin-top: 20px;
    margin-left:33%;
  }

  .el-form-item__label {
    font-size: 16px;
  }

  .el-select-dropdown__item {
    font-size: 16px;
  }

  .asstopWrap {
    span {
      font-size: 16px;
    }
  }

  .el-form-item {
    margin-bottom: 22px;
  }

</style>
<style lang="scss">
  #annulRelkh {
    .el-input--mini .el-input__inner {
      height: 38px;
      line-height: 38px;
    }

    .el-form-item__label {
      font-size: 16px;
      line-height: 42px;
    }
  }

</style>
