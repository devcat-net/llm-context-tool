import { readStorage, writeStorage } from '../../utils/storage'
import type { EventHandlerRequest, H3Event } from 'h3'

interface CreateProjectRequest {
  name: string
  codebasePath: string
  exportPath: string
  exportFileName: string
}

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  try {
    const body = await readBody(event) as CreateProjectRequest
    
    // Validate required fields
    if (!body.name || !body.codebasePath || !body.exportPath || !body.exportFileName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Read current storage
    const storage = await readStorage()

    // Create new project
    const newProject = {
      id: crypto.randomUUID(),
      name: body.name.trim(),
      codebasePath: body.codebasePath.trim(),
      exportPath: body.exportPath.trim(),
      exportFileName: body.exportFileName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to storage
    storage.projects = storage.projects || []
    storage.projects.push(newProject)

    // Save to file
    await writeStorage(storage)

    return {
      success: true,
      project: newProject
    }
  } catch (error: any) {
    console.error('Create project error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create project: ${error.message}`
    })
  }
})
