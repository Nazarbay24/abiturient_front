<template>
    <div class="alerts">
        <v-alert class="elevation-3" transition="slide-x-reverse-transition" v-for="(alert, key) in $store.state.alerts" :key="key" :value="true" :type="alert.type" dismissible>
            {{alert.text}}
        </v-alert>
    </div>
</template>

<script>
    export default {
    }
</script>

<style scoped>
    .alerts {
        position: fixed;
        top: 50px;
        left: 50%;
        z-index: 9999;
        margin: 0 auto;
        transform: translate(-50%, 0);
    }
</style>