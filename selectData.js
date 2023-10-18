const cityData = {
	屏東縣: ['屏東(枋山)', '屏東(琉球)', '恆春', '潮州', '屏東'],
	新北市: [
		'新北(樹林)',
		'富貴角',
		'永和',
		'三重',
		'淡水',
		'林口',
		'菜寮',
		'新莊',
		'板橋',
		'土城',
		'新店',
		'萬里',
		'汐止',
	],
	臺中市: ['臺中(大甲)', '西屯', '忠明', '大里', '沙鹿', '豐原'],
	臺南市: ['臺南(麻豆)', '臺南', '安南', '善化', '新營'],
	高雄市: [
		'高雄(湖內)',
		'復興',
		'小港',
		'前鎮',
		'前金',
		'左營',
		'楠梓',
		'林園',
		'大寮',
		'鳳山',
		'仁武',
		'橋頭',
		'美濃',
	],
	彰化縣: ['彰化(員林)', '大城', '二林', '線西', '彰化'],
	雲林縣: ['麥寮', '臺西', '崙背', '斗六'],
	臺東縣: ['關山', '臺東'],
	澎湖縣: ['馬公'],
	金門縣: ['金門'],
	連江縣: ['馬祖'],
	南投縣: ['埔里', '竹山', '南投'],
	桃園市: ['中壢', '龍潭', '平鎮', '觀音', '大園', '桃園'],
	宜蘭縣: ['冬山', '宜蘭'],
	臺北市: ['陽明', '大同', '松山', '古亭', '萬華', '中山', '士林'],
	花蓮縣: ['花蓮'],
	嘉義市: ['嘉義'],
	嘉義縣: ['朴子', '新港'],
	苗栗縣: ['三義', '苗栗', '頭份'],
	新竹市: ['新竹'],
	新竹縣: ['竹東', '湖口'],
	基隆市: ['基隆'],
};

const areaData = [];

for (const city in cityData) {
	areaData.push(...cityData[city]);
}

// 獲取下拉式選單元素
const citySelect = document.getElementById('citySelect');
const areaDisplay = document.getElementById('areaDisplay');

// 創建城市選項
for (const city in cityData) {
	const cityOption = document.createElement('option');
	cityOption.value = city;
	cityOption.text = city;
	citySelect.appendChild(cityOption);
}
citySelect.value = '臺南市';

document.addEventListener('DOMContentLoaded', function () {
	citySelect.dispatchEvent(new Event('change'));
});

citySelect.addEventListener('change', () => {
	const selectedCity = citySelect.value;
	const areas = cityData[selectedCity];

	// 清空區域顯示區域
	areaDisplay.innerHTML = '';

	// 創建每個區域的 div 元素，然後將其添加到區域顯示區域
	areas.forEach((area) => {
		const areaDiv = document.createElement('button');
		areaDiv.textContent = area;
		areaDiv.classList.add('area_button');
		areaDisplay.appendChild(areaDiv);
	});
});

// list_bar左右捲動
function areaScrollList(direction) {
	const listContainer = document.getElementById('areaDisplay');
	const currentScrollLeft = listContainer.scrollLeft;
	const scrollAmount = listContainer.clientWidth - 20;
	let newScrollLeft;

	if (direction === 'left') {
		newScrollLeft = currentScrollLeft - scrollAmount;
	} else if (direction === 'right') {
		newScrollLeft = currentScrollLeft + scrollAmount;
	}
	listContainer.scroll({ top: 0, left: newScrollLeft, behavior: 'smooth' });
}

function setupListBarScroll() {
	let leftBtn = document.getElementById('leftBtn');
	let rightBtn = document.getElementById('rightBtn');

	leftBtn.addEventListener('click', () => areaScrollList('left'));
	rightBtn.addEventListener('click', () => areaScrollList('right'));
}
setupListBarScroll();

// 監測地區顯示
const searchArea = document.getElementById('searchArea');

document.addEventListener('click', (event) => {
	if (event.target.classList.contains('area_button')) {
		searchArea.textContent = event.target.textContent;
		createPollutionsSection(event.target.textContent);
	}
});

// 搜尋框
const searchBox = document.getElementById('searchBox');
const searchImage = document.querySelector('.search_image');

searchBox.addEventListener('click', () => {
	searchImage.style.display = 'none';
	searchBox.value = '';
});

searchBox.addEventListener('blur', () => {
	searchImage.style.display = 'block';
	searchBox.value = '';
});

searchBox.addEventListener('keyup', function (event) {
	if (event.key === 'Enter') {
		const searchText = searchBox.value;
		searchArea.textContent = '';

		const matchingCity = Object.keys(cityData).find(
			(city) => city === searchText
		);
		const matchingAreas = areaData.find((areas) =>
			areas.includes(searchText)
		);

		if (matchingCity) {
			searchArea.textContent = matchingCity;
		} else if (matchingAreas) {
			searchArea.textContent = matchingAreas;
		} else {
			searchArea.textContent = '查無區域';
		}
	}
});
