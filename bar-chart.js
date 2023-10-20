const pollutantsList = ['pm2.5', 'pm10', 'o3', 'no2', 'so2', 'co_8hr'];
const pollutantsDomainList = {
    'pm2.5': [0, 15.4, 35.4, 54.4, 150.4, 200.4, 250.4, 350.4],
    'pm10': [0, 50, 100, 254, 354, 389, 424, 504],
    'o3': [0, 50, 100, 164, 204, 304, 404, 504],
    'no2': [0, 30, 100, 360, 649, 949, 1249, 1649],
    'so2': [0, 20, 75, 185, 304, 454, 604, 804],
    'co_8hr': [0, 4.4, 9.4, 12.4, 15.4, 22.9, 30.4, 40.4]
}
const colorGradientList = ["#47986A", "#ABC060", "#F4B850", "#CF543F", "#83186E", "#5F0E85", "#6B124C", "#450A17"];
const verticalLinesTime = [0, 6, 12, 18];
let records;


function waitForData(){
    if (window.globalVar){
        //
    } else {
        setTimeout(waitForData, 100);
    }
    return window.globalVar
  }

async function createPollutionsSection(sitename){
    if(sitename == '查無區域'){
        emptyPollutionSection();
    }
    else{
    records = await waitForData();
    renderPollutionsSection(records, sitename);
    }
}

function renderPollutionsSection(data, sitename){
    siteRecords = retriveSiteData(data, sitename);
    emptyPollutionSection();
    renderAqiSection(siteRecords);
    for(let i=0;i<pollutantsList.length;i++){
        let pollutantRecords = retriveEachIndex(siteRecords, pollutantsList[i]);
        renderPollutionText(pollutantsList[i], pollutantRecords[0].value);
        renderPollutionBarChart(pollutantsList[i], pollutantRecords);
    }
}

function retriveSiteData(data, sitename){
    const matchingData = [];
    data.forEach(record => {
        if (record.sitename === sitename) {
            matchingData.push(record);
        }
    });
    return matchingData;
}

function retriveEachIndex(data, indexName){
    const matchingData = [];
    data.forEach(record => {
        matchingData.push({
            time: record['datacreationdate'],
            value: parseInt(record[indexName], 10)
        });
    })
    return matchingData;
}

function renderAqiSection(data){
    const aqiScoreDiv = document.querySelector('.main_info_score_number');
    aqiScoreDiv.textContent = data[0].aqi;
    aqiScoreDiv.style.background = mappingScoreColor(data[0].status);
    const aqiRatingDiv = document.querySelector('.main_info_title_detail_rating_text');
    const rating = handleRatingString(data[0].status);
    aqiRatingDiv.textContent = rating;
    const aqiRatingEmojiDiv = document.querySelector('.main_info_title_detail_rating_image');
    const emojiImg = document.createElement('img');
    emojiImg.src = mappingEmoji(data[0].status);
    aqiRatingEmojiDiv.appendChild(emojiImg);
    const timeDiv = document.querySelector('.main_info_title_detail_time');
    timeDiv.textContent = data[0].datacreationdate;
}

function handleRatingString(rating){
    if(rating == '對敏感族群不健康'){
        return '敏感族群注意';
    }
    else if(rating == '對所有族群不健康'){
        return '不健康';
    }
    else{
        return rating;
    }
}

function mappingEmoji(rating){
    const ratingToEmojiMap = {
        '良好': 'starstruck',
        '普通': 'smiling',
        '對敏感族群不健康': 'meh',
        '對所有族群不健康': 'sad',
        '非常不健康': 'suffering',
        '危害': 'dizzy',
    };
    return './image/'+ratingToEmojiMap[rating]+'.png';
}

function mappingScoreColor(rating){
    const ratingToColorMap = {
        '良好': '#C0F182',
        '普通': '#FFF96F',
        '對敏感族群不健康': '#FFC36A',
        '對所有族群不健康': '#FF7C6A',
        '非常不健康': '#DE99FF',
        '危害': '#CAA596',
    };
    return ratingToColorMap[rating];
}

function renderPollutionText(pollutant, value){
    const nameDiv = document.getElementById(pollutant);
    nameDiv.textContent = pollutant.toUpperCase().split('_')[0];
    const valueDiv = document.getElementById(pollutant+'_pollutant_value');
    valueDiv.textContent = value;
}

function emptyPollutionSection(){
    const aqiScoreDiv = document.querySelector('.main_info_score_number');
    aqiScoreDiv.textContent = '';
    aqiScoreDiv.style.background = 'white';
    const aqiRatingTextDiv = document.querySelector('.main_info_title_detail_rating_text');
    aqiRatingTextDiv.textContent = '';
    const aqiTimeDiv = document.querySelector('.main_info_title_detail_time');
    aqiTimeDiv.textContent = '';
    const pollutantDivs = document.querySelectorAll('.pollutant');
    pollutantDivs.forEach(pollutant => {
        pollutant.textContent = '';
    })
    const pollutantValueDivs = document.querySelectorAll('.pollutant_value');
    pollutantValueDivs.forEach(value => {
        value.textContent = '';
    })
    const aqiRatingEmojiDiv = document.querySelector('.main_info_title_detail_rating_image');
    aqiRatingEmojiDiv.innerHTML = '';
    const barChartDivs = document.querySelectorAll('.bar_chart');
    barChartDivs.forEach(div => {
        div.innerHTML = '';
    })
}

function renderPollutionBarChart(pollutant, data){
    const container = document.getElementById(pollutant+'_bar_chart');
    // 視窗大小改變事件監聽器
    window.addEventListener("resize", () => {
        const width = container.clientWidth;
        svg.attr("width", width);
        x.range([0, width]);
        svg.selectAll("rect")
            .attr("x", (d, i) => width - x(i) - x.bandwidth())
            .attr("width", x.bandwidth());
        svg.selectAll("line.timeLine")
            .attr("x1", (d, i) => (width / data.length) * (Math.abs(data.indexOf(d)-data.length+1)+0.5))
            .attr("x2", (d, i) => (width / data.length) * (Math.abs(data.indexOf(d)-data.length+1)+0.5));
        svg.selectAll("line.seperationLine")
            .attr("x1", (d, i) => width/data.length*i)
            .attr("x2", (d, i) => width/data.length*i);
        svg.selectAll("line.xLine")
            .attr("x2", width);
        svg.selectAll("text")
            .attr("x", (d, i) => (width / data.length) * (Math.abs(data.indexOf(d)-data.length+1)+0.5));
    });
    // 開始繪製
    const width = container.clientWidth;
    const height = container.clientHeight;
    const marginTop = 30;
    // Declare the x (horizontal position) scale.
    const x = d3.scaleBand()
        .domain(data.map((d, i) => i))
        .range([0, width]);
    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.value)-10, d3.max(data, d => d.value)+5])
        .range([height, marginTop]);
    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);
    // 創建顏色比例尺，定義不同的顏色範圍
    const colorScale = d3.scaleLinear()
        .domain(pollutantsDomainList[pollutant])
        .range(colorGradientList);
    // 繪製重點時間(垂直灰長線)
    svg.selectAll("line.timeLine")
        .data(data.filter((d, i) => verticalLinesTime.includes(parseInt(d.time.substring(11, 13), 10))))
        .enter()
        .append("line")
        .attr("class", "timeLine")
        .attr("x1", (d, i) => (width / data.length) * (Math.abs(data.indexOf(d)-data.length+1)+0.5))
        .attr("y1", marginTop - 5)
        .attr("x2", (d, i) => (width / data.length) * (Math.abs(data.indexOf(d)-data.length+1)+0.5))
        .attr("y2", height)
        .attr("stroke", "gray")
        .attr("stroke-width", 1);
    svg.selectAll("text.timeText")
        .data(data.filter((d, i) => verticalLinesTime.includes(parseInt(d.time.substring(11, 13), 10))))
        .enter()
        .append("text")
        .attr("class", "timeText")
        .attr("x", (d, i) => (width / data.length) * (Math.abs(data.indexOf(d)-data.length+1)+0.5))
        .attr("y", marginTop - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .style("font-size", "14px")
        .text(d => parseInt(d.time.substring(11, 13), 10));
    // 創建長條圖
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => width - x(i) - x.bandwidth())
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        .transition()
        .duration(1000)
        .attr("y", d => (!isNaN(d.value) ? y(d.value) : height))
        .attr("height", d => (!isNaN(d.value) ? height - y(d.value) : 0))
        .attr("fill", d => colorScale(d.value));
    // 繪製間隔(垂直白長線)
    svg.selectAll("line.seperationLine")
        .data(data)
        .enter()
        .append("line")
        .attr("class", "seperationLine")
        .attr("x1", (d, i) => width/data.length*i)
        .attr("y1", marginTop)
        .attr("x2", (d, i) => width/data.length*i)
        .attr("y2", height) 
        .attr("stroke", "white")
        .attr("stroke-width", 1); 
    // 繪製水平灰線
    svg.append("line")
        .attr("class", "xLine")
        .attr("x1", 0)
        .attr("y1", height)
        .attr("x2", width)
        .attr("y2", height) 
        .attr("stroke", "gray") 
        .attr("stroke-width", 1);
    // Append the SVG element.
    container.append(svg.node());
}

function findCounty(cityName){
    for (const county in cityData) {
      if (cityData[county].includes(cityName)) {
        return county;
      }
    }
    return '無此縣市';
}

function changeCountySection(sitename){
    const county = findCounty(sitename);
    if(county != '無此縣市'){
        citySelect.value = county;
        showArea(county);
    }
}
