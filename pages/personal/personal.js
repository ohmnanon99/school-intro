const app = getApp();

Page({
  data: {
    avatarUrl: '/images/personal/avatar.png', // 初始头像
    nickname: '海天', // 初始昵称
    tempFilePath: '', // 选择的图片临时路径
  },
   // 上传文件的路径
   upLoadFilePath: '',

  onLoad() {
    // 可在此处加载本地存储的用户信息
    this.loadLocalUserInfo();
  },

  // 点击头像切换为微信头像

  // 点击头像切换为微信头像
chooseWechatAvatar() {
  wx.getUserInfo({
    success: (res) => {
      const avatarUrl = res.userInfo.avatarUrl;
      this.setData({
        avatarUrl,
        selectedImage: avatarUrl
      });
      wx.showToast({ title: '已选择微信头像', icon: 'success' });
    },
    fail: () => {
      wx.showToast({ title: '授权失败，无法获取头像', icon: 'none' });
    }
  });
},

  // 点击昵称输入框选择微信昵称
chooseWechatNickname() {
  wx.getUserProfile({
    desc: '用于获取微信昵称',
    success: (res) => {
      const nickname = res.userInfo.nickName;
      this.setData({ nickname });
      wx.showToast({ title: '已选择微信昵称', icon: 'success' });
    }
  });
},

// 手动输入昵称
inputNickname(e) {
  this.setData({ nickname: e.detail.value });
},


  // 选择本地图片作为头像
 // 选择本地图片作为头像
 // 更改头像
 change: function () {
    wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            if (res.tempFiles && res.tempFiles.length > 0) {
                this.setData({
                    tempFilePath: res.tempFiles[0].tempFilePath,
                    avatarUrl: res.tempFiles[0].tempFilePath
                })
            }
        },
        fail: (err) => {
            console.error('选择图片失败:', err)
            wx.showToast({
                title: '选择图片失败',
                icon: 'none'
            })
        }
    })
},

// 上传头像
upload: function () {
    if (this.data.tempFilePath == '') {
        wx.showToast({
            title: '请先更改头像',
            duration: 2000,
            icon: 'error'
        })
        return
    }
    wx.uploadFile({
        filePath: this.data.tempFilePath,
        name: 'image',
        url: 'http://127.0.0.1:3000/upload',
        success: (res) => {
            console.log(res)
            wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 1000
            })
            this.upLoadFilePath = JSON.parse(res.data).file
        }
    })
},

  // 获取小组积分（使用用户提供的3003端口接口）

  getGroupScore: function() {
    // 从服务器获取小组积分
    wx.request({
      url: 'http://127.0.0.1:3003/credit',
      data:{
          token:app.globalData.token
      },
      success:(res)=>{
          console.log(res);
          wx.showToast({
            title: '你的积分:'+res.data.credit,
            icon:'success',
            duration:2000
          })
      },
      fail:(res)=>{
          console.log('获取失败:'+res);
      }
    })
  },


  // 保存头像到服务器（示例函数）
  saveAvatarToServer(url) {
    // 实际项目中可调用接口保存头像URL
    console.log('头像服务器路径:', url);
  },

  // 加载本地用户信息（示例）
  loadLocalUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({
          nickname: userInfo.nickname,
          avatarUrl: userInfo.avatarUrl,
          classInfo: { class: userInfo.class },
          groupInfo: { groupId: userInfo.groupId }
        });
      }
    } catch (e) {
      console.error('加载本地信息失败', e);
    }
  }
});