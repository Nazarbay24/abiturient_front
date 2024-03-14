<template>
	<div>
		<div class="footer-middle" :style="{ backgroundImage: 'url(' + require('@/assets/images/call-bg.png') + ')' }"> 
			<div class="container">
				<div class="row">
					<div class="col-lg-4 col-md-6 col-sm-12">
						<div class="widget widgets-company-info">
							<div class="footer-bottom-logo pb-40">
								<img src="@/assets/images/logoedus_w.png" alt="EDUS" style="width:90px">
								<br>{{ $t('Образовательная платформа') }}
							</div>
							<div class="company-info-desc">
								<p>{{ $t('Образовательная платформа АИС EDUS «Электронный колледж» автоматизирует процессы обучения учебных заведений ТиПО РК.') }}</p>
							</div>
							<div class="follow-company-info pt-3">
								<div class="follow-company-text mr-3">
									{{ $t('Следите за нами') }}
								</div>
								<div class="follow-company-icon">
									<a href="#"><i class="fa fa-facebook fa-lg"></i></a>
									<a href="#"><i class="fa fa-twitter fa-lg"></i></a>
									<a href="#"><i class="fa fa-instagram fa-lg"></i></a>
									<a href="#"><i class="fa fa-youtube fa-lg"></i></a>
									<!-- TODO -->
								</div>
							</div>
						</div>					
					</div>
					<div class="col-lg-4 col-md-6 col-sm-12">
						<div class="widget widget-nav-menu">
							<h4 class="widget-title pb-4">{{ $t('Наши сервисы') }}</h4>
							<div class="menu-quick-link-container ml-4">
								<ul id="menu-quick-link" class="menu">
									<li><a href="https://college.edu.kz" target="_blank">{{ $t('Электронный колледж') }}</a></li>
									<li><a href="https://mektep.edu.kz" target="_blank">{{ $t('Электронная школа') }}</a></li>
									<li><a href="https://balahi.edus.kz" target="_blank">{{ $t('Электронный детсад') }}</a></li>
									<li><a href="https://ok.edus.kz" target="_blank">{{ $t('Дистанционное обучение') }}</a></li>
									<li><a href="https://dl.edus.kz" target="_blank">{{ $t('Онлайн-тестирование') }}</a></li>
								</ul>
							</div>
						</div>
					</div>	
					<div class="col-lg-4 col-md-6 col-sm-12">
						<div class="widget widgets-company-info">
							<h3 class="widget-title pb-4">{{ $t('Приложения') }}</h3>
							<div class="company-info-desc">
								<p>{{ $t('Вы можете установить мобильное приложения для абитуриентов') }}</p>
							</div>	

							<div>
								<p>
									<a href="https://play.google.com/store/apps/details?id=kz.edus.abiturient" target="_blank">
										<img src="@/assets/images/ico_mobile_android.png" style="width:110px" class="mr-1"> 
									</a>
									<a href="https://play.google.com/store/apps/details?id=kz.edus.college" target="_blank">
										<img src="@/assets/images/ico_mobile_ios.png" style="width:110px" class="mr-1"> 
									</a>
									<img src="@/assets/images/ico_mobile_huawei.png" style="width:110px" class="mr-1">
								</p>
							</div>
						</div>					
					</div>
				</div>
				<div class="row footer-bottom mt-70 pt-3 pb-1">
					<div class="col-lg-6 col-md-6">
						<div class="footer-bottom-content">
							<div class="footer-bottom-content-copy">
								<p>©2022 EDUS.All Rights Reserved. </p>
							</div>
						</div>
					</div>
					<div class="col-lg-6 col-md-6">
						<div class="footer-bottom-right">
							<div class="footer-bottom-right-text">
								<a class="absod" href="/privacy">{{ $t('Политика') }}</a>
								<a href="#">{{ $t('Пользовательское соглашение') }}</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

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

	a {
		color: #007bff;
		text-decoration: none;
		background-color: transparent;
	}
	/*====================================================
--<	Techno Footer Middle Area Css -->
======================================================*/

.footer-middle {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    background: #111a3a;
    background: #2e438b;
	color: #dfdfdf;
	padding-top: 80px;
}
.widget-title {
    color: #fff;
    font-size: 22px;
}
.company-info-desc p {
    color: #fff;
}
.menu-quick-link-container ul li a {
    color: #fff;
	position:relative;
	transition:.5s;
}
.menu-quick-link-container ul li a:before {
    position: absolute;
    content: "";
    left: -24px;
    top: 10px;
    height: 1px;
    width: 13px;
    background: #fff;
}
.menu-quick-link-container ul li {
    padding-bottom: 10px;
    list-style: none;
}
.follow-company-text a {
    font-size: 16px;
    transition: .5s;
}
.follow-company-text a p {
    color:#fff;
	transition:.5s;
}
.follow-company-text {
    float: left;
}
.follow-company-icon a {
    font-size: 16px;
    color: #fff;
    margin: 0 5px;
    font-weight: 500;
    display: inline-block;
    transition: .5s;
}
.follow-company-icon a:hover{
	color:#0c5adb;
}
.follow-company-text a p:hover {
    color:#0c5adb;
}
.menu-quick-link-container ul li a:hover{
	color:#0c5adb;
}

/*====================================================
--<	Techno Footer Bottom Area Css -->
======================================================*/
.footer-bottom {
	border-top: 1px solid rgba(255,255,255,.23);
}
.footer-bottom-logo {
	padding-bottom: 40px;
}
.footer-bottom-content-copy p {
    color: #fff;
}
.footer-bottom-right-text {
	text-align: right;
}
.footer-bottom-right-text a {
	color: #fff;
	display: inline-block;
}
.footer-bottom-right-text .absod {
	margin-right: 30px;
	position: relative;
}
.footer-bottom-right-text .absod::before {
	position: absolute;
	content: "";
	right: -17px;
	top: 6px;
	height: 14px;
	width: 1px;
	background: #fff;
	transform: skew(-20deg);
}
</style>