<template>
	<div>

		<v-row class="mb-4">
			<v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
			<v-spacer></v-spacer>
			<v-col class="shrink">
				<v-btn color="primary" @click.stop="getAskDialog">{{ $t('Задать вопрос') }}</v-btn>

				<v-dialog v-model="askDialog" width="500" :persistent="actionIsLoading">
					<v-card>
						<v-card-title class="headline lighten-2">{{ $t('Задать вопрос') }}</v-card-title>
						<v-card-text>
							<v-form class="form" ref="askForm">
								<v-select
									v-model="regionIsEdusSelected"
									:items="regionIsEdusList"
									item-text="name"
									item-value="ab"
									:rules="[v => !!v || $t('Обязательное поле')]"
									:label="$t('Регион')">
								</v-select>
								<v-select
									v-if="collegeList.length"
									v-model="sendData.bin"
									:items="collegeList"
									item-text="short_name"
									item-value="bin"
									:rules="[v => !!v || $t('Обязательное поле')]"
									:label="$t('Колледж')">
								</v-select>
								<v-text-field
									v-model="sendData.title"
									:label="$t('Заголовок вопроса')"
									type="text"
									:rules="[v => !!v || $t('Обязательное поле')]"
									required
								></v-text-field> 
								<v-text-field
									v-model="sendData.body"
									:label="$t('Ваш вопрос')"
									type="text"
									:rules="[v => !!v || $t('Обязательное поле')]"
									required
								></v-text-field> 
							</v-form>
						</v-card-text>
						<v-divider></v-divider>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" text @click.stop="askSubmit" :loading="actionIsLoading">
								{{ $t('Отправить') }}
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-col>
		</v-row>
		<v-alert
			border="left"
			colored-border
			:color="item.status == '0' ? 'orange darken-2' : item.status == '1' ? 'red darken-2' : 'green darken-2'"
			elevation="2" v-for="(item, index) in questionList" :key="index">
			<div class="pa-2 py-0">
				<div class="text-h6 mb-3">{{ $t('Колледж') }}: {{ item.college_name }}</div>
				<b>{{ $t('Вопрос') }}:</b>
				<div class="pa-3">
					<p>{{ item.title }}</p>
					<p>{{ item.body }}</p>
				</div>

				<template v-if="item.answer.length">
					<b>{{ $t('Ответ') }}:</b>
					<div class="pa-3">
						<p>{{ item.answer }}</p>
					</div>
				</template>
			</div>
		</v-alert>
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
						text: this.$t('Виртуальный блог'),
						disabled: true,
						exact: true,
						to: '/abiturient/virtual-blogs',
					}
				];
			}
		},
		data: () => ({
			isLoading: true,
			questionList: [],
			actionIsLoading: false,
			askDialog: false,
			regionIsEdusList: [],
			regionIsEdusSelected: null,
			collegeList: [],
			sendData: {
				"title": "",
				"body": "",
				"bin": ""
			}
		}),
		methods: {
			async getAskDialog() {
				this.getRegionIsEdus();
				this.askDialog = true;
			},
			async getRegionIsEdus() {
				if(!this.regionIsEdusList.length) {
					await this.$http.post('/region', {
						"country_id" : 192,
						"is_edus" : true,
					}).then((response) => {
						this.regionIsEdusList = response.data.data;
					});
				}
			},
			async getCollege() {
				if(!this.collegeList.length) {
					await this.$http.get('/college/list?limit=all&region_ab='+this.regionIsEdusSelected).then((response) => {
						this.collegeList = response.data.data.list;
					});
				}
			},
			async getData() {
				await this.$http.get("/blog").then((response) => {
					this.questionList = response.data.data;
				});
			},
			async askSubmit() {
				this.actionIsLoading = true;
				await this.$http.post('/addBlog', this.sendData).then(() => {
					this.askDialog = false;

					this.$store.dispatch('alertAdd', {text: "success", type: 'success'});
					this.getData();
				});
				this.actionIsLoading = false;
			}
			
		},
		watch: {
			regionIsEdusSelected() {
				this.collegeList = [];
				this.sendData.bin = '';
				this.getCollege();
			}
		}
  }
</script>