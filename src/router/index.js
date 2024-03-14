import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '../views/login/Auth.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    children: [
      {
        path: ':user',
        name: 'Login',
        component: Auth,
      }
    ],
    name: 'Login',
    component: Auth,
    beforeEnter(to, from, next) {
      if(store.getters.getAccessToken && store.getters.getCurrentRole) {
        next(store.getters.getCurrentRole);
      }
      next();
    }
  },
  {
    path: '/department',
    name: 'department',
    component: () => import('../views/department/DepartmentLayoutView.vue'),
    children: [
      {
        path: 'main',
        alias: '',
        name: 'main',
        component: () => import('../views/department/MainDashboard.vue'),
      },
      {
        path: 'colleges',
        component: () => import('../views/department/CollegeDashboard.vue'),
      },
      {
        path: 'colleges/:bin',
        component: () => import('../views/department/CollegeViewDashboard.vue'),
      },
      {
        path: 'monitoring',
        component: () => import('../views/department/MonitoringDashboard.vue'),
      },
    ],
    beforeEnter(to, from, next) {
      store.dispatch('changeBaseUrl');
      next();
    }
  },

  {
    path: '/college',
    name: 'college',
    component: () => import('../views/college/CollegeView.vue'),
    children: [
      {
        path: 'places',
        alias: '',
        name: 'places',
        component: () => import('../views/college/PlaceListView.vue'),
      },
      {
        path: 'requests/statistics',
        component: () => import('../views/college/OrderRequestsStatisticsView.vue'),
      },
      {
        path: 'requests/undeveloped-places-request',
        name: 'new',
        component: () => import('../views/college/NewRequestUndevelopedPlacesView.vue'),
        // component: () => import('../views/college/NewRequestView.vue'),
      },
      {
        path: 'requests/request-new',
        name: 'new',
        // component: () => import('../views/college/NewRequestUndevelopedPlacesView.vue'),
        component: () => import('../views/college/NewRequestView.vue'),
      },
      {
        path: 'requests/dorm',
        name: 'dorm',
        component: () => import('../views/college/RequestDormSupplyListView.vue'),
      },
      {
        path: 'requests/dorm/:id',
        component: () => import('../views/college/RequestDormSupplyView.vue'),
      },
      {
        path: 'requests/supply',
        name: 'supply',
        component: () => import('../views/college/RequestDormSupplyListView.vue'),
      },
      {
        path: 'requests/supply/:id',
        component: () => import('../views/college/RequestDormSupplyView.vue'),
      },
      {
        path: 'requests/:filter',
        component: () => import('../views/college/OrderRequestsListView.vue'),
      },
      {
        path: 'requests',
        component: () => import('../views/college/OrderRequestsListView.vue'),
      },
      {
        path: 'request/:id',
        component: () => import('../views/college/OrderRequestView.vue'),
      },
      {
        path: 'profile',
        component: () => import('../views/college/ProfileView.vue'),
      },
      {
        path: 'news',
        component: () => import('../views/college/NewsListView.vue')
      },
      {
        path: 'virtual-blogs/:filter',
        component: () => import('../views/college/VirtualBlogsListView.vue')
      },
      {
        path: 'virtual-blogs',
        component: () => import('../views/college/VirtualBlogsListView.vue')
      },
      {
        path: 'occupancy',
        component: () => import('../views/college/OccupancyListView.vue')
      },
      {
        path: 'acs-settings',
        component: () => import('../views/college/AcsSettingsView.vue')
      },
      {
        path: 'rating',
        component: () => import('../views/college/RatingListView.vue')
      },
      {
        path: 'preliminary',
        component: () => import('../views/college/PreliminaryListView.vue')
      },
      {
        path: 'acs-settings',
        component: () => import('../views/college/AcsSettingsView.vue')
      },
    ],
    beforeEnter(to, from, next) {
      store.dispatch('changeBaseUrl');
      next();
    }
  },
  {
    path: '/abiturient',
    name: 'abiturient',
    component: () => import('../views/abiturient/AbiturientLayoutView.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/abiturient/AbiturientHomeView.vue'),
      },
      {
        path: 'my-requests',
        component: () => import('../views/abiturient/MyRequestListView.vue'),
      },
      {
        path: 'my-requests/new',
        component: () => import('../views/abiturient/NewRequestView.vue'),
      },
      {
        path: 'my-requests/:id',
        component: () => import('../views/abiturient/MyRequestView.vue'),
      },
      /*{
        path: 'profile',
        component: () => import('../views/college/ProfileView.vue'),
      },*/
      {
        path: 'virtual-blogs',
        component: () => import('../views/abiturient/MyVirtualBlogsView.vue')
      },
    ],
    beforeEnter(to, from, next) {
      store.dispatch('changeBaseUrl');
      next();
    }
  },
  /*{
    path: '/kindergarten',
    name: 'kindergarten',
    component: () => import('../views/kindergarten/KindergartenLayout.vue'),
    children: [
      {
        path: '',
        name: 'Kindergarten',
        component: () => import('../views/kindergarten/DocRequestList.vue'),
      },
      {
        path: 'doc-request/:id',
        component: () => import('../views/kindergarten/DocRequestView.vue'),
      },
      {
        path: 'groups',
        component: () => import('../views/kindergarten/GroupList.vue'),
      },
      {
        path: 'group/:id',
        component: () => import('../views/kindergarten/GroupView.vue'),
      },
      {
        path: 'vacancy',
        component: () => import('../views/kindergarten/AddVacancy.vue'),
      },
    ],
    beforeEnter(to, from, next) {
      store.dispatch('changeBaseUrl');
      next();
    }
  }*/
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  let user;
  //console.log(to, 1);
  if(to.matched[0]) {
     user = to.matched[0].name;
  }
  if(to.name != 'Login' && !store.getters.getAccessToken) {
    // console.log("/portal/#/login"+(user ? '/'+user : '')+'?url='+encodeURIComponent('/portal/#/'+to.path));
    //console.log(to);
    // store.dispatch('logout', user);

    //location.href = "/portal/#/login"+(user ? '/'+user : '')+(to.path != '/' ? '?url='+encodeURIComponent(to.path) : '');
    location.href = "/portal/#/login"+(user ? '/'+user : '')+'?url='+encodeURIComponent(to.fullPath);
    location.reload(); // TODO
    //next("/login"+(user ? '/'+user : '')+'?url='+encodeURIComponent('/portal/#/'+to.path));
  }
  if(to.path == '/' || (to.name != 'Login' && user != store.getters.getCurrentRole)) {
    next(store.getters.getCurrentRole);
  }
  next();
});

export default router
