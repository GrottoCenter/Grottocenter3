import {combineReducers} from "redux"
import { startSearch, loadCaveSuccess, loadEntrySuccess, showMarker } from './../actions/Search'

const marker = (state = [], action) => {
  switch (action.type) {
    case showMarker().type:// TODO useless mapping > send plain entry object to Map
    return {
          latlng:{
              lat:action.entry.latitude,
              lng:action.entry.longitude
          },
          name:action.entry.name,
          altitude:action.entry.altitude?action.entry.altitude + 'm':'',
          author:action.entry.author.nickname?action.entry.author.nickname:''
    }
    default://TODO no default marker on map
      return {
                latlng:{
                    lat:43.9488581774652,
                    lng:3.68913066801612
                },
                name:"Montméjean (Aven de)"
            }
  }
}

const caves = (state = [], action) => {
  switch (action.type) {
    case 'START_SEARCH':
      return [];
    case 'LOAD_CAVE_SUCCESS':
      return action.data;
    default:
      return state
  }
}
const entries = (state = [], action) => {
  switch (action.type) {
    case 'START_SEARCH':
      return [];
    case 'LOAD_ENTRY_SUCCESS':
      return action.data;
    default:
      return state
  }
}

export const searchReducers = combineReducers({
  caves,
  entries,
  marker
});
export default searchReducers;
