import 'express';

// 扩展一下 express 中的 request 接口，加入 user 属性，用于存放 AuthGuard 校验用户身份之后的结果
declare module 'express' {
  interface Request {
    user?: {
      id: number;
    };
  }
}
