// index.js
Page({
    data: {
        // 页面中展示消息的内容
        content: '',
        //保存与服务器聊天的所有消息
        list: [],
        //最后一条消息的id，用于实现页面自动滚动
        lastId: '',
        inputContent: '',
    },

    ws1: null,
    // 接收输入框中的内容
    message: '',
    //建立与服务器的连接
    onLoad: function () {
        const ws = wx.connectSocket({
            url: 'ws://127.0.0.1:3004',
            success: (res) => {
                console.log('建立连接成功');
            }
        })
        //监听从服务器发来的消息事件
        ws.onMessage((res) => {
            console.log(res.data);
            const data = JSON.parse(res.data)
            //引用消息历史记录的数组
            const list = this.data.list
            const lastId = list.length
            list.push({
                id: lastId,
                content: data.content,
                role: 'server'
            })
            this.setData({
                list: list,
                lastId: lastId
            })
        })
        //监听连接关闭事件
        ws.onClose((res) => {
            console.log('连接关闭');
        })
        this.ws1 = ws
    },
    onUnload: function () {
        this.ws1.close()
    },
    //接受来自输入框的内容，并赋值到message中
    input: function (e) {
        this.message = e.detail.value
        console.log(this.message);
    },
    //实现点击按钮发送消息的功能
    send: function () {
        if (!this.message) {
            wx.showToast({
                title: '消息不能为空',
                icon: 'none',
                duration: 2000
            })
            return
        }
        this.ws1.send( {
            data: this.message
        });
        //保存消息记录，用于渲染到页面上
        const list = this.data.list
        const lastId = list.length
        list.push({
            id: lastId,
            content: this.message,
            role: 'me'
        })
        this.setData({
            list: list,
            lastId: lastId,
            inputContent: ''
        })
    }

})