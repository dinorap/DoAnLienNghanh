var nameProduct, maProduct, sanPhamHienTai, selectedRom, selectedColor; // Tên sản phẩm trong trang này,
// là biến toàn cục để có thể dùng ở bát cứ đâu trong trang
// không cần tính toán lấy tên từ url nhiều lần

window.onload = function () {
  khoiTao();

  // thêm tags (từ khóa) vào khung tìm kiếm
  var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
  for (var t of tags) addTags(t, "index.html?search=" + t, true);

  phanTich_URL_chiTietSanPham();

  // autocomplete cho khung tim kiem
  autocomplete(document.getElementById("search-box"), list_products);

  // Thêm gợi ý sản phẩm
  sanPhamHienTai && suggestion();
};

function khongTimThaySanPham() {
  document.getElementById("productNotFound").style.display = "block";
  document.getElementsByClassName("chitietSanpham")[0].style.display = "none";
}

function phanTich_URL_chiTietSanPham() {
  nameProduct = window.location.href.split("?")[1]; // lấy tên
  if (!nameProduct) return khongTimThaySanPham();

  // tách theo dấu '-' vào gắn lại bằng dấu ' ', code này giúp bỏ hết dấu '-' thay vào bằng khoảng trắng.
  // code này làm ngược lại so với lúc tạo href cho sản phẩm trong file classes.js
  nameProduct = nameProduct.split("-").join(" ");

  for (var p of list_products) {
    if (nameProduct == p.name) {
      maProduct = p.masp;
      break;
    }
  }

  sanPhamHienTai = timKiemTheoMa(list_products, maProduct);
  if (!sanPhamHienTai) return khongTimThaySanPham();

  var divChiTiet = document.getElementsByClassName("chitietSanpham")[0];

  // Đổi title
  document.title = nameProduct + " - Thế giới điện thoại";

  // Cập nhật tên h1
  var h1 = divChiTiet.getElementsByTagName("h1")[0];
  h1.innerHTML += nameProduct;

  // Cập nhật sao
  var rating = "";
  if (sanPhamHienTai.rateCount > 0) {
    for (var i = 1; i <= 5; i++) {
      if (i <= sanPhamHienTai.star) {
        rating += `<i class="fa fa-star"></i>`; // sao vàng
      } else {
        rating += `<i class="fa fa-star-o"></i>`; //sao đen
      }
    }
    rating += `<span> ` + sanPhamHienTai.rateCount + ` đánh giá</span>`;
  }
  divChiTiet.getElementsByClassName("rating")[0].innerHTML += rating;

  // Cập nhật giá + label khuyến mãi
  var price = divChiTiet.getElementsByClassName("area_price")[0];
  if (sanPhamHienTai.promo.name != "giareonline") {
    price.innerHTML = `<strong>` + sanPhamHienTai.price + `₫</strong>`;
    price.innerHTML += new Promo(
      sanPhamHienTai.promo.name,
      sanPhamHienTai.promo.value
    ).toWeb();
  } else {
    document.getElementsByClassName("ship")[0].style.display = ""; // hiển thị 'giao hàng trong 1 giờ'
    price.innerHTML =
      `<strong>` +
      sanPhamHienTai.promo.value +
      `&#8363;</strong>
					        <span>` +
      sanPhamHienTai.price +
      `&#8363;</span>`;
  }

  // Cập nhật chi tiết khuyến mãi
  document.getElementById("detailPromo").innerHTML =
    getDetailPromo(sanPhamHienTai);

  // Cập nhật thông số
  var info = document.getElementsByClassName("info")[0];
  var mauArray = sanPhamHienTai.detail.color.split(" , ");
  selectedColor = mauArray[0]; // Lấy màu đầu tiên trong mảng làm màu được chọn lần đầu

  var romArray = sanPhamHienTai.detail.rom.split(" , "); // Mảng các dung lượng bộ nhớ trong
  selectedRom = romArray[0]; // Lấy dung lượng bộ nhớ đầu tiên trong mảng làm dung lượng được chọn lần đầu

  // Cập nhật thông tin sản phẩm khi trang được load lần đầu
  updateProductInfo(selectedColor, selectedRom);

  var chosecolorDiv = document.querySelector(".choosecolor");
  chosecolorDiv.innerHTML = "";

  // Tạo button cho mỗi màu và thêm vào div chosecolor
  mauArray.forEach(function (color, index) {
    var button = document.createElement("button");
    button.classList.add("button1");
    button.textContent = color;
    if (index === 0) {
      button.classList.add("selected");
    }
    // Lắng nghe sự kiện khi click vào nút màu
    button.addEventListener("click", function () {
      selectedColor = color;
      updateProductInfo(selectedColor, selectedRom);
      toggleSelection(button, document.querySelectorAll("#row1 .button1"));
    });

    // Thêm nút vào div chosecolor
    if (mauArray.length > 1) {
      chosecolorDiv.appendChild(button);
    }
  });

  var chooseRomDiv = document.querySelector(".choose-rom");
  chooseRomDiv.innerHTML = "";

  // Tạo button cho mỗi dung lượng bộ nhớ trong và thêm vào div choose-rom
  romArray.forEach(function (rom, index) {
    var button = document.createElement("button");
    button.textContent = rom;
    button.classList.add("button1");
    if (index === 0) {
      button.classList.add("selected");
    }
    // Lắng nghe sự kiện khi click vào nút bộ nhớ trong
    button.addEventListener("click", function () {
      selectedRom = rom;
      updateProductInfo(selectedColor, selectedRom);
      toggleSelection(button, document.querySelectorAll("#row2 .button1"));
    });

    // Thêm nút vào div choose-rom
    if (mauArray.length > 1) {
      chooseRomDiv.appendChild(button);
    }
  });

  function toggleSelection(selectedButton, buttons) {
    buttons.forEach((button) => {
      button.classList.remove("selected");
    });
    selectedButton.classList.add("selected");
  }

  // Hàm cập nhật thông số sản phẩm dựa trên màu và dung lượng bộ nhớ trong được chọn
  function updateProductInfo(selectedColor, selectedRom) {
    var s = "";

    // Thêm thông số sản phẩm dựa trên màu đã chọn
    s += addThongSo("Màn hình", sanPhamHienTai.detail.screen);
    s += addThongSo("Hệ điều hành", sanPhamHienTai.detail.os);
    s += addThongSo("Camara sau", sanPhamHienTai.detail.camara);
    s += addThongSo("Camara trước", sanPhamHienTai.detail.camaraFront);
    s += addThongSo("CPU", sanPhamHienTai.detail.cpu);
    s += addThongSo("RAM", sanPhamHienTai.detail.ram);

    // Thêm dung lượng bộ nhớ trong đã chọn vào thông số sản phẩm
    s += addThongSo("Bộ nhớ trong", selectedRom);

    s += addThongSo("Thẻ nhớ", sanPhamHienTai.detail.microUSB);
    s += addThongSo("Màu", selectedColor); // Thêm màu được chọn vào bảng thông số
    s += addThongSo("Dung lượng pin", sanPhamHienTai.detail.battery);

    info.innerHTML = s; // Hiển thị thông tin sản phẩm lên trang web
  }

  // Cập nhật hình
  var hinh = divChiTiet.getElementsByClassName("picture")[0];
  hinh = hinh.getElementsByTagName("img")[0];
  hinh.src = sanPhamHienTai.img;
  document.getElementById("bigimg").src = sanPhamHienTai.img;

  // Hình nhỏ
  addSmallImg("img/products/huawei-mate-20-pro-green-600x600.jpg");
  addSmallImg("img/chitietsanpham/oppo-f9-mau-do-1-org.jpg");
  addSmallImg("img/chitietsanpham/oppo-f9-mau-do-2-org.jpg");
  addSmallImg("img/chitietsanpham/oppo-f9-mau-do-3-org.jpg");
  addSmallImg("img/products/huawei-mate-20-pro-green-600x600.jpg");
  addSmallImg("img/chitietsanpham/oppo-f9-mau-do-3-org.jpg");
  addSmallImg("img/products/huawei-mate-20-pro-green-600x600.jpg");

  // Khởi động thư viện hỗ trợ banner - chỉ chạy sau khi tạo xong hình nhỏ
  var owl = $(".owl-carousel");
  owl.owlCarousel({
    items: 13,
    center: true,
    smartSpeed: 450,
  });
}

// Chi tiết khuyến mãi
function getDetailPromo(sp) {
  switch (sp.promo.name) {
    case "tragop":
      var span =
        `<span style="font-weight: bold"> lãi suất ` +
        sp.promo.value +
        `% </span>`;
      return (
        `Khách hàng có thể mua trả góp sản phẩm với ` +
        span +
        `với thời hạn 6 tháng kể từ khi mua hàng.`
      );

    case "giamgia":
      var span =
        `<span style="font-weight: bold">` + sp.promo.value + `</span>`;
      return (
        `Khách hàng sẽ được giảm ` +
        span +
        `₫ khi tới mua trực tiếp tại cửa hàng`
      );

    case "moiramat":
      return `Khách hàng sẽ được thử máy miễn phí tại cửa hàng. Có thể đổi trả lỗi trong vòng 2 tháng.`;

    case "giareonline":
      var del = stringToNum(sp.price) - stringToNum(sp.promo.value);
      var span =
        `<span style="font-weight: bold">` + numToString(del) + `</span>`;
      return (
        `Sản phẩm sẽ được giảm ` +
        span +
        `₫ khi mua hàng online bằng thẻ VPBank hoặc tin nhắn SMS`
      );

    default:
      var span = `<span style="font-weight: bold">61 xe Wave Alpha</span>`;
      return `Cơ hội trúng ` + span + ` khi trả góp Home Credit`;
  }
}

function addThongSo(ten, giatri) {
  return (
    `<li>
                <p>` +
    ten +
    `</p>
                <div>` +
    giatri +
    `</div>
            </li>`
  );
}

// add hình
function addSmallImg(img) {
  var newDiv =
    `<div class='item'>
                        <a>
                            <img src=` +
    img +
    ` onclick="changepic(this.src)">
                        </a>
                    </div>`;
  var banner = document.getElementsByClassName("owl-carousel")[0];
  banner.innerHTML += newDiv;
}

// đóng mở xem hình
function opencertain() {
  document.getElementById("overlaycertainimg").style.transform = "scale(1)";
}

function closecertain() {
  document.getElementById("overlaycertainimg").style.transform = "scale(0)";
}

// đổi hình trong chế độ xem hình
function changepic(src) {
  document.getElementById("bigimg").src = src;
}

// Thêm sản phẩm vào các khung sản phẩm
function addKhungSanPham(list_sanpham, tenKhung, color, ele) {
  // convert color to code
  var gradient =
    `background-image: linear-gradient(120deg, ` +
    color[0] +
    ` 0%, ` +
    color[1] +
    ` 50%, ` +
    color[0] +
    ` 100%);`;
  var borderColor = `border-color: ` + color[0];

  // mở tag
  var s =
    `<div class="khungSanPham" style="` +
    borderColor +
    `">
				<h3 class="tenKhung" style="` +
    gradient +
    `">* ` +
    tenKhung +
    ` *</h3>
				<div class="listSpTrongKhung flexContain">`;

  for (var i = 0; i < list_sanpham.length; i++) {
    s += addProduct(list_sanpham[i], null, true);
    // truyền vào 'true' để trả về chuỗi rồi gán vào s
  }

  // thêm khung vào contain-khung
  ele.innerHTML += s;
}

/// gợi ý sản phẩm
function suggestion() {
  // ====== Lay ra thong tin san pham hien tai ======
  const giaSanPhamHienTai = stringToNum(sanPhamHienTai.price);

  // ====== Tìm các sản phẩm tương tự theo tiêu chí ======
  const sanPhamTuongTu = list_products
    // Lọc sản phẩm trùng
    .filter((_) => _.masp !== sanPhamHienTai.masp)
    // Tính điểm cho từng sản phẩm
    .map((sanPham) => {
      // Tiêu chí 1: giá sản phẩm ko lệch nhau quá 1 triệu
      const giaSanPham = stringToNum(sanPham.price);
      let giaTienGanGiong = Math.abs(giaSanPham - giaSanPhamHienTai) < 1000000;

      // Tiêu chí 2: các thông số kỹ thuật giống nhau
      let soLuongChiTietGiongNhau = 0;
      for (let key in sanPham.detail) {
        let value = sanPham.detail[key];
        let currentValue = sanPhamHienTai.detail[key];

        if (value == currentValue) soLuongChiTietGiongNhau++;
      }
      let giongThongSoKyThuat = soLuongChiTietGiongNhau >= 3;

      // Tiêu chí 3: cùng hãng sản xuất
      let cungHangSanXuat = sanPham.company === sanPhamHienTai.company;

      // Tiêu chí 4: cùng loại khuyến mãi
      let cungLoaiKhuyenMai =
        sanPham.promo?.name === sanPhamHienTai.promo?.name;

      // Tiêu chí 5: có đánh giá, số sao
      let soDanhGia = Number.parseInt(sanPham.rateCount, 10);
      let soSao = Number.parseInt(sanPham.star, 10);

      // Tính điểm cho sản phẩm này (càng thoả nhiều tiêu chí điểm càng cao => càng nên gợi ý)
      let diem = 0;
      if (giaTienGanGiong) diem += 20;
      if (giongThongSoKyThuat) diem += soLuongChiTietGiongNhau;
      if (cungHangSanXuat) diem += 15;
      if (cungLoaiKhuyenMai) diem += 10;
      if (soDanhGia > 0) diem += (soDanhGia + "").length;
      diem += soSao;

      // Thêm thuộc tính diem vào dữ liệu trả về
      return {
        ...sanPham,
        diem: diem,
      };
    })
    // Sắp xếp theo số điểm cao xuống thấp
    .sort((a, b) => b.diem - a.diem)
    // Lấy ra 10 sản phẩm đầu tiên
    .slice(0, 10);

  console.log(sanPhamTuongTu);

  // ====== Hiển thị 5 sản phẩm lên web ======
  if (sanPhamTuongTu.length) {
    let div = document.getElementById("goiYSanPham");
    addKhungSanPham(
      sanPhamTuongTu,
      "Bạn có thể thích",
      ["#434aa8", "#ec1f1f"],
      div
    );
  }
}
