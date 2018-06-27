const baseUrl = 'https://api.it120.cc/';

//app.js
App({
	onLaunch(){
    	// 展示本地存储能力
    	var logs = wx.getStorageSync('logs') || []
    	logs.unshift(Date.now())
    	wx.setStorageSync('logs', logs)
		
		//  获取商城名称
		wx.request({
			url:this.globalData.baseUrl + this.globalData.subDomain + '/config/get-value',
			data:{
				key:'mallName',
			},
			success(res){
				if(res.data.code == 0){
					wx.setStorageSync('mallName',res.data.data.value);
				}
			}
		})

    	// 登录
    	wx.login({
      		success: res => {
        		// 发送 res.code 到后台换取 openId, sessionKey, unionId
      		}
    	})
    	// 获取用户信息
    	wx.getSetting({
      		success: res => {
        		if (res.authSetting['scope.userInfo']) {
          			// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          			wx.getUserInfo({
            			success: res => {
              				// 可以将 res 发送给后台解码出 unionId
              				this.globalData.userInfo = res.userInfo

              				// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              				// 所以此处加入 callback 以防止这种情况
              				if (this.userInfoReadyCallback) {
                				this.userInfoReadyCallback(res)
              				}
            			}
          			})
        		}
      		}
    	})
  	},
  	globalData: {
		userInfo: null,
		subDomain:'tz',		//如果你的域名是： https://api.it120.cc/abcd 那么这里只要填写 abcd
		version:'0.0',
		shareProfile: '百款精品商品，总有一款适合您',	//首页转发的时候描述
		baseUrl:'https://api.it120.cc/'				//baseUrl
	}
	/*
  		根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒；
  		1、/pages/to-pay-order/index.js 中已添加关闭订单、商家发货后提醒消费者；
  		2、/pages/order-details/index.js 中已添加用户确认收货后提供用户参与评价；评价后提醒消费者好评奖励积分已到账；
  		3、请自行修改上面几处的模板消息ID，参数为您自己的变量设置即可。  
   */  
})