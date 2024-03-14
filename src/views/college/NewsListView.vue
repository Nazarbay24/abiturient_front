<template>
	<div>
		<div class="panel-header panel-header-custom bg-primary-gradient">
			<div class="page-inner py-5">
				<div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
					<div>
						<h2 class="text-white pb-2 fw-bold">{{ $t('Новости колледжа') }}</h2>
						<!-- <h5 class="text-white op-7 mb-2">Краткая статистика заявок приема</h5> -->
					</div>
					<div class="ml-md-auto py-2 py-md-0">
						<a href="#" class="btn btn-secondary btn-round white--text" @click.stop="newsDialog = true">{{ $t('Добавить новость') }}</a>
						<v-dialog v-model="newsDialog" width="700" :persistent="actionIsLoading">
							<v-card>
								<v-card-title class="headline lighten-2">{{ $t('Добавить новость') }}</v-card-title>
								<v-card-text>
									<v-form class="form" ref="newsForm">
										<v-select
											v-model="newsData.lang"
											:items="langList"
											item-text="name"
											item-value="id"
											:rules="[v => !!v || $t('Обязательное поле')]"
											:label="$t('Язык')">
										</v-select>
										<v-text-field
											v-model="newsData.title"
											:label="$t('Заголовок')"
											type="text"
											:rules="[v => !!v || $t('Обязательное поле'), v => v.length >= 10 || $t('Значение поле слишком короткое')]"
											required
										></v-text-field>
										<v-textarea
											v-model="newsData.body"
											:label="$t('Основной текст')"
											type="text"
											rows="2" filled auto-grow
											:rules="[v => !!v || $t('Обязательное поле'), v => v.length >= 100 || $t('Значение поле слишком короткое')]"
											required
										></v-textarea>

										<!-- <v-file-input
											label="Картинка"
											accept="image/*"
											:rules="[v => !!v || 'Обязательное поле', v => !v || v.size < 2097152 || 'Размер картинки не должен превышать 2 Мб']"
											@change="imgToBase64"
											multiple
											required>
											<template v-slot:selection="{ index, text }">
												<v-chip
													small
													label
													color="primary"
													close
													@click.stop:close="chip2 = false">
													{{ index }} {{ text }}
												</v-chip>
											</template>
										</v-file-input> -->
										<v-file-input
											:label="$t('Картинка')"
											accept="image/*"
											:rules="[v => !!v || $t('Обязательное поле'), v => !v || v.size < 2097152 || $t('Размер картинки не должен превышать 2 Мб')]"
											@change="imgToBase64"
											required>
										</v-file-input>
									</v-form>
								</v-card-text>
								<v-divider></v-divider>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="primary" text @click.stop="newsSubmit" :loading="actionIsLoading">
										{{ $t('Добавить') }}
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</div>
				</div>
			</div>
		</div>

		<div class="page-inner" v-if="!newsList.length">
			{{ $t('Нет данных') }}
		</div>
		<div class="page-inner mt--5" v-else>
			<v-row>
				<div class="col-md-3" v-for="(item, key) in newsList" :key="key">
					<div class="card card-post card-round" style="cursor: pointer;">
						<v-img :src="item.image" aspect-ratio="1.7" class="card-img-top" cover></v-img>
						<div class="card-body">
							<p class="card-category text-info mb-1">{{item.created_at}}</p>
							<h3 class="card-title">
								{{ item.title }}
							</h3>
							<p class="card-text">{{ item.body }}</p>
						</div>
						<v-card-actions>
							<v-btn color="error" text @click.stop="removeNews(item.id)">
								{{ $t('Удалить') }}
							</v-btn>
							<v-spacer></v-spacer>
							<v-btn color="primary" text @click.stop="openNews(item.id)">
								{{ $t('Посмотреть') }}
							</v-btn>
						</v-card-actions>
					</div>
				</div>
			</v-row>
			<v-dialog v-model="newsViewDialog" width="900" >
				<v-card>
					<!-- <v-card-title class="headline lighten-2">Добавить новость</v-card-title> -->
					<v-card-text>
						<h2 class="pt-6 pb-2">{{ newsItem.title }}</h2>
						<p>{{ newsItem.body }}</p>
						<p>{{ newsItem.created_at }}</p>
						<v-row>
							<v-col v-for="(item, key) in newsItem.image" :key="key" class="d-flex child-flex" cols="4">
								<v-img :src="item" aspect-ratio="1.7" class="grey lighten-2"></v-img>
							</v-col>
						</v-row>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn color="error" text @click.stop="removeNews(newsItem.id)">
							{{ $t('Удалить') }}
						</v-btn>
						<v-spacer></v-spacer>
						<v-btn color="primary" text @click.stop="newsViewDialog = false">
							{{ $t('Закрыть') }}
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
            this.getData();
        },
		data: () => ({
			isLoading: true,
			actionIsLoading: false,
			newsDialog: false,
			newsViewDialog: false,
			newsItem: {},
			newsList: [],
			langList: [
				{
					"id": "kk",
					"name": "Қазақша"
				},
				{
					"id": "ru",
					"name": "Русский"
				}
			],
			newsData: {
				"lang": '',
				"title": '',
				"body": '',
				"img": []
			}
		}),
		methods: {
			async getData() {
				this.isLoading = true;
				await this.$http.get('/news').then((response) => {
					this.newsList = response.data.data;
				});
				this.isLoading = false;
			},
			async openNews(id) {
				this.isLoading = true;
				await this.$http.get('/news/'+id).then((response) => {
					this.newsItem = response.data.data.body;
					this.newsViewDialog = true;
				});
				this.isLoading = false;
			},
			async removeNews(id) {
				if(confirm(this.$t('Вы действительно хотите удалить эту новость?'))) {
					this.isLoading = true;
					await this.$http.get('/news/'+id+'/delete').then(() => {
						this.$store.dispatch('alertAdd', {text: "success", type: 'success'});
						this.getData();
						this.newsViewDialog = false;
					});
					this.isLoading = false;
				}
			},
			// openNews(id) {
			// 	this.$router.push({ path: '/college/news/'+id });
			// },
			imgToBase64(file) {
				if(file) {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => {
						let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
						if ((encoded.length % 4) > 0) {
							encoded += '='.repeat(4 - (encoded.length % 4));
						}
						this.newsData.img = [encoded];
					};
				}
				this.newsData.img = '';
			},
			async newsSubmit() {
				if(this.$refs.newsForm.validate()) {
					this.actionIsLoading = true;
					await this.$http.post('/news/add', this.newsData).then(() => {
						this.$store.dispatch('alertAdd', {text: "success", type: 'success'});
						this.newsDialog = false;
						this.getData().then(() => {

						});
					}).catch(() => {});
					this.actionIsLoading = false;
				}
			}
		}
    }
</script>