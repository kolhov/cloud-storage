/* eslint-env node */

import { fakerEN_US as faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SERVICE_KEY
)

const testingUserEmail = "abc@gmail.com"

const logErrorAndExit = (tableName, error) => {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`
  )
  process.exit(1)
}

const logStep = (stepMessage) => {
  console.log(stepMessage)
}

const PrimaryTestUserExists = async () => {
  logStep('Checking if primary test user exists...')
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.log(error)
    console.log('Primary test user not found. Will create one.')
    return false
  }

  const user = data.users.find(u => u.email === testingUserEmail);
  logStep('Primary test user is found.')
  return user?.id
}

const createPrimaryTestUser = async () => {
  logStep('Creating primary test user...')
  const firstName = 'Test'
  const lastName = 'Account'
  const userName = 'testaccount1'
  const email = testingUserEmail
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: 'abcabc',
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: firstName + ' ' + lastName,
        username: userName
      }
    }
  })

  if (error) {
    logErrorAndExit('Users', error)
  }

  if (data) {
    const userId = data.user.id
    logStep('Primary test user created successfully.')
    return userId
  }
}

const seedFolders = async (userId) => {
  logStep('Seeding folders...')
  const folders = [{
    name: 'folder1',
    public: false,
    owner: userId,
  },{
    name: 'folder2',
    public: true,
    owner: userId,
  }]

  const { data, error } = await supabase
    .from('folders')
    .insert(folders)
    .select('id')

  if (error) return logErrorAndExit('Folders', error)

  logStep('Folders seeded successfully.')

  return data
}

const seedNestedFolder = async (folderId, ownerId) => {
  logStep('Seeding nested folders...')

  const { data, error } = await supabase
    .from('folders')
    .insert({
      name: 'folder-inside-folder1',
      public: false,
      owner: ownerId,
      folder: folderId
    })
    .select('id')

  if (error) return logErrorAndExit('Folders', error)

  logStep('Nested folders seeded successfully.')

  return data
}

const seedFiles = async (numEntries, foldersIds, userId) => {
  logStep('Seeding files...')
  const files = []

  for (let i = 0; i < numEntries; i++) {
    const mime = 'application/pdf'
    const fileExt = faker.system.fileExt(mime)

    files.push({
      name: 'decoy ' + faker.system.commonFileName(fileExt),
      folder: faker.helpers.arrayElement([null, ...foldersIds]),
      public: false,
      size: 100,
      mime: mime,
      owner: userId
    })
  }

  const { data, error } = await supabase
    .from('files')
    .insert(files)
    .select('id')

  if (error) return logErrorAndExit('Files', error)

  logStep('Files seeded successfully.')

  return data
}

const seedDatabase = async (numEntriesPerTable) => {
  let userId

  const testUserId = await PrimaryTestUserExists()

  if (!testUserId) {
    const primaryTestUserId = await createPrimaryTestUser()
    userId = primaryTestUserId
  } else {
    userId = testUserId
  }

  const foldersIds = (await seedFolders(userId)).map(
    (folder) => folder.id
  )
  await seedNestedFolder(foldersIds[0], userId)
  await seedFiles(numEntriesPerTable, foldersIds, userId)
}

const numEntriesPerTable = 10

seedDatabase(numEntriesPerTable)
