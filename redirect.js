/*
 * Weiterleitung von https auf DEVONthink-Links, für Notion.
 * Stand 20.10.2026.
 *
 * Erlaubt sind genau zwei Formen hinter dem # der Adresse:
 *   #<UUID>                    -> x-devonthink-item://<UUID>
 *   #<UUID>?page=<Zahl>        -> x-devonthink-item://<UUID>?page=<Zahl>
 *   #<UUID>?reveal=1           -> x-devonthink-item://<UUID>?reveal=1
 *   #q=<Suchtext>              -> x-devonthink://search?query=<Suchtext>
 * Alles andere wird abgelehnt. Keine anderen Schemata, keine anderen
 * DEVONthink-Befehle (createMarkdown, clip usw.), keine https-Ziele.
 * Der Teil hinter # wird vom Browser nie an den Server geschickt.
 */
(function (root) {
  'use strict';

  var MAX_HASH = 400;
  var MAX_QUERY = 200;
  var ITEM = /^([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})(?:\?(page=[0-9]{1,5}|reveal=1))?$/;
  // Steuer-, Format-, Surrogat- und Trennzeichen (u.a. Bidi-Override, Zero-Width-Space, U+2028/2029)
  var CONTROL = /[\p{C}\p{Zl}\p{Zp}]/u;

  function dtTarget(hash) {
    if (typeof hash !== 'string') return null;
    var h = hash.charAt(0) === '#' ? hash.slice(1) : hash;
    if (h.length === 0 || h.length > MAX_HASH) return null;

    var m = ITEM.exec(h);
    if (m) {
      return 'x-devonthink-item://' + m[1] + (m[2] ? '?' + m[2] : '');
    }

    if (h.slice(0, 2) === 'q=') {
      var q;
      try {
        q = decodeURIComponent(h.slice(2));
      } catch (e) {
        return null;
      }
      if (CONTROL.test(q)) return null;
      q = q.trim();
      if (q.length === 0 || q.length > MAX_QUERY) return null;
      try {
        return 'x-devonthink://search?query=' + encodeURIComponent(q);
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  // Für Tests unter Node exportieren, im Browser nichts davon.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { dtTarget: dtTarget };
    return;
  }

  var doc = root.document;
  var msg = doc.getElementById('msg');
  var link = doc.getElementById('fallback');
  if (root.top !== root.self) {
    msg.textContent = 'Nicht in einem Frame verwendbar.';
    return;
  }

  var target = dtTarget(root.location.hash);

  if (!target) {
    msg.textContent = 'Kein gültiger DEVONthink-Link.';
    return;
  }

  msg.textContent = 'DEVONthink wird geöffnet …';
  link.setAttribute('href', target);
  link.hidden = false;
  root.location.replace(target);
})(typeof window !== 'undefined' ? window : this);
