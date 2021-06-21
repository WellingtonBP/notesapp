module.exports = (req, res, next) => {
   req.user.getNotes()
      .then(notes => {
         for(let note of notes){
            note.creationdate = `${note.creationdate.getDate()}/${note.creationdate.getMonth()+1}/${note.creationdate.getFullYear()}`
         }
         req.user.notes = notes
         res.locals.notes = notes
         next()
      })
      .catch(err => {
         console.log(err)
         req.flash('getnotesinfo', 'Houve um erro ao tentar recuperar suas notas!')
         res.locals.getNotesInfo = req.flash('getnotesinfo')
         next()
      })
}