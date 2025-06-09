<script setup>
import { useApi } from "@/composables/useApi";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { postData } = useApi();

const email = ref("");
const password = ref("");
const passwordConfirm = ref("");

const router = useRouter();

// パスワードの表示・非表示
const showPassword = ref(false);
const showConfirm = ref(false);

// アカウントを作成出来なかったときのメッセージ
const noRegisterMessage = ref("");

// 次のフォーム(パスワード)にフォーカスを当てる
const nextFocus = () => {
  const active = document.activeElement;

  if (active.id === "email") {
    document.querySelector("#password").focus();
  } else if (active.id === "password") {
    document.querySelector("#passwordConfirm").focus();
  }
};

// ユーザー登録処理
const createAccount = async () => {
  // メールアドレスとパスワードが入力されているかを確認
  if (email.value == "" || password.value == "" || passwordConfirm.value == "")
    return;

  try {
    const res = await postData(
      "/api/register",
      {
        email: email.value,
        password: password.value,
        password_confirmation: passwordConfirm.value,
      },
      "",
      false
    );

    const token = res.token;
    localStorage.setItem("token", token);

    const user = await getUser();
    console.log(user);

    router.push("/");
  } catch (error) {
    const emailErrors = error.response?.data?.errors?.email || [];
    const passwordErrors = error.response?.data?.errors?.password || [];

    if (emailErrors.some((msg) => msg.includes("taken"))) {
      noRegisterMessage.value = "このメールアドレスはすでに使用されています。";
    } else if (emailErrors.some((msg) => msg.includes("valid email address"))) {
      noRegisterMessage.value = "メールアドレスが無効です。";
    } else if (
      passwordErrors.some((msg) => msg.includes("least 8 characters"))
    ) {
      noRegisterMessage.value = "パスワードは8文字以上に設定してください。";
    } else if (passwordErrors.some((msg) => msg.includes("confirmation"))) {
      noRegisterMessage.value = "パスワード確認が異なっています。";
    } else {
      noRegisterMessage.value = "メールアドレスもしくはパスワードが無効です。";
    }
  }
};
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
            <input
              id="email"
              type="email"
              v-model="email"
              name="email"
              @keydown.enter="nextFocus"
            />
          </div>
          <div>
            <label for="password">パスワード</label>
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              name="password"
              @keydown.enter="nextFocus"
            />
            <button class="passView" @click="showPassword = !showPassword">
              パスワードを{{ showPassword ? "非表示に" : "表示" }}する
            </button>
          </div>
          <div>
            <label for="passwordConfirm">パスワード確認</label>
            <input
              id="passwordConfirm"
              :type="showConfirm ? 'text' : 'password'"
              v-model="passwordConfirm"
              name="password_confirmation"
              @keydown.enter="createAccount"
            />
            <button class="passView" @click="showConfirm = !showConfirm">
              パスワードを{{ showConfirm ? "非表示に" : "表示" }}する
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
  padding: 0 60px;
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
