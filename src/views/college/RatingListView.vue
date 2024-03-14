<template>
    <div>
        <div class="panel-header panel-header-custom bg-primary-gradient">
            <div class="page-inner py-5">
                <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                    <div>
                        <h2 class="text-white pb-2 fw-bold">{{ $t('Итоги') }}</h2>
                        <!-- <h5 class="text-white op-7 mb-2">Краткая статистика заявок приема</h5> -->
                    </div>
                    <div class="ml-md-auto py-2 py-md-0">
                    </div>
                </div>
            </div>
        </div>

        <div class="page-inner mt--5">
            <v-row>
                <div class="col-md-3">
                    <v-card elevation="2">
                        <v-card-title class="card-title-custom">{{ $t('Специальности') }}</v-card-title>
                        <v-card-text>
                                <v-list class="pa-0">
                                    <v-list-item-group v-model="currentIndex" color="primary">
                                    <v-list-item v-for="(item, key) in qualificationList" :key="key" color="primary">
                                        <v-list-item-content>
                                            <v-list-item-title>{{ item.qualification_code }} ({{ item.lang_study_name }})</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                        </v-card-text>
                    </v-card>
                </div>
                <div class="col-md-9">
                    <v-card elevation="2" v-if="currentItem">
                        <v-card-title class="card-title-custom">{{ currentItem.qualification_code }} ({{ currentItem.lang_study_name }}) – {{ currentItem.name }}</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col>
                                    <div>{{ currentItem.training_type_name }}</div>
                                    <div>{{ currentItem.payment_type_name }}</div>
                                    <div><b>Количество выделенных мест: {{ currentItem.grant_count }}</b></div>
                                </v-col>
                                <v-col>
                                    <div>{{ currentItem.education_form_name }}</div>
                                    <div>{{ currentItem.education_type_name }}</div>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-data-table
                                    :headers="dataHeaders"
                                    :items="dataList"
                                    :loading="isLoading"
                                    :footer-props="{'items-per-page-options': [-1]}"
                                    :item-class="itemRowBackground"
                                    class="elevation-1 place-list">
                                <template v-slot:item.actions="{ index, item }">
                                    <template v-if="+item.status == 0 && +item.is_winner == 1">
                                        <v-btn depressed x-small color="primary" @click.stop="acceptRejectItem(item, true)">{{ $t('Принять') }}</v-btn>
                                        <v-btn depressed x-small color="error" @click.stop="acceptRejectItem(item, false)">{{ $t('Отклонить') }}</v-btn>
                                    </template>
                                    <template v-if="+item.status != 0">
                                        <v-btn depressed x-small color="error" @click.stop="rejectDecision(item)">{{ $t('Отменить решение') }}</v-btn>
                                    </template>
                                </template>
                            </v-data-table>
                            <v-dialog v-if="currentAcceptRejectItem" v-model="acceptRejectDialog" width="600" :persistent="actionIsLoading">
                                <v-card>
                                    <v-card-title class="headline lighten-2">{{ $t('Вы действительно хотите '+(currentAcceptRejectStatus ? 'принять' : 'отклонить')+' заявку') }}</v-card-title>
                                    <v-card-text>
                                        <v-divider class="mb-5"></v-divider>
                                        <h5 class="mb-5">{{currentAcceptRejectItem.abiturient_iin}} – {{currentAcceptRejectItem.abiturient_full_name}}</h5>

                                        <v-form class="form" ref="acceptRejectForm">
                                            <v-textarea
                                                    v-if="!currentAcceptRejectStatus"
                                                    v-model="reasonText"
                                                    :label="$t('Причина отказа')"
                                                    rows="2" filled auto-grow
                                                    :rules="[v => !!v || $t('Обязательное поле'), v => v.length >= 20 || $t('Значение поле слишком короткое')]"
                                            ></v-textarea>
                                            <sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
                                        </v-form>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <!--                                        <v-btn color="blue darken-1" text @click.stop="closeEditDeleteDialog">{{ $t('Отмена') }}</v-btn>-->
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" text @click.stop="acceptRejectSubmit" :loading="actionIsLoading">
                                            {{ $t('Подписать') }}
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-dialog v-if="currentRejectDecisionItem" v-model="rejectDecisionDialog" width="600" :persistent="actionIsLoading">
                                <v-card>
                                    <v-card-title class="headline lighten-2">{{ $t('Вы действительно хотите отменить решение') }}</v-card-title>
                                    <v-card-text>
                                        <v-divider class="mb-5"></v-divider>
                                        <h5 class="mb-5">{{currentRejectDecisionItem.abiturient_iin}} – {{currentRejectDecisionItem.abiturient_full_name}}</h5>

                                        <v-form class="form" ref="rejectDecisionForm">
                                            <v-textarea
                                                    v-if="!currentAcceptRejectStatus"
                                                    v-model="reasonText"
                                                    :label="$t('Причина отмены')"
                                                    rows="2" filled auto-grow
                                                    :rules="[v => !!v || $t('Обязательное поле'), v => v.length >= 20 || $t('Значение поле слишком короткое')]"
                                            ></v-textarea>
                                            <sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
                                        </v-form>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" text @click.stop="rejectDecisionSubmit" :loading="actionIsLoading">
                                            {{ $t('Подписать') }}
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-card-text>
                    </v-card>
                </div>
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
            isLoading: true,
            qualificationList: [],
            currentIndex: null,
            currentItem: null,
            dataList: [],
            dataHeaders: [],
            actionIsLoading: false,
            acceptRejectDialog: false,
            ecpFileData: '',
            ecpPassword: '',
            currentAcceptRejectItem: null,
            currentAcceptRejectStatus: null,
            reasonText: '',

            rejectDecisionDialog: false,
            currentRejectDecisionItem: null,
        }),
        methods: {
            acceptRejectItem(item, accept) {
                this.acceptRejectDialog = true;
                this.currentAcceptRejectItem = item;
                this.currentAcceptRejectStatus = accept;
            },
            rejectDecision(item) {
                this.rejectDecisionDialog = true;
                this.currentRejectDecisionItem = item;

            },
            async rejectDecisionSubmit() {
                if(this.$refs.rejectDecisionForm.validate()) {
                    let sendData = {
                        "p12" : this.ecpFileData,
                        "password" : this.ecpPassword,
                        "ranging_id" : this.currentRejectDecisionItem.id,
                        "reason": this.reasonText
                    };

                    await this.$http.post("/ranging/cancel", sendData).then(() => {
                        this.rejectDecisionDialog = false;
                        this.actionIsLoading = false;
                        this.getList();
                    });
                }

            },
            async acceptRejectSubmit() {
                if(this.$refs.acceptRejectForm.validate()) {
                    let sendData = {
                        "p12" : this.ecpFileData,
                        "password" : this.ecpPassword,
                        "ranging_id" : this.currentAcceptRejectItem.id
                    };
                    if(!this.currentAcceptRejectStatus) {
                        sendData.reason = this.reasonText;
                    }
                    await this.$http.post("/ranging/"+(this.currentAcceptRejectStatus ? 'accept' : 'reject'), sendData).then(() => {
                        this.acceptRejectDialog = false;
                        this.actionIsLoading = false;
                        this.getList();
                    });
                }
            },
            itemRowBackground: function (item) {
                let rowCLass = '';
                if(+item.is_winner == 0) {
                    rowCLass = 'grey lighten-2';
                } else if(+item.status == 1) {
                    rowCLass = 'light-green lighten-4';
                } else if(+item.status == 2) {
                    rowCLass = 'red lighten-5';
                }
                return rowCLass;
            },
            async getList() {
                this.isLoading = true;
                this.dataList = [];
                await this.$http.get('/ranging/list' +
                    '?training_type_id='+this.currentItem.training_type_id +
                    '&payment_type_id='+this.currentItem.payment_type_id +
                    '&education_form_id='+this.currentItem.education_form_id +
                    '&education_type_id='+this.currentItem.education_type_id +
                    '&qualification_code='+this.currentItem.qualification_code +
                    '&study_lang='+this.currentItem.lang_short).then((response) => {
                    this.dataHeaders = response.data.data.request.headers;
                    this.dataList = response.data.data.request.list;

                    this.dataHeaders.push({value: 'actions', sortable: false, width: 100});
                });
                this.isLoading = false;
            },
            async getData() {
                this.isLoading = true;
                await this.$http.get('/ranging').then((response) => {
                    this.qualificationList = response.data.data;
                    if(this.$route.query.qualification_code) {
                        this.qualificationList.map((item, index) => {
                            if(item.qualification_code == this.$route.query.qualification_code && item.lang_short == this.$route.query.study_lang) {
                                this.currentIndex = index;
                            }
                        });
                    } else {
                        this.currentIndex = 0;
                    }
                });
                this.isLoading = false;
            },
			exportToExcel() {
				this.$http.get('/rating/excel', {responseType: 'blob'}).then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', this.$t('Заявки')+'.xls');
					document.body.appendChild(link);
					link.click();
					link.remove();
				}).catch(() => {});
			}, 
        },
        watch: {
            currentIndex(v) {
                this.currentItem = this.qualificationList[v];
                this.getList();
            },
            acceptRejectDialog(v) {
                if(!v) {
                    this.$refs.acceptRejectForm.reset();
                    this.currentAcceptRejectItem = null;
                    this.currentAcceptRejectStatus = null;
                    this.reasonText = '';
                }
            },
            rejectDecisionDialog(v) {
                if(!v) {
                    this.$refs.rejectDecisionForm.reset();
                    this.currentRejectDecisionItem = null;
                    this.reasonText = '';
                }
            }
        }
    }
</script>