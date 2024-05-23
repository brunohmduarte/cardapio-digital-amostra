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
const dateSpan = document.getElementById('date-span')

let cart = []

// Abrindo o modal
cartBtn.addEventListener('click', function() {
    cartModal.style.display = 'flex'
    updateCartModal()
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
    updateCartModal()
    updateCartCounter()
}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = '';
    let total = 0.0;

    cart.forEach(item => {
        let price = item.price.toLocaleString('pt-br', {
            style: "currency",
            currency: "BRL"
        })

        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'border-b', 'flex-col')

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-semibold">${item.name}</p>
                    <p class="font-medium">Qtd.: <span class="font-light">${item.quantity}</span></p>
                    <p class="font-medium mt-3">${price}</p>
                </div>                
                <button class="text-red-500 remove-cart-item" data-name="${item.name}">Remover</button>
            </div>
        `
        
        cartItemsContainer.appendChild(cartItemElement)
        
        total += item.price * item.quantity
    })

    cartTotal.textContent = `Total: ${total.toLocaleString('pt-br', {
        style: "currency",
        currency: "BRL"
    })}`
}

// Cálculando a quantidade itens no carrinho
function updateCartCounter() {
    cartCounter.innerHTML = cart.reduce((accumulator, item) => accumulator + item.quantity, 0,)    
}

// Removendo os itens do carrinho
cartItemsContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-cart-item')) {
        const name = event.target.getAttribute('data-name')
        removeCartItem(name)
    }
})

function removeCartItem(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index != -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1
        } else {
            cart.splice(index, 1)
        }
        
        updateCartModal()
    }
}

addressInput.addEventListener('input', function (event) {
    let inputValue = event.target.value

    if (inputValue !== '') {
        addressWarning.classList.add('hidden')
        addressInput.classList.remove('border-red-500')
    }
})

// Finalizar pedido
checkoutBtn.addEventListener('click', function() {
    const isOpen = checkRestaurantStatus()
    if (!isOpen) {
        Toastify({
            text: "Ops! O estabelecimento está fechado no momento.",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
            onClick: function(){}
        }).showToast();

        return
    }

    if (cart.length === 0) {
        return
    }

    if (addressInput.value === '') {
        addressWarning.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        addressInput.focus()
    }

    let total = 0.0
    let deliveryFee = 5.0
    let template = `Olá! Eu gostaria de fazer meu pedido.

*Cliente:* Naiara R F Duarte
*Contato:* (18)99627-6572
*Endereço de Entrega:* ${addressInput.value}

*ITENS DO PEDIDO*`

    // Criando o pedido
    let cartItems = cart.map((item) => {
        total += item.price * item.quantity
        return (`
    *Produto:* ${item.name} 
    *Quantidade:* ${item.quantity} 
    *Valor:* ${item.price.toLocaleString('pt-br', {style: "currency", currency: "BRL"})} 
`)
    }).join('')

    total += deliveryFee

    template += cartItems
    template += `
*Taxa de Entrega:* ${deliveryFee.toLocaleString('pt-br', {style: "currency", currency: "BRL"})}
*VALOR TOTAL: ${total.toLocaleString('pt-br', {style: "currency", currency: "BRL"})}*


*Pagamento:* Cartão de Crédito

*Observação:*
`

    // Enviando o pedido para o Whatsapp Web
    const message = encodeURIComponent(template)
    const phone = '18997486483'
    
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')

    cart = []
    updateCartModal()
})

// Maninpulando o status Aberto/Fecho do restaurante
function checkRestaurantStatus() {
    const date = new Date()
    const hora = date.getHours()
    return hora >= 18 && hora < 23
}

const isOpen = checkRestaurantStatus()
if (isOpen) {
    dateSpan.classList.remove('bg-red-500')
    dateSpan.classList.add('bg-green-600')
} else {
    dateSpan.classList.add('bg-red-500')
    dateSpan.classList.remove('bg-green-600')
}