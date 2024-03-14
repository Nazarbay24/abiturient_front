<template>
	<div>
		<div class="panel-header panel-header-custom bg-primary-gradient">
			<div class="page-inner py-5">
				<div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
					<div>
						<h2 class="text-white pb-2 fw-bold">{{ $t('Виртуальный блог') }}</h2>
						<!-- <h5 class="text-white op-7 mb-2">Краткая статистика заявок приема</h5> -->
					</div>
					<!-- <div class="ml-md-auto py-2 py-md-0">
						<a href="#" class="btn btn-white btn-border btn-round mr-2">Manage</a>
						<a href="#" class="btn btn-secondary btn-round">Add Customer</a>
					</div> -->
				</div>
			</div>
		</div>
		<div class="page-inner mt--5">
			<div class="card mb-6" v-for="(item, index) in questionList" :key="index">
				<div class="card-body">
					<div class="d-flex">
						<div class="avatar">
							<span class="avatar-title rounded-circle border border-white bg-info">
								<i class="fas fa-user"></i>
							</span>
						</div>
						<div class="flex-1 ml-3 pt-1" style="font-size: 15px;">
							<h6 class="text-uppercase fw-bold mb-1">
								{{ item.fio }} <span v-if="item.email">/ {{ item.email }}</span> 
								<span :class="`text-${item.status == '0' ? 'warning' : item.status == '1' ? 'muted' : 'success'} pl-3`">{{ item.status == '0' ? $t('Новый') : item.status == '1' ? $t('Закрыт') : $t('Закрыт с ответом') }}</span>
							</h6>
							<div class="mt-3">
								<div class="text-muted"><b>{{ item.title }}</b></div>
								<span class="text-muted">{{ item.body }}</span>
							</div>
							<div v-if="item.answer.length" class="separator-dashed"></div>
							<v-alert v-if="item.answer.length" dense outlined color="info" class="mb-0" style="font-size: 15px;">
								<b>{{ $t('Ответ') }}:</b>
								<div>{{ item.answer }}</div>
							</v-alert>
						</div>
						<div class="float-right pt-1">
							<small class="text-muted">{{ item.date }}</small>
						</div>
					</div>
				</div>
				<v-card-actions v-if="item.status == '0'">
					<v-spacer></v-spacer>
					<v-btn color="error" small text @click.stop="submit(item, 1)">
						{{ $t('Закрыть') }}
					</v-btn>
					<v-btn color="primary" small text @click.stop="currentItem = item; answerDialog = true">
						{{ $t('Ответить') }}
					</v-btn>
				</v-card-actions>
			</div>

			<v-dialog v-model="answerDialog" width="600" :persistent="actionIsLoading">
				<v-card>
					<v-card-title class="headline lighten-2">{{ $t('Ответить') }}</v-card-title>
					<v-card-text>
						<v-form class="form" ref="answerForm">
							<v-textarea
								v-model="answerText"
								:label="$t('Ваш ответ')"
								rows="2" filled auto-grow
								:rules="[v => !!v || $t('Обязательное поле')]"
							></v-textarea>
						</v-form>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" text @click.stop="submit(currentItem, 2)" :loading="actionIsLoading">
							{{ $t('Отправить') }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		mounted() {
			this.setFilter(this.$route.params.filter);
			this.getData();
		},
		data: () => ({
			filter: '',
			isLoading: true,
			questionList: [],
			answerText: '',
			currentItem: {},
			actionIsLoading: false,
			answerDialog: false
		}),
		methods: {
			setFilter(filter) {
				this.filter = '';
				this.questionList = [];
				if(filter == 'new') {
					this.filter = '?status=0';
				}
			},
			async submit(item, status) {
				if(!this.$refs.answerForm || this.$refs.answerForm.validate()) {
					this.actionIsLoading = true;
					await this.$http.post("/blog/answer", {
						"id": item.id,
						"status": status,
						"answer": this.answerText,
					}).then(() => {
						item.status = status;
						item.answer = this.answerText;
						this.answerText = '';
						this.answerDialog = false;
						this.actionIsLoading = false;
					});
				}
			},
			async getData() {
				await this.$http.get("/blogs"+this.filter).then((response) => {
					this.questionList = response.data.data;
				});
			},
			
		},
		watch: {
			answerDialog(v) {
				if(!v) {
					this.$refs.answerForm.reset();
					this.currentItem = {};
					this.answerText = '';
				}
			},
			$route(to) {
				this.setFilter(to.params.filter);
				this.getData();
			}
		}
  }
</script>