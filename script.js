<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>WebSklad Вітрина</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #f5f5f5;
            padding-bottom: 80px;
        }

        /* Шапка */
        .header {
            background: #1e3c2c;
            color: white;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 12px rgba(0,0,0,0.2);
            flex-wrap: wrap;
            gap: 10px;
        }

        .logo h1 {
            font-size: 1.3rem;
            letter-spacing: 1px;
        }
        .logo p {
            font-size: 0.7rem;
            opacity: 0.8;
        }

        .search-area {
            display: flex;
            gap: 8px;
            background: white;
            padding: 4px 8px;
            border-radius: 40px;
            flex: 1;
            max-width: 300px;
        }
        .search-area input {
            border: none;
            padding: 8px 10px;
            border-radius: 40px;
            outline: none;
            width: 100%;
            font-size: 0.9rem;
        }
        .search-area button {
            background: #ff9800;
            border: none;
            padding: 0 14px;
            border-radius: 40px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
        }
        .search-area button:hover {
            background: #e68900;
        }

        .cart-icon {
            background: #ff5722;
            padding: 8px 16px;
            border-radius: 40px;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: 0.2s;
        }
        .cart-icon:hover {
            background: #e64a19;
        }
        .cart-count {
            background: white;
            color: #1e3c2c;
            border-radius: 30px;
            padding: 0px 8px;
            font-weight: bold;
            font-size: 0.9rem;
        }

        /* Сетка товаров */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 20px;
            padding: 24px 20px;
            max-width: 1400px;
            margin: 0 auto;
        }

        /* Карточка */
        .card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 20px rgba(0,0,0,0.15);
        }
        .card img {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: contain;
            background: #fafafa;
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        .card h3 {
            font-size: 1rem;
            padding: 12px 12px 6px 12px;
            font-weight: 600;
            color: #222;
            line-height: 1.3;
            min-height: 60px;
        }
        .price {
            font-size: 1.5rem;
            font-weight: 800;
            color: #1e3c2c;
            padding: 0 12px;
            margin: 8px 0;
        }
        .buy-btn {
            background: #1e3c2c;
            color: white;
            border: none;
            margin: 12px;
            padding: 12px;
            border-radius: 40px;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            transition: 0.2s;
            margin-top: auto;
        }
        .buy-btn:hover {
            background: #2b5a42;
        }

        /* Модалка корзины */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(3px);
        }
        .modal.hidden {
            display: none;
        }
        .modal-content {
            background: #1e2a24;
            width: 90%;
            max-width: 500px;
            max-height: 85vh;
            border-radius: 32px;
            padding: 20px;
            color: white;
            overflow-y: auto;
            box-shadow: 0 20px 35px rgba(0,0,0,0.5);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #ff9800;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .close-modal {
            font-size: 28px;
            cursor: pointer;
            background: none;
            border: none;
            color: white;
            font-weight: bold;
        }
        .cart-items-list {
            max-height: 40vh;
            overflow-y: auto;
            margin-bottom: 20px;
            background: #2a3a32;
            border-radius: 20px;
            padding: 8px;
        }
        .delivery-fields input {
            width: 100%;
            padding: 12px;
            margin: 8px 0;
            border-radius: 30px;
            border: none;
            background: #f0f0f0;
            font-size: 0.9rem;
        }
        .total-row {
            font-size: 1.4rem;
            font-weight: bold;
            text-align: right;
            margin: 15px 0;
            border-top: 1px solid #ff9800;
            padding-top: 12px;
        }
        .checkout-btn {
            background: #25D366;
            color: black;
            font-weight: bold;
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 40px;
            font-size: 1.1rem;
            cursor: pointer;
            margin-top: 8px;
        }
        .empty-cart {
            text-align: center;
            padding: 30px;
            color: #ccc;
        }

        footer {
            text-align: center;
            padding: 20px;
            color: #555;
            font-size: 0.8rem;
        }
        @media (max-width: 640px) {
            .products-grid {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 12px;
                padding: 16px;
            }
            .header {
                flex-direction: column;
                align-items: stretch;
            }
            .search-area {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>

<div class="header">
    <div class="logo">
        <h1>📦 WebSklad Вітрина</h1>
        <p>гуртовий прайс + націнка</p>
    </div>
    <div class="search-area">
        <input type="text" id="searchInput" placeholder="🔍 Пошук товару..." onkeyup="searchDelayed(event)">
        <button onclick="searchNow()">Знайти</button>
    </div>
    <div class="cart-icon" onclick="toggleCartModal()">
        🛒 Кошик <span class="cart-count" id="cartCountGlobal">0</span>
    </div>
</div>

<div class="products-grid" id="products">
    <!-- товары загрузятся сюда -->
    <div style="grid-column:1/-1; text-align:center; padding:40px;">Завантаження асортименту...</div>
</div>
<footer>⚡ Натисніть CTRL+F5 якщо товари не з'явились</footer>

<!-- Модалка корзины -->
<div id="cartModal" class="modal hidden">
    <div class="modal-content">
        <div class="modal-header">
            <h2>🛒 Ваш кошик</h2>
            <button class="close-modal" onclick="toggleCartModal()">&times;</button>
        </div>
        <div id="cartItemsList" class="cart-items-list">
            <div class="empty-cart">Кошик порожній</div>
        </div>
        <div class="delivery-fields">
            <input type="text" id="orderName" placeholder="👤 Ваше ПІБ" autocomplete="off">
            <input type="tel" id="orderPhone" placeholder="📞 Телефон (0501234567)" autocomplete="off">
            <input type="text" id="orderCity" placeholder="🏙️ Місто / Населений пункт" autocomplete="off">
            <input type="text" id="orderPost" placeholder="📮 Номер відділення Нової Пошти" autocomplete="off">
        </div>
        <div class="total-row">
            💰 Загалом: <span id="cartTotalSum">0</span> грн
        </div>
        <button class="checkout-btn" onclick="checkoutOrder()">📲 Підтвердити замовлення (WhatsApp)</button>
    </div>
</div>

<script>
    // ---------- КОНФІГУРАЦІЯ (можна змінити твій номер) ----------
    const XML_URL = "https://websklad.biz.ua";
    const PROXY = "https://api.allorigins.win/raw?url=";   // кращий варіант для отримання сирого тексту
    const MY_PHONE = "380XXXXXXXXX";   // 🔁 ЗАМІНІТЬ НА СВІЙ НОМЕР (без плюса)
    const MARGIN = 1.2;
    
    // глобальні змінні
    let allProducts = [];
    let cart = [];
    let searchTimeout = null;

    // ---------- ОСНОВНЕ ЗАВАНТАЖЕННЯ ----------
    async function loadData() {
        const grid = document.getElementById('products');
        if (!grid) return;
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:#1e3c2c;">🔄 Оновлення вітрини... зачекайте</div>`;

        try {
            // Використовуємо allorigins в режимі raw – отримуємо просто текст XML
            const response = await fetch(`${PROXY}${encodeURIComponent(XML_URL)}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const xmlText = await response.text();
            
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "text/xml");
            
            // Перевірка на помилки парсингу
            const parseError = xml.querySelector("parsererror");
            if (parseError) throw new Error("Помилка формату XML");
            
            const offers = xml.querySelectorAll("offer");
            if (offers.length === 0) throw new Error("Немає жодного offer в XML");
            
            allProducts = Array.from(offers).map(offer => {
                let rawPrice = parseFloat(offer.querySelector("price")?.textContent || "0");
                if (isNaN(rawPrice)) rawPrice = 0;
                // чистимо назву від зайвих лапок, але лишаємо читабельною
                let nameRaw = offer.querySelector("name")?.textContent || "Без назви";
                nameRaw = nameRaw.replace(/['"`«»]/g, "").trim();
                
                let pictureUrl = offer.querySelector("picture")?.textContent || "";
                // якщо картинка відносна – пробуємо домислити, але в більшості абсолютна
                if (pictureUrl && !pictureUrl.startsWith("http")) {
                    // деякі постачальники віддають відносні шляхи, але websklad.biz.ua має абсолютні
                    pictureUrl = "https://websklad.biz.ua" + (pictureUrl.startsWith("/") ? pictureUrl : "/" + pictureUrl);
                }
                
                return {
                    id: offer.getAttribute("id") || crypto.randomUUID(),
                    name: nameRaw,
                    price: Math.round(rawPrice * MARGIN),
                    picture: pictureUrl || "https://via.placeholder.com/300x300?text=Немає+фото",
                };
            });
            
            // Відсіюємо товари з нульовою ціною (опціонально)
            // allProducts = allProducts.filter(p => p.price > 0);
            render(allProducts);
            
        } catch (err) {
            console.error("Помилка завантаження:", err);
            const grid = document.getElementById('products');
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:#c62828;">
                ❌ Помилка завантаження вітрини.<br>
                🔄 Перевірте з'єднання або натисніть <b>CTRL + F5</b><br>
                <small>${err.message}</small>
            </div>`;
        }
    }

    // відображення товарів (максимум 60, але можна показати більше)
    function render(items) {
        const grid = document.getElementById('products');
        if (!grid) return;
        grid.innerHTML = "";
        if (!items.length) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px;">😞 Товарів не знайдено</div>`;
            return;
        }
        // показуємо всі знайдені, але щоб не перевантажувати сторінку – максимум 80 (за бажанням)
        const toShow = items.slice(0, 80);
        toShow.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            // використовуємо data-id для надійності
            card.setAttribute('data-id', item.id);
            card.innerHTML = `
                <img src="${item.picture}" alt="${item.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=Фото+немає'">
                <h3>${escapeHtml(item.name)}</h3>
                <p class="price">${item.price.toLocaleString()} грн</p>
                <button class="buy-btn" data-id="${item.id}">➕ В кошик</button>
            `;
            const btn = card.querySelector('.buy-btn');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCartById(item.id);
            });
            grid.appendChild(card);
        });
    }

    // безпечне додавання в кошик
    function addToCartById(id) {
        const product = allProducts.find(p => p.id == id);
        if (product) {
            cart.push(product);
            updateCartCounter();
            showTemporaryToast(`✓ ${product.name.substring(0, 35)} додано`);
        } else {
            console.warn("Товар не знайдено", id);
        }
    }

    function updateCartCounter() {
        const counterSpan = document.getElementById('cartCountGlobal');
        if (counterSpan) counterSpan.innerText = cart.length;
    }
    
    // просте сповіщення
    function showTemporaryToast(msg) {
        let toast = document.getElementById('dynamic-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'dynamic-toast';
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = '#1e3c2c';
            toast.style.color = 'white';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '50px';
            toast.style.zIndex = '2000';
            toast.style.fontWeight = 'bold';
            toast.style.boxShadow = '0 4px 12px black';
            toast.style.fontSize = '14px';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
        }, 1800);
    }

    // глобальна функція модалки
    window.toggleCartModal = () => {
        const modal = document.getElementById('cartModal');
        if (!modal) return;
        const isHidden = modal.classList.contains('hidden');
        if (!isHidden) {
            modal.classList.add('hidden');
            return;
        }
        // Відкриваємо та оновлюємо вміст
        const listDiv = document.getElementById('cartItemsList');
        let total = 0;
        if (!cart.length) {
            listDiv.innerHTML = '<div class="empty-cart">🛒 Кошик порожній</div>';
            document.getElementById('cartTotalSum').innerText = "0";
        } else {
            listDiv.innerHTML = cart.map((item, idx) => {
                total += item.price;
                return `<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 6px; border-bottom:1px solid #4a5e54; gap:8px;">
                    <span style="font-size:0.85rem; flex:2;">${escapeHtml(item.name)}</span>
                    <span style="font-weight:bold; min-width:70px; text-align:right;">${item.price} грн</span>
                    <button class="remove-item-btn" data-cart-index="${idx}" style="background:#d32f2f; border:none; color:white; border-radius:30px; width:28px; height:28px; font-weight:bold; cursor:pointer;">🗑</button>
                </div>`;
            }).join('');
            document.getElementById('cartTotalSum').innerText = total;
            // додаємо обробники для кнопок видалення
            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(btn.getAttribute('data-cart-index'));
                    if (!isNaN(idx) && idx >= 0 && idx < cart.length) {
                        cart.splice(idx, 1);
                        updateCartCounter();
                        // перевідкриваємо модалку для оновлення списку
                        toggleCartModal(); // закриємо поточну
                        setTimeout(() => toggleCartModal(), 50); // знову відкриємо оновлену
                    }
                });
            });
        }
        modal.classList.remove('hidden');
    };
    
    // функція відправки замовлення
    window.checkoutOrder = () => {
        const name = document.getElementById('orderName')?.value.trim();
        const phone = document.getElementById('orderPhone')?.value.trim();
        const city = document.getElementById('orderCity')?.value.trim();
        const post = document.getElementById('orderPost')?.value.trim();
        
        if (!name) return alert("Вкажіть ваше ім'я");
        if (!phone) return alert("Вкажіть номер телефону");
        if (!city) return alert("Вкажіть місто");
        if (!post) return alert("Вкажіть номер відділення Нової Пошти");
        if (cart.length === 0) return alert("Кошик порожній! Додайте товари.");
        
        let totalSum = 0;
        let itemsText = "";
        cart.forEach((item, i) => {
            totalSum += item.price;
            itemsText += `${i+1}. ${item.name.substring(0, 60)} - ${item.price} грн\n`;
        });
        
        let orderMessage = `📦 *НОВЕ ЗАМОВЛЕННЯ* 📦\n\n` +
                           `👤 Ім'я: ${name}\n` +
                           `📞 Телефон: ${phone}\n` +
                           `📍 Місто: ${city}\n` +
                           `🏢 Відділення НП: ${post}\n\n` +
                           `🛒 *Товари:*\n${itemsText}\n` +
                           `💰 *Загальна сума: ${totalSum} грн*\n\n` +
                           `Дякуємо за покупку!`;
        
        const whatsappUrl = `https://wa.me/${MY_PHONE}?text=${encodeURIComponent(orderMessage)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    // Пошук з затримкою
    window.searchDelayed = (event) => {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = document.getElementById('searchInput')?.value || "";
            searchProducts(query);
        }, 400);
    };
    
    window.searchNow = () => {
        const query = document.getElementById('searchInput')?.value || "";
        searchProducts(query);
    };
    
    function searchProducts(query) {
        if (!query.trim()) {
            render(allProducts);
            return;
        }
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        render(filtered);
    }
    
    // простий захист від XSS
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
            return c;
        });
    }
    
    // старий addToCart глобальний (на випадок якщо використовується з inline)
    window.addToCart = (id) => {
        addToCartById(id);
    };
    
    // запуск завантаження
    loadData();
</script>
</body>
</html>
