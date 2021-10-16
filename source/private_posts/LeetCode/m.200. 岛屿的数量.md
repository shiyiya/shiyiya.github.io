
- [m.200. 岛屿的数量]()

```java
    public int numIslands(char[][] grid) {
        int num = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    num += 1;
                    numIslandsDfs(grid, i, j);
                }

            }
        }
        return num;
    }

    public void numIslandsDfs(char[][] grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0') return;
        grid[r][c] = '0';

        numIslandsDfs(grid, r + 1, c);
        numIslandsDfs(grid, r - 1, c);
        numIslandsDfs(grid, r, c + 1);
        numIslandsDfs(grid, r, c - 1);
    }

    public void numIslandsBfs(char[][] grid, int r, int c) {
        Queue<int[]> queue = new LinkedList<>();
        queue.add(new int[]{r, c});
        while (!queue.isEmpty()) {
            int[] curr = queue.remove();
            int x = curr[0], y = curr[1];
            if (x >= 0 && y >= 0 && x < grid.length && y < grid[0].length && grid[x][y] == '1') {
                grid[x][y] = '0';
                queue.add(new int[]{x + 1, y});
                queue.add(new int[]{x - 1, y});
                queue.add(new int[]{x, y + 1});
                queue.add(new int[]{x, y - 1});
            }
        }
    }
```