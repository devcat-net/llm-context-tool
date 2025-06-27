import { promises as fs } from 'fs'
import path from 'path'
import type { EventHandlerRequest, H3Event } from 'h3'

interface ExportRequest {
  projectId: string
  rootFolder: string
  exportPath: string
  exportFileName: string
  ignoredFolders: string[]
  ignoredFiles: string[]
  ignoredFileTypes: string[]
}

interface FileInfo {
  path: string
  content: string
}

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  try {
    const body = await readBody(event) as ExportRequest
    
    const {
      rootFolder,
      exportPath,
      exportFileName,
      ignoredFolders,
      ignoredFiles,
      ignoredFileTypes
    } = body

    // Validate paths
    if (!rootFolder || !exportPath || !exportFileName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameters'
      })
    }

    // Check if root folder exists
    try {
      await fs.access(rootFolder)
    } catch {
      throw createError({
        statusCode: 404,
        statusMessage: 'Root folder not found'
      })
    }

    // Collect all files
    const files: FileInfo[] = []
    await collectFiles(rootFolder, rootFolder, files, {
      ignoredFolders,
      ignoredFiles,
      ignoredFileTypes
    })

    // Generate markdown content
    const markdownContent = generateMarkdown(files)

    // Ensure export directory exists
    try {
      await fs.mkdir(exportPath, { recursive: true })
    } catch (error: any) {
      console.error('Error creating export directory:', error)
    }

    // Add timestamp to filename to make each export unique
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0]
    const fileNameParts = exportFileName.split('.')
    const extension = fileNameParts.length > 1 ? `.${fileNameParts.pop()}` : ''
    const baseName = fileNameParts.join('.')
    const timestampedFileName = `${baseName}_${timestamp}${extension}`

    // Write the markdown file
    const fullExportPath = path.join(exportPath, timestampedFileName)
    await fs.writeFile(fullExportPath, markdownContent, 'utf8')

    return {
      success: true,
      message: `Codebase exported successfully to ${fullExportPath}`,
      filesCount: files.length,
      exportPath: fullExportPath,
      timestamp
    }

  } catch (error: any) {
    console.error('Export error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Export failed: ${error.message}`
    })
  }
})

async function collectFiles(
  currentPath: string,
  rootPath: string,
  files: FileInfo[],
  rules: {
    ignoredFolders: string[]
    ignoredFiles: string[]
    ignoredFileTypes: string[]
  }
): Promise<void> {
  try {
    const items = await fs.readdir(currentPath, { withFileTypes: true })

    for (const item of items) {
      const itemPath = path.join(currentPath, item.name)
      const relativePath = path.relative(rootPath, itemPath)

      if (item.isDirectory()) {
        if (!shouldIgnoreFolder(item.name, relativePath, rules.ignoredFolders)) {
          await collectFiles(itemPath, rootPath, files, rules)
        }
      } else if (item.isFile()) {
        if (!shouldIgnoreFile(item.name, relativePath, rules.ignoredFiles, rules.ignoredFileTypes)) {
          try {
            const content = await fs.readFile(itemPath, 'utf8')
            files.push({
              path: relativePath,
              content
            })
          } catch (error: any) {
            console.warn(`Could not read file ${itemPath}:`, error.message)
            files.push({
              path: relativePath,
              content: `[Error reading file: ${error.message}]`
            })
          }
        }
      }
    }
  } catch (error: any) {
    console.warn(`Could not read directory ${currentPath}:`, error.message)
  }
}

function shouldIgnoreFolder(folderName: string, relativePath: string, ignoredFolders: string[]): boolean {
  return ignoredFolders.some(ignored => {
    // Check exact folder name match
    if (folderName === ignored) return true
    
    // Check if the relative path contains the ignored folder
    const pathParts = relativePath.split(path.sep)
    return pathParts.includes(ignored)
  })
}

function shouldIgnoreFile(fileName: string, relativePath: string, ignoredFiles: string[], ignoredFileTypes: string[]): boolean {
  // Check ignored files
  if (ignoredFiles.includes(fileName)) return true
  
  // Check ignored file types
  const fileExtension = path.extname(fileName)
  if (ignoredFileTypes.includes(fileExtension)) return true
  
  // Check if file is in ignored path
  if (ignoredFiles.some(ignored => relativePath.includes(ignored))) return true
  
  return false
}

function generateMarkdown(files: FileInfo[]): string {
  let markdown = '# Codebase Export\n\n'
  markdown += `Generated on: ${new Date().toISOString()}\n`
  markdown += `Total files: ${files.length}\n\n`
  markdown += '---\n\n'

  // Sort files by path for better organization
  files.sort((a, b) => a.path.localeCompare(b.path))

  for (const file of files) {
    markdown += `Path: ${file.path}\n`
    markdown += file.content
    markdown += '\n------\n\n'
  }

  return markdown
}
