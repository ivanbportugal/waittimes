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
    currentPark: {
      id: undefined,
      name: undefined
    }
  },
  mutations: {
    'SET_PARK_LIST'(state, parkList) {
      state.parkList = parkList
    },
    'SET_WAIT_TIMES'(state, waitTimes) {
      state.waitTimes = waitTimes
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
      state.currentPark = currentPark;
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
        let params = { parkName: parkId };
        axios.get('/api/waits', { params: params }).then(res => res.data).then(waitTimes => {
          commit('SET_WAIT_TIMES', waitTimes)
        }).catch(err => {
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
    }
  }
})
