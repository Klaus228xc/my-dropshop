const XML_URL = "https://websklad.biz.ua";
const PROXY = "https://allorigins.win";

const MY_PHONE = "380998261128"; // ТВОЙ НОМЕР БЕЗ ПЛЮСА
const MARGIN = 1.2; 

let allProducts = [];
let cart = [];

async function loadData() {
    const grid = document.getElementById('products');
    if (!grid) return;
    grid.innerHTML = "<h2 style='text-align:center; width:100%; color:white;'>Оновлення вітрини...</h2>";

    try {
        const response = await fetch(PROXY + encodeURIComponent(XML_URL));
        const data = await response.json();
        
        // Исправление: берем данные из data.contents
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const offers = xml.querySelectorAll("offer");

        if (offers.length === 0) throw new Error("XML пустой");

        allProducts = Array.from(offers).map(offer => {
            const rawPrice = parseFloat(offer.querySelector("price")?.textContent || 0);
            return {
                id: offer.getAttribute("id"),
                name: (offer.querySelector("name")?.textContent || "Товар").replace(/['"«»]/g, ""), 
                price: Math.round(rawPrice * MARGIN),
                picture: offer.querySelector("picture")?.textContent || "",
            };
        });

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
            <button class="buy-btn" onclick="addToCart('${item.id}')">В кошик</button>
        `;
        grid.appendChild(card);
    });
}

window.addToCart = (id) => {
    const p = allProducts.find(x => x.id === id);
    if (p) {
        cart.push(p);
        document.getElementById('cartCountGlobal').innerText = cart.length;
        alert(`Додано: ${p.name}`);
    }
};

window.toggleCartModal = () => {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('hidden');
    
    const list = document.getElementById('cartItemsList');
    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price;
        return `<div style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid #333; color:white;">
            <span style="font-size:12px; text-align:left; max-width:70%;">${item.name}</span> <b>${item.price} грн</b>
        </div>`;
    }).join('');
    document.getElementById('cartTotalSum').innerText = total;
};

window.checkoutOrder = () => {
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const city = document.getElementById('orderCity').value;
    const post = document.getElementById('orderPost').value;

    if (!name || !phone || !city || !post) return alert("Заповніть всі поля доставки!");

    let text = `📦 ЗАМОВЛЕННЯ!\n👤 Клієнт: ${name}\n📞 Тел: ${phone}\n📍 ${city}, Відділення №${post}\n\n🛒 Товари:\n`;
    cart.forEach((item, i) => text += `${i+1}. ${item.name} - ${item.price}грн\n`);
    text += `\n💰 РАЗОМ: ${document.getElementById('cartTotalSum').innerText} грн`;

    window.open(`https://wa.me{MY_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
};

window.searchProducts = (q) => {
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    render(filtered);
};

loadData();
