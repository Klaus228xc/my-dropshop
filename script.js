const XML_URL = "https://websklad.biz.ua";
const PROXY_URL = "https://herokuapp.com"; // Прокси для обхода блокировки

let cart = [];

// Функция для загрузки товаров из XML
async function loadProducts() {
    const grid = document.getElementById('products');
    grid.innerHTML = "<h2>Завантаження товарів...</h2>";

    try {
        // Загружаем XML (используем прокси, если напрямую блокирует)
        const response = await fetch(PROXY_URL + XML_URL);
        const str = await response.text();
        const data = new window.DOMParser().parseFromString(str, "text/xml");
        
        const items = data.querySelectorAll("offer");
        grid.innerHTML = ""; // Очищаем текст загрузки

        items.forEach((item, index) => {
            // Берем только первые 20 товаров, чтобы не тормозило
            if (index > 20) return; 

            const id = item.getAttribute("id");
            const name = item.querySelector("name").textContent;
            const price = item.querySelector("price").textContent;
            const picture = item.querySelector("picture").textContent;
            const vendor = item.querySelector("vendor")?.textContent || "Websklad";

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${picture}" alt="${name}">
                <h3>${name}</h3>
                <p style="color: gray; font-size: 0.8em;">Виробник: ${vendor}</p>
                <p class="price">${price} грн</p>
                <button onclick="addToCart('${id}', '${name.replace(/'/g, "")}', ${price})">Купити</button>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
        grid.innerHTML = "<h2>Помилка завантаження товарів. Спробуйте пізніше.</h2>";
    }
}

// Корзина
function addToCart(id, name, price) {
    cart.push({ id, name, price });
    document.getElementById('cartCount').innerText = cart.length;
    alert(`Додано: ${name}`);
}

function toggleCart() {
    document.getElementById('checkoutModal').classList.toggle('hidden');
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('totalSum').innerText = total;
}

// Форма заказа
document.getElementById('orderForm').onsubmit = (e) => {
    e.preventDefault();
    const payType = document.querySelector('input[name="payType"]:checked').value;
    const total = document.getElementById('totalSum').innerText;
    
    // Формируем текст для сообщения (например, для Telegram)
    let orderText = `Нове замовлення!\nСума: ${total} грн\nОплата: ${payType}\nТовари:\n`;
    cart.forEach(item => orderText += `- ${item.name}\n`);

    if (payType === 'card') {
        alert("Перенаправлення на оплату...");
        // Тут можно вставить ссылку на твой Monobank или WayForPay
    } else {
        alert("Дякуємо! Замовлення прийнято.");
    }
    
    console.log(orderText); // В консоли можно увидеть готовый текст заказа
    cart = [];
    toggleCart();
};

// Запуск загрузки при открытии страницы
loadProducts();
