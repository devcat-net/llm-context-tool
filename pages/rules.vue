<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Codebase Rules</h1>
      <p class="text-gray-600">Configure export rules for your current project</p>
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
            Please select a project first to configure its codebase rules.
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

    <!-- Rules Form -->
    <form v-else @submit.prevent="saveRules" class="space-y-6">
      <!-- Project Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 class="text-blue-900 font-medium">Current Project: {{ currentProject.name }}</h3>
        <p class="text-blue-700 text-sm">{{ currentProject.codebasePath }}</p>
      </div>

      <!-- Root Folder -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Root Folder</h2>
        <div>
          <label for="rootFolder" class="block text-sm font-medium text-gray-700 mb-1">
            Root Folder Path
          </label>
          <input
            id="rootFolder"
            v-model="form.rootFolder"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            :placeholder="currentProject.codebasePath"
          />
          <p class="text-xs text-gray-500 mt-1">
            Starting point for codebase scanning. Leave empty to use project's codebase path.
          </p>
        </div>
      </div>

      <!-- Ignored Folders -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Ignored Folders</h2>
        <div class="space-y-3">
          <div v-for="(folder, index) in form.ignoredFolders" :key="index" class="flex items-center space-x-2">
            <input
              v-model="form.ignoredFolders[index]"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="node_modules"
            />
            <button
              type="button"
              @click="removeIgnoredFolder(index)"
              class="p-2 text-red-600 hover:text-red-800"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
          <button
            type="button"
            @click="addIgnoredFolder"
            class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add Folder</span>
          </button>
        </div>
      </div>

      <!-- Ignored Files -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Ignored Files</h2>
        <div class="space-y-3">
          <div v-for="(file, index) in form.ignoredFiles" :key="index" class="flex items-center space-x-2">
            <input
              v-model="form.ignoredFiles[index]"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder=".env"
            />
            <button
              type="button"
              @click="removeIgnoredFile(index)"
              class="p-2 text-red-600 hover:text-red-800"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
          <button
            type="button"
            @click="addIgnoredFile"
            class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add File</span>
          </button>
        </div>
      </div>

      <!-- Ignored File Types -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Ignored File Types</h2>
        <div class="space-y-3">
          <div v-for="(type, index) in form.ignoredFileTypes" :key="index" class="flex items-center space-x-2">
            <input
              v-model="form.ignoredFileTypes[index]"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder=".log"
            />
            <button
              type="button"
              @click="removeIgnoredFileType(index)"
              class="p-2 text-red-600 hover:text-red-800"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
          <button
            type="button"
            @click="addIgnoredFileType"
            class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add File Type</span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between">
        <NuxtLink 
          to="/"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Back
        </NuxtLink>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSubmitting ? 'Saving...' : 'Save Rules' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const projectsStore = useProjectsStore()
const codebaseRulesStore = useCodebaseRulesStore()

const { currentProject } = storeToRefs(projectsStore)

const form = reactive({
  rootFolder: '',
  ignoredFolders: ['node_modules', '.git', 'dist', 'build'],
  ignoredFiles: ['.env', '.env.local', '.DS_Store'],
  ignoredFileTypes: ['.log', '.tmp', '.cache']
})

const isSubmitting = ref(false)
const error = ref('')

// Load existing rules
watchEffect(() => {
  if (currentProject.value) {
    const existingRules = codebaseRulesStore.getRulesByProjectId(currentProject.value.id)
    if (existingRules) {
      form.rootFolder = existingRules.rootFolder
      form.ignoredFolders = [...existingRules.ignoredFolders]
      form.ignoredFiles = [...existingRules.ignoredFiles]
      form.ignoredFileTypes = [...existingRules.ignoredFileTypes]
    }
  }
})

const addIgnoredFolder = () => {
  form.ignoredFolders.push('')
}

const removeIgnoredFolder = (index: number) => {
  form.ignoredFolders.splice(index, 1)
}

const addIgnoredFile = () => {
  form.ignoredFiles.push('')
}

const removeIgnoredFile = (index: number) => {
  form.ignoredFiles.splice(index, 1)
}

const addIgnoredFileType = () => {
  form.ignoredFileTypes.push('')
}

const removeIgnoredFileType = (index: number) => {
  form.ignoredFileTypes.splice(index, 1)
}

const saveRules = async () => {
  if (isSubmitting.value || !currentProject.value) return

  error.value = ''
  isSubmitting.value = true

  try {
    await codebaseRulesStore.createOrUpdateRules(currentProject.value.id, {
      rootFolder: form.rootFolder.trim() || currentProject.value.codebasePath,
      ignoredFolders: form.ignoredFolders.filter((f: string) => f.trim()),
      ignoredFiles: form.ignoredFiles.filter((f: string) => f.trim()),
      ignoredFileTypes: form.ignoredFileTypes.filter((t: string) => t.trim())
    })

    // Show success message and redirect
    await navigateTo('/')
  } catch (err) {
    error.value = 'Failed to save rules. Please try again.'
    console.error('Error saving rules:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>
