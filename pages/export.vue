<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Export Codebase</h1>
      <p class="text-gray-600">Generate a single file containing your filtered codebase</p>
    </div>

    <!-- No Current Project -->
    <div v-if="!currentProject" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <div class="flex">
        <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <div>
          <h3 class="text-yellow-800 font-medium">No Project Selected</h3>
          <p class="text-yellow-700 text-sm mt-1">
            Please select a project first to export its codebase.
          </p>
          <NuxtLink 
            to="/projects" 
            class="text-yellow-800 hover:text-yellow-900 font-medium text-sm mt-2 inline-block"
          >
            Select Project →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Export Interface -->
    <div v-else class="space-y-6">
      <!-- Project Summary -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Project Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <p class="text-gray-900">{{ currentProject.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Codebase Path</label>
            <p class="text-gray-900 font-mono text-sm">{{ currentProject.codebasePath }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Export Path</label>
            <p class="text-gray-900 font-mono text-sm">{{ currentProject.exportPath }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Export File Name</label>
            <p class="text-gray-900">{{ currentProject.exportFileName }}</p>
          </div>
        </div>
      </div>

      <!-- Rules Summary -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Export Rules</h2>
          <NuxtLink 
            to="/rules"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit Rules
          </NuxtLink>
        </div>

        <div v-if="currentRules" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Root Folder</label>
            <p class="text-gray-900 font-mono text-sm">{{ currentRules.rootFolder }}</p>
          </div>

          <div v-if="currentRules.ignoredFolders.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ignored Folders</label>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="folder in currentRules.ignoredFolders" 
                :key="folder"
                class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono"
              >
                {{ folder }}
              </span>
            </div>
          </div>

          <div v-if="currentRules.ignoredFiles.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ignored Files</label>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="file in currentRules.ignoredFiles" 
                :key="file"
                class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono"
              >
                {{ file }}
              </span>
            </div>
          </div>

          <div v-if="currentRules.ignoredFileTypes.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ignored File Types</label>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="type in currentRules.ignoredFileTypes" 
                :key="type"
                class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono"
              >
                {{ type }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4">
          <p class="text-gray-600 mb-2">No rules configured</p>
          <NuxtLink 
            to="/rules"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Configure Rules →
          </NuxtLink>
        </div>
      </div>

      <!-- Export Status -->
      <div v-if="exportStatus.isExporting || exportStatus.message" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Export Status</h2>
        
        <!-- Progress Bar -->
        <div v-if="exportStatus.isExporting" class="mb-4">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>{{ exportStatus.message }}</span>
            <span>{{ exportStatus.progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${exportStatus.progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-else-if="exportStatus.message && !exportStatus.error" class="flex items-center space-x-2 text-green-700">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ exportStatus.message }}</span>
        </div>

        <!-- Error Message -->
        <div v-else-if="exportStatus.error" class="flex items-center space-x-2 text-red-700">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ exportStatus.error }}</span>
        </div>
      </div>

      <!-- Export Actions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Ready to Export</h2>
            <p class="text-gray-600 text-sm">
              This will create a single file containing your filtered codebase. A timestamp will be added to the filename to ensure each export is unique:
            </p>
            <p class="text-gray-900 font-mono text-sm mt-1">
              {{ currentProject.exportPath }}/{{ getTimestampedFileName(currentProject.exportFileName) }}
            </p>
          </div>
          <button
            @click="startExport"
            :disabled="exportStatus.isExporting"
            class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <svg v-if="!exportStatus.isExporting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>{{ exportStatus.isExporting ? 'Exporting...' : 'Start Export' }}</span>
          </button>
        </div>
      </div>

      <!-- Test Example -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-blue-900 mb-3">💡 Test the Export Feature</h2>
        <p class="text-blue-800 text-sm mb-4">
          Want to try the export functionality? We've created a sample project for you to test with:
        </p>
        <div class="bg-white rounded-md p-4 border border-blue-200">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label class="block font-medium text-gray-700 mb-1">Test Codebase Path:</label>
              <code class="text-blue-600 bg-blue-50 px-2 py-1 rounded">{{ testProjectPath }}</code>
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Export Path:</label>
              <code class="text-blue-600 bg-blue-50 px-2 py-1 rounded">{{ exportsPath }}</code>
            </div>
          </div>
          <p class="text-gray-600 text-xs mt-3">
            Create a new project with these paths to test the export functionality with sample files.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const projectsStore = useProjectsStore()
const codebaseRulesStore = useCodebaseRulesStore()

const { currentProject } = storeToRefs(projectsStore)
const { exportStatus } = storeToRefs(codebaseRulesStore)

const currentRules = computed(() => {
  if (!currentProject.value) return null
  return codebaseRulesStore.getRulesByProjectId(currentProject.value.id)
})

const testProjectPath = '/Users/sergeiliebich/Development/DevCat/llm-context-tool/test-project'
const exportsPath = '/Users/sergeiliebich/Development/DevCat/llm-context-tool/exports'

const getTimestampedFileName = (fileName: string) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0]
  const fileNameParts = fileName.split('.')
  const extension = fileNameParts.length > 1 ? `.${fileNameParts.pop()}` : ''
  const baseName = fileNameParts.join('.')
  return `${baseName}_${timestamp}${extension}`
}

const startExport = async () => {
  if (!currentProject.value || exportStatus.value.isExporting) return
  
  await codebaseRulesStore.exportCodebase(currentProject.value.id)
}
</script>
