// index.js
Page({
  data: {
      shopList: [], //保存美食列表信息
  },

  //向服务器请求数据的参数的初值
  listData: {
      page: 1, //默认请求第1页的数据
      pageSize: 10, //默认每页请求10条的数据
      total: 0 //数据总数，默认为0
  },

  getShopList: function () {
      //请求数据之前，展示加载效果，接口调用结束后，停止加载效果
      wx.showLoading({
          title: '数据加载中...',
      })
      wx.request({
          //向服务器拿数据
          url: 'http://127.0.0.1:3001/data',
          method: 'GET',
          data: {
              page: this.listData.page,
              pageSize: this.listData.pageSize
          },
          success: (res) => {
              console.log(res)
              this.setData({
                  shopList: [...this.data.shopList, ...res.data],
              })
              this.listData.total = res.header['X-Total-Count'] - 0
              
              // 如果是下拉刷新触发的请求，显示成功提示
              if (this.listData.page === 1 && this.data.shopList.length === res.data.length) {
                  wx.showToast({
                      title: '请求成功',
                      icon: 'success',
                      duration: 1500
                  })
              }
          },
          complete: () => {
              //隐藏加载效果
              wx.hideLoading()
              // 停止下拉刷新动画
              wx.stopPullDownRefresh()
          },
          fail: () => {
              console.log('数据获取失败')
              wx.showToast({
                  title: '刷新失败',
                  icon: 'error',
                  duration: 1500
              })
          }
      })
  },
  onLoad: function () {
      this.getShopList()
  },
  onReachBottom: function () {
      //页码自增
      ++this.listData.page
      //请求下一页数据
      this.getShopList()
  },
  onPullDownRefresh: function () {
      //需要重置的数据
      this.setData({
          shopList: []
      })
      this.listData.page = 1
      this.listData.pageSize = 10
      this.listData.total = 0
      //重新发起数据请求
      this.getShopList()
  }
})