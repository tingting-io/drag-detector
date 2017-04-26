window.customElements.define('drag-detector', class extends window.HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const tolerance = parseFloat(this.getAttribute("data-tolerance")) || 10;
        let xs = 0;
        let xe = 0;
        let ys = 0;
        let ye = 0;
        window.addEventListener("mousedown", (e) => {
            xs = e.screenX;
            ys = e.screenY;
            document.body.classList.add("drag-detector-grab");
        });
        window.addEventListener("mouseup", (e) => {
            xe = e.screenX;
            ye = e.screenY;
            tail.call(this);
            document.body.classList.remove("drag-detector-grab");
        });

        function move(e) {
            if (Math.abs(e.screenX - xs) < Math.abs(e.screenY - ys)) {
                if (e.screenY - ys > tolerance) {
                    document.body.style.cursor = "s-resize";
                }
                if (ys - e.screenY > tolerance) {
                    document.body.style.cursor = "n-resize";
                }
            } else {
                if (e.screenX - xs > tolerance) {
                    document.body.style.cursor = "e-resize";
                }
                if (xs - e.screenX > tolerance) {
                    document.body.style.cursor = "w-resize";
                }
            }
        }

        function tail() {
            if (Math.abs(xe - xs) < Math.abs(ye - ys)) {
                if (ye - ys > tolerance) {
                    this.dispatchEvent(new CustomEvent("down", { detail: { distance: ye - ys } }));
                }
                if (ys - ye > tolerance) {
                    this.dispatchEvent(new CustomEvent("up", { detail: { distance: ys - ye } }));
                }
            } else {
                if (xe - xs > tolerance) {
                    this.dispatchEvent(new CustomEvent("right", { detail: { distance: xe - xs } }));
                }
                if (xs - xe > tolerance) {
                    this.dispatchEvent(new CustomEvent("left", { detail: { distance: xs - xe } }));
                }
            }
        }
    }
});
