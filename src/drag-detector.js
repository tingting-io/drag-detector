window.customElements.define('drag-detector', class extends window.HTMLElement {
    constructor() {
        super();
        this.xs = 0;
        this.ys = 0;
        this.xe = 0;
        this.ye = 0;
        this.tolerance = parseFloat(this.getAttribute("data-tolerance")) || 10;
    }
    connectedCallback() {
        let self = this;
        self.mousedown = function(e) {
            e.stopPropagation();
            e.preventDefault();
            self.xs = e.screenX;
            self.ys = e.screenY;
            window.addEventListener("mousemove", self.mousemove);
        }
        self.mouseup = function(e) {
            e.stopPropagation();
            e.preventDefault();
            self.xe = e.screenX;
            self.ye = e.screenY;
            window.removeEventListener("mousemove", self.mousemove);
            self.tail();
        }
        self.mousemove = function(e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.buttons <= 0) {
                window.dispatchEvent(new Event("mouseup"));
            } else {
                if (Math.abs(e.screenX - self.xs) < Math.abs(e.screenY - self.ys)) {
                    if (e.screenY - self.ys > self.tolerance) {
                        document.body.setAttribute("data-drag-detector-effect", "down");
                    }
                    if (self.ys - e.screenY > self.tolerance) {
                        document.body.setAttribute("data-drag-detector-effect", "up");
                    }
                } else {
                    if (e.screenX - self.xs > self.tolerance) {
                        document.body.setAttribute("data-drag-detector-effect", "right");
                    }
                    if (self.xs - e.screenX > self.tolerance) {
                        document.body.setAttribute("data-drag-detector-effect", "left");
                    }
                }
            }
        }
        self.blur = function(e) {
            e.stopPropagation();
            e.preventDefault();
            window.removeEventListener("mousemove", self.mousemove);
            self.tail();
        }
        self.tail = function() {
            document.body.removeAttribute("data-drag-detector-effect");
            if (Math.abs(self.xe - self.xs) < Math.abs(self.ye - self.ys)) {
                if (self.ye - self.ys > self.tolerance) {
                    self.dispatchEvent(new CustomEvent("down", { detail: { distance: self.ye - self.ys } }));
                }
                if (self.ys - self.ye > self.tolerance) {
                    self.dispatchEvent(new CustomEvent("up", { detail: { distance: self.ys - self.ye } }));
                }
            } else {
                if (self.xe - self.xs > self.tolerance) {
                    self.dispatchEvent(new CustomEvent("right", { detail: { distance: self.xe - self.xs } }));
                }
                if (self.xs - self.xe > self.tolerance) {
                    self.dispatchEvent(new CustomEvent("left", { detail: { distance: self.xs - self.xe } }));
                }
            }
        }
        window.addEventListener("mousedown", this.mousedown);
        window.addEventListener("mouseup", this.mouseup);
        window.addEventListener("blur", this.blur);
    }
    disconnectedCallback() {
        window.removeEventListener("mousedown", this.mousedown);
        window.removeEventListener("mouseup", this.mouseup);
        window.removeEventListener("blur", this.blur);
    }
});
