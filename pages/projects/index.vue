<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
        <p class="text-gray-600">Manage your codebase export projects</p>
      </div>
      <NuxtLink 
        to="/projects/new"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        New Project
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-2">Loading projects...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasProjects" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
      <p class="text-gray-600 mb-4">Get started by creating your first project</p>
      <NuxtLink 
        to="/projects/new"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Project
      </NuxtLink>
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="project in projects" 
        :key="project.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ project.name }}</h3>
            <p class="text-sm text-gray-600 font-mono">{{ project.codebasePath }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="selectProject(project)"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                currentProject?.id === project.id 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ currentProject?.id === project.id ? 'Current' : 'Select' }}
            </button>
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Export Path:</span>
            <span class="text-gray-900 font-mono text-xs">{{ project.exportPath }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Export File:</span>
            <span class="text-gray-900">{{ project.exportFileName }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Created:</span>
            <span class="text-gray-900">{{ formatDate(project.createdAt) }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="flex space-x-2">
            <NuxtLink 
              :to="`/projects/${project.id}/edit`"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </NuxtLink>
            <button
              @click="confirmDelete(project)"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
          <button
            v-if="currentProject?.id === project.id"
            @click="navigateTo('/export')"
            class="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Export →
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="projectToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Project</h3>
        <p class="text-gray-600 mb-4">
          Are you sure you want to delete "{{ projectToDelete.name }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="projectToDelete = null"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteProject"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '../../types'

const projectsStore = useProjectsStore()
const { projects, currentProject, isLoading, hasProjects } = storeToRefs(projectsStore)

const projectToDelete = ref(null as Project | null)

const selectProject = (project: Project) => {
  projectsStore.setCurrentProject(project)
}

const confirmDelete = (project: Project) => {
  projectToDelete.value = project
}

const deleteProject = async () => {
  if (projectToDelete.value) {
    await projectsStore.deleteProject(projectToDelete.value.id)
    projectToDelete.value = null
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}
</script>
