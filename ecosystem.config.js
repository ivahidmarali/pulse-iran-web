module.exports = {
  apps: [
    {
      name: "pulse-iran-web",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/root/pulse-iran-web",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_API_URL: "http://localhost:8000",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
