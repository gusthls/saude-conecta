import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

const pool = new sql.ConnectionPool(config)

export const connectDB = async () => {
  try {
    await pool.connect()
    console.log('Conectado ao SQL Server!')
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error)
    process.exit(1)
  }
}

export default pool