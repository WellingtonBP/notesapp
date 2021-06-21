const conn = require('../util/dbConnector')
const Note = require('./note')

const User = class User{
   constructor(firstname, lastname, email, password, gender, birthday, id, creationDate){
      this.firstname = firstname
      this.lastname = lastname
      this.email = email
      this.password = password
      this.gender = gender
      this.birthday = new Date(birthday)
      this.id = id
      this.creationDate = new Date(creationDate)
   }

   async save(){
      const query = 'INSERT INTO user (name, lastname, email, password, gender, birthday, creationdate) VALUES (?,?,?,?,?,?,?)'
      const date = new Date()
      this.creationDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      const values = [this.firstname, this.lastname, this.email, this.password, this.gender, this.birthday, this.creationDate]
      return await conn.execute(query, values)
   }

   async createNote(note_title, note){
      if(note.length > 1000){
         const error = {
            characterError: true,
            msg: 'Sua nota precisa ter menos de 1000 caracteres.' 
         }
         throw error
      }
      const newNote = new Note(this.id, note_title, note)
      return await newNote.save()
   }

   async getNotes(){
      return await Note.findAll(this.id)
   }

   async getNote(noteId){
      return await Note.findById(noteId, this.id)
   }

   async deleteNote(noteId){
      return await Note.delete(noteId, this.id)
   }

   async editNote(noteId, title, note, creationDate){
      if(note.length > 1000){
         const error = {
            characterError: true,
            msg: 'Sua nota precisa ter menos de 1000 caracteres.' 
         }
         throw error
      }
      const editedNote = new Note(this.id, title, note, noteId, creationDate)
      return await editedNote.edit()
   }

   static async findByEmail(email){
      const query = 'SELECT * FROM user WHERE email = ?'
      const result = await conn.execute(query, [email])
      return result[0][0]
   }
}

module.exports = User