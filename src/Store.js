export class Store {
    #items = [];

    constructor(items = []) {
        items.forEach(item => this.add(item));
    }

    add(item) {
        const product = {
            name: item.name.trim(),
            price: Number(item.price),
            qty: Number(item.qty)
        };

        this.#items.push(product);
    }

    remove(index) {
        this.#items.splice(index, 1);
    }

    changeQty(index, change) {
        const product = this.#items[index];

        if (!product) {
            return;
        }

        product.qty += change;

        if (product.qty < 1) {
            product.qty = 1;
        }
    }

    getItems() {
        return this.#items.map(item => ({ ...item }));
    }

    total() {
        return this.#items.reduce((sum, { price, qty }) => {
            return sum + price * qty;
        }, 0);
    }
}