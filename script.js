const products = [
    { id: 1, name: "PowerBank 30000mAh", price: 1800, img: "https://picsum.photos" },
    { id: 2, name: "Лампа на акумуляторі", price: 650, img: "https://picsum.photos" }
];

let cart = [];

// Рендер товарів
const grid = document.getElementById('products');
products.forEach(p => {
    grid.innerHTML += `
        <div class="card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p class="price">${p.price} грн</p>
            <button onclick="addToCart(${p.id})">Купити</button>
        </div>
    `;
});

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    document.getElementById('cartCount').innerText = cart.length;
    alert('Товар додано!');
}

function toggleCart() {
    document.getElementById('checkoutModal').classList.toggle('hidden');
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('totalSum').innerText = total;
}

// Обробка замовлення
document.getElementById('orderForm').onsubmit = async (e) => {
    e.preventDefault();
    const payType = document.querySelector('input[name="payType"]:checked').value;
    const total = document.getElementById('totalSum').innerText;

    if (payType === 'card') {
        // Імітація виклику API Monobank/WayForPay
        alert(`Перехід на сторінку оплати WayForPay... Сума: ${total} грн`);
        window.location.href = "https://wayforpay.com..."; // Приклад посилання
    } else {
        alert(`Дякуємо! Замовлення на суму ${total} грн оформлено післяплатою. Чекайте на дзвінок.`);
        cart = [];
        location.reload();