var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _element, _modalDiv, _onClose, _detailModal, _restaurantInput, _enrollModal, _onAdd, _enrollModal2, _detailModal2, _restaurants, _key, _restaurants2, _RestaurantStorage_instances, loadData_fn, _restaurantList, _restaurantStorage, _restaurantService, _modalService, _main, _state, _RestaurantController_instances, initializeUI_fn, _handleClickStar, _handleChangeCategory, _handleChangeFilter, _handleTabBar, _handleDelete, _handleClickItem, _handleAddRestaurant, updateRestaurantUI_fn, changeState_fn, initialOptionState_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function createElement({ tag, className, textContent, attributes = {} }) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });
  return element;
}
function createSectionContainer(className) {
  return createElement({ tag: "section", className });
}
const ORDER = {
  NAME: "이름순",
  DISTANCE: "거리순"
};
const TAB = {
  ALL: "all",
  FAVORITE: "favorite"
};
const CATEGORY = {
  ALL: "전체",
  KOREAN: "한식",
  CHINESE: "중식",
  JAPANESE: "일식",
  WESTERN: "양식",
  ASIAN: "아시안",
  ETC: "기타"
};
const LOCAL_STORAGE_KEY = "restaurant";
const MODAL_TYPE = {
  DETAIL: "detail",
  ENROLL: "enroll"
};
const STATE_KEY = {
  ORDER: "order",
  CATEGORY: "category",
  TAB: "tab"
};
const DISTANCE_OPTIONS = [5, 10, 15, 20, 30];
const CATEGORY_KEY = {
  전체: "all",
  한식: "korean",
  중식: "chinese",
  일식: "japanese",
  양식: "western",
  아시안: "asian",
  기타: "etc"
};
function createLabeldSelectBox({ options, label, isRequired, type, onChange }) {
  const selectBoxDiv = createElement({
    tag: "div",
    className: `form-item${" form-item--required"}`
  });
  const categoryLabel = createElement({
    tag: "label",
    textContent: label,
    attributes: { for: `${type} text-caption` }
  });
  const selectBox = createElement({
    tag: "select",
    attributes: {
      name: type,
      id: type,
      required: isRequired
    }
  });
  const fragment = new DocumentFragment();
  fragment.appendChild(
    createElement({ tag: "option", textContent: "선택해 주세요", attributes: { value: "" } })
  );
  options.forEach((option) => {
    const optionTag = createElement({
      tag: "option",
      textContent: type === "category" ? option : `${option}분 내`,
      attributes: { value: option }
    });
    fragment.appendChild(optionTag);
  });
  selectBox.appendChild(fragment);
  selectBoxDiv.append(categoryLabel, selectBox);
  selectBox.addEventListener("change", (event) => {
    onChange(event);
  });
  return selectBoxDiv;
}
function createSelectBox({ options, type, onChange }) {
  const selectBox = createElement({
    tag: "select",
    attributes: {
      name: type,
      id: `${type}-filter`,
      class: "restaurant-filter"
    }
  });
  const fragment = new DocumentFragment();
  options.forEach((option) => {
    const optionTag = createElement({
      tag: "option",
      textContent: option,
      attributes: { value: option }
    });
    fragment.appendChild(optionTag);
  });
  selectBox.appendChild(fragment);
  selectBox.addEventListener("change", (event) => {
    onChange(event);
  });
  return selectBox;
}
function createFilterGroup(onChangeCategory, onChangeFilter) {
  const fragment = new DocumentFragment();
  const categoryFilter = createSelectBox({
    options: Object.values(CATEGORY),
    type: "category",
    onChange: onChangeCategory
  });
  const sortFilter = createSelectBox({
    options: Object.values(ORDER),
    type: "sorting",
    onChange: onChangeFilter
  });
  fragment.append(categoryFilter, sortFilter);
  return fragment;
}
function createTags(data) {
  const categoryImg = createElement({
    tag: "img",
    className: "category-icon",
    attributes: {
      src: `./images/category-${data.category}.png`,
      alt: data.category
    }
  });
  const nameHeading = createElement({
    tag: "h3",
    className: "restaurant__name text-subtitle",
    textContent: data.name
  });
  const distanceSpan = createElement({
    tag: "span",
    className: "restaurant__distance text-body",
    textContent: `캠퍼스부터 ${data.distance}분 내`
  });
  const starImg = createElement({
    tag: "div",
    className: `restaurant__star${data.isFavorite ? " restaurant__star--clicked" : ""}`
  });
  const descriptionPara = createElement({
    tag: "p",
    className: "restaurant__description text-body",
    textContent: data.description
  });
  return { categoryImg, nameHeading, distanceSpan, starImg, descriptionPara };
}
function createRestaurantItem({ data, onClickItem, onClickStar, detail = false }) {
  const restaurantItem = createElement({ tag: "li", className: "restaurant" });
  const categoryDiv = createElement({ tag: "div", className: "restaurant__category" });
  const infoDiv = createElement({ tag: "div", className: "restaurant__info" });
  const titleDiv = createElement({ tag: "div", className: "restaurant__title" });
  const flexDiv = createElement({ tag: "div", className: "flex" });
  const { categoryImg, nameHeading, distanceSpan, starImg, descriptionPara } = createTags(data);
  if (onClickItem) {
    restaurantItem.addEventListener("click", (event) => {
      onClickItem(event, data);
    });
  }
  if (onClickStar) {
    starImg.addEventListener("click", (event) => {
      event.stopPropagation();
      onClickStar(event, data.id);
    });
  }
  if (detail) {
    descriptionPara.classList.remove("restaurant__description");
    descriptionPara.classList.add("restaurant__detail__description");
  }
  categoryDiv.append(categoryImg);
  titleDiv.append(nameHeading, distanceSpan);
  flexDiv.append(titleDiv, starImg);
  infoDiv.append(flexDiv, descriptionPara);
  restaurantItem.append(categoryDiv, infoDiv);
  return restaurantItem;
}
function createRestaurantList({ datas, onClickItem, onClickStar }) {
  const restaurantList = createElement({ tag: "ul", className: "restaurant-list" });
  const fragment = new DocumentFragment();
  datas.forEach((data) => {
    const restaurantItem = createRestaurantItem({ data, onClickItem, onClickStar });
    fragment.appendChild(restaurantItem);
  });
  restaurantList.appendChild(fragment);
  return restaurantList;
}
function addRestaurantList({ data, onClickItem, onClickStar }) {
  const $restaurantList = document.querySelector(".restaurant-list");
  const $restaurantItem = createRestaurantItem({ data, onClickItem, onClickStar });
  $restaurantList.appendChild($restaurantItem);
  return $restaurantList;
}
function updateRestaurantList({ datas, onClickItem, onClickStar }) {
  const $listContainer = document.querySelector(".restaurant-list-container");
  $listContainer.replaceChildren();
  const restaurantList = createElement({ tag: "ul", className: "restaurant-list" });
  const fragment = new DocumentFragment();
  datas.forEach((data) => {
    const restaurantItem = createRestaurantItem({ data, onClickItem, onClickStar });
    fragment.appendChild(restaurantItem);
  });
  restaurantList.appendChild(fragment);
  $listContainer.appendChild(restaurantList);
  return $listContainer;
}
function toggleTab(allTabDiv, favoriteTabDiv) {
  allTabDiv.classList.toggle("tab-item-selected");
  favoriteTabDiv.classList.toggle("tab-item-selected");
}
function createTabBar(onClick) {
  const section = createSectionContainer("restaurant-tab-bar-container");
  const allTabDiv = createElement({
    tag: "div",
    className: "tab-item tab-item-selected",
    textContent: "모든 음식점",
    attributes: {
      id: TAB.ALL
    }
  });
  const favoriteTabDiv = createElement({
    tag: "div",
    className: "tab-item",
    textContent: "자주 가는 음식점",
    attributes: {
      id: TAB.FAVORITE
    }
  });
  allTabDiv.addEventListener("click", (event) => {
    const { id } = event.target;
    if (id === TAB.ALL && allTabDiv.classList.contains("tab-item-selected") || id === TAB.FAVORITE && favoriteTabDiv.classList.contains("tab-item-selected")) {
      return;
    }
    toggleTab(allTabDiv, favoriteTabDiv);
    onClick(event);
  });
  favoriteTabDiv.addEventListener("click", (event) => {
    const { id } = event.target;
    if (id === TAB.ALL && allTabDiv.classList.contains("tab-item-selected") || id === TAB.FAVORITE && favoriteTabDiv.classList.contains("tab-item-selected")) {
      return;
    }
    toggleTab(allTabDiv, favoriteTabDiv);
    onClick(event);
  });
  section.append(allTabDiv, favoriteTabDiv);
  return section;
}
function createButton({ className, textContent, buttonType, onClick }) {
  const button = createElement({
    tag: "button",
    className: `${className} button text-caption`,
    textContent,
    attributes: !buttonType ? {} : { type: buttonType }
  });
  button.addEventListener("click", (event) => {
    onClick(event);
  });
  return button;
}
class Modal {
  constructor(onClose) {
    __privateAdd(this, _element);
    __privateAdd(this, _modalDiv);
    __privateAdd(this, _onClose);
    __privateSet(this, _element, this.initModal());
    __privateSet(this, _onClose, onClose);
  }
  initModal() {
    const modalContainer = createElement({ tag: "div", className: "modal" });
    const modalBackdrop = createElement({ tag: "div", className: "modal-backdrop" });
    __privateSet(this, _modalDiv, createElement({ tag: "div", className: "modal-container" }));
    modalBackdrop.addEventListener("click", () => {
      this.toggle();
    });
    modalContainer.append(modalBackdrop, __privateGet(this, _modalDiv));
    return modalContainer;
  }
  appendModalContent(content) {
    __privateGet(this, _modalDiv).replaceChildren();
    __privateGet(this, _modalDiv).appendChild(content);
  }
  toggle() {
    __privateGet(this, _element).classList.toggle("modal--open");
    if (!__privateGet(this, _element).classList.contains("modal--open") && __privateGet(this, _onClose)) {
      __privateGet(this, _onClose).call(this);
    }
  }
  getElement() {
    return __privateGet(this, _element);
  }
}
_element = new WeakMap();
_modalDiv = new WeakMap();
_onClose = new WeakMap();
class RestaurantDetailModal {
  constructor() {
    __privateAdd(this, _detailModal);
    __privateSet(this, _detailModal, new Modal());
  }
  updateModalContent({ data, onClickStar, onDelete }) {
    const $restaurantItem = createRestaurantItem({ data, onClickStar, detail: true });
    $restaurantItem.classList.add("restaurant__column");
    const $buttonContainer = createSectionContainer("button-container");
    const $deleteButton = createButton({
      className: "button--secondary",
      textContent: "삭제하기",
      buttonType: "button",
      onClick: (event) => onDelete(event, data.id)
    });
    const $closeButton = createButton({
      className: "button--primary",
      textContent: "닫기",
      onClick: () => __privateGet(this, _detailModal).toggle()
    });
    $buttonContainer.append($deleteButton, $closeButton);
    const fragment = new DocumentFragment();
    fragment.append($restaurantItem, $buttonContainer);
    __privateGet(this, _detailModal).appendModalContent(fragment);
  }
  get modal() {
    return __privateGet(this, _detailModal);
  }
}
_detailModal = new WeakMap();
const RestaurantValidator = {
  validate(restaurantInput) {
    if (!restaurantInput.category || !restaurantInput.name || !restaurantInput.distance) {
      alert("카테고리, 이름, 거리 항목은 필수 입력입니다.");
      return false;
    }
    if (restaurantInput.name) {
      if (restaurantInput.name.length > 100) {
        alert("이름은 100자 이내로 작성해야 합니다.");
        return false;
      }
    }
    if (restaurantInput.link) {
      const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
      if (!urlRegex.test(restaurantInput.link)) {
        alert("올바른 url 형식을 입력해주세요.");
        return false;
      }
    }
    if (restaurantInput.description) {
      if (restaurantInput.description && restaurantInput.description.length > 300) {
        alert("설명은 300자 이내로 작성해야 합니다.");
        return false;
      }
    }
    return true;
  }
};
function createTextArea({ label, type, helpText = "", onChange }) {
  const textAreaDiv = createElement({ tag: "div", className: "form-item" });
  const textLabel = createElement({
    tag: "label",
    textContent: label,
    attributes: { for: `${type} text-caption` }
  });
  const textArea = createElement({
    tag: "textarea",
    attributes: {
      name: type,
      id: type,
      cols: "30",
      rows: "5"
    }
  });
  textArea.addEventListener("change", (event) => {
    onChange(event);
  });
  const helpTextSpan = createElement({
    tag: "span",
    className: "help-text text-caption",
    textContent: helpText
  });
  textAreaDiv.append(textLabel, textArea);
  if (helpText !== "") {
    textAreaDiv.appendChild(helpTextSpan);
  }
  return textAreaDiv;
}
function createInputBox({ label, isRequired, type, helpText = "", onChange }) {
  const inputBoxDiv = createElement({
    tag: "div",
    className: `form-item ${isRequired ? "form-item--required" : ""}`
  });
  const inputLabel = createElement({
    tag: "label",
    textContent: label,
    attributes: { for: `${type} text-caption` }
  });
  const input = createElement({
    tag: "input",
    attributes: {
      type: "text",
      name: type,
      id: type,
      required: isRequired
    }
  });
  const helpTextSpan = createElement({
    tag: "span",
    className: "help-text text-caption",
    textContent: helpText
  });
  inputBoxDiv.append(inputLabel, input);
  if (helpText !== "") {
    inputBoxDiv.appendChild(helpTextSpan);
  }
  input.addEventListener("change", (event) => {
    onChange(event);
  });
  return inputBoxDiv;
}
function createRestaurantEnrollForm({ restaurantInput, onEnroll, onCancel }) {
  const $enrollForm = createElement({ tag: "form" });
  const $categoryBox = createLabeldSelectBox({
    options: Object.values(CATEGORY),
    label: "카테고리",
    isRequired: true,
    type: "category",
    onChange: (event) => {
      restaurantInput.category = CATEGORY_KEY[event.target.value];
    }
  });
  const $nameInputBox = createInputBox({
    label: "이름",
    isRequired: true,
    type: "name",
    onChange: (event) => {
      restaurantInput.name = event.target.value;
    }
  });
  const $distanceBox = createLabeldSelectBox({
    options: DISTANCE_OPTIONS,
    label: "거리(도보 이동 시간)",
    isRequired: true,
    type: "distance",
    onChange: (event) => {
      restaurantInput.distance = event.target.value;
    }
  });
  const $descriptionTextArea = createTextArea({
    label: "설명",
    type: "description",
    helpText: "메뉴 등 추가 정보를 입력해 주세요.",
    onChange: (event) => {
      restaurantInput.description = event.target.value;
    }
  });
  const $linkInputBox = createInputBox({
    label: "참고 링크",
    isRequired: false,
    type: "link",
    helpText: "매장 정보를 확인할 수 있는 링크를 입력해 주세요.",
    onChange: (event) => {
      restaurantInput.link = event.target.value;
    }
  });
  const $buttonContainer = createSectionContainer("button-container");
  const $cancelButton = createButton({
    className: "button--secondary",
    textContent: "취소하기",
    buttonType: "button",
    onClick: onCancel
  });
  const $enrollButton = createButton({
    className: "button--primary",
    textContent: "등록하기",
    onClick: (event) => {
      event.preventDefault();
      onEnroll(event);
    }
  });
  $buttonContainer.append($cancelButton, $enrollButton);
  $enrollForm.append(
    $categoryBox,
    $nameInputBox,
    $distanceBox,
    $descriptionTextArea,
    $linkInputBox,
    $buttonContainer
  );
  return $enrollForm;
}
class RestaurantEnrollModal {
  constructor(onAdd) {
    __privateAdd(this, _restaurantInput);
    __privateAdd(this, _enrollModal);
    __privateAdd(this, _onAdd);
    __privateSet(this, _restaurantInput, {
      name: null,
      category: null,
      distance: null,
      description: null,
      link: null
    });
    __privateSet(this, _enrollModal, new Modal(this.handleClose));
    this.initModalContent();
    __privateSet(this, _onAdd, onAdd);
  }
  initModalContent() {
    const $modalTitle = createElement({
      tag: "h2",
      className: "modal-title text-title",
      textContent: "새로운 음식점"
    });
    const $enrollForm = createRestaurantEnrollForm({
      restaurantInput: __privateGet(this, _restaurantInput),
      onEnroll: (event) => this.handleSubmit(event),
      onCancel: () => this.handleCancel()
    });
    const fragment = new DocumentFragment();
    fragment.append($modalTitle, $enrollForm);
    __privateGet(this, _enrollModal).appendModalContent(fragment);
  }
  handleSubmit() {
    const isValidate = RestaurantValidator.validate(__privateGet(this, _restaurantInput));
    if (!isValidate) return;
    __privateGet(this, _restaurantInput).id = Date.now();
    __privateGet(this, _onAdd).call(this, __privateGet(this, _restaurantInput));
  }
  handleCancel() {
    __privateGet(this, _enrollModal).toggle();
  }
  handleClose() {
    document.querySelector("select#category").value = "";
    document.querySelector("input#name").value = "";
    document.querySelector("select#distance").value = "";
    document.querySelector("textarea#description").value = "";
    document.querySelector("input#link").value = "";
  }
  get modal() {
    return __privateGet(this, _enrollModal);
  }
}
_restaurantInput = new WeakMap();
_enrollModal = new WeakMap();
_onAdd = new WeakMap();
class ModalService {
  constructor(onAddRestaurant) {
    __privateAdd(this, _enrollModal2, null);
    __privateAdd(this, _detailModal2, null);
    __privateSet(this, _enrollModal2, new RestaurantEnrollModal(onAddRestaurant));
    __privateSet(this, _detailModal2, new RestaurantDetailModal());
  }
  appendModal() {
    const $main = document.getElementsByTagName("main")[0];
    $main.append(__privateGet(this, _enrollModal2).modal.getElement(), __privateGet(this, _detailModal2).modal.getElement());
  }
  toggleModal(type) {
    if (type === MODAL_TYPE.DETAIL) {
      __privateGet(this, _detailModal2).modal.toggle();
    } else if (type === MODAL_TYPE.ENROLL) {
      __privateGet(this, _enrollModal2).modal.toggle();
    }
  }
  updateModalContent({ data, onClickStar, onDelete }) {
    __privateGet(this, _detailModal2).updateModalContent({
      data,
      onClickStar,
      onDelete
    });
  }
}
_enrollModal2 = new WeakMap();
_detailModal2 = new WeakMap();
class RestaurantList {
  constructor(initialDatas = []) {
    __privateAdd(this, _restaurants, []);
    initialDatas.forEach((data) => __privateGet(this, _restaurants).push(data));
  }
  getOrderedRestaurantList(order) {
    if (order === ORDER.NAME) {
      return [...__privateGet(this, _restaurants)].sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));
    } else if (order === ORDER.DISTANCE) {
      return [...__privateGet(this, _restaurants)].sort((a, b) => a.distance - b.distance);
    }
    return [...__privateGet(this, _restaurants)];
  }
  filterFavorite() {
    return [...__privateGet(this, _restaurants)].filter((data) => data.isFavorite);
  }
  toggleFavorite({ id, tab, category, order }) {
    __privateSet(this, _restaurants, [...__privateGet(this, _restaurants)].map((data) => {
      if (data.id === id) {
        return {
          ...data,
          isFavorite: !data.isFavorite
        };
      }
      return data;
    }));
    return this.sortByOptions({ tab, order, category });
  }
  deleteRestaurant({ id, tab, order, category }) {
    __privateSet(this, _restaurants, __privateGet(this, _restaurants).filter((data) => data.id !== id));
    return this.sortByOptions({ tab, order, category });
  }
  addRestaurant({ data, tab, order, category }) {
    __privateGet(this, _restaurants).push(data);
    return this.sortByOptions({ tab, order, category });
  }
  sortByOptions({ tab, order, category }) {
    if (tab === TAB.ALL) {
      return {
        originalList: __privateGet(this, _restaurants),
        filteredList: this.filterRestaurant(category, order)
      };
    } else if (tab === TAB.FAVORITE) {
      return {
        originalList: __privateGet(this, _restaurants),
        filteredList: this.filterFavorite()
      };
    }
    return {
      originalList: __privateGet(this, _restaurants),
      filteredList: __privateGet(this, _restaurants)
    };
  }
  filterRestaurant(category, order) {
    let filteredRestaurants;
    if (category === "전체") {
      filteredRestaurants = [...__privateGet(this, _restaurants)];
    } else {
      filteredRestaurants = __privateGet(this, _restaurants).filter(
        (data) => data.category === CATEGORY_KEY[category]
      );
    }
    if (order === ORDER.NAME) {
      filteredRestaurants.sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));
    } else if (order === ORDER.DISTANCE) {
      filteredRestaurants.sort((a, b) => a.distance - b.distance);
    }
    return filteredRestaurants;
  }
}
_restaurants = new WeakMap();
const RESTAURANT_DATA = [
  {
    id: 1,
    category: "korean",
    name: "피양콩할마니",
    distance: 10,
    isFavorite: false,
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, '피양'은 평안도 사투리로 '평양'을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다."
  },
  {
    id: 2,
    category: "chinese",
    name: "친친",
    distance: 5,
    isFavorite: true,
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다"
  },
  {
    id: 3,
    category: "japanese",
    name: "잇쇼우",
    distance: 10,
    isFavorite: false,
    description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다. 기술은 정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다하는 잇쇼우는 고객 한분 한분께 최선을 다하겠습니다"
  },
  {
    id: 4,
    category: "western",
    name: "이태리키친",
    distance: 20,
    isFavorite: true,
    description: "늘 변화를 추구하는 이태리키친입니다."
  },
  {
    id: 5,
    category: "asian",
    name: "호아빈 삼성점",
    distance: 15,
    isFavorite: false,
    description: "푸짐한 양에 국물이 일품인 쌀국수"
  },
  {
    id: 6,
    category: "etc",
    name: "도스타코스 선릉점",
    distance: 5,
    isFavorite: false,
    description: "멕시칸 캐주얼 그릴"
  },
  {
    id: 7,
    category: "asian",
    name: "호아빈 선릉점",
    distance: 20,
    isFavorite: true,
    description: "푸짐한 양에 국물이 일품인 쌀국수"
  },
  {
    id: 8,
    category: "asian",
    name: "호아빈 강남점",
    distance: 30,
    isFavorite: false,
    description: "푸짐한 양에 국물이 일품인 쌀국수"
  }
];
class RestaurantStorage {
  constructor() {
    __privateAdd(this, _RestaurantStorage_instances);
    __privateAdd(this, _key);
    __privateAdd(this, _restaurants2);
    __privateSet(this, _key, LOCAL_STORAGE_KEY);
    __privateSet(this, _restaurants2, __privateMethod(this, _RestaurantStorage_instances, loadData_fn).call(this));
  }
  getAllRestaurants() {
    return [...__privateGet(this, _restaurants2)];
  }
  saveToStorage(data) {
    localStorage.setItem(__privateGet(this, _key), JSON.stringify(data));
  }
  updateStorage(data) {
    __privateSet(this, _restaurants2, [...data]);
    localStorage.setItem(__privateGet(this, _key), JSON.stringify(data));
  }
}
_key = new WeakMap();
_restaurants2 = new WeakMap();
_RestaurantStorage_instances = new WeakSet();
loadData_fn = function() {
  const data = localStorage.getItem(__privateGet(this, _key));
  const dataList = data ? JSON.parse(data) : RESTAURANT_DATA;
  this.saveToStorage(dataList);
  return dataList;
};
class RestaurantService {
  constructor() {
    __privateAdd(this, _restaurantList);
    __privateAdd(this, _restaurantStorage);
    __privateSet(this, _restaurantStorage, new RestaurantStorage());
    __privateSet(this, _restaurantList, new RestaurantList(__privateGet(this, _restaurantStorage).getAllRestaurants()));
  }
  getOrderedRestaurants(order) {
    return __privateGet(this, _restaurantList).getOrderedRestaurantList(order);
  }
  getFilteredRestaurants(category, order) {
    return __privateGet(this, _restaurantList).filterRestaurant(category, order);
  }
  getFavoriteRestaurants() {
    return __privateGet(this, _restaurantList).filterFavorite();
  }
  toggleFavorite({ id, tab, category, order }) {
    const result = __privateGet(this, _restaurantList).toggleFavorite({
      id,
      tab,
      category,
      order
    });
    __privateGet(this, _restaurantStorage).updateStorage(result.originalList);
    return result;
  }
  addRestaurant({ data, tab, category, order }) {
    const result = __privateGet(this, _restaurantList).addRestaurant({
      data,
      tab,
      order,
      category
    });
    __privateGet(this, _restaurantStorage).updateStorage(result.originalList);
    return result;
  }
  deleteRestaurant({ id, tab, category, order }) {
    const result = __privateGet(this, _restaurantList).deleteRestaurant({
      id,
      tab,
      order,
      category
    });
    __privateGet(this, _restaurantStorage).updateStorage(result.originalList);
    return result;
  }
}
_restaurantList = new WeakMap();
_restaurantStorage = new WeakMap();
class RestaurantController {
  constructor() {
    __privateAdd(this, _RestaurantController_instances);
    __privateAdd(this, _restaurantService, null);
    __privateAdd(this, _modalService, null);
    __privateAdd(this, _main, document.getElementsByTagName("main")[0]);
    __privateAdd(this, _state, {
      category: CATEGORY.ALL,
      order: ORDER.NAME,
      tab: TAB.ALL
    });
    __privateAdd(this, _handleClickStar, (event, id) => {
      __privateMethod(this, _RestaurantController_instances, updateRestaurantUI_fn).call(this, __privateGet(this, _restaurantService).toggleFavorite({
        id,
        tab: __privateGet(this, _state).tab,
        category: __privateGet(this, _state).category,
        order: __privateGet(this, _state).order
      }).filteredList);
      event.target.classList.toggle("restaurant__star--clicked");
    });
    __privateAdd(this, _handleChangeCategory, (event) => {
      __privateMethod(this, _RestaurantController_instances, changeState_fn).call(this, STATE_KEY.CATEGORY, event.target.value);
      __privateMethod(this, _RestaurantController_instances, updateRestaurantUI_fn).call(this, __privateGet(this, _restaurantService).getFilteredRestaurants(__privateGet(this, _state).category, __privateGet(this, _state).order));
    });
    __privateAdd(this, _handleChangeFilter, (event) => {
      __privateMethod(this, _RestaurantController_instances, changeState_fn).call(this, STATE_KEY.ORDER, event.target.value);
      __privateMethod(this, _RestaurantController_instances, updateRestaurantUI_fn).call(this, __privateGet(this, _restaurantService).getFilteredRestaurants(__privateGet(this, _state).category, __privateGet(this, _state).order));
    });
    __privateAdd(this, _handleTabBar, (event) => {
      document.querySelector(".restaurant-filter-container").classList.toggle("hidden");
      if (event.target.id === TAB.FAVORITE) {
        __privateMethod(this, _RestaurantController_instances, changeState_fn).call(this, STATE_KEY.TAB, TAB.FAVORITE);
        __privateMethod(this, _RestaurantController_instances, updateRestaurantUI_fn).call(this, __privateGet(this, _restaurantService).getFavoriteRestaurants());
      } else if (event.target.id === TAB.ALL) {
        __privateMethod(this, _RestaurantController_instances, initialOptionState_fn).call(this);
        __privateMethod(this, _RestaurantController_instances, changeState_fn).call(this, STATE_KEY.TAB, TAB.ALL);
        __privateMethod(this, _RestaurantController_instances, updateRestaurantUI_fn).call(this, __privateGet(this, _restaurantService).getOrderedRestaurants(__privateGet(this, _state).order));
      }
    });
    __privateAdd(this, _handleDelete, (event, id) => {
      if (window.confirm("해당 음식점을 삭제하시겠습니까?")) {
        __privateMethod(this, _RestaurantController_instances, updateRestaurantUI_fn).call(this, __privateGet(this, _restaurantService).deleteRestaurant({
          id,
          tab: __privateGet(this, _state).tab,
          order: __privateGet(this, _state).order,
          category: __privateGet(this, _state).category
        }).filteredList);
        __privateGet(this, _modalService).toggleModal(MODAL_TYPE.DETAIL);
        window.alert("삭제되었습니다.");
      }
    });
    __privateAdd(this, _handleClickItem, (event, data) => {
      __privateGet(this, _modalService).updateModalContent({
        data,
        onClickStar: __privateGet(this, _handleClickStar),
        onDelete: __privateGet(this, _handleDelete)
      });
      __privateGet(this, _modalService).toggleModal(MODAL_TYPE.DETAIL);
    });
    __privateAdd(this, _handleAddRestaurant, (data) => {
      if (window.confirm("해당 음식점을 추가하시겠습니까?")) {
        addRestaurantList({
          data,
          onClickItem: __privateGet(this, _handleClickItem),
          onClickStar: __privateGet(this, _handleClickStar)
        });
        __privateMethod(this, _RestaurantController_instances, updateRestaurantUI_fn).call(this, __privateGet(this, _restaurantService).addRestaurant({
          data,
          tab: __privateGet(this, _state).tab,
          order: __privateGet(this, _state).order,
          category: __privateGet(this, _state).category
        }).filteredList);
        __privateGet(this, _modalService).toggleModal(MODAL_TYPE.ENROLL);
        window.alert("추가되었습니다.");
      }
    });
    __privateSet(this, _restaurantService, new RestaurantService());
    __privateSet(this, _modalService, new ModalService(__privateGet(this, _handleAddRestaurant)));
  }
  start() {
    __privateMethod(this, _RestaurantController_instances, initializeUI_fn).call(this);
    __privateGet(this, _modalService).appendModal();
    document.querySelector(".gnb__button").addEventListener("click", () => {
      __privateGet(this, _modalService).toggleModal(MODAL_TYPE.ENROLL);
    });
  }
}
_restaurantService = new WeakMap();
_modalService = new WeakMap();
_main = new WeakMap();
_state = new WeakMap();
_RestaurantController_instances = new WeakSet();
initializeUI_fn = function() {
  const $tabBar = createTabBar(__privateGet(this, _handleTabBar));
  const $filterContainer = createSectionContainer("restaurant-filter-container");
  $filterContainer.appendChild(
    createFilterGroup(__privateGet(this, _handleChangeCategory), __privateGet(this, _handleChangeFilter))
  );
  const $listContainer = createSectionContainer("restaurant-list-container");
  $listContainer.appendChild(
    createRestaurantList({
      datas: __privateGet(this, _restaurantService).getOrderedRestaurants(__privateGet(this, _state).order),
      onClickItem: __privateGet(this, _handleClickItem),
      onClickStar: __privateGet(this, _handleClickStar)
    })
  );
  __privateGet(this, _main).append($tabBar, $filterContainer, $listContainer);
};
_handleClickStar = new WeakMap();
_handleChangeCategory = new WeakMap();
_handleChangeFilter = new WeakMap();
_handleTabBar = new WeakMap();
_handleDelete = new WeakMap();
_handleClickItem = new WeakMap();
_handleAddRestaurant = new WeakMap();
updateRestaurantUI_fn = function(restaurantList) {
  const $restaurants = updateRestaurantList({
    datas: restaurantList,
    onClickItem: __privateGet(this, _handleClickItem),
    onClickStar: __privateGet(this, _handleClickStar)
  });
  __privateGet(this, _main).appendChild($restaurants);
};
changeState_fn = function(field, value) {
  __privateGet(this, _state)[field] = value;
};
initialOptionState_fn = function() {
  document.querySelector("select#category-filter").value = CATEGORY.ALL;
  document.querySelector("select#sorting-filter").value = ORDER.NAME;
  __privateMethod(this, _RestaurantController_instances, changeState_fn).call(this, STATE_KEY.CATEGORY, CATEGORY.ALL);
  __privateMethod(this, _RestaurantController_instances, changeState_fn).call(this, STATE_KEY.ORDER, ORDER.NAME);
};
new RestaurantController().start();
