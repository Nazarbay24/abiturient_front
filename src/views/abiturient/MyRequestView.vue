<template>
	<div>
		<v-row>
			<v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
		</v-row>
		<v-row>
			<v-col lg="4" md="5" cols="12">
				<template v-if="Object.keys(requestInfo).length != 0">
					<template v-if="(requestInfo.values.from_site.value != 'EGOV' && +requestInfo.values.request_status.value.id == 2) || (+requestInfo.values.request_status.value.id != 5 && +requestInfo.values.request_status.value.id != 6 && +requestInfo.values.request_status.value.id != 7)">
						<v-btn block color="error" class="mb-4" @click.stop="withdrawDialog = true">
							{{ $t('Отозвать заявку') }}
						</v-btn>
						<v-dialog v-model="withdrawDialog" width="500" :persistent="actionIsLoading">
							<v-card>
								<v-card-title class="headline lighten-2">{{ $t('Отозвать заявку') }}</v-card-title>
								<v-card-text>
									<v-form class="form" ref="withdrawForm">

										<sign-ecp @update-ecp-file-data="ecpFileData = $event" @update-ecp-password="ecpPassword = $event" />
									</v-form>
								</v-card-text>
								<v-divider></v-divider>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="primary" text @click.stop="withdrawSubmit" :loading="actionIsLoading">
										{{ $t('Подписать') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-divider class="my-6" />
					</template>
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
				<v-expansion-panels multiple v-model="panel" class="request-data">
					<v-expansion-panel v-for="(panel, panelKey) in requestDate" :key="panelKey">
						<v-expansion-panel-header>{{panel.name}} </v-expansion-panel-header>
						<v-expansion-panel-content>
							<div class="pt-4">
								<template v-for="(item, itemKey) in panel.values">
									<v-row :key="itemKey">
										<v-col class="prop-title">{{item.name}}</v-col>
										<v-col v-if="item.type != 'file'">{{item.value}}</v-col>
										<v-col v-else><a :href="item.value" :download="item.file_name" target="_blank">{{item.file_name}}</a></v-col>
									</v-row>

									<template v-if="item.childs">
										<template v-for="(childItem, childKey) in item.childs">
											<v-row :key="childKey">
												<v-col>
													<div class="mb-3"><b>{{childItem.exam_name.value}}</b></div>
													<v-row>
														<v-col><div class="ml-4">{{childItem.exam_date.name}}:</div></v-col>
														<v-col>{{childItem.exam_date.value}}</v-col>
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
							</div>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
	</div>
</template>

<script>
	export default {
        mounted() {
            this.getData();
        },
		computed: {
			breadcrumbs() {
				return [
					{
						text: this.$t('Главная'),
						disabled: false,
						exact: true,
						to: '/abiturient',
					},
					{
						text: this.$t('Мои заявки'),
						disabled: false,
						exact: true,
						to: '/abiturient/my-requests',
					},
					{
						text: this.$t('Просмотр заявки'),
						disabled: true,
						exact: true,
						to: '',
					}
				];
			}
		},
		data: () => ({
			requestId: null,
			panel: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // TODO
			actionIsLoading: false,
			withdrawDialog: false,
			requestDate: {},
			requestInfo: {},
			ecpFileData: null,
			ecpPassword: null,
		}),
		methods: {
			async getData() {
				await this.$http.get('/request/'+this.$route.params.id).then((response) => {
					this.requestDate = response.data.data.block;
					this.requestInfo = response.data.data.info;
					this.requestId = this.requestInfo.values.request_id.value;
				}).catch(() => {});
			},
			async withdrawSubmit() {
				if(this.$refs.withdrawForm.validate()) {
					this.actionIsLoading = true;
					await this.$http.post('/withdraw', {
						"p12": this.ecpFileData,
						"password": this.ecpPassword,
						"request_order_id": this.requestId
					}).then(() => {
						this.getData().then(() => {
							this.withdrawDialog = false;
							this.$store.dispatch('alertAdd', {text: this.$t('Заявка успешно отозвана.'), type: 'success'});
						});
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			}
		},
		watch: {

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