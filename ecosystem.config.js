module.exports = {
  apps: [
    {
      name: "kush-dental-backend",
      script: "./start.sh",
      cwd: "./python_backend",
      autorestart: true,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "kush-dental-frontend",
      script: "serve",
      env: {
        PM2_SERVE_PATH: "./frontend/dist",
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html"
      }
    }
  ]
};
