
export function mimeToIcon(mime: string){
  if (mime.includes('pdf') || mime.includes('opendocument')) return 'akar-icons:file';
  if (mime.includes('image')) return 'akar-icons:image';
  if (mime.includes('video')) return 'akar-icons:video';
  if (mime.includes('audio')) return 'akar-icons:music';

  return 'akar-icons:paper'
}

export const defaultFolderImage = 'akar-icons:folder'
