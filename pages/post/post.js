const app = getApp()

const { towxml } = app//取出转换库的实例对象

const url_base = "http://vue-blog.mkinit.com/wordpress/wp-json/wp/v2"

Page({
	data:{
		title:"",
		content:{},
		featured_media:"",
		author:{},
		isLoading:true
	},
	onLoad(option){
		wx.request({
			url:url_base + "/posts/" + option.id + "?_embed=true",
			success:(response)=>{
				const entity = response.data
				const title = entity.title.rendered
				const content = towxml.toJson(entity.content.rendered, "html", this)//使用towxml库转换，处理后的数据是对象
				const featured_media = entity.featured_media ? entity._embedded['wp:featuredmedia'][0].media_details.sizes.medium_large.source_url : ""
				const author = entity._embedded.author[0]

				this.setData({
					...entity,
					title,
					content,
					featured_media,
					author,
					isLoading:false
				})

				wx.setNavigationBarTitle({
					title,
				})
			}
		})
	}
})