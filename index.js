import { writeFileSync } from 'node:fs';
import Parser from "rss-parser";

/**
 * README.MD에 작성될 페이지 텍스트
 * @type {string}
 */
let text = `# Hi there 👋

## 이런 환경에 익숙해요✍🏼

## 언어

<p>
  <img alt="" src= "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/> 
  <img alt="" src= "https://img.shields.io/badge/TypeScript-black?logo=typescript&logoColor=blue"/>
</p>

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
