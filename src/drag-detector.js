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
            window.addEventListener("mousemove", move, true);
        });
        window.addEventListener("mouseup", (e) => {
            xe = e.screenX;
            ye = e.screenY;
            window.removeEventListener("mousemove", move);
            tail.call(this);
        });
        window.addEventListener("blur", (e) => {
            window.removeEventListener("mousemove", move);
            tail.call(this);
        });

        function move(e) {
            if (e.buttons <= 0) {
                window.dispatchEvent(new Event("mouseup"));
            } else {
                if (Math.abs(e.screenX - xs) < Math.abs(e.screenY - ys)) {
                    if (e.screenY - ys > tolerance) {
                        document.body.setAttribute("data-drag-detector-effect", "down");
                    }
                    if (ys - e.screenY > tolerance) {
                        document.body.setAttribute("data-drag-detector-effect", "up");
                    }
                } else {
                    if (e.screenX - xs > tolerance) {
                        document.body.setAttribute("data-drag-detector-effect", "right");
                    }
                    if (xs - e.screenX > tolerance) {
                        document.body.setAttribute("data-drag-detector-effect", "left");
                    }
                }
            }
        }

        function tail() {
            document.body.removeAttribute("data-drag-detector-effect");
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
