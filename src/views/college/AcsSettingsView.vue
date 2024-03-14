<template>
    <div>
        <div class="panel-header panel-header-custom bg-primary-gradient">
            <div class="page-inner py-5">
                <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                    <div>
                        <h2 class="text-white pb-2 fw-bold">{{ $t("Настройка формулы СКБ") }}</h2>
                        <!-- <h5 class="text-white op-7 mb-2">Краткая статистика заявок приема</h5> -->
                    </div>
                    <div class="ml-md-auto py-2 py-md-0">
                        <!-- <a href="#" class="btn btn-white btn-border btn-round mr-2">Manage</a> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="page-inner mt--5">
            <v-row>
                <v-col cols="3">
                    <v-card elevation="2">
                        <v-card-title class="card-title-custom">{{ $t('Фильтры') }}</v-card-title>
                        <v-card-text>
                            <v-radio-group v-model="filterPaymentType" @change="getData">
                                <template v-slot:label>
                                    <div>{{ $t('Форма оплаты') }}</div>
                                </template>
                                <v-radio
                                        v-for="item in paymentType"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                        class="my-1">
                                </v-radio>
                            </v-radio-group>
                            <v-divider></v-divider>
                            <v-radio-group v-model="filterTrainingType" @change="getData">
                                <template v-slot:label>
                                    <div>{{ $t('Тип подготовки') }}</div>
                                </template>
                                <v-radio
                                        v-for="item in trainingType"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                        class="my-1">
                                </v-radio>
                            </v-radio-group>
                            <v-divider></v-divider>
                            <v-radio-group v-model="filterEducationType" @change="getData">
                                <template v-slot:label>
                                    <div>{{ $t('Тип образования') }}</div>
                                </template>
                                <v-radio
                                        v-for="item in educationTypeList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                        class="my-1">
                                </v-radio>
                            </v-radio-group>
                            <v-divider></v-divider>
                            <v-radio-group v-model="filterEducationForm" @change="getData">
                                <template v-slot:label>
                                    <div>{{ $t('Форма обучения') }}</div>
                                </template>
                                <v-radio
                                        v-for="item in educationFormList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                        class="my-1">
                                </v-radio>
                            </v-radio-group>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-data-table
                            :headers="placeHeaders"
                            :items="placeList"
                            :loading="isLoading"
                            hide-default-footer
                            :item-class="itemRowBackground"
                            :footer-props="{'items-per-page-options': [-1]}"
                            class="elevation-1 place-list">
                        <template v-slot:item.actions="{ index, item }">
                            <v-btn v-if="item.is_have" depressed x-small color="warning" @click.stop="edit(index, item)" :loading="actionIsLoading">{{ $t('Редактировать') }}</v-btn>
                            <v-btn v-else depressed x-small color="primary" @click.stop="edit(index, item)" :loading="actionIsLoading">{{ $t('Настроить') }}</v-btn>
                        </template>
                    </v-data-table>
                    <v-dialog v-model="editDialog" width="600" :persistent="actionIsLoading">
                        <v-card>
                            <v-card-title class="headline lighten-2">{{ $t('Редактировать') }}</v-card-title>
                            <v-card-text>
                                <v-divider class="mb-5"></v-divider>
                                <v-form class="form" ref="editForm">
                                    <v-row>
                                        <v-col>{{ $t('Код квалификации') }}:</v-col>
                                        <v-col>{{ currentItem.qualification_code }}</v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>{{ $t('Наименование квалификации') }}:</v-col>
                                        <v-col>{{ currentItem.name }}</v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>{{ $t('Форма оплаты') }}:</v-col>
                                        <v-col>{{ currentItem.payment_type_name }}</v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>{{ $t('Язык обучения') }}:</v-col>
                                        <v-col>{{ currentItem.lang_study_name }}</v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-select
                                                    v-model="acsSettingsInfo.compulsory_subject_first"
                                                    :items="certificatePredmetList"
                                                    item-text="name"
                                                    item-value="id"
                                                    :rules="[v => !!v || $t('Обязательное поле')]"
                                                    :label="$t('Первый обязательный предмет')">
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-select
                                                    v-model="acsSettingsInfo.compulsory_subject_second"
                                                    :items="certificatePredmetList"
                                                    item-text="name"
                                                    item-value="id"
                                                    clearable
                                                    :label="$t('Второй обязательный предмет')">
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-select
                                                    v-model="acsSettingsInfo.profile_predmet_first"
                                                    :items="profilePredmetList"
                                                    item-text="name"
                                                    item-value="id"
                                                    :rules="[v => !!v || $t('Обязательное поле')]"
                                                    :label="$t('Первый профильный предмет')">
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-select
                                                    v-model="acsSettingsInfo.profile_predmet_second"
                                                    :items="profilePredmetList"
                                                    item-text="name"
                                                    item-value="id"
                                                    :rules="[v => !!v || $t('Обязательное поле')]"
                                                    :label="$t('Второй профильный предмет')">
                                            </v-select>
                                        </v-col>
                                    </v-row>

                                    <sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
                                </v-form>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn color="blue darken-1" text @click.stop="closeEditDialog">{{ $t('Отмена') }}</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text @click.stop="editSubmit">
                                    {{ $t('Сохранить') }}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
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
            isLoading: true,
            placeHeaders: [],
            placeList: [],
            trainingType: [],
            paymentType: [],

            educationFormList: [],
            educationTypeList: [],

            placeCount: '',
            actionIsLoading: false,

            ecpFileData: '',
            ecpPassword: '',


            filterPaymentType: '2',
            filterTrainingType: '1',
            filterEducationType: '1',
            filterEducationForm: '1',

            currentItem: '',
            editDialog: false,

            profilePredmetList: [],
            certificatePredmetList: [],

            acsSettingsInfo: {},

        }),
        methods: {
            itemRowBackground: function (item) {
                let rowCLass = '';
                if(+item.acs_id) {
                    rowCLass = 'light-green lighten-4';
                }
                return rowCLass;
            },
            async edit(index, item) {
                this.actionIsLoading = true;
                this.currentItem = item;

                await this.$http.get("/acsSettingsInfo"+
                    (this.currentItem.acs_id ?
                        '?acs_id='+this.currentItem.acs_id :
                        "?training_type_id="+this.filterTrainingType+
                        "&payment_type_id="+this.filterPaymentType+
                        "&education_type_id="+this.filterEducationType+
                        "&education_form_id="+this.filterEducationForm+
                        "&qualification_code="+this.currentItem.qualification_code+
                        "&lang_short="+this.currentItem.lang_short
                    )).then((response) => {
                    this.editDialog = true;
                    this.acsSettingsInfo = response.data.data;
                });

                if(!this.profilePredmetList.length) {
                    await this.$http.get('/profilePredmet').then((response) => {
                        this.profilePredmetList = response.data.data;
                    });
                }

                await this.$http.get('/certificatePredmet?education_type_id='+this.filterEducationType).then((response) => {
                    this.certificatePredmetList = response.data.data;
                });

                this.actionIsLoading = false;
            },
            closeEditDialog() {
                this.currentItem = '';
                this.editDialog = false;
                this.acsSettingsInfo = {};
                this.certificatePredmetList = [];
            },
            async editSubmit() {
                if(this.$refs.editForm.validate()) {
                    if(this.acsSettingsInfo.compulsory_subject_first == this.acsSettingsInfo.compulsory_subject_second || this.acsSettingsInfo.profile_predmet_first == this.acsSettingsInfo.profile_predmet_second) {
                        this.$store.dispatch('alertAdd', {text: this.$t('Выбраны одинаковые предметы'), type: 'error'});
                    } else {
                        this.actionIsLoading = true;
                        this.acsSettingsInfo.p12 = this.ecpFileData;
                        this.acsSettingsInfo.password = this.ecpPassword;
                        await this.$http.post('/acsSettings'+(this.currentItem.acs_id ? '?acs_id='+this.currentItem.acs_id : ''), this.acsSettingsInfo).then(() => {
                            this.$store.dispatch('alertAdd', {text: "success", type: 'success'});
                            this.editDialog = false;
                            this.getData();
                        }).catch(() => {});
                        this.actionIsLoading = false;
                    }
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

                await this.$http.get("/acsSettings?training_type_id="+this.filterTrainingType+"&payment_type_id="+this.filterPaymentType+"&education_type_id="+this.filterEducationType+"&education_form_id="+this.filterEducationForm).then((response) => {
                    this.placeHeaders = response.data.data.capacityList.headers;

                    this.placeHeaders.push({value: 'actions', sortable: false});

                    this.placeList = response.data.data.capacityList.list;
                    this.isLoading = false;
                });
            }
        },
        watch: {
            editPlaceDialog(v) {
                if(!v) {
                    this.$refs.editForm.resetValidation();
                    this.closeEditDialog();
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