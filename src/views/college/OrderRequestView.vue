<template>
	<div>
		<div class="page-inner">
			<v-row>
				<v-col lg="4" md="5" cols="12">
					<template v-if="Object.keys(requestInfo).length != 0">
						<template v-if="+requestInfo.values.request_status.value.id == 1">
							<v-btn block color="warning" class="mb-4" @click.stop="notificationDialog = true">
								{{ $t('Уведомить о поступлении заявки') }}
							</v-btn>
							<v-dialog v-model="notificationDialog" width="500" :persistent="actionIsLoading">
								<v-card>
									<v-card-title class="headline lighten-2">{{ $t('Уведомить о поступлении заявки') }}</v-card-title>
									<v-card-text>
										<v-form class="form" ref="notificationForm">
											<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
										</v-form>
									</v-card-text>
									<v-divider></v-divider>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="primary" text @click.stop="notificationSubmit" :loading="actionIsLoading">
											{{ $t('Подписать') }}
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</template>
						<template v-if="+requestInfo.values.request_status.value.id == 8">
              <v-btn block color="success" class="mb-4" @click.stop="showAcceptDialog">{{ $t('Принять заявку') }}</v-btn>
							<v-dialog v-model="acceptDialog" :width="(requestInfo.values.education_type.value.id == 1 || requestInfo.values.education_type.value.id == 2) && requestInfo.values.payment_type.value.id == 2 && !requestInfo.values.is_undeveloped_place ? null : 600" :persistent="actionIsLoading">
								<v-card>
									<v-card-title class="headline lighten-2">{{ $t('Принять заявку') }}</v-card-title>
									<v-card-text>
										<v-form class="form" ref="acceptForm">
											<v-alert v-if="requestInfo.values.is_undeveloped_place"
													dense
													outlined
													type="error">
												{{ $t('Это заявка отправлено на неосвоенное место. Если нажимаете кнопку принять, заявка принимается сразу. Просим быть внимательными!') }}
											</v-alert>
											<template v-if="(requestInfo.values.education_type.value.id == 1 || requestInfo.values.education_type.value.id == 2) && requestInfo.values.payment_type.value.id == 2 && !requestInfo.values.is_undeveloped_place">
												<v-row>
													<v-col md="8" cols="12" v-if="requestDate.education_info.values.education_document.file_name.split('.')[requestDate.education_info.values.education_document.file_name.split('.').length - 1].toLowerCase() != 'pdf'">
														<img :src="requestDate.education_info.values.education_document.value" width="100%">
													</v-col>
													<v-col md="8" cols="12" v-else>
														<embed :src="requestDate.education_info.values.education_document.value" type="application/pdf" style="height: 70vh" width="100%">
													</v-col>
													<v-col md="4" cols="12">
														<v-row>
															<v-col class="pa-0 pr-2" lg="4" md="6" cols="12" v-for="(item, key) in certificatePredmetList" :key="key">
																<v-text-field
																	v-model="item.grade"
																	:label="item.name"
																	type="text"
																	autocomplete="off"
																	:rules="[v => !+item.profile_predmet_id || !!v || $t('Обязательное поле')]"
																></v-text-field> 
															</v-col>
														</v-row>
													</v-col>
												</v-row>
												<v-divider class="my-3" />
												<v-row>
													<v-col md="8" cols="12">
														<p></p>
														<v-row v-if="requestInfo.values.from_site.value == 'EGOV'">
															<v-col md="6" cols="12">
																<v-text-field
																		v-model="orderNo"
																		:label="$t('Введите номер расписки')"
																		type="text"
																		:rules="[v => !!v || $t('Обязательное поле')]"
																		required
																		autocomplete="off"
																></v-text-field>
															</v-col>
															<v-col md="6" cols="12">
																<v-menu
																		v-model="datePickerMenu"
																		:close-on-content-click="false"
																		:nudge-right="40"
																		transition="scale-transition"
																		offset-y
																		min-width="auto">
																	<template v-slot:activator="{ on, attrs }">
																		<v-text-field
																				v-model="orderDate"
																				:label="$t('Введите дату расписки')"
																				readonly
																				prepend-icon="mdi-calendar"
																				:rules="[v => !!v || $t('Обязательное поле')]"
																				required
																				v-bind="attrs"
																				v-on="on"
																				autocomplete="off"
																		></v-text-field>
																	</template>
																	<v-date-picker
																			v-model="orderDate"
																			@input="datePickerMenu = false"
																	></v-date-picker>
																</v-menu>
															</v-col>
														</v-row>
													</v-col>
													<v-col md="4" cols="12">
														<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
													</v-col>
												</v-row>
											</template>
											<template v-else>
												<v-row v-if="requestInfo.values.from_site.value == 'EGOV'">
													<v-col md="6" cols="12">
														<v-text-field
																v-model="orderNo"
																:label="$t('Введите номер расписки')"
																type="text"
																:rules="[v => !!v || $t('Обязательное поле')]"
																required
																autocomplete="off"
														></v-text-field>
													</v-col>
													<v-col md="6" cols="12">
														<v-menu
																v-model="datePickerMenu"
																:close-on-content-click="false"
																:nudge-right="40"
																transition="scale-transition"
																offset-y
																min-width="auto">
															<template v-slot:activator="{ on, attrs }">
																<v-text-field
																		v-model="orderDate"
																		:label="$t('Введите дату расписки')"
																		readonly
																		prepend-icon="mdi-calendar"
																		:rules="[v => !!v || $t('Обязательное поле')]"
																		required
																		v-bind="attrs"
																		autocomplete="off"
																		v-on="on"
																></v-text-field>
															</template>
															<v-date-picker
																	v-model="orderDate"
																	@input="datePickerMenu = false"
															></v-date-picker>
														</v-menu>
													</v-col>
												</v-row>
												<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
											</template>
										</v-form>
									</v-card-text>
									<v-divider></v-divider>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="primary" text @click.stop="acceptSubmit" :loading="actionIsLoading">
											{{ $t('Подписать') }}
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>

							<v-btn block color="error" class="mb-4" @click.stop="getRejectReasonList">{{ $t('Отклонить заявку') }}</v-btn>
							<v-dialog v-model="rejectDialog" width="600" :persistent="actionIsLoading">
								<v-card>
									<v-card-title class="headline lighten-2">{{ $t('Отклонить заявку') }}</v-card-title>
									<v-card-text>
										<v-form class="form" ref="rejectForm">
											<v-select
												v-model="rejectReasonSelected"
												:items="rejectReasonList"
												item-text="name"
												item-value="id"
												:label="$t('Причина отказа')"
												:rules="[v => Object.keys(v).length != 0 || $t('Обязательное поле')]"
												return-object>
												<template v-slot:item="{ item }">
													<div style="max-width: 500px;" class="py-3">
														{{item.name}}
													</div>
												</template>
											</v-select>
											<template v-if="rejectReasonSelected.id == '1' || rejectReasonSelected.id == '2'">
												<v-textarea
													v-model="rejectReasonTextRu"
													:label="$t('Уточнение причины отказа на русском языке')"
													rows="2" filled auto-grow
													:rules="[v => !!v || $t('Обязательное поле')]"
												></v-textarea>
												<v-textarea
													v-model="rejectReasonTextKk"
													:label="$t('Уточнение причины отказа на казахском языке')"
													value=""
													rows="2" filled auto-grow
													:rules="[v => !!v || $t('Обязательное поле')]"
												></v-textarea>
											</template>
											<template v-if="rejectReasonSelected.id == '7'">
												<v-textarea
													v-model="rejectReasonTextRu"
													:label="$t('Перечень отсутствующих документов на русском языке')"
													value=""
													rows="2" filled auto-grow
													:rules="[v => !!v || $t('Обязательное поле')]"
												></v-textarea>
												<v-textarea
													v-model="rejectReasonTextKk"
													:label="$t('Перечень отсутствующих документов на казахском языке')"
													value=""
													rows="2" filled auto-grow
													:rules="[v => !!v || $t('Обязательное поле')]"
												></v-textarea>
											</template>

											<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
										</v-form>
									</v-card-text>
									<v-divider></v-divider>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="primary" text @click.stop="rejectSubmit" :loading="actionIsLoading">
											{{ $t('Подписать') }}
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</template>
						
						<!-- <template v-if="+requestInfo.values.request_status.value.id == 2">
							<v-btn block color="success" class="mb-4">{{ $t('Назначить экзамен') }}</v-btn>
						</template> -->
						<template v-if="+requestInfo.values.request_status.value.id != 1">
							<v-btn block color="info" class="mb-4" @click.stop="exportToExcel">
								{{ $t('Экспортировать в Excel') }}
							</v-btn>

							<v-btn block color="success" class="mb-4" @click.stop="printElement('print')">
								{{ $t('Распечатать заявку') }}
							</v-btn>
							
							<div id="print" style="display: none">
								<br>
								<template v-if="$store.getters.getLanguage == 'ru'">
									<h1>Форма электронного заявления</h1>
									<br>
									<p>Фамилия, имя, отчество поступающего: <b>{{ requestDate.main_info.values.full_name.value }}</b></p>
									<p>ИИН: <b>{{ requestDate.main_info.values.iin.value }}</b></p>
									<p>Контактный телефон: <b>+{{ requestDate.contact_info.values.phone_number.value }}</b>, <b>+{{ requestDate.contact_info.values.parent_phone_number.value }} (Номер телефона родителя)</b></p>

									<div v-for="(item, key, index) in requestQualification" :key="key">
										<p>Код и наименование {{index+1}} специальности и организации ТиППО:</p>
										<div style="margin-left: 20px">
											<p>Специальность: <b>{{item.values.specialty_code.value}} – {{item.values.specialty_name.value}}</b></p>
											<p>Квалификации: <b>{{item.values.qualification_code.value}} – {{item.values.qualification_name.value}}</b></p>
											<p>Язык обучения: <b>{{item.values.lang_study.value}}</b></p>
											<p>ТиППО: <b>{{$store.getters.getCollegeInfo.college_name}}</b></p>
										</div>
									</div>

									<p>Базовое образование: <b>{{ requestDate.education_info.values.education_type.value }}</b></p>
									<p>Предусматривается квота приема: <b>{{ requestDate.quota_info ? requestDate.quota_info.values.quota_type_name.value : 'НЕТ' }}</b></p>
									<p><b>С Единой инструкцией по проведению Конкурса ознакомлен(-а): ДА</b></p>
									<p><b>Даю согласие на сбор, обработку персональных данных: ДА</b></p>
								</template>
								<template v-else>
									<h1>Өтініш нысаны</h1>
									<br>
									<p>Түсушінің аты-жөні: <b>{{ requestDate.main_info.values.full_name.value }}</b></p>
									<p>ЖСН: <b>{{ requestDate.main_info.values.iin.value }}</b></p>
									<p>Байланыс телефоны: <b>+{{ requestDate.contact_info.values.phone_number.value }}</b>, <b>+{{ requestDate.contact_info.values.parent_phone_number.value }} (Ата-анасының телефон нөмірі)</b></p>

									<div v-for="(item, key, index) in requestQualification" :key="key">
										<p>№{{index+1}} мамандықтың атауы және коды және ТжКОББ ұйымының атауы:</p>
										<div style="margin-left: 20px">
											<p>Мамандық: <b>{{item.values.specialty_code.value}} – {{item.values.specialty_name.value}}</b></p>
											<p>Біліктілік: <b>{{item.values.qualification_code.value}} – {{item.values.qualification_name.value}}</b></p>
											<p>Оқу тілі: <b>{{item.values.lang_study.value}}</b></p>
											<p>ТжКОББ: <b>{{$store.getters.getCollegeInfo.college_name}}</b></p>
										</div>
									</div>

									<p>Базалық білім: <b>{{ requestDate.education_info.values.education_type.value }}</b></p>
									<p>Қабылдау квотасы қарастырылған: <b>{{ requestDate.quota_info ? requestDate.quota_info.values.quota_type_name.value : 'ЖОҚ' }}</b></p>
									<p><b>Конкурс өткізу бойынша Бірыңғай нұсқаулықпен таныстым: ИЯ</b></p>
									<p><b>Дербес деректерді жинақтауға, өңдеуге келісім беремін: ИЯ</b></p>
								</template>
							</div>



						</template>
						<v-divider class="my-6" />
					</template>
					<v-card elevation="2" class="mb-5">
						<v-card-title class="card-title-custom">{{requestInfo.name}}</v-card-title>
						<v-card-text class="request-data card-text-custom pt-4">
							<v-row v-for="(item, itemKey) in requestInfo.values" :key="itemKey">
								<v-col cols="5">{{item.name}}:</v-col>
								<v-col cols="7">
									<template v-if="item.type == 'handbook' || item.type == 'boolean'">
										{{item.value.name}}
									</template>
									<template v-else-if="item.type == 'email'">
										<a :href="'mailto:'+item.value">{{item.value}}</a>
									</template>
									<template v-else-if="item.type == 'tel'">
										{{item.value}}<br>
										<v-btn v-if="item.value" :href="'https://wa.me/7'+item.value.match(/\d+/g).join('').slice(-10)+''" target="_blank" depressed x-small color="green darken-1" dark>
<!--											<v-icon left>mdi-phone</v-icon>--> Написать в Whatsapp
										</v-btn>
									</template>
									<template  v-else-if="item.type != 'file'">
										{{item.value}}
									</template>
									<template v-else>
										<a :href="item.value" :download="item.fileName">{{item.fileName}}</a>
									</template>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col>
					<v-card elevation="2" v-if="Object.keys(requestDecisionInfo).length != 0" class="mb-5">
						<v-alert outlined :color="(requestInfo.values.request_status.value.id == 2 ? 'green' : 'red')+' darken-2'" class="pa-0">
							<v-card-title class="card-title-custom">{{requestDecisionInfo.name}}</v-card-title>
							<v-card-text class="request-data card-text-custom pt-4">
								<v-row v-for="(item, itemKey) in requestDecisionInfo.values" :key="itemKey">
									<v-col>{{item.name}}:</v-col>
									<v-col v-if="item.type == 'handbook' || item.type == 'boolean'">{{item.value.name}}</v-col>
									<v-col v-else-if="item.type != 'file'">{{item.value}}</v-col>
									<v-col v-else><a :href="item.value" :download="item.fileName">{{item.fileName}}</a></v-col>
								</v-row>
							</v-card-text>
						</v-alert>
					</v-card>
					<template v-if="Object.keys(requestQualification).length != 0">
						<v-card elevation="2" v-for="(panel, panelKey) in requestQualification" :key="panelKey" class="mb-5">
							<v-card-title class="card-title-custom">{{panel.name}}</v-card-title>
							<v-card-text class="request-data card-text-custom pt-4">
								<template v-for="(item, itemKey) in panel.values">
									<v-row :key="itemKey">
										<v-col>{{item.name}}:</v-col>
										<v-col v-if="item.type == 'handbook' || item.type == 'boolean'">{{item.value.name}}</v-col>
										<v-col v-else-if="item.type != 'file'">{{item.value}}</v-col>
										<v-col v-else><a :href="item.value" :download="item.fileName">{{item.fileName}}</a></v-col>
									</v-row>
									<template v-if="item.childs">
										<template v-for="(childItem, childKey) in item.childs">
											<v-row :key="childKey">
												<v-col>
													<div class="mb-3"><b>{{childItem.exam_name.value}}</b></div>
													<v-row>
														<v-col><div class="ml-4">{{childItem.exam_date.name}}:</div></v-col>
														<v-col>
															<v-row>
																<v-col>{{childItem.exam_date.value}}</v-col>
																<v-col class="shrink">
																	<v-btn v-if="childKey == 0 && panel.values.status_name_qualification.value.id == 4" x-small @click.stop="scheduleExam(panel.values, true)" color="info" :loading="examActionIsLoading">
																		{{ $t('Редактировать') }}
																	</v-btn>	
																</v-col>
															</v-row>
														</v-col>
													</v-row>
													<v-row>
														<v-col><div class="ml-4">{{childItem.exam_address.name}}:</div></v-col>
														<v-col>{{childItem.exam_address.value}}</v-col>
													</v-row>
													<v-row v-if="childItem.exam_mark.value">
														<v-col><div class="ml-4">{{childItem.exam_mark.name}}:</div></v-col>
														<v-col>{{childItem.exam_mark.value}}</v-col>
													</v-row>
												</v-col>
											</v-row>
										</template>
									</template>
								</template>
								<template v-if="requestInfo.values.request_status.value.id == 2 && [5, 6, 7, 10, 11].indexOf(+requestQualification[panelKey].values.status_name_qualification.value.id) == -1">
									<v-row>
										<v-col>
											<template>
												<v-btn v-if="requestInfo.values.phone_number.value" :href="'https://wa.me/7'+requestInfo.values.phone_number.value.match(/\d+/g).join('').slice(-10)+'?text='+wpText(requestQualification[panelKey].values)" target="_blank" depressed color="green darken-1" dark>
													<v-icon left>mdi-phone</v-icon> Написать в Whatsapp
												</v-btn>
											</template>
										</v-col>
										<v-col>
											<template v-if="requestInfo.values.payment_type.value.id != 1">
												<template v-if="requestQualification[panelKey].values.status_name_qualification.value.id != 3">
													<template v-if="requestQualification[panelKey].values.is_have_acs && requestQualification[panelKey].values.is_have_acs.value.id">
														<v-btn @click.stop="postAcsMarks(panel.values)" color="info" :loading="examActionIsLoading">
															{{ $t('Выставить оценки СКБ') }}
														</v-btn>
													</template>
													<template v-else-if="requestQualification[panelKey].values.is_acs_set && !+requestQualification[panelKey].values.is_acs_set.value.id">
														<v-alert class="mb-0" dense type="warning">{{ $t('Настроите формулу СКБ') }}</v-alert>
													</template>
													<template v-else-if="requestQualification[panelKey].values.is_have_exam.value.id">
														<template v-if="requestQualification[panelKey].values.is_have_exam.childs && requestQualification[panelKey].values.is_have_exam.childs.filter(el => el.exam_mark.value == null).length">
															<v-btn @click.stop="scheduleExam(panel.values)" color="info" :loading="examActionIsLoading">
																{{ $t('Выставить оценки') }}
															</v-btn>
														</template>
														<template v-else>
															<v-btn @click.stop="scheduleExam(panel.values)" color="info" :loading="examActionIsLoading">
																{{ $t('Назначить экзамен') }}
															</v-btn>
														</template>
													</template>
												</template>
												<template v-else-if="requestQualification[panelKey].values.is_have_target_grant.value.id">
													<v-btn v-if="requestQualification[panelKey].values.is_have_target_grant_exam.childs && requestQualification[panelKey].values.is_have_target_grant_exam.childs.filter(el => el.exam_mark.value == null).length" @click.stop="scheduleTargetExam(panel.values)" color="info" :loading="examActionIsLoading">
														{{ $t('Выставить оценки по целевому гранту') }}
													</v-btn>
													<v-btn v-else-if="!requestQualification[panelKey].values.is_have_target_grant_exam.childs" @click.stop="scheduleTargetExam(panel.values)" color="info" :loading="examActionIsLoading">
														{{ $t('Назначить собеседование по целевому гранту') }}
													</v-btn>
												</template>
											</template>
										</v-col>
									</v-row>
								</template>
							</v-card-text>
						</v-card>
					</template>

					<v-dialog v-if="currentExamScheduleItem" v-model="postAcsMarksDialog" width="500" :persistent="actionIsLoading">
						<v-card>
							<v-card-title class="headline lighten-2">{{ $t('Выставить оценки СКБ') }}</v-card-title>
							<v-card-text>
								<h4>{{currentExamScheduleItem.specialty_code.value}} ({{currentExamScheduleItem.qualification_code.value}}) / {{currentExamScheduleItem.lang_study.value}} – {{currentExamScheduleItem.qualification_name.value}}</h4>
								<v-divider class="my-6"></v-divider>
								<v-form class="form" ref="postAcsMarksForm">
									<template v-for="(item, itemKey) in postAcsMarksData">
										<v-text-field
												class="mb-5"
												type="number"
												@wheel="$event.target.blur()"
												:key="itemKey"
												v-model="item.grade"
												min="2"
												max="5"
												:label="item.name"
												:disabled="!item.can_change"
												autocomplete="off"
												:rules="[v => !!v || !item.can_change || $t('Обязательное поле')]">
										</v-text-field>
									</template>
									<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
								</v-form>
							</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="primary" text @click.stop="postAcsMarksSubmit" :loading="actionIsLoading">
									{{ $t('Подписать') }}
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>

					<v-dialog v-if="currentExamScheduleItem" v-model="examDialog" width="950" :persistent="actionIsLoading">
						<v-card>
							<v-card-title class="headline lighten-2">{{ $t('Назначить экзамен') }}</v-card-title>
							<v-card-text>
								<h3 class="black--text">{{ $t('Абитуриент') }}: {{ requestDate.main_info.values.full_name.value }}</h3>
								<h3 class="black--text">{{currentExamScheduleItem.specialty_code.value}} ({{currentExamScheduleItem.qualification_code.value}}) / {{currentExamScheduleItem.lang_study.value}} – {{currentExamScheduleItem.qualification_name.value}}</h3>
								
								<v-divider></v-divider>
								<v-form class="form" ref="examForm">
									<template v-for="(item, itemKey) in currentExamScheduleData">
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
																:disabled="!isExamDataEdit && !!item.request_exam_id"
																readonly
																:rules="[v => !!v || $t('Обязательное поле')]"
																v-bind="attrs"
																autocomplete="off"
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
																:disabled="!isExamDataEdit && !!item.request_exam_id"
																readonly
																:rules="[v => !!v || $t('Обязательное поле')]"
																v-bind="attrs"
																autocomplete="off"
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
														:disabled="!isExamDataEdit && !!item.request_exam_id"
														:label="$t('Адрес')"
														:rules="[v => !!v || $t('Обязательное поле')]"
														type="text"
														autocomplete="off"
												></v-text-field>
											</v-col>
											<v-col class="pb-0" cols="2" v-if="!isExamDataEdit && !!item.request_exam_id">
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
										<v-divider :key="itemKey+'1'" class="my-9"></v-divider>
									</template>
									<template v-if="!isExamDataEdit && currentExamScheduleItem.is_have_exam.childs && currentExamScheduleItem.is_have_exam.childs.filter(el => el.exam_mark.value == null).length">
										<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
									</template>
								</v-form>
							</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="primary" text @click.stop="scheduleExamSubmit" :loading="actionIsLoading">
									{{ $t('Сохранить') }}
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>

					<v-dialog v-if="currentExamScheduleItem" v-model="targetExamDialog" width="950" :persistent="actionIsLoading">
						<v-card>
							<v-card-title class="headline lighten-2">{{ $t('Cобеседование по целевому гранту') }}</v-card-title>
							<v-card-text>
								<h3 class="black--text">{{ $t('Абитуриент') }}: {{ requestDate.main_info.values.full_name.value }}</h3>
								<h3 class="black--text">{{currentExamScheduleItem.specialty_code.value}} ({{currentExamScheduleItem.qualification_code.value}}) / {{currentExamScheduleItem.lang_study.value}} – {{currentExamScheduleItem.qualification_name.value}}</h3>
								
								<v-divider></v-divider>
								<v-form class="form" ref="examForm">
									<template v-for="(item, itemKey) in currentExamScheduleData">
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
																:disabled="!isTargetExamDataEdit && !!item.request_exam_id"
																readonly
																:rules="[v => !!v || $t('Обязательное поле')]"
																v-bind="attrs"
																autocomplete="off"
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
																:disabled="!isTargetExamDataEdit && !!item.request_exam_id"
																readonly
																:rules="[v => !!v || $t('Обязательное поле')]"
																v-bind="attrs"
																autocomplete="off"
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
														:disabled="!isTargetExamDataEdit && !!item.request_exam_id"
														:label="$t('Адрес')"
														:rules="[v => !!v || $t('Обязательное поле')]"
														type="text"
														autocomplete="off"
												></v-text-field>
											</v-col>
											<v-col class="pb-0" cols="2" v-if="!isTargetExamDataEdit && !!item.request_exam_id">
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
										<v-divider :key="itemKey+'1'" class="my-9"></v-divider>
									</template>
									<template v-if="!isTargetExamDataEdit && currentExamScheduleItem.is_have_target_grant_exam.childs && currentExamScheduleItem.is_have_target_grant_exam.childs.filter(el => el.exam_mark.value == null).length">
										<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
									</template>
								</v-form>
							</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="primary" text @click.stop="scheduleTargetExamSubmit" :loading="actionIsLoading">
									{{ $t('Сохранить') }}
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-expansion-panels multiple v-model="panel" class="request-data">
						<v-expansion-panel v-for="(panel, panelKey) in requestDate" :key="panelKey">
							<v-expansion-panel-header>{{panel.name}} </v-expansion-panel-header>
							<v-expansion-panel-content>
								<div class="pt-4">
									<v-row v-for="(item, itemKey) in panel.values" :key="itemKey">
										<v-col class="prop-title">{{item.name}}</v-col>
										<v-col v-if="item.type == 'handbook' || item.type == 'boolean'">{{item.value.name}}</v-col>
										<v-col v-else-if="item.type != 'file'">{{item.value}}</v-col>
										<v-col v-else><a :href="item.value" :download="item.file_name" target="_blank">{{item.file_name}}</a></v-col>
									</v-row>
								</div>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-col>
			</v-row>
		</div>
	</div>
</template>



<script>
	export default {
        mounted() {
            this.getData();
        },
		data: () => ({
			requestId: null,
			panel: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // TODO
			actionIsLoading: false,
			requestDate: {},
			requestQualification: {},
			requestInfo: {},
			requestDecisionInfo: {},
			notificationDialog: false,
			ecpFileData: null,
			ecpPassword: null,

			orderNo: null,
			datePickerMenu: false,
			orderDate: null,

			rejectDialog: false,
			rejectReasonList: [],
			rejectReasonSelected: {},
			rejectReasonTextKk: '',
			rejectReasonTextRu: '',

			acceptDialog: false,
			certificatePredmetList: [],

			examActionIsLoading: false,
			examDialog: false,
			currentExamScheduleItem: null,
			currentExamScheduleData: null,
			examMarks: [],
			isExamDataEdit: false,
			postAcsMarksData: null,
			postAcsMarksDialog: false,

			isTargetExamDataEdit: false,
			targetExamDialog: false,
		}),
		methods: {
			wpText(item) {
				let lb = "\r\n";
				let str = `Уважаемый(ая), ${this.requestDate.main_info.values.full_name.value}!${lb}Мы ознакомились с Вашей заявкой и назначили следующие экзамены по квалификации ${item.specialty_code.value} (${item.qualification_code.value}) «${item.qualification_name.value}» в колледж «${this.$store.getters.getCollegeInfo.college_name}»:${lb}`;

				if(item.is_have_exam && item.is_have_exam.childs) {
					item.is_have_exam.childs.forEach(el => {
						str += `${el.exam_name.value} – по адресу "${el.exam_address.value}", в ${el.exam_date.value}${lb}`;
					});
				}
				str += `Просим явиться на экзамен без опозданий.`;
				return encodeURIComponent(str);
			},

			async showAcceptDialog() {
				if((this.requestInfo.values.education_type.value.id == 1 || this.requestInfo.values.education_type.value.id == 2) && this.requestInfo.values.payment_type.value.id == 2) {
					if(!this.certificatePredmetList.length) {
						await this.$http.post('/certificatePredmet', {
							"abiturient_iin": this.requestInfo.values.abiturient_iin.value,
							"education_type_id": this.requestInfo.values.education_type.value.id
						}).then((response) => {
							this.certificatePredmetList = response.data.data;
						}).catch(() => {});
					}
				}
				this.acceptDialog = true;
			},
			async rejectSubmit() {
				if(this.$refs.rejectForm.validate()) {
					this.actionIsLoading = true;
					await this.$http.post('/request/order/'+this.requestId+'/reject', {
						"p12": this.ecpFileData,
						"password": this.ecpPassword,
						"refuse_id": this.rejectReasonSelected.id,
						"negative_resolution_reason_ru": this.rejectReasonTextRu,
						"negative_resolution_reason_kk": this.rejectReasonTextKk
					}).then(() => {
						this.getData().then(() => {
							this.rejectDialog = false;
							this.$store.dispatch('alertAdd', {text: this.$t('Заявка успешно обработана.'), type: 'success'});
						});
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			}, 
			async getRejectReasonList() {
				if(!this.rejectReasonList.length) {
					await this.$http.get('/refuse').then((response) => {
						this.rejectReasonList = response.data.data;
					}).catch(() => {});
				}
				this.rejectDialog = true;
			}, 
			async getData() {
				await this.$http.get('/request/order/'+this.$route.params.id).then((response) => {
					this.requestDate = response.data.data.block;
					this.requestInfo = response.data.data.info;
					if(response.data.data.decision) {
						this.requestDecisionInfo = response.data.data.decision;
					}
					if(response.data.data.qualification) {
						this.requestQualification = response.data.data.qualification;
					}
					this.requestId = this.requestInfo.values.request_id.value;
				}).catch(() => {});
			}, 
			async notificationSubmit() {
				if(this.$refs.notificationForm.validate()) {
					this.actionIsLoading = true;
					await this.$http.post('/request/order/'+this.$route.params.id+'/notification', {
						"p12": this.ecpFileData,
						"password": this.ecpPassword
					}).then(() => {
						this.getData().then(() => {
							this.notificationDialog = false;
							this.$store.dispatch('alertAdd', {text: this.$t('Заявка успешно обработана.'), type: 'success'});
						});
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			}, 
			async acceptSubmit() {
				if(this.$refs.acceptForm.validate()) {
					this.actionIsLoading = true;
					await this.$http.post('/request/order/'+this.$route.params.id+'/accept', {
						"p12": this.ecpFileData,
						"password": this.ecpPassword,
						"certificate_grades": this.certificatePredmetList,
						"order_no": this.orderNo,
						"order_date": this.orderDate
					}).then(() => {
						this.getData().then(() => {
							this.acceptDialog = false;
							this.$store.dispatch('alertAdd', {text: this.$t('Заявка успешно обработана.'), type: 'success'});
						});
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			},
			async postAcsMarks(item) {
				this.currentExamScheduleItem = item;
				this.examActionIsLoading = true;
				await this.$http.get('/request/order/'+this.requestId+'/qualification/'+this.currentExamScheduleItem.id.value+'/acsList').then(async (response) => {
					this.postAcsMarksData = response.data.data;

					this.postAcsMarksDialog = true;
				}).catch(() => {});
				this.examActionIsLoading = false;
			},
			async postAcsMarksSubmit() {
				if(this.$refs.postAcsMarksForm.validate()) {
					this.actionIsLoading = true;
					await this.$http.post('/request/order/'+this.$route.params.id+'/qualification/'+this.currentExamScheduleItem.id.value+'/acs', {
						"p12": this.ecpFileData,
						"password": this.ecpPassword,
						"acs": this.postAcsMarksData
					}).then(() => {
						this.getData().then(() => {
							this.postAcsMarksDialog = false;
							this.$store.dispatch('alertAdd', {text: this.$t('Успешно'), type: 'success'});
						});
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			},
			async scheduleExam(item, isEdit = false) {
				this.isExamDataEdit = isEdit;
				this.currentExamScheduleItem = item;
				this.examActionIsLoading = true;
				await this.$http.get('/request/order/'+this.requestId+'/qualification/'+this.currentExamScheduleItem.id.value+'/examList').then(async (response) => {
					this.currentExamScheduleData = response.data.data;
					for(let item of this.currentExamScheduleData) {
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
					this.examDialog = true;
				}).catch(() => {});
				this.examActionIsLoading = false;
			},
			async scheduleTargetExam(item, isEdit = false) {
				this.isTargetExamDataEdit = isEdit;
				this.currentExamScheduleItem = item;
				this.examActionIsLoading = true;
				await this.$http.get('/request/order/'+this.requestId+'/qualification/'+this.currentExamScheduleItem.id.value+'/targetExamList').then(async (response) => {
					this.currentExamScheduleData = response.data.data;
					for(let item of this.currentExamScheduleData) {
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
					this.targetExamDialog = true;
				}).catch(() => {});
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
					this.actionIsLoading = true;
					this.currentExamScheduleData.forEach((item) => {
						if(item.examDate && item.examTime) {
							item.exam_date = item.examDate+' '+item.examTime;
						}
						if(item.localMark) {
							item.mark = item.localMark;
						}
					});

					let sendData = {
						"exam": this.currentExamScheduleData
					};
					if(!this.isExamDataEdit && this.currentExamScheduleItem.is_have_exam.childs && this.currentExamScheduleItem.is_have_exam.childs.filter(el => el.exam_mark.value == null).length) {
						sendData.p12 = this.ecpFileData;
						sendData.password = this.ecpPassword;
					}
					await this.$http.post('/request/order/'+this.$route.params.id+'/qualification/'+this.currentExamScheduleItem.id.value+'/exam', sendData).then(() => {
						this.getData().then(() => {
							this.examDialog = false;
							this.$store.dispatch('alertAdd', {text: this.$t('Успешно'), type: 'success'});
						});
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			},
			async scheduleTargetExamSubmit() {
				if(this.$refs.examForm.validate()) {
					this.actionIsLoading = true;
					this.currentExamScheduleData.forEach((item) => {
						if(item.examDate && item.examTime) {
							item.exam_date = item.examDate+' '+item.examTime;
						}
						if(item.localMark) {
							item.mark = item.localMark;
						}
					});

					let sendData = {
						"exam": this.currentExamScheduleData
					};
					if(!this.isTargetExamDataEdit && this.currentExamScheduleItem.is_have_exam.childs && this.currentExamScheduleItem.is_have_exam.childs.filter(el => el.exam_mark.value == null).length) {
						sendData.p12 = this.ecpFileData;
						sendData.password = this.ecpPassword;
					}
					await this.$http.post('/request/order/'+this.$route.params.id+'/qualification/'+this.currentExamScheduleItem.id.value+'/targetExam', sendData).then(() => {
						this.getData().then(() => {
							this.targetExamDialog = false;
							this.$store.dispatch('alertAdd', {text: this.$t('Успешно'), type: 'success'});
						});
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			},
			exportToExcel() {
				this.$http.get('/request/order/'+this.requestId+'/export/excel', {responseType: 'blob'}).then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', this.$t('Заявка')+' №'+this.requestId+'.xls');
					document.body.appendChild(link);
					link.click();
					link.remove();
				}).catch(() => {});
			},
			printElement(id) {
				var mywindow = window.open('', 'PRINT', `height=${screen.height},width=${screen.width}`);

				mywindow.document.write('<html><head>');
				mywindow.document.write('</head><body >');
				mywindow.document.write(document.getElementById(id).innerHTML);
				mywindow.document.write('</body></html>');

				mywindow.document.close(); // necessary for IE >= 10
				mywindow.focus(); // necessary for IE >= 10*/

				mywindow.print();
				mywindow.close();

				return true;
			}
			// updateEcpFileData(v) {
			// 	this.ecpFileData = v;
			// },
			// updateEcpPassword(v) {
			// 	this.ecpPassword = v;
			// }
		},
		watch: {
			rejectDialog: function (v) {
				if(!v) {
					this.rejectReasonSelected = {};
					this.rejectReasonTextRu = '';
					this.rejectReasonTextKk = '';
				}
			},
			acceptDialog(v) {
				if(!v) {
					this.orderDate = null;
					this.orderNo = null;
				}
			}
		}
	}
</script>

<style scoped>
	.card-title-custom {
		font-size: 15px;
		background-color: #f5f5f5;
		line-height: 1;
	}
	.card-text-custom {
		font-size: 15px;
		color: #000 !important;
	}
	.request-data .v-expansion-panel-header {
		background-color: #f5f5f5;
		min-height: initial;
		font-weight: 500;
	}
	.request-data .row + .row {
		border-top: 1px solid rgba(0, 0, 0, 0.12);
	}
	.prop-title {
		font-size: 15px;
	}
</style>