<template>
    <div>
        <div class="panel-header panel-header-custom bg-primary-gradient">
            <div class="page-inner py-5">
                <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                    <div>
                        <h2 class="text-white pb-2 fw-bold">{{ $t('Текущий рейтинг') }}</h2>
                        <!-- <h5 class="text-white op-7 mb-2">Краткая статистика заявок приема</h5> -->
                    </div>
                    <div class="ml-md-auto py-2 py-md-0">

                    </div>
                </div>
            </div>
        </div>

        <div class="page-inner mt--5">
            <v-data-table
                    :headers="data.headers"
                    :items="data.list"
                    :loading="isLoading"
                    :footer-props="{'items-per-page-options': [-1]}"
                    class="elevation-1 place-list">
                <template v-slot:item.file="{item}">
                    {{item.file.split('/').slice(-1)[0]}}
                </template>
                <template v-slot:item.actions="{item}">
                    <v-btn :href="item.file" download depressed small color="primary">{{ $t('Скачать') }}</v-btn>
                </template>
            </v-data-table>
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
            data: [],
        }),
        methods: {
            async getData() {
                this.isLoading = true;
                await this.$http.get('/ranging/preliminary').then((response) => {
                    this.data = response.data.data.preliminaryRanging;
                    this.data.headers.push({value: 'actions', sortable: false, align: 'end', width: '80'});
                });
                this.isLoading = false;
            }
        }
    }
</script>