<template>
  <div id="basicInfoUser">
   <el-tabs v-model="userwrap" type="card" @tab-click="handleClick">
    <el-tab-pane label="考核用户"  name="first">
      <UserControl :activeName="userwrap"></UserControl>
    </el-tab-pane>
    <el-tab-pane label="被考核用户" name="second">
      <AssessedUser :activeName="userwrap"></AssessedUser>
    </el-tab-pane>
    <el-tab-pane label="考核组用户" name="third">
      <ReviewGroupusers :activeName="userwrap"></ReviewGroupusers>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
 import UserControl from "./compontents/UserControl.vue"
 import AssessedUser from "./compontents/AssessedUser.vue"
 import ReviewGroupusers from "./compontents/ReviewGroupusers.vue"
  export default {
     components: {
      UserControl,
      AssessedUser,
      ReviewGroupusers
    },
    data() {
      return {
        userwrap: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
       
        // 存储到vuex中保存
        var userwrap=this.userwrap;
        this.$store.commit('SET_WRAP',userwrap);
     
      }
    },
    mounted () {
      this.handleClick()
    }
  };
</script>

<style scoped lang="scss">
  .btnGroup {
    padding: 20px 15px;
  }

  .el-aside {
    background-color: #EAF3FA;
    color: #333;
  }

  .el-main {
    margin: 0 !important;
    color: #333;
  }

  .userTableTitle {
    padding: 10px 0;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .deltip {
    color: red;
    font-size: 14px;
    padding: 12px 0;
  }

  .addUsertip {
    color: #ccc;
    font-size: 12px;
    margin-bottom: 10px;

    .req {
      color: red;
    }
  }

 
.paging{margin-top: 20px;
  margin-left: 30%;}
.el-button--text{font-size: 16px;}
</style>
<style lang="scss">
  #basicInfoUser {
    margin-top:5px;
    .userTree {
      margin-top: 20px;
      background-color: #EAF3FA;
    }

    .firstStyle {
      font-size: 25px;
      line-height: 30px;
    }

    .secondStyle {
      font-size: 20px;
      line-height: 20px;
    }

    .el-form-item__label {
      font-size: 16px;
    }
  }

</style>
