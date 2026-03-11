using CandyGrabberApi.DTOs;

namespace CandyGrabberApi.Services.Generators
{
    public static class CandyGenerator
    {
        public static List<CandyDTO> Generate(int[][] maze, int count)
        {
            var rnd = new Random();
            var candies = new List<CandyDTO>();

            int height = maze.Length;
            int width = maze[0].Length;
            int gridSize = 50;

            while (candies.Count < count)
            {
                int x = rnd.Next(width);
                int y = rnd.Next(height);

                if (maze[y][x] == 1)
                    continue;

                if ((x == 0 && y == 0) || (x == width - 1 && y == height - 1)) continue;

                candies.Add(new CandyDTO
                {
                    X = x * gridSize + gridSize / 2,
                    Y = y * gridSize + gridSize / 2,
                    Collected = false
                });
            }

            return candies;
        }
    }
}