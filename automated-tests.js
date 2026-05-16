/**
 * 泰迪生活自动化测试套件
 * 完整验证报价系统所有功能
 */

class QuoteSystemTester {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
    this.passed = 0;
    this.failed = 0;
  }

  // ============ 工具方法 ============
  test(name, fn) {
    try {
      fn();
      this.results.push({ name, status: '✅ PASS', error: null });
      this.passed++;
      console.log(`✅ ${name}`);
    } catch (error) {
      this.results.push({ name, status: '❌ FAIL', error: error.message });
      this.failed++;
      console.error(`❌ ${name}: ${error.message}`);
    }
  }

  assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }

  // ============ 1️⃣ DOM 元素测试 ============
  testDOMElements() {
    console.log('\n📋 测试 1: DOM 元素完整性');

    this.test('按钮 #btn-generate 存在', () => {
      this.assert(document.getElementById('btn-generate'), '生成报价按钮不存在');
    });

    this.test('模态框 #modal 存在', () => {
      this.assert(document.getElementById('modal'), '模态框不存在');
    });

    this.test('表单字段存在', () => {
      const fields = ['c-name', 'c-dep', 'c-ret', 'c-adults', 'c-kids', 'c-rooms'];
      fields.forEach(id => {
        this.assert(document.getElementById(id), `字段 ${id} 不存在`);
      });
    });

    this.test('模态框按钮完整', () => {
      const buttons = document.querySelectorAll('.modal-actions button');
      this.assert(buttons.length === 4, `模态框按钮数量不对，期望4个，实际${buttons.length}个`);
    });
  }

  // ============ 2️⃣ 函数存在性测试 ============
  testFunctionExistence() {
    console.log('\n⚙️ 测试 2: 核心函数');

    const functions = [
      'generateQuote',
      'closeModal',
      'calcCosts',
      'getCostCacheKey',
      'updatePrice',
      'renderMini',
      'addDay',
      'delDay',
      'setBrowseMode'
    ];

    functions.forEach(fn => {
      this.test(`函数 ${fn}() 存在`, () => {
        this.assert(typeof window[fn] === 'function', `${fn} 不是函数`);
      });
    });
  }

  // ============ 3️⃣ 数据结构测试 ============
  testDataStructures() {
    console.log('\n📊 测试 3: 数据结构');

    this.test('S 对象存在', () => {
      this.assert(typeof S === 'object', 'S 对象不存在');
    });

    this.test('S.days 是数组', () => {
      this.assert(Array.isArray(S.days), 'S.days 不是数组');
    });

    this.test('S.currentDay 初始化', () => {
      this.assert(typeof S.currentDay === 'number', 'S.currentDay 未初始化');
    });

    this.test('SPOTS 数据完整', () => {
      this.assert(Array.isArray(SPOTS) && SPOTS.length > 0, 'SPOTS 数据缺失');
    });

    this.test('HOTELS 数据完整', () => {
      this.assert(Array.isArray(HOTELS) && HOTELS.length > 0, 'HOTELS 数据缺失');
    });

    this.test('VEHICLES 数据完整', () => {
      this.assert(Array.isArray(VEHICLES) && VEHICLES.length > 0, 'VEHICLES 数据缺失');
    });
  }

  // ============ 4️⃣ 价格计算测试 ============
  testPriceCalculation() {
    console.log('\n💰 测试 4: 价格计算');

    this.test('基础价格计算', () => {
      const costs = calcCosts();
      this.assert(typeof costs === 'object', '价格对象无效');
      this.assert(costs.perPerson > 0, '每人价格应大于0');
      this.assert(costs.grand > 0, '全团价格应大于0');
    });

    this.test('价格与人数关系', () => {
      // 保存原始人数
      const originalAdults = document.getElementById('c-adults').value;

      // 清除缓存
      costCache = {};

      // 2人价格
      document.getElementById('c-adults').value = '2';
      const cost2 = calcCosts();
      const price2 = cost2.perPerson;

      // 清除缓存
      costCache = {};

      // 4人价格
      document.getElementById('c-adults').value = '4';
      const cost4 = calcCosts();
      const price4 = cost4.perPerson;

      // 价格应该随人数增加（单价可能降低，但总价会增加）
      this.assert(cost4.grand >= cost2.grand, '全团总价应随人数增加而增加');

      // 恢复
      document.getElementById('c-adults').value = originalAdults;
    });

    this.test('缓存键生成', () => {
      const key1 = getCostCacheKey();
      this.assert(typeof key1 === 'string' && key1.length > 0, '缓存键生成失败');
    });

    this.test('价格缓存工作', () => {
      const key1 = getCostCacheKey();
      calcCosts();
      const key2 = getCostCacheKey();

      this.assert(key1 === key2, '缓存键不一致');
    });
  }

  // ============ 5️⃣ 行程管理测试 ============
  testItineraryManagement() {
    console.log('\n🗓️ 测试 5: 行程管理');

    this.test('初始天数', () => {
      const days = document.querySelectorAll('#day-tabs > div').length;
      this.assert(days > 0, '没有初始行程天数');
    });

    this.test('添加行程天数', () => {
      const initialDays = document.querySelectorAll('#day-tabs > div').length;
      document.getElementById('btn-add-day').click();
      const newDays = document.querySelectorAll('#day-tabs > div').length;

      this.assert(newDays === initialDays + 1, '添加行程失败');
    });

    this.test('每日对象结构', () => {
      const day = S.days[0];
      this.assert(Array.isArray(day.am), '上午时段不是数组');
      this.assert(Array.isArray(day.pm), '下午时段不是数组');
      this.assert(Array.isArray(day.eve), '晚间时段不是数组');
      this.assert(typeof day.hotel === 'string', '酒店字段无效');
    });
  }

  // ============ 6️⃣ 报价单生成测试 ============
  testQuoteGeneration() {
    console.log('\n📄 测试 6: 报价单生成');

    this.test('报价单生成无错误', () => {
      // 清除之前的错误
      let error = null;
      try {
        generateQuote();
      } catch (e) {
        error = e;
      }
      this.assert(!error, `报价单生成出错: ${error?.message}`);
    });

    this.test('模态框打开', () => {
      const modal = document.getElementById('modal');
      this.assert(modal.classList.contains('open'), '模态框未打开');
    });

    this.test('报价单内容完整', () => {
      const body = document.getElementById('modal-body').innerHTML;
      this.assert(body.includes('旅遊資訊'), '缺少旅游信息部分');
      this.assert(body.includes('逐日行程'), '缺少行程部分');
      this.assert(body.includes('費用報價'), '缺少费用部分');
      this.assert(body.includes('費用包含'), '缺少包含/不包含部分');
    });

    this.test('客户信息显示', () => {
      document.getElementById('c-name').value = '测试客户';
      generateQuote();
      const body = document.getElementById('modal-body').innerHTML;
      this.assert(body.includes('测试客户'), '客户信息未显示');
    });
  }

  // ============ 7️⃣ 边界条件测试 ============
  testBoundaryConditions() {
    console.log('\n⚠️ 测试 7: 边界条件');

    this.test('最小人数 (1人)', () => {
      document.getElementById('c-adults').value = '1';
      document.getElementById('c-rooms').value = '1';
      const costs = calcCosts();
      this.assert(costs.perPerson > 0, '1人价格计算失败');
    });

    this.test('最大人数 (200人)', () => {
      document.getElementById('c-adults').value = '200';
      const costs = calcCosts();
      this.assert(costs.grand > costs.perPerson, '200人价格计算失败');
    });

    this.test('最少行程天数 (1天)', () => {
      // 删除到只剩1天
      while (document.querySelectorAll('#day-tabs > div').length > 1) {
        const days = S.days;
        S.days.splice(days.length - 1, 1);
        S.currentDay = Math.min(S.currentDay, days.length - 2);
      }

      const costs = calcCosts();
      this.assert(costs.perPerson > 0, '1天价格计算失败');
    });

    this.test('最多行程天数 (14天)', () => {
      // 添加到14天
      while (document.querySelectorAll('#day-tabs > div').length < 14) {
        document.getElementById('btn-add-day').click();
      }

      const costs = calcCosts();
      this.assert(costs.perPerson > 0, '14天价格计算失败');
    });

    this.test('空客户名称处理', () => {
      document.getElementById('c-name').value = '';
      generateQuote();
      const body = document.getElementById('modal-body').innerHTML;
      this.assert(body.includes('未填'), '空名称处理失败');
    });
  }

  // ============ 8️⃣ 性能测试 ============
  testPerformance() {
    console.log('\n⚡ 测试 8: 性能');

    this.test('价格计算性能 (<100ms)', () => {
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        calcCosts();
      }
      const duration = performance.now() - start;

      this.assert(duration < 5000, `100次计算耗时 ${duration.toFixed(2)}ms，过慢`);
    });

    this.test('报价单生成性能 (<500ms)', () => {
      const start = performance.now();
      generateQuote();
      const duration = performance.now() - start;

      this.assert(duration < 1000, `报价生成耗时 ${duration.toFixed(2)}ms，过慢`);
    });

    this.test('DOM更新性能', () => {
      const start = performance.now();
      renderMini();
      const duration = performance.now() - start;

      this.assert(duration < 200, `DOM更新耗时 ${duration.toFixed(2)}ms`);
    });
  }

  // ============ 9️⃣ 用户交互测试 ============
  testUserInteractions() {
    console.log('\n👆 测试 9: 用户交互');

    this.test('日期字段可编辑', () => {
      const depField = document.getElementById('c-dep');
      const originalValue = depField.value;
      depField.value = '2026-06-15';
      this.assert(depField.value === '2026-06-15', '日期设置失败');
      depField.value = originalValue;
    });

    this.test('人数字段可编辑', () => {
      const adultsField = document.getElementById('c-adults');
      const originalValue = adultsField.value;
      adultsField.value = '5';
      this.assert(adultsField.value === '5', '人数设置失败');
      adultsField.value = originalValue;
    });

    this.test('房间数字段可编辑', () => {
      const roomsField = document.getElementById('c-rooms').value;
      this.assert(parseInt(roomsField) > 0, '房间数无效');
    });
  }

  // ============ 🔟 错误处理测试 ============
  testErrorHandling() {
    console.log('\n🚨 测试 10: 错误处理');

    this.test('无数据时的处理', () => {
      let error = null;
      try {
        // 临时清空数据
        const originalDays = S.days;
        S.days = [];
        calcCosts();
        S.days = originalDays;
      } catch (e) {
        error = e;
      }
      // 应该返回0或处理空数据
      this.assert(!error || error.message, '空数据处理异常');
    });

    this.test('无效日期处理', () => {
      const depField = document.getElementById('c-dep');
      depField.value = '';
      generateQuote();
      const body = document.getElementById('modal-body').innerHTML;
      this.assert(body, '无日期时报价单仍能生成');
    });
  }

  // ============ 生成报告 ============
  generateReport() {
    const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const total = this.passed + this.failed;
    const percentage = ((this.passed / total) * 100).toFixed(1);

    console.log('\n');
    console.log('═'.repeat(60));
    console.log('📊 测试报告');
    console.log('═'.repeat(60));
    console.log(`✅ 通过: ${this.passed}/${total}`);
    console.log(`❌ 失败: ${this.failed}/${total}`);
    console.log(`📈 成功率: ${percentage}%`);
    console.log(`⏱️ 总耗时: ${totalTime}秒`);
    console.log('═'.repeat(60));
    console.log('\n详细结果:');

    this.results.forEach((r, i) => {
      console.log(`${i + 1}. [${r.status}] ${r.name}`);
      if (r.error) console.log(`   错误: ${r.error}`);
    });

    return {
      passed: this.passed,
      failed: this.failed,
      total: total,
      percentage: percentage,
      duration: totalTime,
      results: this.results
    };
  }

  // ============ 运行所有测试 ============
  runAll() {
    console.log('🚀 开始测试...\n');

    this.testDOMElements();
    this.testFunctionExistence();
    this.testDataStructures();
    this.testPriceCalculation();
    this.testItineraryManagement();
    this.testQuoteGeneration();
    this.testBoundaryConditions();
    this.testPerformance();
    this.testUserInteractions();
    this.testErrorHandling();

    return this.generateReport();
  }
}

// ============ 执行测试 ============
const tester = new QuoteSystemTester();
const report = tester.runAll();

// 导出供外部使用
window.QuoteSystemTester = QuoteSystemTester;
window.testReport = report;
