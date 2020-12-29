module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        active: String,
        active_date: Date,
        ordering: Number,
        url: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Advertise = mongoose.model("advertise", schema);
    return Advertise;
  };
  