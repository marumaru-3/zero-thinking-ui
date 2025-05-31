<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router'

const dateFunc = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m =
    now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
  const d = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  return y + "-" + m + "-" + d;
}
const date = ref(dateFunc())

</script>
<template>
  <div class="about-wrapper">
    <div class="w-1000">
      <div class="logo-title">
        <img class="logo" src="../assets/icon/zero-thinking-icon.png" alt="">
        <h1>
          0秒思考メモで考えごとをアウトプットしよう！
        </h1>
      </div>
      <div class="about-question">
        <h2>0秒思考とは？</h2>
        <p>「A4の紙に“1枚1分”」でメモ書きをすることにより、即断力を高め、思考の質とスピードを上げるメソッドです。</p>
      </div>
      <div class="memo-content about">
        <div class="memo-head">
          <p class="memo-title">
            <span class="title-text">0秒思考メモアプリで出来ること</span>
            <span class="title-border"></span>
          </p>
          <p class="memo-date">{{ date }}</p>
        </div>
        <ul class="memo-list">
          <li>
            <span class="pointer">－</span>パソコンやスマホがあればお手軽に0秒思考メモが出来る
          </li>
          <li>
            <span class="pointer">－</span>どこでも気軽に書いた内容を見返せる
          </li>
          <li>
            <span class="pointer">－</span>日付ごとにメモが分けられているため管理がしやすい
          </li>
          <li>
            <span class="pointer">－</span>直感的な操作でメモ書きができる
          </li>
        </ul>
      </div>
      <p class="button-group-title">今すぐ始めましょう！</p>
      <div class="button-gorup">
        <RouterLink to="/login">
          <button class="login">ログインする</button>
        </RouterLink>
        <RouterLink to="/register">
          <button class="new-account">アカウントを作成</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .about-wrapper {
    text-align: center;
  }
  .logo-title {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin:40px 0;
  }
  .about-wrapper .logo {
    width: 64px;
    height: 64px;
  }
  .about-question {
    margin-bottom: 40px;
  }
  .about-question h2 {
    font-size: 28px;
    margin-bottom: 10px;
  }
  .about-question p {
    font-size: 18px;
  }
  .memo-content.about {
    max-width: 650px;
    width: 100%;
    margin:0 auto 60px;
    padding: 25px 30px 30px;
    cursor: auto;
  }
  .memo-content.about:hover {
    box-shadow: none;
  }
  .memo-content.about .memo-head {
    margin-bottom: 5px;
  }
  .memo-content.about .memo-title {
    max-width: 350px;
    width: 62%;
  }
  .memo-content.about .title-text {
    font-size: 18px;
    font-weight: bold;
    display: inline-block;
    padding: 0 10px;
  }
  .memo-content.about .title-border {
    display: block;
    border-bottom: 2px solid #000;
    padding-top: 5px;
    width: 100%;
  }
  .memo-content.about .memo-date {
    font-size: 18px;
    margin-top: 5px;
    font-weight: bold;
  }
  .memo-content.about .memo-list li {
    font-size: 16px;
    margin-bottom: 12px;
  }
  .button-group-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 40px;
  }
  .button-gorup {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 100px;
  }
  .button-gorup a {
    width: 50%;
    max-width: 300px;
  }
  .button-gorup .login,
  .button-gorup .new-account {
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
  .button-gorup .new-account {
    background: #fff;
    color: #000;
  }

  @media (max-width: 899px) {
    .logo-title {
      flex-direction: column;
    }
  }
  @media (max-width: 699px) {
    .logo-title h1 {
      font-size: 28px;
    }
    .about-question h2 {
      font-size: 24px;
    }
    .about-question p {
      font-size: 16px;
    }
    .memo-content.about {
      padding: 15px 20px 20px;
    }
    .memo-content.about .memo-date {
      font-size: 16px;
    }
    .button-gorup {
      flex-direction: column;
      align-items: center;
    }
    .button-gorup a {
      width: 100%;
      max-width: none;
    }
  }

</style>