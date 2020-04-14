```js
import RouterView from './RouterView';

const router = [
    {
        path: 'a',
        component: RouterView,
        children: [
            {
                path: 'b',
                component: RouterView,
                children: [
                    path: 'c',
                    component: RouterView,
                ]
            }
        ]
    }
]
```

使用同一个RouterView渲染不会受影响， 每个都是独立的