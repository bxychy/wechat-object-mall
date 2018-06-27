//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
    	indexTitle: 'Hello World',
    	userInfo: {},
    	hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		
		interval:3000,			//轮播自动切换时间
		duration:500,			//滑动动画时长
		swiperCurrent:0,
		banners:[],				//顶部轮播数组
	},
	// 轮播改变处理事件函数
	swiperchange(e){
		console.log('----18swiperchange',e);
		this.setData({  
			swiperCurrent: e.detail.current  
		})
	}, 
  //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
	onLoad(){
		var that = this
		if(wx.getStorageSync('mallName')){
			console.log('-----20',wx.getStorageSync('mallName'))
			// this.indexTitle = wx.getStorageSync('mallName');
			wx.setNavigationBarTitle({
				title: wx.getStorageSync('mallName')
			})
		}
		wx.request({
			url: app.globalData.baseUrl + app.globalData.subDomain + '/banner/list',
			data: {
			  	key: 'mallName'
			},
			success(res) {
			  	if (res.data.code == 404) {
						wx.showModal({
				  		title: '提示',
				  		content: '请在后台添加 banner 轮播图片',
				  		showCancel: false
					})
			  	} else {
					that.setData({
				  		banners: res.data.data
					});
			  	}
			}
		})

    	// if (app.globalData.userInfo) {
      	// 	this.setData({
        // 		userInfo: app.globalData.userInfo,
        // 		hasUserInfo: true
      	// 	})
    	// } else if (this.data.canIUse){
      	// 	// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      	// 	// 所以此处加入 callback 以防止这种情况
      	// 	app.userInfoReadyCallback = res => {
        // 		this.setData({
        //   			userInfo: res.userInfo,
        //   			hasUserInfo: true
        // 		})
      	// 	}
    	// } else {
      	// 	// 在没有 open-type=getUserInfo 版本的兼容处理
      	// 	wx.getUserInfo({
        // 		success: res => {
        //   			app.globalData.userInfo = res.userInfo
        //   			this.setData({
        //     			userInfo: res.userInfo,
        //     			hasUserInfo: true
        //   			})
        // 		}
      	// 	})
    	// }
  	},
  	getUserInfo: function(e) {
    	console.log(e)
    	app.globalData.userInfo = e.detail.userInfo
    	this.setData({
      		userInfo: e.detail.userInfo,
      		hasUserInfo: true
    	})
  	}
})
