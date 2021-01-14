module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        active: Boolean,
        promotion_number: Number,
        random_promotion_of_the_day: {type:mongoose.Schema.Types.ObjectId, ref:'promotion'},
        promotions:[
          {type:mongoose.Schema.Types.ObjectId, ref:'promotion'}
        ],
        bonus: Number,
        bonus_start_time: Date,
        bonus_end_time: Date
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Setting = mongoose.model("setting", schema);
    return Setting;
  };
  