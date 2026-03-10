namespace CandyGrabberApi.Services.Generators
{
    public static class MazeGenerator
    {
        public static int[][] Generate(int width, int height)
        {
            var rnd = new Random();
            var maze = new int[height][];

            for (int y = 0; y < height; y++)
            {
                maze[y] = new int[width];

                for (int x = 0; x < width; x++)
                {
                    maze[y][x] = rnd.NextDouble() < 0.18 ? 1 : 0;
                }
            }

            maze[0][0] = 0;
            maze[height - 1][width - 1] = 0;

            return maze;
        }
    }
}