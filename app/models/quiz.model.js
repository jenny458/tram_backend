module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        type: String,
        quiz: String,
        quiz_pic: String,
        choice_type: String,
        choice_1: String,
        choice_2: String,
        answer: String,
        timer: Number,
        point: Number
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Quiz = mongoose.model("quiz", schema);
    return Quiz;
  };
  