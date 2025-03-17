export interface FileSystemEntryWithId {
  entry: FileSystemFileEntry,
  folderId: string | null
}
export interface FileWithFolderId {
  file: File,
  folderId: string | null
}
