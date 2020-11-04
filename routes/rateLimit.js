const RateLimit = require('express-rate-limit');

exports.apiLimiter = new RateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1,
    handler(req, res){
        res.status(this.statusCode).json({
            code: this.statusCode,
            meassage: '10분에 한 번만 요청할 수 있습니다.'
        })
    }
})

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.'
    })
}