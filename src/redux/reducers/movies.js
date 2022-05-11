import { GET_MOVIES } from '../constant'

const initState = []

export default function addReducer(preState = initState, action) {
  const {type, data} = action

  switch(type) {
    case GET_MOVIES:
      return data
    default:
      return preState
  }
}