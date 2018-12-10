import { weixinBind } from "../../utils/weixin.js"

const app = getApp()

Page({
	data:{
		modalBox:false
	},
	onShow(){
		const { jwt } = app.globalData
		if(jwt){
			this.setData({
				...jwt
			})
		}
		const flashData = wx.getStorageSync("flash")
		if(flashData){
			wx.removeStorageSync("flash")
			const flash = JSON.parse(flashData)
			switch(flash.action){
				case "bindWeixin":
					this.setData({
						modalBox:true
					})
					break;
			}
		}
		/*if(jwt.token){
			wx.getSetting({
				success:res=>{//获取用户授权状态
					if(!res.authSetting["scope.userInfo"]){
						this.setData({
							modalBox:true
						})
					}
				}
			})
		}*/
	},
	getUserInfo(event){//获取用户微信账户信息
		console.log(event)
		this.setData({
			modalBox:false
		})
		weixinBind({//使用微信绑定函数，将数据传递过去作为传递给后端的数据
			userInfo:event.detail.userInfo,
			userId:this.data.user_id,
			token:this.data.token
		})
	},
	cancleBind(){
		this.setData({
			modalBox:false
		})
	},
	toRegisterPage(){
		wx.navigateTo({
			url:"/pages/register/register"
		})
	},
	toLoginPage(){
		wx.navigateTo({
			url:"/pages/login/login"
		})
	},
	logout(){
		wx.removeStorageSync("jwt")
		app.globalData.jwt = {}
		this.setData({
			user_email:"",
			user_nicename:"",
			user_avatar:{},
			user_caps:{}
		})
	}
})