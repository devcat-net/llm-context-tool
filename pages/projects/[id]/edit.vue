<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Edit Project</h1>
      <p class="text-gray-600">Update project information</p>
    </div>

    <div v-if="!project" class="text-center py-8">
      <p class="text-gray-600">Project not found</p>
      <NuxtLink to="/projects" class="text-blue-600 hover:text-blue-800">
        Back to Projects
      </NuxtLink>
    </div>

    <form v-else @submit.prevent="updateProject" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Project Information</h2>
        
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label for="codebasePath" class="block text-sm font-medium text-gray-700 mb-1">
              Codebase Path *
            </label>
            <input
              id="codebasePath"
              v-model="form.codebasePath"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="/path/to/your/project"
            />
            <p class="text-xs text-gray-500 mt-1">
              The root directory of your codebase to export
            </p>
          </div>

          <div>
            <label for="exportPath" class="block text-sm font-medium text-gray-700 mb-1">
              Export Path *
            </label>
            <input
              id="exportPath"
              v-model="form.exportPath"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="/path/to/export/directory"
            />
            <p class="text-xs text-gray-500 mt-1">
              Directory where the exported file will be saved
            </p>
          </div>

          <div>
            <label for="exportFileName" class="block text-sm font-medium text-gray-700 mb-1">
              Export File Name *
            </label>
            <input
              id="exportFileName"
              v-model="form.exportFileName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="codebase-export.txt"
            />
            <p class="text-xs text-gray-500 mt-1">
              Name of the exported file (include extension)
            </p>
          </div>
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
          to="/projects"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="isSubmitting || !hasChanges"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const projectsStore = useProjectsStore()

const projectId = route.params.id as string
const project = computed(() => projectsStore.getProjectById(projectId))

const form = reactive({
  name: '',
  codebasePath: '',
  exportPath: '',
  exportFileName: ''
})

const isSubmitting = ref(false)
const error = ref('')

// Initialize form with project data
watchEffect(() => {
  if (project.value) {
    form.name = project.value.name
    form.codebasePath = project.value.codebasePath
    form.exportPath = project.value.exportPath
    form.exportFileName = project.value.exportFileName
  }
})

// Check if form has changes
const hasChanges = computed(() => {
  if (!project.value) return false
  
  return (
    form.name !== project.value.name ||
    form.codebasePath !== project.value.codebasePath ||
    form.exportPath !== project.value.exportPath ||
    form.exportFileName !== project.value.exportFileName
  )
})

const updateProject = async () => {
  if (isSubmitting.value || !hasChanges.value || !project.value) return

  error.value = ''
  isSubmitting.value = true

  try {
    await projectsStore.updateProject(project.value.id, {
      name: form.name.trim(),
      codebasePath: form.codebasePath.trim(),
      exportPath: form.exportPath.trim(),
      exportFileName: form.exportFileName.trim()
    })

    await navigateTo('/projects')
  } catch (err) {
    error.value = 'Failed to update project. Please try again.'
    console.error('Error updating project:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Redirect if project not found
onMounted(() => {
  if (!project.value) {
    navigateTo('/projects')
  }
})
</script>
