module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        active: Boolean,
        // promotion_number: Number,
        // random_promotion_of_the_day: {type:mongoose.Schema.Types.ObjectId, ref:'promotion'},
        // promotions:[
        //   {type:mongoose.Schema.Types.ObjectId, ref:'promotion'}
        // ],
        bonus: Number,
        bonus_time_start_hour: Number,
        bonus_time_start_minute: Number,
        bonus_time_end_hour: Number,
        bonus_time_end_minute: Number,
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
  