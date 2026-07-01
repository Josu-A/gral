Guztira `numCourses` ikastaro hartu behar dituzu, `0`tik `numCourses - 1`era etiketatuta. `prerequisites` array bat ematen zaizu, non `prerequisites[i] = [ai, bi]` adierazten duen `ai` ikastaroa hartu nahi baduzu, lehenago `bi` ikastaroa hartu behar duzula.

- Adibidez, `[0, 1]` bikoteak adierazten du 0 ikastaroa hartzeko, lehenago 1 ikastaroa hartu behar duzula.
  Itzuli `true` ikastaro guztiak amaitu badaitzakezu. Bestela, itzuli `false`.

**1. adibidea:**

```
Sarrera: numCourses = 2, prerequisites = [[1,0]]
Irteera: true
Azalpena: Guztira 2 ikastaro hartu behar dira.
1 ikastaroa hartzeko, 0 ikastaroa amaituta izan behar duzu. Beraz, posible da.
```

**2. adibidea:**

```
Sarrera: numCourses = 2, prerequisites = [[1,0],[0,1]]
Irteera: false
Azalpena: Guztira 2 ikastaro hartu behar dira.
1 ikastaroa hartzeko 0 ikastaroa amaituta izan behar duzu, eta 0 ikastaroa hartzeko 1 ikastaroa ere amaituta izan behar duzu. Beraz, ezinezkoa da.
```

**Murrizketak:**

- `1 <= numCourses <= 2000`
- `0 <= prerequisites.length <= 5000`
- `prerequisites[i].length == 2`
- `0 <= ai, bi < numCourses`
- `prerequisites[i]` bikote guztiak **bakarrak** dira.
