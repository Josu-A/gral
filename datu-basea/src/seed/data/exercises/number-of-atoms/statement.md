`formula` izeneko kate bat emanda, formula kimiko bat adierazten duena, itzuli _atomo bakoitzaren kopurua_.

Elementu atomikoa beti hasten da letra maiuskula batekin, ondoren zero edo letra xehe gehiago, izena adieraziz.

Digitu bat edo gehiago, elementu horren kopurua adieraziz, jarrai dezakete kopurua `1` baino handiagoa bada. Kopurua `1` bada, ez da digiturik jarraituko.

- Adibidez, `"H2O"` eta `"H2O2"` posibleak dira, baina `"H1O2"` ezinezkoa da.

Bi formula elkartzen dira beste formula bat sortzeko.

- Adibidez, `"H2O2He3Mg4"` ere formula bat da.

Parentesi artean jarritako formula bat, eta aukerako kopuru bat gehituta, formula bat da ere.

- Adibidez, `"(H2O2)"` eta `"(H2O2)3"` formulak dira.

Itzuli elementu guztien kopurua kate gisa, honako forma honetan: lehen izena (ordena alfabetikoan), jarraian bere kopurua (kopurua `1` baino handiagoa bada), jarraian bigarren izena (ordena alfabetikoan), jarraian bere kopurua (kopurua `1` baino handiagoa bada), eta horrela hurrenez hurren.

Proba-kasuak sortuta daude irteerako balio guztiak **32 biteko** osoko zenbaki batean sartzeko moduan.

## 1. adibidea

```
Sarrera: formula = "H2O"
Irteera: "H2O"
Azalpena: Elementuen kopurua {'H': 2, 'O': 1} da.
```

## 2. adibidea

```
Sarrera: formula = "Mg(OH)2"
Irteera: "H2MgO2"
Azalpena: Elementuen kopurua {'H': 2, 'Mg': 1, 'O': 2} da.
```

## 3. adibidea

```
Sarrera: formula = "K4(ON(SO3)2)2"
Irteera: "K4N2O14S4"
Azalpena: Elementuen kopurua {'K': 4, 'N': 2, 'O': 14, 'S': 4} da.
```

## Murrizketak

- `1 <= formula.length <= 1000`
- `formula`-k ingelesezko letrak, digituak, `'('` eta `')'` ditu.
- `formula` beti baliozkoa da.
