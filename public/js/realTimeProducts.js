let socket = io()

socket.on('productos', (data)=>{
render(data)
})

socket.on('estado', (estado)=>{
   const html = `<em> ${estado} </em>`
   document.getElementById('estado').innerHTML = html
    })

function render(data){
    const html = data.map(elem => {
        return (`
        <div class="col" style="padding:10px">
                <div class="card" style="width: 18rem;">
                    <img src="images/No_Image_Available.jpeg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h3 class="card-title">${elem.title}</h3>
                        <p class="card-text">${elem.description}</p>
                        <h2 class="card-title">$${elem.price}</h2>
                        <div>
                            <em class="card-title">Disponibles: ${elem.stock}</em>
                        </div>
                        <a href="#" class="btn btn-primary" id=${elem.id} onclick={deleteProduct('${elem.id}')}>Eliminar Producto</a>
                        <div>
                            <em class="card-title">Codigo: ${elem.code}</em>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }).join(' ')
 document.getElementById('caja').innerHTML = html
}


function addProduct(e){
    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        status: true,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
    }
    console.log(product)
    socket.emit('new-product', product)

    return false
}


function deleteProduct(id){
    console.log(id)
    socket.emit('delete-product', id)
}
