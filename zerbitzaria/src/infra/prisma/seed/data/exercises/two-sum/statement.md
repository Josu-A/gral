Emandako `nums` zenbaki osoen array bat eta `target` zenbaki oso bat, itzuli `target` batuketa ematen duten bi zenbakien *indizeak*.

Suposa dezakezu sarrera bakoitzak **zehazki soluzio bakarra** duela, eta ezin duzu *elementu* bera birritan erabili.

Erantzuna edozein ordenatan itzul dezakezu.

&nbsp;

**1. adibidea:**

```
Sarrera: nums = [2,7,11,15], target = 9
Irteera: [0,1]
Azalpena: nums[0] + nums[1] == 9 denez, [0, 1] itzultzen dugu.
```

**2. adibidea:**

```
Sarrera: nums = [3,2,4], target = 6
Irteera: [1,2]
```

**3. adibidea:**

```
Sarrera: nums = [3,3], target = 6
Irteera: [0,1]
```

&nbsp;

**Murrizketak:**

- `2 <= nums.length <= 10⁴`
- `-10⁹ <= nums[i] <= 10⁹`
- `-10⁹ <= target <= 10⁹`
- **Soluzio baliodun bakarra existitzen da.**

&nbsp;

**Jarraipena:** O(n²) baino denbora-konplexutasun txikiagoa duen algoritmo bat asma dezakezu?
