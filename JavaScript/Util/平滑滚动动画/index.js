const smoothScroll = (target) => {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (cb) => {
            setTimeout(cb, 20);
        }
    }
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    const scroll = () => {
        const distance = target - scrollTop;
        scrollTop = scrollTop + distance / 6;
        if (Math.abs(distance) < 1) {
            window.scrollTo(0, target);
        } else {
            window.scrollTo(0, scrollTop);
            window.requestAnimationFrame(scroll);
        }
    }
    scroll();
}