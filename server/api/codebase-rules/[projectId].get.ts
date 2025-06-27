import { readStorage } from '../../utils/storage'
import type { EventHandlerRequest, H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  try {
    const projectId = getRouterParam(event, 'projectId')
    
    if (!projectId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project ID is required'
      })
    }

    const storage = await readStorage()
    
    // Find rules for the project
    const rules = storage.codebaseRules.find((rule: any) => rule.projectId === projectId)
    
    if (!rules) {
      // Return default rules if none exist
      return {
        success: true,
        rules: {
          id: '',
          projectId,
          ignoredFolders: ['node_modules', '.git', 'dist', 'build'],
          ignoredFiles: ['.DS_Store', '.gitignore'],
          ignoredFileTypes: ['log', 'tmp', 'cache'],
          rootFolder: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    }

    return {
      success: true,
      rules
    }
  } catch (error: any) {
    console.error('Load codebase rules error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to load codebase rules: ${error.message}`
    })
  }
})
