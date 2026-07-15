import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

```
userId: String,

coins: {
    type: Number,
    default: 0
},

bank: {
    type: Number,
    default: 0
},

xp: {
    type: Number,
    default: 0
},

level: {
    type: Number,
    default: 1
},

marriedTo: {
    type: String,
    default: null
}
```

});

export const User =
mongoose.models.User ||
mongoose.model("User", UserSchema);
