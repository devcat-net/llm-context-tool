import { readStorage, writeStorage } from '../../utils/storage'
import type { EventHandlerRequest, H3Event } from 'h3'

interface CodebaseRulesRequest {
  ignoredFolders: string[]
  ignoredFiles: string[]
  ignoredFileTypes: string[]
  rootFolder: string
}

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  try {
    const projectId = getRouterParam(event, 'projectId')
    const body = await readBody(event) as CodebaseRulesRequest
    
    if (!projectId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project ID is required'
      })
    }

    // Read current storage
    const storage = await readStorage()

    // Check if project exists
    const projectExists = storage.projects.some((p: any) => p.id === projectId)
    if (!projectExists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found'
      })
    }

    // Find existing rules
    const existingRuleIndex = storage.codebaseRules.findIndex((rule: any) => rule.projectId === projectId)
    
    const rulesData = {
      id: existingRuleIndex !== -1 ? storage.codebaseRules[existingRuleIndex].id : crypto.randomUUID(),
      projectId,
      rootFolder: body.rootFolder || '',
      ignoredFolders: body.ignoredFolders || [],
      ignoredFiles: body.ignoredFiles || [],
      ignoredFileTypes: body.ignoredFileTypes || [],
      createdAt: existingRuleIndex !== -1 ? storage.codebaseRules[existingRuleIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (existingRuleIndex !== -1) {
      // Update existing rules
      storage.codebaseRules[existingRuleIndex] = rulesData
    } else {
      // Create new rules
      storage.codebaseRules = storage.codebaseRules || []
      storage.codebaseRules.push(rulesData)
    }

    // Save to file
    await writeStorage(storage)

    return {
      success: true,
      rules: rulesData
    }
  } catch (error: any) {
    console.error('Save codebase rules error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to save codebase rules: ${error.message}`
    })
  }
})
