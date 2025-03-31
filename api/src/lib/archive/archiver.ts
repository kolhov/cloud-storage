import { FilesInFolder } from '@/types/db.queries.types'
import * as fs from 'node:fs'
import * as path from 'node:path'
import archiver from 'archiver';
import { logError } from '@/lib/utils'

export async function archiveFiles(dataToArchive: Record<string, FilesInFolder>): Promise<string>{
  const archiveId = crypto.randomUUID();

  const tempFolderPath = path.join(process.cwd(), "storage", ".temp");
  if (!fs.existsSync(tempFolderPath)){
    fs.mkdirSync(tempFolderPath, {recursive: true});
  }

  const output = fs.createWriteStream(path.join(tempFolderPath, archiveId));
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      logError('archiving error: ', err);
    } else {
      throw err;
    }
  });

  archive.pipe(output);

  for (const key of Object.keys(dataToArchive)) {
    dataToArchive[key].forEach((item) => {
      const file = path.join(process.cwd(), "storage", item.owner, item.id);
      archive.append(fs.createReadStream(file), { name: path.join(key, item.name) });
    });
  }

  await new Promise<void>((resolve, reject) => {
    archive.on('close', () => {
      console.log(`Archive created: ${archiveId} \n${JSON.stringify(dataToArchive, null, 2)}`);
      resolve();
    });

    archive.on('error', (err) => {
      logError('Archiving error:', err);
      reject(err);
    });

    archive.finalize();
  });

  return archiveId;
}