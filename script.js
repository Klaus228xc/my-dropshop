const XML_URL = "https://websklad.biz.ua";
const PROXY = "https://allorigins.win";

// ВСТАВЬ СВОЙ НОМЕР ЗДЕСЬ (без плюса):
const MY_PHONE = "380998261128"; 

let allProducts = [];

async function loadData() {
    const grid = document.getElementById('products');
    if (!grid) return;
    grid.innerHTML = "<h2 style='text-align:center; width:100%; color:white;'>Оновлення товарів...</h2>";

    try {
        const response = await fetch(PROXY + encodeURIComponent(XML_URL));
        const data = await response.json();
        
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const offers = xml.querySelectorAll("offer");

        if (offers.length === 0) throw new Error("XML пустой");

        allProducts = Array.from(offers).map(offer => ({
            id: offer.getAttribute("id"),
            name: (offer.querySelector("name")?.textContent || "Товар").replace(/['"«»]/g, ""), 
            price: offer.querySelector("price")?.textContent || "0",
            picture: offer.querySelector("picture")?.textContent || "",
        }));

        render(allProducts);
    } catch (err) {
        console.error(err);
        grid.innerHTML = "<h2 style='color:red; text-align:center; width:100%;'>Помилка завантаження. <br> Натисніть CTRL + F5</h2>";
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
            <button class="buy-btn" onclick="sendOrder('${item.id}')">Замовити по телефону</button>
            <div class="social-btns">
                <a href="viber://chat?number=${MY_PHONE}&text=Мене цікавить: ${item.name}" class="viber">Viber</a>
                <a href="https://wa.me{MY_PHONE}?text=Мене цікавить: ${item.name}" class="wa">WhatsApp</a>
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
