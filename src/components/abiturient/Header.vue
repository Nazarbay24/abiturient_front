<template>
	<div>
		<div class="header_top_menu bg_color">
			<v-container>
				<v-row>
					<v-col class="col-lg-8 col-sm-8">
						<div class="header_top_menu_address">
							<div class="header_top_menu_address_inner">
								<ul>
									<li><a href="https://support.edus.kz"><v-icon>mdi-email-outline</v-icon> support@edus.kz</a></li>
									<li><a href="#"><v-icon>mdi-map-marker</v-icon> {{ $t('Выбор региона') }}</a></li>
									<!--<li><a href="#"><i class="fa fa-phone"></i>+ (1800) 456 7890</a></li>-->
								</ul>
							</div>
						</div>
					</v-col>
					<v-col class="col-lg-4 col-sm-4">
						<div class="header_top_menu_icon">
							<div class="header_top_menu_icon_inner">
								<ul>
									<li v-for="(item, index) in languages" :key="index" @click.stop="changeLanguage(index)">
										<a :class="index == selectedLanguage && 'active'">{{ item }}</a>
									</li>
								</ul>
							</div>
						</div>
					</v-col>
				</v-row>
			</v-container>
		</div>
		<div id="sticky-header" :class="'techno_nav_manu d-md-none d-lg-block d-sm-none d-none '+(stickyHeader && 'sticky')">
			<v-container>
				<v-row>
					<v-col class="col-md-3">
						<div class="logo">
							<a class="logo_img" href="/" title="EDUS">
								<img src="@/assets/images/logo_edus.png" alt="">
								<p>{{ $t('Абитуриент') }} <!--<span class="text-primary">2021</span>--></p>
							</a>
							<a class="main_sticky" href="/" title="EDUS">
								<!--<img src="assets/images/logoedus_w.png" alt="astute" />-->
								<h4>{{ $t('Абитуриент') }} <span class="orange--text text--lighten-2">2022</span></h4>
							</a>
						</div>
					</v-col>
					<v-col class="col-md-9">
						<nav class="techno_menu">
							<ul class="nav_scroll" v-if="!$store.getters.getAccessToken">
								<li><a href="/colleges">{{ $t('Колледжи') }}</a></li>
								<li><a href="/qualification">{{ $t('Специальности') }}</a></li>
								<li><a href="/news">{{ $t('Информация') }}</a></li>
								<li><a href="/edus-faq">{{ $t('Вопрос-ответ') }}</a></li>
							</ul>
							<ul class="nav_scroll" v-else>
								<li><router-link to="/abiturient">{{ $t('Главная') }}</router-link></li>
								<li><router-link to="/abiturient/my-requests">{{ $t('Мои заявки') }}</router-link></li>
								<li><router-link to="/abiturient/virtual-blogs">{{ $t('Виртуальный блог') }}</router-link></li>
								<li><router-link to="/abiturient">{{ $t('Профиль') }}</router-link></li>
							</ul>
							<div class="donate-btn-header" v-if="$store.getters.getAccessToken" @click.stop="logout">
								<a class="dtbtn">{{ $t('Выход') }}</a>
							</div>
						</nav>
					</v-col>
				</v-row>
			</v-container>
		</div>
	</div>
</template>

<script>
	export default {
		mounted() {
			window.document.onscroll = () => {
				let navBar = document.getElementById('sticky-header');
				if(navBar) {
					if(window.scrollY > navBar.offsetTop){
						this.stickyHeader = true;
					} else {
						this.stickyHeader = false;
					}
				}
			}
		},
		computed: {
			selectedLanguage() {
				return this.$store.getters.getLanguage;
			}
		},
		data: () => ({
			stickyHeader: false,
			languages: {
				'kk': 'Қазақша',
				'ru': 'Русский'
			}
		}),
		methods: {
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

<style type="text/css" scoped>
	@media (min-width: 1904px) {
		.container {
			max-width: 1140px !important;
		}
	}
	ul {
		margin: 0;
		padding: 0;
	}
	.bg_color {
		background: #0c5adb;
	}
	a {
		color: #007bff;
		text-decoration: none;
		background-color: transparent;
	}
	.header_top_menu_address_inner ul {
		list-style: none;
	}
	.header_top_menu_address_inner ul li {
		display: inline-block;
	}
	.header_top_menu_icon_inner ul {
		list-style: none;
		text-align:right;
	}
	.header_top_menu_icon_inner ul li {
		display: inline-block;
	}
	.header_top_menu_address_inner ul li a i {
		font-size: 16px;
		margin-right: 10px;
		color: #fff;
	}
	.header_top_menu_address_inner ul li a {
		color: #fff;
		font-size: 14px;
		font-weight: 400;
		margin-right:15px;
	}
	
	.header_top_menu_icon_inner ul li a {
		color: #fff;
		font-size: 14px;
		font-weight: 400;
		margin:0 5px;
	}
	.header_top_menu_icon_inner ul li a:hover,
	.header_top_menu_address_inner ul li a:hover, 
	.header_top_menu_icon_inner ul li a.active {
		color: #ffcb00;
	}


.techno_nav_manu {
	background: #fff;
	transition: .5s;
	margin-bottom: 0;
	z-index: 200;
	position: relative;
}
.techno_nav_manu.transparent_menu {
	background: transparent;
	margin-bottom: -87px;
	position: relative;
}
.sticky {
	left: 0;
	margin: auto;
	position: fixed !important;
	top: 0;
	width: 100%;
	-webkit-box-shadow: 0 2px 5px -2px rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 5px -2px rgba(0, 0, 0, 0.1);
	/*background: #00247e !important;*/
	background: #0c5adb !important;
	transition:.5s;
}

/* logo Css*/
.logo {
 
}
.logo img {
	padding: 15px 0px 0 0;
	width: 90px;
	position: relative;
	float: left;
	margin: 0px 15px 0 0;
}
.logo p {
	padding: 5px 0 0 0;
	color: #000;
	/*
	padding: 2px 0 0 0;
	color: #000;
	font-size: 24px;
	font-weight: 700;
	letter-spacing: -0.5px;	
	*/
	font-size: 28px;
	font-weight: 700;

	
}
 
/* techno Menu Css*/
.techno_menu {
	text-align: right;
}
.techno_menu ul {
	text-align: right;
	list-style: none;
	display: inline-block;
}
.techno_menu>ul>li {
 display: inline-block;
 position: relative;
}
.techno_menu > ul > li > a {
	display: block;
	-webkit-transition: .5s;
	-o-transition: .5s;
	transition: .5s;
	position: relative;
	color: #232323;
	font-weight: 400;
	margin: 19px 10px;
	font-size: 16px;
}
.techno_menu > ul > li > a:hover {
	color:#0c5adb;
	text-decoration:underline;
}
.white .techno_menu > ul > li > a {
	color: #fff;
}
.techno_menu ul li:last-child a {
 margin-right: 0px;
}
.techno_menu>ul>li.current>a {
 color: #00247E;
}
.white .techno_menu>ul>li.current>a {
 color: #fff;
}
/* sub menu style */
.techno_menu ul .sub-menu {
	position: absolute;
	left: 0;
	top: 130%;
	width: 217px;
	text-align: left;
	background: #fff;
	margin: 0;
	z-index: 1;
	-webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
	box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
	-webkit-transition: .5s;
	-o-transition: .5s;
	transition: .5s;
	opacity: 0;
	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
	visibility: hidden;
	border-top: 2px solid #0c5adb;
}
.techno_menu ul li:hover>.sub-menu {
	opacity: 1;
	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
	visibility: visible;
	top: 100%;
	z-index: 9;
}
.techno_menu ul .sub-menu li {
	position: relative;
}
.techno_menu ul .sub-menu li a {
	display: block;
	padding: 12px 20px;
	margin: 0;
	line-height: 1.3;
	letter-spacing: normal;
	font-size: 15px;
	font-weight: 500;
	text-transform: capitalize;
	-webkit-transition: .1s;
	-o-transition: .1s;
	transition: .1s;
	visibility: inherit !important;
	color: #333 !important;
}
.techno_menu ul .sub-menu li:hover>a,
.techno_menu ul .sub-menu .sub-menu li:hover>a,
.techno_menu ul .sub-menu .sub-menu .sub-menu li:hover>a,
.techno_menu ul .sub-menu .sub-menu .sub-menu .sub-menu li:hover>a {
 background:#0c5adb;
 color: #fff !important;
}

/* sub menu 2 */
.techno_menu ul .sub-menu .sub-menu {
 left: 100%;
 top: 130%;
 opacity: 0;
 -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
 visibility: hidden;
}
.techno_menu ul .sub-menu li:hover>.sub-menu {
 opacity: 1;
 -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
 visibility: visible;
 top: 0%;
}

/* sub menu 3 */
.techno_menu ul .sub-menu .sub-menu li {
 position: relative;
}
.techno_menu ul .sub-menu .sub-menu .sub-menu {
 right: 100%;
 left: auto;
 top: 130%;
 opacity: 0;
 -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
 visibility: hidden;
}
.techno_menu ul .sub-menu .sub-menu li:hover>.sub-menu {
 opacity: 1;
 -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
 visibility: visible;
 top: 0%;
}

/* sub menu 4 */
.techno_menu ul .sub-menu .sub-menu .sub-menu li {
 position: relative;
}
.techno_menu ul .sub-menu .sub-menu .sub-menu .sub-menu {
}
.techno_menu ul .sub-menu .sub-menu .sub-menu li:hover>.sub-menu {
 opacity: 1;
 -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
 visibility: visible;
 top: 0%;
}

.donate-btn-header {
	display: inline-block;
	margin-left: 16px;
}
a.dtbtn {
	-moz-user-select: none;
	background: #0c5adb;
	border: medium none;
	color: #fff;
	cursor: pointer;
	display: inline-block;
	font-size: 17px;
	margin-bottom: 0;
	padding: 10px 30px;
	text-align: center;
	/*text-transform: capitalize;*/
	-webkit-transition: all 0.3s ease 0s;
	-o-transition: all 0.3s ease 0s;
	transition: all 0.3s ease 0s;
	vertical-align: middle;
	border-radius: 5px;
	border: 2px solid #0c5adb;
	font-weight: 600;
}
a.dtbtn:hover {
	border: 2px solid #00247E;
	background: #00247E;
	color: #fff;
}
.techno_menu li a:hover:before{
	width:101%;
}
.techno_nav_manu.sticky .logo_img {
	display: none;
}
.main_sticky {
	display: none;
}
.techno_nav_manu.sticky .main_sticky {
	display: inherit;
}
.techno_nav_manu.sticky .main_sticky {
	font-size: 24px;
	color: #fff;
	margin-top: 10px;
}
.techno_nav_manu.sticky .techno_menu li a {
	color: #fff;
}
.techno_nav_manu.sticky a.dtbtn {
	color: #0c5adb;
	background:#fff;
	border: 2px solid #fff;
}
.techno_nav_manu.sticky a.dtbtn:hover {
	color: #0c5adb;
	background:#e5e5e5;
	border: 2px solid #e5e5e5;
}

	/*====================================================
	--<	Techno Header Top Menu Area Css -->
	======================================================*/
	.header_top_menu_address_inner ul {
		list-style: none;
	}
	.header_top_menu_address_inner ul li {
		display: inline-block;
	}
	.header_top_menu_icon_inner ul {
		list-style: none;
		text-align:right;
	}
	.header_top_menu_icon_inner ul li {
		display: inline-block;
	}
	.header_top_menu_address_inner ul li a i {
		font-size: 16px;
		margin-right: 10px;
		color: #fff;
	}
	.header_top_menu_address_inner ul li a {
		color: #fff;
		font-size: 14px;
		font-weight: 400;
		margin-right:15px;
	}
	.header_top_menu_icon_inner ul li a{
		color: #fff;
		font-size: 14px;
		font-weight: 400;
		margin:0 5px;
	}
	.header_top_menu_icon_inner ul li a:hover,
	.header_top_menu_address_inner ul li a:hover {
		color: #ffcb00;
	}
</style>