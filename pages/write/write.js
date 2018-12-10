import validateToken from "../../utils/auth-jwt.js"

const app =getApp()

const url_base = "http://vue-blog.mkinit.com/wordpress/wp-json/wp/v2"

Page({
	data:{
		entity:{},
		categories:[],
		selectIndex:0,
		jwt:{},
		status:"",
		images:[],
		progress:[]
	},
	onShow(){
		const {jwt} = app.globalData
		validateToken(jwt,(result)=>{//调用验证程序验证身份是否过期
			if(!result){
				wx.navigateTo({
					url:"/pages/login/login"
				})
			}
		})

		this.setData({
			jwt:{
				...jwt
			}
		})

		if(app.globalData.categories.length>0){//如果全局有分类信息，直接设置当前页面数据
			this.setData({
				categories:app.globalData.categories
			})
		}else{//如果全局没有分类信息，发送请求获取数据
			wx.request({
				url:url_base + "/categories",
				success:response=>{
					this.setData({
						categories:response.data
					})
				}
			})
		}
	},
	inputTitle(event){//设置文章标题数据
		this.setData({
			["entity.title"]:event.detail.value
		})
	},
	inputContent(event){//设置文章内容数据
		this.setData({
			["entity.content"]:event.detail.value
		})
	},
	setStatus(event){//设置文章发布状态
		this.setData({
			["entity.status"]:event.detail.value ? "publish" : "draft"
		})
	},
	publish(){//发布文章
		this.setData({
			status:"发布中……"
		})
		wx.request({
			url:url_base + "/posts",
			method:"POST",
			header:{//头部身份验证
				"Authorization": "Bearer " + this.data.jwt.token
			},
			data:{
				...this.data.entity,
				categories:this.data.categories[this.data.selectIndex].id
			},
			success:response=>{
				if(response.statusCode===201){
					if(this.data.entity.status==="publish"){//如果是发布状态则跳转到新发布的文章页面
						wx.navigateTo({
							url:"/pages/post/post?id=" + response.data.id
						})
					}
					this.setData({
						entity:{},//成功后清空数据
						status:"发布成功！",
						images:[]
					})
				}
			}
		})
	},
	selectCategory(event){//选择分类事件
		this.setData({
			selectIndex:event.detail.value
		})
	},
	upload(){//添加图片
		wx.chooseImage({
			count:1,//只能同时选择上传一张
			sizeType:["original"],//图片尺寸类型为原图
			sourceType:["album","camera"],
			success:response=>{
				const images = response.tempFiles//response.tempFilePaths，使用tempFiles能获取图片的更多信息
				this.setData({//设置图片数据
					images
				})
				images.map((file,index)=>{//遍历图片上传
					const uploadTask = wx.uploadFile({
						url:url_base + "/media",
						filePath:file.path,
						name:"file",
						header:{//头部身份验证
							"Authorization": "Bearer " + this.data.jwt.token
						},
						success:response=>{//上传成功后设置特色图片
							const media = JSON.parse(response.data)
							const images = this.data.images//获取用户添加的图片
							images[index] = {//给每张图片添加额外的信息
								...file,
								id:media.id
							}
							this.setData({
								["entity.featured_media"]:media.id,
								images//重新设置图片数据
							})
						}
					})
					uploadTask.onProgressUpdate(response=>{//设置上传进度
						const progress = [...this.data.progress]
						progress[index] = response.progress
						this.setData({
							progress
						})
					})
				})
			}
		})
	},
	preview(event){//图片预览
		const urls = this.data.images.map(image=>{
			return image.path
		})
		wx.previewImage({
			current:event.currentTarget.dataset.src,
			urls
		})
	},
	imageOption(event){//长按显示对图片的操作选项
		wx.showActionSheet({
			itemList:["删除图片"],
			success:response=>{
				switch(response.tapIndex){
					case 0 : 
						this.delImage(event.currentTarget.dataset.id)
						break;
					default: console.log(response)
				}
			}
		})
	},
	delImage(id){//删除图片处理程序
		wx.request({
			url:url_base + "/media/" + id + "?force=true",//force=true 直接删除，不放在回收站
			method:"DELETE",
			header:{//头部身份验证
				"Authorization": "Bearer " + this.data.jwt.token
			},
			success:response=>{
				const images = this.data.images.filter(item=>{
					return item.id != id
				})

				this.setData({
					images
				})
			}
		})
	}
})