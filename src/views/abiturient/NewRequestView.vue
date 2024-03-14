<template>
	<div>
		<v-row>
			<v-breadcrumbs :items="breadcrumbs" divider="/" class="mb-4"></v-breadcrumbs>
		</v-row>
		<v-stepper v-model="step" alt-labels>
			<v-stepper-header>
				<v-stepper-step :complete="step > 1" step="1">{{ $t('Тип заявки') }}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step :complete="step > 1" step="2">{{ $t('Профдиагностика') }}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step :complete="step > 2" step="3">{{ $t('Данные') }}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step :complete="step > 3" step="4">{{ $t('Образование') }}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step :complete="step > 4" step="5">{{ $t('Квота') }}</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step :complete="step > 5" step="6">{{ $t('Специальность') }}</v-stepper-step>
			</v-stepper-header>

			<v-stepper-items>
				<v-stepper-content step="1">
					<!-- <v-alert
						prominent
						dense
						border="left"
						colored-border
						type="info"
						color="orange darken-1">
						<div class="text-h6 mb-3">Внимание!!!</div>
						
						<p>В целях обеспечения безопасности граждан и учитывая возникшие трудности при получении медицинских справок о состоянии здоровья, Министром образования и науки подписан приказ, временно разрешающий прием документов в организации образования без предъявления медицинских справок.</p>

						<p>При подаче онлайн заявления на портале «электронного правительства» - закрепление медицинских справок не обязательное поле.</p>
					</v-alert> -->
					

					<v-card outlined class="mb-4">
						<v-card-text class="text-h6">
							{{ $t('Подготовка специалистов среднего звена и прикладного бакалавра') }}<br>
							<div class="blue--text text-darken-3 font-weight-bold">{{ $t('Бесплатное, за счет средств государственного образовательного заказа') }}</div>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn depressed  @click.stop="requestData.training_type_id = 1; requestData.payment_type_id = 2; step++;">{{ $t('Продолжить') }}</v-btn>
						</v-card-actions>
					</v-card>
					<v-card outlined class="mb-4">
						<v-card-text class="text-h6">
							{{ $t('Подготовка квалифицированных рабочих кадров') }}<br>
							<div class="blue--text text-darken-3 font-weight-bold">{{ $t('Бесплатное, за счет средств государственного образовательного заказа') }}</div>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn depressed  @click.stop="requestData.training_type_id = 2; requestData.payment_type_id = 2; step++;">{{ $t('Продолжить') }}</v-btn>
						</v-card-actions>
					</v-card>
					<v-card outlined class="mb-4">
						<v-card-text class="text-h6">
							{{ $t('Подготовка специалистов среднего звена и прикладного бакалавра') }}<br>
							<div class="blue--text text-darken-3 font-weight-bold">{{ $t('Платное, за счет собственных средств') }}</div>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn depressed  @click.stop="requestData.training_type_id = 1; requestData.payment_type_id = 1; step++;">{{ $t('Продолжить') }}</v-btn>
						</v-card-actions>
					</v-card>
					<!-- <v-card outlined class="mb-4">
						<v-card-title>Подготовка квалифицированных рабочих кадров (Платное, за счет собственных средств)</v-card-title>
						<v-card-text>
							<p><strong>Как получить услугу в государственном органе&nbsp;</strong>(необходимые документы):&nbsp;&nbsp;</p>

							<ol>
								<li>заявление о приеме документов;</li>
								<li>подлинник документа об образовании;</li>
								<li>фотографии размером 3х4 см в количестве 4-х штук;</li>
								<li>медицинская справка формы № 075-У, для инвалидов І и II группы и инвалидов с детства заключение медико-социальной экспертизы по форме 031-У;</li>
								<li>документ, удостоверяющий личность (для идентификации личности).</li>
							</ol>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn depressed  @click.stop="requestData.training_type_id = 2; requestData.payment_type_id = 1; step++;">Подать заявку</v-btn>
						</v-card-actions>
					</v-card> -->
				</v-stepper-content>

				<v-stepper-content step="2">
					{{ $t('Пройдите профдиагностику на сайте') }} <a href="https://edunavigator.kz/" target="_blank" class="">BTS·Education</a>
					
					<v-checkbox v-model="btsCheckbox" :label="$t('Я получил(а) и ознакомился(ась) с результатами профдиагностики')"></v-checkbox>

					<div class="text-right">
						<v-btn v-if="!requestData.is_undeveloped_place" @click.stop="step--" class="mr-3" elevation="0">{{ $t('Назад') }}</v-btn>
						<v-btn color="primary" @click.stop="step3" :disabled="!btsCheckbox" :loading="isLoading">{{ $t('Далее') }}</v-btn>
					</div>
				</v-stepper-content>

				<v-stepper-content step="3">
					<v-form class="form" ref="formStep3">
						<v-select
							v-model="requestData.declarant_type_id"
							:items="declarantTypeList"
							item-text="name"
							item-value="id"
							:rules="[v => !!v || $t('Обязательное поле')]"
							:label="$t('Тип заявителя')">
						</v-select>
						<template v-if="requestData.declarant_type_id">
							<v-card outlined class="mb-4">
								<v-card-title>{{ $t('Данные абитуриента') }}</v-card-title>
								<v-card-text>
									<v-row>
										<v-col sm="3" cols="12">
											<v-text-field
												v-model="requestData.surname"
												:label="$t('Фамилия')"
												type="text"
											></v-text-field>
										</v-col>
										<v-col sm="3" cols="12">
											<v-text-field
												v-model="requestData.name"
												:label="$t('Имя')"
												type="text"
												:rules="[v => !!v || $t('Обязательное поле')]"
												required
											></v-text-field>
										</v-col>
										<v-col sm="3" cols="12">
											<v-text-field
												v-model="requestData.lastname"
												:label="$t('Отчество')"
												type="text"
											></v-text-field>
										</v-col>
										<v-col sm="3" cols="12">
											<v-menu
												v-model="datePickerMenu"
												:close-on-content-click="false"
												:nudge-right="40"
												transition="scale-transition"
												offset-y
												min-width="auto">
												<template v-slot:activator="{ on, attrs }">
													<v-text-field
														v-model="requestData.birthday"
														:label="$t('Дата рождения')"
														readonly
														prepend-icon="mdi-calendar"
														:rules="[v => !!v || $t('Обязательное поле')]"
														required
														v-bind="attrs"
														v-on="on"
													></v-text-field>
												</template>
												<v-date-picker
												v-model="requestData.birthday"
												@input="datePickerMenu = false"
												></v-date-picker>
											</v-menu>
										</v-col>
									</v-row>
									<v-row>
										<v-col sm="4" cols="12">
											<v-select
												v-model="requestData.citizen_status_id"
												:items="citizenStatusList"
												item-text="name"
												item-value="id"
												:rules="[v => !!v || $t('Обязательное поле')]"
												:label="$t('Статус гражданина')">
											</v-select>
										</v-col>
										<v-col sm="4" cols="12">
											<v-select
												v-model="requestData.nationality_id"
												:items="nationalityList"
												item-text="name"
												item-value="id"
												:rules="[v => !!v || $t('Обязательное поле')]"
												:label="$t('Национальность')">
											</v-select>
										</v-col>
										<v-col sm="4" cols="12">
											<v-text-field
												v-model="requestData.iin"
												:label="$t('ИИН')"
												type="number"
												:rules="[v => !v || v.match(/\d/g).length === 12 || $t('Неправильный формат ИИН')]"
												@wheel="$event.target.blur()"
											></v-text-field>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>

							<v-card outlined class="mb-4">
								<v-card-title>{{ $t('Контактные данные') }}</v-card-title>
								<v-card-text>
									<v-row>
										<v-col sm="4" cols="12">
											<v-text-field
												v-model="requestData.email"
												:label="$t('Электронная почта')"
												type="text"
												:rules="[v => !!v || $t('Обязательное поле'), v => /.+@.+\..+/.test(v) || 'Введите корректный E-mail']"
												required
											></v-text-field>
										</v-col>
										<v-col sm="4" cols="12">
											<v-text-field
												v-model="requestData.phone_number"
												:label="$t('Номер телефона абитуриента')"
												prefix="+"
												type="number"
												@wheel="$event.target.blur()"
												:rules="[v => !!v || $t('Обязательное поле'), v => !v || v.match(/\d/g).length === 11 || 'Неправильный формат телефона']"
												required
											></v-text-field>
										</v-col>
										<v-col sm="4" cols="12">
											<v-text-field
												v-model="requestData.parent_phone_number"
												:label="$t('Номер телефона родителя')"
												type="number"
												prefix="+"
												@wheel="$event.target.blur()"
												:rules="[v => !!v || $t('Обязательное поле'), v => !v || v.match(/\d/g).length === 11 || 'Неправильный формат телефона']"
												required
											></v-text-field>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>

							<v-card outlined class="mb-4">
								<v-card-title>{{ $t('Медицинские данные') }}</v-card-title>
								<v-card-text>
									<v-row>
										<v-col sm="12" cols="12">
											<v-file-input
													:label="$t('Медицинская справка 075/У (086)')"
													accept="image/*,application/pdf"
													:rules="[v => !!v || $t('Обязательное поле'), v => !v || v.size < 4194304 || $t('Размер файла не должен превышать 4 Мб')]"
													@change="form086ToBase64"
													required >
											</v-file-input>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>

								<v-row>
									<v-col>
										<v-checkbox v-model="requestData.instructionCheck" :label="$t('С Единой инструкцией по проведению Конкурса ознакомлен(-а)')" :rules="[v => !!v || $t('Обязательное поле')]"></v-checkbox>
									</v-col>
									<v-col>
										<v-checkbox v-model="requestData.personalDataCheck" :label="$t('Даю согласие на сбор, обработку персональных данных')" :rules="[v => !!v || $t('Обязательное поле')]"></v-checkbox>
									</v-col>
								</v-row>
						</template>
					</v-form>
					
					<div class="text-right">
						<v-btn v-if="step != 1" @click.stop="step--" class="mr-3" elevation="0">{{ $t('Назад') }}</v-btn>
						<v-btn color="primary" @click.stop="step4" :loading="isLoading">{{ $t('Далее') }}</v-btn>
					</div>
				</v-stepper-content>

				<v-stepper-content step="4">
					<v-form class="form" ref="formStep4">
						<v-select
							v-model="requestData.education_type_id"
							:items="educationTypeList"
							item-text="name"
							item-value="id"
							:readonly="requestData.is_undeveloped_place"
							:rules="[v => !!v || $t('Обязательное поле')]"
							:label="$t('Тип образования')">
						</v-select>

						<template v-if="requestData.education_type_id">
							<v-card outlined class="mb-4" v-if="requestData.education_type_id == 1 || requestData.education_type_id == 2">
								<v-card-title>{{ $t('Данные о школе') }}</v-card-title>
								<v-card-text>

									<v-autocomplete
										v-model="requestData.school_country_id"
										:items="countryList"
										item-text="name"
										item-value="id"
										:label="$t('Страна')"
										clearable
										:rules="[v => !!v || $t('Обязательное поле')]">
									</v-autocomplete>
									<template v-if="requestData.school_country_id == 192">
										<v-select
											v-model="requestData.school_region_ab"
											:items="regionList"
											item-text="name"
											item-value="ab"
											:rules="[v => !!v || $t('Обязательное поле')]"
											:label="$t('Регион')">
										</v-select>
										<v-autocomplete
												v-model="requestData.school_id"
												:items="schoolList"
												item-text="name"
												item-value="id"
												:label="$t('Школа')"
												clearable
												:rules="[v => !!v || $t('Обязательное поле')]">
										</v-autocomplete>
									</template>
									

								</v-card-text>
							</v-card>
							<v-text-field
								v-model="requestData.graduation_year"
								:label="$t('Год окончания')"
								type="number"
								@wheel="$event.target.blur()"
								:rules="[v => !!v || $t('Обязательное поле'), v => !v || v.match(/\d/g).length === 4 || 'Неправильный формат']"
								required
							></v-text-field>
							
							<v-select
								v-model="requestData.education_document_type_id"
								:items="educationDocumentList"
								item-text="name"
								item-value="id"
								:rules="[v => !!v || $t('Обязательное поле')]"
								:label="$t('Тип документа')">
							</v-select>
							
							<v-file-input
								:label="$t('Документ об образовании')"
								accept="image/*,application/pdf"
								:rules="[v => !!v || $t('Обязательное поле'), v => !v || v.size < 4194304 || $t('Размер файла не должен превышать 4 Мб')]"
								@change="educationDocumentToBase64"
								required >
							</v-file-input>
						</template>
					</v-form>
					<div class="text-right">
						<v-btn v-if="step != 1" @click.stop="step--" class="mr-3" elevation="0">{{ $t('Назад') }}</v-btn>
						<v-btn color="primary" @click.stop="step5" :loading="isLoading">{{ $t('Далее') }}</v-btn>
					</div>
				</v-stepper-content>

				<v-stepper-content step="5">
					<v-form class="form" ref="formStep5">
						<v-select
							v-model="requestData.quota_list[0].id"
							:items="quotaCategoryList"
							@change="quotaCategoryChanged"
							item-text="name"
							item-value="id"
							:rules="[v => !!v || $t('Обязательное поле')]"
							:label="$t('Тип льготы')">
						</v-select>
						<template v-if="requestData.quota_list[0].id && requestData.quota_list[0].id != 0 && requestData.quota_list[0].id != 3">
							<v-file-input
								:label="$t('Документ подтверждающий льготу')"
								accept="image/*,application/pdf"
								:rules="[v => !!v || $t('Обязательное поле'), v => !v || v.size < 4194304 || $t('Размер файла не должен превышать 4 Мб')]"
								@change="quotaDocumentToBase64"
								required >
							</v-file-input>
						</template>
					</v-form>
					<div class="text-right">
						<v-btn v-if="step != 1" @click.stop="step--" class="mr-3" elevation="0">{{ $t('Назад') }}</v-btn>
						<v-btn color="primary" @click.stop="step6" :loading="isLoading">{{ $t('Далее') }}</v-btn>
					</div>
				</v-stepper-content>

				<v-stepper-content step="6">
					<v-form class="form" ref="formStep6">
						<v-select
							v-model="requestData.education_form_id"
							:items="educationFormList"
							@change="clearQualificationList"
							item-text="name"
							item-value="id"
							:readonly="requestData.is_undeveloped_place"
							:rules="[v => !!v || $t('Обязательное поле')]"
							:label="$t('Форма обучения')">
						</v-select>
						<v-select
							v-model="requestData.region_ab"
							:items="regionIsEdusList"
							@change="clearQualificationList"
							item-text="name"
							item-value="ab"
							:readonly="requestData.is_undeveloped_place"
							:rules="[v => !!v || $t('Обязательное поле')]"
							:label="$t('Регион')">
						</v-select>
						<template v-if="requestData.region_ab && requestData.education_form_id">
							<v-card outlined class="mb-4" v-for="(item, index) in requestData.choosed_qualification" :key="item.id">
								<v-card-text>
									<v-btn fab small depressed text v-if="index != 0" @click.stop="removeQualificationBlock(index)" style="position: absolute; top: 0; right: 0;">
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<v-autocomplete
											v-model="qualificationSelected[index]"
											:items="qualificationList"
											item-value="qualification_code"
											:label="$t('Специальность №')+(index+1)"
											@change="qualificationChanged($event, index)"
											:clearable="!requestData.is_undeveloped_place"
											:filter="customQualificationFilter"
											:readonly="requestData.is_undeveloped_place"
											:rules="[v => !v || Object.keys(v).length != 0 || $t('Обязательное поле')]"
											return-object>
											<template v-slot:item="{ item }">
												<div class="py-3">
													{{item.qualification_code}} ({{item.specialty_code}}) – {{item.name}} ({{item.specialty_name}})
												</div>
											</template>
											<template v-slot:selection="{ item }">
											<span style="text-overflow: ellipsis; overflow: hidden; width: 90%; white-space: nowrap; position: absolute;">
												{{item.qualification_code}} ({{item.specialty_code}}) – {{item.name}} ({{item.specialty_name}})
											</span>
											</template>
									</v-autocomplete>
									
									<v-select
										v-model="item.bin"
										:items="collegeList[index]"
										@change="collegeChanged(index)"
										item-text="name"
										item-value="college_bin"
										:readonly="requestData.is_undeveloped_place"
										:rules="[v => !!v || $t('Обязательное поле')]"
										:label="$t('Организация образования')">
									</v-select>
									<v-select
										v-model="item.lang"
										:items="collegeLangList[index]"
										@change="languageChanged(index)"
										item-text="name"
										item-value="lang_short"
										:readonly="requestData.is_undeveloped_place"
										:rules="[v => !!v || $t('Обязательное поле')]"
										:label="$t('Язык обучения')">
									</v-select>
 
									<v-checkbox
										v-if="collegeTargetGrantList[index]"
										v-model="item.target_grant"
										:label="$t('Хочу участвовать в целевом гранте')"
									></v-checkbox>
								</v-card-text>
							</v-card>
							<v-btn color="primary" @click.stop="addQualificationBlock" v-if="requestData.payment_type_id == 2 && requestData.training_type_id == 1 && maxChoosedQualificationCoun > requestData.choosed_qualification.length && !requestData.is_undeveloped_place">
								{{ $t('Добавить еще одну специальность') }}
							</v-btn>
						</template>

						<v-divider class="my-4"></v-divider>
						<sign-ecp @update-ecp-file-data="requestData.p12 = $event" @update-ecp-password="requestData.password = $event" />
					</v-form>
					<div class="text-right">
						<v-btn v-if="step != 1" @click.stop="step--" class="mr-3" elevation="0" :loading="isLoading">{{ $t('Назад') }}</v-btn>
						<v-btn color="primary" @click.stop="submitRequest" :loading="isLoading">{{ $t('Отправить') }}</v-btn>
					</div>
				</v-stepper-content>

			
			</v-stepper-items>
		</v-stepper>


					

	</div>
</template>

<script>
	export default {
		computed: {
			breadcrumbs() {
				return [
					{
						text: this.$t('Главная'),
						disabled: false,
						exact: true,
						to: '/abiturient',
					},
					{
						text: this.$t('Мои заявки'),
						disabled: false,
						exact: true,
						to: '/abiturient/my-requests',
					},
					{
						text: this.$t('Новая заявка'),
						disabled: true,
						exact: true,
						to: '',
					}
				];
			}
		},
		mounted() {
			if(+this.$route.query.is_undeveloped_place === 1) {
				this.requestData.is_undeveloped_place = true;
				this.requestData.training_type_id = this.$route.query.training_type_id;
				this.requestData.payment_type_id = this.$route.query.payment_type_id;
				this.requestData.education_type_id = this.$route.query.education_type_id;
				this.requestData.education_form_id = this.$route.query.education_form_id;
				this.requestData.region_ab = this.$route.query.region_ab;
				this.clearQualificationList();
				this.qualificationSelected[0] = this.$route.query.qualification_code;
				this.requestData.choosed_qualification[0] = {
							'code': this.$route.query.qualification_code,
							'specialty_code': this.$route.query.specialty_code,
							'bin': this.$route.query.college_bin,
							'lang': this.$route.query.lang_short
						};
				this.getCollege(0);
				this.getCollegeLang(0);
				this.step++;
			}
		},
		data () {
			return {
				isLoading: false,
				step: 1,
				btsCheckbox: false,
				declarantTypeList: [],
				citizenStatusList: [],
				educationTypeList: [],
				nationalityList: [],
				datePickerMenu: false,
				countryList: [],
				regionList: [],
				regionIsEdusList: [],
				schoolList: [],
				educationDocumentList: [],
				quotaCategoryList: [],
				educationFormList: [],
				qualificationList: [],
				qualificationSelected: [],
				collegeList: [],
				collegeLangList: [],
				collegeTargetGrantList: [],
				choosedQualificationItem: {
					"specialty_code": null,
					"code": null,
					"bin": null,
					"lang": null
				},
				maxChoosedQualificationCoun: 4,

				requestData: {
					training_type_id: null,
					payment_type_id: null,
					declarant_type_id: null,
					citizen_status_id: null,
					surname: null,
					name: null,
					lastname: null,
					iin: null,
					birthday: null,
					nationality_id: null,
					education_type_id: null,
					school_country_id: "192",
					school_region_ab: null,
					school_id: null,
					education_document_type_id: null,
					education_document: null,
					is_have_quota: null, // TODO
					quota_list: [
						{
							"id": null,
							"document": null
						}
					],
					region_ab: null,
					education_form_id: null,
					choosed_qualification: [],
					p12: null,
					password: null,
					is_undeveloped_place: false
				}
			}
		},
		methods: {
			step1() {

			},
			step2() {

			},
			async step3() {
				await this.getDeclarantType();
				await this.getCitizenStatus();
				await this.getNationality();
				this.step++;
			},
			async step4() {
				if(this.$refs.formStep3.validate()) {
					await this.getEducationType();
					this.step++;
				}
			},
			async step5() {
				if(this.$refs.formStep4.validate()) {
					await this.getQuotaCategory();
					this.step++;
				}
			},
			async step6() {
				if(this.$refs.formStep5.validate()) {
					this.getEducationForm();
					this.getRegionIsEdus();
					this.step++;
				}
			}, 

			async getDeclarantType() {
				if(!this.declarantTypeList.length) {
					this.isLoading = true;
					await this.$http.get('/declarantType').then((response) => {
						this.declarantTypeList = response.data.data;
					});
					this.isLoading = false;
				}
			},
			async getCitizenStatus() {
				if(!this.citizenStatusList.length) {
					this.isLoading = true;
					await this.$http.get('/citizenStatus').then((response) => {
						this.citizenStatusList = response.data.data;
					});
					this.isLoading = false;
				}
			},
			async getNationality() {
				if(!this.nationalityList.length) {
					this.isLoading = true;
					await this.$http.get('/nationality').then((response) => {
						this.nationalityList = response.data.data;
					});
					this.isLoading = false;
				}
			},
			async getEducationType() {
				if(!this.educationTypeList.length) {
					this.isLoading = true;
					await this.$http.get('/educationType').then((response) => {
						this.educationTypeList = response.data.data;
					});
					this.isLoading = false;
				}
			},
			async getCountry() {
				if(!this.countryList.length) {
					this.isLoading = true;
					await this.$http.get('/country').then((response) => {
						this.countryList = response.data.data;
					});
					this.isLoading = false;
				}
			},
			async getRegion() {
				if(!this.regionList.length) {
					this.isLoading = true;
					await this.$http.post('/region', {
						"country_id" : 192
					}).then((response) => {
						this.regionList = response.data.data;
					});
					this.isLoading = false;
				}
			},
			async getRegionIsEdus() {
				if(!this.regionIsEdusList.length) {
					this.isLoading = true;
					await this.$http.post('/region', {
						"country_id" : 192,
						"is_edus" : true,
					}).then((response) => {
						this.regionIsEdusList = response.data.data;
					});
					this.isLoading = false;
				}
			},
			async getSchool() {
				this.isLoading = true;
				await this.$http.post('/school', {
					"region_ab" : this.requestData.school_region_ab
				}).then((response) => {
					this.schoolList = response.data.data;
					this.schoolList.push({
						"id": "0",
						"name": this.$t('Другое'),
					});
				});
				this.isLoading = false;
			},
			async getEducationDocument() {
				this.isLoading = true;
				await this.$http.post('/educationDocument', {
					"education_type_id": this.requestData.education_type_id
				}).then((response) => {
					this.educationDocumentList = response.data.data;
				});
				this.isLoading = false;
			},
			async getQuotaCategory() {
				if(!this.quotaCategoryList.length) {
					this.isLoading = true;
					await this.$http.get('/quotaCategory').then((response) => {
						this.quotaCategoryList = response.data.data;
						this.quotaCategoryList.unshift({
							"id": "0",
							"name": this.$t('Без льготы')
						});
					});
					this.isLoading = false;
				}
			},
			quotaCategoryChanged(v) {
				this.requestData.is_have_quota = v != 0;
				if(v == 0) {
					this.requestData.quota_list[0].document = null;
				}
			},
			async getEducationForm() {
				if(!this.educationFormList.length) {
					this.isLoading = true;
					await this.$http.get('/educationForm').then((response) => {
						this.educationFormList = response.data.data;
					});
					this.isLoading = false;
				}
			},

			clearQualificationList() {
				this.requestData.choosed_qualification = [];
				this.qualificationSelected = [];
				this.qualificationList = [];
				this.collegeList = [];
				this.collegeLangList = [];
				this.collegeTargetGrantList = [];
				this.addQualificationBlock();
				if(this.requestData.education_form_id && this.requestData.region_ab) {
					this.getQualification();
				}
			},
			addQualificationBlock() {
				this.qualificationSelected.push({});
				this.requestData.choosed_qualification.push(Object.assign({}, this.choosedQualificationItem));
			},
			customQualificationFilter(item, queryText) {
				const qualificationCode = item.qualification_code.toLowerCase();
				const specialtyCode = item.specialty_code.toLowerCase();
				const specialtyName = item.specialty_name.toLowerCase();
				const name = item.name.toLowerCase();
				const searchText = queryText.toLowerCase();
				return qualificationCode.indexOf(searchText) > -1 || specialtyCode.indexOf(searchText) > -1 || specialtyName.indexOf(searchText) > -1 || name.indexOf(searchText) > -1;
			},
			removeQualificationBlock(index) {
				this.requestData.choosed_qualification.splice(index, 1); 
			},
			async getQualification() {
				this.isLoading = true;
				await this.$http.post('/qualification', {
					"region_ab": this.requestData.region_ab,
					"training_type_id": this.requestData.training_type_id,
					"education_form_id": this.requestData.education_form_id,
					"education_type_id": this.requestData.education_type_id,
					"payment_type_id": this.requestData.payment_type_id,
				}).then((response) => {
					this.qualificationList = response.data.data;
				});
				this.isLoading = false;
			},
			qualificationChanged(item, index) {
				this.requestData.choosed_qualification[index].bin = null;
				if(item) {
					this.requestData.choosed_qualification[index].specialty_code = item.specialty_code;
					this.requestData.choosed_qualification[index].code = item.qualification_code;
					this.getCollege(index);
				}
			},
			async getCollege(index) {
				this.isLoading = true;
				await this.$http.post('/college', {
					"region_ab": this.requestData.region_ab,
					"qualification_code": this.requestData.choosed_qualification[index].code,
					"training_type_id": this.requestData.training_type_id,
					"education_form_id": this.requestData.education_form_id,
					"education_type_id": this.requestData.education_type_id,
					"payment_type_id": this.requestData.payment_type_id,
				}).then((response) => {
					this.collegeList[index] = response.data.data;
				});
				this.isLoading = false;
			},
			collegeChanged(index) {
				this.requestData.choosed_qualification[index].lang = null;
				this.getCollegeLang(index);
			},
			async getCollegeLang(index) {
				this.isLoading = true;
				await this.$http.post('/lang', {
					"region_ab": this.requestData.region_ab,
					"qualification_code": this.requestData.choosed_qualification[index].code,
					"college_bin": this.requestData.choosed_qualification[index].bin,
					"training_type_id": this.requestData.training_type_id,
					"education_form_id": this.requestData.education_form_id,
					"education_type_id": this.requestData.education_type_id,
					"payment_type_id": this.requestData.payment_type_id
				}).then((response) => {
					this.collegeLangList[index] = response.data.data;
				});
				this.isLoading = false;
			},
			languageChanged(index) {
				this.requestData.choosed_qualification[index].target_grant = false;
				this.getTargetGrant(index);
			},
			async getTargetGrant(index) {
				this.isLoading = true;
				await this.$http.post('/targetGrant', {
					"region_ab": this.requestData.region_ab,
					"qualification_code": this.requestData.choosed_qualification[index].code,
					"college_bin": this.requestData.choosed_qualification[index].bin,
					"training_type_id": this.requestData.training_type_id,
					"education_form_id": this.requestData.education_form_id,
					"education_type_id": this.requestData.education_type_id,
					"payment_type_id": this.requestData.payment_type_id,
					"lang_short": this.requestData.choosed_qualification[index].lang
				}).then((response) => {
					this.collegeTargetGrantList[index] = response.data.data.is_have;
				});
				this.isLoading = false;
			},
			form086ToBase64(file) {
				if(file) {
					this.toBase64(file).then((response) => {
						this.requestData.form_086_document = response;
					});
				}
				this.requestData.form_086 = null;
			},
			educationDocumentToBase64(file) {
				if(file) {
					this.toBase64(file).then((response) => {
						this.requestData.education_document = response;
					});
				}
				this.requestData.education_document = null;
			},
			quotaDocumentToBase64(file) {
				if(file) {
					this.toBase64(file).then((response) => {
						this.requestData.quota_list[0].document = response;
					});
				}
				this.requestData.quota_list[0].document = null;
			},
			async toBase64(file) {
				return new Promise((resolve) => {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => {
						let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
						if ((encoded.length % 4) > 0) {
							encoded += '='.repeat(4 - (encoded.length % 4));
						}
						resolve(encoded);
					};
				});
			},
			async submitRequest() {
				this.isLoading = true;
				if(this.$refs.formStep6.validate()) {
					await this.$http.post('/request', this.requestData).then((response) => {
						this.$store.dispatch('alertAdd', {text: this.$t('Заявка успешно отправлена'), type: 'success'});

						this.$router.push({ path: '/abiturient/my-requests/'+response.data.data.id });
					}).catch(() => {
						this.isLoading = false;
					})
				}
			}
		},
		watch:{
			'requestData.training_type_id': function () {
				if(!this.requestData.is_undeveloped_place) {
					this.requestData.education_form_id = null;
					this.requestData.region_ab = null;

					this.clearQualificationList();
				}
			},
			'requestData.payment_type_id': function () {
				if(!this.requestData.is_undeveloped_place) {
					this.clearQualificationList();
				}
			},
			'requestData.declarant_type_id': function (v) {
				if(v == 1) {
					this.requestData.surname = this.$store.getters.getAbiturientInfo.surname || '';
					this.requestData.name = this.$store.getters.getAbiturientInfo.name || '';
					this.requestData.lastname = this.$store.getters.getAbiturientInfo.lastname || '';
					this.requestData.birthday = this.$store.getters.getAbiturientInfo.birthDate || '';
					this.requestData.iin = this.$store.getters.getAbiturientInfo.iin || '';
					this.requestData.email = this.$store.getters.getAbiturientInfo.email || '';
				}
			},
			'requestData.education_type_id': function (v) {
				if(v == 1 || v == 2) {
					this.getCountry();
					this.getRegion();
				} else {
					this.requestData.school_region_ab = null;
					this.requestData.school_id = null;
				}
				this.requestData.education_document_type_id = null;
				this.getEducationDocument();

				if(!this.requestData.is_undeveloped_place) {
					this.clearQualificationList();
				}
			},
			'requestData.school_country_id': function (v) {
				if(v != 192) {
					this.requestData.school_region_ab = null;
					this.requestData.school_id = null;
				}
			},
			'requestData.school_region_ab': function () {
				this.requestData.school_id = null;
				this.getSchool();
			}
		}
	}
</script>