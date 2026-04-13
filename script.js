const XML_URL = "https://websklad.biz.ua";
// Используем два разных прокси для надежности
const PROXY_1 = "https://api.allorigins.win/get?url=";
const PROXY_2 = "https://corsproxy.io?"; 

let allProducts = [];

async function loadData() {
    const grid = document.getElementById('products');
    if (!grid) return;
    grid.innerHTML = "<h2 style='text-align:center; width:100%; color:white;'>Оновлення вітрини...</h2>";

    try {
        // Пробуем первый прокси (AllOrigins)
        let response = await fetch(PROXY_1 + encodeURIComponent(XML_URL));
        let data = await response.json();
        let xmlText = data.contents;

        // Если первый не сработал, пробуем второй
        if (!xmlText) {
            console.log("Switching to backup proxy...");
            response = await fetch(PROXY_2 + encodeURIComponent(XML_URL));
            xmlText = await response.text();
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const offers = xml.querySelectorAll("offer");

        allProducts = Array.from(offers).map(offer => ({
            id: offer.getAttribute("id"),
            name: (offer.querySelector("name")?.textContent || "Товар без назви").replace(/['"«»]/g, ""), 
            price: offer.querySelector("price")?.textContent || "0",
            picture: offer.querySelector("picture")?.textContent || "",
        }));

        render(allProducts);
    } catch (err) {
        console.error("Критична помилка:", err);
        grid.innerHTML = "<h2 style='color:red; text-align:center; width:100%;'>Сервер тимчасово зайнятий. <br> Будь ласка, натисніть CTRL+F5 через 10 секунд.</h2>";
    }
}

function render(items) {
    const grid = document.getElementById('products');
    grid.innerHTML = "";
    items.slice(0, 60).forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.picture}" alt="Product" onerror="this.src='https://placeholder.com'">
            <h3>${item.name}</h3>
            <p class="price">${item.price} грн</p>
            <button class="buy" onclick="sendOrder('${item.id}')">Купити</button>
        `;
        grid.appendChild(card);
    });
}

window.sendOrder = function(productId) {
    const p = allProducts.find(x => x.id === productId);
    const phone = prompt(`Ви замовляєте: ${p.name}\nЦіна: ${p.price} грн\n\nВведіть ваш номер телефону:`, "+380");
    if (phone && phone.length > 9) alert("Дякуємо! Очікуйте на дзвінок.");
}

loadData();
