import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

// Used for local data sources only
import sampleParkList from './sampleParkList.json'
import sampleWaitTimes from './sampleWaitTimes.json'

export default new Vuex.Store({
  state: {
    parkList: [],
    waitTimes: [],
    favoriteRides: {},
    isLoading: false,
    currentPark: {
      id: undefined,
      name: undefined
    },
    sortModel: {
      field: undefined,
      asc: true
    }
  },
  mutations: {
    'SET_PARK_LIST'(state, parkList) {
      state.parkList = JSON.parse(JSON.stringify(parkList))
    },
    'SET_WAIT_TIMES'(state, waitTimes) {
      state.waitTimes = [...orderList(waitTimes, state.sortModel)]
    },
    'SET_FAVORITE'(state, params) {
      const parkId = params.parkId;
      const ride = params.ride;
      if (!state.favoriteRides[parkId]) {
        let newPark = {}
        newPark[parkId] = []
        state.favoriteRides = Object.assign({}, state.favoriteRides, newPark)
      }

      // Don't add a ride again
      if (!state.favoriteRides[parkId].some(favRide => favRide.name == ride.name)) { 
        state.favoriteRides[parkId].push(ride);
      }

      state.favoriteRides = Object.assign({}, state.favoriteRides)
    },
    'UNSET_FAVORITE'(state, params) {
      const parkId = params.parkId;
      const ride = params.ride;
      if (state.favoriteRides[parkId]) {
        for(var i = 0; i < state.favoriteRides[parkId].length; i++) {
          if(state.favoriteRides[parkId][i].name === ride.name) {
            state.favoriteRides[parkId].splice(i, 1);
            state.favoriteRides = Object.assign({}, state.favoriteRides)
            break;
          }
        }
      }
    },
    'SET_CURRENT_PARK'(state, currentPark) {
      state.currentPark = Object.assign({}, currentPark)
    },
    'SET_SORT'(state, newSortModel) {
      state.sortModel = Object.assign({}, newSortModel)

      // Also sort the wait times
      state.waitTimes = [...orderList(state.waitTimes, state.sortModel)]
    },
    'SET_LOADING'(state, isLoading) {
      state.isLoading = isLoading
    }
  },
  actions: {
    loadParkList( {commit} ) {
      console.log('Loading Park List for Environment: ' + process.env.NODE_ENV);
      if (process.env.NODE_ENV === 'development') {
        commit('SET_PARK_LIST', sampleParkList)
      } else {
        axios.get('/api/tplist').then(res => res.data).then(parkList => {
          commit('SET_PARK_LIST', parkList)
        }).catch(err => {
          console.log('Could not get park list: ', err)
        })
      }
    },
    loadWaitTimes( {commit}, params ) {
      const parkId = params.park;
      console.log('Loading wait times for parkId ' + parkId);
      if (process.env.NODE_ENV === 'development') {
        commit('SET_WAIT_TIMES', sampleWaitTimes)
      } else {
        commit('IS_LOADING', true)
        let params = { parkName: parkId };
        axios.get('/api/waits', { params: params }).then(res => res.data).then(waitTimes => {
          commit('SET_WAIT_TIMES', waitTimes)
          commit('IS_LOADING', false)
        }).catch(err => {
          commit('IS_LOADING', false)
          console.log('Could not get wait times for park ' + parkId + ': ', err)
        })
      }
    },
    favorite( {commit}, params) {
      commit('SET_FAVORITE', params)
    },
    unFavorite( {commit}, params) {
      commit('UNSET_FAVORITE', params)
    },
    setCurrentPark( {commit}, currentPark) {
      commit('SET_CURRENT_PARK', currentPark)
    },
    setSortModel( {commit}, newSortModel) {
      commit('SET_SORT', newSortModel)
    },
  }
})

function orderList(rideList, sortModel) {
  // Ignore closed rides
  rideList = rideList.filter(ride => ride.status.toLowerCase() !== 'closed')

  // remove quotes
  for (let ride of rideList) {
    if (ride.name) {
      ride.name = ride.name.split('"').join('').trim()
      ride.name = ride.name.charAt(0).toUpperCase() + ride.name.slice(1);
    }
  }
  if (!sortModel.field) {
    return rideList.sort((a, b) => {
      return a.active ? 1 : -1;
    });
  } else {
    if (sortModel.field === 'name') {
      return rideList.sort((a, b) => {
        if (sortModel.asc) {
          return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        } else {
          return (b.name < a.name) ? -1 : (b.name > a.name) ? 1 : 0;
        }
      });
    } else if (sortModel.field === 'waittime') {
      return rideList.sort((a, b) => {
        if (sortModel.asc) {
          return b.waittime - a.waittime
        } else {
          return a.waittime - b.waittime
        }
      });
    }
  }
}