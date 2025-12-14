/**
 * 链式代理覆写脚本
 * 
 * 功能：为机场节点添加 dialer-proxy，实现代理链
 * 流量路径：客户端 → 机场节点 → 自有VPS(🏠前缀) → 互联网
 * 
 * 使用方法：
 * 1. 在 Mihomo Party 覆写页面导入此脚本
 * 2. 确保 Sub-Store 中有 🏠 前缀的 VPS 节点
 * 3. 应用到需要链式代理的订阅
 */

function main(config) {
  // 找出所有 🏠 前缀的自有 VPS 节点
  const selfVpsNodes = config.proxies?.filter(p => p.name.startsWith('🏠')) || [];
  
  if (selfVpsNodes.length === 0) {
    console.log('警告：未找到 🏠 前缀的 VPS 节点，链式代理不会生效');
    return config;
  }
  
  // 使用第一个 🏠 节点作为出口（你也可以改成指定名称）
  const vpsNodeName = selfVpsNodes[0].name;
  console.log(`使用 VPS 节点作为出口: ${vpsNodeName}`);
  
  // 为所有非 🏠 节点添加 dialer-proxy
  config.proxies = config.proxies.map(proxy => {
    // 跳过 VPS 节点本身和信息节点
    if (proxy.name.startsWith('🏠') || 
        /GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置/i.test(proxy.name)) {
      return proxy;
    }
    
    // 为机场节点添加 dialer-proxy，使其通过 VPS 出口
    return {
      ...proxy,
      'dialer-proxy': vpsNodeName
    };
  });
  
  console.log(`已为 ${config.proxies.filter(p => p['dialer-proxy']).length} 个节点添加 dialer-proxy`);
  
  return config;
}
