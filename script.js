// URL на локальний файл (після того, як ви збережете products.xml)
const XML_URL = "products.xml";

// Функція завантаження та відображення товарів
async function loadAndDisplayProducts() {
    const container = document.getElementById("products-container");
    if (!container) {
        console.error("Не знайдено контейнер #products-container");
        return;
    }

    // Показуємо повідомлення про завантаження
    container.innerHTML = "<p>Завантаження товарів...</p>";

    try {
        const response = await fetch(XML_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        // Перевірка на помилки парсингу XML
        const parseError = xmlDoc.querySelector("parsererror");
        if (parseError) {
            throw new Error("Помилка парсингу XML: " + parseError.textContent);
        }

        // Отримуємо всі товари (приклад: шукаємо елементи <offer> або <product>)
        // У вашому XML може бути інша структура. Спробуємо знайти <offer>
        let items = xmlDoc.querySelectorAll("offer");
        if (items.length === 0) {
            // Якщо немає offer, спробуймо product
            items = xmlDoc.querySelectorAll("product");
        }
        if (items.length === 0) {
            container.innerHTML = "<p>Товарів не знайдено у XML.</p>";
            return;
        }

        // Генеруємо HTML для товарів
        let html = '<div class="products-grid">';
        items.forEach(item => {
            // Назва товару
            const nameElem = item.querySelector("name");
            const name = nameElem ? nameElem.textContent : "Без назви";

            // Ціна
            const priceElem = item.querySelector("price");
            let price = priceElem ? priceElem.textContent : "0";
            price = parseFloat(price).toFixed(2) + " грн";

            // Зображення
            const imgElem = item.querySelector("picture");
            let imgUrl = imgElem ? imgElem.textContent : "";
            if (!imgUrl) {
                const imgElemAlt = item.querySelector("image");
                imgUrl = imgElemAlt ? imgElemAlt.textContent : "";
            }
            if (imgUrl && !imgUrl.startsWith("http")) {
                imgUrl = "https://www.websklad.biz.ua" + imgUrl; // якщо відносний шлях
            }

            html += `
                <div class="product-card">
                    <img src="${imgUrl || 'placeholder.png'}" alt="${name}" onerror="this.src='placeholder.png'">
                    <h3>${escapeHtml(name)}</h3>
                    <p class="price">${escapeHtml(price)}</p>
                    <button class="buy-btn">Купити</button>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error("Помилка завантаження:", error);
        container.innerHTML = `<p style="color: red;">Не вдалося завантажити товари: ${error.message}. Переконайтеся, що файл <strong>products.xml</strong> лежить поряд зі сторінкою.</p>`;
    }
}

// Допоміжна функція для безпечного виведення тексту
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Запускаємо завантаження після завантаження DOM
document.addEventListener("DOMContentLoaded", loadAndDisplayProducts);
