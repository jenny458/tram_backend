module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        user_id: String,
        activity: String,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Activities = mongoose.model("user_activities", schema);
    return Activities;
  };
  