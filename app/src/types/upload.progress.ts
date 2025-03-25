
export interface UploadProgress {
  name: string,
  icon: string,
  progressBar: number,
  rate?: string | null,
  duration?: string | null,
  loaded: string | null,
  total?: string | null,
  complete: boolean
}
