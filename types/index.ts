export interface Project {
  id: string
  name: string
  codebasePath: string
  exportPath: string
  exportFileName: string
  createdAt: Date
  updatedAt: Date
}

export interface CodebaseRules {
  id: string
  projectId: string
  ignoredFolders: string[]
  ignoredFiles: string[]
  ignoredFileTypes: string[]
  rootFolder: string
  createdAt: Date
  updatedAt: Date
}

export interface ExportStatus {
  isExporting: boolean
  progress: number
  message: string
  error?: string
}
