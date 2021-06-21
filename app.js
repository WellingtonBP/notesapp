const express = require('express')
const app = express()
const router = require('./routes/main')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const conn = require('./util/dbConnector')
const User = require('./models/user')
const errorController = require('./controllers/error')

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', 'views')


const expirationTime = 172800000
const sessionStore = new MySQLStore({
   expiration: expirationTime,
   clearExpired: true,
   checkExpirationInterval: expirationTime
}, conn)
app.use(session({
   secret: 'NotesApplicationSecret',
   resave: false,
   saveUninitialized: false,
   cookie: {maxAge: expirationTime, httpOnly: true},
   store: sessionStore
}))

app.use(csrf())
app.use((req,res,next) => {
   res.locals.csrfToken = req.csrfToken()
   next()
})

app.use(flash())

app.use((req, res, next) =>{
   if(!req.session.user){
      return next()
   }
   const {id, name, lastname, email, password, gender, birthday, creationdate} = req.session.user
   const user = new User(name, lastname, email, password, gender, birthday, id, creationdate)
   user.birthday = `${user.birthday.getDate()}/${user.birthday.getMonth()+1}/${user.birthday.getFullYear()}`
   user.creationDate = `${user.creationDate.getDate()}/${user.creationDate.getMonth()+1}/${user.creationDate.getFullYear()}`
   req.user = user
   res.locals.user = req.user
   next()
})

app.use(router)
app.use(errorController.get404)

app.listen(3000, console.log('server is running!'))
