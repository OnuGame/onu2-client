import "./css/notification.css";

const notificationContainer = document.querySelector("#notifications")!;

export class Notification {
    constructor(public message: string, public duration: number) {}

    show() {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.innerHTML = this.message;
        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.classList.add("shown");
        }, 10);
        setTimeout(() => {
            notification.classList.remove("shown");
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, this.duration);
    }
}
