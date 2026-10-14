(function () {
  window.__nightBoot = 1;

  function joinParts(names) {
    return Promise.all(names.map(function (name) {
      return fetch("media/" + name).then(function (r) { return r.text(); });
    })).then(function (parts) { return parts.join(""); });
  }

  function b64ToUrl(b64, type) {
    var clean = b64.replace(/\s/g, "");
    var bin = atob(clean);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: type }));
  }

  function armSong() {
    var box = document.getElementById("song-on");
    var audio = document.getElementById("night-audio");
    if (!box || !box.checked || !audio || !audio.getAttribute("src")) return;
    audio.volume = 0.9;
    var played = audio.play();
    if (played && played.catch) played.catch(function () {});
  }

  document.addEventListener("change", function (event) {
    var box = event.target;
    if (!box || box.id !== "song-on") return;
    var audio = document.getElementById("night-audio");
    if (!audio) return;
    if (box.checked) armSong();
    else audio.pause();
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
    if (saved && !saved.textContent) {
      try {
        var list = JSON.parse(localStorage.getItem("liu-jin-night") || "[]");
        if (Array.isArray(list) && list[0] && list[0].text) saved.textContent = list[0].text;
      } catch (err) {}
    }

    document.querySelectorAll("img[data-b64]").forEach(function (img) {
      var names = img.getAttribute("data-b64").split(/\s+/);
      joinParts(names).then(function (b64) {
        img.src = b64ToUrl(b64, "image/jpeg");
      });
    });

    joinParts(['song-0.b64', 'song-1.b64', 'song-2.b64', 'song-3.b64', 'song-4.b64']).then(function (b64) {
      var audio = document.getElementById("night-audio");
      if (!audio) return;
      audio.src = b64ToUrl(b64, "audio/mpeg");
      audio.loop = true;
      armSong();
    });
  });
})();
