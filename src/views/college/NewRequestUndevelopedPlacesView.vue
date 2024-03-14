<template>
	<div>
		<div class="panel-header panel-header-custom bg-primary-gradient">
			<div class="page-inner py-5">
				<div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
					<div>
						<h2 class="text-white pb-2 fw-bold">{{ $t('Неосвоенные места') }}</h2>
						<!-- <h5 class="text-white op-7 mb-2">Краткая статистика заявок приема</h5> -->
					</div>
					<div class="ml-md-auto py-2 py-md-0">

					</div>
				</div>
			</div>
		</div>
		<div class="page-inner mt--5">
			<v-card outlined class="mb-4">
				<v-card-title class="card-title-custom">{{ $t('Выберите специальность') }}</v-card-title>
				<v-card-text class="text-h6">
					<v-data-table
							:headers="undevelopedPlacesTableData.headers"
							:items="undevelopedPlacesTableData.list"
							:loading="isLoading"
							:footer-props="{'items-per-page-options': [-1]}"
							:show-expand="true"
							:expanded.sync="selectedPlace"
							single-expand
							class="elevation-1 place-list">
							<template v-slot:expanded-item="{ headers }">
								<td :colspan="headers.length">
									<div class="py-4 px-1">
										<v-form class="form" ref="iin">
											<v-card outlined>
												<v-card-text>
													<v-text-field
															v-model="requestData.iin"
															:label="$t('ИИН абитуриента')"
															type="number"
															:rules="[v => !v || v.match(/\d/g).length === 12 || $t('Неправильный формат ИИН')]"
															@wheel="$event.target.blur()"
													></v-text-field>
													<template v-if="Object.keys(previousRequest).length">
														<div class="font-weight-medium">
															{{ $t('Абитуриент') }}: {{previousRequest.surname }} {{previousRequest.name }} {{previousRequest.lastname }}<br>
															{{ $t('Средняя оценка аттестата') }}: {{previousRequest.amc}}<br>
															<template v-if="previousRequest.acs">
																{{ $t('Средний конкурсный балл') }}: {{previousRequest.acs}}
															</template>
														</div>
														<v-divider class="my-4"></v-divider>
														<sign-ecp @update-ecp-file-data="requestData.p12 = $event" @update-ecp-password="requestData.password = $event" />
													</template>
												</v-card-text>
												<v-card-actions v-if="Object.keys(previousRequest).length">
													<v-spacer></v-spacer>
													<v-btn color="primary" @click.stop="submitRequest" :loading="isLoading">{{ $t('Подписать') }}</v-btn>
												</v-card-actions>
											</v-card>
										</v-form>
									</div>
								</td>
							</template>
					</v-data-table>
					<v-divider></v-divider>

				</v-card-text>
			</v-card>
		</div>
	</div>
</template>

<script>
	export default {
		mounted() {
			this.getData();
		},
		computed: {

		},
		data () {
			return {
				isLoading: false,
				selectedPlace: [],
				undevelopedPlacesTableData: {},
				previousRequest: {},
				requestData: {
					'iin': null,
					'training_type_id': null,
					'payment_type_id': null,
					'education_form_id': null,
					'education_type_id': null,
					'study_lang': null,
					'qualification_code': null,
					'request_order_id': null,
					'p12': null,
					'password': null,
				},
			}
		},
		methods: {
			async getData() {
				this.isLoading = true;
				await this.$http.get('/undevelopedPlaces').then((response) => {
					this.undevelopedPlacesTableData = response.data.data.preliminaryRanging;
					this.undevelopedPlacesTableData.headers.push({ text: '', value: 'data-table-expand' });
				});
				this.isLoading = false;
			},
			async getAbiturientDataByIin() {
				this.isLoading = true;
				await this.$http.get('/undevelopedPlaceRequests?iin='+this.requestData.iin+
						'&training_type_id='+this.requestData.training_type_id+
						'&qualification_code='+this.requestData.qualification_code+
						'&payment_type_id='+this.requestData.payment_type_id+
						'&education_form_id='+this.requestData.education_form_id+
						'&education_type_id='+this.requestData.education_type_id+
						'&study_lang='+this.requestData.study_lang).then((response) => {
					if(response.data.data) {
						this.previousRequest = response.data.data;
						this.requestData.request_order_id = this.previousRequest.request_order_id;
					} else {
						this.$store.dispatch('alertAdd', {text: this.$t('Абитуриент не найден'), type: 'error'});
					}
				});
				this.isLoading = false;
			},
			async submitRequest() {
				this.isLoading = true;
				await this.$http.post('/undevelopmentPlaceRequest', this.requestData).then(() => {
					this.$store.dispatch('alertAdd', {text: this.$t('Заявка успешно отправлена'), type: 'success'});

					this.$router.push({ path: '/college/rating/?qualification_code='+this.requestData.qualification_code+'&study_lang='+this.requestData.study_lang });
				}).catch(() => {
					this.isLoading = false;
				})
			}

		},
		watch:{
			'requestData.iin': function (v) {
				if(v && this.$refs.iin.validate()) {
					this.getAbiturientDataByIin();
				} else {
					this.previousRequest = {};
				}
			},
			'selectedPlace': function (v) {
				if(v.length) {
					this.requestData.iin = null;
					this.requestData.training_type_id = v[0].training_type_id;
					this.requestData.payment_type_id = v[0].payment_type_id;
					this.requestData.education_form_id = v[0].education_form_id;
					this.requestData.education_type_id = v[0].education_type_id;
					this.requestData.qualification_code = v[0].qualification_code;

					this.requestData.study_lang = v[0].lang_short;
				}
			}
		}
	}
</script>