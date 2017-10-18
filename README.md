# 多项目 webhooks 服务

* 通过配置为多个项目设置 webhook，
* 运行`npm start`
* 建议搭配 pm2 使用 `pm2 start index.js --watch --name 'webhooks-server'`

## 配置说明
config.json
```
{
  "hostname": "0.0.0.0", // 允许任意地址访问，一般不需要修改
  "port": "8001", // 服务端口，按需修改
  "projects": [
    {
      "url": "/test-hook", // 如果只有一个站点，可简单写为`/hook`，如果有多个项目，建议命名为'/projectName-hook'这种形式
      "cwd": "./test/", // 脚本工作目录，相对于`webhooks-server`所在目录，一般需要修改
      "script": "./test/build.sh" // 脚本路径，相对于`webhooks-server`所在目录，一般需要修改
    }
  ]
}
```

## 服务器设置

1. 使用 nginx 反向代理到内网 （不占用新端口，推荐）
webhook 地址为 `http://youdomain.com/test-hook`  

编辑 `/etc/nginx/conf.d/yousite.conf` 文件，增加如下规则
```
location /test-hook {
		proxy_pass http://127.0.0.1:8001/test-hook;
}
```

2. 使用指定端口直接访问
webhook 地址为 `http://youdomain.com:8001/test-hook`
* 检查要用的端口是否打开
有安全组的服务器，需要添加规则如`允许 TCP：8001`
需要检查防火墙状态，如果是开启状态，需要添加规则

* 测试端口是否打开
在服务器上运行 webhooks-server，运行`netstat -ntlp`可看到端口监听状态
然后在本机上运行 `telnet IP PORT`，如果回应中有`connected`，则表示端口可以访问

