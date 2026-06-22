import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class BasicCaseTest {

    private final Solution solution = new Solution();
    private static final double DELTA = 1e-9;

    @Test
    public void test1() {
        double result = solution.findMedianSortedArrays(new int[]{1, 3}, new int[]{2});
        assertEquals(2.0, result, DELTA);
    }

    @Test
    public void test2() {
        double result = solution.findMedianSortedArrays(new int[]{1, 2}, new int[]{3, 4});
        assertEquals(2.5, result, DELTA);
    }

    @Test
    public void test3() {
        double result = solution.findMedianSortedArrays(new int[]{}, new int[]{1});
        assertEquals(1.0, result, DELTA);
    }

    @Test
    public void test4() {
        double result = solution.findMedianSortedArrays(new int[]{2}, new int[]{});
        assertEquals(2.0, result, DELTA);
    }

    @Test
    public void test5() {
        double result = solution.findMedianSortedArrays(new int[]{0, 0}, new int[]{0, 0});
        assertEquals(0.0, result, DELTA);
    }
}
