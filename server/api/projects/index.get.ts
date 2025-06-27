import { readStorage } from '../../utils/storage'
import type { EventHandlerRequest, H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  try {
    const storage = await readStorage()
    
    return {
      success: true,
      projects: storage.projects
    }
  } catch (error: any) {
    console.error('Load projects error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to load projects: ${error.message}`
    })
  }
})
