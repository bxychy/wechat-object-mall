var app = getApp();
Page({
    data:{
        remind:'加载中',        //loading
        angle:0,                //旋转角度
        userInfo:{},             //用户信息
    },

    onShow(options){
        let userInfo = wx.getStorageSync('userInfo');
        if(!userInfo){
            wx.navigateTo({
                url: "/pages/authorize/authorize"
            })
        }else{
            this.setData({
                userInfo: userInfo
            })
        }
    },

    onLoad(){
        wx.setNavigationBarTitle({
            title: wx.getStorageSync('mallName')
        })
    },

    onReady(){
        setTimeout(() => {
            this.setData({
                remind: ''
            });
        }, 2500);
        wx.onAccelerometerChange((res) => {
            var r = -(res.x * 30).toFixed(1);
            r = r > 14 ? 14 : r < -14 ? -14 : '';
            if(this.data.angle != r){
                this.setData({
                    angle:r
                })
            }
        })
    },

    //进入店铺
    goToIndex(){
        wx.switchTab({
            url: '/pages/index/index',
        });
    },
})