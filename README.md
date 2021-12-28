## 1. 前言

由于网络技术的发展十分迅速，越来越多的人们将获取信息的方式转变为依靠网络获取，网络信息化已经深入到人们平常的生活和学习之中。尤其是 Web 2.0 时代的到来，越来越多的人渴望在网络上获取更多的信息和资源来充实自己，同时渴望能够将自己生活中的见闻以及感想通过网络分享给他人。因此，博客可以作为信息传递和交流的平台便应运而生并且得到了飞速发展。一个常规的博客往往包含了文章、图片、留言和评论等功能，也有的博客会包含网站的链接以及其它与主题相关的内容。用户可以浏览别人的博客去寻找自己感兴趣的信息，同时也可以编写自己的博客并发布供他人阅读。在博客平台上还可以给作者留言，并针对文章进行评论，发表自己的看法和建议，从而实现了作者与浏览者之间直接的沟通、交流与相互学习。通过博客这种方式，不仅仅可以浏览到自己感兴趣的内容还可以将自己掌握的信息分享给别人，同时和他人进行交流与互动。博客这种沟通方式比传统的电子邮件也方便了许多，因此越来越多的家庭、公司和部门使用博客进行沟通。博客已经发展成为社会网络媒体重要的一部分。当前，我国的市场经济发展已高度繁荣，人们的生活水平也大有提高，越来越多的人直接通过购买的方式使用一些大型网站提供的博客系统，比如 wordpress，pivotx，PJ-Blog，fcontex，EMLOG 等。这些大型的博客系统功能丰富，稳定性高，知名度也高。但是有些系统比较笨重，需要动手搭建，并且配置较复杂，学习成本太高，并不太符合所有人的理想期望。甚至它们已经不再符合互联网推崇个性发展的理念。因此，很多人希望能拥有自己的个人博客系统，并且具有页面交互设计良好、数据存储简单、系统框架轻量级以及学习成本较低等特点。

鉴于此，本文便设计与实现了基于 Web 前端组件化的个人全栈博客系统，旨在通过后台管理页面轻便地调整前端页面展示内容，以达到简单部署出具有个人特色的博客的效果，同时解决了传统博客存在的一些问题。本系统使用了 Web 前端框架Vue.js，不仅轻量级，开发效率高，并且页面渲染速度快，交互效果友好，同时还强调了 Web 前端组件化的思想。系统在服务器部分使用了 Node.js进行开发，JavaScript作为前后端的统一开发语言  。Node.js 作为服务器开发环境，非常稳定和高效并能保证系统在服务器的业务逻辑处理中能够响应快速并易于扩展。数据库采用了用面向文档的非关系型数据库 MongoDB，基于文档的数据存储不仅带来了存储上的高效还带来了对数据进行建模的极大的灵活性。

前端页面功能包括文章展示、文章搜索以及背景音乐播放，后台管理功能包括文章发布、文章管理、评论管理、前端页面展示设置。

<a href="http://42.194.187.106/">项目在线预览地址</a>

 

## 2. 技术综述

系统按照功能逻辑被分为前端博客页面，后台管理页面以及后台系统三个部分，项目采用Nginx + pm2方案实现项目部署，通过pm2使得后台node接口挂起并通过Nginx代理；前端博客页面使用Nuxt.js + Vue.js2.0 ，Nuxt实现SSR服务端渲染开发，优化SEO并提高首页渲染速率，同时实现了页面大小自适应配置，可以在PC、ipad以及移动端看到不同地；后台管理页面使用Vue.js 3.0 + ElementUI Plus；后台系统使用Node.js + express，并使用JWT实现鉴权访问，数据库采用无关系型数据库 MongoDB。

前台功能主要包括用户信息、博客内容以及博客评论。后台功能主要是对前台展示内容的管理，包括用户个人信息资料的变更、对博客内容的管理、对博客文章的评论的管理以及Markdown文章撰写。



## 3. 技术解决方案

本项目主要以Vue框架作为基础进行开发工作，Vue框架当前市场上流行使用2.0以及3.0版本；Vue3.0相对于Vue2.0版本项目体积更小、运行速度更快、项目结构更为清晰便于维护，但是相对的，由于Vue3.0诞生不久，所以市面上与其配套的项目解决方案不够成熟，生态没有Vue2.0那般完善，在于其他的技术配合使用时容易出现bug。由于前端页面选择使用Nuxt.js来实现服务，而Nuxt.js当前并没有与Vue3.0配套的版本，若选用Vue3.0与Nuxt.js配合，将会伴生许多不兼容的错误，稳定性差，开发难度增大，所以改用Vue2.0 + Nuxt.js 作为前端页面基础框架；而后台管理页面对于SEO优化没有需求，故不需要采用Nuxt.js，可直接选用Vue3.0以及与之配套的ElementUI Plus框架；后台系统采用node.js作为编写语言，配合express框架，通过中间件开发模式实现node模块的封装和拓展，从而实现高性能的web接口服务，同时采用MongoDB作为数据库，相比于常用的MySQL数据库，尽管MongoDB占用较大的存储空间，但是却能够更简单地实现高性能的索引字段查询，可以支持文章搜索功能的实现。

## 4. 系统开发实践

### 4.1 前端页面

前端页面包括首页页面，搜索页面，文章列表页面、关于信息页面。

[![TsRM9O.md.jpg](https://s4.ax1x.com/2021/12/28/TsRM9O.md.jpg)](https://imgtu.com/i/TsRM9O) 

<center>图4.1.1 前端首页1 欢迎页</center>


[![TsRmAx.md.jpg](https://s4.ax1x.com/2021/12/28/TsRmAx.md.jpg)](https://imgtu.com/i/TsRmAx) 

<center>图4.1.2 前端首页2 文章列表</center>


[![TsRu4K.md.jpg](https://s4.ax1x.com/2021/12/28/TsRu4K.md.jpg)](https://imgtu.com/i/TsRu4K) 

<center>图4.1.3 文章内容页面</center>


 [![TsRZH1.md.jpg](https://s4.ax1x.com/2021/12/28/TsRZH1.md.jpg)](https://imgtu.com/i/TsRZH1)

<center>图4.1.4 页面中转</center>


[![TsRnN6.md.jpg](https://s4.ax1x.com/2021/12/28/TsRnN6.md.jpg)](https://imgtu.com/i/TsRnN6) 

<center>图4.1.5 文章搜索页面</center>


[![TsRQ3D.md.jpg](https://s4.ax1x.com/2021/12/28/TsRQ3D.md.jpg)](https://imgtu.com/i/TsRQ3D) 

<center>图4.1.6 关于信息页面</center>

 

### 4.2 后台管理页面

后台页面包括登录页面、文章管理页面、Markdown文章编辑发布、评论管理、个人信息编辑以及网站信息设置。

 [![TsRlge.md.jpg](https://s4.ax1x.com/2021/12/28/TsRlge.md.jpg)](https://imgtu.com/i/TsRlge)

<center>图4.2.1 登录页面</center>


[![TsR1jH.md.jpg](https://s4.ax1x.com/2021/12/28/TsR1jH.md.jpg)](https://imgtu.com/i/TsR1jH) 

<center>图4.2.2 文章管理页面</center>


 [![TsR8ud.md.jpg](https://s4.ax1x.com/2021/12/28/TsR8ud.md.jpg)](https://imgtu.com/i/TsR8ud)

<center>图4.2.3 Markdown文章编辑发布</center>


[![TsRGDA.md.jpg](https://s4.ax1x.com/2021/12/28/TsRGDA.md.jpg)](https://imgtu.com/i/TsRGDA) 

<center>图4.2.4 评论管理</center>


[![TsRJHI.md.jpg](https://s4.ax1x.com/2021/12/28/TsRJHI.md.jpg)](https://imgtu.com/i/TsRJHI)

<center>图4.2.5 个人信息页管理</center>


[![TsRtEt.md.jpg](https://s4.ax1x.com/2021/12/28/TsRtEt.md.jpg)](https://imgtu.com/i/TsRtEt) 

<center>图4.2.6 网站信息设置1</center>


 [![TsRNUP.md.jpg](https://s4.ax1x.com/2021/12/28/TsRNUP.md.jpg)](https://imgtu.com/i/TsRNUP)

<center>图4.2.7 网站信息设置2</center>


## 5. 写在最后

本项目前端布局参考<a href="https://isujin.com/">素锦</a>，并在此基础上进行改造，初衷是能够尽可能地通过后台管理来前端展示内容进行系统性的管理，实现自定义化博客，后续有时间将对项目部署方式进行优化，以实现更加简便的博客部署。

如果您觉得该项目不错或对您有所帮助，请给我的<a href="https://github.com/xiehaopei/XHP_Blog">github项目</a>点个star:sparkles:您的支持就是对我最大的认可💪

