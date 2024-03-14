<template>
    <div>
        <div class="panel-header panel-header-custom bg-primary-gradient">
            <div class="page-inner py-5">
                <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                    <div>
                        <h2 class="text-white pb-2 fw-bold">{{ $t('Заполняемость мест') }}</h2>
                        <h5 class="text-white op-7 mb-2">{{ collegeName }}</h5>
                    </div>
                    <div class="ml-md-auto py-2 py-md-0">

                    </div>
                </div>
            </div>
        </div>
        <div class="page-inner mt--5">
            <v-row>
                <v-col cols="12">
                    <div class="card full-height">
                        <div class="card-body">
                            <div class="card-title">Выделенные места и Поступившие заявки</div>
                            <div class="row py-3">
                                <v-col>
                                    <apexchart v-if="series.length" width="100%" height="450" type="bar" :options="options" :series="series"></apexchart>
                                </v-col>
                            </div>
                        </div>
                    </div>
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
            options: {
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: [],
                },
                fill: {
                    opacity: 1
                }
            },
            series: [],
            collegeName: '',
        }),
        methods: {
            getData() {
                this.$http.get('/request/collegeInfo/'+this.$route.params.bin).then((response) => {
                    this.series = response.data.data.values;
                    this.collegeName = response.data.data.college_name;
                    this.options = {...this.options, ...{
                            xaxis: {
                                categories: response.data.data.categories
                            }
                        }};
                }).catch(() => {});
            }
        },
    }
</script>