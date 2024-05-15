const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('closed-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarning = document.getElementById('address-warning')

let cart = []

// Abrindo o modal
cartBtn.addEventListener('click', function() {
    cartModal.style.display = 'flex'
})

// Fechando o modal
cartModal.addEventListener('click', function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})
closeModalBtn.addEventListener('click', function() {
    cartModal.style.display = 'none'
})

// Adicionando itens ao carrinho de compras 
menu.addEventListener('click', function(event) {
    let parentButton = event.target.closest('.add-to-cart-btn')
    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        // Adicionar ao carrinho
        addToCart(name, price)
    }
})

// Adiciona o item ao carrinho
function addToCart(name, price) {
    // Verificando se o produto já existe no carrinho, se existir, adiciona mais 1 item a qtd
    const isProduct = cart.find(item => item.name === name)
    if (isProduct) {
        isProduct.quantity += 1
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }
}