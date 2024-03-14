<template>
    <div>
        <div class="page-inner">
            <v-row>
                <v-col lg="4" md="5" cols="12">
                    <template v-if="Object.keys(requestInfo).length != 0">
                        <template v-if="+requestInfo.values.requestStatus.value.id == 1">
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
                        <template v-if="+requestInfo.values.requestStatus.value.id == 2">
                            <v-btn block color="success" class="mb-4" @click.stop="showAcceptDialog">{{ $t('Принять заявку') }}</v-btn>
                            <v-dialog v-model="acceptDialog" width="500" :persistent="actionIsLoading">
                                <v-card>
                                    <v-card-title class="headline lighten-2">{{ $t('Принять заявку') }}</v-card-title>
                                    <v-card-text>
                                        <v-form class="form" ref="acceptForm">
                                            <template v-if="requestInfo.values.requestType.value.id == '02'">
                                                <v-text-field
                                                        v-model="dormNumber"
                                                        :label="$t('Номер общежития')"
                                                        :rules="[v => !!v || $t('Обязательное поле')]"
                                                        required
                                                ></v-text-field>
                                                <v-textarea
                                                        v-model="dormAddressRu"
                                                        :label="$t('Адрес общежития на казахском')"
                                                        rows="2" filled auto-grow
                                                        :rules="[v => !!v || $t('Обязательное поле')]"
                                                ></v-textarea>
                                                <v-textarea
                                                        v-model="dormAddressKk"
                                                        :label="$t('Адрес общежития на русском')"
                                                        value=""
                                                        rows="2" filled auto-grow
                                                        :rules="[v => !!v || $t('Обязательное поле')]"
                                                ></v-textarea>
                                            </template>
                                            <template v-if="requestInfo.values.requestType.value.id == '03'">
                                                <v-select
                                                        v-model="yearFoodSelected"
                                                        :items="yearFoodList"
                                                        item-text="name"
                                                        item-value="id"
                                                        :label="$t('На какой учебный год')"
                                                        :rules="[v => Object.keys(v).length != 0 || $t('Обязательное поле')]"
                                                        return-object>
                                                </v-select>
                                            </template>
                                            <v-divider class="my-3" />
                                            <sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
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
                                            <template v-if="rejectReasonSelected.id == '001' || rejectReasonSelected.id == '002'">
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
                                            <template v-if="rejectReasonSelected.id == '007'">
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
                        <v-divider class="my-6" />
                    </template>
                    <v-card elevation="2" class="mb-5">
                        <v-card-title class="card-title-custom">{{requestInfo.name}}</v-card-title>
                        <v-card-text class="request-data card-text-custom pt-4">
                            <v-row v-for="(item, itemKey) in requestInfo.values" :key="itemKey">
                                <v-col>{{item.name}}:</v-col>
                                <v-col v-if="item.type == 'handbook' || item.type == 'boolean'">{{item.value.name}}</v-col>
                                <v-col v-else-if="item.type != 'file'">{{item.value}}</v-col>
                                <v-col v-else><a :href="item.value" :download="item.fileName">{{item.fileName}}</a></v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card elevation="2" v-if="Object.keys(requestDecisionInfo).length != 0" class="mb-5">
                        <v-alert outlined :color="(requestDecisionInfo.values.resolution.value.id == 2 ? 'green' : 'red')+' darken-2'" class="pa-0">
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
                    <v-expansion-panels multiple v-model="panel" class="request-data">
                        <v-expansion-panel v-for="(panel, panelKey) in requestDate" :key="panelKey">
                            <v-expansion-panel-header>{{panel.name}} </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div class="pt-4">
                                    <v-row v-for="(item, itemKey) in panel.values" :key="itemKey">
                                        <v-col class="prop-title">{{item.name}}</v-col>
                                        <v-col v-if="item.type == 'handbook' || item.type == 'boolean'">{{item.value.name}}</v-col>
                                        <v-col v-else-if="item.type != 'file'">{{item.value}}</v-col>
                                        <v-col v-else><a :href="item.value" :download="item.fileName">{{item.fileName}}</a></v-col>
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
            this.$http.defaults.baseURL = this.$store.getters.getBaseUrl+'egov/'+this.$store.getters.getApiVersion+'/'+this.$store.getters.getCurrentRole+'/'+this.$store.getters.getLanguage;
            this.getData();
        },
        beforeDestroy() {
            this.$store.dispatch("changeBaseUrl");
        },
        data: () => ({
            requestId: null,
            panel: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // TODO
            actionIsLoading: false,
            requestDate: {},
            requestInfo: {},
            requestDecisionInfo: {},
            notificationDialog: false,
            ecpFileData: null,
            ecpPassword: null,

            rejectDialog: false,
            rejectReasonList: [],
            rejectReasonSelected: {},
            rejectReasonTextKk: '',
            rejectReasonTextRu: '',

            dormNumber: '',
            dormAddressRu: '',
            dormAddressKk: '',

            yearFoodList: [],
            yearFoodSelected: {},

            acceptDialog: false,
        }),
        methods: {
            async showAcceptDialog() {
                if(!this.yearFoodList.length) {
                    await this.$http.get('/handbook/gu_academic_year_doc').then((response) => {
                        this.yearFoodList = response.data.data;
                    }).catch(() => {});
                }
                this.acceptDialog = true;
            },
            async rejectSubmit() {
                if(this.$refs.rejectForm.validate()) {
                    this.actionIsLoading = true;
                    await this.$http.post('/request/resolution/negative/'+this.requestId, {
                        "p12": this.ecpFileData,
                        "password": this.ecpPassword,
                        "reason": this.rejectReasonSelected.id,
                        "reason_text_ru": this.rejectReasonTextRu,
                        "reason_text_kk": this.rejectReasonTextKk
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
                    await this.$http.get('/handbook/gu_refuse').then((response) => {
                        this.rejectReasonList = response.data.data;
                    }).catch(() => {});
                }
                this.rejectDialog = true;
            },
            async getData() {
                await this.$http.get('/request/'+this.$route.params.id).then((response) => {
                    this.requestDate = response.data.data.block;
                    this.requestInfo = response.data.data.info;
                    if(response.data.data.decision) {
                        this.requestDecisionInfo = response.data.data.decision;
                    }
                    this.requestId = this.requestInfo.values.requestId.value;
                }).catch(() => {});
            },
            async notificationSubmit() {
                if(this.$refs.notificationForm.validate()) {
                    this.actionIsLoading = true;
                    await this.$http.post('/request/resolution/notification/'+this.$route.params.id, {
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
                    let sendData = {
                        "p12": this.ecpFileData,
                        "password": this.ecpPassword,
                    }
                    if(this.requestInfo.values.requestType.value.id == '02') {
                        sendData['Dorm_numbr'] = this.dormNumber;
                        sendData['Dorm_address_kk'] = this.dormAddressKk;
                        sendData['Dorm_address_ru'] = this.dormAddressRu;
                    } else if(this.requestInfo.values.requestType.value.id == '03') {
                        sendData['year_food'] = this.yearFoodSelected.id;
                    }
                    await this.$http.post('/request/resolution/positive/'+this.$route.params.id, sendData).then(() => {
                        this.getData().then(() => {
                            this.acceptDialog = false;
                            this.$store.dispatch('alertAdd', {text: this.$t('Заявка успешно обработана.'), type: 'success'});
                        });
                    }).catch(() => {});
                    this.actionIsLoading = false;
                }
            }
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
                    this.yearFoodSelected = {};
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