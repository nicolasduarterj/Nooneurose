import EnvVars from '@src/common/constants/env'
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(EnvVars.DatabaseUrl)

export default db
