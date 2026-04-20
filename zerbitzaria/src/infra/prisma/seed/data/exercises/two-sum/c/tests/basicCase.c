#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include "../src/solution.h"

static int cmp_int(const void* a, const void* b) {
    int x = *(const int*)a, y = *(const int*)b;
    return (x > y) - (x < y);
}

static void assert_result(int* result, int returnSize, int e0, int e1) {
    assert(result != NULL);
    assert(returnSize == 2);
    qsort(result, 2, sizeof(int), cmp_int);
    assert(result[0] == e0);
    assert(result[1] == e1);
    free(result);
}

static void test_1(void) {
    int nums[] = {2, 7, 11, 15};
    int returnSize = 0;
    int* result = twoSum(nums, 4, 9, &returnSize);
    assert_result(result, returnSize, 0, 1);
    printf("test_1 ok\n");
}

static void test_2(void) {
    int nums[] = {3, 2, 4};
    int returnSize = 0;
    int* result = twoSum(nums, 3, 6, &returnSize);
    assert_result(result, returnSize, 1, 2);
    printf("test_2 ok\n");
}

static void test_3(void) {
    int nums[] = {3, 3};
    int returnSize = 0;
    int* result = twoSum(nums, 2, 6, &returnSize);
    assert_result(result, returnSize, 0, 1);
    printf("test_3 ok\n");
}

int main(void) {
    test_1();
    test_2();
    test_3();
    printf("All tests passed.\n");
    return 0;
}
