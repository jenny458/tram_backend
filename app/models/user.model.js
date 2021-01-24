module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        account_id: String,
        mobile: String,
        email: String,
        email_verify: Boolean,
        profile_url:String,
        gender: String,
        full_name: String,
        first_name: String,
        last_name: String,
        jid: String,
        avatar: String,
        point: Number,
        life: Number,
        chest: Number,
        quiz:[
          {type:mongoose.Schema.Types.ObjectId, ref:'quiz'}
        ],
        music: Boolean,
        sound: Boolean,
        caption: String,
        status: String,
        addLife: Boolean,
        latestLifeTimestamp: Date,
        userQuizTimestamp: Date,
        // account_app: String,
        // account_name: String,
        // account_photo_url: String,
        // age: Number,
        // birth_day: Date,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const User = mongoose.model("user", schema);
    return User;
  };
  