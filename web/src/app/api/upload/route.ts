import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// 允许的文件类型配置
const ALLOWED_TYPES = {
  pdf: ['application/pdf'],
  image: ['image/jpeg', 'image/png', 'image/gif']
};

const maxSize = 80 * 1024 * 1024; // 80MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string; // 'cover' | 'post' | 'article'
    const postId = formData.get('postId') as string; // 富文本编辑器的文章ID
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 验证文件大小
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds limit (80MB)' },
        { status: 400 }
      );
    }

    // 确定文件存储路径和验证文件类型
    let uploadDir: string;
    let fileUrl: string;
    
    switch (uploadType) {
      case 'article':
        if (!ALLOWED_TYPES.pdf.includes(file.type)) {
          return NextResponse.json({ error: 'Only PDF files are allowed for articles' }, { status: 400 });
        }
        uploadDir = path.join(process.cwd(), 'public', 'articles');
        break;
        
      case 'cover':
        if (!ALLOWED_TYPES.image.includes(file.type)) {
          return NextResponse.json({ error: 'Only images are allowed for covers' }, { status: 400 });
        }
        uploadDir = path.join(process.cwd(), 'public', 'images', 'coverimg');
        break;
        
      case 'post':
        if (!ALLOWED_TYPES.image.includes(file.type)) {
          return NextResponse.json({ error: 'Only images are allowed for posts' }, { status: 400 });
        }
        if (!postId) {
          return NextResponse.json({ error: 'Post ID is required for post images' }, { status: 400 });
        }
        uploadDir = path.join(process.cwd(), 'public', 'images', 'postimg', postId);
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
    }

    // 确保目录存在
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 生成文件名和保存文件
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const fileName = `${timestamp}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    // 将文件内容转换为 Buffer 并保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 生成文件访问URL
    switch (uploadType) {
      case 'article':
        fileUrl = `/articles/${fileName}`;
        break;
      case 'cover':
        fileUrl = `/images/coverimg/${fileName}`;
        break;
      case 'post':
        fileUrl = `/images/postimg/${postId}/${fileName}`;
        break;
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName,
      originalName: file.name,
      type: file.type,
      size: file.size
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 