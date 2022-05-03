import { GET_CATEGORIES } from "../constant";

const initState = []

export default function addReducer(preState = initState, action) {
  const {type, data} = action
  
  switch(type) {
    case GET_CATEGORIES:
      return data
    default:
      return preState
  }
}