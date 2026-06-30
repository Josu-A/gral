from src.attempt import Solution

solution = Solution()


def test_6_parens_with_multiplier():
    result = solution.countOfAtoms("(H2O2)3")
    assert result == "H6O6"


def test_7_nested_parens_multiple_levels():
    result = solution.countOfAtoms("((H2O)2)3")
    assert result == "H12O6"


def test_9_duplicate_elements_merge():
    result = solution.countOfAtoms("Fe2O3Fe2O3")
    assert result == "Fe4O6"


def test_11_multi_digit_count():
    result = solution.countOfAtoms("Be32")
    assert result == "Be32"


def test_12_lowercase_in_element_name():
    result = solution.countOfAtoms("Mgg2")
    assert result == "Mgg2"


def test_13_mixed_nested_and_flat():
    result = solution.countOfAtoms("K4(ON(SO3)2)2(H2O)")
    assert result == "H2K4N2O15S4"


def test_14_single_letter_vs_prefix_ordering():
    result = solution.countOfAtoms("HHe")
    assert result == "HHe"


def test_15_large_repeated_nesting():
    result = solution.countOfAtoms("((N2)3)4")
    assert result == "N24"
