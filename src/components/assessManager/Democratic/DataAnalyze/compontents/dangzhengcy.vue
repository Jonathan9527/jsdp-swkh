<template>
  <div>
    <div class="dangcy" id="dangzhnegh" v-show="yicang">
      <div class="fenxi">
        <el-button type="primary" class="bluebtnclass" @click="analysis">分 析</el-button>
        <el-button type="primary" class="bluebtnclass" @click="daoshushuju">导出数据</el-button>
      </div>
      <div class="tables">
        <p class="martop">一、设区市</p>
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
        <p class="martop">二、干部属性</p>
        <div class="checkBoxs">
          <el-checkbox-group v-model="ganbushuxin">
            <el-checkbox
              :label="item.mainValue"
              v-for="item in checkList1"
              :key="item.id"
              @change="birth(item)"
            >{{item.mainValue}}</el-checkbox>
          </el-checkbox-group>
          <div class="selectshow" v-if="birthShow">
            <div class="youngselect">
              <el-select v-model="youngValue" placeholder="请选择">
                <el-option
                  v-for="item in youngPeople"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="youngInput" v-if="inputShow">
              <el-input
                v-model="inputvalues"
                placeholder="请输入数字（表多少岁之内）"
                style="font-size:14px;"
                clearable
              ></el-input>
            </div>
            <div class="youngTime" v-if="!inputShow">
              <el-date-picker v-model="dataTime" type="month" placeholder="选择年月"></el-date-picker>
            </div>
            <div>
              <span>职级:</span>
              <el-select v-model="dutyLev" placeholder="请选择">
                <el-option
                  v-for="item in youngZhijiOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <div class="tables">
        <p class="martop">三、职务</p>
        <div class="checkBoxs">
          <el-checkbox-group v-model="zhiwucanshu">
            <el-checkbox
              v-for="zhiwu in checkList2"
              :label="zhiwu.mainValue"
              :key="zhiwu.id"
            >{{zhiwu.mainValue}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="tables">
        <p class="martop">四、满意率</p>
        <div class="checkBoxs checkmanyi">
          <!-- <el-checkbox-group v-model="manyilvcanshu" :max="1">
            <el-checkbox
              v-for="manyi in checkList3"
              :label="manyi.mainValue"
              :key="manyi.id"
            >{{manyi.mainValue}}</el-checkbox>
          </el-checkbox-group> -->
          <el-radio-group v-model="manyilvcanshu"  style="display:block">
            <el-radio 
              :label="manyi.mainValue" 
              :key="manyi.id" 
              v-for="manyi in checkList3">{{manyi.mainValue}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="tables">
        <p class="martop">五、对比方式</p>
        <div class="checkBoxs" style="margin-left:10px;">
          <el-radio-group v-model="duibifangshicanshu"  style="display:block">
            <el-radio 
              @change="history(duibifangshi.mainValue)"
              :label="duibifangshi.mainValue" 
              :key="duibifangshi.id" 
              v-for="duibifangshi in checkList4">{{duibifangshi.mainValue}}</el-radio>
          </el-radio-group>
          <div class="historyshow" v-if="historyShow">
            <el-checkbox-group v-model="checkListShow">
              <el-checkbox :label="item.mainValue" v-for="item in nindu" :key="item.mainValue"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <el-dialog :close-on-click-modal="false" :visible.sync="dzanalysisVisible" width="1100px">
        <div id="chengyuanmain" style="width: 1000px;height:500px;margin: 0 auto;" ></div>
      </el-dialog>
    </div>
    <dangzhengcydaochu :modules="daoshuTrue" @close="closeModles"></dangzhengcydaochu>
  </div>
</template>
<script>
import dangzhengcydaochu from "./daochubiaoge/dangzhengcydaochu.vue";
export default {
  components: {
    dangzhengcydaochu
  },
  props: ["showYin"],
  data() {
    return {
      yicang: true,
      daoshuTrue: false,
      dzanalysisVisible: false,
      citycanshu: [], //城市参数
      zhiwucanshu: [], //职务参数
      manyilvcanshu: "优秀率", //满意率参数
      duibifangshicanshu: "今年比对", //对比参数
      ganbushuxin: [], //干部属性
      checkList: [],
      checkList1: [],
      checkList2: [],
      checkList3: [],
      checkList5: [],
      checkList4: [],
      main: false,
      LeaderType: {
        sex: "",
        birthDay: "",
        nation: "",
        dutyLabel: "",
        partyDate: "",
        dutyLev: ""
      },
      checkListShow: [],
      birthShow: false, //年轻干部显示隐藏
      inputShow: true,
      historyShow: false, //历史对比显示隐藏
      dataTime: "", //年轻干部出生时间
      inputvalues: "", //年轻干部input
      youngValue: "1", //年轻干部
      dutyLev: "",
      youngZhijiOption: [],
      youngPeople: [
        {
          value: "1",
          label: "年龄"
        },
        {
          value: "2",
          label: "出生年月"
        }
      ],
      isSelect: false,
      isSelect2: false,
      nindu:[]
    };
  },
  mounted() {
    this.getTypecode()
    this.searchzhiji()
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
    searchzhiji() {
      this.$http
        .post(
          globalConfig.server4 +
            "democraticEvaluationOfDataAnalysis/showDutyLev"
        )
        .then(res => {
          if (res.data.response_code == "0") {
            this.youngZhijiOption = res.data.response_body.dutyLev;
          }
        });
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
              } else if (item.typeCode == "2") {
                this.checkList1.push(item);
              } else if (item.typeCode == "3") {
                this.checkList2.push(item);
              } else if (item.typeCode == "4") {
                this.checkList3.push(item);
              } else if (item.typeCode == "5") {
                this.checkList4.push(item)
                
              }
            });
          }
        });
    },
    getDate() {
      var date = new Date();
      date = this.formatDate("yyyy-MM-dd", date);
    },
    birth(val) {
      if (val.mainValue == "年轻干部") {
        this.birthShow = !this.birthShow;
        this.dataTime = "";
        this.inputvalues = "";
        this.dutyLev = "";
      }
    },
    history(val) {
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
    analysis() {
      if (
         this.checkListShow.length == 0
      ) {
        this.$message({
          type: "error",
          message: "请先选择对比方式!!"
        });
        return;
      } else if (this.checkListShow.length == 0) {
        this.$message({
          type: "error",
          message: "请先选择对比方式!!"
        });
        return;
      }

      (this.dzanalysisVisible = true),
        setTimeout(() => {
          let LeaderType = {
            sex: "",
            birthDay: "",
            nation: "",
            dutyLabel: "",
            partyDate: "",
            dutyLev: ""
          };

          this.ganbushuxin.forEach(item => {
            if (item == "女干部") {
              LeaderType.sex = "女";
            }
            if (item == "少数民族") {
              LeaderType.nation = "0";
            }
            if (item == "挂职") {
              LeaderType.dutyLabel = "挂职";
            }
            if (item == "党外") {
              LeaderType.partyDate = "0";
            }
            if (item == "年轻干部") {
              var date = new Date();
              let brith = "";
              let newdate = this.formatDate("yyyy", date);
              if (this.youngValue == 1) {
                brith = newdate - this.inputvalues + "-01-01";
                LeaderType.birthDay = brith;
              } else if (this.youngValue == 2) {
                brith = this.formatDate("yyyy-MM-dd", this.dataTime);
                LeaderType.birthDay = brith;
              }

              LeaderType.dutyLev = this.dutyLev;
            }
          });

          // var Arr = [];
          // var stafied = [];
          this.main = true;

          // let params = {
          //   LeaderType: JSON.stringify(LeaderType),
          //   deptNames:this.citycanshu,
          //   duty:this.zhiwucanshu,
          //   niandu:this.duibifangshicanshu,
          //   manyilv:this.manyilvcanshu
          // }
          let fd = new FormData();
          fd.append("LeaderType", JSON.stringify(LeaderType));
          fd.append("deptNames", this.citycanshu);
          fd.append("manyilv", this.manyilvcanshu);
          fd.append("niandu", this.checkListShow);
          fd.append("duty", this.zhiwucanshu);
          
          this.$http
            .post(
              globalConfig.server4 +
                "democraticEvaluationOfDataAnalysis/peopleDataAnlysis",
              fd
            )
            .then(res => {
              if (res.data.response_code === "0") {
                let data = res.data.response_body

                let series = []
                let name = []
                this.checkListShow.forEach((val,index) => {
                  
                  let obj = {
                    itemStyle: {
                      normal: {
                        color: colors[index]
                      }
                    },
                    niandu:val,
                    name: val ,
                    type:'bar',
                    barWidth: 30,
                    barGap:'10%',/*多个并排柱子设置柱子之间的间距*/
  	               barCategoryGap:'10%',/*多个并排柱子设置柱子之间的间距*/
                    origindata:data[val],
                    label: {
                      normal: {
                        show: true,
                        position: "top"
                      }
                    }
                  }
                  name.forEach((item,index)=>{
                    if(item == val ){
                      name.splice(index,1)
                    }
                  })
                  name.push(val)

                  series.push(obj)
                  
                  
                })

                series.forEach(item=>{
                  item.data = []
                  item.origindata.forEach(val=>{
                    let arr = []
                    arr.push(val.peopleName)
                    if(this.manyilvcanshu === "优秀率"){
                      arr.push(val.overallExcellentPct)
                    }else if(this.manyilvcanshu === "优称率"){
                      arr.push(val.overallExcellGoodPct)
                    }
                    
                    item.data.push(arr)
                  })
                })

                console.log(series)
                let count = 0
                let ndtype=0
                series.forEach(item=>{
                ndtype++
                if(item.data.length!=0){
                let datacount=0

                item.data.forEach(val=>[
                datacount++
                ])
                if(datacount>count)
                count=datacount
                }
                })
                count=count*ndtype
                let sum=100
                if(count>=18){
                sum =Math.floor(18/count*100)
                }

                // let count = 0
                // series.forEach(item=>{
                //   // if(item.data.length!=0){
                //     item.data.forEach(val=>[
                //       count++
                //     ])
                //   // }
                // })
                // Math.floor(15/count*100)
                // let sum=100
                // if(count>=15)
                // sum =Math.floor(15/count*100)
                // console.log(sum)
                // let optionLength = 100
                // if()
                console.log(sum);
                
                // 指定图表的配置项和数据
                var option = {
                  color: colors,
                  animation: false,
                  title: {
                    text: "党政成员数据分析表",
                    x: "center"
                  },
                  tooltip: {
                    trigger: "axis",
                    axisPointer: {
                      type: "cross"
                    }
                  },
                  grid: {
                    right: "40",
                    left: "50",
                    bottom:"80"
                  },
                  legend: {
                  data: name,
                  top: 30
                },
                  toolbox: {
                    feature: {
                      saveAsImage: {}
                    }
                  },
                  xAxis: [
                    {
                      type: "category",
                      // axisTick: {
                      //   alignWithLabel: true
                      // },
                      // data: xAxisData
                      axisLabel:{  
                        formatter : function(params){
                        if(params!=null){
                        let par=params.replace('(','\n(')
                        return par}
                        else return null
                        }
                      }  
                    }
                   
                  ],
                  yAxis: [
                    {
                      type: "value",
                      name: "满意率",
                      min: 50,
                      max: 100,
                      position: "left",
                      axisLine: {
                        lineStyle: {
                          color: new this.$echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                              { offset: 0, color: "#83bff6" },
                              { offset: 0.5, color: "#188df0" },
                              { offset: 1, color: "#188df0" }
                            ]
                          )
                        }
                      },
                      axisLabel: {
                        formatter: "{value} %",
                      }
                    }
                  ],
                  dataZoom: {
                    realtime: false, //拖动滚动条时是否动态的更新图表数据
                    height: 25, //滚动条高度
                    start: 0, //滚动条开始位置（共100等份）
                    end: sum, //结束位置（共100等份）
                    startValue:10,
                    endValue:100
                    // xAxisIndex:15,
                    // zoomLock:true
                  },
                  series: series
                  // series: [
                  //   {
                  //     name: "满意率",
                  //     type: "bar",
                  //     itemStyle: {
                  //       normal: {
                  //         color: new this.$echarts.graphic.LinearGradient(
                  //           0,
                  //           0,
                  //           0,
                  //           1,
                  //           [
                  //             { offset: 0, color: "#83bff6" },
                  //             { offset: 0.5, color: "#188df0" },
                  //             { offset: 1, color: "#188df0" }
                  //           ]
                  //         )
                  //       }
                  //     },
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
              } else if (res.data.response_code == "1") {
                (this.dzanalysisVisible = false),
                  this.$message({
                    type: "error",
                    message: "暂无数据,分析失败!!"
                  });
              }
            })
            
          var echarts = this.$echarts.init(
            document.getElementById("chengyuanmain")
          );
          var colors = ["#ff8080 ", "#5793f3","#00cccc"];
        }, 300);
    }
  },
  watch: {
    youngValue(val) {
      if (val == 1) {
        this.inputShow = true;
      } else {
        this.inputShow = false;
      }
    },
    // showYin(val){
    //   console.log(val)
    // },
    yicang(val) {
      // console.log
      this.$emit("close", val);
    }
  }
};
</script>
<style scoped lang="scss">
.tables {
  position: relative;
}

.fenxi {
  position: relative;
  left: 80%;
  margin-top: -2%;
}

.dangcy {
  .selectshow {
    margin-left: 120px;
    display: inline-block;
  }

  .historyshow {
    display: inline-block;
    margin-left: 128px;
  }

  .youngselect {
    width: 120px;
    display: inline-block;
  }

  .youngInput {
    display: inline-block;
    width: 222px;
  }

  .youngTime {
    display: inline-block;
    width: 222px;
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
#dangzhnegh {
  .el-dialog__body {
    overflow: auto;
    max-height: 550px;
  }
  .el-checkbox__label {
    font-size: 16px;
  }
  .checkmanyi .el-radio-group{
    margin-left:10px;
  }
}
</style>
