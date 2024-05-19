module.exports = {
  client: 'pg',
  connection: {
    host : 'aws-0-us-west-1.pooler.supabase.com',
    user : 'postgres.allmstfoxluyjswybkyb',
    password : 'j9YkwB!wCN*bL49',
    database : 'postgres',
    ssl: {
      rejectUnauthorized: false, // Adicione esta linha
    }
  }
};