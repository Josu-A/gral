#include <assert.h>
#include <math.h>
#include <stdio.h>
#include "../src/solution.h"

static void assert_median(double got, double expected) {
    assert(fabs(got - expected) < 1e-9);
}

static void test_1(void) {
    int nums1[] = {1, 3};
    int nums2[] = {2};
    assert_median(findMedianSortedArrays(nums1, 2, nums2, 1), 2.0);
    printf("test_1 ok\n");
}

static void test_2(void) {
    int nums1[] = {1, 2};
    int nums2[] = {3, 4};
    assert_median(findMedianSortedArrays(nums1, 2, nums2, 2), 2.5);
    printf("test_2 ok\n");
}

static void test_3(void) {
    int nums2[] = {1};
    assert_median(findMedianSortedArrays(NULL, 0, nums2, 1), 1.0);
    printf("test_3 ok\n");
}

static void test_4(void) {
    int nums1[] = {2};
    assert_median(findMedianSortedArrays(nums1, 1, NULL, 0), 2.0);
    printf("test_4 ok\n");
}

static void test_5(void) {
    int nums1[] = {0, 0};
    int nums2[] = {0, 0};
    assert_median(findMedianSortedArrays(nums1, 2, nums2, 2), 0.0);
    printf("test_5 ok\n");
}

int main(void) {
    test_1();
    test_2();
    test_3();
    test_4();
    test_5();
    printf("All tests passed.\n");
    return 0;
}
