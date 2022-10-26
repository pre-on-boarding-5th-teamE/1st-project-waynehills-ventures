const asyncWrap = async(controller) => {
    return (req, res, next) => {
        controller(req, res, next).catch(next)
    }
}

const globalErrorHandler = async(err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message:err.message })
}

module.exports = {
    asyncWrap,
    globalErrorHandler
}