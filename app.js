import { Store } from "./src/Store.js";

const store = new Store([
    {
        name: "Клавиатура",
        price: 18000,
        qty: 1
    },
    {
        name: "Мышь",
        price: 9500,
        qty: 2
    },
    {
        name: "Наушники",
        price: 24000,
        qty: 1
    }
]);

const form = document.querySelector("#product-form");
const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const totalPrice = document.querySelector("#total-price");
const emptyMessage = document.querySelector("#empty-message");

const nameError = document.querySelector("#name-error");
const priceError = document.querySelector("#price-error");
const qtyError = document.querySelector("#qty-error");

function formatPrice(value) {
    return new Intl.NumberFormat("ru-RU").format(value) + " ₸";
}

function renderProducts() {
    const products = store.getItems();

    productList.innerHTML = products.map((product, index) => {
        const productTotal = product.price * product.qty;

        return `
            <tr>
                <td>${product.name}</td>
                <td>${formatPrice(product.price)}</td>

                <td>
                    <div class="qty-controls">
                        <button
                            type="button"
                            class="qty-button"
                            data-action="decrease"
                            data-index="${index}"
                            aria-label="Уменьшить количество товара ${product.name}"
                        >
                            −
                        </button>

                        <span>${product.qty}</span>

                        <button
                            type="button"
                            class="qty-button"
                            data-action="increase"
                            data-index="${index}"
                            aria-label="Увеличить количество товара ${product.name}"
                        >
                            +
                        </button>
                    </div>
                </td>

                <td>${formatPrice(productTotal)}</td>

                <td>
                    <button
                        type="button"
                        class="delete-button"
                        data-action="remove"
                        data-index="${index}"
                    >
                        Удалить
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    productCount.textContent = products.length;
    totalPrice.textContent = formatPrice(store.total());
    emptyMessage.hidden = products.length !== 0;
}

function clearErrors() {
    nameError.textContent = "";
    priceError.textContent = "";
    qtyError.textContent = "";
}

function validateProduct(name, price, qty) {
    let isValid = true;

    if (name === "") {
        nameError.textContent = "Введите название товара";
        isValid = false;
    }

    if (!Number.isFinite(price) || price <= 0) {
        priceError.textContent = "Цена должна быть больше нуля";
        isValid = false;
    }

    if (!Number.isInteger(qty) || qty <= 0) {
        qtyError.textContent = "Введите целое количество больше нуля";
        isValid = false;
    }

    return isValid;
}

form.addEventListener("submit", event => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(form);

    const name = formData.get("name").trim();
    const price = Number(formData.get("price"));
    const qty = Number(formData.get("qty"));

    if (!validateProduct(name, price, qty)) {
        return;
    }

    store.add({
        name,
        price,
        qty
    });

    form.reset();
    renderProducts();
});

productList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (action === "remove") {
        store.remove(index);
    }

    if (action === "increase") {
        store.changeQty(index, 1);
    }

    if (action === "decrease") {
        store.changeQty(index, -1);
    }

    renderProducts();
});

renderProducts();