from src.attempt import Solution

solution = Solution()

def test_1():
    result = solution.twoSum([2, 7, 11, 15], 9)
    assert sorted(result) == [0, 1]

def test_2():
    result = solution.twoSum([3, 2, 4], 6)
    assert sorted(result) == [1, 2]

def test_3():
    result = solution.twoSum([3, 3], 6)
    assert sorted(result) == [0, 1]
