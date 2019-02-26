import KoaRouter from 'koa-router'
import controllers from '../controllers/index.js'

const router = KoaRouter()

router
  .get('/get', controllers.api.Get)

module.exports = router
