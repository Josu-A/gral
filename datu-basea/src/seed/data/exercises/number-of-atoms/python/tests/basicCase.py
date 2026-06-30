from src.attempt import Solution

solution = Solution()


def test_1():
    result = solution.countOfAtoms("H2O")
    assert result == "H2O"


def test_2():
    result = solution.countOfAtoms("Mg(OH)2")
    assert result == "H2MgO2"


def test_3():
    result = solution.countOfAtoms("K4(ON(SO3)2)2")
    assert result == "K4N2O14S4"


def test_4_single_atom_no_count():
    result = solution.countOfAtoms("H")
    assert result == "H"


def test_5_parens_no_multiplier():
    result = solution.countOfAtoms("(H2O)")
    assert result == "H2O"


def test_8_combined_formulas():
    result = solution.countOfAtoms("H2O2He3Mg4")
    assert result == "H2He3Mg4O2"


def test_10_already_sorted_glucose():
    result = solution.countOfAtoms("C6H12O6")
    assert result == "C6H12O6"
