import { log } from "handlebars";

const app = {
  state: {
    visitedViews: [],//标签
    menuStatus: false,//右键
    super_admin: 0,//右键
    userwrap:"",//考核用户
  },
  // 计算属性
  getters: {},
  // 声明函数
  mutations: {
    // 考核用户设置
    SET_WRAP(state,view){
      this.state.userwrap=view;
    
    },
    // 管理员权限
    MANGER_ADMIN(state) {
      // state.super_admin = JSON.parse(sessionStorage.getItem('personal')).super_admin;
    },
    // ==========标签========
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return;
      // state.visitedViews.push({
      //   name: view.name,
      //   path: view.path,
      // })
      let tag = [{
        name: view.name,
          path: view.path
      }]
      state.visitedViews = tag
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1);
          break
        }
      }
    },
    CLOSE_ALL_VISITED: (state, view) => {
      state.visitedViews.splice(view + 1, state.visitedViews.length);
      state.visitedViews.splice(0, view);
    },
    CLOSE_LEFT_VISITED: (state, view) => {
      state.visitedViews.splice(0, view);
    },
    CLOSE_RIGHT_VISITED: (state, view) => {
      state.visitedViews.splice(view + 1, state.visitedViews.length);
    },
    // 右键关闭标签
    closeALLVisited({commit}, view) {
      commit('CLOSE_ALL_VISITED', view);
    },
    closeLeftVisited({commit}, view) {
      commit('CLOSE_LEFT_VISITED', view);
    },
    closeRightVisited({commit}, view) {
      commit('CLOSE_RIGHT_VISITED', view);
    },
    //================右键==================
    CLOSE_MENU: (state) => {
      state.menuStatus = false;
    },
    OPEN_MENU: (state) => {
      state.menuStatus = true;
    },
  },
  // 代理执行
  actions: {
    // ==========管理员权限========
    manger_admin({commit}, view) {
      commit('MANGER_ADMIN', view);
    },
    // ==========标签========
    addVisitedViews({commit}, view) {
      commit('ADD_VISITED_VIEWS', view);
    },
    delVisitedViews({commit, state}, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view);
        resolve([...state.visitedViews])
      })
    },
    // 右键关闭标签
    closeALLVisited({commit}, view) {
      commit('CLOSE_ALL_VISITED', view);
    },
    closeLeftVisited({commit}, view) {
      commit('CLOSE_LEFT_VISITED', view);
    },
    closeRightVisited({commit}, view) {
      commit('CLOSE_RIGHT_VISITED', view);
    },
    // ================右键=================
    closeMenu({commit}) {
      commit('CLOSE_MENU');
    },
    openMenu({commit}) {
      commit('OPEN_MENU');
    },
  }
};
export default app
