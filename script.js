/* =========================================================
   Pinned horizontal scroll.
   Scrolling DOWN the page slides the rail LEFT, one panel per
   ~screen-width of scroll. Same mechanism as completedigital.org:
   a tall track gives the scroll distance, a sticky pin holds the
   viewport, and the rail is translated by however far we've
   scrolled into the track.
   ========================================================= */
(function () {
  "use strict";

  var track = document.querySelector(".scroller-track");
  var rail = document.querySelector(".scroller-rail");
  var dots = Array.prototype.slice.call(
    document.querySelectorAll(".scroller-dot")
  );

  if (!track || !rail) return;

  var panelCount = 0;
  var tileWidth = 0;
  var lastS = -1;

  function measure() {
    var first = rail.firstElementChild;
    panelCount = rail.querySelectorAll(".panel").length;
    tileWidth = first ? first.getBoundingClientRect().width : window.innerWidth;
    var scrollDist = tileWidth * (panelCount - 1);
    // The track is tall enough that scrolling through it produces exactly
    // `scrollDist` pixels of sideways travel.
    track.style.height = window.innerHeight + scrollDist + "px";
    lastS = -1;
    requestAnimationFrame(update);
  }

  function apply(top) {
    if (!panelCount) return;
    var scrollDist = tileWidth * (panelCount - 1);
    // `top` is the track's position relative to the viewport; as we scroll
    // down it goes negative, so -top is how far we've entered the track.
    var s = Math.min(Math.max(-top, 0), scrollDist);
    if (s === lastS) return;
    lastS = s;
    rail.style.transform = "translateX(" + -s + "px)";

    var active = Math.min(Math.round(s / tileWidth), panelCount - 1);
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === active);
    }
  }

  function update() {
    apply(track.getBoundingClientRect().top);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("orientationchange", measure);

  if (document.readyState === "complete") {
    measure();
  } else {
    window.addEventListener("load", measure);
    // Run an early pass too so it isn't blank before images finish loading.
    measure();
  }
})();
