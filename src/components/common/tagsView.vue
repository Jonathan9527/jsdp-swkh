<template>
  <div @click="show = false" @contextmenu="closeMenu">
    <ScrollPanel class="tagView" ref='scrollPane'>
      <el-tag ref='item' v-for="(item,index) in visitedViews" :to="item.path" :key="item.name" closable
              :type="isActive(item) ? 'danger' : 'default'" @close="handleClose(item)">
        <span class="tag_span" @click="skipPage(item)" @contextmenu=openMenu(item,index)>
          {{item.name}}
        </span>
      </el-tag>
    </ScrollPanel>
    <RightMenu :startX="rightMenuX + 'px'" :startY="rightMenuY + 'px'" :list="lists" :show="show"
               @clickOperate="clickEvent"></RightMenu>
  </div>
</template>

<script>
  import RightMenu from './rightMenu.vue'
  import ScrollPanel from './scrollPanel.vue'

  export default {
    components: {RightMenu, ScrollPanel},
    data() {
      return {
        rightMenuX: 0,
        rightMenuY: 0,
        show: false,
        lists: [],

        index: '',
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.app.visitedViews;
      },
      menuStatus() {
        return this.$store.state.app.menuStatus;
      }
    },
    mounted() {
      this.addViewTags();
    },
    watch: {
      $route() {
        this.addViewTags();
        this.moveToCurrentTag();
      },
      menuStatus(val) {
        this.show = val;
      }
    },
    methods: {
      //已到当前tag
      moveToCurrentTag() {
        const items = this.$refs.item;
        this.$nextTick(() => {
          for (const tag of items) {
            if (tag.$attrs.to === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el);
              break;
            }
          }
        })
      },
      addViewTags() {
        const route = this.generateRoute();
        if (!route) {
          return false;
        }
        this.$store.dispatch('addVisitedViews', route);
      },

      generateRoute() {
        if (this.$route.name) {
          return this.$route;
        }
        return false;
      },
      skipPage(item) {
        this.$router.push(item.path);
      },
      handleClose(view) {
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view)) {
            const latestView = views.slice(-1)[0];
            if (latestView) {
              this.$router.push(latestView.path);
            } else {
              this.$router.push('/shouye');
            }
          }
        })
      },
      isActive(route) {
        return route.path === this.$route.path || route.name === this.$route.name;
      },
      openMenu(item, index) {
        this.$store.dispatch('openMenu');

        this.index = index;
        this.item = item;
        if (this.visitedViews.length < 2) {

        } else if (this.visitedViews.length > 1 && index === this.visitedViews.length - 1) {
          this.lists = [
            {clickIndex: 'other', label: '关闭其他标签页',},
            {clickIndex: 'left', label: '关闭左侧标签页',}
          ];
          this.contextMenuParam(event);
        } else if (this.visitedViews.length > 1 && index === 0) {
          this.lists = [
            {clickIndex: 'other', label: '关闭其他标签页',},
            {clickIndex: 'right', label: '关闭右侧标签页',},
          ];
          this.contextMenuParam(event);
        } else {
          this.lists = [
            {clickIndex: 'other', label: '关闭其他标签页',},
            {clickIndex: 'left', label: '关闭左侧标签页',},
            {clickIndex: 'right', label: '关闭右侧标签页',},
          ];
          this.contextMenuParam(event);
        }
      },
      // 关闭标签
      clickEvent(index) {
        switch (index) {
          case 'other':
            this.$store.dispatch('closeALLVisited', this.index);
            this.$router.push(this.item.path);
            break;
          case 'left':
            this.$store.dispatch('closeLeftVisited', this.index);
            break;
          case 'right':
            this.$store.dispatch('closeRightVisited', this.index);
            break;
        }
      },
      //关闭右键菜单
      closeMenu() {
        this.show = false;
      },
      //右键参数
      contextMenuParam(event) {
        let e = event || window.event;
        this.show = false;
        this.rightMenuX = e.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
        this.rightMenuY = e.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
        event.preventDefault();
        event.stopPropagation();
        this.$nextTick(() => {
          this.show = true;
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .tagView {
    min-height: 50px;
    overflow: hidden;
    display: flex;
    .el-tag {
      margin-right: 3px;
      cursor: pointer;
      height: 50px;
      line-height: 50px;
      border-radius: 4px 4px 0 0;
      border-bottom: -1px;
      .tag_span {
        font-size: 16px;
        display: inline-block;
        padding: 0 10px;
      }
    }
    .el-tag--default {
      background-color: #e4e7ed;
      color: #666;
      border: none;
      .el-tag__close {
        font-size: 16px;
        color: #787a7e;
        &:hover {
          background: #8F8F8F;
          color: #fff;
        }
      }
    }
    .el-tag--danger {
      background-color: #F8F8F8;
      color: #333333;
      border: none;
			border-right:1px solid #eaeaea ;
      .el-tag__close {
        font-size: 16px;
        color: #8F8F8F;
        &:hover {
          background: #8F8F8F;
          color: #fff;
        }
      }
    }
  }
</style>
