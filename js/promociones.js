const PRECIOS = {
  funda:       8500,
  toalla:      6200,
  mantel:      19900,
  velas:       4800,
  combo_deco:  15000
};

const NOMBRES = {
  funda:      'Funda de almohadón',
  toalla:     'Toalla de mano',
  mantel:     'Mantel 6 sillas',
  velas:      'Set de velas',
  combo_deco: 'Combo deco'
};

/* Carrito: guarda { idProducto: cantidad } */
const carrito = {};

/* Referencias al DOM */
const cartRows     = document.getElementById('cartRows');
const subtotalEl   = document.getElementById('subtotal');
const discItemsEl  = document.getElementById('discount-items');
const discCEl      = document.getElementById('discount-c');
const grandTotalEl = document.getElementById('grand-total');

const promos = document.getElementById('promos');



function formatearPrecio(numero) {
  return '$' + Math.round(numero).toLocaleString('es-AR');
}

/* Calcula la mejor promo A (2° al 50%) o B (3x2) para un producto */
function calcularMejorPromo(idProducto, cantidad) {
  const precio = PRECIOS[idProducto];

  const pares  = Math.floor(cantidad / 2); // para promo A
  const trios  = Math.floor(cantidad / 3); // para promo B

  const ahorroA = pares * (precio * 0.5); // 2° unidad al 50%
  const ahorroB = trios * precio;         // 3x2 = te llevás 3, pagás 2

  if (ahorroA >= ahorroB) {
    return {
      ahorro: ahorroA,
      texto: `Promo A: ${pares} segundas unidades al 50%`
    };
  } else {
    return {
      ahorro: ahorroB,
      texto: `Promo B: ${trios} promo(s) 3x2`
    };
  }
}

/* 
   Cálculo de totales
 */
function calcularTotales() {
  let subtotal       = 0;
  let descuentoAB    = 0;
  let descuentoC     = 0;

  for (const id in carrito) {
    const cantidad = carrito[id];
    const precio   = PRECIOS[id];

    subtotal += precio * cantidad;

    const promo = calcularMejorPromo(id, cantidad);
    descuentoAB += promo.ahorro;
  }

  const base = subtotal - descuentoAB;

  // Promo C
  if (subtotal >= 30000) {
    descuentoC = base * 0.10;
  }

  const total = subtotal - descuentoAB - descuentoC;

  return {
    subtotal,
    descuentoAB,
    descuentoC,
    total
  };
}


function actualizarResumen() {
  const t = calcularTotales();

  subtotalEl.textContent   = formatearPrecio(t.subtotal);
  discItemsEl.textContent  = formatearPrecio(t.descuentoAB);
  discCEl.textContent      = formatearPrecio(t.descuentoC);
  grandTotalEl.textContent = formatearPrecio(t.total);
}

/* 
   Carrito: filas */
function crearFilaCarrito(idProducto) {
  const cantidad       = carrito[idProducto];
  const precio         = PRECIOS[idProducto];
  const subtotalBruto  = precio * cantidad;
  const promo          = calcularMejorPromo(idProducto, cantidad);
  const totalLinea     = subtotalBruto - promo.ahorro;

  const fila = document.createElement('div');
  fila.className = 'item';
  fila.dataset.id = idProducto;

  fila.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
      <strong>${NOMBRES[idProducto]}</strong>
      <div style="display:inline-flex;gap:4px;align-items:center;margin-left:8px">
        <button type="button" class="btn-restar">−</button>
        <input type="number" class="input-cantidad" min="1" value="${cantidad}" style="width:52px;text-align:center">
        <button type="button" class="btn-sumar">+</button>
      </div>
    </div>
    <span class="item-precio">${formatearPrecio(precio)}</span>
    <button type="button" class="btn-eliminar" aria-label="Quitar">X</button>
    <span class="item-subtotal">
      ${
        promo.ahorro > 0
          ? `${promo.texto} (ahorro ${formatearPrecio(promo.ahorro)})`
          : 'Sin promo'
      }
    </span>
    <span class="item-subtotal" style="font-weight:bold;text-align:right">
      ${formatearPrecio(totalLinea)}
    </span>
  `;

  // Botones y eventos de la fila
  const btnRestar   = fila.querySelector('.btn-restar');
  const btnSumar    = fila.querySelector('.btn-sumar');
  const inputCant   = fila.querySelector('.input-cantidad');
  const btnEliminar = fila.querySelector('.btn-eliminar');

  btnRestar.addEventListener('click', () => {
    let nuevaCantidad = Number(inputCant.value) - 1;
    if (nuevaCantidad <= 0) {
      delete carrito[idProducto];
    } else {
      carrito[idProducto] = nuevaCantidad;
    }
    renderizarCarrito();
  });

  btnSumar.addEventListener('click', () => {
    let nuevaCantidad = Number(inputCant.value) + 1;
    carrito[idProducto] = nuevaCantidad;
    renderizarCarrito();
  });

  inputCant.addEventListener('input', () => {
    let nuevaCantidad = Number(inputCant.value);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      nuevaCantidad = 1;
    }
    inputCant.value = nuevaCantidad;
    carrito[idProducto] = nuevaCantidad;
    renderizarCarrito();
  });

  btnEliminar.addEventListener('click', () => {
    delete carrito[idProducto];
    renderizarCarrito();
  });

  return fila;
}


function renderizarCarrito() {
  cartRows.innerHTML = '';

  for (const id in carrito) {
    const fila = crearFilaCarrito(id);
    cartRows.appendChild(fila);
  }

  actualizarResumen();
}

/*
   Tarjetas de la sección 1 */
function prepararTarjetas() {
  if (!promos) return;

  const tarjetas = promos.querySelectorAll('.gallery-item');

  tarjetas.forEach((tarjeta) => {
    const idProducto = tarjeta.getAttribute('data-id');
    const btnMenos   = tarjeta.querySelector('.btn-dec');
    const btnMas     = tarjeta.querySelector('.btn-inc');
    const inputCant  = tarjeta.querySelector('.qty');
    const btnAgregar = tarjeta.querySelector('.btn-add');

    // Botón -
    btnMenos.addEventListener('click', () => {
      let cantidad = Number(inputCant.value) || 1;
      if (cantidad > 1) {
        cantidad--;
      }
      inputCant.value = cantidad;
    });

    // Botón +
    btnMas.addEventListener('click', () => {
      let cantidad = Number(inputCant.value) || 1;
      cantidad++;
      inputCant.value = cantidad;
    });

    // Botón "Agregar al carrito"
    btnAgregar.addEventListener('click', () => {
      let cantidad = Number(inputCant.value) || 1;

      if (!carrito[idProducto]) {
        // Si no estaba en el carrito, lo agrego
        carrito[idProducto] = cantidad;
      } else {
        // Si ya existe, sumo la cantidad
        carrito[idProducto] += cantidad;
      }

      renderizarCarrito();
    });
  });
}

/*
   Inicio
 */
prepararTarjetas();
renderizarCarrito();

  