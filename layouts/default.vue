<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">LC</span>
              </div>
              <span class="text-xl font-semibold text-gray-900">LLM Context Tool</span>
            </NuxtLink>
          </div>
          
          <div class="flex items-center space-x-4">
            <NuxtLink 
              to="/projects" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Projects
            </NuxtLink>
            <NuxtLink 
              to="/rules" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Rules
            </NuxtLink>
            <NuxtLink 
              to="/export" 
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Export
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Current Project Indicator -->
    <div v-if="currentProject" class="bg-blue-50 border-b border-blue-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-blue-600">Current Project:</span>
            <span class="font-medium text-blue-900">{{ currentProject.name }}</span>
          </div>
          <button 
            @click="clearCurrentProject"
            class="text-blue-600 hover:text-blue-800 text-sm"
          >
            Switch Project
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const projectsStore = useProjectsStore()
const { currentProject } = storeToRefs(projectsStore)

const clearCurrentProject = () => {
  projectsStore.setCurrentProject(null)
  navigateTo('/projects')
}
</script>
