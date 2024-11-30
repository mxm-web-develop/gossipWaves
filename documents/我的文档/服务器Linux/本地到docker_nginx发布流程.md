
1. 进入服务器获取容器列表
	`docker ps` 或者 `docker ps | grep nginx`

 2. 找到需要部署的端口容器并进入执行,假设容器名称（或id) 为nginx_web_80
	`docker exec -it nginx_web_80 /bin/bash`
	
3. 调整nginx配置（如有需要） 
	`vim /etc/nginx/nginx.conf`

4. 进行版本升级（以独立测试部署为例）
	`npm version patch`
	
5. 构建本地项目(以vite项目为例)
	`npm run build`

6.  压缩本地打包好的文本
	`zip -r static_files.zip /path/to/your/dist`

7.  上传压缩包到远程服务器
	`scp static_files.tar.gz user@remote-server:/tmp`

8. 登录到服务器解压缩文件
	`unzip /tmp/static_files.zip -d /tmp`

9. 移动解压缩文件到容器静态host地址（如果有vim则放vim地址）
	`docker cp /tmp/static_files nginx_web_80:/usr/share/nginx/html/`

10. 在容器中重启nginx,或者在服务器直接重启docker
	`nginx -s reload`
	`docker restart nginx_web_80`