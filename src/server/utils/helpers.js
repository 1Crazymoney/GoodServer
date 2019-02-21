// @flow
import type { $Request, $Response, NextFunction } from 'express'
import logger from '../../imports/pino-logger'
import conf from '../server.config'

/**
 * Make sure to `.catch()` any errors and pass them along to the `next()`
 * middleware in the chain, in this case the error handler.
 * @param {Function} fn
 * @returns {Function}
 */
function wrapAsync(fn: Function) {
  return function(req: $Request & { log: any }, res: $Response, next: NextFunction) {
    const log = req.log.child({ from: 'wrapAsync' })
    fn({ ...req, log: logger }, res, next).catch(error => {
      log.error(error)
      next(error)
    })
  }
}

/**
 * Prevents logging header information when logging
 * @param fn
 * @returns {Function}
 */
function lightLogs(fn: Function) {
  return function(req: $Request, res: $Response, next: NextFunction) {
    fn({ ...req, log: logger }, res, next)
  }
}

/**
 * If in production execute the following middleware
 * @param req
 * @param res
 * @param next
 */
function onlyInProduction(req: $Request, res: $Response, next: NextFunction) {
  if (conf.env === 'production') {
    next()
    return
  }
  res.json({ ok: 1 })
}

export { wrapAsync, onlyInProduction, lightLogs }