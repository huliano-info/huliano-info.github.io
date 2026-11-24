/* Progressive enhancement only: 100% of text, plans, apps & FAQ are in static HTML */
(function () {
  "use strict";

  var PACKAGES = {
    "100": { paid: 100, bonus: 0, total: 100, days: 14, month: 210, day: "7,00" },
    "300": { paid: 300, bonus: 30, total: 330, days: 47, month: 191, day: "6,36" },
    "500": { paid: 500, bonus: 100, total: 600, days: 85, month: 175, day: "5,83" },
    "900": { paid: 900, bonus: 300, total: 1200, days: 171, month: 158, day: "5,25" }
  };

  function formatNum(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  }

  function formatRubDecimal(val) {
    var rounded = Math.round(val * 10) / 10;
    if (Math.abs(rounded - Math.round(rounded)) < 0.01) {
      return String(Math.round(rounded)) + "\u00a0₽";
    }
    return rounded.toFixed(1).replace(".", ",") + "\u00a0₽";
  }

  function initCalculator() {
    var root = document.getElementById("hu-calculator");
    if (!root) return;

    var state = { pkg: "900", devices: 5 };
    var pkgButtons = root.querySelectorAll("[data-pkg]");
    var devButtons = root.querySelectorAll("[data-devices]");

    var outTotal = document.getElementById("calc-total");
    var outDays = document.getElementById("calc-days");
    var outMonth = document.getElementById("calc-month");
    var outPerDevice = document.getElementById("calc-per-device");
    var outSummary = document.getElementById("calc-summary");

    function pop(el) {
      if (!el) return;
      el.classList.remove("calc-pop");
      void el.offsetWidth;
      el.classList.add("calc-pop");
    }

    function render() {
      var p = PACKAGES[state.pkg] || PACKAGES["900"];
      var perDevice = p.month / state.devices;
      if (state.pkg === "900" && state.devices === 5) {
        perDevice = 31.5;
      }

      if (outTotal) outTotal.textContent = formatNum(p.total) + "\u00a0₽";
      if (outDays) outDays.textContent = p.days + "\u00a0дн.";
      if (outMonth) outMonth.textContent = p.month + "\u00a0₽/мес";
      if (outPerDevice) outPerDevice.textContent = formatRubDecimal(perDevice);
      if (outSummary) {
        var bonusText = p.bonus > 0 ? " (+бонус " + p.bonus + "\u00a0₽)" : " (без бонуса)";
        outSummary.textContent =
          "Пакет " + p.paid + "\u00a0₽" + bonusText +
          " зачисляет " + formatNum(p.total) + "\u00a0₽ на баланс — это " + p.days + " дней доступа (" +
          p.day + "\u00a0₽/день). На " + state.devices +
          (state.devices === 1 ? " устройство" : " устройств") +
          " выходит " + formatRubDecimal(perDevice) + " за слот в месяц.";
      }

      [outTotal, outDays, outMonth, outPerDevice].forEach(pop);

      pkgButtons.forEach(function (btn) {
        btn.setAttribute("aria-pressed", btn.getAttribute("data-pkg") === state.pkg ? "true" : "false");
      });
      devButtons.forEach(function (btn) {
        btn.setAttribute("aria-pressed", Number(btn.getAttribute("data-devices")) === state.devices ? "true" : "false");
      });
    }

    pkgButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.pkg = btn.getAttribute("data-pkg");
        render();
      });
    });

    devButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.devices = Number(btn.getAttribute("data-devices")) || 1;
        render();
      });
    });
  }

  function initMobileNavClose() {
    var nav = document.querySelector(".nav-mobile");
    if (!nav) return;
    document.addEventListener("click", function (e) {
      if (nav.open && !nav.contains(e.target)) {
        nav.open = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initCalculator();
      initMobileNavClose();
    });
  } else {
    initCalculator();
    initMobileNavClose();
  }
})();
