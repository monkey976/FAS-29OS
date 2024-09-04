/** token是否失效
 * 1、比较token时间和设置的时间
 * 2、是否token时间已经超时
 * 3、超时退出登录 */
import { TOKEN_TIME, TOKEN_TIME_VALUE } from './constant'

//登录时设置时间
export const setTokenTime = () => {
  localStorage.setItem(TOKEN_TIME, Date.now())
}

//获取登录时间
export const getTokenTime = () => {
  return localStorage.getItem(TOKEN_TIME)
}

//比较登录时间的时长是否超过系统设置的有效期时间（是否过期）
export const diffTokenTime = () => {
  const currentTime = Date.now() //获取当前时间
  const tokenTime = getTokenTime() //获取登录时间
  return currentTime - tokenTime > TOKEN_TIME_VALUE
}
