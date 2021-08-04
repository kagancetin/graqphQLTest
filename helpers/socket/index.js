const { graphql } = require("graphql");
const schema = require("../../graphql/schema");

let baskets = {};

module.exports = (io)=>{
    io.on("connection", socket => {
        let userId = "";
        socket.on("userId", id=>{
            userId = id;
        })
        socket.on("addBasket", async basketProduct=>{
            if(baskets[userId]){
                baskets[userId].push(basketProduct);
            }
            else{
                baskets[userId] = new Array;
                baskets[userId].push(basketProduct);
            }

            calculateBasket(baskets[userId])
            .then(doc => {
                console.log("doc",doc)
                socket.emit("basketUpdate",doc)
            })
            .catch(err => {console.log("err",err);socket.emit("basketError",err)})
            
        })
        socket.on('disconnect', () => {
            console.log('user disconnected');
          });
    });
}


const calculateBasket = basketByUserId => {
    return new Promise(async(resolve, reject) => {
        let sendBasketResult = new Object;
        sendBasketResult.product = await Promise.all(basketByUserId.map(async p=>{
            let query = `
            query{
                getProduct(_id:"${p.product_id}") {
                  _id
                  price
                  open
                  deleted
                }
              }
            `
            let product = await graphql(schema, query)
            console.log("product",product);
            if(product.errors) reject("Bir hata oluştu");
            if(!product.data.getProduct.open) reject("Ürün şuan satışta değil");
            if(product.data.getProduct.delete) reject("Ürün şuan satışta değil");
            
            let totalPrice = product.data.getProduct.price * p.count;
            
            console.log(totalPrice);
            if(p.options.length>0){
                p.options.forEach(k=>{
                    k.optionsDetail.forEach(t=>{
                        if(t.optionPriceDifference != null){
                            totalPrice += t.optionPriceDifference * p.count
                        }
                    })
                })
            }
            p.totalPrice = totalPrice;
            return p;
        })
        )
        console.log("sendBasketResult", sendBasketResult);
        resolve(sendBasketResult);
      });
}
