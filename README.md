# dt-link

Kleine statische Seite, die einen https-Link an DEVONthink weiterleitet. Gedacht für Notion, das Links mit eigenem Schema (`x-devonthink-item://`) nicht öffnet.

Erlaubt sind genau zwei Formen hinter dem `#`:

| Link | Wird zu |
|---|---|
| `…/#<UUID>` (optional `?page=<Zahl>` oder `?reveal=1`) | `x-devonthink-item://<UUID>` |
| `…/#q=<Suchtext>` | `x-devonthink://search?query=<Suchtext>` |

Alles andere wird abgelehnt. Der Teil hinter `#` wird vom Browser nicht an den Server übertragen. Keine Daten im Repository.
