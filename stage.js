(function () {
  window.__nightBoot = 1;

  document.addEventListener("change", function (event) {
    var box = event.target;
    var audio = document.getElementById("night-audio");
    if (!box || box.id !== "song-on" || !audio) return;
    if (box.checked) {
      audio.volume = 0.9;
      var played = audio.play();
      if (played && played.catch) played.catch(function () {});
    } else {
      audio.pause();
    }
  });

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || form.id !== "wish-form") return;
    event.preventDefault();
    var field = form.querySelector("textarea");
    var text = field && field.value ? field.value.trim() : "";
    var note = document.getElementById("wish-note");
    var saved = document.getElementById("wish-saved");
    if (!text) {
      if (note) note.textContent = "写一句只说给自己的话";
      return;
    }
    if (note) note.textContent = "";
    if (saved) saved.textContent = text;
    if (field) field.value = "";
    try {
      var prev = JSON.parse(localStorage.getItem("liu-jin-night") || "[]");
      var next = [{ id: String(Date.now()), text: text }].concat(Array.isArray(prev) ? prev : []);
      localStorage.setItem("liu-jin-night", JSON.stringify(next.slice(0, 8)));
    } catch (err) {}
  });

  window.addEventListener("load", function () {
    var saved = document.getElementById("wish-saved");
    if (!saved || saved.textContent) return;
    try {
      var list = JSON.parse(localStorage.getItem("liu-jin-night") || "[]");
      if (Array.isArray(list) && list[0] && list[0].text) saved.textContent = list[0].text;
    } catch (err) {}
  });
})();
