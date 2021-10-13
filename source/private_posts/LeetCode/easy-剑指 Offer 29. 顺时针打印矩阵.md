- [剑指 Offer 29. 顺时针打印矩阵](https://leetcode-cn.com/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/)


```java
public class LeetCode {
    public static void main(String[] args) {
        int[][] m = {
                {1, 2, 3, 1},
                {1, 3, 1, 3},
                {3, 4, 2, 1}
        };

        System.out.println(printMatrix(m));
        System.out.println(printMatrix2(m));
    }

    public static ArrayList<Integer> printMatrix(int[][] matrix) {
        ArrayList<Integer> result = new ArrayList<>();
        int y = matrix.length;
        if (y == 0) return result;

        int x = matrix[0].length;
        if (x == 0) return result;

        int lay = (Math.min(x, y) - 1) / 2 + 1; // 所需旋转层数
        for (int l = 0; l < lay; l++) {
            for (int xx = l; xx < x - l; xx++) { // left -> right
                result.add(matrix[l][xx]);
            }
            for (int yy = l + 1; yy < y - l; yy++) {// right -> bottom
                result.add(matrix[yy][x - l - 1]);
            }
            for (int XX = y - l - 1; XX > l; XX--) {// right  ->  left
                result.add(matrix[y - 1 - l][XX]);
            }
            for (int YY = y - l - 1; YY > l; YY--) {//  bottom -> top
                result.add(matrix[YY][l]);
            }
        }

        return result;
    }

    public static ArrayList<Integer> printMatrix2(int[][] matrix) {
        ArrayList<Integer> result = new ArrayList<>();
        int y = matrix.length;
        if (y == 0) return result;

        int x = matrix[0].length;
        if (x == 0) return result;

        int left = 0, top = 0;

        while (left < x && top < y) {

            for (int i = left; i < x; i++) {
                result.add(matrix[top][i]);
            }

            for (int i = top + 1; i < y; i++) {
                result.add(matrix[i][y]);
            }

            if (y - 1 != top) {// 只有一行不继续走
                for (int i = x - 2; i > left; i--) {
                    result.add(matrix[y - 1][i]);
                }
            }


            if (x - 1 != left) {
                for (int i = y - 1; i > top; i--) {
                    result.add(matrix[i][left]);
                }
            }


            left++;
            top++;
            x--;
            y--;
        }


        return result;
    }
}
```