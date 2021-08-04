socket.on("basketError",(msg)=>{
    toastr.error(msg, 'Hata!');
})

socket.on("basketUpdate",(basket)=>{
    toastr.success("Ürün sepete eklendi", 'Başarılı!');
    console.log(basket);
})
