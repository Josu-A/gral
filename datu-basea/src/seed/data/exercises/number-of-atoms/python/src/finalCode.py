from collections import Counter
from re import match


class Solution:
    def countOfAtoms(self, s: str) -> str:
        st, i = [Counter()], 0
        while i < len(s):
            if s[i] == "(":
                st.append(Counter())
                i += 1
            elif s[i] == ")":
                m = match(r"(\d*)", s[i + 1 :])
                cnt = int(m[1] or "1")
                z = st.pop()
                for el in z:
                    z[el] *= cnt
                st[-1] += z
                i += 1 + len(m[1])
            else:
                m = match(r"([A-Z][a-z]*)(\d*)", s[i:])
                el, cnt = m[1], int(m[2] or "1")
                st[-1][el] += cnt
                i += len(m[0])

        return "".join(el + str(cnt) * (cnt > 1) for el, cnt in sorted(st[-1].items()))
