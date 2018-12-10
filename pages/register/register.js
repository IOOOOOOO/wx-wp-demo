import { weixinBind } from "../../utils/weixin.js"

const app = getApp()

const register_url = "http://vue-blog.mkinit.com/wordpress/wp-json/user/v1/register"

const login_url = "http://vue-blog.mkinit.com/wordpress/wp-json/jwt-auth/v1/token"

Page({
	data:{
		user:{},
		errMessage:"",
		bind:false
	},
	onLoad(option){
		const bind = option.bind?true:false
		if(bind){
			this.setData({
				bind
			})
		}
	},
	inputUsername(event){
		this.setData({
			["user.username"]:event.detail.value
		})
	},
	inputPassword(event){
		this.setData({
			["user.password"]:event.detail.value
		})
	},
	inputEmail(event){
		this.setData({
			["user.email"]:event.detail.value
		})
	},
	register(){
		wx.request({
			url:register_url,
			method:"POST",
			data:{
				...this.data.user
			},
			success:(response)=>{
				switch(response.statusCode){
					case 500:
					this.setData({
						errMessage:response.data.message
					})
					break;

					case 201://如果注册成功，发起登录请求
					wx.request({
						url:login_url,
						method:"POST",
						data:{
							username:this.data.user.username,
							password:this.data.user.password
						},
						success:(response)=>{
								if(response.statusCode===200){//登录成功，将数据保存到全局属性中
									app.setJwt(response.data)
									if(this.data.bind){
										wx.getUserInfo({
											success:(userInfo)=>{
												if(userInfo){
													weixinBind({
														userInfo,
														userId:response.data.user_id,
														token:response.data.token
													})
												}
											}
										})
									}

									const flash = JSON.stringify({//本地存储一条信息提示用户是否要绑定微信账户
										action:"bindWeixin",
										message:"绑定微信帐号"
									})

									wx.setStorageSync("flash",flash)

									wx.switchTab({
										url:"/pages/user/user"
									})
								}
							}
						})
					this.setData({
						user:{}
					})
					break;

					default:
					console.log(response)
				}
			}
		})
	}
})