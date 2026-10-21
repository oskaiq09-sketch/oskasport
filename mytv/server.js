const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// تقديم الموقع
app.use(express.static(path.join(__dirname, 'public')));

const UPSTREAM = 'http://ugeen.live:8080';

const channels = {
  1: '/Ugeen_VIP8Z9E57/jueFRN/3221',
  2: '/Ugeen_VIP8Z9E57/jueFRN/3222',
  3: '/Ugeen_VIP8Z9E57/jueFRN/3224',
  4: '/Ugeen_VIP8Z9E57/jueFRN/3225',
  5: '/Ugeen_VIP8Z9E57/jueFRN/3226',
  6: '/Ugeen_VIP8Z9E57/jueFRN/3227',
};

// أي طلب يبدأ بـ /stream يُمرر للسيرفر
app.use('/stream', createProxyMiddleware({
  target: UPSTREAM,
  changeOrigin: true,
  pathRewrite: (path) => {
    // /stream/1 → رابط القناة | /stream/Ugeen.../3221.m3u8 → نفس المسار للسجلّات
    const id = path.split('/')[2];
    if (channels[id]) return channels[id];
    return path.replace('/stream', '');
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('Referer', UPSTREAM + '/');
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['access-control-allow-origin'] = '*';
  },
}));

app.listen(PORT, () => console.log('✅ شغال على البورت ' + PORT));
