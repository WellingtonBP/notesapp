const HTML = {
   get(target){
      return document.querySelectorAll(target)
   }
}

let newInnerHtml
for(let noteBody of HTML.get('.note-body')){
   newInnerHtml = noteBody.innerHTML.replace(/\n/, '').replace(/\n/g, '<br>')
   noteBody.innerHTML = newInnerHtml
}

for(let deleteNote of HTML.get('.delete-or-edit-note')){
   deleteNote.addEventListener('click', () => {
      HTML.get('#noteid')[0].value = deleteNote.value
      if(!deleteNote.classList.contains('close')){
         console.log('here')
         HTML.get('#delete-or-edit-form')[0].action = '/workspace/edit'
         HTML.get('#delete-or-edit-text')[0].innerHTML = 'Deseja editar essa nota?'
      }
   })
}