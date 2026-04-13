const XML_URL = "https://websklad.biz.ua";
const PROXY = "https://allorigins.win";

let allProducts = [];

async function loadData() {
    const grid = document.getElementById('products');
    if (!grid) return; // Защита, если блок еще не создался
    grid.innerHTML = "<h2 style='text-align:center; width:100%;'>Завантаження товарів...</h2>";

    try {
        const response = await fetch(PROXY + encodeURIComponent(XML_URL));
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");

        const offers = xml.querySelectorAll("offer");
        allProducts = Array.from(offers).map(offer => ({
            id: offer.getAttribute("id"),
            name: offer.querySelector("name")?.textContent || "Без назви",
            price: offer.querySelector("price")?.textContent || "0",
            picture: offer.querySelector("picture")?.textContent || "",
        }));

        render(allProducts);
    } catch (err) {
        console.error(err);
        grid.innerHTML = "Помилка завантаження. Спробуйте оновити сторінку.";
    }
}

function render(items) {
    const grid = document.getElementById('products');
    grid.innerHTML = "";
    if (items.length === 0) {
        grid.innerHTML = "Товари не знайдено.";
        return;
    }
    // Берем первые 60 товаров
    items.slice(0, 60).forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.picture}" alt="${item.name}" loading="lazy">
            <h3>${item.name}</h3>
            <p class="price">${item.price} грн</p>
            <button class="buy" onclick="alert('Додано в кошик!')">Купити</button>
        `;
        grid.appendChild(card);
    });
}

// Запуск
loadData();

