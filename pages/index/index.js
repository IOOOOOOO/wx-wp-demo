const app = getApp()

const url_base = "http://vue-blog.mkinit.com/wordpress/wp-json/wp/v2"

Page({
	data:{
		entities:[],
		currentPage:1,
		totalPages:0,
		isLoading:true,
		isEarth:false
	},
	onLoad(){
		this.getNewPosts()
	},
	onPullDownRefresh(){
		this.getNewPosts()
	},	
	onReachBottom(){
		let { currentPage, totalPages, isLoading, isEarth } = this.data
		if(currentPage >= totalPages || isLoading || isEarth){
			return
		}
		this.setData({
			isLoading: true
		})
		currentPage++
		wx.request({
			url:url_base + "/posts?page=" + currentPage,
			success:(response)=>{
				const entities = response.data
				this.setData({
					currentPage,
					isLoading: false,
					entities: [...this.data.entities,...entities],
					isEarth:currentPage >= totalPages//如果当前页面大于或等于总页数，说明到底
				})
			}
		})
	},
	getNewPosts(){//获取最新文章
		wx.request({
			url:url_base + "/posts",
			success:(response)=>{
				const entities = response.data
				this.setData({
					entities,
					isLoading: false,
					totalPages: response.header["X-WP-TotalPages"]//获取总的文章页数
				})
			}
		})
	}
})
