/**
 * 判断 a 数组中是否包含 b 数组的全部元素
 */

export default function isContained(a,b) {
  if(!(a instanceof Array) || !(b instanceof Array)) return false
  const len = b.length
  if(a.length < len) return false

  // 将 a 数组的 Id 取出来
  const a_id = a.map(item => item._id)
  for(let i = 0; i < len; i++) {
    if(!a_id.includes(b[i])) return false
  }
  return true
}