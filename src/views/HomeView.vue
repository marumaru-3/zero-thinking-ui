<script setup>
import { useApi } from "@/composables/useApi";
import { onMounted, ref, nextTick } from "vue";
import { RouterLink, useRouter } from "vue-router";

const { getData, postData, deleteData } = useApi();

const clickId = ref("");
const deleteId = ref("");
const modalWindow = ref("");

const dateResult = ref("");
const listObj = ref([]);
const dateDevideArr = ref([]);

const router = useRouter();

const memoContent = ref("");

// メモを削除
const deleteMenuCss = ref(null);

// メモ一覧取得
const getMemos = async () => {
  const res = await getData(
    "/api/papers",
    "メモの取得に失敗しました。再度お試しください。"
  );
  const resData = res.data;

  listObj.value = [];
  dateDevideArr.value = [];

  listObj.value = resData.map((data) => {
    return {
      id: data.id,
      title: data.title,
      body_list: data.body_list,
      date: data.date,
    };
  });

  // 日付分け用
  dateResult.value = deleteElement(listObj.value.map((obj) => obj.date));
  dateListDevide();
};

// メモを削除する関数
const deleteMemo = async (id) => {
  modalWindow.value = "delete";
  deleteId.value = id;
  const res = await deleteData(
    `/api/papers/${id}`,
    "メモの削除に失敗しました。再度お試しください。"
  );

  console.log(res);

  listObj.value = listObj.value.filter((obj) => obj.id !== deleteId.value);

  // 日付ごとに分けたメモ配列を更新
  dateDevideArr.value = [];
  dateResult.value = deleteElement(listObj.value.map((obj) => obj.date));
  dateListDevide();

  nextTick(() => {
    dateResult.value.forEach((v, i) => {
      magicGridFunc(i);
    });
  });

  deleteMenuCss.value = null;
};
// 削除するボタンモーダル
const deleteMenuOpen = (id, event) => {
  const mainY = document.querySelector("main").getBoundingClientRect().top;
  const clickBtnTop = event.srcElement.getBoundingClientRect().top;
  const clickBtnLeft = event.srcElement.getBoundingClientRect().left;

  const windowWidth = document.documentElement.clientWidth;

  deleteMenuCss.value = {
    opacity: 1,
    display: "block",
    top: clickBtnTop - mainY + 50 + "px",
    left: 0,
  };
  // 削除するボタンが見切れそうな場合
  if (clickBtnLeft + 200 > windowWidth) {
    deleteMenuCss.value.left = clickBtnLeft - 140 + "px";
  } else {
    deleteMenuCss.value.left = clickBtnLeft + "px";
  }
  // 削除するメモを指定
  clickId.value = id;
};
const deleteMenuClose = () => {
  deleteMenuCss.value = null;
};

// メモモーダル
const modalOpen = (id) => {
  modalWindow.value = "open";

  clickId.value = id;

  // モーダルメモの中身を更新
  memoContent.value = listObj.value.filter(
    (obj) => obj.id === clickId.value
  )[0];
};
const modalClose = () => {
  modalWindow.value = "";
  deleteMenuClose();
};

// メモ入力した日付データの被ってる日付を取り除いて配列にする関数
const deleteElement = (arr) => {
  return arr.filter((value, index) => index === arr.indexOf(value));
};

const dateListDevide = () => {
  dateResult.value.forEach((date) => {
    dateDevideArr.value.push(listObj.value.filter((obj) => obj.date === date));
  });
};

const magicGridFunc = (i) => {
  const magicGrid = new MagicGrid({
    container: `.memo-group${i}`,
    animate: true,
    gutter: 10,
    static: true,
    useMin: true,
    maxColumns: 5,
  });
  magicGrid.listen();
};

// ログアウト用
const handleSignOut = async () => {
  const res = await postData(
    "/api/logout",
    {},
    "ログアウトに失敗しました。再度お試しください。"
  );
  console.log(res);
  localStorage.removeItem("token");
  router.push("/about");
};

onMounted(async () => {
  await getMemos();
  dateResult.value.forEach((v, i) => {
    magicGridFunc(i);
  });

  // 削除モーダルの外をクリックしたら閉じる
  document.addEventListener("click", (e) => {
    if (deleteMenuCss.value) {
      //.delete-menu以外をクリックしたとき
      if (!e.target.closest(".delete-menu")) {
        deleteMenuClose();
      }
    }
  });
});
</script>

<template>
  <header>
    <div class="header-container">
      <h1><RouterLink to="/" class="memo-contents">0秒思考メモ</RouterLink></h1>
      <button @click="handleSignOut">ログアウト</button>
    </div>
  </header>
  <main id="app">
    <div class="left-contents"></div>
    <div class="main-contents"></div>
    <div class="memo-start">
      <RouterLink to="/memo" id="start">0秒思考メモを始める</RouterLink>
    </div>
    <p class="memo-list-ex" v-if="!dateResult.length">
      ここに保存した0秒思考メモが<span class="in-bl">掲載されます。</span>
    </p>
    <div class="memo-date-list" v-for="(date, asd) in dateResult">
      <h3 class="dateTitle">{{ date }}</h3>
      <div :class="`memo-group${asd}`">
        <div v-for="memo in dateDevideArr[asd]">
          <div
            class="memo-content"
            :class="{
              select: memo.id === clickId,
              delete: memo.id === deleteId,
            }"
            :data-index="memo.id"
            @click="modalOpen(memo.id, $event)"
          >
            <div class="check">
              <img src="../assets/icon/check.svg" alt="" />
            </div>
            <div class="memo-inner">
              <p class="memo-title">{{ memo.title }}</p>
              <ul class="memo-list">
                <li v-for="list in memo.body_list">
                  <span class="pointer">－</span>{{ list }}
                </li>
              </ul>
            </div>
            <div class="memo-btn">
              <button
                class="delete"
                @click.stop="deleteMenuOpen(memo.id, $event)"
              >
                <img src="../assets/icon/trashbox.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- モーダル -->
    <div class="modal-bg" :class="modalWindow" @click="modalClose">
      <div class="modal" :data-index="clickId">
        <div class="modal-content" @click.stop="deleteMenuClose">
          <div class="modal-memo">
            <div class="memo-head">
              <p class="memo-title">
                <span class="title-text">{{ memoContent.title }}</span>
                <span class="title-border"></span>
              </p>
              <p class="memo-date">{{ memoContent.date }}</p>
            </div>
            <ul class="memo-list">
              <li v-for="list in memoContent.body_list">
                <span class="pointer">－</span>{{ list }}
              </li>
            </ul>
          </div>
          <div class="memo-btn">
            <button
              class="delete"
              @click.stop="deleteMenuOpen(clickId, $event)"
            >
              <img src="../assets/icon/trashbox.svg" alt="" />
            </button>
            <button class="close" @click.stop="modalClose">閉じる</button>
          </div>
        </div>
      </div>
    </div>
    <!-- メモ削除モーダル -->
    <div class="delete-menu" :style="deleteMenuCss">
      <p @click="deleteMemo(clickId)">メモを削除</p>
    </div>
  </main>
</template>
