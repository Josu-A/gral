#include <limits.h>

static int max_int(int a, int b) { return a > b ? a : b; }
static int min_int(int a, int b) { return a < b ? a : b; }

double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {
    int n1 = nums1Size;
    int n2 = nums2Size;
    int n  = n1 + n2;

    if (n1 > n2) return findMedianSortedArrays(nums2, nums2Size, nums1, nums1Size);

    int partition = (n + 1) / 2;

    if (n1 == 0)
        return n2 % 2 ? nums2[n2 / 2] : (nums2[n2 / 2] + nums2[n2 / 2 - 1]) / 2.0;

    if (n2 == 0)
        return n1 % 2 ? nums1[n1 / 2] : (nums1[n1 / 2] + nums1[n1 / 2 - 1]) / 2.0;

    int left1 = 0;
    int right1 = n1;
    int cut1, cut2;
    int l1, r1, l2, r2;

    do {
        cut1 = (left1 + right1) / 2;
        cut2 = partition - cut1;

        l1 = cut1 == 0 ? INT_MIN : nums1[cut1 - 1];

        l2 = cut2 == 0 ? INT_MIN : nums2[cut2 - 1];

        r1 = cut1 >= n1 ? INT_MAX : nums1[cut1];

        r2 = cut2 >= n2 ? INT_MAX : nums2[cut2];

        if (l1 <= r2 && l2 <= r1)
            return n % 2 ? max_int(l1, l2)
                         : (max_int(l1, l2) + min_int(r1, r2)) / 2.0;
        else if (l1 > r2)
            right1 = cut1 - 1;
        else
            left1 = cut1 + 1;

    } while (left1 <= right1);

    return 0.0;
}
