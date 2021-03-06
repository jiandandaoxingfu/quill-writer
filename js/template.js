const template = 
`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1024" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>impress</title>
    <link rel="shortcut icon" href="favicon.ico" />
        
    <meta name="description" content="impress" />
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css">

    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <script type="text/javascript" src="js/jquery-3.4.1.slim.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    
    <!-- quill -->
    <link href="css/quill.snow.css" rel="stylesheet">
    <link rel="stylesheet" href="css/index.css" />
    <link rel="stylesheet" href="css/monokai-sublime.css" />

    <script src="js/highlight.pack.js"></script>
    <script src="js/quill.min.js"></script>
    <script src="js/image-resize.min.js"></script>
    <script src="js/image-drop.min.js"></script>

    <script type="text/javascript" src="js/scroll.js"></script>

    <!-- MathJax -->
    <script type="text/x-mathjax-config">
            MathJax.Hub.Config({
                messageStyle: 'none',
                tex2jax: {
                    inlineMath: [['$','$']]
                },
                "HTML-CSS": {
                    scale: 80
                },
                TeX: { 
                    equationNumbers: { }
                }
            });
        </script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=default"></script>
</head>

<body>
    <header></header>
    <div id="quill">
        <div id="editor"></div>
    </div>

    <div id="insert-link">
        <div class="input-groups insert-link">
            <h3>插入链接</h3>
            <div class="input-group">
                <span class="input-group-addon">文本</span>
                <input type="text" class="form-control" name="link-text">
            </div>    
            <div class="input-group">
                <span class="input-group-addon">地址</span>
                <input type="text" class="form-control" name="link-url">
            </div>    
            <button type="button" class="btn btn-default" onclick="insert_link();">插入</button>
        </div>
    </div>
    
    <div id="insert-video">
        <div class="input-groups insert-video">
            <h3>插入视频</h3>
            <div class="input-group">
                <span class="input-group-addon">名称</span>
                <input type="text" class="form-control" name="video-title">
            </div>    
            <div class="input-group">
                <span class="input-group-addon">地址</span>
                <input type="text" class="form-control" name="video-url">
            </div>    
            <div class="input-group">
                <span class="input-group-addon">或者</span>
                <input type="file" class="form-control" name="video-name">
            </div>
            <div class="select-file" tabindex="0">选择文件</div>
            <button type="button" class="btn btn-default" onclick="insert_video();">插入</button>
        </div>
    </div>

    <div id="formula-editor">
        <textarea id='input' oninput="latex_render();" placeholder="输入"></textarea>
        <button type="button" class="btn btn-default" onclick="insert_formula();">插入</button>
        <div id='output'>预览</div>
        <div id="buffer"></div>
    </div>

    <div id="save-filename">
        <div class="input-groups save-filename">
            <h3>保存文件</h3>
            <div class="input-group">
                <span class="input-group-addon">文件名</span>
                <input type="text" class="form-control" name="filename">
            </div>    
            <button type="button" class="btn btn-default" onclick="save_slides();">保存</button>
        </div>
    </div>

    <div id="tool">
        <button>编辑</button>
        <button id="insert-slide">插入</button>
        <button id="remove-slide">删除</button>
        <button>保存</button>
        <button>打印</button>
    </div>

    <div id="container">
        <div id="test">
            STEPS_TO_REPLACE
        </div>
    </div>

    <script type="text/javascript" src="js/quill-setup.js"></script>
    <script type="text/javascript" src="js/edit.js"></script>
    <script type="text/javascript" src="js/key-event.js"></script>
    
</body>
</html>
`