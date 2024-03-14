<template>
    <v-app style="background-color: #f9fbfd;">
        <div class="wrapper">
            <div class="main-header">
                <!-- Logo Header -->
                <div class="logo-header" data-background-color="blue">
                    <router-link to="/college" class="logo">
                        <img src="@/assets/images/logoedus_w.png" alt="navbar brand" class="navbar-brand" style="width:64px">
                    </router-link>
                    <button class="navbar-toggler sidenav-toggler ml-auto" type="button" data-toggle="collapse" data-target="collapse" aria-expanded="false" aria-label="Toggle navigation">
                      <span class="navbar-toggler-icon">
                        <i class="icon-menu"></i>
                      </span>
                    </button>
                    <button class="topbar-toggler more"><i class="icon-options-vertical"></i></button>
                    <div class="nav-toggle">
                        <button class="btn btn-toggle toggle-sidebar">
                            <i class="icon-menu"></i>
                        </button>
                    </div>
                </div>
                <!-- End Logo Header -->

                <!-- Navbar Header -->
                <nav class="navbar navbar-header navbar-expand-lg" data-background-color="blue2">

                    <div class="container-fluid">
                        <h3 class="mb-0 white--text">{{ tipoName }}</h3>
                        <!-- <div class="collapse" id="search-nav">
                          <form class="navbar-left navbar-form nav-search mr-md-3">
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <button type="submit" class="btn btn-search pr-1">
                                  <i class="fa fa-search search-icon"></i>
                                </button>
                              </div>
                              <input type="text" placeholder="Search ..." class="form-control">
                            </div>
                          </form>
                        </div>-->
                        <ul class="navbar-nav topbar-nav ml-md-auto align-items-center">
                            <li class="nav-item" v-click-outside="onClickOutsideFade2">
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                                dark text
                                                v-bind="attrs"
                                                v-on="on"
                                        >
                                            {{languages[selectedLanguage]}}
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item
                                                link
                                                v-for="(item, index) in languages"
                                                :key="index"
                                                @click.stop="changeLanguage(index)"
                                        >
                                            <v-list-item-title>{{ item }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </li>
                            <!-- <li class="nav-item dropdown hidden-caret">
                              <a class="nav-link dropdown-toggle" id="messageDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-envelope"></i>
                              </a>
                              <ul class="dropdown-menu messages-notif-box animated fadeIn" aria-labelledby="messageDropdown">
                                <li>
                                  <div class="dropdown-title d-flex justify-content-between align-items-center">
                                    Messages
                                    <a href="#" class="small">Mark all as read</a>
                                  </div>
                                </li>
                                <li>
                                  <div class="message-notif-scroll scrollbar-outer">
                                    <div class="notif-center">
                                      <a href="#">
                                        <div class="notif-img">
                                          <img src="@/assets/images/jm_denis.jpg" alt="Img Profile">
                                        </div>
                                        <div class="notif-content">
                                          <span class="subject">Jimmy Denis</span>
                                          <span class="block">
                                            How are you ?
                                          </span>
                                          <span class="time">5 minutes ago</span>
                                        </div>
                                      </a>
                                      <a href="#">
                                        <div class="notif-img">
                                          <img src="@/assets/images/chadengle.jpg" alt="Img Profile">
                                        </div>
                                        <div class="notif-content">
                                          <span class="subject">Chad</span>
                                          <span class="block">
                                            Ok, Thanks !
                                          </span>
                                          <span class="time">12 minutes ago</span>
                                        </div>
                                      </a>
                                      <a href="#">
                                        <div class="notif-img">
                                          <img src="@/assets/images/mlane.jpg" alt="Img Profile">
                                        </div>
                                        <div class="notif-content">
                                          <span class="subject">Jhon Doe</span>
                                          <span class="block">
                                            Ready for the meeting today...
                                          </span>
                                          <span class="time">12 minutes ago</span>
                                        </div>
                                      </a>
                                      <a href="#">
                                        <div class="notif-img">
                                          <img src="@/assets/images/talha.jpg" alt="Img Profile">
                                        </div>
                                        <div class="notif-content">
                                          <span class="subject">Talha</span>
                                          <span class="block">
                                            Hi, Apa Kabar ?
                                          </span>
                                          <span class="time">17 minutes ago</span>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <a class="see-all" href="javascript:void(0);">See all messages<i class="fa fa-angle-right"></i> </a>
                                </li>
                              </ul>
                            </li> -->
                            <li class="nav-item dropdown hidden-caret" v-click-outside="onClickOutsideFade2">
                                <a @click.stop="fade2 = !fade2" class="nav-link">
                                    <i class="fa fa-bell"></i>
                                    <!-- <span class="notification">4</span> -->
                                </a>

                                <!-- <v-fade-transition>
                                  <ul v-show="fade2" :class="'dropdown-menu notif-box '+(fade2 && 'show')">
                                    <li>
                                      <div class="dropdown-title">You have 4 new notification</div>
                                    </li>
                                    <li>
                                      <div class="notif-scroll scrollbar-outer">
                                        <div class="notif-center">
                                          <a href="#">
                                            <div class="notif-icon notif-primary"> <i class="fa fa-user-plus"></i> </div>
                                            <div class="notif-content">
                                              <span class="block">
                                                New user registered
                                              </span>
                                              <span class="time">5 minutes ago</span>
                                            </div>
                                          </a>
                                          <a href="#">
                                            <div class="notif-icon notif-success"> <i class="fa fa-comment"></i> </div>
                                            <div class="notif-content">
                                              <span class="block">
                                                Rahmad commented on Admin
                                              </span>
                                              <span class="time">12 minutes ago</span>
                                            </div>
                                          </a>
                                          <a href="#">
                                            <div class="notif-img">
                                              <img src="@/assets/images/profile2.jpg" alt="Img Profile">
                                            </div>
                                            <div class="notif-content">
                                              <span class="block">
                                                Reza send messages to you
                                              </span>
                                              <span class="time">12 minutes ago</span>
                                            </div>
                                          </a>
                                          <a href="#">
                                            <div class="notif-icon notif-danger"> <i class="fa fa-heart"></i> </div>
                                            <div class="notif-content">
                                              <span class="block">
                                                Farrah liked Admin
                                              </span>
                                              <span class="time">17 minutes ago</span>
                                            </div>
                                          </a>
                                        </div>
                                      </div>
                                    </li>
                                    <li>
                                      <a class="see-all" href="javascript:void(0);">See all notifications<i class="fa fa-angle-right"></i> </a>
                                    </li>
                                  </ul>
                                </v-fade-transition> -->
                            </li>
                            <li class="nav-item dropdown hidden-caret" @click.stop="logout">
                                <a class="nav-link" role="button">
                                    <i class="fa fas fa-sign-out-alt"></i>
                                    <span style="font-size: 15px; padding-left: 10px; display: inline-block; line-height: 15px; vertical-align: sub;">{{ $t('Выход') }}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <!-- End Navbar -->
            </div>

            <!-- Sidebar -->
            <div class="sidebar sidebar-style-2">
                <div class="sidebar-wrapper scrollbar scrollbar-inner">
                    <div class="sidebar-content">
                        <!-- <div class="user">

                          <div class="avatar-sm float-left mr-2">
                            <img src="@/assets/images/icon_college_users.png" alt="..." class="avatar-img rounded-circle">
                          </div> -->

                        <!-- <div class="info" @click.stop="expand1 = !expand1"> -->
                        <!-- <div class="info">
                          <a>
                            <span class="user-level"> -->
                        <!-- {{ collegeName }} -->
                        <!--<span class="user-level">Administrator</span>-->
                        <!-- <span class="caret"></span> -->
                        <!-- </span>
                      </a>
                      <div class="clearfix"></div> -->

                        <!-- <v-expand-transition>
                        <div v-show="expand1" id="collapseExample">
                          <ul class="nav">
                            <li>
                              <a href="#profile">
                                <span class="link-collapse">Специальности</span>
                              </a>
                            </li>
                            <li>
                              <a href="#edit">
                                <span class="link-collapse">Данные колледжа</span>
                              </a>
                            </li>
                            <li>
                              <a href="#edit">
                                <span class="link-collapse">Контактные данные</span>
                              </a>
                            </li>
                            <li>
                              <a href="#settings">
                                <span class="link-collapse">Новости и события</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </v-expand-transition> -->
                        <!-- </div> -->
                        <!-- </div> -->
                        <ul class="nav nav-primary">
                            <li class="nav-section">
                                <h4 class="text-section">{{ $t('Госзаказ') }}</h4>
                            </li>
                            <li class="nav-item">
                                <router-link to="/department/main">
                                    <i class="fas fa-layer-group"></i>
                                    <p>{{ $t('Общие данные') }}</p>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link to="/department/colleges">
                                    <i class="fas fa-th-list"></i>
                                    <p>{{ $t('Данные по колледжам') }}</p>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link to="/department/monitoring">
                                    <i class="fas fa-desktop"></i>
                                    <p>{{ $t('Мониторинг заявок') }}</p>
                                </router-link>
                            </li>
                            <!--
                            <li class="nav-item">
                              <a data-toggle="collapse" href="#charts">
                                <i class="far fa-chart-bar"></i>
                                <p>Charts</p>
                                <span class="caret"></span>
                              </a>
                              <div class="collapse" id="charts">
                                <ul class="nav nav-collapse">
                                  <li>
                                    <a href="charts/charts.html">
                                      <span class="sub-item">Chart Js</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="charts/sparkline.html">
                                      <span class="sub-item">Sparkline</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </li>
                            <li class="nav-item">
                              <a href="widgets.html">
                                <i class="fas fa-desktop"></i>
                                <p>Widgets</p>
                                <span class="badge badge-success">4</span>
                              </a>
                            </li>
                            <li class="nav-item">
                              <a data-toggle="collapse" href="#submenu">
                                <i class="fas fa-bars"></i>
                                <p>Menu Levels</p>
                                <span class="caret"></span>
                              </a>
                              <div class="collapse" id="submenu">
                                <ul class="nav nav-collapse">
                                  <li>
                                    <a data-toggle="collapse" href="#subnav1">
                                      <span class="sub-item">Level 1</span>
                                      <span class="caret"></span>
                                    </a>
                                    <div class="collapse" id="subnav1">
                                      <ul class="nav nav-collapse subnav">
                                        <li>
                                          <a href="#">
                                            <span class="sub-item">Level 2</span>
                                          </a>
                                        </li>
                                        <li>
                                          <a href="#">
                                            <span class="sub-item">Level 2</span>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <a data-toggle="collapse" href="#subnav2">
                                      <span class="sub-item">Level 1</span>
                                      <span class="caret"></span>
                                    </a>
                                    <div class="collapse" id="subnav2">
                                      <ul class="nav nav-collapse subnav">
                                        <li>
                                          <a href="#">
                                            <span class="sub-item">Level 2</span>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <a href="#">
                                      <span class="sub-item">Level 1</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </li>
                            <li class="mx-4 mt-2">
                              <a href="http://themekita.com/atlantis-bootstrap-dashboard.html" class="btn btn-primary btn-block"><span class="btn-label mr-2"> <i class="fa fa-heart"></i> </span>Buy Pro</a>
                            </li>
                            -->
                        </ul>
                    </div>
                </div>
            </div>
            <!-- End Sidebar -->
            <div class="main-panel">
                <div class="content">
                    <router-view/>
                </div>
            </div>
        </div>
    </v-app>
</template>

<script>
    require('@/assets/css/bootstrap.min.css');
    require('@/assets/css/atlantis.min.css');
    require('@/assets/css/fonts.css');

    export default {
        created() {
            this.getCounts();
        },
        computed: {
            selectedLanguage() {
                return this.$store.getters.getLanguage;
            },
            tipoName() {
                document.title = this.$store.getters.getTipoInfo.tipo_name;
                return this.$store.getters.getTipoInfo.tipo_name;
            }
        },
        data: () => ({
            fade1: false,
            fade2: false,
            expand1: false,
            expand8: false,
            languages: {
                'kk': 'Қазақша',
                'ru': 'Русский'
            },
        }),
        methods: {
            getCounts() {

            },
            onClickOutsideFade2() {
                //this.fade2 = false;
            },
            changeLanguage(lang) {
                this.$store.commit('setLanguage', lang);
                location.reload();
            },
            logout() {
                this.$store.dispatch('logout');
            }
        }
    }
</script>
<style>
    .remove-bg > .v-tabs-bar {
        background-color: transparent !important;
    }
</style>