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
    favoriteRides: {}
  },
  mutations: {
    'SET_PARK_LIST'(state, parkList) {
      state.parkList = parkList
    },
    'SET_WAIT_TIMES'(state, waitTimes) {
      state.waitTimes = waitTimes
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
    loadWaitTimes( {commit, parkId} ) {
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
    }
  }
})
