//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
    	indexTitle: 'Hello World',
    	userInfo: {},
    	hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		
		autoplay: true,			//自动轮播
		interval:3000,			//轮播自动切换时间
		duration:500,			//滑动动画时长
		swiperCurrent:0,		//当前轮播的索引
		banners:[],				//顶部轮播数组
		categories:[],			//nav数组
		activeCategoryId:0,		//当前nav索引
		searchInput:'',			//搜索内容
		goods:[],				//商品数组

	},

	// 轮播改变处理事件函数
	swiperchange(e){
		// console.log('----18swiperchange',e);
		this.setData({  
			swiperCurrent: e.detail.current  
		})
	},

	//当前nav索引及商品数据
	tabClick(e){
		this.setData({
			activeCategoryId:e.currentTarget.id
		})
		this.getGoodsList(this.data.activeCategoryId);
	}, 
  //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
	onLoad(){
		if(wx.getStorageSync('mallName')){
			console.log('-----20',wx.getStorageSync('mallName'))
			// this.indexTitle = wx.getStorageSync('mallName');
			wx.setNavigationBarTitle({
				title: wx.getStorageSync('mallName')
			})
		}

		this.getBanner();
		this.getNav();
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

	// 获取用户信息方法
  	getUserInfo: function(e) {
    	console.log(e)
    	app.globalData.userInfo = e.detail.userInfo
    	this.setData({
      		userInfo: e.detail.userInfo,
      		hasUserInfo: true
    	})
	},

	// 获取轮播数据方法
	getBanner(){
		wx.request({
			url: app.globalData.baseUrl + app.globalData.subDomain + '/banner/list',
			data: {
			  	key: 'mallName'
			},
			success:(res) => {
			  	if (res.data.code == 404) {
						wx.showModal({
				  		title: '提示',
				  		content: '请在后台添加 banner 轮播图片',
				  		showCancel: false
					})
			  	} else {
					this.setData({
				  		banners: res.data.data
					});
			  	}
			}
		})
	},

	// 获取nav方法
	getNav(){
		wx.request({
			url: app.globalData.baseUrl+ app.globalData.subDomain +'/shop/goods/category/all',
			success:(res) => {
			  	var categories = [{id:0, name:"全部"}];
			  	if (res.data.code == 0) {
					for (var i = 0; i < res.data.data.length; i++) {
				  		categories.push(res.data.data[i]);
					}
			  	}
			  	this.setData({
					categories:categories,
					activeCategoryId:0
			  	});
			  	this.getGoodsList(0);
			}
		})
	},

	// 获取商品信息方法
	getGoodsList(categoryId){
		wx.request({
			url:app.globalData.baseUrl+ app.globalData.subDomain +'/shop/goods/list',
			data:{
				categoryId:categoryId ? categoryId : '',
				nameLike:this.data.searchInput,
			},
			success:(res) => {
				var goods = [];
				if(!res.data.data){
					return false;
				}
				for(var i = 0;i < res.data.data.length;i++){
					goods.push(res.data.data[i]);
				}
				this.setData({
					goods:goods,
				});
			},
		})
	},
	


	// banner跳转方法
	tapBanner(e){
		console.log(e);
		if (e.currentTarget.dataset.id != 0) {
			wx.navigateTo({
				url:'/pages/goods-details/goodsDetail?id=' + e.currentTarget.dataset.id
			})
		}
	},

	// 键盘输入触发方法
	listenerSearchInput(e){
		// console.log(e,e.detail.value);
		this.setData({
			searchInput:e.detail.value
		});
	},

	// 键盘输入完成点击搜索触发方法
	toSearch(e){
		this.getGoodsList(this.data.activeCategoryId);
	}
})
