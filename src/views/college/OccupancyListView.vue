<template>
    <div>
        <div class="panel-header panel-header-custom bg-primary-gradient">
            <div class="page-inner py-5">
                <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                    <div>
                        <h2 class="text-white pb-2 fw-bold">{{ $t("Заполняемость мест") }}</h2>
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
<!--                        <template v-slot:footer>-->
<!--                            <v-divider class="my-0"></v-divider>-->
<!--                            <v-row v-if="placeHeaders.length" no-gutters>-->
<!--                                <v-spacer></v-spacer>-->
<!--                                <div class="pl-4 py-3 caption">-->
<!--                                    {{ $t('Всего') }}:-->
<!--                                </div>-->
<!--                                <template v-for="(item, index) in placeHeaders"  :style="'width: '+item.width+'px;'">-->
<!--                                    <div v-if="item.width" :style="'width: '+item.width+'px;'" class="pl-4 py-3" :key="index">-->
<!--                                        <strong v-if="item.value == 'grant_count'">{{placeList.reduce((accumulator, item) => accumulator + (+item.grant_count), 0)}}</strong>-->
<!--                                    </div>-->
<!--                                </template>-->
<!--                            </v-row>-->
<!--                        </template>-->
                    </v-data-table>
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
        }),
        methods: {
            itemRowBackground: function (item) {
                let rowCLass = '';
                if(+item.difference >= 0) {
                    rowCLass = 'light-green lighten-4';
                } else if (+item.difference < 0) {
                    rowCLass = 'red lighten-5';
                }
                return rowCLass;
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

                await this.$http.get("/occupancyPlaces?training_type_id="+this.filterTrainingType+"&payment_type_id="+this.filterPaymentType+"&education_type_id="+this.filterEducationType+"&education_form_id="+this.filterEducationForm).then((response) => {
                    this.placeHeaders = response.data.data.capacityList.headers;

                    this.placeList = response.data.data.capacityList.list;
                    this.isLoading = false;
                });
            }
        },
        watch: {
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