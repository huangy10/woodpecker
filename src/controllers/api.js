import URL from 'url'

import pool from '../db'
import {ViewCountConfig} from '../config'

function processUrl (url) {
  if (url === undefined) return undefined
  try {
    let _ = new URL.URL(url)
  } catch (e) {
    // not a valid url
    return undefined
  }
  let outputUrl = url
  if (ViewCountConfig.remove_query_param) {
    let i = url.indexOf('?')
    if (i > 0) {
      outputUrl = url.substring(0, i)
    }
  }
  return outputUrl
}

export let getPageInfo = async (ctx) => {
  let pageURL = processUrl(ctx.query['page'])
  console.log('get page info of ' + pageURL)
  if (pageURL === undefined) {
    ctx.body = {
      err: 'page url not found'
    }
    return
  }
  let pageData = await pool.query(
    // get the number of views for current page
    'select id, view_cnt from pages where url = ?',
    [pageURL])

  if (pageData.length === 0) {
    ctx.body = {
      page_id: 0,
      view_cnt: 0
    }
  } else {
    pageData = pageData[0]
    ctx.body = {
      page_id: pageData.id,
      view_cnt: pageData.view_cnt
    }
  }
}

export let viewPage = async (ctx) => {
  let viewingUrl = processUrl(ctx.request.body['url'])
  let pageTitle = ctx.request.body['title'] || 'no title'
  if (viewingUrl === undefined) {
    ctx.body = {
      err: 'Invalid url'
    }
    return
  }
  let rows = await pool.query('select id from pages where url = ?', [viewingUrl])
  let pageId = 0
  if (rows.length === 0) {
    let x = await pool.query('insert into pages(url, title) values (?, ?)', [viewingUrl, pageTitle])
    pageId = x.insertId
    console.log('insert')
  } else {
    pageId = rows[0].id
    console.log('read: ' + pageId)
  }

  await pool.query('start transaction')
  await pool.query('insert into views(src_ip, page_id) values (?, ?)', [ctx.request.ip, pageId])
  await pool.query('update pages set view_cnt = view_cnt + 1 where id = ?', [pageId])
  await pool.query('commit')

  ctx.body = {
    real_url: viewingUrl,
    page_id: pageId
  }
}
