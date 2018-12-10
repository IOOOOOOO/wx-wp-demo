## 动图演示

首页

![image](https://github.com/mkinit/wx-wp-demo/blob/master/gif/home.gif)

发布文章

![image](https://github.com/mkinit/wx-wp-demo/blob/master/gif/post.gif)

登录

![image](https://github.com/mkinit/wx-wp-demo/blob/master/gif/login.gif)

注册并绑定微信，使用微信登录

![image](https://github.com/mkinit/wx-wp-demo/blob/master/gif/register-bind-weixin.gif)


## API
* 接口
    
    * 地址：http://vue-blog.mkinit.com/wordpress/

        * wordpress 是 wordpress 的安装目录

        * 接口其他参数

            * 获取额外信息参数，如特色图片等：?_embed=true

            * 删除图片时直接删除，不放入回收站：?force=true

        * 接口：/wordpress/wp-json/api/info

            * 没登录时获取网站信息：获取博客的名称、描述、url、管理员邮件地址（利用主题functions.php自定义的api）

        ```
        //自定义获取网站信息函数
        function api_get_info() {
            $data = array(
                "name"=>get_bloginfo("name"),
                "description"=>get_bloginfo("description"),
                "url"=>str_replace("/wordpress","",get_bloginfo("url")),
                "admin_email"=>get_bloginfo("admin_email")
            );
            if ( empty( $data ) ) {
                return null;
            }
            $json = json_encode($data,480);//无法使用格式化，不知道为啥
            return $data;
        }
        
        add_action( 'rest_api_init', function () {//挂载到rest api
            register_rest_route( 'api', '/info', array(
                'methods' => 'GET',
                'callback' => 'api_get_info',
            ) );
        } );
        ```
    
    * /wordpress/wp-json/wp/v2/categories：获取分类

    * /wordpress/wp-json/wp/v2/posts：获取最新文章（文章的获取都是默认10条数据）
   
    * /wordpress/wp-json/wp/v2/posts?categories=<分类id>：获取分类文章
   
    * /wordpress/wp-json/wp/v2/posts?per_page=<数量>：获取最新文章（自定义数量）
   
    * /wordpress/wp-json/wp/v2/posts?categories=<分类id>&per_page=<数量>：获取分类文章&数量
   
    * /wordpress/wp-json/wp/v2/posts/<文章id>：获取某篇文章

    * /wordpress/wp-json/wp/v2/comments：获取所有评论
   
    * /wordpress/wp-json/wp/v2/comments?post=<文章id>：获取某文章的所有评论
   
    * /wordpress/wp-json/wp/v2/comments?parent=<评论id>：获取某个评论下的回复
   
    * /wordpress/wp-json/wp/v2/comments?parent=0&post=<文章id>：获取某个文章下的一级评论

    * /wordpress/wp-json/wp/v2/posts?tags=<标签>：获取标签文章

    * /wordpress/wp-json/wp/v2/posts?search=<搜索词>：可匹配标题和内容

    * /wordpress/wp-json/wp/v2/comments：提交评论

    * /wordpress/wp-json/wp/v2/media：获取媒体数据

## 使用插件形式添加一个wordpress  api无标签的字段

    * 详见网站中的插件：mk-excerpt-rest-api

## 网站身份验证

wordpress网站需要安装JWT Authentication for WP-API插件，基于JSON Web Token跨域认证。

使用终端生成随机码：openssl rand -base64 64

配置：

```php
//jwt插件配置（网站根目录的wp-config.php中）
define("JWT_AUTH_SECRET_KEY","juSL+pWNcTn64R/5SGnJ66h60u7iVyt1tI1lHQaPR9h7fNNCM9nshxeU0jiGy4Ph
Y5DJvKJ8mqT31lfF/zkx/A==");
define("JWT_AUTH_CORS_ENABLE",true);
```

## 向网站根目录的.htaccess文件添加头部授权认证信息
```
#开启HTTP授权
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
```

## 创建用户注册接口插件

    * 详见网站中的插件：mk-excerpt-rest-api

    * 用户注册请求接口：http://vue-blog.mkinit.com/wordpress/wp-json/user/v1/register

        * 请求类型：POST

## 为小程序自定义的接口

    * 登录验证接口：http://网站地址/wp-json/jwt-auth/v1/token

    * 验证身份有效性接口：http://网站地址/wp-json/jwt-auth/v1/token/validate

    * 绑定微信用户接口：http://网站地址/wordpress/wp-json/weixin/v1/bind

    * 微信登录接口：http://网站地址/wordpress/wp-json/weixin/v1/login

## 为微信用户签发jwt，在自定义的插件中需要用到firebase  php-jwt包

https://github.com/firebase/php-jwt

将文件重命名放到自定义插件中，参考jwt-authentication-for-wp-rest-api插件