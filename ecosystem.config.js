module.exports = {
  apps: [
    {
      name: "kush-dental-backend",
      script: "venv/bin/uvicorn",
      args: "app.main:app --host 127.0.0.1 --port 8000",
      cwd: "./python_backend",
      interpreter: "/home/ubuntu/dev/Kush-Dental-main/python_backend/venv/bin/python3",
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
        PM2_SERVE_HOST: "127.0.0.1",
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html"
      }
    },
    {
      name: "kush-dental-worker",
      script: "venv/bin/celery",
      args: "-A app.worker.celery_app worker --loglevel=info",
      cwd: "./python_backend",
      interpreter: "/home/ubuntu/dev/Kush-Dental-main/python_backend/venv/bin/python3",
      autorestart: true,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "kush-dental-dispatcher",
      script: "venv/bin/python",
      args: "-m app.dispatcher",
      cwd: "./python_backend",
      interpreter: "none",
      autorestart: true,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
