<template>
  <div>
    <div class="dangbz" id="dangzhengbzh2" v-show="yicang">
      <div class="fenxi">
        <el-button type="primary" class="bluebtnclass" @click="analysis">分 析</el-button>
      </div>
      <!-- <el-button type="primary" class="daochubiaodan" @click="daoshushuju">导出数据</el-button> -->
      <div class="tables">
        <p class="martop" style="display: inline-block;">一、设区市</p>
        <div class="checkBoxs">
          <el-checkbox-group v-model="citycanshu">
            <el-checkbox
              v-for="city in checkList"
              :label="city.mainValue"
              :key="city.id"
            >{{city.mainValue}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="tables">
        <p class="martop">二、满意率</p>
        <div class="checkBoxs">
          <el-checkbox-group v-model="checkList1" :max="1">
            <el-checkbox label="优秀率"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="tables">
        <p class="martop">三、对比方式</p>
        <div class="checkBoxs" style="margin-left:10px;">
          <!-- <el-checkbox-group v-model="checkList2" :max="1">
            <el-checkbox label="2018">当年对比</el-checkbox>
          </el-checkbox-group> -->
          <el-radio-group v-model="checkList2"  style="display:block">
            <el-radio 
              @change="history(duibifangshi.mainValue)"
              :label="duibifangshi.mainValue" 
              :key="duibifangshi.mainValue" 
              v-for="duibifangshi in checkList4">{{duibifangshi.mainValue}}</el-radio>
          </el-radio-group>
          <div class="historyshow" v-if="historyShow">
            <el-checkbox-group v-model="checkListShow">
              <el-checkbox :label="item.mainValue" v-for="item in nindu" :key="item.mainValue"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <el-dialog :close-on-click-modal="false" :visible.sync="analysisVisible" width="1350px">
      <div id="main" style="width: 1250px;height:500px;margin: 0 auto;" v-show="main"></div>
      </el-dialog>
    </div>
    <dangzhengbanzidaochu :modules="daoshuTrue" @close="closeModles"></dangzhengbanzidaochu>
  </div>
</template>
<script>
import dangzhengbanzidaochu from "./daochubiaoge/dangzhengbanzidaochu.vue";
export default {
  components: {
    dangzhengbanzidaochu
  },
  props: ["showYin"],
  data() {
    return {
      yicang: true,
      citycanshu: [], //城市参数
      analysisVisible: false,
      checkList: [],
      checkList1: ["优秀率"],
      checkList2: "今年比对",
      checkList4:[{mainValue:"今年比对"},{mainValue:"历史比对"}],
      checkListShow: [],
      bar: [],
      bar2: [],
      bar3: [],
      main: false,
      historyShow: false, //历史对比显示隐藏
      daoshuTrue: false,
      nindu:[]
    };
  },
  mounted() {
    this.getTypecode()
    this.getniandu()
  },
  methods: {
    //从字典表查询所有年度
    getniandu() {
      this.$http
        .post(globalConfig.server5 + "tDictionaryController/getListForCode", {
          code: "nd"
        })
        .then(res => {
          if (res.data.response_code === "0") {
            this.nindu = res.data.response_body
            this.history("今年比对")
          } else {
            this.nindu = [];
          }
        });
    },
    daoshushuju() {
      this.yicang = false;
      this.daoshuTrue = true;
    },
    closeModles(val) {
      this.yicang = !val;
      this.daoshuTrue = val;
    },
    getTypecode() {
      this.$http
        .post(
          globalConfig.server4 +
            "democraticEvaluationOfDataAnalysis/showAttribute"
        )
        .then(res => {
          if (res.data.response_code == "0") {
            let data = res.data.response_body;
            data.forEach(item => {
              if (item.typeCode == "1") {
                this.checkList.push(item);
              }
            });
          }
        });
    },
    history(val) {
      // this.historyShow = !this.historyShow;
      // this.checkListShow = [];
      if (val == "今年比对") {
        
        this.checkListShow = [this.nindu[0].mainValue];
        this.historyShow = false;

      } else if (val == "历史比对") {
        this.historyShow = true;

        this.checkListShow = [this.nindu[0].mainValue];
      } else {
        this.checkListShow = [];
      }
    },
    getDate() {
      var date = new Date();
      date = this.formatDate("yyyy", date);
    },

    analysis() {
      this.analysisVisible = true;
      setTimeout(() => {
        var Arr = [];
        var Arr2 = [];
        var stafied = [];
        var stafied1 = [];
        this.main = true;
        let fd = new FormData();
        fd.append("deptNames", this.citycanshu)
        fd.append("manyilv", this.checkList1)
        fd.append("niandu", this.checkListShow)

        this.$http
          .post(
            globalConfig.server4 +
              "democraticEvaluationOfDataAnalysis/dzDataAnalysis",
            fd
          )
          .then(res => {
            if (res.data.response_code === "0") {
              // let data = res.data.response_body.szfList;
              let data = res.data.response_body

              // data.forEach(item => {
              //   Arr.push(item.deptName);
              //   stafied.push(item.overallExcellentPct);
              // });

              // let data2 = res.data.response_body.swList;
              // data2.forEach(item => {
              //   Arr2.push(item.deptName);
              //   stafied1.push(item.overallExcellentPct);
              // });
              let color1 = "rgb(255,0,0)"
              let color2 = "rgb(153,153,255)"

              var colors = [ "rgb(255,0,0)","rgb(153,153,255)"]
              
              let series = []
              let name = []
               this.checkListShow.forEach((val,index) => {
                  let obj1 = {
                    itemStyle: {
                      normal: {
                        color: "rgb(255,"+(0+index*40)+","+(0+index*60)+")"
                      }
                    },
                    niandu:val,
                    name: val + " 市委",
                    type:'bar',
                    barWidth: 30,
                    barGap:'10%',/*多个并排柱子设置柱子之间的间距*/
  	               barCategoryGap:'10%',/*多个并排柱子设置柱子之间的间距*/
                    origindata:data[val+"sw"],
                    label: {
                      normal: {
                        show: true,
                        position: "top"
                      }
                    }
                  }
                  name.forEach((item,index)=>{
                    if(item == val + " 市委"){
                      name.splice(index,1)
                    }
                  })
                  name.push(val + " 市委")
                  series.push(obj1)
              })
              this.checkListShow.forEach((val,index) => {
                  let obj1 = {
                    itemStyle: {
                      normal: {
                        color: "rgb(153,153,"+(255-index*40)+")"
                      }
                    },
                    niandu:val,
                    name: val + " 市政府",
                    barGap:'5%',/*多个并排柱子设置柱子之间的间距*/
  	               barCategoryGap:'5%',/*多个并排柱子设置柱子之间的间距*/
                    type:'bar',
                    barWidth: 30,
                    origindata:data[val+"szf"],
                    label: {
                      normal: {
                        show: true,
                        position: "top"
                      }
                    }
                  }
                  name.forEach((item,index)=>{
                    if(item == val + " 市政府"){
                      name.splice(index,1)
                    }
                  })
                  name.push(val + " 市政府")
                  series.push(obj1)
              })
             
              // console.log(series);
              
              // return 
              // series.forEach(item=>{
              //   item.data = []
              //   item.origindata.forEach(val=>{
              //     let arr = []
              //     arr.push(val.deptName)
              //     arr.push(val.overallExcellentPct)
              //     item.data.push(arr)
              //   })
              // })
              
            let count = 0
            let ndtype=0
            series.forEach(item=>{
            ndtype++
            item.data = []
            let datacount=0
            item.origindata.forEach(val=>{
            let arr = []
            arr.push(val.deptName)
            arr.push(val.overallExcellentPct)
            item.data.push(arr)
            datacount++
            }) 
            if(datacount>count)
            count=datacount
            })
            count=count*ndtype
            let sum=100
            let count_one=26
            if(ndtype===2)
            count_one=26
            if(ndtype===4)
            count_one=20
            if(ndtype===6)
            count_one=18
            if(count>=count_one){
            sum =Math.floor(count_one/count*100)
            } 
              // 指定图表的配置项和数据
              var option = {
                color: colors,
                animation: false,
                title: {
                  text: "党政班子数据分析表",
                  x: "center",
                  y: "top"
                },
                tooltip: {
                  trigger: "axis",
                  axisPointer: {
                    type: "cross"
                  }
                },
                grid: {
                  right: "10",
                  left: "40",
                  top: "80"
                },
                legend: {
                  data: name,
                  top: 40
                },
                toolbox: {
                  feature: {
                    saveAsImage: {}
                  }
                },
                dataZoom: {
                  realtime: false, //拖动滚动条时是否动态的更新图表数据
                  height: 25, //滚动条高度
                  start: 0, //滚动条开始位置（共100等份）
                  end: sum, //结束位置（共100等份）
                  startValue:10,
                  endValue:100
                  // zoomLock:true
                },
                xAxis: [
                  {
                    type: "category",
                    axisTick: {
                      alignWithLabel: true
                    },
                    // data: Arr
                  }
                ],
                yAxis: [
                  {
                    type: "value",
                    name: "优秀率",
                    min: 50,
                    max: 100,
                    position: "left",
                    axisLine: {
                      lineStyle: {
                        // color: colors[0]
                      }
                    },
                    axisLabel: {
                      formatter: "{value} %"
                    }
                  }
                  // {
                  //   type: "value",
                  //   name: "政府",
                  //   min: 50,
                  //   max: 100,
                  //   position: "right",
                  //   axisLine: {
                  //     lineStyle: {
                  //       color: colors[1]
                  //     }
                  //   },
                  //   axisLabel: {
                  //     formatter: "{value} %"
                  //   }
                  // }
                ],
                dataZoom: {
                  realtime: false, //拖动滚动条时是否动态的更新图表数据
                  height: 25, //滚动条高度
                  start: 0, //滚动条开始位置（共100等份）
                  end: sum, //结束位置（共100等份）
                  startValue:10,
                  endValue:100
                },
                series:series
                // series: [
                //   {
                //     name: "党委",
                //     type: "bar",
                //     barWidth: 30,
                //     label: {
                //       normal: {
                //         show: true,
                //         position: "top"
                //       }
                //     },
                //     data: stafied1
                //   },
                //   {
                //     name: "政府",
                //     type: "bar",
                //     yAxisIndex: 1,
                //     barWidth: 30,
                //     label: {
                //       normal: {
                //         show: true,
                //         position: "top"
                //       }
                //     },
                //     data: stafied
                //   }
                // ]
              };
              // 使用刚指定的配置项和数据显示图表。
              echarts.setOption(option,true);
              this.$message({
                type: "success",
                message: "分析成功!"
              });
            } else {
            }
          });

        var echarts = this.$echarts.init(document.getElementById("main"));
        
      }, 300);
    }
  }
};
</script>
<style scoped lang="scss">
#dangzhengbzh2 {
  .historyshow {
    display: inline-block;
    margin-left: 128px;
  }

  .martop {
    margin-top: 15px;
  }
  .martop {
    margin-top: 15px;
    font-weight: bold;
    color: #000;
  }
  p {
    font-size: 18px;
  }

  .checkBoxs {
    margin-top: 10px;

    .el-checkbox {
      margin: 10px 30px 10px 10px;
    }
  }
}
</style>
<style lang="scss">
// .daochubiaodan {
//   position: absolute;
//   right: 20%;
//   top: 30%
// }

#dangzhengbzh2 {
  .el-dialog__body {
    overflow: auto;
    max-height: 550px;
  }
  .el-checkbox__label {
    font-size: 16px;
  }
  .tables {
    position: relative;
  }

  .fenxi {
    position: relative;
    left: 80%;
    margin-top: -2%;
  }

  .el-checkbox-button__inner:hover {
    color: #d71f22;
  }

  .el-checkbox-button {
    margin: 0 20px 20px 0;
  }

  .el-checkbox-button.is-focus .el-checkbox-button__inner {
    border: 1px solid #d71f22;
  }

  .el-checkbox-button:not(:first-child) .el-checkbox-button__inner {
    border-left: 1px solid #dcdfe6;
  }

  .el-checkbox-button.is-focus:not(:first-child) .el-checkbox-button__inner {
    border-left: 1px solid #d71f22;
  }

  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    box-shadow: none;
    -webkit-box-shadow: none;
    background-color: #d71f22;
    border-color: #d71f22;
  }

  .el-checkbox-button.is-checked .el-checkbox-button__inner:hover {
    color: #fff;
  }

  .el-checkbox-button .el-checkbox-button__inner {
    border-radius: 5px;
  }
}
</style>
