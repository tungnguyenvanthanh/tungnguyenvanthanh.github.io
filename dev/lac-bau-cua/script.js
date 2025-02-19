const icons = {
  'bau': '🍈', 
  'cua': '🦀',
  'ca': '🐟', 
  'nai': '🦌', 
  'ga': '🐓', 
  'tom': '🦐'
};

// Lấy danh sách con vật theo thứ tự
const animals = Object.keys(icons);

// Tạo SVG
const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("viewBox", "0 0 600 300"); // ViewBox tỉ lệ 2:1
svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
svg.style.width = "100%";
svg.style.height = "100%";
svg.style.border = "2px solid black";

const rows = 2, cols = 3;
const cellWidth = 600 / cols;
const cellHeight = 300 / rows;

animals.forEach((animal, index) => {
  const x = (index % cols) * cellWidth;
  const y = Math.floor(index / cols) * cellHeight;

  // Vẽ ô vuông
  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", cellWidth);
  rect.setAttribute("height", cellHeight);
  rect.setAttribute("fill", "#f5f5f5");
  rect.setAttribute("stroke", "black");
  rect.setAttribute("stroke-width", 2);
  svg.appendChild(rect);

  // Thêm emoji
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", x + cellWidth / 2);
  text.setAttribute("y", y + cellHeight / 2);
  text.setAttribute("font-size", "80");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "central");
  text.textContent = icons[animal];
  svg.appendChild(text);
});


// Thêm vào body
document.getElementById("board").appendChild(svg);
