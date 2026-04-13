const XML_URL = "https://websklad.biz.ua";
// Используем альтернативный прокси (он более стабилен)
const PROXY = "https://allorigins.win";

let allProducts = [];

async function loadData() {
    const grid = document.getElementById('products');
    if (!grid) return;
    grid.innerHTML = "<h2 style='text-align:center; width:100%; color:white;'>Завантаження...</h2>";

    try {
        const response = await fetch(PROXY + encodeURIComponent(XML_URL));
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");

        const offers = xml.querySelectorAll("offer");
        if (offers.length === 0) throw new Error('No offers found');

        allProducts = Array.from(offers).map(offer => ({
            id: offer.getAttribute("id"),
            name: (offer.querySelector("name")?.textContent || "Без назви").replace(/['"«»]/g, ""), 
            price: offer.querySelector("price")?.textContent || "0",
            picture: offer.querySelector("picture")?.textContent || "",
        }));

        render(allProducts);
    } catch (err) {
        console.error(err);
        grid.innerHTML = "<h2 style='color:red; text-align:center; width:100%;'>Помилка завантаження XML. <br> Будь ласка, натисніть CTRL+F5</h2>";
    }
}

function render(items) {
    const grid = document.getElementById('products');
    grid.innerHTML = "";
    items.slice(0, 60).forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.picture}" alt="${item.name}" loading="lazy" onerror="this.src='https://placeholder.com'">
            <h3>${item.name}</h3>
            <p class="price">${item.price} грн</p>
            <button class="buy" onclick="sendOrder('${item.id}')">Купити</button>
        `;
        grid.appendChild(card);
    });
}

window.sendOrder = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    const phone = prompt(`Замовлення: ${product.name}\n\nВведіть ваш номер телефону:`, "+380");
    
    if (phone && phone.length > 9) {
        // Здесь твоя логика отправки в Telegram
        alert("Замовлення прийнято! Менеджер зв'яжеться з вами.");
    }
}

loadData();
