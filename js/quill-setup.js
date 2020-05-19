function $$(id) {
	return document.getElementById(id);
}

// highlight.js配置
hljs.configure({
	languages: ['javascript', 'matlab', 'python', 'html', "mathematic", 'latex', 'R']
});

var toolbarOptions = [
	[{
		'size': ['10px', '12px', "14px", '16px', '18px', '20px', '22px', '24px', '26px', '32px', '48px', "60px", "72px", "96px", "144px", "180px", "225px"]
	}], // custom
	[{
		'font': ['Microsoft-YaHei', 'SimSun', 'SimHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']
	}],
	['bold', 'italic', 'underline', 'strike'], // toggled buttons
	['blockquote', 'code-block'],
	[{
		'list': 'ordered'
	}, {
		'list': 'bullet'
	}],
	[{
		'color': []
	}, {
		'background': []
	}], // dropdown with defaults from theme
	[{
		'align': []
	}],
	['link', 'image', 'video', 'formula']
];

var quill = new Quill('#editor', {
	modules: {
		toolbar: {
			container: toolbarOptions,
			handlers: {
				'video': function() {
					let range = quill.getSelection();
					index = range === null ? 0 : range.index;

					$('#insert-video h3')[0].innerText = "插入视频";
					$('input[name="video-name"]')[0].setAttribute("accept", "audio/mp4, video/mp4, video/3gpp, video/*");
					input_popup_change_view('insert-video');
				}
			}
		},
		imageDrop: !0,
		syntax: !0,
		imageResize: {
			modules: ['Resize', 'DisplaySize', 'Toolbar']
		},
	},
	placeholder: '',
	readOnly: !1,
	theme: 'snow'
});

// 显示或隐藏选择视频/编辑公式框
function input_popup_change_view(id) {
	let popup = $$(id);
	if( popup.style.zIndex === '5' ) {
		popup.style.opacity = 0;
		popup.style.zIndex = -1;
	} else {
		popup.style.zIndex = 5;
		popup.style.opacity = 1;
	}
}

// 插入链接

$('.ql-toolbar .ql-link')[0].onclick = function() {
	input_popup_change_view('insert-link');
}

function insert_link() {
	input_popup_change_view('insert-link');
	
	let text = $('[name="link-text"')[0].value;
	let url = $('[name="link-url"')[0].value;

	$('[name="link-text"')[0].value = '';
	$('[name="link-url"')[0].value = '';

	$('[data-formula="e=mc^2"]')[0].value = 'url';
	$('.ql-action')[0].click();

	if( text === "" || url === "" ) return;
	let a = $$('link');
	a.innerHTML = text;
	a.href = url;
	a.removeAttribute('id');
}


// 插入图片
$('.ql-toolbar .ql-image')[0].onclick = function() {
	$('#insert-video h3')[0].innerText = "插入图片";
	$('input[name="video-name"]')[0].setAttribute("accept", "image/png, image/gif, image/jpeg, image/bmp, image/x-icon");
	input_popup_change_view('insert-video');
}


// 插入视频/图片
var index = 0;
function insert_video() {	
	let name = $('[name="video-title"')[0].value;
	let url = $('[name="video-url"]')[0].value;
	if( url === '' ) {
		if( $('[name="video-name"]')[0].files.length !== 0 ) {
			url = $('[name="video-name"]')[0].files[0].name;
		}
	}

	$('[name="video-title"')[0].value = '';
	$('[name="video-url"]')[0].value = '';
	$('[name="video-name"]')[0].value = '';
	input_popup_change_view('insert-video');

	if( url !== '' ) {
		if( $('input[name="video-name"]')[0].getAttribute("accept").includes('image') ) {
			let img = $('img[src="   "]')[0];
			img.src = url.match(/^http/) ? url : 'image/' + url;
			img.parentElement.className = 'ql-align-center';
			$(`<p class="ql-align-center ql-size-18px">${name}</p>`).insertAfter(img.parentElement);
		} else {
			if( index === 0 ) index = 1;
			url = url.match(/^http/) ? url : 'video/' + url;
			quill.insertEmbed(index, 'video', url );
			$(`<p class="ql-align-center ql-size-18px" >${name}</p>`).insertAfter( $$('video') );
			$$('video').removeAttribute('id');
		}
	}
}

// 插入视频时，800ms后显示。
function show_first_frame(video) {
    setTimeout( () => {
    	video.style.opacity = 1;
    }, 800);
}


// 插入公式

$('.ql-toolbar .ql-formula')[0].onclick = function() {
	$('[data-formula="e=mc^2"]')[0].value = 'xxxx';
	$('.ql-action')[0].click();
	let ql_formula = $$('ql-formula');
	insert_formula_editor(ql_formula);
}

// 插入公式编辑
var islock = !1;
function insert_formula_editor(ql_formula) {
	let value = ql_formula.getAttribute('data-value');
	value === 'xxxx' && (value = '');
	div = document.createElement('div');
	div.id = "math-edit";
	div.innerHTML = `
		<textarea id='input' oninput="latex_render();" placeholder="输入"></textarea>
		<button type="button" class="btn btn-default" onclick="insert_formula();">插入</button>
        <div id='output'></div>
        <div id="buffer"></div>
	`
	ql_formula.parentNode.parentNode.insertBefore(div, ql_formula.parentNode.nextSibling);
	$$('input').value = value;
	latex_render();
	autoTextarea($$('input'), 30);
	$$('editing') && $$('editing').removeAttribute('id');
	ql_formula.id = 'editing';
	ql_formula.innerHTML = '<span style="background-color: #f0f0f0;">MATH</span>';
	$$('input').focus();
}

function insert_formula() {
	$$('editing') && (
		window.katex.render(
			$$('input').value, $$('editing')), 
		$$('editing').setAttribute('data-value', $$('input').value),
			$$('editing').removeAttribute('id'), 
			$$('math-edit').parentNode.removeChild($$('math-edit'))
		);
}

// 双击数学公式，重新编辑
document.addEventListener('click', e => {
	if( !window.is_edit ) return
	let ql_formula = e.path.slice(0, -4).filter( e => (e.className.toString() || '').includes('ql-formula') );
	if( ql_formula.length && ql_formula[0].tagName.toLowerCase() === "span" ) {
		!$$('math-edit') && insert_formula_editor(ql_formula[0]);
	}
})

// 公式预览
function latex_render() {
	if( islock ) return;
	islock = true;
	$$('buffer').innerHTML = '$' + $$('input').value.replace(/\n/g,"<br />") + '$';
	window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, $$('buffer')], [preview_math, $$("output")]);
} 

function preview_math() {
	islock = false;
	$$('output').innerHTML = $$('buffer').innerHTML;
}


// 字体，颜色，对齐方式等选择框

function close_picker() {
	let picker = $('.ql-expanded')[0];
	if( !picker ) return;
	picker.className = picker.className.replace('ql-expanded', '');
	picker.firstElementChild.setAttribute('aria-expanded', 'false');
	picker.firstElementChild.nextElementSibling.setAttribute('aria-hidden', 'true');
}

function open_picker(picker) {
	picker.parentElement.className += ' ql-expanded';
	picker.setAttribute('aria-expanded', 'true');
	picker.nextElementSibling.setAttribute('aria-hidden', 'false');
}

document.addEventListener('mousemove', e => {
	let picker = e.path.slice(0, -4).filter( ele => (ele.className.toString() || '').includes('ql-picker-label') ),
		cn = e.target.className.toString() || '',
		tg = e.target.tagName.toLowerCase();

	if( picker.length ) {
		let cn = picker[0].parentElement.className;
		if( !cn.includes('ql-expanded') ) {
			close_picker();
			open_picker(picker[0]);
		}
	} else if( cn.includes('ql-editor') || tg === 'button' ) {
		close_picker();
	}
})


// 编辑器内容变化时更新相应的slide
quill.on('text-change', () => {
	if( window.is_edit ) {
		let slide_ql_editor = document.createElement('div');
		slide_ql_editor.setAttribute('class', 'ql-editor ql-slide');
		slide_ql_editor.innerHTML = $$("editor").querySelector('.ql-editor').innerHTML;
		$('.active')[0].innerHTML = '';
		$('.active')[0].appendChild(slide_ql_editor);
	}
})