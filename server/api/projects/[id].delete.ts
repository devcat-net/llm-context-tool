import { readStorage, writeStorage } from '../../utils/storage'
import type { EventHandlerRequest, H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  try {
    const projectId = getRouterParam(event, 'id')
    
    if (!projectId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project ID is required'
      })
    }

    // Read current storage
    const storage = await readStorage()

    // Find project
    const projectIndex = storage.projects.findIndex((p: any) => p.id === projectId)
    if (projectIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found'
      })
    }

    // Remove project
    const deletedProject = storage.projects[projectIndex]
    storage.projects.splice(projectIndex, 1)

    // Also remove associated codebase rules
    storage.codebaseRules = storage.codebaseRules.filter((rule: any) => rule.projectId !== projectId)

    // Save to file
    await writeStorage(storage)

    return {
      success: true,
      deletedProject
    }
  } catch (error: any) {
    console.error('Delete project error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete project: ${error.message}`
    })
  }
})
