<template>
	<div>
		<div class="panel-header panel-header-custom bg-primary-gradient">
			<div class="page-inner py-5">
				<div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
					<div>
						<h2 class="text-white pb-2 fw-bold">{{ $t('Статистика') }}</h2>
						<!-- <h5 class="text-white op-7 mb-2">Краткая статистика заявок приема</h5> -->
					</div>
					<div class="ml-md-auto py-2 py-md-0">
						<ul class="nav nav-pills nav-secondary nav-pills-no-bd nav-sm" id="pills-tab" role="tablist">
							<li class="nav-item" v-for="(item, key) in statDates" :key="key">
								<span :class="'nav-link text-white '+(key == statDate && 'active')" role="tab" @click="statDate = key">{{item}}</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="page-inner mt--5">
			<div class="row mt--2">
				<div class="col-md-12">
					<div class="card full-height">
						<div class="card-header">
							<div class="card-head-row">
								<div class="card-title">Общая статистика</div>
								<div class="card-tools">
									<ul class="nav nav-pills nav-secondary nav-pills-no-bd nav-sm" id="pills-tab" role="tablist">
										<li class="nav-item" v-for="(item, key) in statSites" :key="key">
											<span :class="'nav-link '+(key == statSite && 'active')" role="tab" @click="statSite = key">{{item}}</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="card-body">
							<!--                            <div class="card-title">Заявки абитуриентов</div>-->
							<!--                            <div class="card-category">Тенденция поступления новых заявок</div>-->
							<div class="d-flex flex-wrap justify-content-around pb-4 pt-5">
								<div v-for="(item, index) in statisticData.body" :key="index" :class="'px-2 pb-2 pb-md-0 text-center '+colors[item.status.id]">
									<div class="display-1">{{ item.counter }}</div>
									<h6 class="fw-bold mt-3 mb-0">{{ index }}</h6>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<v-row>
				<v-col cols="12">
					<div class="card full-height">
						<div class="card-body">
							<div class="card-title">Новые заявки</div>
							<div class="row py-3">
								<v-col>
									<apexchart v-if="series.length" width="100%" height="450" type="line" :options="options" :series="series"></apexchart>
								</v-col>
							</div>
						</div>
					</div>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="6">
					<div class="card">
						<div class="card-body">
							<div class="card-title">Подано через</div>
							<div class="row py-3">
								<v-col>
									<apexchart v-if="series2.length" ref="donut" width="100%" height="250" type="donut" :options="chartOptions" :series="series2"></apexchart>
								</v-col>
							</div>
						</div>
					</div>
				</v-col>
				<v-col cols="6">
					<div class="card">
						<div class="card-body">
							<div class="card-title">Тип образования</div>
							<div class="row py-3">
								<v-col>
									<apexchart v-if="series3.length" ref="donut" width="100%" height="250" type="donut" :options="chartOptions3" :series="series3"></apexchart>
								</v-col>
							</div>
						</div>
					</div>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<div class="card full-height">
						<div class="card-body">
							<div class="card-title">Выделенные места и Поступившие заявки</div>
							<div class="row py-3">
								<v-col>
									<apexchart v-if="series4.length" width="100%" height="450" type="bar" :options="options4" :series="series4"></apexchart>
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
			this.getCollegeInfo();
			this.getData();
			this.getAllRequest();
		},
		beforeDestroy() {
			this.$store.dispatch("changeBaseUrl");
		},
		data: () => ({
			statisticData: {},
			colors: {
				'1' : 'blue-grey--text text--lighten-1',
				'2' : 'green--text text--darken-3',
				'5' : 'red--text text--darken-4',
				'7' : 'orange--text text--darken-4',
				'8' : 'light-blue--text text--darken-4',
			},
			statDate: 'week',
			statDates: {
				'today' : 'Сегодня',
				'week' : 'Неделя',
				'month' : 'Месяц',
				'all' : 'Все',
			},
			statSite: 'null',
			statSites: {
				'null' : 'Все',
				'egov' : 'EGOV',
				'edus' : 'EDUS'
			},
			options: {
				chart: {
					id: 'vuechart-example'
				},
				dataLabels: {
					enabled: true,
				},
				stroke: {
					curve: 'smooth'
				},
				xaxis: {
					categories: []
				}
			},
			series: [],
			chartOptions: {
				labels: [],
			},
			series2: [],
			chartOptions3: {
				labels: [],
			},
			series3: [],

			options4: {
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
			series4: [],
		}),
		methods: {
			getAllRequest() {
				this.$http.get('/request/allrequest?date='+this.statDate+(this.statSite != 'null' ? '&site='+this.statSite : '')).then((response) => {
					this.statisticData = response.data.data;
				}).catch(() => {});
			},
			getData() {
				this.$http.get('/request/getstatistics?date='+this.statDate).then((response) => {
					this.series = response.data.data.body.values;
					this.options = {...this.options, ...{
							xaxis: {
								categories: response.data.data.body.categories
							}
						}};
					this.series2 = response.data.data.body.values.map(item => item.data.reduce((a, b) => (+a) + (+b), 0));
					this.chartOptions = {...this.chartOptions, ...{
							labels: response.data.data.body.values.map(item => item.name)
						}};
					this.chartOptions3 = {...this.chartOptions3, ...{
							labels: response.data.data.body.classes.map(item => item.name)
						}};
					this.series3 = response.data.data.body.classes.map(item => +item.orders)
				}).catch(() => {});
			},
			getCollegeInfo() {
				this.$http.get('/request/collegeInfo/'+this.$store.getters.getCollegeInfo.bin).then((response) => {
					this.series4 = response.data.data.values;
					this.options4 = {...this.options, ...{
							xaxis: {
								categories: response.data.data.categories
							}
						}};
				}).catch(() => {});
			}
		},
		watch: {
			statDate() {
				this.getData();
				this.getAllRequest();
			},
			statSite() {
				this.getAllRequest();
			}
		}
	}
</script>

<style >
	.nav-item {
		cursor: pointer;
	}
</style>