export let Get = (ctx) => {
  ctx.body = {
    result: 'get',
    para: ctx.query
  }
}
