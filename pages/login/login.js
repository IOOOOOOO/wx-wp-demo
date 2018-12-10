import { weixinBind } from "../../utils/weixin.js"

const login_url = "http://vue-blog.mkinit.com/wordpress/wp-json/jwt-auth/v1/token"

const weixin_login_url = "http://vue-blog.mkinit.com/wordpress/wp-json/weixin/v1/login"

const app = getApp()

Page({
	data:{
		message:null,
		username:"",
		password:"",
		bind:false
	},
	onLoad(option){
		const bind = option.bind ? true : false
		this.setData({
			bind
		})
	},
	goHome(){
		wx.switchTab({
			url:"/pages/index/index"
		})
	},
	inputUser(event){
		this.setData({
			username:event.detail.value
		})
	},
	inputPassword(event){
		this.setData({
			password:event.detail.value
		})
	},
	toRegisterPage(){
		wx.navigateTo({
			url:"/pages/register/register?bind=true"
		})
	},
	weixinLoginBtn(){
		this.weixinLogin((response)=>{
			switch(response.statusCode){
				case 201:
				app.setJwt(response.data)
					/*this.setData({
						...response.data
					})*/
					wx.navigateBack({
						delta:1
					})
					break;
					case 404:
					wx.navigateTo({
						url:"/pages/login/login?bind=true"
					})
					break;
					default:console.log(response)
				}
			})
	},
	weixinLogin(callback){
		wx.login({
			success:(login)=>{
				wx.request({
					url:weixin_login_url,
					method:"POST",
					data:{
						code:login.code
					},
					success:(response)=>{
						callback(response)
					}
				})
			}
		})
	},
	login(){
		if(this.data.username!=="" && this.data.password!==""){
			wx.request({
				url:login_url,
				method:"POST",
				data:{
					username:this.data.username,
					password:this.data.password
				},
				success:response=>{
					const {data ,statusCode } = response
					if(data.code){
						switch(data.code){
							case "[jwt_auth] invalid_username":
							this.setData({
								message:"没有这个用户，请确认用户名是正确的！"
							})
							break;
							case "[jwt_auth] incorrect_password":
							this.setData({
								message:"密码错误！"
							})
							break;
							default:
							this.setData({
								message:"请检查用户名或密码是否正确！"
							})
							break;
						}
					}

					if(statusCode===200){//登录成功，将数据保存到全局属性中
						this.setData({
							message:"登录成功！"
						})
						app.setJwt(data)
						if(this.data.bind){
							wx.getUserInfo({
								success:(userInfo)=>{
									console.log(userInfo)
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
						wx.switchTab({
							url:"/pages/user/user"
						})
					}	
				}
			})
		}else if(this.data.username==""){
			this.setData({
				message:"请输入用户名！"
			})
		}else{
			this.setData({
				message:"密码不能为空！"
			})
		}
		
	}
})