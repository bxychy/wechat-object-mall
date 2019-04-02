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
        hideShopPopup:true,         //规格弹窗判断
        buyNumber:0,                //商品购买数量
        buyNumMin:1,                
        buyNumMax:0,

        propertyChildIds:"",
        propertyChildNames:"",
        shopCarInfo:{},             //购物车数据对象
        canSubmit:false, //  选中规格尺寸时候是否允许加入购物车
        shopType:"addShopCar",      //购物类型,加入购物车或立即购买,默认为加入购物车        
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

    //规格尺码选择弹出框显示
    bindGuiGeTap(){
        this.setData({  
            hideShopPopup: false 
        })
    },

    //规格尺码选择弹出框隐藏
    closePopupTap(){
        this.setData({  
            hideShopPopup: true 
        })
    },

    //选择规格尺码
    labelItemTap(e) {
        console.log('labelItemTap-----125',e,e.currentTarget.dataset.propertyindex,this.data.goodsDetail.properties);
        var eindex = e.currentTarget.dataset.propertyindex;
        var childs = this.data.goodsDetail.properties[eindex].childsCurGoods;
        // 取消该分类下的子栏目所有的选中状态
        childs.map((c,ci) =>{
            c.active = false;
        });
        // 设置当前选中状态
        childs[e.currentTarget.dataset.propertychildindex].active = true;
        
        // 获取所有的选中规格尺寸数据
        var needSelectNum = this.data.goodsDetail.properties.length;
        var curSelectNum = 0;
        var propertyChildIds= "";
        var propertyChildNames = "";
        let canSubmit = false;
        
        this.data.goodsDetail.properties.map((p,pi) => {
            p.childsCurGoods.map((pc,pci) => {
                if(pc.active){
                    curSelectNum++;
                    propertyChildIds = propertyChildIds + p.id + ":" + pc.id + ",";
                    propertyChildNames = propertyChildNames + p.name + ":"+ p.name +"  ";
                }
            })
        })

        if (needSelectNum == curSelectNum) {
            canSubmit = true;
        }
        console.log('goodsDetail-------157',propertyChildIds,curSelectNum);
        // 计算当前价格
        if(canSubmit){

        }

        this.setData({
            goodsDetail: this.data.goodsDetail,
            canSubmit:canSubmit
        })
    },

    //减少商品数量
    numLessTap(){
        if(this.data.buyNumber > this.data.buyNumMin){
            var currentNum = this.data.buyNumber;
            currentNum--; 
            this.setData({  
                buyNumber: currentNum
            })  
         }
    }, 

    //增加商品数量
    numAddTap(){
        console.log('157------numAddTap',this.data.buyNumber < this.data.buyNumMin)
        if(this.data.buyNumber < this.data.buyNumMax){
            var currentNum = this.data.buyNumber;
            currentNum++; 
            this.setData({  
                buyNumber: currentNum
            })  
         }
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

    //跳转购物车
    goShopCar(){
        wx.reLaunch({
            url: "/pages/shopCart/shopCart"
        });
    },

    //弹出框显示加入购物车
    goAddShopCar(){
        this.setData({
            shopType:'addShopCar'
        })
        this.bindGuiGeTap();
    },

    //弹出框显示立即购买
    toBuyNow(){
        this.setData({
            shopType: "tobuy"
        });
        this.bindGuiGeTap();
    },

    //真·加入购物车
    addShopCar(){
        var addShopCarTip = !this.data.canSubmit ? '请选择商品规格！' : this.data.buyNumber < 1 ? '购买数量不能为0！' : '';
        if(this.data.goodsDetail.properties && !this.data.canSubmit){
            wx.showModal({
                title: '提示',
                content:addShopCarTip,
                showCancel: false
            })
            return;
        }else if(this.data.buyNumber < 1){
            wx.showModal({
                title: '提示',
                content:addShopCarTip,
                showCancel: false
            })
            return;
        }
        //组建购物车
        var shopCarInfo = this.bulidShopCarInfo();



    },

    //真·立即购买
    buyNow(){

    },

    //组建购物车方法
    bulidShopCarInfo(){
        // 购物车数据对象
        var shopCarMap = {
            goodsId:this.data.goodsDetail.basicInfo.id,
            pic:this.data.goodsDetail.basicInfo.pic,
            name:this.data.goodsDetail.basicInfo.name,
            propertyChildIds:this.data.propertyChildIds,
        };
    }
})