// app.js
App({
  globalData: {
      token: null
  },

  onLaunch: function () {
      this.checkLogin((res) => {
          console.log('用户是否登录过?' + res.is_login);
          if (!res.is_login) {
              this.login()
          }
      })
  },

  //实现小程序启动后自动登录功能
  login: function () {
      wx.login({
          success: (res) => {
              console.log('code:' + res.code);
              wx.request({
                  url: 'http://127.0.0.1:3003/login',
                  method: 'POST',
                  data: {
                      code: res.code
                  },
                  success: (res) => {
                      console.log(res);
                      console.log('服务端发回来的token:' + res.data.token);
                      this.globalData.token = res.data.token
                      wx.setStorageSync('token', res.data.token)
                  }
              })
          },
      })
  },
  //检查用户是否登陆过
  checkLogin: function (callback) {
      var token = this.globalData.token
      if (token == null) {
          token = wx.getStorageSync('token')
          console.log('从缓存取出来的token: ' + token)
          if (token) {
              
              this.globalData.token = token
          } else {
              //用户从未登录
              callback({ is_login: false })
              return
          }
      }

      //检查token是否有效
      wx.request({
          url: 'http://127.0.0.1:3003/checklogin',
          data: {
              token: token
          },
          method: 'GET',
          success: (res) => {
              callback({ is_login: res.data.is_login })
          }
      })
  }

})