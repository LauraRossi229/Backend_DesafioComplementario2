const socket = io(); // Establecer conexión con el servidor


socket.on('prods', (products) => {
  console.log('Received updated products:', products); // Agregar esta línea para mostrar los productos en la consola
  updateProductList(products);
  window.location.reload();
});

socket.on('productDeleted', (productId) => {
  removeProduct(productId);
  window.location.reload();
});



function updateProductList(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  products.forEach((product) => {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-product-id', product.id); // Agregar el atributo al elemento
    listItem.innerHTML = `${product.name} - $${product.price} <button onclick="deleteProduct('${product.id}')">Eliminar</button>`;
    productList.appendChild(listItem);
  });
}

function addToCart(productId) {
  const quantity = prompt('Ingrese la cantidad a agregar al carrito:');
  if (quantity !== null) {
    // Envía una solicitud PUT al servidor para agregar el producto al carrito
    fetch(`/api/carts/${cartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.respuesta === 'OK') {
          alert('Producto agregado al carrito correctamente.');
        } else {
          alert('Error al agregar el producto al carrito.');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Error al agregar el producto al carrito.');
      });
  }
}


function removeProduct(productId) {
  const productToRemove = document.querySelector(`[data-product-id="${productId}"]`);
  if (productToRemove) {
    productToRemove.remove();
  }
}

function createProduct() {
  const productName = document.getElementById('productName').value;
  const productPrice = parseFloat(document.getElementById('productPrice').value);
  const productDescription = document.getElementById('productDescription').value;
  const producthumbnail = document.getElementById('productDescription').value;
  const productCode= document.getElementById('productDescription').value;
  const productStock = document.getElementById('productDescription').value;

  console.log('productName:', productName); // Agrega esto para verificar
  console.log('productPrice:', productPrice); // Agrega esto para verificar

  if (productName && !isNaN(productPrice)) {
    const newProduct = { name: productName, price: productPrice,description:productDescription, thumbnail: producthumbnail,code:productCode, stock: productStock };
    socket.emit('newProduct', newProduct);
  }
}

function deleteProduct(productId) {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este producto?');
  if (confirmDelete) {
    socket.emit('deleteProduct', productId);
  }
}
