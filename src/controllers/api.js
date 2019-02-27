import pool from '../db'

export let getPageInfo = async (ctx) => {
  let pageURL = ctx.query['page']
  if (pageURL === undefined) {
    ctx.body = {
      err: 'page url not found'
    }
    return
  }
  var page = await pool.query(
    // get the number of views for current page
    'select id, view_cnt from pages where url = ?',
    [pageURL])

  ctx.body = {
    page_id: page[0],
    view_cnt: page[1]
  }
}

export let viewPage = async (ctx) => {
  console.log(ctx.request.body)
  ctx.body = ctx.request.body['url']
}
