from src.attempt import Solution

solution = Solution()

def test_1():
    result = solution.findMedianSortedArrays([1, 3], [2])
    assert abs(result - 2.0) < 1e-9

def test_2():
    result = solution.findMedianSortedArrays([1, 2], [3, 4])
    assert abs(result - 2.5) < 1e-9

def test_3():
    result = solution.findMedianSortedArrays([], [1])
    assert abs(result - 1.0) < 1e-9

def test_4():
    result = solution.findMedianSortedArrays([2], [])
    assert abs(result - 2.0) < 1e-9

def test_5():
    result = solution.findMedianSortedArrays([0, 0], [0, 0])
    assert abs(result - 0.0) < 1e-9
