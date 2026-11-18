
const {getDB} = require('../config/db')
const {ObjectId} = require('mongodb')



class User{
     constructor(data={}){
          Object.assign(this, data)
          const userId = data._id || data.id;
           this._id = userId
               ? (userId instanceof ObjectId
                    ? userId
                    : ObjectId.isValid(String(userId))
                    ? new ObjectId(String(userId))
                    : userId)
               : undefined;
          this.id = userId ? String(userId) : undefined;
     }

     static async create(data){
          const db = getDB()
          const user = {
               name:data.name,
               email:data.email.toLowerCase().trim(),
               password:data.password,
               role:data.role || "candidate",
               createdAt:new Date(),
               updatedAt:new Date()
          }
          const result = await db.collection('users').insertOne(user)
          return new User({...user,_id:result.insertedId,id:result.insertedId.toString()})
     }

     static async findByEmail(email){
          const db = getDB()

          if(!email)return null

          const user  = await db.collection("users").findOne({email:email.toLowerCase().trim(),})
          return user ? new User(user) : null;
     }

     static async findById(id) {
          const db = getDB();

          if (!ObjectId.isValid(String(id))) return null;

          const user = await db.collection("users").findOne({
               _id: new ObjectId(String(id)),
          });

          return user ? new User(user) : null;
     }
}

module.exports = User