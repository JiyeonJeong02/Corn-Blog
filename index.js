import { writeFileSync } from 'node:fs';
import Parser from "rss-parser";

/**
 * README.MD에 작성될 페이지 텍스트
 * @type {string}
 */
let text = `# Hi there 👋

이 코드는 **Corn/sec(초당옥수수)의 최신 블로그 포스팅을 자동으로 업데이트** 합니다. 아래 링크에서 블로그 게시물을 확인할 수 있습니다. 🚀

📌 [Corn/sec(초당옥수수) 블로그 바로가기](https://chodang-corn.tistory.com/)


## 🔥 기술 스택
<p>
  <img alt="Python" src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=Python&logoColor=white"/> 
  <img alt="SQL" src="https://img.shields.io/badge/SQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> 
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/> 
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/>
</p>

## ✍🏼 주요 포스팅 주제
✔ **Python**: 데이터 분석, 알고리즘, 자동화 스크립트  
✔ **SQL**: 데이터베이스 쿼리 작성 및 최적화  
✔ **코딩테스트**: 프로그래머스, 백준 등 문제 풀이  


## 📕 Latest Blog Posts

`;

// rss-parser 생성
const parser = new Parser({
    headers: {
        Accept: 'application/rss+xml, application/xml, text/xml; q=0.1',
    },
    customFields: {
        item: ['title', 'link', 'description'] // 추가 필드 처리
    }
});

(async () => {
    try {
        // 피드 목록 가져오기
        const feed = await parser.parseURL('https://chodang-corn.tistory.com/rss'); // 본인의 블로그 주소

        // 피드 구조 검증
        if (!feed.items || feed.items.length === 0) {
            throw new Error('RSS 피드에서 게시글을 찾을 수 없습니다.');
        }

        text += `<ul>`;

        // 최신 10개의 글의 제목과 링크를 추가
        for (let i = 0; i < Math.min(10, feed.items.length); i++) {
            const item = feed.items[i];

            // 데이터 검증
            if (item.title && item.link) {
                console.log(`${i + 1}번째 게시물`);
                console.log(`추가될 제목: ${item.title}`);
                console.log(`추가될 링크: ${item.link}`);
                text += `<li><a href='${item.link}' target='_blank'>${item.title}</a></li>`;
            } else {
                console.warn(`${i + 1}번째 게시물에서 제목 또는 링크가 누락되었습니다.`);
            }
        }

        text += `</ul>`;

        // README.md 파일 생성
        writeFileSync('README.md', text, 'utf8');
        console.log('업데이트 완료');

    } catch (error) {
        console.error('오류 발생:', error.message);
        process.exit(1); // 에러 코드 반환 후 종료
    }
})();
