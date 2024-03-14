<template>
	<div>
		<div class="panel-header panel-header-custom bg-primary-gradient">
			<div class="page-inner py-5">
				<div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
					<div>
						<h2 class="text-white pb-2 fw-bold">{{ $t("Список специальностей") }}</h2>
						<!-- <h5 class="text-white op-7 mb-2">Краткая статистика заявок приема</h5> -->
					</div>
					<div class="ml-md-auto py-2 py-md-0" v-if="$store.getters.getCollegeInfo.region_ab != '15'">
						<!-- <a href="#" class="btn btn-white btn-border btn-round mr-2">Manage</a> -->
						<v-btn class="btn btn-secondary btn-round white--text" @click.stop="showAddPlace" :loading="addPlaceDataLoading">{{ $t('Добавить специальности') }}</v-btn>
					</div>
				</div>
			</div>
		</div>
		<div class="page-inner mt--5">
			<v-alert
				v-if="placeConfig.message"
				prominent
				dense
				border="left"
				colored-border
				type="info"
				color="orange darken-1"
				>
				<v-row align="center">
					<v-col class="grow">{{ placeConfig.message }}</v-col>
					<!-- <v-col class="shrink">
						<v-btn color="primary" @click.stop="showAddPlace" :loading="addPlaceDataLoading">Добавить специальности</v-btn>
					</v-col> -->
				</v-row>
			</v-alert>
			<v-dialog v-model="addPlaceDialog" width="600" :persistent="actionIsLoading">
				<v-card>
					<v-card-title class="headline lighten-2">{{ $t('Добавить новую специальность') }}</v-card-title>
					<v-card-text>
						<v-form class="form" ref="addPlaceForm">
							<v-select
								v-model="paymentTypeSelected"
								:items="paymentType"
								item-text="name"
								item-value="id"
								:rules="[v => !!v || $t('Обязательное поле')]"
								:label="$t('Форма оплаты')">
							</v-select>
							<v-select
								v-model="trainingTypeSelected"
								:items="trainingType"
								item-text="name"
								item-value="id"
								return-object
								:rules="[v => Object.keys(v).length != 0 || $t('Обязательное поле')]"
								:label="$t('Тип подготовки')">
							</v-select>

							<v-select
								v-model="educationTypeSelected"
								:items="educationTypeList"
								item-text="name"
								item-value="id"
								:rules="[v => !!v || $t('Обязательное поле')]"
								:label="$t('Тип образования')">
							</v-select>
							<v-select
								v-model="educationFormSelected"
								:items="educationFormList"
								item-text="name"
								item-value="id"
								:rules="[v => !!v || $t('Обязательное поле')]"
								:label="$t('Форма обучения')">
							</v-select>

							<v-autocomplete
								v-model="placeQualificationSelected"
								:items="placeQualificationListFiltered"
								item-value="qualification_code"
								:label="$t('Специальность')"
								clearable
								:filter="customQualificationFilter"
								:rules="[v => Object.keys(v).length != 0 || $t('Обязательное поле')]"
								return-object>
								<template v-slot:item="{ item }">
									<div style="max-width: 500px;" class="py-3">
										{{item.specialty_code}} ({{item.qualification_code}}) – {{item.name}}
									</div>
								</template>
								<template v-slot:selection="{ item }">
									<span style="text-overflow: ellipsis; overflow: hidden; width: 90%; white-space: nowrap; position: absolute;">
										{{item.specialty_code}} ({{item.qualification_code}}) – {{item.name}}
									</span>
								</template>
							</v-autocomplete>
							<v-select
								v-model="placeLangSelected"
								:items="placeLangList"
								item-text="name"
								item-value="short"
								return-object
								:rules="[v => Object.keys(v).length != 0 || $t('Обязательное поле')]"
								:label="$t('Язык обучения')">
							</v-select>
							<v-text-field
								v-model="placeCount"
								:label="$t('Количество мест')"
								type="number"
								@wheel="$event.target.blur()"
								:rules="[v => !!v || $t('Обязательное поле')]"
								required
							></v-text-field>
							<v-text-field
								v-model="targetGrantCount"
								:label="$t('Из них целевой грант')"
								type="number"
								@wheel="$event.target.blur()"
								:rules="[v => +v <= placeCount || $t('Целевой грант не может быть больше чем количество мест')]"
							></v-text-field>
							<v-divider class="my-4"></v-divider>

							<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
						</v-form>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" text @click.stop="addPlaceSubmit">
							{{ $t('Добавить') }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-divider class="my-6"></v-divider>
			<v-row>
				<v-col>
					<v-data-table
						:headers="placeHeaders"
						:items="placeList"
						:loading="isLoading"
						hide-default-footer
						hide-default-header
						:footer-props="{'items-per-page-options': [-1]}"
						class="elevation-1 place-list">
						<template v-slot:header>
					<thead class="v-data-table-header">
					<tr>
						<th v-for="(headerItem, headerIndex) in placeHeaders" :key="headerIndex" class="text-start" :width="headerItem.width">
							<template v-if="headerItem.value == 'payment_type_name'">
								<v-select style="display: inline-block; width: 150px;" class="pt-5"
									v-model="filterPaymentType"
									:items="paymentType"
									@change="getData"
									item-text="name"
									item-value="id" dense clearable
									:label="headerItem.text">
								</v-select>
							</template>
							<template v-else-if="headerItem.value == 'training_type_name'">
								<v-select style="display: inline-block; width: 150px;" class="pt-5"
									v-model="filterTrainingType"
									:items="trainingType"
									@change="getData"
									item-text="name"
									item-value="id" dense clearable
									:label="headerItem.text">
								</v-select>
							</template>
							<template v-else-if="headerItem.value == 'education_type_name'">
								<v-select style="display: inline-block; width: 150px;" class="pt-5"
									v-model="filterEducationType"
									:items="educationTypeList"
									@change="getData"
									item-text="name"
									item-value="id" dense clearable
									:label="headerItem.text">
								</v-select>
							</template>
							<template v-else-if="headerItem.value == 'education_form_name'">
								<v-select style="display: inline-block; width: 140px;" class="pt-5"
									v-model="filterEducationForm"
									:items="educationFormList"
									@change="getData"
									item-text="name"
									item-value="id" dense clearable
									:label="headerItem.text">
								</v-select>
							</template>
							<template v-else>
								{{ headerItem.text }}
							</template>
						</th>
					</tr>
					</thead>
				</template>
						<template v-if="$store.getters.getCollegeInfo.region_ab != '15'" v-slot:item.actions="{ index, item }">
							<v-icon small class="mr-4 show-on-hover" @click.stop="editPlace(index, item)">mdi-pencil</v-icon>
							<v-icon small class="show-on-hover" @click.stop="deletePlace(index, item)">mdi-close</v-icon>
						</template>
						<template v-slot:footer>
							<v-divider class="my-0"></v-divider>
							<v-row v-if="placeHeaders.length" no-gutters>
								<v-spacer></v-spacer>
								<div class="pl-4 py-3 caption">
									{{ $t('Всего') }}:
								</div>
								<template v-for="(item, index) in placeHeaders"  :style="'width: '+item.width+'px;'">
									<div v-if="item.width" :style="'width: '+item.width+'px;'" class="pl-4 py-3" :key="index">
										<strong v-if="item.value == 'grant_count'">{{placeList.reduce((accumulator, item) => accumulator + (+item.grant_count), 0)}}</strong>
									</div>
								</template>
							</v-row>
						</template>
					</v-data-table>
				</v-col>
			</v-row>

			<v-dialog v-model="deletePlaceDialog" width="600" :persistent="actionIsLoading">
				<v-card>
					<v-card-title class="headline lighten-2">{{ $t('Подтвердите удаление') }}</v-card-title>
					<v-card-text>
						<v-divider class="mb-5"></v-divider>
						<h3 class="mb-5">{{currentPlaceItem.specialty_code}} ({{currentPlaceItem.qualification_code}}) – {{currentPlaceItem.name}}</h3>

						<v-form class="form" ref="deletePlaceForm">
							<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
						</v-form>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn color="blue darken-1" text @click.stop="closeEditDeleteDialog">{{ $t('Отмена') }}</v-btn>
						<v-spacer></v-spacer>
						<v-btn color="primary" text @click.stop="deletePlaceSubmit">
							{{ $t('Добавить') }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="editPlaceDialog" width="600" :persistent="actionIsLoading">
				<v-card>
					<v-card-title class="headline lighten-2">{{ $t('Редактировать количество мест') }}</v-card-title>
					<v-card-text>
						<v-divider class="mb-5"></v-divider>
						<h3 class="mb-5">{{currentPlaceItem.specialty_code}} ({{currentPlaceItem.qualification_code}}) – {{currentPlaceItem.name}}</h3>
						<v-text-field
								v-model.number="editPlaceCount"
								:label="$t('Количество мест')"
								type="number"
								min="1"
								:rules="[v => +v > 0 || $t('Минимальное количество мест: 1')]"
								@wheel="$event.target.blur()"
						></v-text-field>
						<v-text-field
								v-model.number="editTargetGrantCount"
								:label="$t('Из них целевой грант')"
								type="number"
								min="1"
								:rules="[v => +v <= editPlaceCount || $t('Целевой грант не может быть больше чем количество мест')]"
								@wheel="$event.target.blur()"
						></v-text-field>
						<v-form class="form" ref="editPlaceForm">
							<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
						</v-form>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn color="blue darken-1" text @click.stop="closeEditDeleteDialog">{{ $t('Отмена') }}</v-btn>
						<v-spacer></v-spacer>
						<v-btn color="primary" text @click.stop="editPlaceSubmit">
							{{ $t('Редактировать') }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</div>
	</div>
</template>

<script>
	export default {
        mounted() {
            this.getData();
        },
		data: () => ({
			isLoading: true,
			placeHeaders: [],
			placeConfig: {},
			placeList: [],
			placeLangList: [],
			placeLangSelected: {},
			trainingType: [],
			trainingTypeSelected: {},
			placeQualificationList: [],
			placeQualificationListFiltered: [],
			placeQualificationSelected: {},
			paymentType: [],
			paymentTypeSelected: null,

			educationFormList: [],
			educationFormSelected: null,
			educationTypeList: [],
			educationTypeSelected: null,

			placeCount: '',
			targetGrantCount: 0,
			addPlaceDialog: false,
			addPlaceDataLoading: false,
			actionIsLoading: false,

			ecpFileData: '',
			ecpPassword: '',

			currentPlaceIndex: '',
			currentPlaceItem: '',
			deletePlaceDialog: false,
			editPlaceCount: null,
			editTargetGrantCount: 0,
			editPlaceDialog: false,

			filterPaymentType: null,
			filterTrainingType: null,
			filterEducationType: null,
			filterEducationForm: null,
		}),
		methods: {
			async showAddPlace() {
				this.addPlaceDataLoading = true;

				if(!this.placeQualificationList.length) {
					await this.$http.get('/qualification').then((response) => {
						if(response.data.status == 'success') {
							this.placeQualificationList = response.data.data;
						}
					});
				}

				if(!this.placeLangList.length) {
					await this.$http.get('/langStudy').then((response) => {
						if(response.data.status == 'success') {
							this.placeLangList = response.data.data;
						}
					});
				}

				this.addPlaceDialog = true;
				this.addPlaceDataLoading = false;
			},
			customQualificationFilter(item, queryText) {
				const qualificationCode = item.qualification_code.toLowerCase();
				const specialtyCode = item.specialty_code.toLowerCase();
				const name = item.name.toLowerCase();
				const searchText = queryText.toLowerCase();
				return qualificationCode.indexOf(searchText) > -1 || specialtyCode.indexOf(searchText) > -1 || name.indexOf(searchText) > -1;
			},
			async addPlaceSubmit() {
				if(this.$refs.addPlaceForm.validate()) {
					this.actionIsLoading = true;
					await this.$http.put('/capacity', {
						"qualification_code": this.placeQualificationSelected.qualification_code,
						"lang_short": this.placeLangSelected.short,
						"grant_count": this.placeCount,
						"target_grant_count": this.targetGrantCount,
						"training_type_id": this.trainingTypeSelected.id,
						"payment_type_id": this.paymentTypeSelected,
						"education_form_id": this.educationFormSelected,
						"education_type_id": this.educationTypeSelected,						
						"p12": this.ecpFileData,
						"password": this.ecpPassword
					}).then(() => {
						this.filterTrainingType = this.trainingTypeSelected.id;
						this.filterPaymentType = this.paymentTypeSelected;

						this.filterEducationType = this.educationTypeSelected;
						this.filterEducationForm = this.educationFormSelected;

						this.getData();

						this.$store.dispatch('alertAdd', {text: "success", type: 'success'});
						this.addPlaceDialog = false;
						
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			},
			deletePlace(index, item) {
				this.currentPlaceIndex = index;
				this.currentPlaceItem = item;
				this.deletePlaceDialog = true;
			},
			editPlace(index, item) {
				this.currentPlaceIndex = index;
				this.currentPlaceItem = item;
				this.editPlaceDialog = true;
				this.editPlaceCount = item.grant_count;
				this.editTargetGrantCount = item.target_grant_count;
			},
			closeEditDeleteDialog() {
				this.currentPlaceIndex = '';
				this.currentPlaceItem = '';
				this.deletePlaceDialog = false;
				this.editPlaceDialog = false;
				this.editPlaceCount = null;
				this.editTargetGrantCount = 0;
			},
			async deletePlaceSubmit() {
				if(this.$refs.deletePlaceForm.validate()) {
					this.actionIsLoading = true;
					await this.$http.delete('/capacity', {
						data: {
							"id": this.currentPlaceItem.id,
							"p12": this.ecpFileData,
							"password": this.ecpPassword
						}
					}).then(() => {
						this.placeList.splice(this.currentPlaceIndex, 1);
						this.$store.dispatch('alertAdd', {text: "success", type: 'success'});
						this.deletePlaceDialog = false;
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			},
			async editPlaceSubmit() {
				if(this.$refs.editPlaceForm.validate()) {
					this.actionIsLoading = true;
					await this.$http.patch('/capacity/'+this.currentPlaceItem.id, {
						"count": this.editPlaceCount,
						"target_grant_count": this.editTargetGrantCount,
						"p12": this.ecpFileData,
						"password": this.ecpPassword
					}).then(() => {
						this.$store.dispatch('alertAdd', {text: "success", type: 'success'});
						this.currentPlaceItem.grant_count = this.editPlaceCount;
						this.currentPlaceItem.target_grant_count = this.editTargetGrantCount;
						this.editPlaceDialog = false;
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			},
			async getData() {
				this.isLoading = true;

				if(!this.trainingType.length) {
					this.$http.get('/trainingType').then((response) => {
						this.trainingType = response.data.data;
					});
				}

				if(!this.paymentType.length) {
					this.$http.get('/paymentType').then((response) => {
						this.paymentType = response.data.data;
					});
				}

				if(!this.educationFormList.length) {
					this.$http.get('/educationForm').then((response) => {
						this.educationFormList = response.data.data;
					});
				}

				if(!this.educationTypeList.length) {
					this.$http.get('/educationType').then((response) => {
						this.educationTypeList = response.data.data;
					});
				}

				await this.$http.get("/capacity?q"+
				(this.filterTrainingType ? "&training_type_id="+this.filterTrainingType : '')+
				(this.filterPaymentType ? "&payment_type_id="+this.filterPaymentType : '')+
				(this.filterEducationType ? "&education_type_id="+this.filterEducationType : '')+
				(this.filterEducationForm ? "&education_form_id="+this.filterEducationForm : '')).then((response) => {
					this.placeConfig = response.data.data.capacityList.config;
					this.placeHeaders = response.data.data.capacityList.headers;
					//if(this.placeConfig.can_delete) {
						this.placeHeaders.push({value: 'actions', sortable: false, align: 'end', width: '80'});
					//}
					this.placeList = response.data.data.capacityList.list;
					this.isLoading = false;
				});
			}
		},
		watch: {
			paymentTypeSelected(v) {
				if(v == 2) {
					this.educationFormSelected = "1";
				}
			},
			trainingTypeSelected: function(v) {
				this.placeQualificationSelected = {};
				if(v.id == '2') {
					this.paymentTypeSelected = '2';
					this.placeQualificationListFiltered = this.placeQualificationList.filter(item => item.qualification_code.indexOf('3W') === 0);
				} else {
					this.placeQualificationListFiltered = this.placeQualificationList.filter(item => item.qualification_code.indexOf('3W') == -1);
				}
			},
			addPlaceDialog: function (v) {
				if(!v) {
					this.$refs.addPlaceForm.resetValidation();
					this.placeCount = '';
					this.targetGrantCount = 0;
					this.placeLangSelected = {};
					this.placeQualificationSelected = {};
					this.placeQualificationListFiltered = [];
					this.trainingTypeSelected = {};
					this.paymentTypeSelected = null;
					this.educationTypeSelected = null;
					this.educationFormSelected = null;
				}
			},
			deletePlaceDialog(v) {
				if(!v) {
					this.$refs.deletePlaceForm.resetValidation();
					this.closeEditDeleteDialog();
				}
			},
			editPlaceDialog(v) {
				if(!v) {
					this.$refs.editPlaceForm.resetValidation();
					this.closeEditDeleteDialog();
				}
			}
		}
  }
</script>

<style scoped>
	/*.place-list tbody tr .show-on-hover {
		visibility: hidden;
	}
	.place-list tbody tr:hover .show-on-hover {
		visibility: visible;
	}*/
</style>


<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type=number] {
		-moz-appearance: textfield;
	}

	th label, th input, th .v-input {
		font-size: 12px !important;
		font-weight: 700;
	}
</style>