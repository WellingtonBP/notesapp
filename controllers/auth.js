const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getIndex = (req, res, next) => {
   res.render('index',{
      path: '/',
      signUpSuccess: req.flash('sigupsuccess'),
      signUpInfo: req.flash('signupinfo'),
      loginInfo: req.flash('logininfo')
   })
}

exports.postLogin = (req, res, next) => {
   const {emailLogin, passwordLogin} = req.body
   User.findByEmail(emailLogin)
      .then(user => {
         if(!user){
             return errorRedirect(null, 'Email e/ou senha incorretos!')
         }
         bcrypt.compare(passwordLogin, user.password)
            .then(isEqual => {
               if(!isEqual){
                  return errorRedirect(null, 'Senha incorreta!')
               }
               req.session.user = user
               req.session.save(err => {
                  if(err) return errorRedirect(err)
                  res.redirect('/workspace')
               })
            })
            .catch(err => {
               errorRedirect(err)
            })
      })
      .catch(err => {
         errorRedirect(err)
      })
   function errorRedirect(err, msg='Houve um erro ao tentar entrar na conta!'){
      if(err) console.log(err)
      req.flash('logininfo', msg)
      res.redirect('/')
   }
}

exports.getLogout = (req, res, next) => {
   req.session.destroy(err => {
      if(err){
         console.log(err)
      }
      res.redirect('/')
   })
}

exports.postSignup = (req, res, next) => {
   const {firstname, lastname, email, password, passwordcheck, gender, birthday} = req.body
   let errorMsg = 'Houve um erro ao tentar fazer o cadastro!'
   if(password != passwordcheck){
      errorMsg += '<br>Senhas não coincidem.'
      req.flash('sigupsuccess', false)
      req.flash('signupinfo', errorMsg)
      return res.redirect('/')
   }
   bcrypt.genSalt(12)
      .then(salt => {
         return bcrypt.hash(password, salt)
      })
      .then(hashPassword => {
         const newUser = new User(firstname, lastname, email, hashPassword, gender, birthday)
         return newUser.save()
      })
      .then((result) => {
         req.flash('sigupsuccess', true)
         req.flash('signupinfo', "Usuário cadastrado com sucesso!</br>Clique em 'Entrar' na barra de navegação")
         res.redirect('/')
      })
      .catch(err => {
         if(err.sqlMessage == `Duplicate entry '${email}' for key 'email'`){
            errorMsg += '</br>Email já cadastrado!'
         }
         console.log(err)
         req.flash('sigupsuccess', false)
         req.flash('signupinfo', errorMsg)
         res.redirect('/')
      })
}