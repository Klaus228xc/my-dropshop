const XML_URL = "https://websklad.biz.ua";
const PROXY = "https://allorigins.win";

const MY_PHONE = "38099861128"; // ЗАМЕНИ НА СВОЙ НОМЕР
const MARGIN = 1.2; 

let allProducts = [];
let cart = [];

async function loadData() {
    const grid = document.getElementById('products');
    if (!grid) return;
    grid.innerHTML = "<h2 style='text-align:center; width:100%; color:white;'>Завантаження товарів...</h2>";

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
        console.error(e);
        grid.innerHTML = "<h2 style='color:red; text-align:center; width:100%;'>Помилка завантаження. Натисніть CTRL+F5</h2>";
    }
}

function render(items) {
    const grid = document.getElementById('products');
    if (!grid) return;
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
    const product = allProducts.find(p => p.id === id);
    if(product) {
        cart.push(product);
        document.getElementById('cartCountGlobal').innerText = cart.length;
        alert("Додано в кошик!");
    }
};

window.toggleCartModal = () => {
    document.getElementById('cartModal').classList.toggle('hidden');
    const list = document.getElementById('cartItemsList');
    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price;
        return `<div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="font-size:12px; text-align:left; max-width:70%;">${item.name}</span> 
            <b>${item.price} грн</b>
        </div>`;
    }).join('');
    document.getElementById('cartTotalSum').innerText = total;
};

window.checkoutOrder = () => {
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const city = document.getElementById('orderCity').value;
    const post = document.getElementById('orderPost').value;

    if (!name || !phone || !city || !post) return alert("Будь ласка, заповніть всі поля доставки!");

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
