const { createClient } = require('@libsql/client');
const cloudDb = createClient({ 
  url: 'libsql://database-byzantium-book-vercel-icfg-ivpmouwuan2jhq2zyq0dqpt4.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Nzk3NjIxNjksImlkIjoiMDE5ZTYyMTctN2YwMS03ZjY4LWI0NTQtMGIxNzcwNjBmYzUyIiwicmlkIjoiMmYzZTQ5ODctZDA5ZS00ZmFhLTlhMTctMGU3NmIyNWUzNmNhIn0.Ob3S3tLymbN3ONEKni64xNakrYUSDTgGbj17ztC6qiFSUS3CZuoyXfCzMX2hd0hSaYt2lnv4ytCea_7rhyYKCw'
});
cloudDb.execute({
  sql: 'SELECT * FROM indikator WHERE user_id = ? OR user_id = "1" ORDER BY kategori ASC, urutan ASC',
  args: ['1']
}).then(r => console.log('Indikator found:', r.rows.length)).catch(console.error);
