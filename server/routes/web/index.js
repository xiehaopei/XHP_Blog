module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();

    let {Info, Comment, Counter, Article, Envelope, Myself, Subscribe} = model
    let {time, email, dateFormat, requestResult} = plugin

    router.get('/info', async (req, res) => {
        const info = await Info.findOne()

        let data = null;

        if(info){
            data = {
                cover: info.cover,
                avatar: info.avatar,
                web_seo: info.web_seo,
                web_name: info.web_name,
                web_describe: info.web_describe,
                bg: info.bg,
                
                email: info.email.address,
                email_name: info.email.name,
                email_comment: info.email.comment,
                admin_mark: info.email.mark,
                
                email_subscribe: info.email.subscribe,
            }
        }

        res.send(requestResult(data))
    })

    // Get Article List
    router.get('/article', async (req, res) => {
        const page = req.query.page || 1;

        const result = await Promise.all([
            Article.countDocuments(),
            Article.find({hide:false}).sort({read:-1}).limit(Number(10)).skip(Number(10)*(page-1))
        ])

        result[1].forEach(item => item._doc['time'] = dateFormat(item.time))

        // 列表页 分组
        if(req.query.from){ 
            result[1] = result[1].reduce((total, item)=>{
                const [ , year, date] = /(\d+)\/(\d+)/.exec(item.time.date);                
                total['_'+year] = total['_'+year] || {};
                total['_'+year][date] = total['_'+year][date] || [];
                total['_'+year][date].push(item);
                return total
            }, {})         
        }

        /**
         * 数据
         * 当前页
         * 总页数
         */
        const data = {
            data: result[1],
            page: Number(page),
            totalPage: Math.ceil(result[0] / 10),
        }

        res.send(requestResult(data))
    })

    // Get article
    router.get('/article/:id', async (req, res) => {
        const id = Number(req.params.id)
        const data = await Article.findOneAndUpdate({
            id: id
        }, {
            $inc: { 'read': 1 }
        }, {
            new: true
        })

        if(data){
            data._doc['time'] = dateFormat(data.time)
            res.send(requestResult(data))
        }else{
            res.send(requestResult())
        }
    })

    router.get('/comment/:id', async (req, res) => {
        const id = Number(req.params.id)
        const result = await Comment.find({topic_id: id})

        // 一级评论和子级评论格式转化
        const data = result.reduce((total, item, index, arr) => {    
            item._doc['time'] = dateFormat(item.time)
            if(item.type === 1){
                item._doc['child'] = []
                total.push(item)
            }else{
                total.forEach(i => {
                    if(i.id === item.parent_id){
                        i._doc['child'].push(item)
                    }
                })
            }
            return total
        }, []).reverse()
        
        const total = result.length;
        
        res.send(requestResult({data,total}))
    })
    
    router.post('/comment', async (req, res) => {
        const commentCount = await Counter.findOneAndUpdate({
            name: 'comment'
        }, {
            $inc: { 'count' : 1 }
        }, {
            new: true
        })

        if(commentCount){
            req.body.data.id = commentCount.count;
        }else{
            /**
             * 第一次发表评论
             * 创建自增id字段
             */
            const data = {
                name: 'comment',
                count: 1
            }
            const count = await Counter.create(data)
            req.body.data.id = count.count;
        }

        /**
         * 返回评论数据，页面展示
         */
        const result = await Comment.create(req.body.data)
        if(result.type === 1){
            result._doc['child'] = [];
        }
        result._doc['time'] = dateFormat(result.time)

        res.send(requestResult(result))

        /**
         * 发送邮件通知
         */
        if(req.body.is_email){
            const info = await Info.findOne()
            const data = {
                title: req.body.title,
                url: req.body.url,
                name: req.body.data.reply_name || info.email.name,
                email: req.body.data.reply_email || info.email.address
            }

            // 发送邮件
            const email_info = Object.assign({}, info['email'], {web_name: info['web_name']})
            email(3, data, email_info)            
        }
    })

    // like +1
    router.put('/article_like/:id', async (req, res) => {
        let data = await Article.updateOne({
                '_id': req.params.id
            }, {
                $inc: { 'like': 1 }
            })
        res.send(data)
    })

    router.get('/myself', async (req, res) => {
        const result = await Myself.findOne()
        res.send(requestResult(result))
    })
    
    // 全文检索
    router.post('/article/search',async (req,res)=>{
        const data = await Article.find({$text:{$search:req.body.query}})
        console.log(requestResult(data))
        res.send(requestResult(data))
    })

    app.use('/web/api', router)
}
