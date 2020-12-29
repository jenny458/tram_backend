module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        detail: String,
        detail_type: String,
        active: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Proward = mongoose.model("promotion", schema);
    return Proward;
  };
  