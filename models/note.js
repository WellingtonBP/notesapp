const conn = require('../util/dbConnector')

module.exports = class Note{
   constructor(user_id, title, note, id, creationdate){
      this.user_id = user_id
      this.title = title
      this.note = note
      this.id = id
      this.creationdate = creationdate
   }

   async save(){
      const date = new Date()
      this.creationdate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      const query = 'INSERT INTO note (user_id, note_title, note, creationdate) VALUES (?, ?, ?, ?)'
      const values = [this.user_id, this.title, this.note, this.creationdate]
      return await conn.execute(query, values)
   }

   async edit(){
      const date = new Date()
      this.creationdate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      const query = 'UPDATE NOTE SET note_title = ?,  note = ?, creationdate = ? where id = ? and user_id = ?'
      const values = [this.title, this.note, this.creationdate, this.id, this.user_id]
      return await conn.execute(query, values)
   }

   static async delete(id, user_id){
      const query = 'DELETE FROM note where id = ? and user_id = ?'
      return await conn.execute(query, [id, user_id])
   }

   static async findById(id, user_id){
      const query = 'SELECT * FROM note WHERE id = ? and user_id = ?'
      const result = await conn.execute(query, [id, user_id])
      return result[0][0]
   }

   static async findAll(user_id){
      const query = 'SELECT * FROM note WHERE user_id = ?'
      const results = await conn.execute(query, [user_id])
      return results[0]
   }
}