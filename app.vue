<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Load initial data
const projectsStore = useProjectsStore()
const codebaseRulesStore = useCodebaseRulesStore()

onMounted(async () => {
  await projectsStore.loadProjects()
  await codebaseRulesStore.loadRules()
})
</script>
