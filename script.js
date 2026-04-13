const XML_URL = "https://websklad.biz.ua";
const PROXY = "https://allorigins.win";

const MY_PHONE = "380998261128"; // ТВОЙ НОМЕР ТЕЛЕФОНА
const MARGIN = 1.2; // Наценка 20%

let allProducts = [];
let cart = [];

async function loadData() {
    const grid = document.getElementById('products');
    grid.innerHTML = "<h2 style='text-align:center; width:100%; color:white;'>Завантаження товарів...</h2>";
    try {
        const response = await fetch(PROXY + encodeURIComponent(XML_URL));
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const offers = xml.querySelectorAll("offer");

        allProducts = Array.from(offers).map(offer => {
            const rawPrice = parseFloat(offer.querySelector("price")?.textContent || 0);
            return {
                id: offer.getAttribute("id"),
                name: (offer.querySelector("name")?.textContent || "Товар").replace(/['"«»]/g, ""),
                price: Math.round(rawPrice * MARGIN),
                picture: offer.querySelector("picture")?.textContent || ""
            };
        });
        render(allProducts);
    } catch (e) {
        grid.innerHTML = "<h2 style='color:red; text-align:center; width:100%;'>Помилка. Натисніть CTRL+F5</h2>";
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

window.searchProducts = (q) => {
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    render(filtered);
};

window.addToCart = (id) => {
    const product = allProducts.find(p => p.id === id);
    cart.push(product);
    document.getElementById('cartCountGlobal').innerText = cart.length;
    alert("Додано!");
};

window.toggleCartModal = () => {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('hidden');
    const list = document.getElementById('cartItemsList');
    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price;
        return `<div style="display:flex; justify-content:space-between; color:white; margin: 5px 0;">
            <span>${item.name}</span> <b>${item.price} грн</b>
        </div>`;
    }).join('');
    document.getElementById('cartTotalSum').innerText = total;
};

window.checkoutOrder = () => {
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    if (!name || !phone) return alert("Будь ласка, введіть контакти!");

    let text = `👋 Нове замовлення!\n👤 Клієнт: ${name}\n📞 Тел: ${phone}\n\n🛒 Товари:\n`;
    cart.forEach((item, i) => text += `${i+1}. ${item.name} - ${item.price}грн\n`);
    text += `\n💰 Разом: ${document.getElementById('cartTotalSum').innerText} грн`;

    window.open(`https://wa.me{MY_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
};

loadData();
