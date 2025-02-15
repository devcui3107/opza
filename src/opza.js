function Opza(options = {}) {
  this.opt = {
    templateId: null, // Chỉ chọn 1, ưu tiên hơn
    content: "", // Chỉ chọn 1, khi không dùng templateId
    widthModal: null,
    closeTrigger: ["button", "overlay", "Escape"], // Array
    scrollLock: true, // True là khoá cuộn
    destroy: false, // Mặc định không gỡ khỏi DOM
    cssContainer: [], // Class cho modal__content (String hoặc Array)
    footerContent: "", // Nhận chuỗi hoặc html
    buttons: [], // Nhận mảng các object
    ...options,
  };

  this._isOpen = false; // Đặt trạng thái modal

  // OBJECT CLOSE TRIGGER
  this._closeTriggerType = ["button", "overlay", "Escape"]; // Type Option
  // Kiểm tra và gán giá trị vào _closeTriggerMap
  this._closeTriggerMap = {
    button: false,
    overlay: false,
    Escape: false,
  };
  // Duyệt và gán true vào giá trị hợp lệ
  this.opt.closeTrigger.forEach((nameType) => {
    // Kiểm tra giá trị có hợp lệ không
    if (!this._closeTriggerType.includes(nameType)) {
      console.warn(`"${nameType}" does not exist in the modal close option`);
    } else {
      // Cập nhật giá trị hợp lệ vào _closeTriggerMap
      this._closeTriggerMap[nameType] = true;
    }
  });

  // XỬ LÝ TRƯỜNG HỢP TEMPLATE HOẶC CONTENT
  if (this.opt.templateId) {
    this.templateContent = document.querySelector(`#${this.opt.templateId}`);
  } else if (this.opt.content) {
    this._HtmlStringContent = this.opt.content;
  } else {
    console.error(`You need to pass in templateId or content: "HTML String"`);
    return;
  }
}

Opza._openModals = []; // Mảng lưu các modal đang mở

// FUNCTION GET SCROLL BAR
Opza.prototype._getScrollbarWidth = function () {
  if (this._scrollbarWidth) return this._scrollbarWidth;

  const div = document.createElement("div");
  div.style.cssText = `
      position: absolute;
      top: -9999px;
      width:100px;
      height: 100px;
      overflow: scroll;
  `;

  document.body.append(div);
  this._scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);

  return this._scrollbarWidth || 0;
};

// FUNCTION UPDATE CONTENT
Opza.prototype._updateContent = function (htmlString, newContent) {
  return htmlString.replace(/>(.*?)</, `>${newContent}<`);
};

// PROTOTYPE SANITIZE ATTRIBUTE
Opza.prototype._sanitizeAttributes = function (el) {
  // Duyệt qua tất cả thuộc tính và loại bỏ các thuộc tính không an toàn
  Array.from(el.attributes).forEach((attr) => {
    if (
      (attr.name === "href" || attr.name === "src") &&
      attr.value.trim().toLowerCase().startsWith("javascript:")
    ) {
      el.removeAttribute(attr.name);
    }
  });
};

// PROTOTYPE SANITIZE CONTENT
Opza.prototype._sanitizeContent = function (wrapper) {
  // Chỉ chọn các phần tử có khả năng chứa thuộc tính không an toàn
  const elements = wrapper.querySelectorAll("[href], [src]");
  elements.forEach(this._sanitizeAttributes.bind(this));
};

Opza.prototype._createElement = function (tag, classNames = "") {
  const element = document.createElement(tag);
  // Hỗ trợ nhiều class nếu truyền vào dạng chuỗi hoặc mảng
  if (typeof classNames === "string") {
    element.className = classNames; // nếu là chuỗi
  } else if (Array.isArray(classNames)) {
    element.classList.add(...classNames); // nếu là mảng
  }

  return element;
};

Opza.prototype._hasScrollBar = function () {
  return (
    document.body.scrollHeight > document.body.clientHeight ||
    document.documentElement.scrollHeight >
      document.documentElement.clientHeight
  );
};

// PROTOTYPE BUILD HTML
Opza.prototype._build = function () {
  this._opza = this._createElement("div", "opza"); // Tạo opza (Modal)
  this._opzaBox = this._createElement("div", "opza__box"); // Tạo opza__box

  this._opzaContent = this._createElement("div", "opza__content"); // Tạo opza__content

  // Xử lý width cho modal
  if (this.opt.widthModal) {
    this._opzaBox.style.width = this.opt.widthModal;
  } else {
    this._opzaBox.style.width = "500px";
  }

  // Trường hợp có Template
  if (this.templateContent) {
    // Clone Node Content từ template
    const contentModal = this.templateContent.content.cloneNode(true);
    this._opzaContent.append(contentModal);
  }

  // Nếu có content, kiểm tra nội dung trước khi thêm
  if (this._HtmlStringContent) {
    const wrapper = this._createElement("div", this.opt.cssContainer);

    // Kiểm tra và lọc nội dung không an toàn
    this._sanitizeContent(wrapper);

    wrapper.innerHTML = this._HtmlStringContent;

    // Thêm wrapper vào modal
    this._opzaContent.appendChild(wrapper);
  }

  // Nút Close Button
  if (this._closeTriggerMap.button) {
    const btnClose = this._createElement("button", "opza__btn-close"); // Tạo btnClose
    btnClose.innerHTML = "&times;";
    this._opzaBox.append(btnClose);
    // Event
    btnClose.onclick = () => this.close();
  }

  if (this.opt.footerContent) {
    const opzaFooter = this._createElement("div", "opza__footerContent"); // Tạo footerContent

    // Kiểm tra và lọc nội dung không an toàn
    this._sanitizeContent(opzaFooter);

    opzaFooter.innerHTML = this.opt.footerContent;
    this._opzaContent.append(opzaFooter);
  }

  if (this.opt.buttons) {
    // Kiểm tra nếu đã có footerContent thì chèn vào footer, ngược lại thì tạo div.opza__buttons
    if (!this._opzaButtons) {
      this._opzaButtons = this._createElement("div", "opza__buttons");
    }

    // Duyệt qua danh sách nút
    this.opt.buttons.forEach((btn) => {
      const button = this._createElement("button", btn.cssName);
      button.innerText = btn.label;
      button.onclick = () => {
        if (!btn.preAction || btn.preAction()) {
          btn.action();
        }
      };

      // Thêm button vào div.opza__buttons
      this._opzaButtons.append(button);
      this._opzaContent.append(this._opzaButtons);
    });
  }

  // Add Element to DOM
  this._opzaBox.append(this._opzaContent);
  this._opza.append(this._opzaBox);
  document.body.append(this._opza);
};

// PROTOTYPE OPEN MODAL
Opza.prototype.open = function () {
  if (this._isOpen) return; // Return nếu modal đang mở
  this._isOpen = true; // Gán lại giá trị của modal

  Opza._openModals.push(this); // Thêm modal vừa mở vào mảng các modal đang mở

  if (!this._opza) {
    this._build(); // Nếu không có modal thì mới tạo lại
  }

  // Cập nhật thứ tự z-index dựa trên số lượng modal đang mở
  this._opza.style.zIndex = 1000 + Opza._openModals.length; // Đảm bảo modal mới luôn ở trên cùng

  // Hiện Modal
  setTimeout(() => {
    this._opza.classList.add("opza--show");

    // Nếu tuỳ chọn khoá cuộn (open)
    if (
      this.opt.scrollLock &&
      Opza._openModals.length === 1 &&
      Opza.prototype._hasScrollBar()
    ) {
      const paddingRightTarget = parseInt(
        getComputedStyle(document.body).paddingRight
      ); // Lấy ra padding-right của phần tử target
      document.body.classList.add("opza--no-scroll");
      document.body.style.paddingRight =
        paddingRightTarget + this._getScrollbarWidth() + "px";
    }

    // Lắng nghe sự kiện click vào overlay
    if (this._closeTriggerMap.overlay) {
      this._handleClickOverlay = (e) => {
        if (e.target === this._opza) this.close();
      };
      this._opza.addEventListener("click", this._handleClickOverlay);
    }

    // Lắng nghe sự kiện nhấn ESC để đóng modal
    if (this._closeTriggerMap.Escape) {
      this._handlePressEscape = (e) => {
        const lastModal = Opza._openModals[Opza._openModals.length - 1]; // Modal sau cùng
        if (e.key === "Escape" && this === lastModal) this.close();
      };
      document.addEventListener("keydown", this._handlePressEscape);
    }
  }, 0);
};

// PROTOTYPE CLOSE MODAL
Opza.prototype.close = function (sttDestroy = this.opt.destroy) {
  if (!this._isOpen) return; // Return nếu modal đang đóng
  this._isOpen = false; // Gán lại giá trị của modal
  this._opza.classList.remove("opza--show");

  // Dừng tất cả video YouTube trong modal
  const iframes = this._opza.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    const src = iframe.getAttribute("src");
    iframe.setAttribute("src", ""); // Xóa src để dừng video
    iframe.setAttribute("src", src); // Đặt lại src nếu muốn tiếp tục hiển thị thumbnail
  });

  Opza._openModals.pop(); // Xoá modal sau cùng ra khỏi mảng

  // Nếu tuỳ chọn khoá cuộn (Close)
  if (this.opt.scrollLock && Opza._openModals.length === 0) {
    this._opza.addEventListener(
      "transitionend",
      () => {
        document.body.classList.remove("opza--no-scroll");
        document.body.style.paddingRight = "";
      },
      { once: true }
    ); // Chỉ lắng nghe một lần rồi tự xoá
  }

  // Xoá sự kiện click vào overlay
  if (this._handleClickOverlay) {
    this._opza.removeEventListener("click", this._handleClickOverlay);
    this._handleClickOverlay = null;
  }

  // Xoá sự kiện nhấm phím Escape
  if (this._handlePressEscape) {
    document.removeEventListener("keydown", this._handlePressEscape);
    this._handlePressEscape = null;
  }

  // Nếu `destroy = true`, chờ hiệu ứng transition rồi xoá khỏi DOM
  if (sttDestroy) {
    this._opza.addEventListener(
      "transitionend",
      () => {
        this.destroy(); // Gọi phương thức destroy để xoá modal
      },
      { once: true }
    ); // Chỉ lắng nghe một lần rồi tự xoá
  }
};

// PROTOTYPE DESTROY MODAL
Opza.prototype.destroy = function () {
  if (this._opza) {
    this._opza.remove(); // Xoá khỏi DOM
    this._opza = null; // Giải phóng bộ nhớ
    this._opzaButtons = null;
    // this._buttonElement = null;
  }
};

// PROTOTYPE EDIT FOOTER CONTENT
Opza.prototype.footerContentEdit = function (newContent) {
  // Cập nhật nội dung trong opt.footerContent
  if (this.opt.footerContent) {
    const oldContent = this.opt.footerContent;
    const htmlNewContent = this._updateContent(oldContent, newContent);

    // Cập nhật nội dung trong opt
    this.opt.footerContent = htmlNewContent;

    // Cập nhật DOM nếu modal đang mở
    if (this._opza) {
      const footerElement = this._opza.querySelector(".opza__footerContent");
      if (footerElement) {
        footerElement.innerHTML = newContent;
      }
    }
  }
};

// PROTOTYPE EDIT FOOTER BUTTONS
Opza.prototype.buttonsEdit = function (
  index,
  newLabel,
  newCssName,
  newPreAction,
  newAction
) {
  if (this.opt.buttons) {
    const btnContainer = document.querySelector(".opza__buttons");
    const btnItem = btnContainer.querySelectorAll("button")[index];

    // Cập nhật nhãn (label) của button
    if (newLabel) {
      btnItem.innerText = newLabel;
    }

    // Cập nhật class mới cho button
    if (newCssName) {
      btnItem.className = newCssName;
    }

    // Cập nhật preAction nếu có
    if (newPreAction) {
      btnItem.preAction = newPreAction;
    }

    // Cập nhật action nếu có
    if (newAction) {
      btnItem.onclick = function () {
        // Nếu có preAction thì thực thi trước
        if (btnItem.preAction) {
          btnItem.preAction();
        }

        // Thực thi action sau khi preAction
        if (newAction) {
          newAction();
        }
      };
    }
  }
};
