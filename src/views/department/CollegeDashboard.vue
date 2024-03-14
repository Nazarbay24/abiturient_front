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

                    </div>
                </div>
            </div>
        </div>
        <div class="page-inner mt--5">
            <div class="row mt--2">
                <v-col>
                    <v-data-table
                            :headers="requestsHeaders"
                            :items="requestsList"
                            :loading="isLoading"
                            :items-per-page="-1"
                            @click:row="handleClick"
                            class="elevation-1 place-list">
                    </v-data-table>
                </v-col>
            </div>
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
            requestsHeaders: [],
            requestsList: []
        }),
        methods: {
            handleClick(link) {
                this.$router.push({ path: '/department/colleges/'+link.bin });
            },
            async getData() {
                this.isLoading = true;
                await this.$http.get("/request/colleges?region=23").then((response) => {
                    this.requestsHeaders = response.data.data.requestList.headers;
                    this.requestsList = response.data.data.requestList.list;
                });
                this.isLoading = false;
            },

        }
    }
</script>