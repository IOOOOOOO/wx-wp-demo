//检测身份验证的有效性（是否过期）
const base_url = "http://vue-blog.mkinit.com/wordpress/wp-json/jwt-auth/v1/token/validate"

const validateToken = ( jwt={}, callback=()=>{} )=>{
	wx.request({
		url:base_url,
		method:"POST",
		header:{//头部身份验证
			"Authorization": "Bearer " + jwt.token
		},
		success:(response)=>{
			switch(response.statusCode){
				case 200:
					return callback(true)
					break;
				case 403:
					return callback(false)
					break;
				default:
					console.log(response)
			}
		}
	})
}

export default validateToken