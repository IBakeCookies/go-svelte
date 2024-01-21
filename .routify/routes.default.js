

export default {
  "meta": {},
  "id": "_default",
  "name": "",
  "file": {
    "path": "src/routes",
    "dir": "src",
    "base": "routes",
    "ext": "",
    "name": "routes"
  },
  "rootName": "default",
  "routifyDir": import.meta.url,
  "children": [
    {
      "meta": {},
      "id": "_default_spa",
      "name": "spa",
      "module": false,
      "file": {
        "path": "src/routes/spa",
        "dir": "src/routes",
        "base": "spa",
        "ext": "",
        "name": "spa"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_spa_page_svelte",
          "name": "page",
          "file": {
            "path": "src/routes/spa/page.svelte",
            "dir": "src/routes/spa",
            "base": "page.svelte",
            "ext": ".svelte",
            "name": "page"
          },
          "asyncModule": () => import('../src/routes/spa/page.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_spa_page1_svelte",
          "name": "page1",
          "file": {
            "path": "src/routes/spa/page1.svelte",
            "dir": "src/routes/spa",
            "base": "page1.svelte",
            "ext": ".svelte",
            "name": "page1"
          },
          "asyncModule": () => import('../src/routes/spa/page1.svelte'),
          "children": []
        },
        {
          "meta": {},
          "id": "_default_spa_page2_svelte",
          "name": "page2",
          "file": {
            "path": "src/routes/spa/page2.svelte",
            "dir": "src/routes/spa",
            "base": "page2.svelte",
            "ext": ".svelte",
            "name": "page2"
          },
          "asyncModule": () => import('../src/routes/spa/page2.svelte'),
          "children": []
        }
      ]
    },
    {
      "meta": {
        "dynamic": true,
        "dynamicSpread": true,
        "order": false,
        "inline": false
      },
      "name": "[...404]",
      "file": {
        "path": ".routify/components/[...404].svelte",
        "dir": ".routify/components",
        "base": "[...404].svelte",
        "ext": ".svelte",
        "name": "[...404]"
      },
      "asyncModule": () => import('./components/[...404].svelte'),
      "children": []
    }
  ]
}