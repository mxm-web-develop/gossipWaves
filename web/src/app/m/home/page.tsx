// src/app/chat/page.tsx
import React from 'react';
// pages/home.tsx
import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  // 读取 JSON 文件

  const filePath = path.join(process.cwd(), 'database', 'web', 'home.json');
  console.log(filePath)
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);

  return {
    props: {
      data,
    },
    // 每 60 秒重新生成页面
    revalidate: 60,
  };
};
export default function HomePage() {
  return (
    <div>
      <h1>首页</h1>

    </div>
  );
};
