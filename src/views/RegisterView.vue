<script setup>
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref("");
const password = ref("");

const router = useRouter()

// パスワードの表示・非表示
const show = ref(false)

// アカウントを作成出来なかったときのメッセージ
const noRegisterMessage = ref("")

// 次のフォーム(パスワード)にフォーカスを当てる
const nextFocus = () => {
    document.querySelector('#password').focus();
}

// サインアップ処理
const createAccount = () => {
  // メールアドレスとパスワードが入力されているかを確認
  if (email.value == "" || password.value == "") return;
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    // 成功時処理
    const user = userCredential.user;
    // console.log(user);
    // ログイン画面にリダイレクト
    router.push("login");
  })
  .catch((error) => {
    // 失敗時処理
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // console.log(errorCode, errorMessage);


    if (error.code === 'auth/email-already-in-use') {
      noRegisterMessage.value = 'このメールアドレスはすでに使用されています。'
    } else if (error.code === 'auth/weak-password') {
      noRegisterMessage.value = 'パスワードは6文字以上に設定してください。'
    }else if (error.code === 'auth/invalid-email') {
      noRegisterMessage.value = 'メールアドレスが無効です。'
    }else {
      noRegisterMessage.value = 'メールアドレスもしくはパスワードが無効です。'
    }

  });
}
</script>

<template>
  <div class="register-wrap">
    <div class="center-card">
      <h1>アカウントを作成</h1>
      <div class="form-content">
        <div class="form-group">
          <p class="no-register-message">{{ noRegisterMessage }}</p>
          <div>
            <label for="email">メールアドレス</label>
            <input type="email" v-model="email" name="email" @keydown.enter="nextFocus">
          </div>
          <div>
            <label for="password">パスワード</label>
            <input id="password" :type="show ? 'text' : 'password'" v-model="password" name="password" @keydown.enter="createAccount">
            <button class="passView" @click="show = !show">
              パスワードを{{ show ? '非表示に' : '表示' }}する
            </button>
          </div>
        </div>
        <button class="register" @click="createAccount">登録</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .register-wrap {
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
  .center-card .register {
    background: #000;
    border-radius: 30px;
    color: #fff;
    display: inline-block;
    font-weight: bold;
    font-size: 20px;
    width: 100%;
    height: 50px;
  }
  .no-register-message {
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
    .center-card .register {
      font-size: 18px;
    }
  }
</style>