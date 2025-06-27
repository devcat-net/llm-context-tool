# LLM Context Tool

A Nuxt 3 TypeScript application with Tailwind CSS for managing projects and generating codebase exports with configurable rules for LLM context creation.

## Features

### Project Management
- Create/add new projects with name, codebase path, export path/filename
- Edit project information with change validation
- Switch between projects
- View all projects in a grid layout
- Remove projects with confirmation

### Codebase Export Rules
- Define rules: ignore folders, files, file types, and set root folder
- Change/edit existing rules with form validation
- **NEW: Real codebase export** - Reads actual files and creates markdown export

### Export Functionality
- ✅ **Real file system integration** - Scans and reads actual project files
- ✅ **Configurable filtering** - Respects ignore rules for folders, files, and file types
- ✅ **Markdown output** - Generates structured markdown with file paths and content
- ✅ **Progress tracking** - Real-time export progress with status updates
- ✅ **Error handling** - Comprehensive error handling and user feedback
- ✅ **Unique filenames** - Automatic timestamp addition to prevent file overwrites

## Export Format

The exported markdown file follows this format:

```
# Codebase Export

Generated on: 2025-06-27T14:25:00.000Z
Total files: 4

---

Path: README.md
# Test Project

This is a simple test project...
------

Path: src/main.js
// Main application entry point
console.log('Hello, World!')
------
```

**Filename Format:** Each export gets a unique timestamp to prevent overwrites:
- Original: `codebase-export.md`
- Generated: `codebase-export_2025-06-27_14-25-00.md`

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Test the export functionality:**
   - Navigate to http://localhost:3000
   - Create a new project with these test paths:
     - **Codebase Path:** `/Users/sergeiliebich/Development/DevCat/llm-context-tool/test-project`
     - **Export Path:** `/Users/sergeiliebich/Development/DevCat/llm-context-tool/exports`
     - **Export File Name:** `test-export.md`
   - Configure rules (optional) - default rules ignore common folders like `node_modules`, `.git`
   - Click "Start Export" to generate the markdown file

## Technical Stack

- **Nuxt 3** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive UI
- **Pinia** for state management
- **Node.js File System API** for real file operations
- **Server API Routes** for backend functionality
- **JSON File Storage** - Projects stored in `storage/projects.json`

## Project Structure

```
├── components/          # Vue components
├── layouts/            # Nuxt layouts
├── pages/              # Application pages
├── server/api/         # Server API endpoints
├── stores/             # Pinia stores
├── types/              # TypeScript type definitions
├── test-project/       # Sample project for testing
├── exports/            # Default export directory
└── storage/            # JSON file storage for projects
```

## API Endpoints

### GET `/api/projects`

Loads all projects and codebase rules from storage.

**Response:**
```typescript
{
  success: boolean
  projects: Project[]
  codebaseRules: CodebaseRules[]
}
```

### POST `/api/projects`

Creates a new project.

**Request Body:**
```typescript
{
  name: string
  codebasePath: string
  exportPath: string
  exportFileName: string
}
```

**Response:**
```typescript
{
  success: boolean
  project: Project
}
```

### PUT `/api/projects/:id`

Updates an existing project.

**Request Body:**
```typescript
{
  name?: string
  codebasePath?: string
  exportPath?: string
  exportFileName?: string
}
```

**Response:**
```typescript
{
  success: boolean
  project: Project
}
```

### DELETE `/api/projects/:id`

Deletes a project and its associated rules.

**Response:**
```typescript
{
  success: boolean
  deletedProject: Project
}
```

### PUT `/api/codebase-rules/:projectId`

Creates or updates codebase rules for a project.

**Request Body:**
```typescript
{
  rootFolder: string
  ignoredFolders: string[]
  ignoredFiles: string[]
  ignoredFileTypes: string[]
}
```

**Response:**
```typescript
{
  success: boolean
  rules: CodebaseRules
}
```

### POST `/api/export-codebase`

Exports a project's codebase to a markdown file.

**Request Body:**
```typescript
{
  projectId: string
  rootFolder: string
  exportPath: string
  exportFileName: string
  ignoredFolders: string[]
  ignoredFiles: string[]
  ignoredFileTypes: string[]
}
```

**Response:**
```typescript
{
  success: boolean
  message: string
  filesCount: number
  exportPath: string
  timestamp: string
}
```

## Development

The application uses Nuxt 3's auto-imports for composables and utilities. TypeScript errors in the IDE are expected during development as auto-imports are resolved at runtime.

## License

MIT