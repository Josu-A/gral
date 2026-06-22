#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include "../src/solution.h"

static void test_1(void) {
    assert(isPalindrome(121) == true);
    printf("test_1 ok\n");
}

static void test_2(void) {
    assert(isPalindrome(-121) == false);
    printf("test_2 ok\n");
}

static void test_3(void) {
    assert(isPalindrome(10) == false);
    printf("test_3 ok\n");
}

static void test_4(void) {
    assert(isPalindrome(0) == true);
    printf("test_4 ok\n");
}

static void test_5(void) {
    assert(isPalindrome(12321) == true);
    printf("test_5 ok\n");
}

static void test_6(void) {
    assert(isPalindrome(12) == false);
    printf("test_6 ok\n");
}

int main(void) {
    test_1();
    test_2();
    test_3();
    test_4();
    test_5();
    test_6();
    printf("All tests passed.\n");
    return 0;
}
