// 根据屏幕宽度和slide宽度，在编辑状态时，对slide进行缩放。
function compute_style() {
	let width = window.innerWidth,
		toolbar_height = $('.ql-toolbar').outerHeight(),
		step_width = $('.active').outerWidth();
	
	let style = `
		.editing #test {
			transform-origin: left top;
			position: absolute;
			top: 5px;
			transform: scale(${0.3 * width / 900});
		}
		.editing #test .step {
			margin-left: calc(15vw - ${0.28 * width / 900 * 210 / 2}mm)
		}
	
		#quill #editor {
			height: calc(100% - ${toolbar_height}px);
		}`
	return style;
}

(function add_style() {
	let style = document.createElement('style');
	style.setAttribute('type', 'text/css');
	style.setAttribute('name', 'insertCss');
	style.innerHTML = compute_style();
	document.head.appendChild(style);
})();

window.onresize = function() {
	let width = window.innerWidth;
	$('[name="insertCss"]')[0].innerHTML = compute_style();
}

window.is_edit = !1;

// 初始时，隐藏编辑框和样式框
$$('quill').style.left = '-70%';

function quill_change_view() {
	let left = $$('quill').style.left;
	$$('quill').style.left = left === "-70%" ? 0 : "-70%";
	window.is_edit = !window.is_edit;
	let active_slide_index = $('.step').index( $('.active')[0] );
	if( window.is_edit ) {
		$$('container').className = 'editing';
		let steps = $('.step');
		steps[active_slide_index].classList.add('active');
		$$('insert-slide').style.display = 'block';
		$$('remove-slide').style.display = 'block';
		setTimeout( () => {
			scroll.scroll2middle(steps[active_slide_index]);
		}, 500);
	} else {
		$$('container').removeAttribute('class');
		$$('insert-slide').style.display = 'none';
		$$('remove-slide').style.display = 'none';
	}
	edit_slide();
}

function edit_slide() {
	let	active_slide = $('.active')[0];
	if( window.is_edit ) {
		let ele = active_slide.querySelector('.ql-slide');
		$$("editor").querySelector('.ql-editor').innerHTML = ele ? ele.innerHTML.replace(/(^\s+|\s+$)/g, '') : "";
	}
}

function insert_slide() {
	let active_slide = $('.active')[0];
	$('<div class="step"></div>').insertAfter(active_slide);
	let insert_slide = active_slide.nextElementSibling;
	insert_slide.classList.add('active');
	active_slide.classList.remove('active');
	update_slide_page_id();
	edit_slide();
	scroll.scroll2middle(insert_slide);
}

function remove_slide() {
	if( $('.step').length === 1 ) return;
	let active_slide = $('.active')[0];
	let next_slide = active_slide.nextElementSibling || active_slide.previousElementSibling;
	if( next_slide.tagName.toLowerCase() === 'footer' ) next_slide = active_slide.previousElementSibling;
	$$('test').removeChild(active_slide);
	next_slide.classList.add('active');
	update_slide_page_id();
	edit_slide();
	scroll.scroll2middle(next_slide);
}
function update_slide_page_id() {
	let steps = $('.step');
	let pages = steps.length;
	for(let i=0; i<pages; i++) {
		steps[i].setAttribute('data-page-id', i+1);
	}
}

function save_slides() {
	input_popup_change_view('save-filename');
	let filename = $('[name="filename"]')[0].value;
	if( filename === "" ) return;

	let slides = $$('test').innerHTML;
	slides = template.replace('STEPS_TO_REPLACE', slides);

	let a = document.createElement('a');
	let blob = new Blob([slides]);
	a.download = filename + '.html';
	a.href = URL.createObjectURL(blob);
	a.click();
	URL.revokeObjectURL(blob);
}

function play_slides() {
	quill_change_view();
	if( $$('container').className === 'editing' ) {
		$$('container').removeAttribute('class');
	} else {
		$$('container').className = 'editing';
	}
}

function editing_change_slide(slide) {
	$('.active')[0].className = 'step';
	slide.className = "step active";
	edit_slide();
	scroll.scroll2middle(slide);
}

document.addEventListener('click', e => {
	let ele = e.target,
		cn = ele.className || '',
		slide_with_ele = e.path.slice(0, -4).filter( e => {
			let cn = e.className.toString();
			return cn.includes('step') && !cn.includes('active');
		}),
		action = ele.innerText || '';

	if( action === "编辑" ) {
		quill_change_view();
	} else if( action === "插入" && !cn.includes('btn') ) {
		insert_slide();
	} else if( action === "删除" ) {
		remove_slide();
	} else if( action === "保存" && !cn.includes('btn') ) {
		input_popup_change_view('save-filename');
	} else if( action === "打印" ) {
		if( window.is_edit ) quill_change_view();
		window.print();
	} else if( window.is_edit && slide_with_ele.length ) { // 编辑幻灯片内容时，点击幻灯片进行切换。
		editing_change_slide(slide_with_ele[0]);
	}
})