<script setup>
import { useApi } from "@/composables/useApi";
import { getUser } from "@/libs/auth";
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const { postData, deleteData } = useApi();

const userData = ref({});
const modalWindow = ref("");

const router = useRouter();

// アカウント削除モーダル
const modalOpen = () => {
  modalWindow.value = "open";
};
const modalClose = () => {
  modalWindow.value = "";
};

// アカウントの削除
const deleteAccount = async () => {
  modalWindow.value = "delete";
  const res = await deleteData(
    `/api/user`,
    "アカウント削除に失敗しました。再度お試しください。"
  );
  console.log(res);
  localStorage.removeItem("token");
  router.push("/about");
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

// ホームリンク遷移
const handleHomeLink = () => {
  router.push("/");
};

onMounted(async () => {
  // ユーザー情報取得
  const user = await getUser();
  userData.value = user;
});
</script>

<template>
  <header>
    <div class="header-container">
      <h1><RouterLink to="/" class="memo-contents">0秒思考メモ</RouterLink></h1>
      <div class="header-buttons">
        <button @click="handleHomeLink">ホーム</button>
        <button @click="handleSignOut">ログアウト</button>
      </div>
    </div>
  </header>
  <main id="app">
    <div class="center-wrap">
      <div class="center-card">
        <h1>ユーザー情報</h1>
        <div class="info-group">
          <div class="info-item">
            <p class="info-item__label">メールアドレス</p>
            <p class="info-item__value">{{ userData.email }}</p>
          </div>
        </div>
        <div class="info-btns">
          <button class="info-btns__delete" @click="modalOpen()">
            アカウント削除
          </button>
        </div>
      </div>
    </div>

    <div class="modal-bg" :class="modalWindow" @click="modalClose">
      <div class="modal">
        <div class="modal-content" @click.stop>
          <div class="modal-user">
            <h3 class="modal-user__title">本当にアカウントを削除しますか？</h3>
            <p class="modal-user__value">
              削除をすると以下のデータが完全に削除されます。<br />
              ・アカウント情報<br />
              ・アカウントに付随するメモ記録
            </p>
          </div>
          <div class="user-btns">
            <button class="user-btns__close" @click.stop="modalClose">
              キャンセル
            </button>
            <button class="user-btns__delete" @click="deleteAccount">
              アカウントを削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.center-wrap {
  max-width: 600px;
  width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
}
.center-card {
  width: 100%;
  max-height: 650px;
  border-radius: 16px;
  border: 1px solid #000;
  padding: 20px 80px 32px;
}
.center-card h1 {
  font-size: 24px;
  margin-bottom: 32px;
}
.info-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.info-item__label {
  font-weight: bold;
}
.info-btns {
  margin-top: 40px;
}
.info-btns__delete,
.user-btns__close,
.user-btns__delete {
  background: #fff;
  border-radius: 30px;
  border: 2px solid #f00;
  color: #f00;
  display: inline-block;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 24px;
}

.modal-content {
  padding: 32px;
}
.modal-user__title {
  margin-bottom: 32px;
}
.modal-user__value {
  margin-bottom: 48px;
}
.user-btns {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.user-btns__close {
  border-color: #333;
  color: #333;
}

@media (max-width: 699px) {
  .center-card {
    padding: 20px 20px 32px;
  }
  .center-card h1 {
    font-size: 20px;
  }
}
</style>
