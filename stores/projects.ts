import { defineStore } from 'pinia'
import type { Project } from '../types'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    currentProject: null as Project | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getProjectById: (state) => (id: string) => {
      return state.projects.find((project: Project) => project.id === id)
    },
    hasProjects: (state) => state.projects.length > 0
  },

  actions: {
    async loadProjects() {
      this.isLoading = true
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        this.projects = data.projects.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }))
      } catch (error: any) {
        this.error = 'Failed to load projects'
        console.error('Error loading projects:', error)
      } finally {
        this.isLoading = false
      }
    },

    async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(projectData)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        const newProject = {
          ...data.project,
          createdAt: new Date(data.project.createdAt),
          updatedAt: new Date(data.project.updatedAt)
        }
        
        this.projects.push(newProject)
        return newProject
      } catch (error: any) {
        this.error = 'Failed to create project'
        console.error('Error creating project:', error)
        throw error
      }
    },

    async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        const updatedProject = {
          ...data.project,
          createdAt: new Date(data.project.createdAt),
          updatedAt: new Date(data.project.updatedAt)
        }

        const index = this.projects.findIndex((p: Project) => p.id === id)
        if (index !== -1) {
          this.projects[index] = updatedProject
          
          // Update current project if it's the one being updated
          if (this.currentProject?.id === id) {
            this.currentProject = updatedProject
          }
        }
      } catch (error: any) {
        this.error = 'Failed to update project'
        console.error('Error updating project:', error)
        throw error
      }
    },

    async deleteProject(id: string) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const index = this.projects.findIndex((p: Project) => p.id === id)
        if (index !== -1) {
          this.projects.splice(index, 1)
          
          // Clear current project if it was deleted
          if (this.currentProject?.id === id) {
            this.currentProject = null
          }
        }
      } catch (error: any) {
        this.error = 'Failed to delete project'
        console.error('Error deleting project:', error)
        throw error
      }
    },

    setCurrentProject(project: Project | null) {
      this.currentProject = project
    },

    clearError() {
      this.error = null
    }
  }
})
