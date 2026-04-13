window.checkoutOrder = () => {
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const city = document.getElementById('orderCity').value;
    const postOffice = document.getElementById('orderPost').value;

    if (cart.length === 0) return alert("Кошик порожній!");
    if (!name || !phone || !city || !postOffice) {
        return alert("Будь ласка, заповніть всі поля для доставки!");
    }

    // Формируем текст сообщения
    let text = `📦 НОВЕ ЗАМОВЛЕННЯ!\n`;
    text += `━━━━━━━━━━━━━━━\n`;
    text += `👤 Клієнт: ${name}\n`;
    text += `📞 Тел: ${phone}\n`;
    text += `📍 Місто: ${city}\n`;
    text += `📮 Відділення: ${postOffice}\n`;
    text += `━━━━━━━━━━━━━━━\n`;
    text += `🛒 ТОВАРИ:\n`;
    
    cart.forEach((item, i) => {
        text += `${i + 1}. ${item.name} — ${item.price} грн\n`;
    });
    
    text += `━━━━━━━━━━━━━━━\n`;
    text += `💰 ЗАГАЛЬНА СУМА: ${document.getElementById('cartTotalSum').innerText} грн`;

    // Отправляем в WhatsApp
    const url = `https://wa.me{MY_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
};
