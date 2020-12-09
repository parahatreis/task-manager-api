const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Middleware
const auth = require('../middleware/auth');
// File Upload Multer
const multer = require('multer');
// Sharp to image converter
const sharp = require('sharp');
// SendGrid Email
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');




/* Routers */

router.get('/test', (req, res) => {
   res.send('This is test router');
});

/* USERS API */

// POST Users
router.post('/users', async (req, res) => {
   const user = new User(req.body);

   try {
      await user.save();
      sendWelcomeEmail(user.email, user.name)
      const token = await user.generateAuthToken();

      res.status(201).send({user, token})
   } catch (error) {
      res.status(400).send(error)
   }
});

// LOGIN User
router.post('/users/login', async (req, res) => {
   try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      // token
      const token = await user.generateAuthToken();

      res.send({ user , token});
   }
   catch (err) {
      res.status(400).send(err);
   }

});

// LOGOUT User
router.post('/users/logout', auth, async (req, res) => {

   try {

      req.user.tokens = req.user.tokens.filter((token) => {
         return token.token !== req.token 
      })
      await req.user.save();

      res.send()

   } catch (err) {   
      res.status(500).send();
   }

});

// LOGOUT User
router.post('/users/logoutAll', auth, async (req, res) => {

   try {

      req.user.tokens = [];
      
      await req.user.save();
      res.send()

   } catch (err) {
      res.status(500).send();
   }

});

// GET All Users
router.get('/users/me',auth, async (req, res) => {
   res.send(req.user)
});


// Patch(Update) User
router.patch('/users/me', auth ,async (req, res) => {
   // Checks req.body
   const updates = Object.keys(req.body);
   const allowedUpdates = ['name', 'password', 'age', 'email'];
   const isValid = updates.every((update) => allowedUpdates.includes(update));

   if (!isValid) return res.status(400).send({
      error: "Invalid updates!"
   });

   try {
      updates.forEach((update) => req.user[update] = req.body[update]);
      await req.user.save();

      res.send(req.user)
   }
   catch (error) {
      res.status(400).send()
   }

});

// Delete User
router.delete('/users/me', auth ,async (req, res) => {
   try {
      await req.user.remove();
      sendCancelationEmail(req.user.email, req.user.name);
      res.send(req.user)
   }
   catch (error) {
      res.send(500).send()
   }
});

// POST Avatar (upload wth 'multer')
const upload = multer({
   // dest: 'avatars', destination of images
   limits: {
      fileSize : 1000000
   },
   fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|jpeg|svg)$/)) {
         return cb(new Error('Please upload image formats'))
      }
      cb(undefined, true)
   }
});
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

   // Convert image to png with sharp 
   const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

   req.user.avatar = buffer;

   await req.user.save()
   res.send()
}, (error, req, res, next) => {
      res.status(400).send({ error : error.message})
})


// DELETE Avatar
router.delete('/users/me/avatar', auth,  async (req, res) => {
   req.user.avatar = undefined;
   await req.user.save()
   res.send()
   
}, (error, req, res, next) => {
   res.status(400).send({
      error: error.message
   })
})


// GET Avatar
router.get('/users/:id/avatar', async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      if (!user || !user.avatar) {
         throw new Error()
      }
      res.set('Content-Type', 'image/png')
      res.send(user.avatar)
   }
   catch (error) {
      res.status(404).send(error)
   }
})


module.exports = router;

