# 项目背景
本项目是一个全栈博客系统，本系统旨在通过后台管理页面轻便地调整前端页面展示内容，以达到简单部署出具有个人特色的博客的效果。

前端页面功能包括文章展示、文章搜索以及背景音乐播放，后台管理功能包括文章发布、文章管理、评论管理、前端页面展示设置。

本项目分为前端博客页面，后台管理页面以及后台系统三个部分，项目采用Nginx + pm2方案实现项目部署，通过pm2使得后台node接口挂起并通过Nginx代理；前端博客页面使用Nuxt.js + Vue.js2.0 ，Nuxt实现SSR服务端渲染开发，优化SEO并提高首页渲染速率，同时实现了页面大小自适应配置，可以在PC、ipad以及移动端看到不同地；后台管理页面使用Vue.js 3.0 + ElementUI Plus；后台系统使用Node.js + express，并使用JWT实现鉴权访问，数据库采用无关系型数据库 MongoDB。