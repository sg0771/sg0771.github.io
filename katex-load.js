// katex-load.js
(function(){
    // 加载CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);

    // 加载katex主脚本
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script1.onload = () => {
        // 加载自动渲染插件
        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js';
        script2.onload = () => {
            renderMathInElement(document.body, {
                delimiters: [
                    {left:"$", right:"$", display:false},
                    {left:"$$", right:"$$", display:true}
                ],
                throwOnError: false
            })
        }
        document.body.appendChild(script2);
    }
    document.body.appendChild(script1);
})();