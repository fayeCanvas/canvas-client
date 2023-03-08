import mongoose from 'mongoose';
import User from '../models/user.js'
import 'dotenv/config';

const uri = `mongodb://127.0.0.1:27017/canvas`

mongoose.connect(uri)
  .then(() => {
    console.log("connected to local mongoDB")
  },
    (err) => {
      console.log("err", err);
    })

let user = {
  firstName: "Faye",
  lastName: "Hayes",
  email: "faye@fayemyrettehayes.com",
  password: "password1",
  password_confirmation: "password1",
  role: "CLIENT",
}

const seedDB = async () => {
  await User.deleteMany({})
  await User.create(user)
}

seedDB().then(() => {
  mongoose.connection.close()
}).catch((err) => console.log(err))
