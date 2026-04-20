import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import java.util.Arrays;

public class BasicCaseTest {

    private final Solution solution = new Solution();

    @Test
    public void test1() {
        int[] result = solution.twoSum(new int[]{2, 7, 11, 15}, 9);
        Arrays.sort(result);
        assertArrayEquals(new int[]{0, 1}, result);
    }

    @Test
    public void test2() {
        int[] result = solution.twoSum(new int[]{3, 2, 4}, 6);
        Arrays.sort(result);
        assertArrayEquals(new int[]{1, 2}, result);
    }

    @Test
    public void test3() {
        int[] result = solution.twoSum(new int[]{3, 3}, 6);
        Arrays.sort(result);
        assertArrayEquals(new int[]{0, 1}, result);
    }
}
