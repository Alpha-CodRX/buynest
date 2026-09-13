import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Category",
    required: true,
  },
image: {
  type: [String],
  default: [],
  required: true,
},

  inStock: {
    type: Boolean,
    default: true,
  },

specifications: {
  type: Object,
  default: {},
},


options:[
  {
  name: String,
  values: [String],
  }
],

stock: {
    type: Number,
    required: true,
    default: 0,
}

});


const Product = mongoose.model(
    "Product",
    productSchema,
);

export default Product;