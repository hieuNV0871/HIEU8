require('dotenv').config()



function route(app) {
    app.use((req, res, next) => {
        res.status(404).json({error: 'Not found!'})
    })
    app.use((error, req, res, next) => {
        res.status(error.status || 500).json({error: error.message})
    })
}

module.exports = route