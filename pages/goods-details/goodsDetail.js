//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({
    data:{
        goodsDetail:{},             //商品详情数据对象
        swiperCurrent:0,            //当前轮播的索引
        selectSize:'选择：',         //尺寸规格选择
        selectSizePrice:0,          //选择后商品价格
        totalScoreToPay:0,          //支付总价
        hasMoreSelect:false,        //尺寸规格参数
        shopNum:0,                  //购物车内商品数量
        shopCarInfo:{},             //购物车数据对象
        hideShopPopup:true          //规格弹窗判断
    },
    onLoad(e){
        console.log(e);
        this.getGoodsDetail(e.id);
    },

    // 轮播改变处理事件函数
	swiperchange(e){
		console.log('----18swiperchange',e);
		this.setData({  
			swiperCurrent: e.detail.current  
		})
    },
    
    // 获取商品详情信息
    getGoodsDetail(id){
        wx.request({
            url: app.globalData.baseUrl+ app.globalData.subDomain +'/shop/goods/detail',
            data: {
                id: id
            },
            success:(res) => {
                var selectSizeTemp = '';
                if (res.data.data.properties) {
                    for(var i=0;i<res.data.data.properties.length;i++){
                        selectSizeTemp = selectSizeTemp + " " + res.data.data.properties[i].name;
                    }

                    this.setData({
                        hasMoreSelect:true,
                        // goodsDetail:res.data.data,
                        selectSize:this.data.selectSize + selectSizeTemp,
                        // selectSizePrice:res.data.data.basicInfo.minPrice,
                    })
                }
                
                if (res.data.data.basicInfo.videoId) {
                    this.getVideoSrc(res.data.data.basicInfo.videoId);
                }

                this.setData({
                    goodsDetail:res.data.data,
                    selectSizePrice:res.data.data.basicInfo.minPrice,
                    totalScoreToPay: res.data.data.basicInfo.minScore,
                    buyNumMax:res.data.data.basicInfo.stores,
                    buyNumber:(res.data.data.basicInfo.stores>0) ? 1: 0
                });

                /**
                * WxParse.wxParse(bindName , type, data, target,imagePadding)
                * 1.bindName绑定的数据名(必填)
                * 2.type可以为html或者md(必填)
                * 3.data为传入的具体数据(必填)
                * 4.target为Page对象,一般为this(必填)
                * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
                */
                WxParse.wxParse('article', 'html', res.data.data.content, this, 5);
            }
        })
        this.reputation(id);
    },
    
    //获取商品评价
    reputation(goodsId){
        wx.request({
            url:app.globalData.baseUrl+ app.globalData.subDomain + '/shop/goods/reputation',
            data: {
                goodsId: goodsId
            },
            success:(res) => {

            },
        })
    },

    // 获取video播放链
    getVideoSrc(videoId){
        wx.request({
            url: app.globalData.baseUrl+ app.globalData.subDomain + '/media/video/detail',
            data: {
                videoId:videoId
            },
            success(res){
                if (res.data.code == 0) {
                    that.setData({
                        videoMp4Src: res.data.data.fdMp4
                    });
                }
            },
        })
    },

    //规格尺码选择弹出框
    bindGuiGeTap(){
        this.setData({  
            hideShopPopup: false 
        })
    },

    //初始化购物车数据
    initShopCart(){
        wx.getStorage({
            key: 'shopCarInfo',
            success:(res) => {
                this.setData({
                    shopCarInfo:res.data,
                    shopNum:res.data.shopNum
                })
            }
        })
    },
})