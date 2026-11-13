(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !window.IntersectionObserver || !Element.prototype.animate) {
        return;
    }

    var easing = "cubic-bezier(0.16, 1, 0.3, 1)";
    var benefits = document.querySelectorAll('[data-reveal="benefit"]');

    // These elements no longer have Webflow interaction IDs: only one animation
    // controls them, including when reloading halfway down the page.
    benefits.forEach(function (element) {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
    });

    var observer = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (entry) { return entry.isIntersecting; });
        visible.forEach(function (entry, index) {
            var element = entry.target;
            observer.unobserve(element);
            var animation = element.animate([
                { opacity: 0, transform: "translateY(20px)" },
                { opacity: 1, transform: "translateY(0)" }
            ], {
                duration: 850,
                delay: index * 90,
                easing: easing,
                fill: "both"
            });
            animation.onfinish = function () {
                element.style.opacity = "1";
                element.style.transform = "none";
                animation.cancel();
            };
        });
    }, { threshold: 0.12 });

    benefits.forEach(function (element) { observer.observe(element); });

    // Introduce the first slide's text on page load; the slider itself keeps
    // handling crossfades, navigation and autoplay.
    window.Webflow.push(function () {
        var content = document.querySelector(".slide_1 .left-text_1");
        var index = 0;
        Array.prototype.forEach.call(content.children, function (element) {
            if (window.getComputedStyle(element).display === "none") return;
            element.animate([
                { opacity: 0, transform: "translateY(24px)" },
                { opacity: 1, transform: "translateY(0)" }
            ], {
                duration: 1000,
                delay: 100 + index++ * 130,
                easing: easing,
                fill: "backwards"
            });
        });
    });
})();
