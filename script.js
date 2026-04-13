const XML_URL = "https://websklad.biz.ua";
const PROXY = "https://allorigins.win";

let allProducts = [];

async function loadData() {
    const grid = document.getElementById('products');
    grid.innerHTML = "<h2>Завантаження товарів...</h2>";

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
        grid.innerHTML = "Помилка завантаження. Спробуйте оновити сторінку.";
    }
}

function render(items) {
    const grid = document.getElementById('products');
    grid.innerHTML = "";
    items.slice(0, 50).forEach(item => {
        grid.innerHTML += `
            <div class="card">
                <img src="${item.picture}">
                <h3>${item.name}</h3>
                <p class="price">${item.price} грн</p>
                <button class="buy" onclick="alert('Додано!')">Купити</button>
            </div>
        `;
    });
}

loadData();
