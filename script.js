const XML_URL = "https://websklad.biz.ua";
const PROXY = "https://allorigins.win";

// ВСТАВЬ СВОЙ НОМЕР ТЕЛЕФОНА (без знака +)
const MY_PHONE = "380998261128"; 
const MARGIN = 1.2; // Твоя наценка 20%

let allProducts = [];
let cart = [];

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

        allProducts = Array.from(offers).map(offer => {
            const rawPrice = parseFloat(offer.querySelector("price")?.textContent || 0);
            return {
                id: offer.getAttribute("id"),
                name: (offer.querySelector("name")?.textContent || "Без назви").replace(/['"«»]/g, ""),
                price: Math.round(rawPrice * MARGIN),
                picture: offer.querySelector("picture")?.textContent || ""
            };
        });
        render(allProducts);
    } catch (err) {
        console.error(err);
        grid.innerHTML = "<h2 style='color:red; text-align:center; width:100%;'>Помилка завантаження. Натисніть CTRL+F5</h2>";
    }
}

function render(items) {
    const grid = document.getElementById('products');
    grid.innerHTML = "";
    items.slice(0, 80).forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.picture}" loading="lazy" onerror="this.src='https://placeholder.com'">
            <h3>${item.name}</h3>
            <p class="price">${item.price} грн</p>
            <button class="buy-btn" onclick="addToCart('${item.id}')">В кошик</button>
        `;
        grid.appendChild(card);
    });
}

// ПОИСК
window.searchProducts = (q) => {
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    render(filtered);
};

// КОРЗИНА (Логика)
window.addToCart = (id) => {
    const product = allProducts.find(p => p.id === id);
    if (product) {
        cart.push(product);
        document.getElementById('cartCountGlobal').innerText = cart.length;
        alert(`✅ ${product.name} додано в кошик!`);
    }
};

window.toggleCartModal = () => {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('hidden');
    
    const list = document.getElementById('cartItemsList');
    let total = 0;
    list.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `<div style="display:flex; justify-content:space-between; color:white; margin: 10px 0; border-bottom: 1px solid #334155; padding-bottom: 5px;">
            <span style="font-size:12px; max-width:70%; text-align:left;">${item.name}</span> 
            <b>${item.price} грн</b>
        </div>`;
    }).join('');
    document.getElementById('cartTotalSum').innerText = total;
};

window.checkoutOrder = () => {
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    
    if (cart.length === 0) return alert("Кошик порожній!");
    if (!name || !phone) return alert("Будь ласка, введіть Ваше ім'я та телефон!");

    let text = `👋 НОВЕ ЗАМОВЛЕННЯ!\n👤 Клієнт: ${name}\n📞 Тел: ${phone}\n\n🛒 ТОВАРИ:\n`;
    cart.forEach((item, i) => text += `${i+1}. ${item.name} - ${item.price} грн\n`);
    text += `\n💰 РАЗОМ: ${document.getElementById('cartTotalSum').innerText} грн`;

    window.open(`https://wa.me{MY_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
};

loadData();
