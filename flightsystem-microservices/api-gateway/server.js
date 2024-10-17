const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

app.use('/airline',createProxyMiddleware({target:'http://airlinesinfo:3001',changeOrigin:true}));
app.use('/flight',createProxyMiddleware({target:'http://flightinfo:3002',changeOrigin:true}));
app.use('/passenger',createProxyMiddleware({target:'http://flightinfo:3003',changeOrigin:true}));

app.listen(PORT,()=>{
    console.log(`API Gateway running on port ${PORT}`);
});