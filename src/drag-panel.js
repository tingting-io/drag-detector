window.customElements.define('drag-panel', class extends window.HTMLElement {
    constructor() {
        super();
        this.originX = 0;
        this.originY = 0;
        this.tolerance = parseFloat(this.getAttribute("data-tolerance")) || 10;
    }
    connectedCallback() {
        this.addEventListener("mousedown", this.mousedown, { passive: true });
        this.addEventListener("mouseup", this.mouseup, { passive: true });
        this.addEventListener("mousemove", this.mousemove, { passive: true });
    }
    disconnectedCallback() {
        this.removeEventListener("mousedown", this.mousedown, { passive: true });
        this.removeEventListener("mouseup", this.mouseup, { passive: true });
        this.removeEventListener("mousemove", this.mousemove, { passive: true });
    }
    mousedown(e) {
        e.stopPropagation();
        this.originX = e.screenX;
        this.originY = e.screenY;
    }
    mouseup(e) {
        e.stopPropagation();
        this.tail(e);
    }
    mousemove(e) {
        e.stopPropagation();
        let buttonDown = e.buttons > 0;
        let xNow = Math.abs(e.screenX - this.originX) >= Math.abs(e.screenY - this.originY);
        let rangeDown = e.screenY - this.originY > this.tolerance;
        let rangeUp = this.originY - e.screenY > this.tolerance;
        let rangeRight = e.screenX - this.originX > this.tolerance;
        let rangeLeft = this.originX - e.screenX > this.tolerance;
        switch (true) {
            case buttonDown && xNow && rangeLeft && this.getAttribute("data-direction").indexOf("left") > -1:
                this.setAttribute("data-effect", "left");
                break;
            case buttonDown && xNow && rangeRight && this.getAttribute("data-direction").indexOf("right") > -1:
                this.setAttribute("data-effect", "right");
                break;
            case buttonDown && !xNow && rangeUp && this.getAttribute("data-direction").indexOf("up") > -1:
                this.setAttribute("data-effect", "up");
                break;
            case buttonDown && !xNow && rangeDown && this.getAttribute("data-direction").indexOf("down") > -1:
                this.setAttribute("data-effect", "down");
                break;
            default:
                this.removeAttribute("data-effect");
                break;
        }
    }
    tail(e) {
        switch (this.getAttribute("data-effect")) {
            case "up":
                this.dispatchEvent(new CustomEvent("up", { detail: { distance: this.originY - e.screenY } }));
                break;
            case "down":
                this.dispatchEvent(new CustomEvent("down", { detail: { distance: e.screenY - this.originY } }));
                break;
            case "left":
                this.dispatchEvent(new CustomEvent("left", { detail: { distance: this.originX - e.screenX } }));
                break;
            case "right":
                this.dispatchEvent(new CustomEvent("right", { detail: { distance: e.screenX - this.originX } }));
                break;
        }
        this.removeAttribute("data-effect");
    }
});
