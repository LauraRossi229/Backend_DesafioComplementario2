// Función para ordenar los productos por precio (ascendente o descendente)
function sortByPrice(order) {
    // Obtén la lista de productos de la vista
    const productList = document.getElementById('productList');
    const products = Array.from(productList.querySelectorAll('li'));
  
    // Ordena los productos según el precio
    products.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price);
      const priceB = parseFloat(b.dataset.price);
  
      if (order === 'asc') {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  
    // Limpia la lista de productos y agrega los productos ordenados
    productList.innerHTML = '';
    products.forEach((product) => {
      productList.appendChild(product);
    });
  }
  
  // Función para filtrar los productos por cantidad
  function filterByQuantity(quantity) {
    console.log(`Filtrando por cantidad: ${quantity}`);
    const productList = document.getElementById('productList');
    const products = Array.from(productList.querySelectorAll('li'));
  
    products.forEach((product) => {
      const productQuantity = parseInt(product.dataset.quantity);
  
      if (quantity === 'all' || productQuantity >= parseInt(quantity)) {
        product.style.display = 'block';
        console.log(`Mostrando producto: ${productQuantity}`);
      } else {
        product.style.display = 'none';
        console.log(`Ocultando producto: ${productQuantity}`);
      }
    });
  }
  
  
  // Event Listener para el botón de ordenar por precio ascendente
  const sortAscButton = document.getElementById('sortAscButton');
  sortAscButton.addEventListener('click', () => {
    sortByPrice('asc');
    console.log('Productos ordenados ascendentemente');
  });
  
  // Event Listener para el botón de ordenar por precio descendente
  const sortDescButton = document.getElementById('sortDescButton');
  sortDescButton.addEventListener('click', () => {
    sortByPrice('desc');
    console.log('Productos ordenados descendentemente');
  });
  
  // Event Listener para el elemento select de filtrado por cantidad
  const filterQuantitySelect = document.getElementById('filterQuantity');
  filterQuantitySelect.addEventListener('change', () => {
    const selectedQuantity = filterQuantitySelect.value;
    filterByQuantity(selectedQuantity);
    console.log(`Filtrado por cantidad: ${selectedQuantity}`);
  });
  
  // Otras funciones y Event Listeners según tus necesidades
  