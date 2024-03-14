<template>
    <div>
        <div class="panel-header panel-header-custom bg-primary-gradient">
            <div class="page-inner py-5">
                <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                    <div>
                        <h2 class="text-white pb-2 fw-bold">{{ $t('Статистика') }}</h2>
                        <!-- <h5 class="text-white op-7 mb-2">Краткая статистика заявок приема</h5> -->
                    </div>
                    <div class="ml-md-auto py-2 py-md-0 text-right">
                        <v-btn depressed class="btn btn-secondary btn-round white--text px-5 mb-2" @click.stop="exportToExcel" :loading="actionIsLoading">{{$t('Экспортировать в Excel')}}</v-btn>
                        <h5 class="text-white op-7">{{ $t('Передача персональных данных третьим лицам преследуется законом РК') }}</h5>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-inner mt--5">
            <div class="row mt--2">
                <v-col>
                    <v-data-table
                            :headers="requestsHeaders"
                            hide-default-header
                            :items="requestsList"
                            :loading="isLoading"
                            :items-per-page="rowsPerPage"
                            :options.sync="pagination"
                            :footer-props="{'items-per-page-options': [15, 30, 50, 100]}"
                            :server-items-length="totalItems"
                            class="elevation-1 place-list">
                        <template v-slot:header="">
                            <thead class="v-data-table-header">
                            <tr>
                                <th v-for="(headerItem, headerIndex) in requestsHeaders" :key="headerIndex" class="text-start" :width="headerItem.width">
                                    <template v-if="headerItem.value == 'iin'">
                                        <v-text-field style="display: inline-block; width: 140px;" class="pt-5"
                                                      v-model="searchIin"
                                                      :label="headerItem.text"
                                                      type="number"
                                                      @wheel="$event.target.blur()"
                                                      clearable
                                                      dense>
                                        </v-text-field>
                                    </template>
                                    <template v-else-if="headerItem.value == 'is_have_quota'">
                                        <v-select style="display: inline-block; width: 110px;" class="pt-5"
                                                  v-model="quotaSelected"
                                                  :items="quotaList"
                                                  @change="getData"
                                                  item-text="name"
                                                  item-value="id" dense clearable
                                                  :label="headerItem.text">
                                        </v-select>
                                    </template>
                                    <template v-else-if="headerItem.value == 'from_site'">
                                        <v-select style="display: inline-block; width: 110px;" class="pt-5"
                                                  v-model="fromSiteSelected"
                                                  :items="fromSiteList"
                                                  @change="getData"
                                                  item-text="name"
                                                  item-value="id" dense clearable
                                                  :label="headerItem.text">
                                        </v-select>
                                    </template>
                                    <template v-else-if="headerItem.value == 'status'">
                                        <v-select style="display: inline-block; width: 150px;" class="pt-5"
                                                  v-model="requestStatusSelected"
                                                  :items="requestStatusList"
                                                  @change="getData"
                                                  item-text="name"
                                                  item-value="id" dense clearable
                                                  :label="headerItem.text">
                                        </v-select>
                                    </template>
                                    <template v-else-if="headerItem.value == 'college_name'">
                                        <v-select style="display: inline-block; width: 150px;" class="pt-5"
                                                  v-model="collegeSelected"
                                                  :items="collegeList"
                                                  @change="getData"
                                                  item-text="name"
                                                  item-value="bin" dense clearable
                                                  :label="headerItem.text">
                                        </v-select>
                                    </template>
                                    <!--<template v-else-if="headerItem.value == 'created_at'">
                                        <v-menu
                                                v-model="datePickerCreatedAt"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                transition="scale-transition"
                                                offset-y
                                                min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                        style="display: inline-block; width: 170px;" class="pt-5"
                                                        v-model="requestCreatedAt"
                                                        :label="headerItem.text"
                                                        readonly
                                                        required dense clearable
                                                        v-bind="attrs"
                                                        v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker
                                                    v-model="requestCreatedAt"
                                                    @input="datePickerCreatedAt = false"
                                            ></v-date-picker>
                                        </v-menu>
                                    </template>-->
                                    <template v-else>
                                        {{ headerItem.text }}
                                    </template>
                                </th>
                            </tr>
                            </thead>
                        </template>
                    </v-data-table>
                </v-col>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.getFilterParams();
        },
        data: () => ({
            isLoading: true,
            requestsHeaders: [],
            requestsList: [],
            rowsPerPage: 15,
            pagination: {},
            totalItems: 10,

            quotaList: [],
            quotaSelected: null,

            fromSiteList: [],
            fromSiteSelected: null,

            requestStatusList: [],
            requestStatusSelected: null,

            collegeList: [],
            collegeSelected: null,

            actionIsLoading: false,
            searchIin: null,

        }),
        methods: {
            async getData() {
                this.isLoading = true;
                this.fullFilter = "?limit=" + (this.pagination.itemsPerPage || this.rowsPerPage) +
                    "&page=" + (this.pagination.page || 1) +
                    (this.requestStatusSelected ? "&status_id=" + this.requestStatusSelected : "") +
                    (this.fromSiteSelected ? "&from_site=" + this.fromSiteSelected : "") +
                    (this.quotaSelected != null ? "&is_have_quota=" + this.quotaSelected : "") +
                    (this.searchIin && this.searchIin.length === 12 ? "&iin=" + this.searchIin : "") +
                    (this.collegeSelected ? "&bin=" + this.collegeSelected : "");
                await this.$http.get("/request/requests" + this.fullFilter).then((response) => {
                    this.requestsHeaders = response.data.data.requestList.headers;
                    this.requestsList = response.data.data.requestList.list;
                    this.totalItems = +response.data.data.requestList.total;
                });
                this.isLoading = false;
            },

            getFilterParams() {
                if (!this.requestStatusList.length) {
                    this.isLoading = true;
                    this.$http.get('/requestStatus').then((response) => {
                        this.requestStatusList = response.data.data;
                    });
                    this.isLoading = false;
                }
                if (!this.fromSiteList.length) {
                    this.isLoading = true;
                    this.$http.get('/fromSite').then((response) => {
                        this.fromSiteList = response.data.data;
                    });
                    this.isLoading = false;
                }
                if (!this.quotaList.length) {
                    this.isLoading = true;
                    this.$http.get('/quotaCategory').then((response) => {
                        this.quotaList = response.data.data;
                    });
                    this.isLoading = false;
                }
                if (!this.collegeList.length) {
                    this.isLoading = true;
                    this.$http.get('/collegeList').then((response) => {
                        this.collegeList = response.data.data;
                    });
                    this.isLoading = false;
                }
            },
            async exportToExcel() {
                this.actionIsLoading = true;
                await this.$http.get('/getexcel' + this.fullFilter, {responseType: 'blob'}).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', this.$t('Заявки')+'.xls');
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }).catch(() => {});
                this.actionIsLoading = false;
            }
        },
        watch: {
            pagination() {
                this.getData();
            },
            searchIin() {
                this.getData();
            }
        }
    }
</script>

<style>
    th label, th input, th .v-input {
        font-size: 12px !important;
        font-weight: 700;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {
        -moz-appearance: textfield;
    }
</style>