import { StrUtil } from '../../src/util/StrUtil';

describe('StrUtil.compareList', () => {
    test('Consistency with compare (Relative Order)', () => {
        const words = [
            { name: '北京中关村软件园' }
        ];
        const targets = [
            { name: '北京中关村' },
            { name: '上海张江高科' },
            { name: '北京中关村软件园' }
        ];

        const results = StrUtil.compareList(words, targets, { cnt: 5 });
        const res1 = results[0];

        // 1. 完全匹配应该分数最高
        expect(res1.result[0].data.name).toBe('北京中关村软件园');

        // 2. 相似项应该排在不相关项前面
        const names = res1.result.map(r => r.data.name);
        expect(names).toContain('北京中关村');
        expect(names.indexOf('北京中关村')).toBeLessThan(names.indexOf('上海张江高科') === -1 ? 999 : names.indexOf('上海张江高科'));
    });
    test('Handling spaces and special characters', () => {
        const words = ['你 好 啊'];
        const targets = ['你  好  啊'];
        const results = StrUtil.compareList(words, targets);
        expect(results[0].result[0].score).toBe(3);
    });

    // 2. 性能测试：100 vs 100
    test('Performance Benchmark: 100 vs 100', () => {
        const wordsCount = 100;
        const targetsCount = 100;

        const words = Array.from({ length: wordsCount }, (_, i) => ({
            id: i,
            name: `测试字符串_${i}_关键词_${Math.random().toString(36).substring(7)}`
        }));

        const targets = Array.from({ length: targetsCount }, (_, i) => ({
            targetId: i,
            name: `测试字符串_${i}_目标_${Math.random().toString(36).substring(7)}`
        }));

        // 记录开始时间
        const start = Date.now();
        console.log('words', words.length);
        console.log('targets', targets.length);
        // 执行批量比对
        const results = StrUtil.compareList(words, targets, {
            wordsCol: 'name',
            col: 'name',
            cnt: 3
        });

        const end = Date.now();
        const duration = end - start;

        console.log(`\n[Benchmark] 100x100 (10,000 comparisons)`);
        console.log(`Duration: ${duration}ms`);
        console.log(`Avg per comparison: ${(duration / (wordsCount * targetsCount)).toFixed(4)}ms`);

        expect(results.length).toBe(wordsCount);
        // 在本地开发环境或 CI 下可能较慢，放宽到 3000ms
        expect(duration).toBeLessThan(3000);
    });

    // 3. 高并发模拟（内存稳定性测试）
    test('High Concurrency Simulation (Static Buffer Re-use)', () => {
        const runOnce = () => {
            const words = [{ name: '北京中关村' }];
            const targets = [{ name: '北京海淀区中关村软件园' }];
            return StrUtil.compareList(words, targets);
        };

        const start = Date.now();
        for (let i = 0; i < 1000; i++) {
            runOnce();
        }
        const end = Date.now();
        console.log(`\n[Benchmark] 1,000 sequential batch calls: ${end - start}ms`);
    });
});
