<template>
	<div>
		<v-btn color="primary" to="/abiturient/my-requests/new">{{ $t('Создать новую заявку') }}</v-btn>

		<br><br>
		<v-alert
			v-for="(item, index) in myRequestsList"
			:key="item.id"
			prominent
			dense
			border="left"
			colored-border
			color="orange darken-1">
			<div class="row row-card-no-pd">
				<div class="col-sm-12 col-md-1">
				<h2 class="text-info">{{ index+1 }}.</h2>
				</div>				
				<div class="col-sm-6 col-md-4">
					<div class="card card-stats card-round">
						<div class="card-body ">
							<div class="row"> 
								<div class="col-12">											 
										<p class="card-category">{{ myRequestsHeaders.full_name }}</p>
										<h5 class="card-title text-dark" style="line-height:1">{{ item.full_name }}</h5>
										<br><p class="card-category text-dark">{{ item.created_at }}</p>											 
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-sm-6 col-md-4">
					<div class="card card-stats card-round">
						<div class="card-body ">
							<div class="row">
								<div class="col-12">
										<p class="card-category">{{ myRequestsHeaders.payment_type_name }}</p>
										<p class="card-category text-dark">{{ item.payment_type_name }}</p>
										<p class="card-category">{{ item.region_name }}</p>
								</div>

							</div>
						</div>
					</div>
				</div>
				<div class="col-sm-6 col-md-3">
					<div class="card card-stats card-round">
						<div class="card-body">
							<div class="row">
								<div class="col-12">
										<p class="card-category">{{ myRequestsHeaders.education_type_name }}</p>
										<p class="card-category text-dark">{{ item.education_type_name }}</p>
										<p class="card-category">{{ myRequestsHeaders.quota }}: <span class="text-danger">{{ item.quota }}</span></p>
										<p class="card-category orange--text text-darken-1 mt-2">{{ myRequestsHeaders.status_name }}: {{ item.status_name }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row row-card-no-pd">
				<div class="col-sm-12 col-md-12">
					<div class="card card-stats card-round">
						<div class="card-body">
							<div class="row">						
								<div class="col-sm-12 col-md-6 text-left">
								<p class="card-category">{{ myRequestsHeaders.from_site }}: <span style="text-transform: uppercase;">{{ item.from_site }}</span></p>
								</div>						
								<div class="col-sm-12 col-md-6 text-right">
								<v-btn depressed color="primary" :to="'/abiturient/my-requests/'+item.id">{{ $t('Посмотреть') }}</v-btn>
								</div>
							</div>
						</div>
					</div>	
				</div>
			</div>
		</v-alert>
	</div>
</template>

<script>
	export default {
        mounted() {
            this.getData();
        },
		data: () => ({
			isLoading: true,
			myRequestsHeaders: {},
			myRequestsList: [],
		}),
		methods: {
			async getData() {
				this.isLoading = true;
				await this.$http.get('/request').then((response) => {
					response.data.data.requestList.headers.forEach((item) => {
						this.myRequestsHeaders[item.value] = item.text;
					});
					this.myRequestsList = response.data.data.requestList.list;
				});
				this.isLoading = false;
			},

		}
	}
</script>

<style type="text/css" scoped>
	.row-card-no-pd .card {
		margin-bottom: 0;
		border-width: 0;
		box-shadow: none;
		position: relative;
	}
	.row-card-no-pd [class*=col]:not(:last-child) .card:before {
		position: absolute;
		height: calc(100%);
		width: 1px;
		background: #eee;
		content: '';
		right: 0;
	}
	.text-info, .text-info a {
		color: #48abf7 !important;
	}
	.card-category {
		margin-top: 0;
		font-size: 14px;
		color: #8d9498;
		margin-bottom: 0;
		word-break: normal;
		line-height: 1.82;
	}
	.card-stats .card-body {
		padding: 15px!important;
	}
	.text-dark {
		color: #343a40 !important;
	}
	.card-title {
		margin: 0;
		color: #575962;
		font-size: 20px;
		font-weight: 400;
		line-height: 1.6;
	}
	.card-stats .card-title {
		margin-bottom: 0!important;
	}
</style>