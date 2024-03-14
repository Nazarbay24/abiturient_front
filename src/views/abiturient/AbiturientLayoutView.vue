<template>
  <v-app class="grey lighten-3">
    <Header />
    <v-container class="pt-5 pb-5">
      <v-main style="min-height: 60vh;">
          <router-view />
      </v-main>
    </v-container>

    <Footer />
  </v-app>
</template>

<script>
  import Header from '@/components/abiturient/Header.vue'
  import Footer from '@/components/abiturient/Footer.vue'
  export default {
    components: {
      Header,
      Footer
    },
    mounted() {
      

    },
    computed: {
      selectedLanguage() {
        return this.$store.getters.getLanguage;
      }
    },
    data: () => ({
      languages: {
        'kk': 'Қазақша',
        'ru': 'Русский'
      }
    }),
    methods: {
      changeLanguage(lang) {
        this.$store.commit('setLanguage', lang);
        location.reload();
      },
      logout() {
        this.$store.dispatch('logout');
      }
    }
  }
</script>

<style>
  @media (min-width: 1904px) {
    .container {
      max-width: 1140px !important;
    }
  }
  
</style>