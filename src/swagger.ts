export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Movie API",
    description: "API to manage movies",
    version: "1.0.0",
  },
  paths: {
    "/movie": {
      get: {
        summary: "Get all movies",
        responses: {
          "200": {
            description: "List of movies",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Movie",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new movie",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MovieInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Movie created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Movie",
                },
              },
            },
          },
        },
      },
    },
    "/movie/{movieId}": {
      get: {
        summary: "Get a movie by ID",
        parameters: [
          {
            name: "movieId",
            in: "path",
            description: "ID of the movie",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Movie details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Movie",
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update a movie by ID",
        parameters: [
          {
            name: "movieId",
            in: "path",
            description: "ID of the movie",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MovieInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Movie updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Movie",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a movie by ID",
        parameters: [
          {
            name: "movieId",
            in: "path",
            description: "ID of the movie",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Movie deleted successfully",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Movie: {
        type: "object",
        properties: {
          _id: { type: "string" },
          movieId: { type: "string" },
          name: { type: "string" },
          released_on: { type: "string" },
        },
      },
      MovieInput: {
        type: "object",
        properties: {
          movieId: { type: "string" },
          name: { type: "string" },
          released_on: { type: "string" },
        },
        required: ["movieId", "name", "released_on"],
      },
    },
  },
};
