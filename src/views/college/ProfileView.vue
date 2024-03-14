<template>
	<div>
		<div class="panel-header panel-header-custom bg-primary-gradient">
			<div class="page-inner py-5">
				<div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
					<div>
						<h2 class="text-white pb-2 fw-bold">{{ $t('Профиль колледжа') }}</h2>
						<!-- <h5 class="text-white op-7 mb-2">Краткая статистика заявок приема</h5> -->
					</div>
					<div class="ml-md-auto py-2 py-md-0">
						<a v-if="!editMode" class="btn btn-secondary btn-round white--text" @click.stop="setEditMode">{{ $t('Редактировать') }}</a>
						<a v-else class="btn btn-secondary btn-round white--text" @click.stop="submitChange">{{ $t('Сохранить') }}</a>
					</div>
				</div>
			</div>
		</div>
		<div class="page-inner mt--5">
			<v-card elevation="2" v-if="Object.keys(profileInfo).length != 0" class="mb-5">
				<v-card-text class="request-data card-text-custom pt-4">
					<v-form class="form" ref="profileForm">
						<v-row>
							<v-col lg="4" md="6" cols="12" v-for="(item, itemKey) in profileInfo.values" :key="itemKey">
								<v-text-field
									v-if="item.type == 'string'"
									v-model="item.value"
									:label="item.name"
									type="text"
									:rules="[v => !item.is_required || !!v || $t('Обязательное поле')]"
									:disabled="!editMode || !item.can_change">
								</v-text-field>
								<template v-else-if="item.type == 'file'">
									<label v-if="!editMode || item.file_name">{{item.name}}</label>
									<v-img  
										v-if="item.file_name"
										max-width="100%"
										width="150px"
										:src="item.value"
										aspect-ratio="1.5" />
									<template v-if="editMode && item.can_change">
										<div v-if="item.file_name" class="pt-2 blue--text text-decoration-underline" style="cursor: pointer;" @click.stop="item.file_name = null; item.value = null">
											<small>{{ $t('Изменить картинку') }}</small>
										</div>
										<v-file-input
											v-else
											:label="item.name"
											accept="image/*"
											:rules="[v => !item.is_required || !!v || $t('Обязательное поле'), v => !v || v.size < 2097152 || $t('Размер файла не должен превышать 2 Мб')]"
											@change="toBase64($event, item)"
											required>
										</v-file-input>
									</template>
								</template>
								<template v-else-if="item.type == 'handbook'">
									<v-text-field
										v-if="!editMode || !item.can_change"
										v-model="item.value.name"
										:label="item.name"
										type="text"
										disabled>
									</v-text-field>
									<template v-else>
										<v-select
											v-model="item.value"
											:items="handbooks[itemKey]"
											item-text="name"
											item-value="id"
											:label="item.name"
											:rules="[v => !item.is_required || Object.keys(v).length != 0 || $t('Обязательное поле')]"
											return-object>
										</v-select>
									</template>
								</template>
							</v-col>
						</v-row>
					</v-form>
				</v-card-text>
			</v-card>
			<v-card elevation="2" v-if="Object.keys(committeeInfo).length != 0" class="mb-5">
				<v-card-title class="card-title-custom">
					{{committeeInfo.name}}
					<v-spacer />
					<v-btn v-if="editMode" color="primary" @click.stop="addCommitteeItem">{{ $t('Добавить') }}</v-btn>
				</v-card-title>
				<v-card-text class="request-data card-text-custom pt-4">
					<v-form class="form" ref="profileForm">
						<v-row v-for="(item, itemKey) in committeeInfo.list" :key="itemKey">
							<v-col class="py-0" v-for="(headerItem, headerItemKey) in committeeInfo.headers" :key="headerItemKey">
								<v-text-field
									v-model="item[headerItem.value]"
									:label="headerItem.text"
									type="text"
									:rules="[v => !!v || $t('Обязательное поле')]"
									:disabled="!editMode">
								</v-text-field>
							</v-col>
							<v-col class="py-0 shrink" align-self="center" v-if="editMode">
									<v-icon @click.stop="deleteCommitteeItem(itemKey)">mdi-close</v-icon>
							</v-col>
						</v-row>
					</v-form>
				</v-card-text>
			</v-card>
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
			profileInfo: {},
			editMode: false,
			handbooks: {},
			committeeInfo: {},
		}),
		methods: {
			addCommitteeItem() {
				let item = {};
				for(let key in this.committeeInfo.headers) {
					item[this.committeeInfo.headers[key].value] = '';
				}
				this.committeeInfo.list.push(item)
			},
			deleteCommitteeItem(index) {
				this.committeeInfo.list.splice(index, 1);
			},
			async setEditMode() {
				for(let key in this.profileInfo.values) {
					let item = this.profileInfo.values[key];
					if(item.type == 'handbook' && item.can_change && !this.handbooks[key]) {
						await this.$http.get('/handbook/'+key).then((response) => {
							this.handbooks[key] = response.data.data;
						});
					}
				}
				this.editMode = true;
			},
			async submitChange() {
				if(this.$refs.profileForm.validate()) {
					this.isLoading = true;
					this.profileInfo['list'] = this.committeeInfo.list;
					await this.$http.post('/profile', this.profileInfo).then(() => {
						this.getData().then(() => {
							this.$store.dispatch('alertAdd', {text: this.$t('Изменения успешно сохранены'), type: 'success'});
							this.editMode = false;
						});
					});
					this.isLoading = false;
				}
			},
			async getData() {
				this.isLoading = true;
				await this.$http.get('/profile').then((response) => {
					this.profileInfo = response.data.data.college_profile;
					this.committeeInfo = response.data.data.college_committee;
				});
				this.isLoading = false;
			},
			toBase64(file, item) {
				item.value = null;
				if(file) {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => {
						let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
						if ((encoded.length % 4) > 0) {
							encoded += '='.repeat(4 - (encoded.length % 4));
						}
						item.value = encoded;
					};
				}
			}

		}
    }
</script>