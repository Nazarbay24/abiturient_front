<template>
	<v-app>
		<Header />
		<div class="login-block">
			<div class="container" lg>
				<div class="row">
					<div class="col-lg-12">
						<h1 v-html="$t('sign_as_'+loginType)"></h1>

						<div class="row">
							<div class="col-lg-8">
								<div class="text-center" style="margin-top: 20px;">
									<v-form class="form light-blue lighten-4 px-6 pb-8 pt-9" ref="form" @submit.prevent="handleSubmit">
										<v-file-input filled 
											class="mb-3"
											:label="$t('Выберите ЭЦП '+(loginType == 'abiturient' ? 'физического' : 'юридического')+' лица')"
											accept=".p12"
											:rules="[v => !!v || $t('Выберите ЭЦП')]"
											@change="toBase64"
											>
										</v-file-input>
										<v-text-field filled
											:label="$t('Пароль от ЭЦП')"
											type="password"
											prepend-icon="mdi-key"
											v-model="ecpPassword"
											:rules="[v => !!v || $t('Введите пароль')]"
										></v-text-field>

										<v-flex class="d-flex justify-center">
											<v-btn 
												height="40px"
												dark color="light-blue darken-2"
												class="login"
												type="submit"
												:loading="loading">
												{{ $t('Войти в систему') }}
											</v-btn> 
										</v-flex>
									</v-form>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="single_faq mb-4">
									<div class="single_faq_content">
										<!-- <div class="single_faq_title pb-2">
											<h3>Уважаемый абитуриент</h3>
										</div> -->
										<div class="single_faq_text pt-4" v-html="$t(loginType+'_login_text')"></div>
									</div>
								</div>						
							</div>
						</div>
					</div>
				</div> 
			</div>
		</div>

		<div class="faq_area bg_color2 pt-90 pb-70">
			<div class="container">
				<div class="row"> 
					<div class="col-lg-12 mb-5">
						<div class="section_title text_center mt-3">
							<div class="section_sub_title uppercase mb-3">
								<h6>{{ $t('Управление колледжом') }}</h6>
							</div>
							<div class="section_main_title">
								<h1 v-html="$t('sign_for')"></h1>
							</div>
							<div class="em_bar">
								<div class="em_bar_bg"></div>
							</div>
						</div>
					</div>
					
					<div class="col-lg-6 col-md-6" v-if="loginType != 'abiturient'">
						<div class="single_faq mb-4">
							<div class="single_faq_content">
								<div class="single_faq_title pb-2">
									<h5>{{ $t('Вход в кабинет абитуриента') }}</h5>
								</div>
								<div class="single_faq_text">
									<p>{{ $t('ИС позволяет подавать документы для поступления в колледж на бесплатное обучение по государственному заказу и отслеживать их статус. Итоговые результаты отображаются в разделе ранжирование. Есть возможность задать интересующие вопросы в приемную комиссию.') }}</p>
								</div>
								<div class="pt-2 pb-5">
									<div class="btn btn-primary" @click.stop="changeLoginType('abiturient')">
										{{ $t('Вход в кабинет') }}
									</div>
								</div>								
							</div>
						</div>
					</div>
					<div class="col-lg-6 col-md-6" v-if="loginType != 'college'">
						<div class="single_faq mb-4">
							<div class="single_faq_content">
								<div class="single_faq_title pb-2">
									<h5>{{ $t('Приемная комиссия колледжа') }}</h5>
								</div>
								<div class="single_faq_text">
									<p>{{ $t('Приемная комиссия колледжа может отслеживать поступающие заявки от абитуриентов. Система позволяет управлять процессами приема и отказа в колледж. Требуется ЭЦП юридического учреждения.') }}</p>
								</div>
								<div class="pt-2 pb-5">
									<div class="btn btn-primary" @click.stop="changeLoginType('college')">
										{{ $t('Вход в кабинет') }}
									</div>
								</div>								
							</div>
						</div>
					</div>
					<div class="col-lg-6 col-md-6" v-if="loginType != 'department'">
						<div class="single_faq mb-4">
							<div class="single_faq_content">
								<div class="single_faq_title pb-2">
									<h5>{{ $t('Управление ТиПО') }}</h5>
								</div>
								<div class="single_faq_text">
									<p>{{ $t('Вход в кабинет для Управления Образования (ТиПО) позволяет проводить мониторинг по приему абитуриентов подведомственных организаций (колледжей). Отображаются актуальные статистические данные. Имеется виртуальный блог.') }}</p>
								</div>
								<div class="pt-2 pb-5">
									<div class="btn btn-primary" @click.stop="changeLoginType('department')">
										{{ $t('Вход в кабинет') }}
									</div>
								</div>								
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Footer />
	</v-app>
</template>

<script>
	import Header from '@/components/abiturient/Header.vue'
	import Footer from '@/components/abiturient/Footer.vue'
	export default {
		mounted() {
			/*let cssFile1 = document.getElementById("bootstrap");
			cssFile1 && cssFile1.remove();

			let cssFile2 = document.getElementById("atlantis");
			cssFile2 && cssFile2.remove();

			let cssFile3 = document.getElementById("fonts");
			cssFile3 && cssFile3.remove();*/
			if(this.$route.params.user) {
				if(this.$route.params.user == 'abiturient' || this.$route.params.user == 'college' || this.$route.params.user == 'department') {
					this.loginType = this.$route.params.user;
				}
			}
		},
		components: {
			Header,
			Footer
		},
		computed: {
			selectedLanguage() {
				return this.$store.state.language;
			}
		},

		data: () => ({
			ecpFileData: '',
			ecpPassword: '',
			lang: null,
			loginType: 'abiturient',
			loading: false
		}),
		methods: {
			changeLoginType(user) {
				this.loginType = user;
				this.$router.push({ path: '/login/'+user });
				window.scrollTo(0,0);
			},
			async handleSubmit() {
				if(this.$refs.form.validate()) {
					this.loading = true;
					await this.$http.post(this.selectedLanguage+'/auth/'+this.loginType, {
						"p12": this.ecpFileData,
						"password": this.ecpPassword
					}).then((response) => {
						this.loading = false;
						this.$store.commit('setCurrentRole', this.loginType); // TODO
						if(this.loginType == 'college') {
							this.$store.commit('setCollegeInfo', response.data.data);
						} else if(this.loginType == 'abiturient') {
							this.$store.commit('setAbiturientInfo', response.data.data);
						} else if(this.loginType == 'department') {
							this.$store.commit('setTipoInfo', response.data.data);
						}
						this.$store.dispatch('login', response).then(() => {
							if(this.$router.history.current.query.url) {
								this.$router.push({ path: this.$router.history.current.query.url });
							} else {
								this.$router.push({ path: '/'+this.loginType });
							}
						});
					}).catch(() => this.loading = false);
				}
			},
			toBase64(file) {
				if(file) {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => {
						let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
						if ((encoded.length % 4) > 0) {
							encoded += '='.repeat(4 - (encoded.length % 4));
						}
						this.ecpFileData = encoded;
					};
				}
			}
		}
	};
</script>
<style type="text/css" scoped src="@/assets/css/abiturient.css"></style>
<style scoped>
	@media (min-width: 1904px) {
		.container {
			max-width: 1140px !important;
		}
	}
	.login-block {
		padding-top: 70px;
		padding-bottom: 90px;
	}
</style>
<style type="text/css">
	.v-input__slot {
		background-color: #fff !important;
	}
</style>