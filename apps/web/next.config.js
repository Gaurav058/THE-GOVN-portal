/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  async redirects() {
    return [
      { source: '/jobs/graduate', destination: '/jobs/graduation', permanent: false },
      { source: '/jobs/state', destination: '/states', permanent: false },
      { source: '/exam-calendar', destination: '/exams', permanent: false },
    ];
  },
};

module.exports = nextConfig;
