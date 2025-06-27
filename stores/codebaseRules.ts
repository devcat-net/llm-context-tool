import { defineStore } from 'pinia'
import type { CodebaseRules, ExportStatus } from '../types'

export const useCodebaseRulesStore = defineStore('codebaseRules', {
  state: () => ({
    rules: [] as CodebaseRules[],
    exportStatus: {
      isExporting: false,
      progress: 0,
      message: '',
      error: undefined
    } as ExportStatus,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getRulesByProjectId: (state) => (projectId: string) => {
      return state.rules.find((rule: CodebaseRules) => rule.projectId === projectId)
    }
  },

  actions: {
    async loadRules() {
      this.isLoading = true
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        this.rules = data.codebaseRules.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt)
        }))
      } catch (error: any) {
        this.error = 'Failed to load codebase rules'
        console.error('Error loading rules:', error)
      } finally {
        this.isLoading = false
      }
    },

    async createOrUpdateRules(projectId: string, rulesData: Omit<CodebaseRules, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) {
      try {
        const response = await fetch(`/api/codebase-rules/${projectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(rulesData)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        const savedRules = {
          ...data.rules,
          createdAt: new Date(data.rules.createdAt),
          updatedAt: new Date(data.rules.updatedAt)
        }

        const existingIndex = this.rules.findIndex((r: CodebaseRules) => r.projectId === projectId)
        if (existingIndex !== -1) {
          this.rules[existingIndex] = savedRules
        } else {
          this.rules.push(savedRules)
        }
      } catch (error: any) {
        this.error = 'Failed to save codebase rules'
        console.error('Error saving rules:', error)
        throw error
      }
    },

    async exportCodebase(projectId: string) {
      this.exportStatus = {
        isExporting: true,
        progress: 0,
        message: 'Preparing export...',
        error: undefined
      }

      try {
        // Get project and rules data
        const projectsStore = useProjectsStore()
        const project = projectsStore.getProjectById(projectId)
        const rules = this.getRulesByProjectId(projectId)

        if (!project) {
          throw new Error('Project not found')
        }

        // Update progress
        this.exportStatus.progress = 10
        this.exportStatus.message = 'Reading codebase...'

        // Prepare request data
        const requestData = {
          projectId,
          rootFolder: rules?.rootFolder || project.codebasePath,
          exportPath: project.exportPath,
          exportFileName: project.exportFileName,
          ignoredFolders: rules?.ignoredFolders || [],
          ignoredFiles: rules?.ignoredFiles || [],
          ignoredFileTypes: rules?.ignoredFileTypes || []
        }

        // Update progress
        this.exportStatus.progress = 30
        this.exportStatus.message = 'Processing files...'

        // Call the API
        const response = await fetch('/api/export-codebase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()

        // Update progress
        this.exportStatus.progress = 90
        this.exportStatus.message = 'Writing export file...'

        // Simulate final processing
        await new Promise(resolve => setTimeout(resolve, 500))

        this.exportStatus = {
          isExporting: false,
          progress: 100,
          message: `Export completed! ${result.filesCount} files exported to ${result.exportPath}`,
          error: undefined
        }

        // Reset status after 5 seconds
        setTimeout(() => {
          this.exportStatus = {
            isExporting: false,
            progress: 0,
            message: '',
            error: undefined
          }
        }, 5000)

      } catch (error: any) {
        console.error('Export error:', error)
        
        this.exportStatus = {
          isExporting: false,
          progress: 0,
          message: '',
          error: error.message || 'Export failed. Please try again.'
        }

        // Reset error after 10 seconds
        setTimeout(() => {
          this.exportStatus = {
            isExporting: false,
            progress: 0,
            message: '',
            error: undefined
          }
        }, 10000)
      }
    },

    clearError() {
      this.error = null
    }
  }
})
