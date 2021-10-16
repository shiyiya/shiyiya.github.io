
- [m.695. 岛屿的最大面积]()

```java
 public int maxAreaOfIsland(int[][] grid) {
        int num = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 1) {
                    // 根据当前坐标向 4 边走
                    num = Math.max(num, dfs(grid, i, j));
                }

            }
        }
        return num;
    }

   public int dfs(int[][] grid, int r, int c) {
        if (!inXY(grid, r, c)) return 0;

        if (grid[r][c] != 1) {
            return 0;
        }
        grid[r][c] = 2;
        // 深度优先
        return 1 + dfs(grid, r + 1, c) + dfs(grid, r - 1, c) + dfs(grid, r, c + 1) + dfs(grid, r, c - 1);
    }

    public boolean inXY(int[][] grid, int r, int c) {
        return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
    }
```