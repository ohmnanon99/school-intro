// pages/guest/guest.js
Page({
  submit:function(){
    wx.request({
      url: 'http://127.0.0.1:3000',
      method:'POST',
      data:this.data,
      success:(res)=>{
        //   wx.showModal({
        //     title: '提交完成',
        //     showCancel:false
        //   })
        wx.showToast({
          title: '上传成功',
        })
      },
      fail:()=>{
          wx.showToast({
            title: '上传失败',
          })
      }
    })
    }
})
   