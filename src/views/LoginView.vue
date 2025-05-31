<script setup>
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref("");
const password = ref("");
// ログインしているユーザーデータ
const currentUser = ref("")

const router = useRouter()

// パスワードの表示・非表示
const show = ref(false)

// ログイン出来なかったときのメッセージ
const noLoginMessage = ref("")

// 次のフォーム(パスワード)にフォーカスを当てる
const nextFocus = () => {
    document.querySelector('#password').focus();
}

// サインイン処理
const signIn = () => {
  // メールアドレスとパスワードが入力されているかを確認
  if (email.value == "" || password.value == "") return;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // 成功時処理
      const user = userCredential.user;
      // console.log(user);
      // ホーム画面にリダイレクト
      router.push("/");
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      noLoginMessage.value = 'メールアドレスもしくはパスワードが違います。'
    });
}

onMounted(() => {
  const auth = getAuth();
  // ログインしているユーザーを取得する
  onAuthStateChanged(auth, (user) => {
    if (user != null) {
      currentUser.value = user;
    } else {
      currentUser.value = null;
    }
  });
})
</script>

<template>
  <div class="login-wrap">
    <div class="center-card">
      <h1>0秒思考メモアプリにログイン</h1>
      <div class="form-content">
        <div class="form-group">
          <p class="no-login-message">{{ noLoginMessage }}</p>
          <div>
            <label for="email">メールアドレス</label>
            <input type="email" v-model="email" name="email" @keydown.enter="nextFocus">
          </div>
          <div>
            <label for="password">パスワード</label>
            <input id="password" :type="show ? 'text' : 'password'" v-model="password" name="password" @keydown.enter="signIn">
            <button class="passView" @click="show = !show">
              パスワードを{{ show ? '非表示に' : '表示' }}する
            </button>
          </div>
        </div>
        <div class="button-gorup">
          <button class="login" @click="signIn">ログイン</button>
          <RouterLink to="/register">
            <button class="new-account">アカウントを作成</button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .login-wrap {
    max-width: 600px;
    width: 90%;
    height: 100vh;
    margin: auto;
    display: flex;
    align-items: center;
  }
  .center-card {
    width: 100%;
    max-height: 650px;
    height: 90vh;
    border-radius: 16px;
    border: 1px solid #000;
    padding: 20px;
  }
  .center-card h1 {
    font-size: 30px;
    padding: 0 60px;
  }
  .form-content {
    margin-bottom: 20px;
    padding:0 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 85%;
  }
  .form-content div {
    margin: 20px 0;
  }
  .center-card label {
    display: block;
    margin-bottom: 5px;
  }
  .center-card input {
    height: 35px;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #000;
  }
  .passView {
    margin-top: 5px;
    color: #000;
    font-size: 14px;
  }
  .center-card .login, .center-card .new-account {
    background: #000;
    border-radius: 30px;
    border: 2px solid #000;
    color: #fff;
    display: inline-block;
    font-weight: bold;
    font-size: 20px;
    width: 100%;
    height: 50px;
  }
  .center-card .login {
    margin-bottom: 20px;
  }
  .center-card .new-account {
    background: #fff;
    color: #000;
  }
  .no-login-message {
    color: #f00;
    margin: 20px 0 30px;
  }

  @media (max-width: 699px) {
    .center-card {
      height: 70vh;
    }
    .center-card h1 {
      font-size: 20px;
      padding: 0;
    }
    .form-content {
      padding: 0;
    }
    .center-card .login {
      font-size: 18px;
    }
  }
</style>