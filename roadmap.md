# Roadmap

## Milestone 4

- [ ] 加入 lint-stage 触发 eslint 及 commit 规范性校验

## Milestone 3

> 完善 CI/CD

- [ ] 接入 Github Action
- [ ] 接入 SonarQube
- [ ] 部署到 k3s 集群
- [ ] 接入 sentry（可选）

## Milestone 2

> 监控及部分业务

- [x] 完善健康检查，加入数据库检测
- [ ] 接入 Jaeger
- [ ] 加入几个业务模块，完善数据库和接口

## Milestone 1

> 项目基础结构完善

- [x] 模块划分
- [x] CoreModule 和 SharedModule 划分
- [x] 简单的健康检查
- [x] 自定义错误处理
- [x] x-request-id 及访问日志
- [x] 自动生成 Swagger 文档
- [x] 统一接口返回格式
- [x] 自动校验接口输入
- [x] Jwt 签发与校验
- [x] Prisma 集成
