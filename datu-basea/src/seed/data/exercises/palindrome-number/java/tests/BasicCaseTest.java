import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class BasicCaseTest {

    private final Solution solution = new Solution();

    @Test
    public void test1() {
        assertTrue(solution.isPalindrome(121));
    }

    @Test
    public void test2() {
        assertFalse(solution.isPalindrome(-121));
    }

    @Test
    public void test3() {
        assertFalse(solution.isPalindrome(10));
    }

    @Test
    public void test4() {
        assertTrue(solution.isPalindrome(0));
    }

    @Test
    public void test5() {
        assertTrue(solution.isPalindrome(12321));
    }

    @Test
    public void test6() {
        assertFalse(solution.isPalindrome(12));
    }
}
