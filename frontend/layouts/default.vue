<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <main class="py-10">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <Nuxt />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

export default {
  name: 'DefaultLayout',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700;
}
.nav-link.active {
  @apply border-blue-500 text-gray-900;
}
.mobile-nav-link {
  @apply block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800;
}
.mobile-nav-link.mobile-nav-active {
  @apply bg-blue-50 border-blue-500 text-blue-700;
}
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
.btn-secondary {
  @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500;
}
.btn-white {
  @apply bg-white text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
.btn-outline-white {
  @apply bg-transparent text-white border-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white;
}
.btn-lg {
  @apply px-6 py-3 text-base;
}
.form-group {
  @apply mb-4;
}
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.form-input, .form-textarea {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500;
}
.card {
  @apply bg-white overflow-hidden rounded-lg shadow p-6;
}
</style> 