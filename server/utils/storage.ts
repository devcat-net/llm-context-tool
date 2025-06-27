import { promises as fs } from 'fs'
import path from 'path'

const STORAGE_FILE = path.join(process.cwd(), 'storage', 'projects.json')

interface StorageData {
  projects: any[]
  codebaseRules: any[]
}

const DEFAULT_STORAGE: StorageData = {
  projects: [],
  codebaseRules: []
}

/**
 * Ensures the storage file exists and has the correct structure
 */
export async function ensureStorageFile(): Promise<void> {
  try {
    // Check if storage directory exists
    const storageDir = path.dirname(STORAGE_FILE)
    try {
      await fs.access(storageDir)
    } catch {
      // Create storage directory if it doesn't exist
      await fs.mkdir(storageDir, { recursive: true })
      console.log('Created storage directory:', storageDir)
    }

    // Check if storage file exists
    try {
      await fs.access(STORAGE_FILE)
      
      // Validate file structure
      const data = await fs.readFile(STORAGE_FILE, 'utf8')
      const parsed = JSON.parse(data)
      
      // Ensure required properties exist
      if (!parsed.projects || !Array.isArray(parsed.projects)) {
        parsed.projects = []
      }
      if (!parsed.codebaseRules || !Array.isArray(parsed.codebaseRules)) {
        parsed.codebaseRules = []
      }
      
      // Write back if structure was fixed
      await fs.writeFile(STORAGE_FILE, JSON.stringify(parsed, null, 2))
      
    } catch (error: any) {
      // Create file with default structure if it doesn't exist or is invalid
      console.log('Creating new storage file with default structure')
      await fs.writeFile(STORAGE_FILE, JSON.stringify(DEFAULT_STORAGE, null, 2))
    }
  } catch (error: any) {
    console.error('Storage initialization error:', error)
    throw new Error(`Failed to initialize storage: ${error.message}`)
  }
}

/**
 * Reads the storage file and returns the data
 */
export async function readStorage(): Promise<StorageData> {
  try {
    await ensureStorageFile()
    
    const data = await fs.readFile(STORAGE_FILE, 'utf8')
    const parsed = JSON.parse(data)
    
    return {
      projects: parsed.projects || [],
      codebaseRules: parsed.codebaseRules || []
    }
  } catch (error: any) {
    console.error('Storage read error:', error)
    throw new Error(`Failed to read storage: ${error.message}`)
  }
}

/**
 * Writes data to the storage file
 */
export async function writeStorage(data: StorageData): Promise<void> {
  try {
    await ensureStorageFile()
    await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2))
  } catch (error: any) {
    console.error('Storage write error:', error)
    throw new Error(`Failed to write storage: ${error.message}`)
  }
}

/**
 * Gets the storage file path
 */
export function getStorageFilePath(): string {
  return STORAGE_FILE
}
