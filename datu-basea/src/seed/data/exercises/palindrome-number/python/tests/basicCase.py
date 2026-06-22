from src.attempt import Solution

solution = Solution()

def test_1():
    assert solution.isPalindrome(121)

def test_2():
    assert not solution.isPalindrome(-121)

def test_3():
    assert not solution.isPalindrome(10)

def test_4():
    assert solution.isPalindrome(0)

def test_5():
    assert solution.isPalindrome(12321)

def test_6():
    assert not solution.isPalindrome(12)
