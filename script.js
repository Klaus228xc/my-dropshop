const XML_URL = "https://websklad.biz.ua";
const PROXY = "https://allorigins.win";

const MY_PHONE = "380998261128"; // ТВОЙ НОМЕР БЕЗ +
const MARGIN = 1.2; 

let allProducts = [];
let cart = [];

async function loadData() {
    const grid = document.getElementById('products');
    grid.innerHTML = "<h2>Завантаження...</h2>";
    try {
        const response = await fetch(PROXY + encodeURIComponent(XML_URL));
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const offers = xml.querySelectorAll("offer");

        allProducts = Array.from(offers).map(offer => ({
            id: offer.getAttribute("id"),
            name: (offer.querySelector("name")?.textContent || "Товар").replace(/['"«»]/g, ""),
            price: Math.round(parseFloat(offer.querySelector("price")?.textContent || 0) * MARGIN),
            picture: offer.querySelector("picture")?.textContent || ""
        }));
        render(allProducts);
    } catch (e) {
        grid.innerHTML = "Помилка. Натисніть CTRL+F5";
    }
}

function render(items) {
    const grid = document.getElementById('products');
    grid.innerHTML = items.slice(0, 60).map(item => `
        <div class="card">
            <img src="${item.picture}" onerror="this.src='https://placeholder.com'">
            <h3>${item.name}</h3>
            <p class="price">${item.price} грн</p>
            <button class="buy-btn" onclick="addToCart('${item.id}')">В кошик</button>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const product = allProducts.find(p => p.id === id);
    cart.push(product);
    document.getElementById('cartCountGlobal').innerText = cart.length;
    alert("Додано!");
};

window.toggleCartModal = () => {
    document.getElementById('cartModal').classList.toggle('hidden');
    const list = document.getElementById('cartItemsList');
    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price;
        return `<div style="display:flex; justify-content:space-between; margin:10px 0;">
            <span style="font-size:12px;">${item.name}</span> <b>${item.price} грн</b>
        </div>`;
    }).join('');
    document.getElementById('cartTotalSum').innerText = total;
};

window.checkoutOrder = () => {
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const city = document.getElementById('orderCity').value;
    const post = document.getElementById('orderPost').value;

    if (!name || !phone || !city || !post) return alert("Заповніть всі поля!");

    let text = `📦 ЗАМОВЛЕННЯ!\n👤 ${name}\n📞 ${phone}\n📍 ${city}, Відділення №${post}\n\n🛒 Товари:\n`;
    cart.forEach((item, i) => text += `${i+1}. ${item.name} - ${item.price}грн\n`);
    text += `\n💰 РАЗОМ: ${document.getElementById('cartTotalSum').innerText} грн`;

    window.open(`https://wa.me{MY_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
};

window.searchProducts = (q) => {
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    render(filtered);
};

loadData();
