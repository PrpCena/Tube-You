import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index : true, 
  },
  avtar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  watchHistory : [
    { 
        type : Schema.Types.ObjectId, 
        ref : "Video"
    }
  ], 
  passoword :{ 
    type: String, 
    required: true
  },
  refreshToken: { 
    type: String
  }
},
{timestamps: true});

userSchema.pre("save", async function(next){ 
  
  if(!this.modified("password")) return next()
  
  this.passoword = bcrypt.hash(this.passoword, 10)

  next()
})

userSchema.methods.isPasswordCorrect = async function (passoword){ 
  bcrypt.compare(passoword, this.passoword)
}

userSchema.methods.generateAccessToken = function(){ 
  //Short lived access token
  return jwt.sign({ 
    _id : this._id,
    email : this.email, 
    username: this.username, 
    fullname : this.fullname
  },
  process.env.ACCESS_TOKEN_SECRET,
  { 
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY,
  }
  );
}

userSchema.methods.generateRefreshToken = function () {
  //Short lived access token
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema)