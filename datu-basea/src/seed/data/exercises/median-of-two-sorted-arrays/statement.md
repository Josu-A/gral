Emanda `nums1` eta `nums2` ordenatutako bi array, `m` eta `n` tamainakoak hurrenez hurren, itzuli **ordenatutako bi arrayen mediana**.

Exekuzio-denboraren konplexutasun orokorra `O(log (m+n))` izan behar da.

**1. adibidea:**

```
Sarrera: nums1 = [1,3], nums2 = [2]
Irteera: 2.00000
Azalpena: bateratutako array-a = [1,2,3] eta mediana 2 da.
```

**2. adibidea:**

```
Sarrera: nums1 = [1,2], nums2 = [3,4]
Irteera: 2.50000
Azalpena: bateratutako array-a = [1,2,3,4] eta mediana (2 + 3) / 2 = 2.5 da.
```

**Murrizketak:**

- `nums1.length == m`
- `nums2.length == n`
- `0 <= m <= 1000`
- `0 <= n <= 1000`
- `1 <= m + n <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`
