import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import config from "./config"
import router from './router'
//import i18n from './i18n'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		accessToken: localStorage.getItem('accessToken'),
		collegeInfo: JSON.parse(localStorage.getItem('collegeInfo')) || {},
		abiturientInfo: JSON.parse(localStorage.getItem('abiturientInfo')) || {},
		tipoInfo: JSON.parse(localStorage.getItem('tipoInfo')) || {},
		unresolvedRequestCount: 0,
		alerts:[],
		language: localStorage.getItem('language') || 'ru',
		currentRole: localStorage.getItem('currentRole') || ''
	},

	mutations: {
		login(state, response) {
			state.accessToken = response.headers.authorization;
			localStorage.setItem('accessToken', state.accessToken);
			axios.defaults.headers.common['X-Auth'] = state.accessToken;
		},
		setLanguage(state, lang) {
			localStorage.setItem('language', lang);
			state.language = lang;
			//i18n.locale = lang;
		},
		setCurrentRole(state, role) {
			localStorage.setItem('currentRole', role);
			state.currentRole = role;
		},
		setCollegeInfo(state, data) {
			localStorage.setItem('collegeInfo', JSON.stringify(data));
			state.collegeInfo = data;
		},
		setAbiturientInfo(state, data) {
			localStorage.setItem('abiturientInfo', JSON.stringify(data));
			state.abiturientInfo = data;
		},
		setTipoInfo(state, data) {
			localStorage.setItem('tipoInfo', JSON.stringify(data));
			state.tipoInfo = data;
		},
		alert(state, {alert, adding}) {
            adding ? state.alerts.push(alert)
				: state.alerts.shift()
		},
		logout(state) {
			state.accessToken = '';
			state.collegeInfo = {};
			state.currentRole = '';
			localStorage.removeItem('collegeInfo');
			localStorage.removeItem('abiturientInfo');
			localStorage.removeItem('tipoInfo');
			localStorage.removeItem('currentRole');
			localStorage.removeItem('accessToken');
			delete axios.defaults.headers.common['X-Auth'];
		},
		setUnresolvedRequestCount(state, count) {
			state.unresolvedRequestCount = count;
		}
	},

	actions: {
		changeBaseUrl({getters, state}) {
			axios.defaults.baseURL = getters.getBaseUrl+getters.getApiVersion+(state.currentRole ? '/'+state.language+'/'+state.currentRole : '');
		},
		alertAdd({commit}, alert) {
			commit('alert', { alert, adding: true});
			setTimeout(() => commit('alert', { alert, adding: false }), 5000);
		},
		login({commit}, response) {
			return new Promise((resolve) => {
				commit('login', response);
				resolve();
			})
		},
		async getUnresolvedRequestCount() {
			await axios.get('/request/count?payment_type=2&status_id=1&training_type_id=1&education_form_id=1&declarant_type_id=1&education_type_id=3').then((response) => {
				if(response.data.status == 'success') {
					//commit('setUnresolvedRequestCount', +response.data.data.counter);
					console.log(response);
					return 123;
				}
			});
		},
		logout({state, commit, dispatch}) {
			let user = state.currentRole;

			commit('logout');
			dispatch('changeBaseUrl');
			location.href = '/portal/#/login'+(user ? '/'+user : '')+'?url='+encodeURIComponent(router.history.current.fullPath);
			location.reload(); // TODO
			//router.go('/login'+(user ? '/'+user : ''));
			//router.go('/login'+(user ? '/'+user : '')+'?url='+encodeURIComponent(router.history.current.fullPath));
		}
	},

	getters: {
		getBaseUrl() {
			return config.API_URL;
		},
		getApiVersion() {
			return config.API_VERSION;
		},
		getAccessToken(state) {
			return state.accessToken;
		},
		getCurrentRole(state) {
			return state.currentRole;
		},
		getCollegeInfo(state) {
			return state.collegeInfo;
		},
		getAbiturientInfo(state) {
			return state.abiturientInfo;
		},
		getTipoInfo(state) {
			return state.tipoInfo;
		},
		getLanguage(state) {
			return state.language;
		},
		getUnresolvedRequestCount(state) {
			return state.unresolvedRequestCount;
		}
	}

});