## 开放接口测试平台

该项目是一个通用的接口测试平台，实现接口请求并验证响应。

> 该仓库只是前端项目，需要配合后端服务使用。后端项目在[这里](https://github.com/openatp/openatp-backend)。

该项目使用 Vue3+Vite+Typescript+ElementPlus+Tailwindcss 开发。

## 本地开发

项目使用 `pnpm` 管理依赖。常用命令如下：

```
# 安装依赖
$ pnpm install

# 安装依赖
$ pnpm run dev
```

本地开发是需要修改项目跟目录的 vite.config.ts 配置文件的 proxy 配置，将 target 指向正确的后端服务地址，具体请参考配置文件。

## 线上部署

使用如下命令打包，打包后的产物在 dist 目录：

```
$ pnpm run build
```

打包成功后将 dist 目录下的文本放到 nginx 服务目录下，并为 nginx 添加如下配置：

```
location /api/ { 
    proxy_pass http://127.0.0.1:21091/;
    proxy_redirect off; proxy_buffering off;
    proxy_hide_header Server;
    proxy_set_header Host $host:$server_port;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    add_header Access-Control-Allow-Headers Cache-Control,Pragma;
}
```

注意其中的 proxy_pass 后面跟的地址，这个地址是后端服务的地址。

---

## 项目演进

##### 1. 初始化项目

```
$ npm init vite@latest
Need to install the following packages:
  create-vite@latest
Ok to proceed? (y) y
✔ Project name: … openatp-web
✔ Select a framework: › vue
✔ Select a variant: › vue-ts

Scaffolding project in /Users/xiaosongfu/dev/project/com.github.xiaosongfu/openatp/openatp-web...

Done. Now run:

  cd openatp-web
  npm install
  npm run dev
```

##### 2. 安装 tailwindcss

```
$ pnpm install -D tailwindcss@latest postcss@latest autoprefixer@latest

$ pnpm tailwindcss init -p
Created Tailwind CSS config file: tailwind.config.js
Created PostCSS config file: postcss.config.js
```

参考：https://tailwindcss.com/docs/guides/vue-3-vite
