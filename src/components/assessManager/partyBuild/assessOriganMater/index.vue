<template>
  <div id="showModel">
    <div class="showModelTop clearfix">
      <div class="topMiddle">
        <span class="tempName">考核指标：</span>
        <el-select
          v-model="value"
          value-key="model_name"
          style="width: 330px;"
          size="medium"
          placeholder="请选择"
          @change="getData"
        >
          <el-option
            v-for="item in kaoheOptions"
            :key="item.value"
            :label="item.model_name"
            :value="item"
          ></el-option>
        </el-select>
        <span prop="leader_dep_name">牵头单位：{{leader_dep_name}}</span>
        <span prop="beexamed_dep_name">被考核单位：{{beexamed_dep_name}}</span>
      </div>
      <div class="topRight">
        <el-button type="primary" size="medium" @click="addcom">上传材料</el-button>
        <!--<el-button type="primary" size="medium" class="iconfont icon-chaxun" @click="search">查询</el-button>-->
      </div>
    </div>
    <!--<div class="title2">-->
    <!--<p style="margin-left: 20px">南京市党的建设指标加减分佐证材料上传</p>-->
    <!--</div>-->
    <el-tabs>
      <div>
        <el-table
          :data="tableData"
          element-loading-text="系统加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.6)"
          border=""
          style="width: 100%"
        >
          <el-table-column label="年份" prop="niandu"></el-table-column>
          <el-table-column label="加减分内容" prop="add_minus_explanation"></el-table-column>
          <el-table-column prop="add_minus_file_name" label="加减分附件">
            <!--<template slot-scope="scope">
							<a href=""></a>
            </template>-->
          </el-table-column>
        </el-table>
      </div>
    </el-tabs>
    <!--添加提示框-->
    <el-dialog
      title="新增被考核单位"
      :visible.sync="adddialogFormVisible"
      :close-on-click-modal="false"
      class="addcom"
      width="600px"
    >
      <el-form :model="form">
        <el-form-item label="年份：">
          <el-input v-model="form.niandu" :disabled="true" size="small" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <template slot-scope="scope">
            <el-input
              type="textarea"
              style="width:500px"
              size="mini"
              :autosize="{ minRows: 5, maxRows:10}"
              v-model="form.textarea"
            ></el-input>
          </template>
        </el-form-item>
        <el-form-item label="文件：">
          <el-upload
            class="upload-demo"
            action="http://192.168.11.208:9092/dangjian/selectCailiao"
            :on-change="handlePreview"
            :on-remove="handleRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeupload"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button size="small" type="primary" class="iconfont icon-bianji">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="adddialogFormVisible2">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fileList: [],
      adddialogFormVisible: false,
      kaoheOptions: [],
      beexamed_dep_name: "", //被考核单位
      leader_dep_name: "", //牵头单位
      tableData: [
        {
          niandu: "", //年份
          add_minus_explanation: "", //内容
          add_minus_explan_files: "" //附件
        }
      ],
      form: {
        niandu: "",
        textarea: "",
        id: ""
      },
      value: "",
      fileObj: {},
      searchParams: {}
    };
  },
  methods: {
    getData(val) {
      this.form.niandu = this.formatDate("yyyy", val.niandu);
      this.tableData.niandu = this.formatDate("yyyy", val.niandu);
      this.leader_dep_name = val.leader_dep_name;
      this.beexamed_dep_name = val.beexamed_dep_name;
      this.searchParams.model_id = val.id;
      let person = JSON.parse(sessionStorage.getItem("personal"));
      this.searchParams.id = person.id;
      this.search();
    },
    search() {
      let params = this.searchParams;
      this.$http
        .post(globalConfig.server3 + "dangjian/selectCailiao", params)
        .then(res => {
          if (res.data.response_code == "0") {
            this.tableData = res.data.response_body.instances;
            this.form.id = res.data.response_body.instances[0].id;
            let str = res.data.response_body.instances[0].niandu;
            this.tableData.map(item => {
              item.niandu = item.niandu.split("-")[0];
            });

            this.niandu = str.substring(0, 4);
          } else {
            this.tableData = [];
          }
        });
    },
    //指标模型下拉
    searchOption() {
      this.$http
        .post(globalConfig.server3 + "dangjian/selectModel")
        .then(res => {
          if (res.data.response_code == "0") {
            this.kaoheOptions = res.data.response_body;
            this.model_id = res.data.response_body.model_id;
            this.form.niandu = this.formatDate("yyyy", val.niandu);
          }
        });
    },

    adddialogFormVisible2() {
      let fd = new FormData();
      fd.append("file", this.fileObj);
      fd.append("niandu", this.form.niandu);
      fd.append("add_minus_explanation", this.form.textarea);
      fd.append("id", this.form.id);
      this.$http
        .post(globalConfig.server3 + "dangjian/updateInstance", fd)
        .then(res => {
          if (res.data.response_code === "0") {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.adddialogFormVisible = false;
            this.form.textarea = "";
            this.fileList = [];
          } else {
            this.$message({
              type: "success",
              message: "添加失败!"
            });
          }
        });
    },

    beforeupload(param) {},
    handleRemove(file, fileList) {},
    handlePreview(file) {
      this.fileObj = file.raw;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    addcom() {
      this.adddialogFormVisible = true;
    }
  },
  mounted() {
    this.searchOption();
  }
};
</script>
<style scoped lang="scss">
#showModel {
  .el-dialog__body {
    overflow: auto;
    max-height: 550px;
  }
  .showModelTop {
    margin-bottom: 20px;
    .goback {
      float: left;
    }
    .topRight {
      margin-top: -49px;
    }
    .topMiddle {
      height: 60px;
      line-height: 33px;
      padding: 10px 10px;
      float: left;
      width: 100%;
      margin-top: 20px;
      span {
        padding: 0 10px;
        &.tempTip {
          padding-left: 20px;
        }
      }
    }
    .topRight {
      float: right;
    }
  }

  .el-loading-spinner .el-loading-text {
    font-size: 40px;
  }

  .el-loading-spinner i {
    font-size: 40px;
  }
}
.title1 {
  color: #606266;
  height: 50px;
  margin-top: 22px;
  line-height: 2.5;
}
.title2 {
  font-weight: bold;
  color: #333;
  font-size: 30px;
  margin: 20px 30% 20px;
  overflow: hidden;
}
</style>
