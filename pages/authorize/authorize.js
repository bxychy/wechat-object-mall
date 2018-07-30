var app = getApp();
Page({
    data:{

    },

    onLoad() {
  
    },

    //表单提交方法
    bindSave(){

    },

    //获取到用户信息回调方法
    bindGetUserInfo(e){
        console.log('获取到用户信息回调方法-----e.18',e);
        if(!e.detail.userInfo) return false;
        wx.setStorageSync('userInfo', e.detail.userInfo);
        this.login();
    },

    //登录方法
    login(){
        let token = wx.getStorageSync('token');
        if(token){
            console.log('28')
        }else{
            wx.login({
                success:(res) => {
                    wx.request({
                        url: app.globalData.baseUrl + app.globalData.subDomain + '/user/wxapp/login',
                        data: {
                            code: res.code
                        },
                        success:(res) => {
                            console.log(res);
                            if (res.data.code == 10000) {
                                // 去注册
                                that.registerUser();
                                return;
                            }
                            if (res.data.code != 0) {
                                // 登录错误
                                wx.hideLoading();
                                wx.showModal({
                                    title: '提示',
                                    content: '无法登录，请重试',
                                    showCancel: false
                                })
                                return;
                            }
                            wx.setStorageSync('token', res.data.data.token);
                            wx.setStorageSync('uid', res.data.data.uid);
                            // 回到原来的地方放
                            wx.navigateBack();
                        }
                    })
                }
            })
        }
    },
})