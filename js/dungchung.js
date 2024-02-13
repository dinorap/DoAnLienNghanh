var adminInfo = [
  {
    username: "admin",
    pass: "admin",
  },
  {
    username: "minhphuong",
    pass: "minhphuong",
  },
];

function getListAdmin() {
  return JSON.parse(window.localStorage.getItem("ListAdmin"));
}

function setListAdmin(l) {
  window.localStorage.setItem("ListAdmin", JSON.stringify(l));
}

// Hàm khởi tạo, tất cả các trang đều cần
function khoiTao() {
  // get data từ localstorage
  list_products = getListProducts() || list_products;
  adminInfo = getListAdmin() || adminInfo;
  listNews = getListNews() || listNews;
  setupEventTaiKhoan(); //hiệu ứng input và chuyển tab log-sign
  capNhat_ThongTin_CurrentUser(); //hiện thông tin lên thanh header
  addEventCloseAlertButton(); //đóng alert ở footer
}

// ========= Các hàm liên quan tới danh sách sản phẩm =========
// Localstorage cho dssp: 'ListProducts
function setListProducts(newList) {
  window.localStorage.setItem("ListProducts", JSON.stringify(newList));
}

function getListProducts() {
  return JSON.parse(window.localStorage.getItem("ListProducts"));
}
//list là danh sách sản phẩm , ten vd Huawei Mate 20 Pro , indexof kiểm tra xem t có tồn tại trong sp ko bắt đầu từ vi tri nào
function timKiemTheoTen(list, ten) {
  var tempList = copyObject(list);
  var result = [];
  ten = ten.split(" ");
  for (var sp of tempList) {
    var correct = true;
    for (var t of ten) {
      if (sp.name.toUpperCase().indexOf(t.toUpperCase()) < 0) {
        correct = false;
        break;
      }
    }
    if (correct) {
      result.push(sp);
    }
  }
  return result;
}
// tìm theo mã sp
function timKiemTheoMa(list, ma) {
  for (var l of list) {
    if (l.masp == ma) return l;
  }
}

// copy 1 object, do trong js ko có tham biến , tham trị rõ ràng
// nên dùng bản copy để chắc chắn ko ảnh hưởng tới bản chính
function copyObject(o) {
  return JSON.parse(JSON.stringify(o));
}

// ============== ALert Box ===============
// div có id alert được tạo trong hàm addFooter
function addAlertBox(text, bgcolor, textcolor, time) {
  var al = document.getElementById("alert");
  al.childNodes[0].nodeValue = text;
  al.style.backgroundColor = bgcolor;
  al.style.opacity = 1;
  al.style.zIndex = 200;

  if (textcolor) al.style.color = textcolor;
  if (time)
    setTimeout(function () {
      al.style.opacity = 0;
      al.style.zIndex = 0;
    }, time);
}
function addAlertBoxtop(text, bgcolor, textcolor, time) {
  var al = document.getElementById("alert-top");
  al.childNodes[0].nodeValue = text;
  al.style.backgroundColor = bgcolor;
  al.style.opacity = 1;
  al.style.zIndex = 200;

  if (textcolor) al.style.color = textcolor;
  if (time)
    setTimeout(function () {
      al.style.opacity = 0;
      al.style.zIndex = 0;
    }, time);
}
//khi di chuột vào closebtn thì sự kiện sẽ đc xảy ra sk ẩn html đi
function addEventCloseAlertButton() {
  document.getElementById("closebtn").addEventListener("mouseover", (event) => {
    // event.target.parentElement.style.display = "none";
    event.target.parentElement.style.opacity = 0;
    event.target.parentElement.style.zIndex = 0;
  });
}

// ================ Cart Number + Thêm vào Giỏ hàng ======================
// animation khi thêm sản phẩm vào giỏ hàng sẽ hiện to lên rồi thu nhỏ vòng đỏ lại
function animateCartNumber() {
  // Hiệu ứng cho icon giỏ hàng
  var cn = document.getElementsByClassName("cart-number")[0];
  cn.style.transform = "scale(2)";
  cn.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
  cn.style.color = "white";
  setTimeout(function () {
    cn.style.transform = "scale(1)";
    cn.style.backgroundColor = "transparent";
    cn.style.color = "red";
  }, 1200);
}

function themVaoGioHang(masp, tensp, mausac, rom) {
  var user = getCurrentUser();
  if (!user) {
    addAlertBoxtop("Bạn cần đăng nhập để mua hàng !", "#aa0000", "#fff", 10000);
    showTaiKhoan(true);
    return;
  }
  if (user.off) {
    alert("Tài khoản của bạn hiện đang bị khóa nên không thể mua hàng!");
    addAlertBox(
      "Tài khoản của bạn đã bị khóa bởi Admin.",
      "#aa0000",
      "#fff",
      10000
    );
    return;
  }
  var t = new Date();
  var daCoSanPham = false;

  for (var i = 0; i < user.products.length; i++) {
    // check trùng sản phẩm
    if (
      user.products[i].ma == masp &&
      user.products[i].mausac == mausac &&
      user.products[i].rom == rom
    ) {
      user.products[i].soluong++;
      daCoSanPham = true;
      break;
    }
  }

  if (!daCoSanPham) {
    // nếu không trùng thì mới thêm sản phẩm vào user.products
    user.products.push({
      madon: masp + mausac + rom,
      ma: masp,
      soluong: 1,
      date: t,
      mausac: mausac,
      rom: rom,
    });
  }

  animateCartNumber();
  addAlertBox("Đã thêm " + tensp + " vào giỏ.", "#17c671", "#fff", 3500);

  setCurrentUser(user); // cập nhật giỏ hàng cho user hiện tại
  updateListUser(user); // cập nhật list user
  capNhat_ThongTin_CurrentUser(); // cập nhật giỏ hàng
}

// ============================== TÀI KHOẢN ============================

// Hàm get set cho người dùng hiện tại đã đăng nhập
function getCurrentUser() {
  return JSON.parse(window.localStorage.getItem("CurrentUser")); // Lấy dữ liệu từ localstorage
}

function setCurrentUser(u) {
  window.localStorage.setItem("CurrentUser", JSON.stringify(u));
}

// Hàm get set cho danh sách người dùng
function getListUser() {
  var data = JSON.parse(window.localStorage.getItem("ListUser")) || [];
  var l = [];

  for (var d of data) {
    l.push(d);
  }
  return l;
}

function setListUser(l) {
  window.localStorage.setItem("ListUser", JSON.stringify(l));
}

// Sau khi chỉnh sửa 1 user 'u' thì cần hàm này để cập nhật lại vào ListUser
function updateListUser(u, newData) {
  var list = getListUser();
  for (var i = 0; i < list.length; i++) {
    if (equalUser(u, list[i])) {
      list[i] = newData ? newData : u;
    }
  }
  setListUser(list);
}

function logIn(form) {
  // Lấy dữ liệu từ form
  var name = form.username.value;
  var pass = form.pass.value;

  // Mã hóa mật khẩu đăng nhập
  sha256(pass).then(function (hashedPass) {
    // Lấy dữ liệu từ danh sách người dùng local storage
    var listUser = getListUser();

    // Kiểm tra xem dữ liệu form có khớp với người dùng nào trong danh sách không
    for (var u of listUser) {
      if (u.username === name && u.pass === hashedPass) {
        if (u.off) {
          addAlertBoxtop(
            "Tài khoản này đang bị khoá. Không thể đăng nhập.",
            "#aa0000",
            "#fff",
            10000
          );
          return false;
        }

        setCurrentUser(u);

        addAlertBoxtop("Chào mừng bạn đăng nhập", "#17c671", "#fff", 10000);
        setTimeout(function () {
          location.reload();
        }, 2000);
        // Reload lại trang

        return false;
      }
    }

    // Đăng nhập vào admin (giữ nguyên phần đăng nhập bằng admin)
    for (var ad of adminInfo) {
      if (equalUser({ username: name, pass: pass }, ad)) {
        // Hiển thị alert

        addAlertBoxtop(
          "Chào mừng admin quay lại <3",
          "#17c671",
          "#fff",
          100000
        );
        setTimeout(function () {
          window.localStorage.setItem("admin", true);
          window.location.assign("admin.html");
        }, 2000); // 3000 ms (3 giây)

        // Chuyển hướng đến trang "admin.html"
        return false;
      }
    }

    // Trả về thông báo nếu không khớp
    addAlertBoxtop(
      "Nhập sai tên tài khoản hoặc mật khẩu !!!",
      "#aa0000",
      "#fff",
      5000
    );
    form.username.focus();
  });

  return false;
}

function signUp(form) {
  var ho = form.ho.value;
  var ten = form.ten.value;
  var email = form.email.value;
  var username = form.newUser.value;
  var pass = form.newPass.value;
  var opass = form.oldPass.value;
  // Mã hóa mật khẩu bằng SHA-256
  sha256(pass).then(function (hashedPass) {
    var newUser = new User(username, hashedPass, ho, ten, email);

    // Lấy dữ liệu các khách hàng hiện có
    var listUser = getListUser();
    if (pass.length < 8) {
      alert("Mật khẩu tối thiểu 8 ký tự");
      return false;
    }
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!regex.test(pass)) {
      alert(
        "Mật khẩu phải bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số"
      );
      return false;
    }
    if (opass != pass) {
      alert("Mật khẩu bạn nhập không trùng nhau");
      return false;
    }
    // Kiểm tra trùng admin
    for (var ad of adminInfo) {
      if (newUser.username == ad.username) {
        alert("Tên đăng nhập đã có người sử dụng !!");
        return false;
      }
    }

    // Kiểm tra xem dữ liệu form có trùng với khách hàng đã có không
    for (var u of listUser) {
      if (newUser.username == u.username) {
        alert("Tên đăng nhập đã có người sử dụng !!");
        return false;
      }
    }

    // Lưu người mới vào localStorage
    listUser.push(newUser);
    window.localStorage.setItem("ListUser", JSON.stringify(listUser));

    // Đăng nhập vào tài khoản mới tạo
    window.localStorage.setItem("CurrentUser", JSON.stringify(newUser));
    alert("Đăng kí thành công, Bạn sẽ được tự động đăng nhập!");
    location.reload();
  });

  return false;
}

// Hàm để mã hóa mật khẩu bằng SHA-256
function sha256(input) {
  var encoder = new TextEncoder();
  var data = encoder.encode(input);
  return crypto.subtle.digest("SHA-256", data).then(function (buffer) {
    var hashArray = Array.from(new Uint8Array(buffer));
    var hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  });
}

function logOut() {
  window.localStorage.removeItem("CurrentUser");
  location.reload();
}

// Hiển thị form tài khoản, giá trị truyền vào là true hoặc false
function showTaiKhoan(show) {
  var value = show ? "scale(1)" : "scale(0)";
  var div = document.getElementsByClassName("containTaikhoan")[0];
  div.style.transform = value;
}

// Check xem có ai đăng nhập hay chưa (CurrentUser có hay chưa)
// Hàm này chạy khi ấn vào nút tài khoản trên header
function checkTaiKhoan() {
  if (!getCurrentUser()) {
    showTaiKhoan(true);
  }
}

// Tạo event, hiệu ứng cho form tài khoản
function setupEventTaiKhoan() {
  var taikhoan = document.getElementsByClassName("taikhoan")[0];
  var list = taikhoan.getElementsByTagName("input");

  // Tạo eventlistener cho input để tạo hiệu ứng label
  // Gồm 2 event onblur, onfocus được áp dụng cho từng input trong list bên trên
  ["blur", "focus"].forEach(function (evt) {
    for (var i = 0; i < list.length; i++) {
      list[i].addEventListener(evt, function (e) {
        var label = this.previousElementSibling; // lấy element ĐỨNG TRƯỚC this, this ở đây là input
        if (e.type === "blur") {
          // khi ấn chuột ra ngoài
          if (this.value === "") {
            // không có value trong input thì đưa label lại như cũ
            label.classList.remove("active");
            label.classList.remove("highlight");
          } else {
            // nếu có chữ thì chỉ tắt hightlight chứ không tắt active, active là dịch chuyển lên trên
            label.classList.remove("highlight");
          }
        } else if (e.type === "focus") {
          // khi focus thì label active + hightlight
          label.classList.add("active");
          label.classList.add("highlight");
        }
      });
    }
  });

  // Event chuyển tab login-signup
  var tab = document.getElementsByClassName("tab");
  for (var i = 0; i < tab.length; i++) {
    var a = tab[i].getElementsByTagName("a")[0];
    a.addEventListener("click", function (e) {
      e.preventDefault(); // tắt event mặc định

      // Thêm active(màu xanh lá) cho li chứa tag a này => ấn login thì login xanh, signup thì signup sẽ xanh
      this.parentElement.classList.add("active");

      // Sau khi active login thì phải tắt active sigup và ngược lại
      // Trường hợp a này thuộc login => <li>Login</li> sẽ có nextElement là <li>SignUp</li>
      if (this.parentElement.nextElementSibling) {
        this.parentElement.nextElementSibling.classList.remove("active");
      }
      // Trường hợp a này thuộc signup => <li>SignUp</li> sẽ có .previousElement là <li>Login</li>
      if (this.parentElement.previousElementSibling) {
        this.parentElement.previousElementSibling.classList.remove("active");
      }

      // Ẩn phần nhập của login nếu ấn signup và ngược lại
      // href của 2 tab signup và login là #signup và #login -> tiện cho việc getElement dưới đây
      var target = this.href.split("#")[1];
      document.getElementById(target).style.display = "block";

      var hide = target == "login" ? "signup" : "login";
      document.getElementById(hide).style.display = "none";
    });
  }

  // Đoạn code tạo event trên được chuyển về js thuần từ code jquery
  // Code jquery cho phần tài khoản được lưu ở cuối file này
}

// Cập nhật số lượng hàng trong giỏ hàng + Tên current user
function capNhat_ThongTin_CurrentUser() {
  var u = getCurrentUser();
  if (u) {
    // Cập nhật số lượng hàng vào header
    document.getElementsByClassName("cart-number")[0].innerHTML =
      getTongSoLuongSanPhamTrongGioHang(u);
    // Cập nhật tên người dùng
    document
      .getElementsByClassName("member")[0]
      .getElementsByTagName("a")[0].childNodes[2].nodeValue = " " + u.username;
    // bỏ class hide của menu người dùng
    document.getElementsByClassName("menuMember")[0].classList.remove("hide");
  }
}

// tính tổng số lượng các sản phẩm của user u truyền vào
function getTongSoLuongSanPhamTrongGioHang(u) {
  var soluong = 0;
  for (var p of u.products) {
    soluong += p.soluong;
  }
  return soluong;
}

// lấy số lương của sản phẩm NÀO ĐÓ của user NÀO ĐÓ được truyền vào
function getSoLuongSanPhamTrongUser(tenSanPham, user) {
  for (var p of user.products) {
    if (p.name == tenSanPham) return p.soluong;
  }
  return 0;
}

// ==================== Những hàm khác =====================
function numToString(num, char) {
  return num
    .toLocaleString()
    .split(",")
    .join(char || ".");
}

function stringToNum(str, char) {
  return Number(str.split(char || ".").join(""));
}

// https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inp, arr) {
  var currentFocus;

  // Bắt đầu lắng nghe sự kiện khi người dùng gõ phím
  inp.addEventListener("keyup", function (e) {
    // Kiểm tra xem phím được gõ không phải là Enter, Mũi tên lên, hoặc Mũi tên xuống
    if (e.keyCode != 13 && e.keyCode != 40 && e.keyCode != 38) {
      var a,
        b,
        i,
        val = this.value;
      console.log(b);
      // Đóng danh sách gợi ý nếu có
      closeAllLists();
      if (!val) {
        return false;
      }
      currentFocus = -1;

      // Tạo một phần tử DIV để chứa các mục (giá trị) được gợi ý:
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");

      // Thêm phần tử DIV vào phần tử chứa autocomplete:
      this.parentNode.appendChild(a);

      // Duyệt qua danh sách mục và hiển thị những mục phù hợp với giá trị người dùng:
      for (i = 0; i < arr.length; i++) {
        // Kiểm tra xem mục có bắt đầu bằng cùng những ký tự với giá trị trường nhập liệu không:
        if (
          arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()
        ) {
          // Tạo một phần tử DIV cho mỗi mục phù hợp:
          b = document.createElement("DIV");

          // Làm cho những ký tự phù hợp được làm đậm:
          b.innerHTML =
            "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].name.substr(val.length);

          // Chèn một trường nhập liệu ẩn chứa giá trị của mục trong mảng:
          b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";

          // Thực hiện một hàm khi người dùng nhấp vào mục giá trị (phần tử DIV):
          b.addEventListener("click", function (e) {
            // Chèn giá trị vào trường nhập liệu autocomplete:
            inp.value = this.getElementsByTagName("input")[0].value;
            inp.focus();

            // Đóng danh sách giá trị được gợi ý,
            // hoặc đóng bất kỳ danh sách giá trị được gợi ý nào khác:
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    }
  });

  // Xử lý sự kiện khi người dùng nhấn phím trên bàn phím:
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      // Nếu người dùng nhấn phím Mũi tên xuống, tăng biến currentFocus:
      currentFocus++;
      // và làm cho mục hiện tại trở nên nổi bật hơn:
      addActive(x);
      console.log(currentFocus);
    } else if (e.keyCode == 38) {
      // Nếu người dùng nhấn phím Mũi tên lên,
      // giảm biến currentFocus:
      currentFocus--;
      // và làm cho mục hiện tại trở nên nổi bật hơn:
      addActive(x);
    } else if (e.keyCode == 13) {
      // Nếu người dùng nhấn phím Enter, ngăn form được gửi đi,
      // và mô phỏng việc nhấp vào mục "active":
      if (currentFocus > -1) {
        if (x) {
          x[currentFocus].click();
          e.preventDefault();
        }
      }
    }
  });

  // Hàm thêm lớp "autocomplete-active" vào mục đang "active":
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }

  // Hàm loại bỏ lớp "autocomplete-active" khỏi tất cả các mục autocomplete:
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  // Hàm đóng tất cả các danh sách giá trị được gợi ý trên trang, ngoại trừ danh sách được truyền vào:
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  // Thực hiện một hàm khi người dùng nhấp chuột bất kỳ nơi nào trên trang:
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

// Thêm từ khóa tìm kiếm
function addTags(nameTag, link) {
  var new_tag = `<a href=` + link + `>` + nameTag + `</a>`;

  // Thêm <a> vừa tạo vào khung tìm kiếm
  var khung_tags = document.getElementsByClassName("tags")[0];
  khung_tags.innerHTML += new_tag;
}

// Thêm sản phẩm vào trang
function addProduct(p, ele, returnString) {
  var mauArray = p.detail.color.split(" , ");
  var selectedColor = mauArray[0]; // Lấy màu đầu tiên trong mảng làm màu được chọn lần đầu

  var romArray = p.detail.rom.split(" , "); // Mảng các dung lượng bộ nhớ trong
  var selectedRom = romArray[0];
  promo = new Promo(p.promo.name, p.promo.value); // class Promo
  detail = new Detail(selectedColor, selectedRom);
  product = new Product(
    p.masp,
    p.name,
    p.img,
    p.price,
    p.star,
    p.rateCount,
    promo,
    detail
  ); // Class product

  return addToWeb(product, ele, returnString);
}
function action() {
  // Lấy đường dẫn của trang hiện tại
  const currentLocation = window.location.href;

  // Lấy danh sách các thẻ li
  const liElements = document.querySelectorAll("li");
  const url = new URL(currentLocation);

  // Lấy phần đường dẫn (pathname) từ đối tượng URL
  const pathname = url.pathname;

  // Duyệt qua từng thẻ li
  liElements.forEach((li) => {
    // Lấy href của thẻ a bên trong thẻ li
    const link = li.querySelector("a");

    if (link.href === currentLocation) {
      li.classList.add("active"); // Thêm lớp "active" cho thẻ li
    }
  });
}
// Thêm topnav vào trang
function addTopNav() {
  document.write(`    
  <div id="alert-top">
  <span id="closebtn">&otimes;</span>
  <span></span>
</div>  
	<div class="top-nav group">
        <section>
            <div class="social-top-nav">
            <a href="https://www.facebook.com/profile.php?id=61550857511656" class="fab fa-facebook"></a>
            <a href="https://github.com/dinorap/Nhom6-kt.git" class="fab fa-github github-link"></a>
            <a href="https://www.google.com.vn/?hl=vi" class="fab fa-google"></a>
            <a href="https://www.youtube.com/" class="fab fa-youtube"></a>
            </div> <!-- End Social Topnav -->

            <ul class="top-nav-quicklink flexContain">
            <li><a href="index.html"><i class="fas fa-home"></i> Trang chủ</a></li>
            <li><a href="tintuc.html"><i class="far fa-newspaper"></i> Tin tức</a></li>
            <li><a href="tuyendung.html"><i class="fas fa-handshake"></i> Tuyển dụng</a></li>
            <li><a href="gioithieu.html"><i class="fas fa-info-circle"></i> Giới thiệu</a></li>
            <li><a href="trungtambaohanh.html"><i class="fas fa-wrench"></i> Bảo hành</a></li>
            <li><a href="lienhe.html"><i class="fas fa-phone"></i> Liên hệ</a></li>
            </ul> <!-- End Quick link -->
        </section><!-- End Section -->
    </div>
    <!-- End Top Nav  -->`);
  action();
}

// Thêm header
function addHeader() {
  document.write(`
        
	<div class="header group">
        <div class="logo">
            <a href="index.html">
                <img src="img/logo.png" alt="Trang chủ Smartphone Store" title="Trang chủ Smartphone Store">
            </a>
        </div> <!-- End Logo -->

        <div class="content">
            <div class="search-header" style="position: relative; left: 162px; top: 1px;">
                <form class="input-search" method="get" action="index.html">
                    <div class="autocomplete">
                        <input id="search-box" name="search" autocomplete="off" type="text" placeholder="Nhập từ khóa tìm kiếm..." required>
                        <button type="submit">
                            <i class="fas fa-search"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </form> <!-- End Form search -->
                <div class="tags">
                    <strong>Từ khóa: </strong>
                </div>
            </div> <!-- End Search header -->

            <div class="tools-member">
                <div class="member">
                    <a onclick="checkTaiKhoan()">
                        <i class="fa fa-user"></i>
                        Tài khoản
                    </a>
                    <div class="menuMember hide">
                        <a href="nguoidung.html">Trang người dùng</a>
                        <a onclick="if(window.confirm('Xác nhận đăng xuất ?')) logOut();">Đăng xuất</a>
                    </div>

                </div> <!-- End Member -->

                <div class="cart">
                    <a href="giohang.html">
                        <i class="fa fa-shopping-cart"></i>
                        <span>Giỏ hàng</span>
                        <span class="cart-number"></span>
                    </a>
                </div> <!-- End Cart -->

                <!--<div class="check-order">
                    <a>
                        <i class="fa fa-truck"></i>
                        <span>Đơn hàng</span>
                    </a>
                </div> -->
            </div><!-- End Tools Member -->
            
        </div> <!-- End Content -->
        
    </div> 
    <!-- End Header -->`);
}

function addFooter() {
  document.write(`
    <!-- ============== Alert Box ============= -->
    <div id="alert">
        <span id="closebtn">&otimes;</span>
        <span></span>
    </div>

    <!-- ============== Footer ============= -->
    <div class="copy-right">
        <p><a href="index.html">Mobile Phone Store</a> - All rights reserved © 2023 - Designed by
            <span style="color: #eee; font-weight: bold">group 3rd</span></p>
    </div>
    
    <div
    class="fb-customerchat"
    attribution="biz_inbox"
    page_id="137701869415029"
  ></div>

  <!-- Thêm mã JavaScript của Facebook SDK -->
  <script>
    window.fbAsyncInit = function () {
      FB.init({
        xfbml: true,
        version: "v17.0",
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  </script>`);
}

// Thêm contain Taikhoan
function addContainTaiKhoan() {
  document.write(`
	<div class="containTaikhoan">
        <span class="close" onclick="showTaiKhoan(false);">&times;</span>
        <div class="taikhoan">
       
            <ul class="tab-group">
                <li class="tab active"><a href="#login">Đăng nhập</a></li>
                <li class="tab"><a href="#signup">Đăng kí</a></li>
            </ul> <!-- /tab group -->

            <div class="tab-content">
                <div id="login">
                   
                    <h1>Chào mừng bạn trở lại!</h1>
                    
                    <form onsubmit="return logIn(this);">

                        <div class="field-wrap">
                            <label>
                            <i class="fas fa-user"></i>
                                Tên đăng nhập<span class="req">*</span>
                                
                            </label>
                            <input name='username' type="text" required autocomplete="off" />
                        </div> <!-- /user name -->
                        <div class="field-wrap">
                            <label>
                            <i class="fas fa-lock"></i>
                                Mật khẩu<span class="req">*</span>
                                
                            </label>
                            
                            <input name="pass" type="password" required autocomplete="off" />
                            
                        </div> <!-- pass -->
                        <div class="reset">
                        <div class="nhomk"><input type="checkbox" /><span>Nhớ mật khẩu</span></div>
                       <div><a href="./quenmk.html"><b>Quên mật khẩu?</b></a></div>
                        
                    </div>
                      
                        <button type="submit" class="button button-block" />Đăng Nhập</button>
                        <div class="hr">
                    <hr>
                    <p>Tiếp tục với</p>
                    <hr>
                </div>
                        <div class="connect">
                    <a
                        href="https://accounts.google.com/v3/signin/identifier?dsh=S1627976351%3A1686453003340009&authuser=0&continue=https%3A%2F%2Fmyaccount.google.com%2F%3Futm_source%3Dsign_in_no_continue%26pli%3D1&ec=GAlAwAE&hl=vi&service=accountsettings&flowName=GlifWebSignIn&flowEntry=AddSession">
                        <button type="button">
                            <img src="./img/google_logo1600.png" alt="">
                            <p>Google </p>
                        </button>
                    </a>
                    <a href="https://www.facebook.com/">
                        <button type="button">
                            <img src="./img/facebook-clipart-png-12.png" alt="">
                            <p>Facebook</p>
                        </button>
                    </a>

                </div>
                    </form> <!-- /form -->

                </div> <!-- /log in -->

                <div id="signup">
                    <h1>Đăng kí miễn phí</h1>

                    <form onsubmit="return signUp(this);">

                        <div class="top-row">
                            <div class="field-wrap">
                                <label>
                                <i class="fas fa-user"></i>
                                    Họ<span class="req">*</span>
                                </label>
                                <input name="ho" type="text" required autocomplete="off" />
                            </div>

                            <div class="field-wrap">
                                <label>
                                <i class="fas fa-user"></i>
                                    Tên<span class="req">*</span>
                                </label>
                                <input name="ten" type="text" required autocomplete="off" />
                            </div>
                        </div> <!-- / ho ten -->

                        <div class="field-wrap">
                            <label>
                            <i class="fas fa-envelope"></i>
                                Địa chỉ Email<span class="req">*</span>
                            </label>
                            <input name="email" type="email" required autocomplete="off" />
                        </div> <!-- /email -->

                        <div class="field-wrap">
                            <label>
                            <i class="fas fa-user"></i>
                                Tên đăng nhập<span class="req">*</span>
                              
                            </label>
                            <input name="newUser" type="text" required autocomplete="off" />
                        </div> <!-- /user name -->

                        <div class="field-wrap">
                            <label>
                            <i class="fas fa-lock"></i>
                                Mật khẩu<span class="req">*</span>
                            </label>
                            <input name="newPass" type="password" required autocomplete="off" />
                        </div> <!-- /pass -->
                        <div class="field-wrap">
                            <label>
                            <i class="fas fa-lock"></i>
                                Nhập lại mật khẩu<span class="req">*</span>
                            </label>
                            <input name="oldPass" type="password" required autocomplete="off" />
                        </div> <!-- /pass -->

                        <button type="submit" class="button button-block" />Tạo tài khoản</button>

                    </form> <!-- /form -->

                </div> <!-- /sign up -->
            </div><!-- tab-content -->

        </div> <!-- /taikhoan -->
    </div>`);
}
// Thêm plc (phần giới thiệu trước footer)
function addPlc() {
  document.write(`
    <div class="plc">
        <section>
            <ul class="flexContain">
                <li>Giao hàng hỏa tốc trong ngày</li>
                <li>Thanh toán linh hoạt: tiền mặt, ngân hàng, trả góp</li>
                <li>Trải nghiệm sản phẩm tại cửa hàng</li>
                <li>Lỗi 1 đổi 1 trong 1 tuần</li>
                <li>Hỗ trợ suốt thời gian sử dụng.
                    <br>Hotline:
                    <a href="tel:12345678" style="color: #288ad6;">0123456789</a>
                </li>
            </ul>
        </section>
    </div>`);
}

// function shuffleArray(array) {
//   let currentIndex = array.length,
//     randomIndex;

//   // While there remain elements to shuffle...
//   while (currentIndex != 0) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;

//     // And swap it with the current element.
//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex],
//       array[currentIndex],
//     ];
//   }

//   return array;
// }

// function checkLocalStorage() {
//   if (typeof Storage == "undefined") {
//     alert(
//       "Máy tính không hỗ trợ LocalStorage. Không thể lưu thông tin sản phẩm, khách hàng!!"
//     );
//   } else {
//     console.log("LocaStorage OKE!");
//   }
// }

// Di chuyển lên đầu trang
function gotoTop() {
  if (window.jQuery) {
    jQuery("html,body").animate(
      {
        scrollTop: 0,
      },
      100
    );
  } else {
    document.getElementsByClassName("top-nav")[0].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}

// Lấy màu ngẫu nhiên
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Kiểm tra dữ liệu thống kê xem có bao nhiêu sản phẩm thuộc loại này loại
// function auto_Get_Database() {
//   var ul = document.getElementsByClassName("homeproduct")[0];
//   var li = ul.getElementsByTagName("li");
//   for (var l of li) {
//     var a = l.getElementsByTagName("a")[0];
//     // name
//     var name = a.getElementsByTagName("h3")[0].innerHTML;

//     // price
//     var price = a.getElementsByClassName("price")[0];
//     price = price.getElementsByTagName("strong")[0].innerHTML;

//     // img
//     var img = a.getElementsByTagName("img")[0].src;
//     console.log(img);

//     // // rating
//     var rating = a.getElementsByClassName("ratingresult")[0];
//     var star = rating.getElementsByClassName("icontgdd-ystar").length;
//     var rateCount = parseInt(rating.getElementsByTagName("span")[0].innerHTML);

//     // // promo
//     var tragop = a.getElementsByClassName("installment");
//     if (tragop.length) {
//     }

//     var giamgia = a.getElementsByClassName("discount").length;
//     var giareonline = a.getElementsByClassName("shockprice").length;
//   }
// }

// function getThongTinSanPhamFrom_TheGioiDiDong() {
//   (function () {
//     var ul = document.getElementsByClassName("parameter")[0];
//     var li_s = ul.getElementsByTagName("li");
//     var result = {};
//     result.detail = {};

//     for (var li of li_s) {
//       var loai = li.getElementsByTagName("span")[0].innerText;
//       var giatri = li.getElementsByTagName("div")[0].innerText;

//       switch (loai) {
//         case "Màn hình:":
//           result.detail.screen = giatri.replace('"', "'");
//           break;
//         case "Hệ điều hành:":
//           result.detail.os = giatri;
//           break;
//         case "Camera sau:":
//           result.detail.camara = giatri;
//           break;
//         case "Camera trước:":
//           result.detail.camaraFront = giatri;
//           break;
//         case "CPU:":
//           result.detail.cpu = giatri;
//           break;
//         case "RAM:":
//           result.detail.ram = giatri;
//           break;
//         case "Bộ nhớ trong:":
//           result.detail.rom = giatri;
//           break;
//         case "Thẻ nhớ:":
//           result.detail.microUSB = giatri;
//           break;
//         case "Dung lượng pin:":
//           result.detail.battery = giatri;
//           break;
//       }
//     }

//     console.log(JSON.stringify(result, null, "	"));
//   })();
// }

// $('.taikhoan').find('input').on('keyup blur focus', function (e) {

//     var $this = $(this),
//         label = $this.prev('label');

//     if (e.type === 'keyup') {
//         if ($this.val() === '') {
//             label.removeClass('active highlight');
//         } else {
//             label.addClass('active highlight');
//         }
//     } else if (e.type === 'blur') {
//         if ($this.val() === '') {
//             label.removeClass('active highlight');
//         } else {
//             label.removeClass('highlight');
//         }
//     } else if (e.type === 'focus') {

//         if ($this.val() === '') {
//             label.removeClass('highlight');
//         } else if ($this.val() !== '') {
//             label.addClass('highlight');
//         }
//     }

// });

// $('.tab a').on('click', function (e) {

//     e.preventDefault();

//     $(this).parent().addClass('active');
//     $(this).parent().siblings().removeClass('active');

//     target = $(this).attr('href');

//     $('.tab-content > div').not(target).hide();

//     $(target).fadeIn(600);

// });
function setListNews(newList) {
  window.localStorage.setItem("listNews", JSON.stringify(newList));
}
function getListNews() {
  return JSON.parse(window.localStorage.getItem("listNews"));
}
function tintuc() {
  listNews = getListNews() || listNews;
  console.log(listNews);
  // Lấy dữ liệu từ localStorage dưới dạng JSON
  if (listNews) {
    const bodyTintuc = document.getElementById("body-tintuc");

    listNews.forEach((item) => {
      const newsElement = document.createElement("div");
      newsElement.classList.add("tintuc-info");
      newsElement.innerHTML = `
        <a href="${item.link}" target="_blank">
          <img src="${item.image}" />
          <h2>${item.title}</h2>
        </a>
        <br />
        <h5>${item.web} &emsp; ${item.time}</h5>
      `;
      bodyTintuc.appendChild(newsElement);
    });
  } else {
    console.log("Không có dữ liệu trong localStorage.");
  }
}

//chatgpt
function addChatbot() {
  document.write(`
  <button class="chatbot-toggler">
        <span class="material-symbols-rounded"><i class="fas fa-comment-alt"></i></span>
        <span class="material-symbols-outlined"><i class="fas fa-times"></i></span>
    </button>
    <div class="chatbot">
        <header>
            <h2>Chatbot</h2>
            <span class="close-btn material-symbols-outlined"><i class="fas fa-times"></i></span>
        </header>
        <ul class="chatbox">
            <li class="chat incoming">
                <span class="material-symbols-outlined"><i class="fas fa-robot"></i></span>
                <p>Chào bạn 👋<br />Tôi có thể giúp được gì cho bạn ngày hôm nay?</p>
            </li>
        </ul>
        <div class="chat-input" id="chatInputContainer">
            <textarea placeholder="Enter a message..." required="required" spellcheck="false"
                oninput="resizeTextArea()"></textarea>
            <span class="material-symbols-rounded" id="send-btn"><i class="fas fa-share"></i></span>
        </div>
    </div>
    `);

  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const closeBtn = document.querySelector(".close-btn");
  const chatbox = document.querySelector(".chatbox");
  const chatInput = document.querySelector(".chat-input textarea");
  const sendChatBtn = document.querySelector(".chat-input span");

  let userMessage = null; // Variable to store user's message
  const API_KEY = "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"; // Paste your API key here

  const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent =
      className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined"><i class="fas fa-robot"></i></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
  };

  const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    };

    // Send POST request to API, get response and set the reponse as paragraph text
    fetch(API_URL, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        messageElement.textContent = data.choices[0].message.content.trim();
      })
      .catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent =
          "Oops! Something went wrong. Please try again.";
      })
      .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
  };

  const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      // Display "Thinking..." message while waiting for the response
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
      generateResponse(incomingChatLi);
    }, 600);
  };

  chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
  });

  chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      handleChat();
    }
  });

  sendChatBtn.addEventListener("click", handleChat);
  closeBtn.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot")
  );
  chatbotToggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot")
  );
}
function resizeTextArea() {
  const textarea = document.querySelector(".chat-input textarea");
  const chatInputContainer = document.getElementById("chatInputContainer");
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight - 30 + "px";

  if (textarea.scrollHeight > 100) {
    chatInputContainer.classList.add("expanded");
  } else {
    chatInputContainer.classList.remove("expanded");
  }
}
