// 格式化日期
export default function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  let yyyy = date.getFullYear()
  let mm = date.getMonth() + 1
  let dd = date.getDate()
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()

  // 统一判断
  function addZero(num) {
    if (num >= 0 && num < 10) {
      return '0' + num
    } else {
      return num
    }
  }

  let nowDate = yyyy + '-' + addZero(mm) + '-' + addZero(dd)
  let nowTime = addZero(h) + ':' + addZero(m) + ':' + addZero(s)
  let am_pm 
  if(h > 12) {
    am_pm = 'PM'
  } else {
    am_pm = 'AM'
  }

  return [nowDate, nowTime, am_pm]
}

// 格式化时间
// export const formatTime = () => {
//   let h = date.getHours()
//   let m = date.getMinutes()
//   let s = date.getSeconds()
//     // 统一判断
//   function addZero(num) {
//     if (num >= 0 && num < 10) {
//       return '0' + num
//     } else {
//       return num
//     }
//   }
// }