//自定义的微信绑定api接口
const url_base = "http://vue-blog.mkinit.com/wordpress/wp-json/weixin/v1/bind"

const weixinBind = ({userInfo, userId, token} = obj)=>{//确定绑定微信账户请求
	wx.login({
		success(login){//用户使用微信账户登录到小程序后发起绑定请求
			wx.request({
				url:url_base,
				method:"POST",
				header:{//头部身份验证
					"Authorization": "Bearer " + token
				},
				data:{
					code:login.code,
					userInfo,
					userId
				},
				success(response){
					if(response.statusCode===400){
						wx.showToast({
							title:"绑定过其它账户"
						})
					}
				}
			})
		}
	})
}

export {
	weixinBind
}