const mongoose = require("mongoose");

const basketSchema = new mongoose.Schema(
  {
    costumer: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      set: (e) => parseFloat(e).toFixed(2)
    },
    baketProduct: [{
        product_id:{
            type: String,
            required: true,
        },
        count:{
            type:Number,
            required: true,
        },
        options:{
            optionName:{
                type:String
            },
            optionsDetail:[
                
            ]
        }
      }]
  }
);

module.exports = mongoose.model("basket", basketSchema);
