var addOrderToBasket = function(e,jsonProduct){
    e.preventDefault();
    let product = JSON.parse(jsonProduct);
    let basketProduct = {
        product_id: product._id,
        productName: product.productName,
        price: product.price,
        count :parseInt(e.target.querySelector("#countProduct").value)
    };

    let options = [];
    let optionsDiv = e.target.querySelectorAll(".optionsDiv");
    product.options.forEach(function(p,i) {
        let optionsItem = {
            optionName: p.optionName,
            optionType: p.optionType,
            optionsDetail: []
        }
        if(p.optionType == 1){
           
            if(e.target.querySelector("[name='"+p.optionName+"']:checked")){
                optionsItem.optionsDetail.push(p.optionDetail.find(function(k){
                    return k.optionDetailContent == e.target.querySelector("[name='"+p.optionName+"']:checked").value
                }) )
            }
            else{
                toastr.warning(p.optionDisplayName, "Dikkat!");
                throw p.optionDisplayName;
            }
        }
        if(p.optionType == 2){
            optionsItem.out = true;
            p.optionDetail.forEach(function(k){
                if(optionsDiv[i].querySelector("#"+k.optionDetailContent+i).checked){
                    optionsItem.optionsDetail.push(k);
                }
            })
        }
        if(optionsItem.optionsDetail.length>0){
            options.push(optionsItem);
        }     
    });
    basketProduct.options = options;
    console.log(basketProduct);
    socket.emit("addBasket", basketProduct)
}