<script setup>
import { useApi } from "@/composables/useApi";
import { getUser } from "@/libs/auth";
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const { postData } = useApi();

const userData = ref({});

const router = useRouter();

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
  font-size: 30px;
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

@media (max-width: 699px) {
  .center-card {
    padding: 20px 20px 32px;
  }
  .center-card h1 {
    font-size: 20px;
  }
}
</style>
