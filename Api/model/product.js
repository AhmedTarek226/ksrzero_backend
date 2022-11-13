const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    durationOfUse: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    img: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    ableToExchange: {
      type: String,
    },
    firstFilter: {
      type: String,
      required: true,
    },
    secondFilter: {
      type: String,
      required: true,
    },
    thirdFilter: {
      type: String,
      required: true,
    },
    offers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required:true
      },
    ],
  },
  {
    versionKey: false,
    strict: false,
  }
);

module.exports = mongoose.model("productCollection", productSchema);
