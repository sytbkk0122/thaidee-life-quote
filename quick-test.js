/**
 * 泰迪生活快速测试套件
 * 轻量级版本 - 专注核心功能验证
 */

class QuickTester {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    try {
      fn();
      this.results.push({ name, status: 'PASS' });
      this.passed++;
      console.log(`✅ ${name}`);
    } catch (e) {
      this.results.push({ name, status: 'FAIL', error: e.message });
      this.failed++;
      console.error(`❌ ${name}: ${e.message}`);
    }
  }

  assert(condition, msg) {
    if (!condition) throw new Error(msg);
  }

  runAll() {
    console.log('🚀 快速功能测试开始\n');

    // ✅ 1. 核心元素检查
    console.log('📋 核心元素:');
    this.test('生成按钮存在', () => {
      this.assert(document.getElementById('btn-generate'), '按钮不存在');
    });
    this.test('模态框存在', () => {
      this.assert(document.getElementById('modal'), '模态框不存在');
    });

    // ✅ 2. 核心函数检查
    console.log('\n⚙️ 核心函数:');
    ['generateQuote', 'calcCosts', 'getCostCacheKey', 'updatePrice'].forEach(fn => {
      this.test(`${fn}() 可用`, () => {
        this.assert(typeof window[fn] === 'function', `${fn} 不可用`);
      });
    });

    // ✅ 3. 数据结构检查
    console.log('\n📊 数据结构:');
    this.test('SPOTS 数据可用', () => {
      this.assert(Array.isArray(SPOTS) && SPOTS.length > 0, 'SPOTS 缺失');
    });
    this.test('HOTELS 数据可用', () => {
      this.assert(Array.isArray(HOTELS) && HOTELS.length > 0, 'HOTELS 缺失');
    });
    this.test('S.days 初始化', () => {
      this.assert(Array.isArray(S.days), 'S.days 未初始化');
    });

    // ✅ 4. 价格计算
    console.log('\n💰 价格计算:');
    this.test('价格计算无错误', () => {
      const costs = calcCosts();
      this.assert(costs.perPerson > 0, '价格无效');
    });

    // ✅ 5. 报价单生成
    console.log('\n📄 报价单生成:');
    this.test('报价单生成成功', () => {
      generateQuote();
      const body = document.getElementById('modal-body');
      this.assert(body.innerHTML.includes('旅遊資訊'), '报价内容缺失');
    });
    this.test('模态框打开', () => {
      this.assert(document.getElementById('modal').classList.contains('open'), '模态框未打开');
    });

    // 📊 生成报告
    console.log('\n' + '═'.repeat(50));
    const total = this.passed + this.failed;
    const percent = ((this.passed / total) * 100).toFixed(1);
    console.log(`📊 测试结果: ${this.passed}/${total} 通过 (${percent}%)`);
    console.log('═'.repeat(50));

    return {
      passed: this.passed,
      failed: this.failed,
      total: total,
      percentage: percent
    };
  }
}

// 执行测试
const tester = new QuickTester();
window.quickTestReport = tester.runAll();
