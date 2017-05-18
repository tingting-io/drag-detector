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
        this.addEventListener("touchstart", this.mousedown, { passive: true });
        this.addEventListener("touchend", this.mouseup, { passive: true });
        this.addEventListener("touchmove", this.mousemove, { passive: true });
    }
    disconnectedCallback() {
        this.removeEventListener("mousedown", this.mousedown, { passive: true });
        this.removeEventListener("mouseup", this.mouseup, { passive: true });
        this.removeEventListener("mousemove", this.mousemove, { passive: true });
        this.removeEventListener("touchstart", this.mousedown, { passive: true });
        this.removeEventListener("touchend", this.mouseup, { passive: true });
        this.removeEventListener("touchmove", this.mousemove, { passive: true });
    }
    mousedown(e) {
        e.stopPropagation();
        this.originX = e.screenX || e.touches[0].screenX;
        this.originY = e.screenY || e.touches[0].screenY;
    }
    mouseup(e) {
        e.stopPropagation();
        this.tail(e);
    }
    mousemove(e) {
        e.stopPropagation();
        let screenX = e.screenX || e.touches[0].screenX;
        let screenY = e.screenY || e.touches[0].screenY;
        let buttonDown = e.buttons > 0 || e.touches;
        let xNow = Math.abs(screenX - this.originX) >= Math.abs(screenY - this.originY);
        let rangeDown = screenY - this.originY > this.tolerance;
        let rangeUp = this.originY - screenY > this.tolerance;
        let rangeRight = screenX - this.originX > this.tolerance;
        let rangeLeft = this.originX - screenX > this.tolerance;
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
                this.dispatchEvent(new CustomEvent("up", { detail: { distance: this.originY - screenY } }));
                break;
            case "down":
                this.dispatchEvent(new CustomEvent("down", { detail: { distance: screenY - this.originY } }));
                break;
            case "left":
                this.dispatchEvent(new CustomEvent("left", { detail: { distance: this.originX - screenX } }));
                break;
            case "right":
                this.dispatchEvent(new CustomEvent("right", { detail: { distance: screenX - this.originX } }));
                break;
        }
        this.removeAttribute("data-effect");
    }
});
