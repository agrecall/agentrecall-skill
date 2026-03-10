#!/usr/bin/env node
/**
 * AgentRecall 本地脱敏模块
 * 
 * 三层脱敏防护：
 * 1. 结构化脱敏 - 识别 JSON 结构，替换敏感字段
 * 2. 熵脱敏 - 高熵字符串（密钥）替换
 * 3. AI 智能脱敏 - 识别敏感信息模式
 */

// ============================================
// 正则表达式模式
// ============================================

const API_KEY_PATTERNS = [
  /sk-[a-zA-Z0-9_-]{8,}/g,                  // OpenAI 等格式
  /sk-proj-[a-zA-Z0-9_-]{10,}/g,           // OpenAI Project
  /sk-ant-[a-zA-Z0-9_-]{10,}/g,            // Anthropic
  /ak_[a-zA-Z0-9_]{8,}/g,                  // AgentRecall
  /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*/g, // JWT
];

const IP_ADDRESS_PATTERN = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const JWT_PATTERN = /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g;
const PATH_PATTERN = /\/(home|Users)\/[^/\s]+/g;
const PASSWORD_PATTERN = /(password|passwd|pwd|secret|token|key|apikey|api_key)\s*[:=]\s*["']?[^\s"',;]+["']?/gi;

const PRIVATE_KEY_PATTERNS = [
  /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g,
  /-----BEGIN OPENSSH PRIVATE KEY-----[\s\S]*?-----END OPENSSH PRIVATE KEY-----/g,
];

// ============================================
// 熵检测
// ============================================

function calculateEntropy(str) {
  if (!str || str.length < 8) return 0;
  
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  
  let entropy = 0;
  const len = str.length;
  for (const count of Object.values(freq)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  
  return entropy;
}

// ============================================
// 三层脱敏
// ============================================

/**
 * 第一层：正则脱敏
 */
function regexSanitize(str) {
  let result = str;
  
  // API Keys
  for (const pattern of API_KEY_PATTERNS) {
    result = result.replace(pattern, '{API_KEY}');
  }
  
  // 私钥
  for (const pattern of PRIVATE_KEY_PATTERNS) {
    result = result.replace(pattern, '{PRIVATE_KEY}');
  }
  
  // IP 地址
  result = result.replace(IP_ADDRESS_PATTERN, '{IP_ADDRESS}');
  
  // 邮箱
  result = result.replace(EMAIL_PATTERN, '{EMAIL}');
  
  // JWT
  result = result.replace(JWT_PATTERN, '{JWT_TOKEN}');
  
  // 路径
  result = result.replace(PATH_PATTERN, '/{USER}/');
  
  // 密码
  result = result.replace(PASSWORD_PATTERN, '$1={REDACTED}');
  
  return result;
}

/**
 * 第二层：结构化脱敏
 */
function structureSanitize(str) {
  // 尝试解析 JSON
  try {
    const obj = JSON.parse(str);
    return JSON.stringify(sanitizeObject(obj));
  } catch {
    return str;
  }
}

function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return sanitizeStringValue(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.length > 0 ? [sanitizeObject(obj[0])] : [];
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // 敏感字段名
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('password') || lowerKey.includes('secret') || 
          lowerKey.includes('token') || lowerKey.includes('key')) {
        result[key] = '{REDACTED}';
      } else {
        result[key] = sanitizeObject(value);
      }
    }
    return result;
  }
  
  return obj;
}

function sanitizeStringValue(str) {
  const len = str.length;
  if (len >= 32 && len <= 64) {
    return `{STRING_LEN_${len}}`;
  }
  return str;
}

/**
 * 第三层：熵脱敏
 */
function entropySanitize(str) {
  // 匹配可能是密钥的长字符串
  return str.replace(/[a-zA-Z0-9_-]{32,}/g, (match) => {
    const entropy = calculateEntropy(match);
    if (entropy > 4.5) {
      return `{HIGH_ENTROPY_LEN_${match.length}}`;
    }
    return match;
  });
}

/**
 * 完整脱敏流程
 */
function sanitize(input) {
  if (typeof input === 'object') {
    input = JSON.stringify(input);
  }
  
  let result = String(input);
  
  // 三层脱敏
  result = regexSanitize(result);
  result = structureSanitize(result);
  result = entropySanitize(result);
  
  return result;
}

// ============================================
// CLI 接口
// ============================================

if (require.main === module) {
  const input = process.argv[2] || '';
  console.log(sanitize(input));
}

module.exports = { sanitize, regexSanitize, structureSanitize, entropySanitize, calculateEntropy };