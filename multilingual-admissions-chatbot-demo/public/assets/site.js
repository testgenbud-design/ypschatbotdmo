/* Landing page micro-interactions — reveal on scroll, count-up, widget hooks. */
(function () {
  "use strict";

  // reveal on scroll
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }

  // count-up stats
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400;
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = Math.round(target * eased);
      el.firstChild.nodeValue = v >= 1000 ? v.toLocaleString("en-IN") : String(v);
      if (p < 1) requestAnimationFrame(step);
      else el.firstChild.nodeValue = (target >= 1000 ? target.toLocaleString("en-IN") : String(target));
    }
    requestAnimationFrame(step);
    void suffix;
  }
  var statIo = null;
  if ("IntersectionObserver" in window) {
    statIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            countUp(e.target);
            statIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("[data-count]").forEach(function (el) {
      statIo.observe(el);
    });
  }

  // open the chat widget from any [data-chat-open] element
  document.querySelectorAll("[data-chat-open]").forEach(function (el) {
    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      var topic = el.getAttribute("data-chat-topic") || "";
      if (window.YashodaAssistant && window.YashodaAssistant.open) {
        window.YashodaAssistant.open(topic);
      }
    });
  });
})();
