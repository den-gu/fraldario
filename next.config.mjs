/** 
 * @type {import('next').NextConfig} 
 */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.ibb.co',
                port: '',
                // pathname: '/account123/**',
            },
          {
            protocol: 'https',
            hostname: 'raw.githubusercontent.com',
            port: '',
          },
        ],
    },
};

export default nextConfig;
