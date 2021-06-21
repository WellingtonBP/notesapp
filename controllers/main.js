exports.getWorkspace = (req, res, next) => {
   res.render('workspace',{
      path: '/workspace',
      addOrEditNoteSuccess: req.flash('addoreditnotesuccess'),
      addOrEditNoteInfo: req.flash('addoreditnoteinfo')
   })
}

exports.postAddNote = (req, res, next) => {
   const {title, note} = req.body
   req.user.createNote(title, note)
      .then(result => {
         req.flash('addoreditnotesuccess', true)
         req.flash('addoreditnoteinfo', 'Nota adicionada com sucesso!')
         res.redirect('/workspace/add')
      })
      .catch(err => {
         console.log(err)
         let msg = 'Houve um erro ao tentar adicionar a nota.'
         if(err.characterError){
            msg += `<br>${err.msg}`
         }
         req.flash('addoreditnotesuccess', false)
         req.flash('addoreditnoteinfo', msg)
         res.redirect('/workspace/add')
      })
}

exports.getAddNote = (req, res, next) => {
   res.render('workspace', {
      path: '/workspace/add',
      addOrEditNoteSuccess: req.flash('addoreditnotesuccess'),
      addOrEditNoteInfo: req.flash('addoreditnoteinfo')
   })
}

exports.postDeleteNote = (req, res, next) => {
   const {noteid} = req.body
   req.user.deleteNote(noteid)
      .then(() => {
         res.redirect('/workspace')
      })
      .catch(err => {
         console.log(err)
         res.redirect('/workspace')
      })
}

exports.postEditNote = (req, res, next) => {
   const {noteid, title, note, creationdate} = req.body
   if(title && note && creationdate){
      req.user.editNote(noteid, title, note, creationdate)
         .then(() => {
            req.flash('addoreditnotesuccess', true)
            req.flash('addoreditnoteinfo', 'Nota editada com sucesso!')
            res.redirect('/workspace')
         })
         .catch(err => {
            console.log(err)
            let msg = 'Houve um erro ao tentar editar a nota.'
            if(err.characterError){
               msg += `<br>${err.msg}`
            }
            req.flash('addoreditnotesuccess', false)
            req.flash('addoreditnoteinfo', msg)
            res.redirect('/workspace')
         })
         return
   }

   req.user.getNote(noteid)
      .then(note => {
         res.render('workspace', {
            path: '/workspace/edit',
            noteEditing: note,
            addOrEditNoteSuccess: null,
            addOrEditNoteInfo: ""
         })
      })
      .catch(err => {
         console.log(err)
         res.redirect('/workspace')
      })
}