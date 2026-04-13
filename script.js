const XML_URL = "https://websklad.biz.ua";
// Используем прокси AllOrigins для обхода блокировки CORS
const PROXY = "https://allorigins.win";

let allProducts = [];

async function loadData() {
    const grid = document.getElementById('products');
    if (!grid) return;
    
    grid.innerHTML = "<h2 style='text-align:center; width:100%; color:white;'>Оновлення товарів...</h2>";

    try {
        const response = await fetch(PROXY + encodeURIComponent(XML_URL));
        if (!response.ok) throw new Error('Ошибка сети');
        
        const data = await response.json();
        // AllOrigins возвращает данные в поле contents
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");

        const offers = xml.querySelectorAll("offer");
        
        if (offers.length === 0) {
            grid.innerHTML = "<h2 style='color:yellow;'>Товари тимчасово відсутні.</h2>";
            return;
        }

        allProducts = Array.from(offers).map(offer => ({
            id: offer.getAttribute("id"),
            name: (offer.querySelector("name")?.textContent || "Без назви").replace(/['"«»]/g, ""), 
            price: offer.querySelector("price")?.textContent || "0",
            picture: offer.querySelector("picture")?.textContent || "",
        }));

        render(allProducts);
    } catch (err) {
        console.error("Помилка:", err);
        grid.innerHTML = "<h2 style='color:red; text-align:center; width:100%;'>Помилка завантаження. <br> Спробуйте оновити сторінку (CTRL+F5).</h2>";
    }
}

function render(items) {
    const grid = document.getElementById('products');
    grid.innerHTML = "";
    
    // Показываем первые 60 товаров
    items.slice(0, 60).forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.picture}" alt="${item.name}" onerror="this.src='https://placeholder.com'">
            <h3>${item.name}</h3>
            <p class="price">${item.price} грн</p>
            <button class="buy" onclick="sendOrder('${item.id}')">Купити</button>
        `;
        grid.appendChild(card);
    });
}

window.sendOrder = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    alert("Замовлення на: " + product.name + " прийнято! Введіть ваш телефон у наступному вікні.");
    const phone = prompt("Ваш номер телефону:", "+380");
    if(phone) alert("Менеджер зв'яжеться з вами!");
}

loadData();
