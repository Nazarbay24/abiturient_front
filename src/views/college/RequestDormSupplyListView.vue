<template>
    <div>
        <div class="panel-header panel-header-custom bg-primary-gradient">
            <div class="page-inner py-5">
                <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                    <div>
                        <h2 class="text-white pb-2 fw-bold">{{ $route.name == 'dorm' ? $t('Заявки на общежитие') : $t('Заявки на питание') }}</h2>
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
            <v-data-table
                :headers="requestsHeaders"
                :items="requestsList"
                :loading="isLoading"
                :items-per-page="rowsPerPage"
                :options.sync="pagination"
                :footer-props="{'items-per-page-options': [15, 30, 50, 100]}"
                :server-items-length="totalItems"
                class="elevation-1 place-list">
                <template v-slot:item="{ item }">
                    <tr>
                        <template v-for="(headerItem, headerIndex) in requestsHeaders">
                            <td v-if="headerItem.value != 'actions'" :key="headerIndex" @click.stop="handleClick(item)" style="cursor: pointer;">
                                {{item[headerItem.value]}}
                            </td>
                            <td v-else :key="headerIndex">
                                <v-tooltip left>
                                    <template v-slot:activator="{ on, attrs }">
									<span v-bind="attrs" v-on="on">
										<router-link  :to="'/college/requests/'+$route.name+'/'+item.id" target="_blank" style="text-decoration: none;"><v-icon class="show-on-hover">mdi-open-in-new</v-icon></router-link>
									</span>
                                    </template>
                                    <span>{{$t('Открыть в новом окне')}}</span>
                                </v-tooltip>
                            </td>
                        </template>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.$http.defaults.baseURL = this.$store.getters.getBaseUrl+'egov/'+this.$store.getters.getApiVersion+'/'+this.$store.getters.getCurrentRole+'/'+this.$store.getters.getLanguage;
            this.setFilter(this.$route.name);
        },
        beforeDestroy() {
            this.$store.dispatch("changeBaseUrl");
        },
        data: () => ({
            filter: '',
            isLoading: true,
            requestsHeaders: [],
            requestsList: [],
            rowsPerPage: 15,
            totalItems: 0,
            pagination: {},
        }),
        methods: {
            setFilter(filter) {
                this.requestsHeaders = [];
                this.requestsList = [];
                this.totalItems = 0;

                if(filter == 'dorm') {
                    this.filter = '?type=1';
                } else {
                    this.filter = '?type=2';
                }
            },
            handleClick(link) {
                this.$router.push({ path: '/college/requests/'+this.$route.name+'/'+link.id });
            },
            async getData() {
                this.isLoading = true;
                await this.$http.get("/request/all"+this.filter+"&limit="+(this.pagination.itemsPerPage || this.rowsPerPage)+"&page="+(this.pagination.page || 1)).then((response) => {
                    this.requestsHeaders = response.data.data.requestList.headers;
                    this.requestsHeaders.push({value: 'actions', sortable: false, align: 'end', width: '50'});
                    this.requestsList = response.data.data.requestList.list;
                    this.totalItems = +response.data.data.requestList.total;
                });
                this.isLoading = false;
            },

        },
        watch: {
            pagination() {
                this.getData();
            },
            $route(to){
                this.setFilter(to.name);
                if(this.pagination.page == 1) {
                    this.getData();
                } else {
                    this.pagination.page = 1;
                }
            }
        }
    }
</script>