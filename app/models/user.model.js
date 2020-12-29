module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        account_app: String,
        account_name: String,
        account_photo_url: String,
        avatar: String,
        point: Number,
        sex: String,
        age: Number,
        life: Number,
        birth_day: Date,
        chest: Number,
        quiz:[
          {type:mongoose.Schema.Types.ObjectId, ref:'quiz'}
        ]
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
  