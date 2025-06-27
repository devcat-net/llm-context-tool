<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        LLM Context Tool
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Manage your projects and generate codebase exports with customizable rules for LLM context creation.
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Create Project</h3>
        </div>
        <p class="text-gray-600 mb-4">
          Start by creating a new project to manage your codebase exports.
        </p>
        <NuxtLink 
          to="/projects/new" 
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Project
        </NuxtLink>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Manage Projects</h3>
        </div>
        <p class="text-gray-600 mb-4">
          View, edit, and manage all your existing projects in one place.
        </p>
        <NuxtLink 
          to="/projects" 
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          View Projects
        </NuxtLink>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Export Codebase</h3>
        </div>
        <p class="text-gray-600 mb-4">
          Generate and export your codebase with custom rules and filters.
        </p>
        <NuxtLink 
          to="/export" 
          class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Start Export
        </NuxtLink>
      </div>
    </div>

    <!-- Current Project Status -->
    <div v-if="currentProject" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Current Project</h2>
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
      <div class="mt-4 flex space-x-3">
        <NuxtLink 
          :to="`/projects/${currentProject.id}/edit`"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Edit Project
        </NuxtLink>
        <NuxtLink 
          to="/rules"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Configure Rules
        </NuxtLink>
      </div>
    </div>

    <!-- Getting Started -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
      <div class="space-y-4">
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-600 text-sm font-semibold">1</span>
          </div>
          <div>
            <h3 class="font-medium text-gray-900">Create your first project</h3>
            <p class="text-gray-600 text-sm">Set up a new project with your codebase path and export settings.</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-600 text-sm font-semibold">2</span>
          </div>
          <div>
            <h3 class="font-medium text-gray-900">Configure export rules</h3>
            <p class="text-gray-600 text-sm">Define which files and folders to include or exclude from your export.</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-600 text-sm font-semibold">3</span>
          </div>
          <div>
            <h3 class="font-medium text-gray-900">Export your codebase</h3>
            <p class="text-gray-600 text-sm">Generate a single file containing your filtered codebase for LLM context.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const projectsStore = useProjectsStore()
const { currentProject } = storeToRefs(projectsStore)
</script>
