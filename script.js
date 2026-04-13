const XML_URL = "https://websklad.biz.ua";
const PROXY = "https://allorigins.win";

// ВСТАВЬ СВОИ ДАННЫЕ СЮДА:
const TG_TOKEN = "ТВОЙ_ТОКЕН_ОТ_BOTFATHER"; 
const TG_ID = "ТВОЙ_ID_ИЗ_USERINFOBOT";

let allProducts = [];

async function loadData() {
    const grid = document.getElementById('products');
    if (!grid) return;
    grid.innerHTML = "<h2 style='text-align:center; width:100%;'>Завантаження товарів...</h2>";

    try {
        const response = await fetch(PROXY + encodeURIComponent(XML_URL));
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");

        const offers = xml.querySelectorAll("offer");
        allProducts = Array.from(offers).map(offer => ({
            id: offer.getAttribute("id"),
            // Очищаем название от кавычек, чтобы не ломать код
            name: (offer.querySelector("name")?.textContent || "Без назви").replace(/['"«»]/g, ""), 
            price: offer.querySelector("price")?.textContent || "0",
            picture: offer.querySelector("picture")?.textContent || "",
        }));

        render(allProducts);
    } catch (err) {
        grid.innerHTML = "<h2 style='color:red;'>Помилка завантаження. Оновіть сторінку.</h2>";
    }
}

function render(items) {
    const grid = document.getElementById('products');
    grid.innerHTML = "";
    
    items.slice(0, 60).forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.picture}" loading="lazy" alt="product">
            <h3>${item.name}</h3>
            <p class="price">${item.price} грн</p>
            <button class="buy" onclick="sendOrder('${item.id}')">Купити</button>
        `;
        grid.appendChild(card);
    });
}

// Поиск товаров
window.searchProducts = function(query) {
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    render(filtered);
}

// Функция заказа
window.sendOrder = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    const phone = prompt(`Замовлення: ${product.name}\n\nВведіть ваш номер телефону:`, "+380");
    
    if (!phone || phone.length < 10) {
        alert("Будь ласка, введіть коректний номер!");
        return;
    }

    const text = `📦 НОВЕ ЗАМОВЛЕННЯ!\n\n🛍 Товар: ${product.name}\n💰 Ціна: ${product.price} грн\n📞 Телефон: ${phone}`;
    
    fetch(`https://telegram.org{TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ chat_id: TG_ID, text: text })
    })
    .then(() => alert("✅ Замовлення прийнято! Ми вам зателефонуємо."))
    .catch(() => alert("❌ Помилка відправки. Перевірте токен бота."));
}

loadData();
