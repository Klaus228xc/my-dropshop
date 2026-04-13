const XML_URL = "https://websklad.biz.ua";
// Используем более надежный прокси для GitHub Pages
const PROXY_URL = "https://allorigins.win";

let allProducts = [];

async function loadData() {
    const grid = document.getElementById('products');
    if (!grid) return;
    grid.innerHTML = "<h2 style='color:white; text-align:center;'>Завантаження товарів Websklad...</h2>";

    try {
        const response = await fetch(PROXY_URL + encodeURIComponent(XML_URL));
        const json = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(json.contents, "text/xml");

        const items = xmlDoc.querySelectorAll("offer");
        allProducts = [];

        items.forEach(item => {
            try {
                allProducts.push({
                    id: item.getAttribute("id"),
                    name: item.querySelector("name")?.textContent || "Без назви",
                    price: item.querySelector("price")?.textContent || "0",
                    picture: item.querySelector("picture")?.textContent || "https://placeholder.com",
                });
            } catch (e) { console.error("Помилка парсингу товару", e); }
        });

        renderProducts(allProducts);

    } catch (error) {
        console.error("Ошибка:", error);
        grid.innerHTML = "<h2 style='color:white;'>Помилка завантаження. Спробуйте оновити сторінку.</h2>";
    }
}

function renderProducts(list) {
    const grid = document.getElementById('products');
    grid.innerHTML = "";
    
    // Показуємо перші 50 товарів для швидкості
    list.slice(0, 50).forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${p.picture}" alt="${p.name}" style="width:100%; height:200px; object-fit:contain;">
            <h3 style="font-size: 1rem; height: 3rem; overflow: hidden;">${p.name}</h3>
            <p class="price">${p.price} грн</p>
            <button onclick="addToCart('${p.id}', '${p.name.replace(/'/g, "")}', ${p.price})">Купити</button>
        `;
        grid.appendChild(card);
    });
}

function addToCart(id, name, price) {
    alert("Товар додано в кошик: " + name);
}

loadData();
