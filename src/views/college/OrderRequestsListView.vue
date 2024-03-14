<template>
	<div>
		<div class="panel-header panel-header-custom bg-primary-gradient">
			<div class="page-inner py-5">
				<div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
					<div>
						<h2 class="text-white pb-2 fw-bold">{{ titles[$route.params.filter] }}</h2>
					</div>
					<div class="ml-md-auto py-2 py-md-0 text-right" v-if="!['examAppoint', 'examGrades', 'exam', 'acs'].includes($route.params.filter)">
						<v-btn depressed class="btn btn-secondary btn-round white--text px-5 mb-2" @click.stop="exportToExcel">{{$t('Экспортировать в Excel')}}</v-btn>
						<h5 class="text-white op-7">{{ $t('Передача персональных данных третьим лицам преследуется законом РК') }}</h5>
					</div>
				</div>
			</div>
		</div>
		<div class="page-inner mt--5">
			<v-row v-if="$route.params.filter == 'examAppoint' || $route.params.filter == 'examGrades'" :style="checkedList.length == 0 && 'visibility: hidden;'">
				<v-col class="shrink mb-5" v-if="$route.params.filter == 'examAppoint'">
					<v-btn color="success" rounded @click="scheduleExam" :loading="examActionIsLoading">{{ $t('Назначить экзамен') }}</v-btn>
				</v-col>
				<v-col class="shrink mb-5" v-else-if="$route.params.filter == 'examGrades'">
					<v-btn color="success" rounded @click="putExamGrades" :loading="examActionIsLoading">{{ $t('Выставить оценки') }}</v-btn>
				</v-col>
			</v-row>
			<v-data-table
					:headers="orderRequestsHeaders"
					hide-default-header
					:items="orderRequestsList"
					:loading="isLoading"
					:items-per-page="pagination.itemsPerPage"
					:options.sync="pagination"
					:footer-props="{'items-per-page-options': [15, 30, 50, 100]}"
					:server-items-length="totalItems"
					class="elevation-1 place-list">
				<template v-slot:header="">
					<thead class="v-data-table-header">
					<tr>
						<th width="50" v-if="($route.params.filter == 'examAppoint' || $route.params.filter == 'examGrades') && specialtySelected && educationTypeSelected">
							<v-checkbox @change="checkAll"></v-checkbox>
						</th>
						<th v-for="(headerItem, headerIndex) in orderRequestsHeaders" :key="headerIndex" class="text-start" :width="headerItem.width">
							<template v-if="headerItem.value == 'iin'">
								<v-text-field style="display: inline-block; width: 140px;" class="pt-5"
											v-model="searchIin"
											:label="headerItem.text"
											type="number"
											@wheel="$event.target.blur()"
											clearable
											dense>
								</v-text-field>
							</template>
							<template v-else-if="headerItem.value == 'full_name'">
								<v-text-field style="display: inline-block; width: 250px;" class="pt-5"
											v-model="filterFio"
											:label="headerItem.text"
											type="text"
											clearable
											dense>
								</v-text-field>
							</template>
							<template v-else-if="headerItem.value == 'education_type_name'">
								<v-select style="display: inline-block; width: 150px;" class="pt-5"
											v-model="educationTypeSelected"
											:items="educationTypeList"
											@change="getData"
											item-text="name"
											item-value="id" dense clearable
											:label="headerItem.text">
								</v-select>
							</template>
							<template v-else-if="headerItem.value == 'quota'">
								<v-select style="display: inline-block; width: 110px;" class="pt-5"
										v-model="quotaSelected"
										:items="quotaList"
										@change="getData"
										item-text="name"
										item-value="id" dense clearable
										:label="headerItem.text">
								</v-select>
							</template>
							<template v-else-if="headerItem.value == 'from_site'">
								<v-select style="display: inline-block; width: 110px;" class="pt-5"
										v-model="fromSiteSelected"
										:items="fromSiteList"
										@change="getData"
										item-text="name"
										item-value="id" dense clearable
										:label="headerItem.text">
								</v-select>
							</template>
							<template v-else-if="headerItem.value == 'status_name' && $route.params.filter != 'examAppoint' && $route.params.filter != 'examGrades' && $route.params.filter != 'process' && $route.params.filter != 'accepted' && $route.params.filter != 'rejected' && $route.params.filter != 'recalled' && $route.params.filter != 'new'">
								<v-select style="display: inline-block; width: 150px;" class="pt-5"
										v-model="requestStatusSelected"
										:items="requestStatusList.filter(el => {
											if(['examAppoint', 'examGrades', 'exam'].includes($route.params.filter)) {
												return [1, 3, 4, 6, 9, 10, 11].includes(+el.id);;
											} if(['acs'].includes($route.params.filter)) {
												return [1, 3, 9, 10, 11, 12].includes(+el.id);;
											} else {
												return ![3, 4, 6, 9, 10, 11].includes(+el.id);
											}
										})"
										@change="getData"
										item-text="name"
										item-value="id" dense clearable
										:label="headerItem.text">
								</v-select>
							</template>
							<template v-else-if="headerItem.value == 'specialty_code'">
								<v-select style="display: inline-block; width: 150px;" class="pt-5"
										v-model="specialtySelected"
										:items="specialtyList"
										@change="getData"
										item-text="name"
										item-value="code" dense clearable
										:label="headerItem.text">
								</v-select>
							</template>
							<template v-else-if="headerItem.value == 'qualification_code'">
								<v-select style="display: inline-block; width: 150px;" class="pt-5"
										v-model="qualificationSelected"
										:items="qualificationList"
										@change="getData"
										item-text="name"
										item-value="code" dense clearable
										:label="headerItem.text">
								</v-select>
							</template>
							<template v-else-if="headerItem.value == 'created_at'">
								<v-menu
										v-model="datePickerCreatedAt"
										:close-on-content-click="false"
										:nudge-right="40"
										transition="scale-transition"
										offset-y
										min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
												style="display: inline-block; width: 170px;" class="pt-5"
												v-model="requestCreatedAt"
												:label="headerItem.text"
												readonly
												required dense clearable
												v-bind="attrs"
												v-on="on"
										></v-text-field>
									</template>
									<v-date-picker
											v-model="requestCreatedAt"
											@input="datePickerCreatedAt = false"
									></v-date-picker>
								</v-menu>
							</template>
							<template v-else>
								{{ headerItem.text }}
							</template>
						</th>
					</tr>
					</thead>
				</template>
				<template v-slot:item="{ item, index }">
					<tr>
						<td v-if="($route.params.filter == 'examAppoint' || $route.params.filter == 'examGrades') && specialtySelected && educationTypeSelected">
							<v-checkbox v-model="checkedList" :value="index"></v-checkbox>
						</td>
						<template v-for="(headerItem, headerIndex) in orderRequestsHeaders">
							<td v-if="headerItem.value != 'actions'" :key="headerIndex" @click.stop="handleClick(item)" style="cursor: pointer;">
								{{item[headerItem.value]}}
							</td>
							<td v-else :key="headerIndex">
								<v-tooltip left>
									<template v-slot:activator="{ on, attrs }">
										<span v-bind="attrs" v-on="on">
											<router-link :to="'/college/request/'+item.id" target="_blank" style="text-decoration: none;"><v-icon class="show-on-hover">mdi-open-in-new</v-icon></router-link>
										</span>
									</template>
									<span>{{$t('Открыть в новом окне')}}</span>
								</v-tooltip>
							</td>
						</template>
					</tr>
				</template>
			</v-data-table>
		</div>

		<v-dialog v-if="$route.params.filter == 'examAppoint' && examScheduleDataList.length" v-model="examAppointDialog" width="950" :persistent="examActionIsLoading">
			<v-card>
				<v-card-title class="headline lighten-2">{{ $t('Назначить экзамен') }}</v-card-title>
				<v-card-text>
					<h3 class="black--text">
						{{ specialtyList.filter(item => item.code == specialtySelected)[0].name }}
					</h3>
					
					<v-divider></v-divider>
					<v-form class="form" ref="examForm">
						<template v-for="(item, itemKey) in examScheduleDataList[0]">
							<v-row :key="itemKey">
								<v-col cols="12" class="pb-0"><label><b>{{item.exam_name}}</b></label></v-col>
								<v-col cols="2" class="pb-0">
									<v-menu
											ref="dateMenu"
											v-model="item.examDateDialog"
											:close-on-content-click="false"
											:return-value.sync="item.examDate"
											transition="scale-transition"
											offset-y>
										<template v-slot:activator="{ on, attrs }">
											<v-text-field
													v-model="item.examDate"
													:label="$t('Дата')"
													:disabled="!!item.request_exam_id"
													readonly
													:rules="[v => !!v || $t('Обязательное поле')]"
													v-bind="attrs"
													v-on="on">
											</v-text-field>
										</template>
										<v-date-picker
												v-if="item.examDateDialog"
												v-model="item.examDate"
												@click:date="$refs.dateMenu[itemKey].save(item.examDate)"
										></v-date-picker>
									</v-menu>
								</v-col>
								<v-col cols="2" class="pb-0">
									<v-menu
											ref="timeMenu"
											v-model="item.examTimeDialog"
											:close-on-content-click="false"
											:return-value.sync="item.examTime"
											transition="scale-transition"
											offset-y>
										<template v-slot:activator="{ on, attrs }">
											<v-text-field
													v-model="item.examTime"
													:label="$t('Время')"
													:disabled="!!item.request_exam_id"
													readonly
													:rules="[v => !!v || $t('Обязательное поле')]"
													v-bind="attrs"
													v-on="on">
											</v-text-field>
										</template>
										<v-time-picker
												v-if="item.examTimeDialog"
												v-model="item.examTime"
												format="24hr"
												@click:minute="$refs.timeMenu[itemKey].save(item.examTime)"
										></v-time-picker>
									</v-menu>
								</v-col>
								<v-col class="pb-0">
									<v-text-field
											v-model="item.exam_address"
											:disabled="!!item.request_exam_id"
											:label="$t('Адрес')"
											:rules="[v => !!v || $t('Обязательное поле')]"
											type="text"
									></v-text-field>
								</v-col>
								<v-col class="pb-0" cols="2" v-if="!!item.request_exam_id">
									<v-select
											v-model="item.localMark"
											:items="examMarks.filter(el => el.type == item.grade_type)"
											item-text="name"
											:disabled="!!item.mark"
											item-value="id"
											:label="$t('Оценка')">
									</v-select>
								</v-col>
							</v-row>
							<v-divider :key="itemKey+'1'" class="my-6"></v-divider>
						</template>
					</v-form>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" text @click.stop="scheduleExamSubmit" :loading="examActionIsLoading">
						{{ $t('Сохранить') }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-if="$route.params.filter == 'examGrades' && examScheduleDataList.length" v-model="examGradesDialog" width="970" :persistent="examActionIsLoading">
			<v-card>
				<v-card-title class="headline lighten-2">{{ $t('Выставить оценки') }}</v-card-title>
				<v-card-text>
					<h3 class="black--text">
						{{ specialtyList.filter(item => item.code == specialtySelected)[0].name }}
					</h3>
					
					<v-divider></v-divider>
					
					<v-form class="form" ref="examForm">
						<div v-for="(value, index) in checkedList" :key="index">
							<v-row>
								<v-col cols="3">
									<label><b>{{ orderRequestsList[value].full_name }}</b></label>
								</v-col>
								<v-col v-for="(item, itemKey) in examScheduleDataList[index]" :key="itemKey">
									<b>{{item.exam_name}}</b>
									<v-select
											v-model="item.localMark"
											:items="examMarks.filter(el => el.type == item.grade_type)"
											item-text="name"
											:disabled="!!item.mark"
											item-value="id"
											:label="$t('Оценка')">
									</v-select>
								</v-col>
							</v-row>
							<v-divider class="my-3"></v-divider>
						</div>
						<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
					</v-form>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" text @click.stop="examGradesSubmit" :loading="examActionIsLoading">
						{{ $t('Сохранить') }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	export default {
		mounted() {
			this.getFilterParams();
			this.setFilter(this.$route.params.filter);
			this.titles = {
				"all": this.$t('Все заявки'),
				"new": this.$t('Новые заявки'),
				"paid": this.$t('Платное обучение'),
				"work": this.$t('Рабочие квалификации'),
				"exam": this.$t('Все экзамены'),
				"acs": this.$t('Оценки СКБ'),
				"wrong": this.$t('Некорректные заявки'),
				"process": this.$t('В обработке'),
				"accepted": this.$t('Принятые'),
				"rejected": this.$t('Отказанные'),
				"recalled": this.$t('Отозванные'),
				"examAppoint": this.$t('Назначение экзамена'),
				"examGrades": this.$t('Выставить оценки экзамена'),
			};
		},
		data: () => ({
			subDir: null,
			filter: '',
			isLoading: true,
			orderRequestsHeaders: [],
			orderRequestsList: [],
			totalItems: 0,
			pagination: {
				itemsPerPage: 15,
				page: 1
			},
			searchIin: null,
			requestStatusList: [],
			requestStatusSelected: null,
			fromSiteList: [],
			fromSiteSelected: null,
			datePickerCreatedAt: false,
			requestCreatedAt: null,
			filterFio: null,
			timeoutId: null,
			quotaList: [],
			quotaSelected: null,
			educationTypeList: [],
			educationTypeSelected: null,
			qualificationList: [],
			qualificationSelected: null,
			specialtyList: [],
			specialtySelected: null,
			fullFilter: '',
			titles: {},
			checkedList: [],
			examActionIsLoading: false,
			examScheduleDataList: [],
			examMarks: [],
			examAppointDialog: false,
			examGradesDialog: false,
		}),
		methods: {
			setFilter(filter) {
				this.orderRequestsHeaders = [];
				this.orderRequestsList = [];
				this.totalItems = 0;

				if (filter == 'new') {
					this.filter = '?payment_type=2&status_id=1&date_order_by=DESC';
				} else if (filter == 'paid') {
					this.filter = '?payment_type=1&date_order_by=DESC';
				} else if (filter == 'work') {
					this.filter = '?training_type_id=2&date_order_by=DESC';
				} else if (filter == 'exam') {
					this.subDir = '/exam';
					this.filter = '?date_order_by=DESC';
				} else if (filter == 'examAppoint') {
					this.subDir = '/exam';
					this.requestStatusSelected = '1';
					this.filter = '?date_order_by=DESC';
				} else if (filter == 'examGrades') {
					this.subDir = '/exam';
					this.requestStatusSelected = '4';
					this.filter = '?date_order_by=DESC';
				} else if (filter == 'acs') {
					this.subDir = '/acs';
					this.filter = '?date_order_by=DESC';
				} else if (filter == 'wrong') {
					this.subDir = '/wrong';
					this.filter = '?date_order_by=DESC';
				} 
				
				
				else if (filter == 'process') {
					this.requestStatusSelected = '8';
				} else if (filter == 'accepted') {
					this.requestStatusSelected = '2';
				} else if (filter == 'rejected') {
					this.requestStatusSelected = '5';
				} else if (filter == 'recalled') {
					this.requestStatusSelected = '7';
				} 
				
				
				else {
					this.filter = '?payment_type=2&date_order_by=DESC';
				}
			},
			handleClick(link) {
				this.$router.push({path: '/college/request/' + link.id});
			},
			async getData() {
				this.isLoading = true;
				this.fullFilter = this.filter +
						"&limit=" + (['acs'].includes(this.$route.params.filter) ? -1 : this.pagination.itemsPerPage)  +
						"&page=" + this.pagination.page +
						(this.requestStatusSelected ? "&status_id=" + this.requestStatusSelected : "") +
						(this.fromSiteSelected ? "&from_site=" + this.fromSiteSelected : "") +
						(this.educationTypeSelected ? "&education_type_id=" + this.educationTypeSelected : "") +
						(this.quotaSelected ? "&is_have_quota=" + this.quotaSelected : "") +
						(this.requestCreatedAt ? "&date=" + this.requestCreatedAt : "") +
						(this.specialtySelected ? "&specialty_code=" + this.specialtySelected : "") +
						(this.qualificationSelected ? "&qualification_code=" + this.qualificationSelected : "") +
						(this.searchIin && this.searchIin.length === 12 ? "&iin=" + this.searchIin : "") +
						(this.filterFio && this.filterFio.length > 3 ? "&fio=" + this.filterFio.replace(/  +/g, ' ') : "");
				await this.$http.get(
						"/request/order"+ (this.subDir ? this.subDir : '') + this.fullFilter
				).then((response) => {
					this.orderRequestsHeaders = response.data.data.request.headers;
					this.orderRequestsHeaders.push({value: 'actions', sortable: false, align: 'end', width: '50'});

					this.orderRequestsList = response.data.data.request.list;
					this.totalItems = +response.data.data.request.total;
				});
				this.isLoading = false;
			},

			getFilterParams() {
				this.isLoading = true;
				if (!this.requestStatusList.length) {
					this.$http.get('/requestStatus').then((response) => {
						this.requestStatusList = response.data.data;
					});
				}
				if (!this.fromSiteList.length) {
					this.$http.get('/fromSite').then((response) => {
						this.fromSiteList = response.data.data;
					});
				}
				if (!this.educationTypeList.length) {
					this.$http.get('/educationType').then((response) => {
						this.educationTypeList = response.data.data;
					});
				}
				if (!this.quotaList.length) {
					this.$http.get('/quota').then((response) => {
						this.quotaList = response.data.data;
					});
				}
				if (!this.qualificationList.length) {
					this.$http.get('/capacity/qualification').then((response) => {
						this.qualificationList = response.data.data;
					});
				}
				if (!this.specialtyList.length) {
					this.$http.get('/capacity/specialty').then((response) => {
						this.specialtyList = response.data.data;
					});
				}
				this.isLoading = false;
			},
			exportToExcel() {
				this.$http.get('/request/excel' + this.fullFilter, {responseType: 'blob'}).then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', this.$t('Заявки')+'.xls');
					document.body.appendChild(link);
					link.click();
					link.remove();
				}).catch(() => {});
			}, 
			checkAll(val) {
				if(val) {
					this.orderRequestsList.map((el, index) => {
						this.checkedList.push(index);
					});
				} else {
					this.checkedList = [];
				}
			},
			async scheduleExam() {
				this.examScheduleDataList = [];
				this.examActionIsLoading = true;
				for (let i = 0; i < this.checkedList.length; i++) {
					let index = this.checkedList[i];
					await this.$http.get('/request/order/'+this.orderRequestsList[index].id+'/qualification/'+this.orderRequestsList[index].roq_id+'/examList').then(async (response) => {
						this.examScheduleDataList.push(response.data.data);
					}).catch(() => {});
					
					if(i === 0) {
						for(let item of this.examScheduleDataList[0]) {
							if(item.request_exam_id) {
								await this.getExamMarks();
							}
							if(item.exam_date) {
								item.examDate = item.exam_date.split(' ')[0];
								item.examTime = item.exam_date.split(' ')[1];
							}
							if(item.mark) {
								item.localMark = item.mark;
							}
						}
					}
					this.examAppointDialog = true;
				}
				
				this.examActionIsLoading = false;
			},
			async putExamGrades() {
				this.examScheduleDataList = [];
				this.examActionIsLoading = true;
				for (let i = 0; i < this.checkedList.length; i++) {
					let index = this.checkedList[i];
					await this.$http.get('/request/order/'+this.orderRequestsList[index].id+'/qualification/'+this.orderRequestsList[index].roq_id+'/examList').then(async (response) => {
						this.examScheduleDataList.push(response.data.data);
					}).catch(() => {});

					for (let index = 0; index < this.examScheduleDataList.length; index++) {
						for(let item of this.examScheduleDataList[index]) {
							if(item.request_exam_id) {
								await this.getExamMarks();
							}
							if(item.mark) {
								item.localMark = item.mark;
							}
						}
						}
				}
				this.examGradesDialog = true;
				this.examActionIsLoading = false;
			},
			async getExamMarks() {
				this.examActionIsLoading = true;
				if(!this.examMarks.length) {
					await this.$http.get('/grade').then((response) => {
						this.examMarks = response.data.data;
					}).catch(() => {});
				}
				this.examActionIsLoading = false;
			},
			async scheduleExamSubmit() {
				if(this.$refs.examForm.validate()) {
					this.examActionIsLoading = true;
					for (let index = 0; index < this.checkedList.length; index++) {
						let rowIndex = this.checkedList[index];
						let examItem = this.examScheduleDataList[index];
						if(index === 0) {
							examItem.forEach((item) => {
								if(item.examDate && item.examTime) {
									item.exam_date = item.examDate+' '+item.examTime;
								}
								if(item.localMark) {
									item.mark = item.localMark;
								}
							});
						} else {
							examItem.forEach((item, i) => {
								item.exam_date = this.examScheduleDataList[0][i].exam_date;
								// item.mark = this.examScheduleDataList[0][i].mark;
								item.exam_address = this.examScheduleDataList[0][i].exam_address;
							});
						}

						let sendData = {
							"exam": examItem
						};

						await this.$http.post('/request/order/'+this.orderRequestsList[rowIndex].id+'/qualification/'+this.orderRequestsList[rowIndex].roq_id+'/exam', sendData).then(() => {}).catch(() => {});
						
					}
					this.examActionIsLoading = false;
					this.examAppointDialog = false;
					await this.getData();
				}
			},
			async examGradesSubmit() {
				if(this.$refs.examForm.validate()) {
					this.examActionIsLoading = true;
					for (let index = 0; index < this.checkedList.length; index++) {
						let rowIndex = this.checkedList[index];
						let examItem = this.examScheduleDataList[index];

						examItem.forEach((item) => {
							if(item.examDate && item.examTime) {
								item.exam_date = item.examDate+' '+item.examTime;
							}
							if(item.localMark) {
								item.mark = item.localMark;
							}
						});

						let sendData = {
							"exam": examItem
						};
						
						sendData.p12 = this.ecpFileData;
						sendData.password = this.ecpPassword;

						await this.$http.post('/request/order/'+this.orderRequestsList[rowIndex].id+'/qualification/'+this.orderRequestsList[rowIndex].roq_id+'/exam', sendData).then(() => {}).catch(() => {});
						
					}
					this.examActionIsLoading = false;
					this.examGradesDialog = false;
					await this.getData();
				}
			},
		},
		watch: {
			pagination() {
				this.getData();
			},
			$route(to) {
				this.subDir = null;
				this.requestStatusSelected = null;
				this.qualificationSelected = null;
				this.specialtySelected = null;
				this.fromSiteSelected = null;
				this.datePickerCreatedAt = false;
				this.requestCreatedAt = null;
				this.filterFio = null;
				this.timeoutId = null;
				this.quotaSelected = null;
				this.educationTypeSelected = null;
				this.checkedList = [];

				this.setFilter(to.params.filter);

				if (this.pagination.page == 1) {
					this.getData();
				} else {
					this.pagination.page = 1;
				}
			},
			specialtySelected(v) {
				if(!v) {
					this.checkedList = [];
				}
			},
			educationTypeSelected(v) {
				if(!v) {
					this.checkedList = [];
				}
			},
			examAppointDialog(v) {
				if(!v) {
					this.examScheduleDataList = [];
				}
			},
			examGradesDialog(v) {
				if(!v) {
					this.examScheduleDataList = [];
				}
			},
			searchIin(/*v*/) {
				//if (v && v.length === 12) {
				this.getData();
				//}
			},
			filterFio(v) {
				if (this.timeoutId) {
					clearTimeout(this.timeoutId);
				}
				this.timeoutId = setTimeout(() => {
					if (v == null || (v.length > 3 || v.length === 0)) {
						this.getData();
					}
				}, 1000);
			},
			requestCreatedAt() {
				this.getData();
			}
		}
	}
</script>

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