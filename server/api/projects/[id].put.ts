import { readStorage, writeStorage } from '../../utils/storage'
import type { EventHandlerRequest, H3Event } from 'h3'

interface UpdateProjectRequest {
  name?: string
  codebasePath?: string
  exportPath?: string
  exportFileName?: string
}

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  try {
    const projectId = getRouterParam(event, 'id')
    const body = await readBody(event)
    
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

    // Update project
    const updatedProject = {
      ...storage.projects[projectIndex],
      ...Object.fromEntries(
        Object.entries(body).filter(([_, value]) => value !== undefined && value !== null)
      ),
      updatedAt: new Date().toISOString()
    }

    storage.projects[projectIndex] = updatedProject

    // Save to file
    await writeStorage(storage)

    return {
      success: true,
      project: updatedProject
    }
  } catch (error: any) {
    console.error('Update project error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update project: ${error.message}`
    })
  }
})
