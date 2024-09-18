module.exports = {
  apps: [
    {
      name: "app",
      script: "./dist/app.js",
      exp_backoff_restart_delay: 100,
      max_memory_restart: "1G",
      max_restarts: 10,
      min_uptime: 2000,
      out_file: "/var/log/pm2/app/out.log",
      error_file: "/var/log/pm2/app/error.log",
    },
  ],
};
