// script.js
// Пример скрипта для онлайн-оплаты с загрузкой товаров из CSV

document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const cartItems = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    let products = [];      // массив товаров
    let cart = [];          // корзина: { sku, quantity }

    // 1. Загрузка CSV (если файл существует)
    //    либо можно встроить данные из предыдущего экспорта
    async function loadProducts() {
        try {
            const response = await fetch('products.csv'); // путь к вашему CSV
            const csvText = await response.text();
            const rows = csvText.split('\n').slice(1); // пропускаем заголовок
            for (let row of rows) {
                if (!row.trim()) continue;
                // парсим CSV с учётом кавычек (упрощённо)
                const match = row.match(/(".*?"|[^,]*)(,|$)/g);
                if (!match) continue;
                const clean = match.map(m => m.replace(/^,|,$/g, '').replace(/^"|"$/g, '').replace(/""/g, '"'));
                if (clean.length < 10) continue;
                products.push({
                    name: clean[0],
                    name_ua: clean[1],
                    sku: clean[2],
                    drop: parseFloat(clean[5]),
                    rrc: parseFloat(clean[6]),
                    stock: clean[7],
                    img: clean[8],
                    cat: clean[9],
                    subcat: clean[10]
                });
            }
            renderProducts();
        } catch (err) {
            console.error('Ошибка загрузки CSV:', err);
            productsContainer.innerHTML = '<p>Не удалось загрузить товары.</p>';
        }
    }

    // 2. Отображение списка товаров (только для примера – первые 20)
    function renderProducts() {
        if (!productsContainer) return;
        productsContainer.innerHTML = '';
        products.slice(0, 20).forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${prod.img.split(',')[0]}" alt="${prod.name}" width="100">
                <h4>${prod.name}</h4>
                <p>Цена: ${prod.rrc} грн</p>
                <button data-sku="${prod.sku}" class="add-to-cart">В корзину</button>
            `;
            productsContainer.appendChild(card);
        });
        // вешаем обработчики на кнопки "В корзину"
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sku = btn.dataset.sku;
                addToCart(sku);
            });
        });
    }

    // 3. Добавление в корзину
    function addToCart(sku) {
        const existing = cart.find(item => item.sku === sku);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ sku, quantity: 1 });
        }
        updateCartUI();
    }

    // 4. Обновление отображения корзины
    function updateCartUI() {
        if (!cartItems) return;
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const product = products.find(p => p.sku === item.sku);
            if (!product) return;
            const itemTotal = product.rrc * item.quantity;
            total += itemTotal;
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <span>${product.name}</span>
                <span>${item.quantity} x ${product.rrc} грн</span>
                <span>${itemTotal} грн</span>
                <button data-sku="${item.sku}" class="remove-item">❌</button>
            `;
            cartItems.appendChild(row);
        });
        totalPriceSpan.innerText = total.toFixed(2);
        // обработчики удаления
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sku = btn.dataset.sku;
                removeFromCart(sku);
            });
        });
    }

    function removeFromCart(sku) {
        const index = cart.findIndex(item => item.sku === sku);
        if (index !== -1) cart.splice(index, 1);
        updateCartUI();
    }

    // 5. Оформление заказа и онлайн-оплата
    async function checkout() {
        if (cart.length === 0) {
            alert('Корзина пуста');
            return;
        }
        // Собираем данные заказа
        const order = {
            items: cart.map(item => {
                const prod = products.find(p => p.sku === item.sku);
                return {
                    sku: item.sku,
                    name: prod.name,
                    quantity: item.quantity,
                    price: prod.rrc,
                    total: prod.rrc * item.quantity
                };
            }),
            total: parseFloat(totalPriceSpan.innerText)
        };

        // Здесь должна быть интеграция с платёжной системой.
        // Пример для LiqPay (https://www.liqpay.ua/documentation)
        // Для теста используем фиктивный запрос.
        try {
            // Показываем индикатор загрузки
            checkoutBtn.disabled = true;
            checkoutBtn.innerText = 'Обработка...';

            // Имитация отправки на сервер и получения ссылки на оплату
            const paymentResponse = await fakePaymentRequest(order);
            if (paymentResponse.success && paymentResponse.paymentUrl) {
                // Перенаправляем на платёжную страницу
                window.location.href = paymentResponse.paymentUrl;
            } else {
                alert('Ошибка инициализации платежа');
            }
        } catch (err) {
            alert('Ошибка: ' + err.message);
        } finally {
            checkoutBtn.disabled = false;
            checkoutBtn.innerText = 'Оплатить онлайн';
        }
    }

    // Имитация запроса к серверу (замените на реальный вызов вашего бэкенда)
    function fakePaymentRequest(order) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // В реальности здесь сервер создаёт платёж в системе LiqPay/Fondy и возвращает URL
                resolve({
                    success: true,
                    paymentUrl: 'https://demo.liqpay.ua/?order_id=123&amount=' + order.total
                });
            }, 1000);
        });
    }

    // Реальная интеграция с LiqPay (пример):
    async function liqPayCheckout(order) {
        const response = await fetch('/api/create-liqpay-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: order.total,
                description: `Оплата замовлення ${Date.now()}`,
                order_id: 'ORDER_' + Date.now(),
                currency: 'UAH',
                products: order.items
            })
        });
        const data = await response.json();
        if (data.data && data.data.checkout_url) {
            window.location.href = data.data.checkout_url;
        } else {
            throw new Error('Не вдалося створити платіж');
        }
    }

    // Вешаем обработчик на кнопку оплаты
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    // Запускаем загрузку товаров
    loadProducts();
});
