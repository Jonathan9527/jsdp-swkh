export default {
  data() {
    return {
      menuForm: {},
      multipleSelection: [],
      pages: {
        currentPage: 1,
        pageSizes: [15, 30, 50, 100],
        pageSize: 15,
        layout: "total, sizes, prev, pager, next, jumper",
        totalRows: null
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val
      this.getTableData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}

