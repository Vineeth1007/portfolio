/* =====================================================================
   Portfolio 3 — interaction + scene engine
   - Role engine: switching role rewrites headline, spec, metrics,
     approach, mode bar, domain order, resume link, accent AND the
     background scene.
   - Meaningful canvas scenes: each one depicts the actual work, not a
     random particle field.
   ===================================================================== */
(function () {
  "use strict";

  var P = window.PORTFOLIO || {};
  var ROLE_KEY = "csv_role";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function hex2rgb(h) {
    h = (h || "#4ea1ff").replace("#", "");
    if (h.length === 3) h = h.split("").map(function (x) { return x + x; }).join("");
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(rgb, a) { return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")"; }
  function cssAccent() {
    return (getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()) || "#4ea1ff";
  }

  /* =====================================================================
     SCENES — factory(w,h) -> { resize(w,h), draw(ctx,w,h,t,rgb) }
     ===================================================================== */
  var SCENES = {

    /* ROLE BG: ML — data flowing through a serving pipeline */
    pipeline: function () {
      var packets = [], stages = [0.12, 0.4, 0.66, 0.9], pulses = [], spawn = 0, lanes = 5;
      return {
        resize: function () { packets = []; pulses = []; },
        draw: function (ctx, w, h, t, rgb) {
          for (var l = 0; l < lanes; l++) {
            var y = h * (l + 1) / (lanes + 1);
            ctx.strokeStyle = rgba(rgb, 0.10); ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(w * 0.06, y); ctx.lineTo(w * 0.94, y); ctx.stroke();
          }
          stages.forEach(function (sx, i) {
            var x = w * sx;
            ctx.strokeStyle = rgba(rgb, i === stages.length - 1 ? 0.5 : 0.28);
            ctx.lineWidth = i === stages.length - 1 ? 2 : 1;
            ctx.beginPath(); ctx.moveTo(x, h * 0.14); ctx.lineTo(x, h * 0.86); ctx.stroke();
          });
          spawn -= 1;
          if (spawn <= 0 && packets.length < 60) {
            spawn = 14;
            packets.push({ lane: Math.floor(Math.random() * lanes), x: w * 0.06, v: 0.6 + Math.random() * 0.7, done: false });
          }
          for (var k = packets.length - 1; k >= 0; k--) {
            var p = packets[k];
            p.x += p.v;
            var py = h * (p.lane + 1) / (lanes + 1);
            ctx.fillStyle = rgba(rgb, 0.85);
            ctx.fillRect(p.x, py - 2, 9, 4);
            if (!p.done && p.x >= w * 0.9) { p.done = true; pulses.push({ x: w * 0.9, y: py, r: 2, a: 0.7 }); }
            if (p.x > w * 0.95) packets.splice(k, 1);
          }
          for (var m = pulses.length - 1; m >= 0; m--) {
            var pu = pulses[m]; pu.r += 1.4; pu.a -= 0.02;
            ctx.strokeStyle = rgba(rgb, Math.max(0, pu.a)); ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(pu.x, pu.y, pu.r, 0, 7); ctx.stroke();
            if (pu.a <= 0) pulses.splice(m, 1);
          }
        }
      };
    },

    /* ROLE BG: DS — signal emerging from noise + trend line */
    signal: function () {
      var pts = [];
      function build(w, h) {
        pts = [];
        var n = Math.floor((w * h) / 12000);
        for (var i = 0; i < n; i++) {
          pts.push({ x: Math.random(), base: Math.random(), sig: Math.random() < 0.32, ph: Math.random() * 6 });
        }
      }
      return {
        resize: function (w, h) { build(w, h); },
        draw: function (ctx, w, h, t, rgb) {
          var slope = -0.32 + Math.sin(t * 0.25) * 0.05, intercept = 0.7;
          ctx.strokeStyle = rgba(rgb, 0.45); ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(w * 0.05, h * (intercept + slope * 0.05));
          ctx.lineTo(w * 0.95, h * (intercept + slope * 0.95));
          ctx.stroke();
          pts.forEach(function (p) {
            var px = w * (0.05 + p.x * 0.9), py;
            if (p.sig) { var line = intercept + slope * p.x; py = h * (line + (p.base - 0.5) * 0.06); }
            else { py = h * (0.12 + p.base * 0.76); }
            var tw = 0.4 + Math.abs(Math.sin(t * 1.5 + p.ph)) * 0.6;
            ctx.fillStyle = p.sig ? rgba(rgb, 0.9 * tw) : rgba([170, 174, 180], 0.25 * tw);
            ctx.beginPath(); ctx.arc(px, py, p.sig ? 2 : 1.4, 0, 7); ctx.fill();
          });
        }
      };
    },

    /* ROLE BG: AS — benchmark bars being compared / ablated */
    bench: function () {
      var groups = [];
      function build() {
        groups = [];
        for (var g = 0; g < 5; g++) {
          var bars = [];
          for (var b = 0; b < 3; b++) bars.push({ tgt: 0.3 + Math.random() * 0.6, cur: 0.1, ph: Math.random() * 6 });
          groups.push(bars);
        }
      }
      build();
      return {
        resize: function () {},
        draw: function (ctx, w, h, t, rgb) {
          var gw = (w * 0.86) / groups.length, baseY = h * 0.82, x0 = w * 0.07;
          ctx.strokeStyle = rgba(rgb, 0.18); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x0, baseY); ctx.lineTo(w * 0.93, baseY); ctx.stroke();
          groups.forEach(function (bars, gi) {
            var best = 0; bars.forEach(function (b, i) { if (b.tgt > bars[best].tgt) best = i; });
            var bw = gw * 0.18, gap = gw * 0.08;
            bars.forEach(function (b, bi) {
              b.cur += (b.tgt - b.cur) * 0.03;
              var wobble = Math.sin(t * 0.8 + b.ph) * 0.012;
              var hh = (b.cur + wobble) * h * 0.55;
              var bx = x0 + gi * gw + bi * (bw + gap) + gw * 0.12;
              ctx.fillStyle = bi === best ? rgba(rgb, 0.85) : rgba(rgb, 0.3);
              ctx.fillRect(bx, baseY - hh, bw, hh);
            });
          });
        }
      };
    },

    /* WORK: Fraud — transaction graph, flagged accounts pulse */
    fraud: function () {
      var nodes = [], edges = [], travel = null;
      function build() {
        nodes = []; edges = [];
        var N = 11;
        for (var i = 0; i < N; i++) {
          nodes.push({ x: 0.12 + Math.random() * 0.76, y: 0.15 + Math.random() * 0.7, fl: Math.random() < 0.25, ph: Math.random() * 6 });
        }
        for (var a = 0; a < N; a++) {
          var links = 1 + Math.floor(Math.random() * 2);
          for (var c = 0; c < links; c++) { var b = Math.floor(Math.random() * N); if (b !== a) edges.push([a, b]); }
        }
        travel = { e: 0, p: 0 };
      }
      return {
        resize: function () { build(); },
        draw: function (ctx, w, h, t, rgb) {
          edges.forEach(function (e) {
            var n1 = nodes[e[0]], n2 = nodes[e[1]];
            ctx.strokeStyle = rgba(rgb, 0.18); ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(n1.x * w, n1.y * h); ctx.lineTo(n2.x * w, n2.y * h); ctx.stroke();
          });
          if (travel && edges.length) {
            travel.p += 0.02;
            if (travel.p >= 1) { travel.p = 0; travel.e = (travel.e + 1) % edges.length; }
            var ed = edges[travel.e], a = nodes[ed[0]], b = nodes[ed[1]];
            var tx = (a.x + (b.x - a.x) * travel.p) * w, ty = (a.y + (b.y - a.y) * travel.p) * h;
            ctx.fillStyle = rgba(rgb, 0.9); ctx.beginPath(); ctx.arc(tx, ty, 2.5, 0, 7); ctx.fill();
          }
          nodes.forEach(function (n) {
            var x = n.x * w, y = n.y * h;
            if (n.fl) {
              var r = 6 + Math.abs(Math.sin(t * 2 + n.ph)) * 6;
              ctx.strokeStyle = rgba(rgb, 0.5); ctx.lineWidth = 1.2;
              ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
            }
            ctx.fillStyle = n.fl ? rgba(rgb, 1) : rgba(rgb, 0.45);
            ctx.beginPath(); ctx.arc(x, y, n.fl ? 4 : 2.6, 0, 7); ctx.fill();
          });
        }
      };
    },

    /* WORK: Cyber/IoT — flow stream with intrusion spikes */
    intrusion: function () {
      var off = 0, spikes = [];
      return {
        resize: function () { spikes = []; },
        draw: function (ctx, w, h, t, rgb) {
          off += 1.4;
          var mid = h * 0.55;
          ctx.strokeStyle = rgba(rgb, 0.08); ctx.lineWidth = 1;
          for (var gy = h * 0.2; gy < h * 0.9; gy += h * 0.18) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
          ctx.strokeStyle = rgba(rgb, 0.5); ctx.lineWidth = 1.5; ctx.beginPath();
          for (var x = 0; x <= w; x += 3) {
            var phase = (x + off) * 0.05;
            var y = mid + Math.sin(phase) * 5 + Math.sin(phase * 2.3) * 3;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
          if (Math.random() < 0.018) spikes.push({ x: w + 10, a: 1 });
          for (var s = spikes.length - 1; s >= 0; s--) {
            var sp = spikes[s]; sp.x -= 1.4;
            var top = mid - h * 0.32;
            ctx.strokeStyle = rgba(rgb, sp.a); ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(sp.x, mid); ctx.lineTo(sp.x, top); ctx.stroke();
            ctx.strokeStyle = rgba(rgb, sp.a * 0.8);
            ctx.strokeRect(sp.x - 6, top - 8, 12, 8);
            if (sp.x < -20) spikes.splice(s, 1);
          }
        }
      };
    },

    /* WORK: Vision — scan sweep with detection boxes */
    vision: function () {
      var boxes = [];
      function build() {
        boxes = [];
        for (var i = 0; i < 4; i++) {
          boxes.push({ x: 0.12 + Math.random() * 0.6, y: 0.15 + Math.random() * 0.5,
            w: 0.12 + Math.random() * 0.16, h: 0.12 + Math.random() * 0.18, conf: 0.82 + Math.random() * 0.16 });
        }
      }
      return {
        resize: function () { build(); },
        draw: function (ctx, w, h, t, rgb) {
          ctx.strokeStyle = rgba(rgb, 0.07); ctx.lineWidth = 1;
          for (var gx = 0; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
          var sy = (Math.sin(t * 0.7) * 0.5 + 0.5) * h;
          ctx.strokeStyle = rgba(rgb, 0.55); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(w, sy); ctx.stroke();
          boxes.forEach(function (b) {
            var bx = b.x * w, by = b.y * h, bw = b.w * w, bh = b.h * h;
            var active = sy > by - 6 && sy < by + bh + 6;
            ctx.strokeStyle = rgba(rgb, active ? 0.95 : 0.4); ctx.lineWidth = active ? 2 : 1;
            var c = Math.min(bw, bh) * 0.32;
            [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(function (cn) {
              ctx.beginPath();
              ctx.moveTo(cn[0], cn[1] + cn[3] * c); ctx.lineTo(cn[0], cn[1]); ctx.lineTo(cn[0] + cn[2] * c, cn[1]);
              ctx.stroke();
            });
            if (active) { ctx.fillStyle = rgba(rgb, 0.9); ctx.font = "9px monospace"; ctx.fillText(b.conf.toFixed(2), bx + 2, by - 4); }
          });
        }
      };
    },

    /* WORK: Genomics — base-pair helix, kept vs filtered rungs */
    genomics: function () {
      var scroll = 0;
      return {
        resize: function () {},
        draw: function (ctx, w, h, t, rgb) {
          scroll += 0.6;
          var cx = w * 0.5, amp = w * 0.16, step = 16;
          ctx.lineWidth = 1.5;
          for (var y = -step; y < h + step; y += step) {
            var yy = (y + (scroll % step));
            var ph = yy * 0.05 + t;
            var x1 = cx + Math.sin(ph) * amp;
            var x2 = cx + Math.sin(ph + Math.PI) * amp;
            ctx.fillStyle = rgba(rgb, 0.6); ctx.beginPath(); ctx.arc(x1, yy, 2, 0, 7); ctx.fill();
            ctx.fillStyle = rgba(rgb, 0.35); ctx.beginPath(); ctx.arc(x2, yy, 2, 0, 7); ctx.fill();
            var kept = (Math.floor(yy / step) % 3 === 0);
            ctx.strokeStyle = rgba(rgb, kept ? 0.5 : 0.12); ctx.lineWidth = kept ? 1.4 : 1;
            ctx.beginPath(); ctx.moveTo(x1, yy); ctx.lineTo(x2, yy); ctx.stroke();
          }
        }
      };
    },

    /* WORK: NLP — token row with attention arcs + sentiment */
    nlp: function () {
      var tokens = [], link = { a: 0, b: 2, p: 0 };
      function build(w) {
        tokens = [];
        var x = w * 0.08;
        for (var i = 0; i < 9; i++) {
          var tw = 18 + Math.random() * 34;
          tokens.push({ x: x, w: tw });
          x += tw + 12;
          if (x > w * 0.92) break;
        }
        link = { a: 0, b: 2, p: 0 };
      }
      return {
        resize: function (w) { build(w); },
        draw: function (ctx, w, h, t, rgb) {
          var y = h * 0.62;
          tokens.forEach(function (tk) {
            ctx.strokeStyle = rgba(rgb, 0.4); ctx.lineWidth = 1;
            roundRect(ctx, tk.x, y, tk.w, 14, 4); ctx.stroke();
          });
          link.p += 0.02;
          if (link.p >= 1) { link.p = 0; link.a = Math.floor(Math.random() * tokens.length); link.b = Math.floor(Math.random() * tokens.length); }
          if (tokens.length > 1) {
            var ta = tokens[link.a % tokens.length], tb = tokens[link.b % tokens.length];
            if (ta && tb) {
              var x1 = ta.x + ta.w / 2, x2 = tb.x + tb.w / 2, topY = y - h * 0.32;
              ctx.strokeStyle = rgba(rgb, 0.6); ctx.lineWidth = 1.4;
              ctx.beginPath(); ctx.moveTo(x1, y); ctx.quadraticCurveTo((x1 + x2) / 2, topY, x2, y); ctx.stroke();
              var bx = (1 - link.p) * (1 - link.p) * x1 + 2 * (1 - link.p) * link.p * ((x1 + x2) / 2) + link.p * link.p * x2;
              var by = (1 - link.p) * (1 - link.p) * y + 2 * (1 - link.p) * link.p * topY + link.p * link.p * y;
              ctx.fillStyle = rgba(rgb, 0.95); ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, 7); ctx.fill();
            }
          }
        }
      };
    }
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* Canvas runner — sizes a canvas, drives a scene, pauses offscreen. */
  function makeRunner(canvas, accentGetter) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, scene = null, raf = null, t0 = performance.now(), visible = true;

    function size() {
      w = canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || 0;
      h = canvas.clientHeight || (canvas.parentElement && canvas.parentElement.clientHeight) || 0;
      if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (scene && scene.resize) scene.resize(w, h);
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      scene.draw(ctx, w, h, (performance.now() - t0) / 1000, hex2rgb(accentGetter()));
    }
    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!visible || !scene || !w || !h) return;
      ctx.clearRect(0, 0, w, h);
      scene.draw(ctx, w, h, (now - t0) / 1000, hex2rgb(accentGetter()));
    }
    return {
      setScene: function (factory) { scene = factory(); size(); },
      start: function () { if (!raf) loop(performance.now()); },
      stop: function () { if (raf) { cancelAnimationFrame(raf); raf = null; } },
      drawOnce: function () { if (scene && w && h) frame(); },
      size: size,
      setVisible: function (v) { visible = v; }
    };
  }

  var bgRunner = null;
  function initBackground() {
    var c = $(".scene-bg");
    if (!c) return null;
    if (reduceMotion) c.style.opacity = "0.1";
    bgRunner = makeRunner(c, cssAccent);
    window.addEventListener("resize", debounce(bgRunner.size, 150));
    document.addEventListener("visibilitychange", function () { bgRunner.setVisible(!document.hidden); });
    return bgRunner;
  }

  function initProjectScenes() {
    var hosts = $all("[data-viz]");
    if (!hosts.length) return;
    hosts.forEach(function (host) {
      var type = host.getAttribute("data-viz");
      var accent = host.getAttribute("data-accent") || "#4ea1ff";
      var factory = SCENES[type];
      if (!factory) return;
      var isFigure = host.classList.contains("p-figure");
      var canvas = document.createElement("canvas");
      canvas.className = isFigure ? "p-canvas" : "proj-bg";
      canvas.setAttribute("aria-hidden", "true");
      if (isFigure) host.insertBefore(canvas, host.firstChild);
      else host.appendChild(canvas);
      var runner = makeRunner(canvas, function () { return accent; });
      runner.setScene(factory);
      if (reduceMotion) {
        requestAnimationFrame(function () { runner.size(); runner.drawOnce(); });
        window.addEventListener("resize", debounce(function () { runner.size(); runner.drawOnce(); }, 160));
        return;
      }
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting) { runner.setVisible(true); runner.start(); }
          else { runner.setVisible(false); }
        });
      }, { threshold: 0.05 });
      io.observe(host);
      window.addEventListener("resize", debounce(runner.size, 160));
    });
  }

  function debounce(fn, ms) { var tm; return function () { clearTimeout(tm); tm = setTimeout(fn, ms); }; }

  /* ROLE ENGINE */
  function getRole() {
    var r;
    try { r = localStorage.getItem(ROLE_KEY); } catch (e) {}
    return (r && P.roles && P.roles[r]) ? r : "ml";
  }
  function setRole(r, animate) {
    if (!P.roles || !P.roles[r]) return;
    try { localStorage.setItem(ROLE_KEY, r); } catch (e) {}
    document.documentElement.setAttribute("data-role", r);
    applyRole(r, animate);
  }
  function applyRole(r, animate) {
    var role = P.roles[r];
    if (!role) return;

    $all(".role-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.role === r));
    });

    var h1 = $("[data-hero-title]");
    if (h1 && role.headline) {
      h1.innerHTML = esc(role.headline[0]) + '<span class="serif-it">' + esc(role.headline[1]) + "</span>" + esc(role.headline[2]);
    }
    setText("[data-hero-eyebrow]", role.title);
    setText("[data-hero-statement]", role.statement);

    var article = /^[aeiou]/i.test(role.short) ? "an " : "a ";
    setText("[data-approach-role]", article + role.short);
    setText("[data-mode-line]", "Bengaluru, India · currently viewing as " + role.short);
    setText("[data-mode-name]", role.short);
    setText("[data-mode-mode]", role.mode);

    $all("[data-resume]").forEach(function (a) {
      if (!role.resume) return;
      a.setAttribute("href", role.resume);
      a.setAttribute("download", "");
      a.setAttribute("title", "Download the " + role.short + " resume (PDF)");
      var lbl = a.querySelector("[data-resume-label]");
      if (lbl) lbl.textContent = "Résumé · " + role.short;
    });

    var spec = $("[data-spec]");
    if (spec && role.spec) {
      spec.innerHTML = role.spec.map(function (row) {
        return '<div class="spec-row"><span class="k">' + esc(row[0]) + '</span><span class="v">' + esc(row[1]) + "</span></div>";
      }).join("");
    }

    var mr = $("[data-metrics]");
    if (mr && role.metrics) {
      mr.innerHTML = role.metrics.map(function (m) {
        var pre = m.prefix ? '<span class="accent">' + esc(m.prefix) + "</span>" : "";
        return '<div class="metric"><div class="num">' + pre +
          '<span data-count="' + m.to + '" data-dp="' + (m.dp || 0) + '" data-suffix="' + (m.suffix || "") + '">0</span>' +
          '</div><div class="lbl">' + esc(m.lbl) + "</div></div>";
      }).join("");
      runCounters(mr);
    }

    var ap = $("[data-approach]");
    if (ap && role.approach) {
      ap.innerHTML = role.approach.map(function (a, i) {
        return '<div class="approach-item"><h3 data-i="' + ("0" + (i + 1)) + '">' + esc(a[0]) + "</h3><p>" + esc(a[1]) + "</p></div>";
      }).join("");
    }

    var dl = $("[data-domains]");
    if (dl && role.order) {
      var byId = {};
      (P.projects || []).forEach(function (p) { byId[p.id] = p; });
      dl.innerHTML = role.order.map(function (id, i) {
        var p = byId[id]; if (!p) return "";
        return '<a class="domain-row" href="work.html#' + p.id + '">' +
          '<span class="d-no">' + ("0" + (i + 1)) + "</span>" +
          '<span><span class="d-name">' + esc(p.domain) + "</span>" +
          '<span class="d-tag">' + esc(p.lens[r] || p.desc) + "</span></span>" +
          '<span class="d-go">' + esc(p.tag) + ' <span>&#8594;</span></span></a>';
      }).join("");
    }

    $all("[data-lens]").forEach(function (el) {
      var id = el.getAttribute("data-lens");
      var proj = (P.projects || []).find(function (p) { return p.id === id; });
      var body = el.querySelector(".lens-body");
      if (proj && proj.lens && body) body.textContent = proj.lens[r] || "";
    });

    if (bgRunner && role.scene && SCENES[role.scene]) {
      bgRunner.setScene(SCENES[role.scene]);
      if (!reduceMotion) bgRunner.start(); else bgRunner.drawOnce();
    }

    if (animate && !reduceMotion) {
      var main = $("main");
      if (main) { main.classList.remove("role-fade"); void main.offsetWidth; main.classList.add("role-fade"); }
    }
  }

  function setText(sel, txt) { var el = $(sel); if (el) el.textContent = txt; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function runCounters(scope) {
    $all("[data-count]", scope || document).forEach(function (el) {
      var to = parseFloat(el.dataset.count), dp = parseInt(el.dataset.dp || "0", 10), suffix = el.dataset.suffix || "";
      if (reduceMotion) { el.textContent = fmt(to, dp) + suffix; return; }
      var start = performance.now(), dur = 1100;
      (function step(now) {
        var t = Math.min(1, (now - start) / dur);
        var e = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt(to * e, dp) + suffix;
        if (t < 1) requestAnimationFrame(step); else el.textContent = fmt(to, dp) + suffix;
      })(start);
    });
  }
  function fmt(v, dp) { return dp ? v.toFixed(dp) : Math.round(v).toString(); }

  function initReveal() {
    var els = $all(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  function initMenu() {
    var btn = $(".menu-btn"), links = $(".nav-links");
    if (btn && links) btn.addEventListener("click", function () { links.classList.toggle("open"); });
  }

  function initRoleSwitch() {
    $all(".role-switch button").forEach(function (b) {
      b.addEventListener("click", function () { setRole(b.dataset.role, true); });
    });
  }

  function lockedView() {
    var m = /[?&]view=(ml|ds|as)(?:[&#]|$)/.exec(window.location.search);
    return m ? m[1] : null;
  }
  function applyLock(role) {
    document.documentElement.classList.add("locked");
    var name = (P.roles[role] && P.roles[role].short) || "";
    $all("[data-lock-role]").forEach(function (el) { el.textContent = name; });
    $all("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return;
      if (!/\.html(\?|#|$)/.test(href)) return;
      if (/[?&]view=/.test(href)) return;
      var hash = "", q = href, hi = href.indexOf("#");
      if (hi >= 0) { hash = href.slice(hi); q = href.slice(0, hi); }
      a.setAttribute("href", q + (q.indexOf("?") >= 0 ? "&" : "?") + "view=" + role + hash);
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    var locked = lockedView();
    var r = locked || getRole();
    document.documentElement.setAttribute("data-role", r);
    initBackground();
    if (bgRunner && P.roles[r] && SCENES[P.roles[r].scene]) {
      bgRunner.setScene(SCENES[P.roles[r].scene]);
      if (!reduceMotion) bgRunner.start(); else bgRunner.drawOnce();
    }
    if (!locked) initRoleSwitch();
    applyRole(r, false);
    if (locked) applyLock(r);
    initReveal();
    initProjectScenes();
    initMenu();
  });
})();
