
import React from 'react';
import fs from 'fs';
import path from 'path';

export const revalidate = 60
export const dynamicParams = true // or false, to 404 on unknown paths
export const runtime = 'edge' // 'nodejs' (default) | 'edge'
export async function getServerSideProps() {
  // 读取 JSON 文件
  const filePath = path.join(process.cwd(), 'database', 'web', 'home.json');
  console.log('拿不到')
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  return {
    props: {
      data,
    },
  };
}

export default function HomePage({ data }) {

  console.log(data, '123123123')
  return (
    <div>
      <h1>首页</h1>

    </div>
  );
};

