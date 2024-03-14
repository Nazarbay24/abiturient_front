<template>
    <v-app>
        <app-alerts/>
        <router-view/>
    </v-app>
</template>


<script>
    import AppAlerts from './components/AppAlerts';

    export default {
        components: {
            AppAlerts
        },

        created() {

        },

        computed: {}
    }

</script>
