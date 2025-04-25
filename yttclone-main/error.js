/**
 * 
 * Our own error handler
 * @param {*} status 
 * @param {*} message 
 * @returns 
 */

export const createError = (status, message) => {
  const err = new Error()
  err.status = status
  err.message = message
  return err

} 