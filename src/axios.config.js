import axios from 'axios'
import store from './store'

store.dispatch('changeBaseUrl');

if (store.getters.getAccessToken) {
	axios.defaults.headers.common['X-Auth'] = store.getters.getAccessToken
}

axios.interceptors.response.use((response) => {
	return response;
}, function (error) {
	store.dispatch('alertAdd', {text: error.response.data.message, type:'error'});
	if (error.response.status === 401) {
		store.dispatch('logout');
	}
	return Promise.reject(error);
});