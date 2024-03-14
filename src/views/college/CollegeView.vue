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
                        <h3 class="mb-0 white--text">{{ collegeName }}</h3>
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
                            <li class="nav-item active">
                                <a @click.stop="expand2 = !expand2">
                                    <i class="fas fa-home"></i>
                                    <p>{{ $t('Данные колледжа') }}</p>
                                    <span class="caret"></span>
                                </a>

                                <v-expand-transition>
                                    <div v-show="expand2">
                                        <ul class="nav nav-collapse">
                                            <li>
                                                <router-link to="/college/places">
                                                    <span class="sub-item">{{ $t('Специальности') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/acs-settings">
                                                    <span class="sub-item">{{ $t('Настройка формулы СКБ') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/occupancy">
                                                    <span class="sub-item">{{ $t('Заполняемость мест') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/profile">
                                                    <span class="sub-item">{{ $t('Профиль колледжа') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/news">
                                                    <span class="sub-item">{{ $t('Новости') }}</span>
                                                </router-link>
                                            </li>
                                        </ul>
                                    </div>
                                </v-expand-transition>
                            </li>
                            <li class="nav-section">
                                <span class="sidebar-mini-icon">
                                  <i class="fa fa-ellipsis-h"></i>
                                </span>
                                <h4 class="text-section">{{ $t('Госзаказ') }}</h4>
                            </li>
                            <li class="nav-item">
                                <router-link to="/college/requests/request-new">
                                    <i class="fas fa-plus"></i>
                                    <p>{{ $t('Добавить заявку') }}</p>
                                </router-link>
                            </li>
                            <!-- <li class="nav-item">
                                <router-link to="/college/requests/undeveloped-places-request">
                                    <i class="fas fa-plus"></i>
                                    <p>{{ $t('Неосвоенные места') }}</p>
                                </router-link>
                            </li> -->
                            <li class="nav-item">
                                <a @click.stop="expand3 = !expand3">
                                    <i class="fas fa-layer-group"></i>
                                    <p>{{ $t('Заявки') }}</p>
                                    <span class="caret"></span>
                                </a>
                                <v-expand-transition>
                                    <div v-show="expand3">
                                        <ul class="nav nav-collapse">
                                            <li>
                                                <router-link to="/college/requests/new">
                                                    <span class="sub-item">{{ $t('Новые заявки') }}</span> <span class="badge badge-success" v-if="payment2NewCount">{{payment2NewCount}}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/requests/all">
                                                    <span class="sub-item">{{ $t('Все заявки') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/requests/process">
                                                    <span class="sub-item">{{ $t('В обработке') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/requests/accepted">
                                                    <span class="sub-item">{{ $t('Принятые') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/requests/rejected">
                                                    <span class="sub-item">{{ $t('Отказанные') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/requests/recalled">
                                                    <span class="sub-item">{{ $t('Отозванные') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/requests/wrong">
                                                    <span class="sub-item">{{ $t('Некорректные заявки') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/requests/work">
                                                    <span class="sub-item">{{ $t('Рабочие квалификации') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/requests/statistics">
                                                    <span class="sub-item">{{ $t('Статистика заявок') }}</span>
                                                </router-link>
                                            </li>
                                        </ul>
                                    </div>
                                </v-expand-transition>
                            </li>
                            <li class="nav-item">
                                <a @click.stop="expand8 = !expand8">
                                    <i class="fas fa-clipboard-check"></i>
                                    <p>{{ $t('Экзамены') }}</p>
                                    <span class="caret"></span>
                                </a>
                                <v-expand-transition>
                                    <div v-show="expand8">
                                        <ul class="nav nav-collapse">
                                            <li>
                                                <router-link to="/college/requests/exam">
                                                    <span class="sub-item">{{ $t('Все экзамены') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/requests/examAppoint">
                                                    <span class="sub-item">{{ $t('Назначение экзамена') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/requests/examGrades">
                                                    <span class="sub-item">{{ $t('Выставить оценки экзамена') }}</span>
                                                </router-link>
                                            </li>
                                        </ul>
                                    </div>
                                </v-expand-transition>
                            </li>
                            

                            <li class="nav-item">
                                <a @click.stop="expand4 = !expand4">
                                    <i class="fas fa-th-list"></i>
                                    <p>{{ $t('Ранжирование') }}</p>
                                    <span class="caret"></span>
                                </a>
                                <v-expand-transition>
                                    <div v-show="expand4">
                                        <ul class="nav nav-collapse">
                                            <li>
                                                <router-link to="/college/requests/acs">
                                                    <span class="sub-item">{{ $t('Оценки СКБ') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/preliminary">
                                                    <span class="sub-item">{{ $t('Текущий рейтинг') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/rating">
                                                    <span class="sub-item">{{ $t('Итоги') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span class="sub-item">{{ $t('Экспорт данных') }}</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </v-expand-transition>
                            </li>


                            <li class="nav-section">
              <span class="sidebar-mini-icon">
                <i class="fa fa-ellipsis-h"></i>
              </span>
                                <h4 class="text-section">{{ $t('Госуслуга') }}</h4>
                            </li>
                            <li class="nav-item">
                                <a @click.stop="expand5 = !expand5">
                                    <i class="fas fa-user-graduate"></i>
                                    <p>{{ $t('Прием документов') }}</p>
                                    <span class="caret"></span>
                                </a>
                                <v-expand-transition>
                                    <div v-show="expand5">
                                        <ul class="nav nav-collapse">
                                            <li>
                                                <router-link to="/college/requests/paid">
                                                    <span class="sub-item">{{ $t('Платное обучение') }}</span> <span class="badge badge-success" v-if="payment1NewCount">{{payment1NewCount}}</span>
                                                </router-link>
                                            </li>
<!--                                            <li>-->
<!--                                                <a href="#">-->
<!--                                                    <span class="sub-item">Среднее звено</span>-->
<!--                                                </a>-->
<!--                                            </li>-->
                                            <li>
                                              <router-link to="/college/requests/dorm">
                                                <span class="sub-item">{{ $t('Общежитие') }}</span> <span class="badge badge-success" v-if="dormNewCount">{{dormNewCount}}</span>
                                              </router-link>
                                            </li>
                                            <li>
                                              <router-link to="/college/requests/supply">
                                                <span class="sub-item">{{ $t('Питание') }}</span> <span class="badge badge-success" v-if="supplyNewCount">{{supplyNewCount}}</span>
                                              </router-link>
                                            </li>
                                        </ul>
                                    </div>
                                </v-expand-transition>
                            </li>
                            <li class="nav-item">
                                <a @click.stop="expand6 = !expand6">
                                    <i class="fas fa-rss"></i>
                                    <p>{{ $t('Экспорт') }}</p>
                                    <span class="caret"></span>
                                </a>
                                <v-expand-transition>
                                    <div v-show="expand6">
                                        <ul class="nav nav-collapse">
                                            <!-- <li>
                                              <a href="edus_intg_import.html">
                                                <span class="sub-item">Импорт данных</span>
                                              </a>
                                            </li> -->
                                            <li>
                                                <a href="#">
                                                    <span class="sub-item">{{ $t('Экспорт данных') }}</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </v-expand-transition>
                            </li>
                            <li class="nav-section">
              <span class="sidebar-mini-icon">
                <i class="fa fa-ellipsis-h"></i>
              </span>
                                <h4 class="text-section">{{ $t('Обратная связь') }}</h4>
                            </li>
                            <li class="nav-item">
                                <a @click.stop="expand7 = !expand7">
                                    <i class="fas fa-table"></i>
                                    <p>{{ $t('Виртуальный блог') }}</p>
                                    <span class="caret"></span>
                                </a>
                                <v-expand-transition>
                                    <div v-show="expand7">
                                        <ul class="nav nav-collapse">
                                            <li>
                                                <router-link to="/college/virtual-blogs/new">
                                                    <span class="sub-item">{{ $t('Новые запросы') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <router-link to="/college/virtual-blogs">
                                                    <span class="sub-item">{{ $t('Все обращения') }}</span>
                                                </router-link>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span class="sub-item">{{ $t('Статистика') }}</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </v-expand-transition>
                            </li>
                            <li class="nav-item">
                                <a href="#">
                                    <i class="fas fa-desktop"></i>
                                    <p>{{ $t('Тех. поддержка') }}</p>
                                </a>
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
            <!-- <footer class="footer">
              <div class="container-fluid">
                <nav class="pull-left">
                  <ul class="nav">
                    <li class="nav-item">
                      <a class="nav-link" href="https://edus.kz">
                        Платформа EDUS
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="https://support.edus.kz">
                        Тех.поддержка
                      </a>
                    </li>
                  </ul>
                </nav>
                <div class="copyright ml-auto">
                  2021. Все права защищены
                </div>
              </div>
            </footer> -->
            <!-- <v-app-bar app color="#6A76AB" dark src="https://picsum.photos/1920/1080?random">
              <template v-slot:img="{ props }">
                <v-img
                  v-bind="props"
                  gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
                ></v-img>
              </template>
              <v-container class="py-0 fill-height">
                <v-avatar color="warning lighten-2" size="44" class="mr-10">K</v-avatar>
                <v-toolbar-title>{{ collegeName }}</v-toolbar-title>

                <v-spacer></v-spacer>
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
                <v-btn dark text @click.stop="logout">Выход</v-btn>
              </v-container>
                <template v-slot:extension>
                  <v-container class="">
                  <v-tabs align-with-title dark class="remove-bg">
                    <v-tab :to="'/college/places'">Места</v-tab>
                    <v-tab :to="'/college/profile'">Профиль</v-tab>
                    <v-tab to="/college/">
                      <v-badge
                        color="red"
                        :value="$store.getters.getUnresolvedRequestCout"
                        :content="$store.getters.getUnresolvedRequestCout">
                        Госзаказ
                      </v-badge>
                    </v-tab>
                    <v-tab :to="'/college/kindergarten'">Госуслуга</v-tab>
                  </v-tabs></v-container>
                </template>
            </v-app-bar>

            <v-main class="grey lighten-3">
              <v-container class="py-7">
                <router-view />
              </v-container>
            </v-main> -->
        </div>
    </v-app>
</template>

<script>
    require('@/assets/css/bootstrap.min.css');
    require('@/assets/css/atlantis.min.css');
    require('@/assets/css/fonts.css');

    export default {
        created() {
            //this.$store.dispatch('getUnresolvedRequestCout');

            /* if(!document.getElementById("bootstrap")) {
               let cssFile1 = document.createElement("link");
               cssFile1.setAttribute("rel", "stylesheet");
               cssFile1.setAttribute("type", "text/css");
               cssFile1.setAttribute("href", "/portal/css/bootstrap.min.css");
               cssFile1.setAttribute("id", "bootstrap");
               document.getElementsByTagName("head")[0].appendChild(cssFile1);
             }

             if(!document.getElementById("atlantis")) {
               let cssFile2 = document.createElement("link");
               cssFile2.setAttribute("rel", "stylesheet");
               cssFile2.setAttribute("type", "text/css");
               cssFile2.setAttribute("href", "/portal/css/atlantis.min.css");
               cssFile2.setAttribute("id", "atlantis");
               document.getElementsByTagName("head")[0].appendChild(cssFile2);
             }

             if(!document.getElementById("fonts")) {
               let cssFile3 = document.createElement("link");
               cssFile3.setAttribute("rel", "stylesheet");
               cssFile3.setAttribute("type", "text/css");
               cssFile3.setAttribute("href", "/portal/css/fonts.css");
               cssFile3.setAttribute("id", "fonts");
               document.getElementsByTagName("head")[0].appendChild(cssFile3);
             }*/
            this.getCounts();
        },
        computed: {
            selectedLanguage() {
                return this.$store.getters.getLanguage;
            },
            collegeName() {
                document.title = this.$store.getters.getCollegeInfo.college_name;
                return this.$store.getters.getCollegeInfo.college_name;
            }
        },
        data: () => ({
            fade1: false,
            fade2: false,
            expand1: false,
            expand2: false,
            expand3: false,
            expand4: false,
            expand5: true,
            expand6: false,
            expand7: false,
            expand8: false,
            languages: {
                'kk': 'Қазақша',
                'ru': 'Русский'
            },
            payment2NewCount: 0,
            payment1NewCount: 0,
            dormNewCount: 0,
            supplyNewCount: 0,
        }),
        methods: {
            getCounts() {
                this.$http.get('/request/counts?payment_type=2&status_id=1').then((response) => {
                    this.payment2NewCount = +response.data.data.request.total;
                });
                this.$http.get('/request/counts?payment_type=1&status_id=1').then((response) => {
                    this.payment1NewCount = +response.data.data.request.total;
                });
                this.$http.get('/request/counts/dorm').then((response) => {
                    this.dormNewCount = +response.data.data.request.total;
                });
                this.$http.get('/request/counts/supply').then((response) => {
                    this.supplyNewCount = +response.data.data.request.total;
                });
            },
            onClickOutsideFade2() {
                this.fade2 = false;
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
    .nav-item a i {
      margin-top: -4px;
    }
</style>