const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
// const { log } = require('../../middlewares/logger.middleware')
const { query, getSongById} = require('./song.controller')
const router = express.Router()


router.get('/:id', getSongById)
router.get('/search/:term',query)



module.exports = router