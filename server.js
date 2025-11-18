const express = require('express');
const cors = require('cors');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 环境变量中的访问码
const VALID_ACCESS_CODES = process.env.ACCESS_CODES ? process.env.ACCESS_CODES.split(',') : ['test123'];

// API路由
// 验证访问码
app.post('/api/validate-code', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ success: false, message: '请输入访问码' });
  }

  // 检查环境变量中的访问码
  if (VALID_ACCESS_CODES.includes(code)) {
    return res.json({ 
      success: true, 
      message: '验证成功',
      code: code
    });
  }

  res.status(401).json({ 
    success: false, 
    message: '无效的访问码，请检查或联系管理员' 
  });
});

// 提交测试结果（简化版，只记录日志）
app.post('/api/submit-result', (req, res) => {
  try {
    const { userCode, answers, scores, coreMandate, secondaryMandate, thinkingAnalysis, totalTime } = req.body;
    
    // 只记录日志，不存储数据
    console.log('测试结果提交:', {
      userCode,
      coreMandate,
      secondaryMandate,
      totalTime,
      timestamp: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      message: '结果处理成功'
    });
  } catch (error) {
    console.error('处理结果错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '处理结果失败' 
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: '神兽命格测试API服务运行正常'
  });
});

// 根路径
app.get('/', (req, res) => {
  res.json({ 
    message: '神兽命格测试API服务运行中',
    version: '1.0.0',
    endpoints: {
      'POST /api/validate-code': '验证访问码',
      'POST /api/submit-result': '提交测试结果（仅日志）',
      'GET /health': '健康检查'
    }
  });
});

const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`可用访问码: ${VALID_ACCESS_CODES.join(', ')}`);
});