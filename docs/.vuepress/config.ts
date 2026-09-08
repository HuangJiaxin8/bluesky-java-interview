import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { hopeTheme } from "vuepress-theme-hope";

export default defineUserConfig({
  bundler: viteBundler(),
  base: "/bluesky-java-interview/",
  lang: "zh-CN",
  title: "BlueSky的八股文",
  description: "Java面试八股文整理",

  theme: hopeTheme({
    logo: "/logo.svg",
    navbar: [
      { text: "首页", link: "/" },
      {
        text: "Java基础",
        children: [
          { text: "Java基础", link: "/java/Java基础" },
          { text: "Java集合容器", link: "/java/Java集合容器" },
          { text: "JVM", link: "/java/JVM" },
          { text: "多线程和并发", link: "/java/多线程和并发" },
        ],
      },
      {
        text: "数据库",
        children: [
          { text: "MySQL", link: "/database/MySQL" },
          { text: "Redis", link: "/database/Redis" },
          { text: "MyBatis", link: "/database/MyBatis" },
        ],
      },
      {
        text: "框架",
        children: [{ text: "Spring", link: "/framework/Spring" }],
      },
      {
        text: "中间件",
        children: [
          { text: "消息队列MQ", link: "/middleware/消息队列MQ" },
          { text: "ElasticSearch", link: "/middleware/ElasticSearch" },
          { text: "Netty-IO", link: "/middleware/Netty-IO" },
          { text: "Dubbo", link: "/middleware/Dubbo" },
        ],
      },
      {
        text: "分布式",
        children: [
          { text: "分布式理论", link: "/distributed/分布式-理论，锁，幂等性，算法" },
          { text: "分布式事务", link: "/distributed/分布式事务的解决方案" },
          { text: "注册中心", link: "/distributed/注册中心" },
          { text: "微服务和SpringCloud", link: "/distributed/微服务和SpringCloud" },
          { text: "鉴权加密", link: "/distributed/鉴权加密" },
        ],
      },
      {
        text: "更多",
        children: [
          { text: "设计模式", link: "/architecture/设计模式" },
          { text: "限流", link: "/architecture/限流" },
          { text: "Linux", link: "/other/Linux" },
          { text: "网络篇", link: "/other/网络篇" },
          { text: "场景题", link: "/scenario/" },
          { text: "代码题", link: "/coding/" },
        ],
      },
    ],

    sidebar: {
      "/java/": [
        {
          text: "Java基础",
          children: ["Java基础", "Java集合容器", "JVM", "多线程和并发"],
        },
      ],
      "/database/": [
        {
          text: "数据库",
          children: ["MySQL", "Redis", "MyBatis"],
        },
      ],
      "/framework/": [
        {
          text: "框架",
          children: ["Spring"],
        },
      ],
      "/middleware/": [
        {
          text: "中间件",
          children: ["消息队列MQ", "ElasticSearch", "Netty-IO", "Dubbo"],
        },
      ],
      "/distributed/": [
        {
          text: "分布式",
          children: [
            "分布式-理论，锁，幂等性，算法",
            "分布式事务的解决方案",
            "注册中心",
            "微服务和SpringCloud",
            "鉴权加密",
          ],
        },
      ],
      "/architecture/": [
        {
          text: "架构设计",
          children: ["设计模式", "限流"],
        },
      ],
      "/scenario/": [
        {
          text: "场景题",
          children: "structure",
        },
      ],
      "/coding/": [
        {
          text: "代码题",
          children: "structure",
        },
      ],
      "/other/": [
        {
          text: "其他",
          children: ["Linux", "网络篇", "科普知识", "Hr", "1 问题聚合"],
        },
      ],
    },

    copyright: "BlueSky的八股文",

    sidebarDepth: 2,

    editLink: false,

    contributors: false,

    lastUpdated: false,
  }),
});
