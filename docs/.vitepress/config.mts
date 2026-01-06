import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/bagu/',
  title: "Bagu for me and for all",
  description: "We need bagu to get a f**king job!",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'JDK与数据结构', link: '/Java与数据结构基础' },
      { text: '数据库', link: '/数据库' },
      { text: 'Elasticsearch', link: '/Elasticsearch' },
      { text: 'LLM与Agent', link: '/LLM与Agent' },
      { text: 'Spring', link: '/Spring' },
      { text: 'JVM与性能调优', link: '/JVM' },
      { text: '高性能Redis', link: '/高性能Redis' },
      { text: '消息队列', link: '/消息队列' },
      { text: '图和树', link: '/数据结构' },
      { text: '计算机网络', link: '/计算机网络' },
      { text: 'Linux', link: '/Linux命令' }
    ],
    search: {
      provider: 'local'
    },

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/l0sgAi' }
    ]
  }
})
