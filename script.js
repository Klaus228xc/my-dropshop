const XML_URL = "https://websklad.biz.ua";
const PROXY = "https://allorigins.win";

const MY_PHONE = "380998261128"; // ЗАМЕНИТЕ НА СВОЙ НОМЕР
const MARGIN = 1.0; // Наценка (1.2 = +20%, 1.0 = без наценки)

let allProducts = [];

async function loadData() {
    const grid = document.getElementById('products');
    if (!grid) return;
    grid.innerHTML = "<h2 style='text-align:center; width:100%; color:white;'>Оновлення вітрини...</h2>";

    try {
        const response = await fetch(PROXY + encodeURIComponent(XML_URL));
        const data = await response.json();
        
        // Ключевое исправление: данные лежат в data.contents
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const offers = xml.querySelectorAll("offer");

        if (offers.length === 0) throw new Error("XML пустой");

        allProducts = Array.from(offers).map(offer => {
            const rawPrice = parseFloat(offer.querySelector("price")?.textContent || "0");
            return {
                id: offer.getAttribute("id"),
                name: (offer.querySelector("name")?.textContent || "Товар").replace(/['"«»]/g, ""), 
                price: Math.round(rawPrice * MARGIN),
                picture: offer.querySelector("picture")?.textContent || "",
            };
        });

        render(allProducts);
    } catch (err) {
        console.error("Ошибка загрузки:", err);
        grid.innerHTML = "<h2 style='color:red; text-align:center; width:100%;'>Помилка завантаження. <br> Натисніть CTRL + F5 через 30 секунд.</h2>";
    }
}

function render(items) {
    const grid = document.getElementById('products');
    grid.innerHTML = "";
    items.slice(0, 60).forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.picture}" onerror="this.src='https://placeholder.com'">
            <h3>${item.name}</h3>
            <p class="price">${item.price} грн</p>
            <button class="buy-btn" onclick="sendOrder('${item.id}')">Замовити</button>
            <div class="social-btns" style="display:flex; gap:5px; margin-top:10px;">
                <a href="viber://chat?number=${MY_PHONE}&text=Мене цікавить: ${item.name}" style="flex:1; background:#7360f2; color:white; text-decoration:none; padding:5px; border-radius:5px; font-size:12px;">Viber</a>
                <a href="https://wa.me{MY_PHONE}?text=Мене цікавить: ${item.name}" style="flex:1; background:#25d366; color:white; text-decoration:none; padding:5px; border-radius:5px; font-size:12px;">WhatsApp</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.sendOrder = function(id) {
    const p = allProducts.find(x => x.id === id);
    const phone = prompt(`Замовлення: ${p.name}\nЦіна: ${p.price} грн\n\nВаш номер для зв'язку:`, "+380");
    if (phone && phone.length > 9) alert("Дякуємо! Скоро ми вам зателефонуємо.");
}

loadData();
