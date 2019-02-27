import path from 'path'
import Koa2 from 'koa'
import KoaStatic from 'koa-static2'
import KoaBody from 'koa-body'
import MainRoutes from './routes/main-routes'
import {
  System as SystemConfig
} from './config'

const app = new Koa2()
const env = process.env.NODE_ENV || 'development'

app
  .use((ctx, next) => {
    if (ctx.request.header.host.split(':')[0] === 'localhost' || ctx.request.header.host.split(':')[0] === '127.0.0.1') {
      ctx.set('Access-Control-Allow-Origin', '*')
    } else {
      ctx.set('Access-Control-Allow-Origin', SystemConfig.HTTP_server_host)
    }
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT')
    ctx.set('Access-Control-Allow-Credentials', true)
    return next()
  })
  .use(KoaBody({
    multipart: false,
    json: true,
    jsonStrict: true,
    strict: true
  }))
  .use(KoaStatic('statics', path.resolve(__dirname, '../statics')))
  .use(MainRoutes.routes())
  .use(MainRoutes.allowedMethods)

if (env === 'development') {
  app.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  })
}

app.listen(SystemConfig.API_server_port)
console.log('Now start API server on port ' + SystemConfig.API_server_port)

export default app
