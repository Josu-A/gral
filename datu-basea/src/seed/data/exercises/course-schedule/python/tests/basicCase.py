from src.attempt import Solution

solution = Solution()


def test_1():
    result = solution.canFinish(2, [[1, 0]])
    assert result


def test_2():
    result = solution.canFinish(2, [[1, 0], [0, 1]])
    assert not result


def test_3():
    result = solution.canFinish(1, [])
    assert result


def test_4():
    result = solution.canFinish(3, [[1, 0], [2, 1]])
    assert result


def test_5():
    result = solution.canFinish(4, [[1, 0], [2, 0], [3, 1], [3, 2]])
    assert result


def test_6():
    result = solution.canFinish(3, [[0, 1], [1, 2], [2, 0]])
    assert not result


def test_7():
    result = solution.canFinish(5, [])
    assert result
