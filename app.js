import Towxml from "/towxml/main.js"//引入渲染库，可将HTML、Markdown转为微信小程序WXML

const url_base = "http://vue-blog.mkinit.com/wordpress/wp-json/wp/v2"

App({
	towxml:new Towxml(),//实例化渲染库
	onLaunch(){
		this.getCategories()
		const jwt = wx.getStorageSync("jwt")
		if(jwt){//程序启动时，如果本地数据库有jwt数据就把数据转为对象作为全局数据
			this.globalData.jwt = JSON.parse(jwt)
		}
	},
	globalData:{
		categories:[],
		jwt:{}
	},
	setJwt(token){
		wx.setStorageSync("jwt",JSON.stringify(token))//将返回的数据转为字符串后存放到浏览器本地数据库
		this.globalData.jwt = token//设置全局数据
	},
	getCategories(){
		wx.request({
			url:url_base + "/categories",
			success:response=>{
				this.globalData.categories = response.data
			}
		})
	}
})