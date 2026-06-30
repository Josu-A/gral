from src.attempt import Solution

solution = Solution()


def test_1():
    result = solution.reverse(123)
    assert result == 321


def test_2():
    result = solution.reverse(-123)
    assert result == -321


def test_3():
    result = solution.reverse(120)
    assert result == 21


def test_4():
    result = solution.reverse(0)
    assert result == 0


def test_5():
    result = solution.reverse(1534236469)
    assert result == 0


def test_6():
    result = solution.reverse(-2147483648)
    assert result == 0


def test_7():
    result = solution.reverse(1463847412)
    assert result == 2147483641


def test_8():
    result = solution.reverse(-2147483412)
    assert result == -2147483412
