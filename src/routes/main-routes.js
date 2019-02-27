import KoaRouter from 'koa-router'
import controllers from '../controllers/index.js'

const router = KoaRouter()

router
  .get('/page', controllers.api.getPageInfo)
  .post('/view', controllers.api.viewPage)

module.exports = router
